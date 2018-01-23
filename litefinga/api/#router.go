package api

import (
	"compress/gzip"
	"context"
	"fmt"
	"io"
	"net"
	"regexp"
	"strings"

	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/rs/cors"

	"github.com/boltdb/bolt"
	"github.com/timshannon/bolthold"

	"litefinga/buckets"
	"litefinga/config"
	"litefinga/utils"
)

type Message struct {
	Code           int
	Message, Error string
	Body           interface{}
}

type Router struct { // Router struct would carry the httprouter instance,
	*httprouter.Router //so its methods could be verwritten and replaced with methds with wraphandler
}

func (router *Router) Get(path string, handler http.Handler) {
	router.GET(path, wrapHandler(handler)) // Get is an endpoint to only accept requests of method GET
}

// Post is an endpoint to only accept requests of method POST
func (router *Router) Post(path string, handler http.Handler) {
	router.POST(path, wrapHandler(handler))
}

// Put is an endpoint to only accept requests of method PUT
func (router *Router) Put(path string, handler http.Handler) {
	router.PUT(path, wrapHandler(handler))
}

// Delete is an endpoint to only accept requests of method DELETE
func (router *Router) Delete(path string, handler http.Handler) {
	router.DELETE(path, wrapHandler(handler))
}

// NewRouter is a wrapper that makes the httprouter struct a child of the router struct
func NewRouter() *Router {
	return &Router{httprouter.New()}
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func gzipWrite(dataBytes []byte, httpRes http.ResponseWriter) {
	// httpRes.Header().Set("Transfer-Encoding", "gzip")
	httpRes.Header().Set("Content-Encoding", "gzip")
	gzipHandler := gzip.NewWriter(httpRes)
	defer gzipHandler.Close()
	httpResGzip := gzipResponseWriter{Writer: gzipHandler, ResponseWriter: httpRes}
	httpResGzip.Write(dataBytes)
}

func wrapHandler(httpHandler http.Handler) httprouter.Handle {
	return func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		ctx := context.WithValue(httpReq.Context(), "params", httpParams)
		httpReq = httpReq.WithContext(ctx)

		if !strings.Contains(httpReq.Header.Get("Accept-Encoding"), "gzip") {
			httpHandler.ServeHTTP(httpRes, httpReq)
			return
		}

		httpRes.Header().Set("Content-Encoding", "gzip")
		gzipHandler := gzip.NewWriter(httpRes)
		defer gzipHandler.Close()
		httpResGzip := gzipResponseWriter{Writer: gzipHandler, ResponseWriter: httpRes}
		httpHandler.ServeHTTP(httpResGzip, httpReq)
	}
}

func fileServe(filepath string, httpRes http.ResponseWriter, httpReq *http.Request) {
	cacheAge := "max-age=1, must-revalidate"
	if config.Get().Debug {
		cacheAge = "max-age=14400, must-revalidate"
	}

	if strings.HasPrefix(filepath, "/ui/assets/bin") && strings.Contains(filepath, "-bundle.js") {
		httpRes.Header().Set("Cache-Control", cacheAge) //7 Days Cache
	} else if strings.HasPrefix(filepath, "/ui/assets") {
		httpRes.Header().Set("Cache-Control", cacheAge) //1 HR Cache
	} else {
		httpRes.Header().Set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
		httpRes.Header().Set("Pragma", "no-cache")
		httpRes.Header().Set("Expires", "0")
	}

	// httpRes.Header().Set("Cache-Control", "max-age=0, must-revalidate") //30 Seconds Cache
	if dataBytes, err := config.Asset(filepath); err == nil {
		httpRes.Header().Add("Content-Type", config.ContentType(filepath))
		if !strings.Contains(httpReq.Header.Get("Accept-Encoding"), "gzip") {
			httpRes.Write(dataBytes)
			return
		}
		gzipWrite(dataBytes, httpRes)
	} else {
		httpRes.WriteHeader(404)
		fileServe("/ui/404.html", httpRes, httpReq)
	}
}

func StartRouter() {

	middlewares := alice.New()
	router := NewRouter()

	allUsers := buckets.BucketList("/Users")
	if allUsers[0] == "" {
		buckets.Init()
	}

	router.GET("/bucket/list/*bucket", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
			httpRes.WriteHeader(404)
			fileServe("/ui/404.html", httpRes, httpReq)
		} else {
			if claims["IsAdmin"].(bool) {
				bucketList := buckets.BucketList(httpParams.ByName("bucket"))
				httpRes.Write([]byte(strings.Join(bucketList, "\n")))
			} else {
				httpRes.WriteHeader(404)
				fileServe("/ui/404.html", httpRes, httpReq)
			}
		}
	})

	router.POST("/bucket/empty/*bucket", func(httpRes http.ResponseWriter, httpReq *http.Request, httpParams httprouter.Params) {
		if claims := utils.VerifyJWT(httpRes, httpReq); claims == nil {
			httpRes.WriteHeader(404)
			fileServe("/ui/404.html", httpRes, httpReq)
		} else {
			if claims["IsAdmin"].(bool) {
				errMessages := buckets.Empty(httpParams.ByName("bucket"))
				httpRes.Write([]byte(strings.Join(errMessages, "\n")))
			} else {
				httpRes.WriteHeader(404)
				fileServe("/ui/404.html", httpRes, httpReq)
			}
		}
	})

	apiHandler(middlewares, router)
	pageHandler(middlewares, router)

	handler := cors.New(cors.Options{
		//		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "Content-Type", "X-Auth-Token", "*"},
		Debug:            false,
	}).Handler(router)

	sMessage := "serving @ " + config.Get().Address
	println(sMessage)
	log.Println(sMessage)

	wrapHandlerBlacklists := http.HandlerFunc(
		func(httpRes http.ResponseWriter, httpReq *http.Request) {

			remoteHost := ""
			go func() {
				if hostnames, err := net.LookupAddr(httpReq.RemoteAddr); err == nil {
					remoteHost = strings.Join(hostnames, " ")
				}
			}()

			//Check For Openned Newsletters
			pixelThumbRE := regexp.MustCompile(`/pixelthumb-*.+-it.png$`)
			if pixelThumbRE.MatchString(httpReq.URL.String()) {

				jwtToken := pixelThumbRE.FindStringSubmatch(httpReq.URL.String())[0]
				jwtToken = strings.Replace(jwtToken, "-it.png", "", 1)
				jwtToken = strings.Replace(jwtToken, "/pixelthumb-", "", 1)

				jwtClaims := utils.ValidateJWT(jwtToken)
				if jwtClaims != nil {

					UserID := uint64(0)
					if jwtClaims["uid"] != nil {
						UserID = uint64(jwtClaims["uid"].(float64))
					}

					NewsletterID := uint64(0)
					if jwtClaims["nid"] != nil {
						NewsletterID = uint64(jwtClaims["nid"].(float64))
					}
					newsletterList, _ := buckets.Newsletters{}.GetFieldValue("ID", NewsletterID)

					//Save Bucket Hit and Reference Newsletter + User
					bucketHit := buckets.Hits{}
					bucketHit.Url = fmt.Sprintf("%v%v", httpReq.Host, httpReq.URL.String())
					if jwtClaims["url"] != nil {
						bucketHit.Url = jwtClaims["url"].(string)
					}
					bucketHit.IPAddress = httpReq.RemoteAddr
					bucketHit.UserAgent = httpReq.UserAgent()
					bucketHit.Code = utils.GetUnixTimestamp()

					bucketHit.Title = jwtClaims["Email"].(string)
					if len(newsletterList) == 1 {
						bucketHit.Title = fmt.Sprintf("%v newsletter: %v ", bucketHit.Title, newsletterList[0].Title)
					}

					emailPixelRE := regexp.MustCompile(`^[a-zA-Z0-9][-_.a-zA-Z0-9]*@[-_.a-zA-Z0-9]+?$`)
					if emailPixelRE.MatchString(bucketHit.Title) {
						bucketHit.Title = fmt.Sprintf("%v IP: %v ", bucketHit.Title, httpReq.RemoteAddr)
					}

					bucketHit.Description = fmt.Sprintf("Referrer: %v", httpReq.Referer())
					bucketHit.Create(&bucketHit)
					//Save Bucket Hit and Reference Newsletter + User

					//Update Newsletter Recipient if Exists
					bucketFollowersList := []buckets.Followers{}
					if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
						err := config.Get().BoltHold.Find(&bucketFollowersList,
							bolthold.Where("Bucket").Eq("Newsletters").And("BucketID").Eq(NewsletterID).
								And("UserID").Eq(UserID),
						)
						return err
					}); err != nil {
						log.Printf(err.Error())
					} else {
						for _, result := range bucketFollowersList {
							result.Workflow = "opened"
							result.Create(&result)
						}
					}
					//Update Newsletter Recipient if Exists

					fileServe("/ui/pixelthumb.png", httpRes, httpReq)
					return
				}
			}
			//Check For Openned Newsletters

			lBlacklisted := false
			sBlacklistedIP := ""
			sBlacklistedUrl := ""
			sBlacklistedHost := ""
			//Check for Blacklisted Requests
			searchResults := []buckets.Blacklists{}
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
					//Blacklist Check
					//check for blackisted fields

					httpReqURL := strings.Replace(httpReq.URL.String(), "//", "/", -1)
					if len(result.Url) > 0 && strings.HasPrefix(httpReqURL, result.Url) {
						if result.Host != "" || result.Referrer != "" || result.Email != "" ||
							result.Mobile != "" || result.Username != "" || result.Method != "" ||
							result.Useragent != "" || result.Remoteaddr != "" || result.Cookie != "" {

							if len(result.Referrer) > 0 && strings.Contains(result.Referrer, httpReq.Referer()) {
								lBlacklisted = result.Access
							}

							if len(result.Host) > 0 && len(remoteHost) > 0 &&
								strings.Contains(result.Host, remoteHost) {
								sBlacklistedHost = result.Host
								lBlacklisted = result.Access
							}

							if len(result.Host) > 0 && strings.HasPrefix(httpReq.Host, result.Host) {
								sBlacklistedHost = result.Host
								lBlacklisted = result.Access
							}

							if len(result.Email) > 0 && strings.Contains(result.Email, httpReq.FormValue("email")) {
								lBlacklisted = result.Access
							}

							if len(result.Mobile) > 0 && strings.Contains(result.Mobile, httpReq.FormValue("mobile")) {
								lBlacklisted = result.Access
							}

							if len(result.Username) > 0 && strings.Contains(result.Username, httpReq.FormValue("username")) {
								lBlacklisted = result.Access
							}

							if len(result.Method) > 0 && strings.HasPrefix(httpReq.Method, result.Method) {
								lBlacklisted = result.Access
							}

							if len(result.Useragent) > 0 && strings.Contains(httpReq.UserAgent(), result.Useragent) {
								lBlacklisted = result.Access
							}

							if len(result.Remoteaddr) > 0 {
								remoteAddr := httpReq.Header.Get("Cf-Connecting-Ip")
								if remoteAddr == "" {
									remoteAddr = strings.TrimSpace(httpReq.RemoteAddr)
								}

								if strings.HasPrefix(remoteAddr, strings.TrimSpace(result.Remoteaddr)) {
									sBlacklistedIP = fmt.Sprintf("%s-%s-", sBlacklistedIP, remoteAddr)
									lBlacklisted = result.Access
								}
							}

							if len(result.Cookie) > 0 {
								for _, cookie := range httpReq.Cookies() {
									if strings.Contains(cookie.String(), result.Cookie) {
										lBlacklisted = result.Access
									}
								}
							}

							if claims := utils.VerifyJWT(httpRes, httpReq); claims != nil {
								if claims["Username"].(string) != "" {
									if len(result.Username) > 0 &&
										strings.Contains(result.Username, claims["Username"].(string)) {
										lBlacklisted = result.Access
									}
								}
							}
						} else {
							lBlacklisted = result.Access
						}

						if lBlacklisted {
							sBlacklistedUrl = result.Url
						}

					}
				}
			}

			//Check For Valid Campaign Here and revert Blacklist if so
			filePath := ""
			fullPath := strings.Replace(httpReq.URL.String(), "//", "/", -1)
			urlPathSlice := strings.Split(fullPath, "/")
			urlPath := fullPath

			searchResultsCampaign := []buckets.Campaigns{}
			if !strings.HasPrefix(urlPath, "/api/") {
				if err := config.Get().BoltHold.Bolt().View(func(tx *bolt.Tx) error {
					err := config.Get().BoltHold.Find(&searchResultsCampaign,
						bolthold.Where("Title").RegExp(
							regexp.MustCompile(`(?im).`)).And("Workflow").Eq("running"),
					)
					return err
				}); err != nil {
					log.Println(err.Error())
				} else {

					urlPathJWT := ""
					if len(urlPathSlice) > 2 {
						urlPathJWT = urlPathSlice[2]
						if !strings.Contains(urlPath, urlPathJWT+"/") {
							urlPathJWT = ""
						}
					}
					if urlPathJWT != "" {
						urlPath = strings.Replace(urlPath, urlPathJWT+"/", "", 1)
					}

					jwtClaims := utils.ValidateJWT(urlPathJWT)
					for _, result := range searchResultsCampaign {

						if strings.HasPrefix(httpReq.Host+urlPath, result.Link) {
							if jwtClaims != nil {

								jwtClaims["cid"] = result.ID
								if jwtToken, err := utils.GenerateJWT(jwtClaims); err == nil {

									campaignPath := strings.Replace(result.Campaign, "campaigns/", "", 1)
									campaignPath = strings.Replace(campaignPath, "/campaign.zip", "", 1)

									urlPath = strings.Replace(httpReq.Host+urlPath, result.Link, "/", 1)
									if strings.HasSuffix(urlPath, "/") {
										cookieMonster := &http.Cookie{
											Name: "token", Value: jwtToken, Path: httpReq.URL.String(),
										}
										http.SetCookie(httpRes, cookieMonster)

										filePath = fmt.Sprintf("/campaigns/%s/index.html", campaignPath)
									} else {
										filePath = fmt.Sprintf("/campaigns/%s%s", campaignPath, urlPath)
									}

									if lBlacklisted {
										if sBlacklistedHost == "" && sBlacklistedUrl == "/" {
											lBlacklisted = false
										} else {
											if !strings.HasPrefix(fullPath, sBlacklistedUrl) {
												lBlacklisted = false
											}
										}

										remoteAddr := httpReq.Header.Get("Cf-Connecting-Ip")
										if remoteAddr == "" {
											remoteAddr = strings.TrimSpace(httpReq.RemoteAddr)
										}

										if !strings.Contains(sBlacklistedIP, remoteAddr) {
											lBlacklisted = false
										}
									}
								} else {
									log.Println("Error Generating Token: " + err.Error())
									lBlacklisted = true
								}
							} else {
								lBlacklisted = true
							}

							// if lBlacklisted {
							// 	log.Printf("Blacklist BLOCK: %v HOST: %v URL: %+v ", httpReq.URL.String(), result, httpReq.Host)
							// } else {
							// 	log.Printf("Blacklist ALLOW: %v HOST: %v URL: %+v ", httpReq.URL.String(), result, httpReq.Host)
							// }
							break
						}
					}
				}
			}
			//Check For Valid Campaign Here and revert Blacklist if so

			if lBlacklisted {
				filePath = "/ui/451.html"
			}

			if filePath != "" {
				fileServe(filePath, httpRes, httpReq)
			} else {
				handler.ServeHTTP(httpRes, httpReq)
			}

		})

	log.Fatal(http.ListenAndServe(config.Get().Address, wrapHandlerBlacklists))
}
