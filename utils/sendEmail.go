package utils

import (
	"fmt"
	"log"

	"passworddelay/config"
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
