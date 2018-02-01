// package passworddelay
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"passworddelay/api"
	"passworddelay/config"
	"passworddelay/utils"
)

func fileSystem() {
	config.AssetChanReq = make(chan string)
	config.AssetChanResp = make(chan []byte)
	for {
		filename := string(<-config.AssetChanReq)
		fileBytes, fileError := Asset(filename)
		if fileError != nil {
			log.Printf("fileSystem Error: %v\n", fileError.Error())
		}
		config.AssetChanResp <- fileBytes
	}
}

func main() {

	var lDebug bool
	flag.BoolVar(&lDebug, "debug", false, "Debug flag forces no cache")

	utils.Logger("")
	go fileSystem()

	<-time.Tick(time.Second)

	config.Init(nil) //Init Config.yaml
	config.Get().Debug = lDebug
	api.StartRouter()
}

func Start(TIMEZONE, VERSION, COOKIE, DBPATH, OS, OSPATH, ADDRESS string) {
	//OS e.g "ios" or "android"
	//PATH e.g "/sdcard/com.sample.app/"
	var yamlExample = []byte(fmt.Sprintf(`timezone: %v
version: %v
cookie: %v
db: %v
os: %v
path: %v
address: %v
encryption_keys:
  public: /public.pem
  private: /private.pem
`, TIMEZONE, VERSION, COOKIE, DBPATH, OS, OSPATH, ADDRESS))

	utils.Logger(OSPATH)
	go fileSystem()

	config.Init(yamlExample) //Init Config.yaml
	go api.StartRouter()
}

func Stop() {
	sMessage := "stopping service @ " + config.Get().Address
	println(sMessage)
	log.Println(sMessage)
	os.Exit(1)
}
