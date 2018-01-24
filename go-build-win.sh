#!/bin/bash
GOOS=windows GOARCH=386 go build  -o appPasswordDelay_win.exe -ldflags "-s -w" && upx appPasswordDelay_win.exe && mv appPasswordDelay_win.exe app/.
