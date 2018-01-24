package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/justinas/alice"

	"passworddelay/buckets"
	"passworddelay/utils"
)

type apiDashboardStruct struct {
	ID uint64
	IsAdmin, IsCustomer,
	IsConsultant, IsCompany bool
	Username, Workflow,
	Fullname, Title, Firstname, Lastname, Email, Mobile, Website,
	Address, City, State, Country, Image, Description string
}

func apiHandlerDashboard(middlewares alice.Chain, router *Router) {
	router.Get("/api/dashboard", middlewares.ThenFunc(apiDashboardGet))
	router.Post("/api/dashboard", middlewares.ThenFunc(apiDashboardPost))
}

func apiDashboardGet(httpRes http.ResponseWriter, httpReq *http.Request) {

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

				statusBody = apiDashboardStruct{
					ID: usersList[0].ID,

					IsAdmin: usersList[0].IsAdmin,

					Username: usersList[0].Username,
					Workflow: usersList[0].Workflow,

					Fullname: usersList[0].Fullname,

					Email:  usersList[0].Email,
					Mobile: usersList[0].Mobile,

					Address: usersList[0].Address,

					Image:       usersList[0].Image,
					Description: usersList[0].Description,
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

func apiDashboardPost(httpRes http.ResponseWriter, httpReq *http.Request) {
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

			bucketUser.Email = formStruct.Email
			bucketUser.Mobile = formStruct.Mobile

			bucketUser.Address = formStruct.Address

			if statusMessage == "" {

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
