package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/justinas/alice"

	"litefinga/buckets"
	"litefinga/utils"
)

type apiProfileStruct struct {
	ID uint64
	IsAdmin, IsCustomer,
	IsConsultant, IsCompany bool
	Username, Workflow,
	Fullname, Title, Firstname, Lastname, Othername, Email, Mobile,
	Address, City, State, Country, Image, Description,

	Referrer, BankName, BankAccountName,
	BankAccountType, BankAccountNumber,

	Occupation, NextOfKin, NextOfKinMobile, Employer,
	Dob, Gender, MaritalStatus, Website string
}

func apiHandlerProfile(middlewares alice.Chain, router *Router) {
	router.Get("/api/profile", middlewares.ThenFunc(apiProfileGet))
	router.Post("/api/profile", middlewares.ThenFunc(apiProfilePost))
}

func apiProfileGet(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusOK
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		usersList, err := buckets.Users{}.GetFieldValue("ID", uint64(claims["ID"].(float64)))
		if err != nil {
			statusMessage = err.Error()
		} else {
			if len(usersList) > 0 {
				if len(usersList[0].Image) > 3 {
					usersList[0].Image += "?" + strings.ToLower(utils.RandomString(3))
				}

				statusBody = apiProfileStruct{
					ID: usersList[0].ID,

					IsAdmin:      usersList[0].IsAdmin,
					IsCompany:    usersList[0].IsCompany,
					IsCustomer:   usersList[0].IsCustomer,
					IsConsultant: usersList[0].IsConsultant,

					Username: usersList[0].Username,
					Workflow: usersList[0].Workflow,

					Fullname:    usersList[0].Fullname,
					Title:       usersList[0].Title,
					Firstname:   usersList[0].Firstname,
					Lastname:    usersList[0].Lastname,
					Othername:   usersList[0].Othername,
					Email:       usersList[0].Email,
					Mobile:      usersList[0].Mobile,
					Address:     usersList[0].Address,
					City:        usersList[0].City,
					State:       usersList[0].State,
					Country:     usersList[0].Country,
					Image:       usersList[0].Image,
					Description: usersList[0].Description,

					Referrer:          usersList[0].Referrer,
					BankName:          usersList[0].BankName,
					BankAccountName:   usersList[0].BankAccountName,
					BankAccountType:   usersList[0].BankAccountType,
					BankAccountNumber: usersList[0].BankAccountNumber,
					Occupation:        usersList[0].Occupation,
					NextOfKin:         usersList[0].NextOfKin,
					NextOfKinMobile:   usersList[0].NextOfKinMobile,
					Employer:          usersList[0].Employer,
					Dob:               usersList[0].Dob,
					Gender:            usersList[0].Gender,
					MaritalStatus:     usersList[0].MaritalStatus,
					Website:           usersList[0].Website,
				}
			}
		}

	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Body:    statusBody,
		Message: statusMessage,
	})
}

func apiProfilePost(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		formStruct := buckets.Users{}
		err := json.NewDecoder(httpReq.Body).Decode(&formStruct)
		if err != nil {
			statusMessage = "Error Decoding Form Values: " + err.Error()
		} else {

			bucketUser := buckets.Users{}

			bucketUserList, _ := buckets.Users{}.GetFieldValue("ID", uint64(claims["ID"].(float64)))
			if len(bucketUserList) != 1 {
				statusMessage = "Error Decoding Form Values: " + err.Error()
			} else {
				bucketUser = bucketUserList[0]
			}

			bucketUser.Description = formStruct.Description
			bucketUser.Fullname = formStruct.Fullname
			bucketUser.Title = formStruct.Title
			bucketUser.Firstname = formStruct.Firstname
			bucketUser.Lastname = formStruct.Lastname
			bucketUser.Othername = formStruct.Othername
			bucketUser.Email = formStruct.Email
			bucketUser.Mobile = formStruct.Mobile
			bucketUser.Website = formStruct.Website
			bucketUser.Address = formStruct.Address
			bucketUser.City = formStruct.City
			bucketUser.State = formStruct.State
			bucketUser.Country = formStruct.Country

			// BankName:          usersList[0].BankName,
			// BankAccountName:   usersList[0].BankAccountName,
			// BankAccountType:   usersList[0].BankAccountType,
			// BankAccountNumber: usersList[0].BankAccountNumber,
			// Occupation:        usersList[0].Occupation,
			// NextOfKin:         usersList[0].NextOfKin,
			// NextOfKinMobile:   usersList[0].NextOfKinMobile,
			// Employer:          usersList[0].Employer,
			// Dob:               usersList[0].Dob,
			// Gender:            usersList[0].Gender,
			// MaritalStatus:     usersList[0].MaritalStatus,
			// Website:           usersList[0].Website,

			if statusMessage == "" {

				if !bucketUser.IsCompany {
					bucketUser.Fullname = fmt.Sprintf("%v %v %v",
						bucketUser.Title, bucketUser.Firstname, bucketUser.Lastname)
				}

				if bucketUser.Fullname == "" {
					statusMessage += "Fullname is Required \n"
				}

				if bucketUser.Description == "" {
					statusMessage += "Description is Required \n"
				}

				if bucketUser.Email == "" {
					statusMessage += "Email is Required \n"
				}

				if bucketUser.Mobile == "" {
					statusMessage += "Mobile is Required \n"
				}

				if bucketUser.Address == "" {
					statusMessage += "Address is Required \n"
				}

				if bucketUser.Country == "" {
					statusMessage += "Country is Required \n"
				}

				if strings.HasSuffix(statusMessage, "\n") {
					statusMessage = statusMessage[:len(statusMessage)-2]
				}
			}

			if statusMessage == "" {

				if !strings.HasPrefix(formStruct.Image, "data:image/") {
					formStruct.Image = ""
				} else {
					base64Bytes, err := base64.StdEncoding.DecodeString(
						strings.Split(formStruct.Image, "base64,")[1])

					if base64Bytes != nil && err == nil {
						fileExt, fileType := utils.GetFileExt(formStruct.Image[:20])

						if fileExt != "" {
							fileName := fmt.Sprintf("dp-%s%s", utils.RandomString(12), fileExt)
							formStruct.Image = utils.SaveFile(fileName, fileType, base64Bytes)
						}
					}
				}

				if formStruct.Image != "" {
					bucketUser.Image = formStruct.Image
				}

				bucketUser.Updatedby = bucketUser.ID
				err = bucketUser.Create(&bucketUser)
				if err != nil {
					statusMessage = "Error Saving Record: " + err.Error()
				} else {
					statusCode = http.StatusOK
					statusMessage = RecordSaved
					statusBody = bucketUser.ID
				}
			}
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Body:    statusBody,
		Message: statusMessage,
	})
}
