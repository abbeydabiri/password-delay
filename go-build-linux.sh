#!/bin/bash
#upx appPasswordDelay_linux.elf &&
GOOS=linux GOARCH=amd64 go build -o appPasswordDelay_linux.elf -ldflags "-s -w" && mv appPasswordDelay_linux.elf app/.
