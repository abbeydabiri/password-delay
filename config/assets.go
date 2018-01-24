package config

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func Asset(filename string) (assetByte []byte, assetError error) {
	assetByte = nil
	assetError = nil

	if strings.HasSuffix(filename, "/") {
		assetError = fmt.Errorf("Directory Listing Forbidden!!!")
	} else {
		switch {
		case strings.Compare(filename, "/public.pem") == 0,
			strings.Compare(filename, "/private.pem") == 0,
			strings.HasPrefix(filename, "/ui/"):

			//Send Request down channel
			AssetChanReq <- filename[1:]
			assetByte = <-AssetChanResp
			if len(assetByte) == 0 {
				assetError = fmt.Errorf("File %s not found/is empty", filename[1:])
			}
			//Send Request down channel
		default:
			switch Get().OS {
			case "ios", "android":
				assetByte, assetError = ioutil.ReadFile(Get().Path + filename)
			default:
				assetByte, assetError = ioutil.ReadFile(Get().Path + filename)
			}
		}
	}
	return
}

func AssetDir(fileDir string) (assetString []string, assetError error) {
	filePath := ""
	assetError = nil
	assetString = nil

	switch Get().OS {
	case "ios", "android":
		filePath = Get().Path + fileDir
	default:
		filePath = "." + fileDir
	}
	fileInfos, err := ioutil.ReadDir(filePath)
	assetString = make([]string, len(fileInfos))
	for counter, file := range fileInfos {
		assetString[counter] = file.Name()
	}
	assetError = err
	return
}

func ContentType(filename string) (contentType string) {
	contentType = "text/plain; charset=utf-8"
	switch {
	case strings.HasSuffix(filename, ".apk"):
		contentType = "application/vnd.android.package-archive"

	case strings.HasSuffix(filename, ".js"):
		contentType = "application/javascript"
	case strings.HasSuffix(filename, ".json"):
		contentType = "application/json"
	case strings.HasSuffix(filename, ".pdf"):
		contentType = "application/pdf"
	case strings.HasSuffix(filename, ".zip"):
		contentType = "application/zip"

	case strings.HasSuffix(filename, ".xls"):
		contentType = "application/vnd.ms-excel"
	case strings.HasSuffix(filename, ".xlsx"):
		contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

	case strings.HasSuffix(filename, ".html"):
		contentType = "text/html"
	case strings.HasSuffix(filename, ".css"):
		contentType = "text/css"

	case strings.HasSuffix(filename, ".doc"):
		contentType = "application/msword"

	case strings.HasSuffix(filename, ".png"):
		contentType = "image/png"
	case strings.HasSuffix(filename, ".jpg"):
		contentType = "image/jpeg"
	case strings.HasSuffix(filename, ".gif"):
		contentType = "image/gif"
	case strings.HasSuffix(filename, ".svg"):
		contentType = "image/svg+xml"

	case strings.HasSuffix(filename, ".mp4"):
		contentType = "video/mp4"
	case strings.HasSuffix(filename, ".webm"):
		contentType = "video/webm"
	case strings.HasSuffix(filename, ".ogg"):
		contentType = "video/ogg"
	case strings.HasSuffix(filename, ".mp3"):
		contentType = "audio/mp3"
	case strings.HasSuffix(filename, ".wav"):
		contentType = "audio/wav"
	}
	return
}
