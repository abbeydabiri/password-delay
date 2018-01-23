package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"bytes"
	"fmt"
	"html/template"

	"golang.org/x/crypto/bcrypt"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/justinas/alice"

	"litefinga/api"
	"litefinga/buckets"
	"litefinga/config"
	"litefinga/utils"
)

func apiHandlerWebsite(middlewares alice.Chain, router *Router) {

	router.Post("/api/login", middlewares.ThenFunc(apiWebsiteLogin))
	router.Post("/api/signup", middlewares.ThenFunc(apiWebsiteSignup))
	router.Post("/api/forgot", middlewares.ThenFunc(apiWebsiteForgot))
	router.Post("/api/contact", middlewares.ThenFunc(apiWebsiteContact))
}

func apiWebsiteContact(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	var formContact struct {
		Fullname, Company, Mobile, Email, Message, Ipaddress, Useragent string
	}

	statusMessage := ""
	statusCode := http.StatusInternalServerError

	err := json.NewDecoder(httpReq.Body).Decode(&formContact)
	if err != nil {
		statusMessage = "Error Decoding Form Values " + err.Error()
	} else {

		var messageBytes bytes.Buffer
		var emailTemplate *template.Template
		statusMessage, emailTemplate = utils.GetTemplate("email_contactus.html")
		if statusMessage == "" {
			if err := emailTemplate.Execute(&messageBytes, formContact); err != nil {
				statusMessage = "Error Generating Email Message " + err.Error()
			} else {
				emailStruct := utils.Email{}
				emailStruct.To = config.Get().Mailer.Username
				emailStruct.Subject = fmt.Sprintf("Contact Form Filled by: %s - %s", formContact.Fullname, formContact.Mobile)
				emailStruct.Message = messageBytes.String()

				statusCode = http.StatusOK
				statusMessage = "THANK YOU - Your message has been sent!"

				go utils.SendEmail(emailStruct, utils.SMTP{})

				statusMessageFeedback, emailTemplateFeedback := utils.GetTemplate("email_contactus_feedback.html")
				if statusMessageFeedback == "" {
					var messageBytesFeedback bytes.Buffer
					if err := emailTemplateFeedback.Execute(&messageBytesFeedback, formContact); err == nil {
						emailStructFeedback := utils.Email{}
						emailStructFeedback.To = formContact.Email
						emailStructFeedback.Subject = "You Filled our Contact Form"
						emailStructFeedback.Message = messageBytesFeedback.String()

						go utils.SendEmail(emailStructFeedback, utils.SMTP{})
					}
				}

			}
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Message: statusMessage,
	})
	// //Send E-Mail
}

func apiWebsiteLogin(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	var formStruct struct {
		Username,
		Password string
		CharSec map[string]uint64
	}

	statusBody := make(map[string]interface{})
	statusCode := http.StatusInternalServerError
	statusMessage := "Invalid Username or Password"

	err := json.NewDecoder(httpReq.Body).Decode(&formStruct)
	if err == nil {
		users, _ := buckets.Users{}.GetFieldValue("Username", formStruct.Username)

		if len(users) == 1 {
			lValid := true
			User := users[0]

			if User.DelayChar != "" {
				if formStruct.CharSec[User.DelayChar] != User.DelaySec {
					lValid = false
				}
			}

			if err := bcrypt.CompareHashAndPassword(User.Password, []byte(formStruct.Password)); err != nil {
				lValid = false
			}

			if !lValid {
				User.Failed++
				if User.FailedMax < User.Failed {
					User.Workflow = "failed-login"
				}
				User.Create(&User)
				return
			}
			//All Seems Clear, Validate User Password and Generate Token

			User.Failed = uint64(0)
			User.Create(&User)

			// set our claims
			jwtClaims := jwt.MapClaims{}
			jwtClaims["ID"] = User.ID
			jwtClaims["Fullname"] = User.Fullname
			jwtClaims["Username"] = User.Username
			jwtClaims["Email"] = User.Email
			jwtClaims["Mobile"] = User.Mobile

			statusBody["Redirect"] = "/dashboard"
			if User.IsAdmin {
				jwtClaims["IsAdmin"] = User.IsAdmin
				statusBody["Redirect"] = "/admin"
			}

			cookieExpires := time.Now().Add(time.Hour * 24 * 14) // set the expire time
			jwtClaims["exp"] = cookieExpires.Unix()

			if jwtToken, err := utils.GenerateJWT(jwtClaims); err == nil {
				cookieMonster := &http.Cookie{
					Name: config.Get().COOKIE, Value: jwtToken, Expires: cookieExpires, Path: "/",
				}
				http.SetCookie(httpRes, cookieMonster)
				httpReq.AddCookie(cookieMonster)

				statusCode = http.StatusOK
				statusMessage = "User Verified"
			}

			//All Seems Clear, Validate User Password and Generate Token
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Message: statusMessage,
		Body:    statusBody,
	})
}

func apiWebsiteForgot(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	statusCode := http.StatusOK
	formStruct := buckets.Users{}
	statusMessage := "If Email Exists a Password Reset Link will be sent"

	err := json.NewDecoder(httpReq.Body).Decode(&formStruct)
	if err == nil {
		users, err := buckets.Users{}.GetFieldValue("Email", formStruct.Email)
		if err == nil {
			if len(users) == 1 {
				//All Seems Clear, Generate Password Reset Activation Link and Mail User
				User := users[0]
				activationStruct := buckets.Activations{
					Type: "reset", Code: utils.RandomString(128),
					UserID: User.ID, Expirydate: time.Now().Add(+(time.Minute * 15)).Format(utils.TimeFormat),
				}
				activationStruct.Create(&activationStruct)

				var mailTemplate struct{ Fullname, Username, ResetLink string }
				mailTemplate.Username = User.Username
				mailTemplate.ResetLink = activationStruct.Code
				mailTemplate.Fullname = fmt.Sprintf("%s %s %s", User.Title, User.Firstname, User.Lastname)

				errorMessage, emailTemplate := utils.GetTemplate("email_password_reset.html")
				if errorMessage == "" {
					var messageBytes bytes.Buffer
					if err := emailTemplate.Execute(&messageBytes, mailTemplate); err == nil {
						emailStruct := utils.Email{}
						emailStruct.To = formStruct.Email
						emailStruct.Subject = "Reset Your Password"
						emailStruct.Message = messageBytes.String()
						go utils.SendEmail(emailStruct, utils.SMTP{})
					}
				}
				//All Seems Clear, Generate Password Reset Activation Link and Mail User
			}
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Message: statusMessage,
	})
}

func apiWebsiteSignup(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	statusMessage := ""
	statusCode := http.StatusInternalServerError

	var formStruct struct {
		DelaySec uint64
		DelayChar, Username,
		Password, Fullname string
	}

	err := json.NewDecoder(httpReq.Body).Decode(&formStruct)
	if err != nil {
		statusMessage = "Error Decoding Form Values " + err.Error()
	} else {
		users, err := buckets.Users{}.GetFieldValue("Username", formStruct.Username)
		if err != nil {
			statusMessage = fmt.Sprintf("Error Validating Username %s", err.Error())
		} else if len(users) > 0 {
			statusMessage = fmt.Sprintf("Sorry this Username [%s] already exists", formStruct.Username)
		} else {

			//All Seems Clear, Create New User Now Now
			if formStruct.Fullname == "" {
				statusMessage += "Fullname" + api.IsRequired
			}

			if formStruct.Username == "" {
				statusMessage += "Username" + api.IsRequired
			}

			if formStruct.DelayChar == "" {
				statusMessage += "Delay Character" + api.IsRequired
			}

			if strings.HasSuffix(statusMessage, "\n") {
				statusMessage = statusMessage[:len(statusMessage)-2]
			}

			if statusMessage == "" {

				statusCode = http.StatusOK
				statusMessage = "Please login"

				bucketUser := buckets.Users{}
				bucketUser.Workflow = "enabled"
				bucketUser.Fullname = formStruct.Fullname
				bucketUser.Username = formStruct.Username
				bucketUser.DelayChar = formStruct.DelayChar
				bucketUser.DelaySec = formStruct.DelaySec

				hash, _ := bcrypt.GenerateFromPassword([]byte(formStruct.Password), bcrypt.DefaultCost)
				bucketUser.Password = hash
				bucketUser.Create(&bucketUser)

			}
			//All Seems Clear, Create New User Now Now

		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Message: statusMessage,
	})
	// //Send E-Mail
}
