package utils

import (
	"fmt"
	"net/http"
	"time"

	"litefinga/config"

	jwt "github.com/dgrijalva/jwt-go"
)

//Turn user details into a hashed token that can be used to recognize the user in the future.
func GenerateJWT(claims jwt.MapClaims) (token string, err error) {

	// create a signer for rsa 256

	t := jwt.NewWithClaims(jwt.GetSigningMethod("RS256"), claims)
	pub, err := jwt.ParseRSAPrivateKeyFromPEM(config.Get().Encryption.Private)
	if err != nil {
		return
	}

	token, err = t.SignedString(pub)
	if err != nil {
		return
	}

	return
}

func ValidateJWT(jwtToken string) (claims jwt.MapClaims) {
	token, _ := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		publicKey, _ := jwt.ParseRSAPublicKeyFromPEM(config.Get().Encryption.Public)
		return publicKey, nil
	})

	if token != nil {
		myClaims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			claims = myClaims
		}
	}
	return
}

func VerifyJWT(httpRes http.ResponseWriter, httpReq *http.Request) (claims jwt.MapClaims) {

	monsterCookie, err := httpReq.Cookie(config.Get().COOKIE)
	if err == nil {
		token, _ := jwt.Parse(monsterCookie.Value, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			publicKey, _ := jwt.ParseRSAPublicKeyFromPEM(config.Get().Encryption.Public)
			return publicKey, nil
		})

		if token != nil {
			myClaims, ok := token.Claims.(jwt.MapClaims)
			if ok && token.Valid {
				claims = myClaims
			}
		}
	}

	if claims == nil {
		cookieMonster := &http.Cookie{
			Name: config.Get().COOKIE, Value: "deleted", Path: "/",
			Expires: time.Now().Add(-(time.Hour * 24 * 30 * 12)), // set the expire time
		}

		http.SetCookie(httpRes, cookieMonster)
		// httpReq.AddCookie(cookieMonster)
	}

	return
}
