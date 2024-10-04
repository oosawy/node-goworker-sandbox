package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	writer := os.Stdout

	for {
		scanner.Scan()
		request := scanner.Text()

		id, message, err := parseRequest(request)

		if err != nil {
			reply(writer, id, err.Error())
			continue
		}

		switch message {
		case "hello1":
			reply(writer, id, "world1")
		case "hello2":
			reply(writer, id, "world2")
		case "hello3":
			reply(writer, id, "world3")
		}

	}
}

func parseRequest(s string) (int, string, error) {
	parts := strings.SplitN(s, ",", 2)

	id, err := strconv.Atoi(parts[0])

	if len(parts) < 2 || err != nil {
		return -id, "", fmt.Errorf("invalid request: \"%s\"", s)
	}

	return id, parts[1], nil
}

func reply(w io.Writer, id int, message string) {
	fmt.Fprintf(w, "%d,%s\n", id, message)
}
