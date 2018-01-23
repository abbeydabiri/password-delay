package utils

import (
	"log"
	"math"
	"math/rand"
	"os/exec"
	"time"

	"fmt"
	"html"
	"strconv"
	"strings"
	"unicode"

	"bytes"
	"html/template"
	"io/ioutil"
	"net/http"
	"regexp"

	"litefinga/config"
)

type SortUINT64 []uint64

func (a SortUINT64) Len() int           { return len(a) }
func (a SortUINT64) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a SortUINT64) Less(i, j int) bool { return a[i] < a[j] }

// sort.Sort(SortUINT64{}) ASC
// sort.Reverse(SortUINT64{}) DES

func GetTemplate(filepath string) (sMessage string, emailTemplate *template.Template) {
	dirpath := "/ui/templates/"
	if strings.HasPrefix(filepath, "newsletter/") {
		dirpath = "/"
	}

	if emailBytes, err := config.Asset(dirpath + filepath); err != nil {
		sMessage = "Error Accessing Email Template " + err.Error()
	} else {
		if emailBytes == nil {
			sMessage = "Email Template File is empty"
		} else {
			if emailTemplate, err = template.New("template").Parse(string(emailBytes)); err != nil {
				sMessage = "Error Parsing Template " + err.Error()
			}
		}
	}
	return
}

func CamelCase(word string) string {
	return strings.ToUpper(word[:1]) + strings.ToLower(word[1:])
}

func ExecCommand(cmd string, args []string) (cmdOutput []byte, err error) {
	cmdOutput, err = exec.Command(cmd, args...).CombinedOutput()
	if err != nil {
		log.Printf("%s", err.Error())
	}
	if len(cmdOutput) > 0 {
		log.Printf("%s", cmdOutput)
	}
	return
}

func ThousandSeperator(num float64) string {
	numString := fmt.Sprintf("%v", num)
	re := regexp.MustCompile("(\\d+)(\\d{3})")
	for {
		formatted := re.ReplaceAllString(numString, "$1,$2")
		if formatted == numString {
			return formatted
		}
		numString = formatted
	}
}

func Round(input float64) float64 {
	if input < 0 {
		return math.Ceil(input - 0.5)
	}
	return math.Floor(input + 0.5)
}

func RoundUp(input float64, places int) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * input
	round = math.Ceil(digit)
	newVal = round / pow
	return
}

func RoundDown(input float64, places int) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * input
	round = math.Floor(digit)
	newVal = round / pow
	return
}

func HttpPostJSON(jsonURL string, jsonBytes []byte) []byte {
	if len(jsonBytes) == 0 {
		return nil
	}

	httpReq, _ := http.NewRequest("POST", jsonURL, bytes.NewBuffer(jsonBytes))
	httpReq.Header.Add("Content-Type", "application/json")
	httpReq.Header.Add("Content-Length", strconv.Itoa(len(jsonBytes)))

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		println("HttpPostJSON error: " + err.Error())
		return nil
	}

	resBody, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	return resBody
}

func TrimEscape(value string) string {
	return strings.TrimSpace(html.EscapeString(value))
}

func ReverseString(value string) string {
	// Convert string to rune slice.
	// ... This method works on the level of runes, not bytes.
	data := []rune(value)
	result := []rune{}

	// Add runes in reverse order.
	for i := len(data) - 1; i >= 0; i-- {
		result = append(result, data[i])
	}

	// Return new string.
	return string(result)
}

func SpaceMap(str string) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsSpace(r) {
			return -1
		}
		return r
	}, str)
}

func SpaceReplace(str string, pattern rune) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsSpace(r) {
			return pattern
		}
		return r
	}, str)
}

func RandomString(strlen int) string {
	rand.Seed(time.Now().UTC().UnixNano())
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, strlen)
	for i := 0; i < strlen; i++ {
		result[i] = chars[rand.Intn(len(chars))]
	}
	return string(result)
}

func Int64EncodeToString(nControl int64) string {

	var ALPHABET = "23456789BCDFGHJKLMNPQRSTVWXYZ"
	var BASE = int64(29)

	var sEncoded string
	for nControl >= BASE {
		nDiv := nControl / BASE
		nMod := nControl - (BASE * nDiv)

		sEncoded = string(ALPHABET[nMod]) + sEncoded
		nControl = nDiv
	}

	if nControl > 0 {
		sEncoded = string(ALPHABET[nControl]) + sEncoded
	}

	return sEncoded
}

func StringDecodeToInt64(sEncoded string) int64 {

	var ALPHABET = "23456789BCDFGHJKLMNPQRSTVWXYZ"

	var nMulti int
	var nDecoded int64

	nAlphaLen := len(ALPHABET)
	nMulti = 1
	for len(sEncoded) > 0 {

		sDigit := string(sEncoded[len(sEncoded)-1])
		nStrPos := strings.Index(ALPHABET, sDigit)
		nDecoded += int64(nMulti * nStrPos)
		nMulti = nMulti * nAlphaLen
		sEncoded = sEncoded[0 : len(sEncoded)-1]
	}

	return nDecoded
}

func TitleToURL(Title string) (Url string) {
	reg_leadclose_whtsp := regexp.MustCompile(`^[\s\p{Zs}]+|[\s\p{Zs}]+$`)
	reg_inside_whtsp := regexp.MustCompile(`[\s\p{Zs}]{2,}`)

	Title = reg_leadclose_whtsp.ReplaceAllString(strings.ToLower(Title), "")
	Title = reg_inside_whtsp.ReplaceAllString(Title, " ")

	reg_alpha, err := regexp.Compile("[^a-zA-Z0-9-]+")
	if err != nil {
		log.Print(err)
	}
	Url = reg_alpha.ReplaceAllString(Title, "")
	return
}

func NairaToKobo(fNumber float64) (iNumber int64) {
	sNumber := strings.Replace(fmt.Sprintf("%.2f", fNumber), ".", "", 1)
	iNumber, _ = strconv.ParseInt(sNumber, 10, 64)
	return
}

func StringToFloat(sNumber string) (fNumber float64) {
	reg_leadclose_whtsp := regexp.MustCompile(`^[\s\p{Zs}]+|[\s\p{Zs}]+$`)
	reg_inside_whtsp := regexp.MustCompile(`[\s\p{Zs}]{2,}`)

	sNumber = reg_leadclose_whtsp.ReplaceAllString(strings.ToLower(sNumber), "")
	sNumber = reg_inside_whtsp.ReplaceAllString(sNumber, " ")

	if strings.HasSuffix(sNumber, "-") {
		sNumber = sNumber[:len(sNumber)-1]
	}

	if strings.Contains(sNumber, ",") {
		sNumber = strings.Replace(sNumber, ",", "", -1)
	}

	reg_alpha, err := regexp.Compile("[^-0-9.]")
	if err != nil {
		log.Print(err)
	}

	sNumber = reg_alpha.ReplaceAllString(sNumber, "")
	fNumber, _ = strconv.ParseFloat(strings.TrimSpace(sNumber), 10)
	return
}
