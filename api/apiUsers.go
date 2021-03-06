package api

import (
	"encoding/base64"
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

	"passworddelay/buckets"
	"passworddelay/config"
	"passworddelay/utils"
)

type apiUserStruct struct {
	ID, DelaySec, DelayChar,
	FailedMax, Failed uint64

	IsAdmin bool

	Username, Password,
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
					if len(usersList[0].Image) > 3 {
						usersList[0].Image += "?" + strings.ToLower(utils.RandomString(3))
					}

					statusBody = apiUserStruct{
						ID:        usersList[0].ID,
						Failed:    usersList[0].Failed,
						DelaySec:  usersList[0].DelaySec,
						DelayChar: usersList[0].DelayChar,
						FailedMax: usersList[0].FailedMax,

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

			bucketUser.Username = formStruct.Username
			bucketUser.Workflow = formStruct.Workflow
			bucketUser.IsAdmin = formStruct.IsAdmin

			bucketUser.Failed = formStruct.Failed
			bucketUser.DelaySec = formStruct.DelaySec
			bucketUser.DelayChar = formStruct.DelayChar
			bucketUser.FailedMax = formStruct.FailedMax

			if formStruct.PasswordString != "" {
				hash, errNew := bcrypt.GenerateFromPassword([]byte(formStruct.PasswordString), bcrypt.DefaultCost)
				if errNew == nil {
					bucketUser.Password = hash
				} else {
					statusMessage = errNew.Error()
				}
			}

			if statusMessage == "" {
				if bucketUser.Workflow == "" {
					statusMessage += "Workflow" + IsRequired
				}

				if bucketUser.Username == "" {
					statusMessage += "Username" + IsRequired
				}

				if strings.HasSuffix(statusMessage, "\n") {
					statusMessage = statusMessage[:len(statusMessage)-2]
				}
			}

			if statusMessage == "" {

				if !strings.HasPrefix(formStruct.Image, "data:image/") {
					formStruct.Image = ""
				} else {
					base64Bytes, errNew := base64.StdEncoding.DecodeString(
						strings.Split(formStruct.Image, "base64,")[1])

					if base64Bytes != nil && errNew == nil {
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
