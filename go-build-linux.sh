#!/bin/bash
#upx appPDIA_linux.elf &&
GOOS=linux GOARCH=amd64 go build -o appPDIA_linux.elf -ldflags "-s -w" && mv appPDIA_linux.elf app/.
