package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/boltdb/bolt"
	"github.com/justinas/alice"
	"github.com/timshannon/bolthold"

	"litefinga/buckets"
	"litefinga/config"
	"litefinga/utils"
)

type apiUserStruct struct {
	ID, DelaySec, FailedMax, Failed uint64

	IsAdmin bool

	DelayChar, Username, Password,
	Workflow, Fullname, Email,
	Mobile, Address, Image,
	Description string
}

func apiHandlerUser(middlewares alice.Chain, router *Router) {
	router.Post("/api/users", middlewares.ThenFunc(apiUserPost))
	router.Get("/api/users", middlewares.ThenFunc(apiUserGet))
	router.Get("/api/users/search", middlewares.ThenFunc(apiUserSearch))
	router.Get("/api/users/contact", middlewares.ThenFunc(apiUsersContact))
	router.Get("/api/users/username", middlewares.ThenFunc(apiUsersUsername))
}

func apiUsersContact(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		searchField := "Fullname"
		searchResults := []buckets.Users{}
		searchText := strings.TrimSpace(httpReq.FormValue("search"))
		if searchText == "" {
			searchText = "."
		} else {
			searchText = regexp.QuoteMeta(searchText)
		}

		if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
			err := config.Get().BoltHold.Find(&searchResults,
				bolthold.Where(searchField).RegExp(
					regexp.MustCompile(`(?im)`+searchText)).Limit(20),
			)
			return err
		}); err != nil {
			statusMessage = err.Error()
		} else {

			searchList := make([]apiSearchResult, len(searchResults))
			for pos, result := range searchResults {

				if claims["IsAdmin"] == nil || !claims["IsAdmin"].(bool) {
					if result.Createdby != uint64(claims["ID"].(float64)) {
						continue
					}
				}

				searchList[pos].ID = result.ID
				searchList[pos].Date = JSONTime(result.Createdate)

				sDetails := ""
				if result.Fullname != "" {
					sDetails = result.Fullname
				}

				if result.Email != "" {
					if sDetails != "" {
						sDetails += ", "
					}
					sDetails += result.Email
				}

				if result.Mobile != "" {
					if sDetails != "" {
						sDetails += ", "
					}
					sDetails += result.Mobile
				}

				searchList[pos].Details = sDetails
			}

			statusCode = http.StatusOK
			statusBody = searchList
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Body:    statusBody,
		Message: statusMessage,
	})
}

func apiUsersUsername(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		searchField := "Fullname"
		searchResults := []buckets.Users{}
		searchText := strings.TrimSpace(httpReq.FormValue("search"))
		if searchText == "" {
			searchText = "."
		} else {
			searchText = regexp.QuoteMeta(searchText)
		}

		if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
			err := config.Get().BoltHold.Find(&searchResults,
				bolthold.Where(searchField).RegExp(
					regexp.MustCompile(`(?im)`+searchText)).And("Username").Ne("").Limit(20),
			)
			return err
		}); err != nil {
			statusMessage = err.Error()
		} else {

			searchList := make([]apiSearchResult, len(searchResults))
			for pos, result := range searchResults {
				if claims["IsAdmin"] == nil || !claims["IsAdmin"].(bool) {
					if result.Createdby != uint64(claims["ID"].(float64)) {
						continue
					}
				}

				searchList[pos].ID = result.ID
				searchList[pos].Date = JSONTime(result.Createdate)
				searchList[pos].Details = fmt.Sprintf("%v - [%v]", result.Username, result.Fullname)
			}

			statusCode = http.StatusOK
			statusBody = searchList
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Body:    statusBody,
		Message: statusMessage,
	})
}

func apiUserSearch(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		searchResults := []buckets.Users{}
		searchText := strings.TrimSpace(httpReq.FormValue("search"))
		searchField := strings.TrimSpace(httpReq.FormValue("field"))
		if searchText == "" {
			searchText = "."
		} else {
			searchText = regexp.QuoteMeta(searchText)
		}

		switch searchField {
		default:
			searchField = strings.Title(strings.ToLower(searchField))
		case "":
			searchField = "Fullname"
		}

		nLimit := uint64(25)
		startID := uint64(0)
		if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) (err error) {
			if searchText == "." {
				bucket := tx.Bucket([]byte(`Users`))

				if bucket.Sequence() > nLimit {
					startID = bucket.Sequence() - nLimit
				}
				err = config.Get().BoltHold.Find(&searchResults,
					bolthold.Where("ID").Gt(uint64(0)).SortBy("ID").Reverse().Limit(int(nLimit)),
				)
			} else {
				err = config.Get().BoltHold.Find(&searchResults,
					bolthold.Where(searchField).RegExp(
						regexp.MustCompile(`(?im)`+searchText)).SortBy("ID").Reverse().Limit(int(nLimit)),
				)
			}
			return err
		}); err != nil {
			statusMessage = err.Error()
		} else {

			searchList := make([]apiSearchResult, len(searchResults))
			for pos, result := range searchResults {
				searchList[pos].ID = result.ID
				searchList[pos].Date = JSONTime(result.Createdate)
				searchList[pos].Details = fmt.Sprintf("%v - [%v]", result.Username, result.Fullname)
			}
			statusCode = http.StatusOK
			statusBody = searchList
		}
	}

	json.NewEncoder(httpRes).Encode(Message{
		Code:    statusCode,
		Body:    statusBody,
		Message: statusMessage,
	})
}

func apiUserGet(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusOK
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		sUserID := strings.TrimSpace(httpReq.FormValue("id"))
		if sUserID == "" {
			statusCode = http.StatusInternalServerError
			statusMessage = "Error User ID is required to load form"
		} else {
			UserID, _ := strconv.ParseUint(sUserID, 0, 64)
			usersList, err := buckets.Users{}.GetFieldValue("ID", UserID)
			if err != nil {
				statusMessage = err.Error()
			} else {
				if len(usersList) > 0 {

					statusBody = apiUserStruct{
						ID: usersList[0].ID,

						Code:     usersList[0].Code,
						Username: usersList[0].Username,
						Workflow: usersList[0].Workflow,

						IsAdmin:  usersList[0].IsAdmin,
						Fullname: usersList[0].Fullname,

						Email:  usersList[0].Email,
						Mobile: usersList[0].Mobile,

						Image:       usersList[0].Image,
						Address:     usersList[0].Address,
						Description: usersList[0].Description,
					}

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

func apiUserPost(httpRes http.ResponseWriter, httpReq *http.Request) {
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

			if formStruct.ID != 0 {
				bucketUserList, _ := buckets.Users{}.GetFieldValue("ID", formStruct.ID)
				if len(bucketUserList) != 1 {
					statusMessage = "Error Decoding Form Values: " + err.Error()
				} else {
					bucketUser = bucketUserList[0]
				}
			} else {
				statusMessage += "Admin Users is for Managing Existing Users, Not Creating New Users\n"
			}

			bucketUser.Code = formStruct.Code
			bucketUser.Username = formStruct.Username
			bucketUser.Workflow = formStruct.Workflow

			bucketUser.IsAdmin = formStruct.IsAdmin
			bucketUser.IsStaff = formStruct.IsStaff
			bucketUser.IsAgent = formStruct.IsAgent
			bucketUser.IsCompany = formStruct.IsCompany
			bucketUser.IsCustomer = formStruct.IsCustomer
			bucketUser.IsConsultant = formStruct.IsConsultant

			if formStruct.PasswordString != "" {
				hash, err := bcrypt.GenerateFromPassword([]byte(formStruct.PasswordString), bcrypt.DefaultCost)
				if err == nil {
					bucketUser.Password = hash
				} else {
					statusMessage = err.Error()
				}
			}

			if statusMessage == "" {
				if bucketUser.Workflow == "" {
					statusMessage += WorkflowRequired
				}

				if bucketUser.Username == "" {
					statusMessage += "Username is Required \n"
				}

				if strings.HasSuffix(statusMessage, "\n") {
					statusMessage = statusMessage[:len(statusMessage)-2]
				}
			}

			if statusMessage == "" {
				bucketUser.Updatedby = uint64(claims["ID"].(float64))
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
