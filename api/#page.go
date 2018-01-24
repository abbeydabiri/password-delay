package api

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"bytes"
	"text/template"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"

	"github.com/boltdb/bolt"
	"github.com/timshannon/bolthold"

	"passworddelay/buckets"
	"passworddelay/config"
	"passworddelay/utils"

	jwt "github.com/dgrijalva/jwt-go"
)

func pageHandlerVerifyID(httpRes http.ResponseWriter, httpReq *http.Request, claims jwt.MapClaims) {
	if claims == nil {
		http.Redirect(httpRes, httpReq, "/", http.StatusTemporaryRedirect)
		return
	}

	if claims["ID"] == nil {
		http.Redirect(httpRes, httpReq, "/", http.StatusTemporaryRedirect)
		return
	}
}
func pageHandlerDashboard(httpRes http.ResponseWriter, httpReq *http.Request, indexPage, page, bundle string) {
	switch {
	case strings.HasSuffix(page, "/service-worker.js"):
		fileServe("/ui/assets/bin/service-worker.js", httpRes, httpReq)
	case
		strings.HasPrefix(page, "/files"),
		strings.HasPrefix(page, "/images"),
		strings.HasPrefix(page, "/campaigns/"):
		fileServe(page, httpRes, httpReq)
	default:
		indexServe(pageStruct{Page: indexPage, Bundle: bundle, Version: ""}, httpRes, httpReq)
	}
}

func pageHandler(middlewares alice.Chain, router *Router) {
	router.Get("/favicon.ico", middlewares.ThenFunc(func(httpRes http.ResponseWriter, httpReq *http.Request) { return }))

	router.Get("/robots.txt", middlewares.ThenFunc(func(httpRes http.ResponseWriter, httpReq *http.Request) {
		httpRes.Header().Set("Content-Type", "text/plain")
		httpRes.Write([]byte(`User-agent: *`))
	}))

	// router.Get("/service-worker.js", middlewares.ThenFunc(func(httpRes http.ResponseWriter, httpReq *http.Request) {
	// 	fileServe("/ui/assets/bin/service-worker.js", httpRes, httpReq)
	// }))

	router.GET("/service-worker.js", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		fileServe("/ui/assets/bin/service-worker.js", httpRes, httpReq)
	})

	router.GET("/assets/*filepath", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		filepath := fmt.Sprintf("/ui/assets%s", httpParams.ByName("filepath"))
		fileServe(filepath, httpRes, httpReq)
	})

	router.GET("/images/*filepath", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		fileServe("/images"+httpParams.ByName("filepath"), httpRes, httpReq)
	})

	router.GET("/files/*filepath", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		fileServe("/files"+httpParams.ByName("filepath"), httpRes, httpReq)
	})

	router.Get("/", middlewares.ThenFunc(func(httpRes http.ResponseWriter, httpReq *http.Request) {
		indexServe(pageStruct{Bundle: "website", Version: ""}, httpRes, httpReq)
	}))

	router.GET("/login", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		if claims := utils.VerifyJWT(httpRes, httpReq); claims != nil {
			if uint64(claims["ID"].(float64)) > 0 {
				switch {
				case claims["IsAdmin"] != nil && claims["IsAdmin"].(bool):
					http.Redirect(httpRes, httpReq, "/admin", http.StatusTemporaryRedirect)
					break

				default:
					http.Redirect(httpRes, httpReq, "/dashboard", http.StatusTemporaryRedirect)
				}
			}
		}
		indexServe(pageStruct{Bundle: "website", Version: ""}, httpRes, httpReq)
	})

	//Authenticated Pages --> Below
	router.GET("/dashboard/*page", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		claims := utils.VerifyJWT(httpRes, httpReq)
		pageHandlerVerifyID(httpRes, httpReq, claims)
		pageHandlerDashboard(httpRes, httpReq, "dashboard", httpParams.ByName("page"), "dashboard")
	})

	router.GET("/admin/*page", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		claims := utils.VerifyJWT(httpRes, httpReq)
		pageHandlerVerifyID(httpRes, httpReq, claims)
		if claims["IsAdmin"] == nil || !claims["IsAdmin"].(bool) {
			http.Redirect(httpRes, httpReq, "/", http.StatusTemporaryRedirect)
		}
		pageHandlerDashboard(httpRes, httpReq, "dashboard", httpParams.ByName("page"), "admin")
	})

	router.NotFound = middlewares.ThenFunc(func(httpRes http.ResponseWriter, httpReq *http.Request) {
		frontend := strings.Split(httpReq.URL.Path[1:], "/")
		switch frontend[0] {
		case "logout":
			cookieMonster := &http.Cookie{
				Name: config.Get().COOKIE, Value: "deleted", Path: "/",
				Expires: time.Now().Add(-(time.Hour * 24 * 30 * 12)), // set the expire time
			}
			http.SetCookie(httpRes, cookieMonster)
			httpReq.AddCookie(cookieMonster)
			fallthrough

		case "signup", "forgot", "privacy", "terms":
			indexServe(pageStruct{Bundle: "website", Version: ""}, httpRes, httpReq)

		default:
			filePath := "/ui/404.html"
			fileServe(filePath, httpRes, httpReq)
		}
	})

}

type pageStruct struct{ Bundle, Version, Page, SeoTitle, SeoContent string }

func indexServe(page pageStruct, httpRes http.ResponseWriter, httpReq *http.Request) {
	// httpRes.Header().Set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
	// httpRes.Header().Set("Pragma", "no-cache")
	// httpRes.Header().Set("Expires", "0")

	httpRes.Header().Set("Cache-Control", "max-age=0, must-revalidate") //30 Seconds Cache

	var errMain error
	if page.Page == "" {
		page.Page = "index"
	}
	page.Version = config.Get().Version
	filepath := fmt.Sprintf("/ui/%s.html", page.Page)

	//If dealing with index-page look for SEO content to show
	if page.Page == "index" {
		searchResults := []buckets.Seocontents{}
		if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
			err := config.Get().BoltHold.Find(&searchResults,
				bolthold.Where("Title").RegExp(
					regexp.MustCompile(`(?im).`)).And("Workflow").Eq("enabled"),
			)
			return err
		}); err != nil {
			log.Println(err.Error())
		} else {
			for _, result := range searchResults {

				lUpdate := false
				switch result.Filter {
				case "HasPrefix":
					if strings.HasPrefix(httpReq.URL.String(), result.Url) {
						lUpdate = true
					}
				case "HasSuffix":
					if strings.HasSuffix(httpReq.URL.String(), result.Url) {
						lUpdate = true
					}
				case "Contains":
					if strings.Contains(httpReq.URL.String(), result.Url) {
						lUpdate = true
					}
				}

				if lUpdate {
					if len(result.Code) > 0 {
						page.SeoTitle = result.Code
					}
					if len(result.Description) > 0 {
						page.SeoContent = result.Description
					}
				}

			}
		}
	}
	//If dealing with index-page look for SEO content to show

	pageBytes, err := config.Asset(filepath)
	if err == nil {

		if pageTemplate, err := template.New("index").Parse(string(pageBytes)); err == nil {
			var dataBytes bytes.Buffer
			if err := pageTemplate.Execute(&dataBytes, page); err == nil {

				httpRes.Header().Add("Content-Type", config.ContentType(filepath))
				if !strings.Contains(httpReq.Header.Get("Accept-Encoding"), "gzip") || httpReq.URL.Path == "/" {
					httpRes.Write(dataBytes.Bytes())
					return
				}
				gzipWrite(dataBytes.Bytes(), httpRes)
			} else {
				errMain = err
			}
		} else {
			errMain = err
		}
	} else {
		errMain = err
	}

	if errMain != nil {
		httpRes.WriteHeader(404)
		httpRes.Write([]byte(fmt.Sprintf("404 - %s ==> %s",
			http.StatusText(404), errMain.Error())))
	}
}
