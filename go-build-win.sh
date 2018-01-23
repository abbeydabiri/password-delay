#!/bin/bash
GOOS=windows GOARCH=386 go build  -o appPDIA_win.exe -ldflags "-s -w" && upx appPDIA_win.exe && mv appPDIA_win.exe app/.
