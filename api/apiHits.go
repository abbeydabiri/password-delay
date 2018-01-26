package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/boltdb/bolt"
	"github.com/justinas/alice"
	"github.com/timshannon/bolthold"

	"passworddelay/buckets"
	"passworddelay/config"
	"passworddelay/utils"
)

type apiHitStruct struct {
	ID uint64
	Code, Title, Workflow, Description,
	Url, IPAddress, UserAgent string

	CampaignID uint64
}

func apiHandlerHit(middlewares alice.Chain, router *Router) {
	router.Post("/api/hits", middlewares.ThenFunc(apiHitPost))
	router.Get("/api/hits", middlewares.ThenFunc(apiHitGet))
	router.Get("/api/hits/search", middlewares.ThenFunc(apiHitSearch))
}

func apiHitSearch(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		searchResults := []buckets.Hits{}
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
			searchField = "Title"
		}

		nLimit := 100
		sLimit := strings.TrimSpace(httpReq.FormValue("limit"))
		if sLimit != "" {
			nLimit, _ = strconv.Atoi(sLimit)
		}

		if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
			err := config.Get().BoltHold.Find(&searchResults,
				bolthold.Where(searchField).RegExp(
					regexp.MustCompile(`(?im)`+searchText)).SortBy("ID").Reverse().Limit(nLimit),
			)
			return err
		}); err != nil {
			statusMessage = err.Error()
		} else {

			searchList := make([]apiSearchResult, len(searchResults))
			for pos, result := range searchResults {
				searchList[pos].ID = result.ID
				searchList[pos].Date = JSONTime(result.Createdate)
				searchList[pos].Details = fmt.Sprintf("%v", result.Title)
				searchList[pos].SubDetails = fmt.Sprintf("%v", result.Description)
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

func apiHitGet(httpRes http.ResponseWriter, httpReq *http.Request) {

	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusOK
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		sHitID := strings.TrimSpace(httpReq.FormValue("id"))
		if sHitID == "" {
			statusCode = http.StatusInternalServerError
			statusMessage = "Error Hit ID is required to load form"
		} else {
			HitID, _ := strconv.ParseUint(sHitID, 0, 64)
			hitsList, err := buckets.Hits{}.GetFieldValue("ID", HitID)
			if err != nil {
				statusMessage = err.Error()
			} else {
				if len(hitsList) > 0 {

					statusBody = apiHitStruct{

						ID: hitsList[0].ID,

						Url:       hitsList[0].Url,
						IPAddress: hitsList[0].IPAddress,
						UserAgent: hitsList[0].UserAgent,

						Code:        hitsList[0].Code,
						Title:       hitsList[0].Title,
						Workflow:    hitsList[0].Workflow,
						Description: hitsList[0].Description,
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

func apiHitPost(httpRes http.ResponseWriter, httpReq *http.Request) {
	httpRes.Header().Set("Content-Type", "application/json")

	var statusBody interface{}
	statusCode := http.StatusInternalServerError
	statusMessage := ""

	if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
		statusBody = map[string]string{"Redirect": "/"}
	} else {

		formStruct := buckets.Hits{}
		err := json.NewDecoder(httpReq.Body).Decode(&formStruct)
		if err != nil {
			statusMessage = "Error Decoding Form Values: " + err.Error()
		} else {

			bucketHit := buckets.Hits{}
			if formStruct.ID != 0 {
				bucketHitList, _ := buckets.Hits{}.GetFieldValue("ID", formStruct.ID)
				if len(bucketHitList) != 1 {
					statusMessage = "Error Decoding Form Values: " + err.Error()
				} else {
					bucketHit = bucketHitList[0]
				}
			}

			bucketHit.Url = formStruct.Url
			bucketHit.IPAddress = formStruct.IPAddress
			bucketHit.UserAgent = formStruct.UserAgent

			bucketHit.Code = formStruct.Code
			bucketHit.Title = formStruct.Title
			bucketHit.Description = formStruct.Description

			if statusMessage == "" {
				if bucketHit.Title == "" {
					statusMessage += "Title" + IsRequired
				}

				if strings.HasSuffix(statusMessage, "\n") {
					statusMessage = statusMessage[:len(statusMessage)-2]
				}
			}

			if statusMessage == "" {
				bucketHit.Updatedby = uint64(claims["ID"].(float64))
				err = bucketHit.Create(&bucketHit)
				if err != nil {
					statusMessage = "Error Saving Record: " + err.Error()
				} else {
					statusCode = http.StatusOK
					statusMessage = RecordSaved
					statusBody = bucketHit.ID
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
