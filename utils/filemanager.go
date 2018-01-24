package utils

import (
	"archive/zip"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"fmt"

	"strings"

	"passworddelay/config"
)

func GetFileExt(base64String string) (fileExt, fileType string) {
	switch {
	case strings.HasPrefix(base64String, "data:image/gif;"):
		fileExt = ".gif"
	case strings.HasPrefix(base64String, "data:image/png;"):
		fileExt = ".png"
	case strings.HasPrefix(base64String, "data:image/jpg;"):
		fileExt = ".jpg"
	case strings.HasPrefix(base64String, "data:image/jpeg;"):
		fileExt = ".jpeg"
	}

	fileExtList := map[string]bool{".gif": true, ".png": true, ".jpg": true, ".jpeg": true}
	if fileExtList[fileExt] {
		fileType = "images"
	}

	return
}

func ListDir(dirPath string) ([]string, error) {
	return config.AssetDir(dirPath)
}

func CreateDir(dirPath string) error {
	_, err := os.Stat(config.Get().Path + dirPath)
	if err != nil {
		if os.IsNotExist(err) {
			err = os.MkdirAll(config.Get().Path+dirPath, 0777)
		} else {
			log.Println("Failed Create Directory", ":", err)
			return err
		}
	}
	return err
}

func RemoveFileDir(dirPath string) {
	_, err := os.Stat(config.Get().Path + dirPath)
	if err == nil {
		os.RemoveAll(config.Get().Path + dirPath)
	}
}

func SaveFile(fileName, fileType string, fileBytes []byte) string {

	if fileName == "" {
		return ""
	}

	if fileType == "" {
		return ""
	}

	filePath := fmt.Sprintf("%s/%d/%d/%d", fileType, time.Now().Year(), time.Now().Month(), time.Now().Day())
	return SaveFileToPath(fileName, filePath, fileBytes)
}

func SaveFileToPath(fileName, filePath string, fileBytes []byte) string {

	if fileName == "" || filePath == "" {
		return ""
	}

	CreateDir(filePath)

	filePathName := fmt.Sprintf("%s/%s", filePath, fileName)
	if len(fileBytes) > 0 {
		file, err := os.Create(config.Get().Path + filePathName)
		defer file.Close()
		if err != nil {
			log.Println("Failed Create Error", ":", err)
			return ""
		}
		_, err = file.Write(fileBytes)

		if err != nil {
			log.Println("File Write Error: ", err)
			return ""
		}
	}

	return filePathName
}

func ZipExtract(archive, target string) error {
	reader, err := zip.OpenReader(archive)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(target, 0755); err != nil {
		return err
	}

	for _, file := range reader.File {
		path := filepath.Join(target, file.Name)
		if file.FileInfo().IsDir() {
			os.MkdirAll(path, file.Mode())
			continue
		}

		fileReader, err := file.Open()
		if err != nil {

			if fileReader != nil {
				fileReader.Close()
			}

			return err
		}

		targetFile, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		if err != nil {
			fileReader.Close()

			if targetFile != nil {
				targetFile.Close()
			}

			return err
		}

		if _, err := io.Copy(targetFile, fileReader); err != nil {
			fileReader.Close()
			targetFile.Close()

			return err
		}

		fileReader.Close()
		targetFile.Close()
	}

	return nil
}

func ZipCompress(source, target string, keepHierarchy bool) error {
	zipfile, err := os.Create(target)
	if err != nil {
		return err
	}
	defer zipfile.Close()

	archive := zip.NewWriter(zipfile)
	defer archive.Close()

	info, err := os.Stat(source)
	if err != nil {
		return nil
	}

	var baseDir string
	if keepHierarchy && info.IsDir() {
		baseDir = filepath.Base(source)
	}

	filepath.Walk(source, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !keepHierarchy && source == path {
			return nil
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}

		if keepHierarchy && baseDir != "" {
			header.Name = filepath.Join(baseDir, strings.TrimPrefix(path, source))
		}

		if info.IsDir() {
			header.Name += string(os.PathSeparator)
		} else {
			header.Method = zip.Deflate
		}

		writer, err := archive.CreateHeader(header)
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()
		_, err = io.Copy(writer, file)
		return err
	})

	return err
}
