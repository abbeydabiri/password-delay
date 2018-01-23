package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"litefinga/config"
)

type Email struct {
	From, FromName, Replyto,
	To, Subject, Message string
	BCC, CC []string
}

func SendEmail(email Email, mySMTP SMTP) string {

	if email.To == "" || email.Subject == "" || email.Message == "" {
		return "either To, Subject or Message fields is blank/empty"
	}

	if mySMTP.Server == "" {
		mySMTP.Port = config.Get().Mailer.Port
		mySMTP.Server = config.Get().Mailer.Server
		mySMTP.Username = config.Get().Mailer.Username
		mySMTP.Password = config.Get().Mailer.Password
	}

	if email.From == "" {
		email.From = mySMTP.Username
	}

	if email.FromName == "" {
		email.FromName = config.Get().Mailer.FromName
	}

	emailSender := fmt.Sprintf("%s <%s>", email.FromName, email.From)

	var messageList []EMailMessage
	messageList = append(messageList,
		EMailMessage{
			Attachment: "",
			To:         email.To,
			From:       emailSender,
			Cc:         email.CC, Bcc: email.BCC, Replyto: email.Replyto,
			Subject: email.Subject,
			Content: email.Message,
		})
	mailer := Mailer{mySMTP, messageList}

	// log.Printf(" - - -- - - - -- - -- - --- - \n Mail:  %v ", mySMTP)
	//return ""

	sMessage := mailer.CheckMail()
	if len(sMessage) > 0 {
		log.Printf(sMessage)
		return sMessage
	}

	sMessage = mailer.SendMail()
	if len(sMessage) > 0 {
		log.Printf(sMessage)
		return sMessage
	}

	return sMessage
}

func SendEmailWithSendInBlue(email Email) bool {

	if email.To == "" || email.Subject == "" || email.Message == "" {
		return false
	}

	if email.From == "" {
		email.From = config.Get().Mailer.Username
	}

	if email.FromName == "" {
		email.FromName = config.Get().Mailer.FromName
	}

	sendinBlueMessage := make(map[string]interface{})
	sendinBlueMessage["to"] = map[string]string{email.To: email.To}
	sendinBlueMessage["from"] = []string{email.From, email.FromName}
	sendinBlueMessage["subject"] = email.Subject
	sendinBlueMessage["html"] = email.Message

	jsonBytes, err := json.Marshal(sendinBlueMessage)
	if err != nil {
		log.Println(err)
		return false
	}

	if len(jsonBytes) == 0 {
		return false
	}

	httpReq, _ := http.NewRequest("POST", "https://api.sendinblue.com/v2.0/email", bytes.NewBuffer(jsonBytes))
	httpReq.Header.Add("Content-Type", "application/json")
	httpReq.Header.Add("Content-Length", strconv.Itoa(len(jsonBytes)))
	httpReq.Header.Add("api-key", config.Get().SENDINBLUE)

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		log.Println("HttpPostJSON error: " + err.Error())
		return false
	}

	resBody, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()

	log.Println("resBody: " + string(resBody))
	return true
}
