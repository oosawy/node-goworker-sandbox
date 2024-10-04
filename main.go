package main

import (
	"bufio"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	writer := os.Stdout

	for {
		scanner.Scan()
		message := scanner.Text()

		switch message {
		case "hello":
			writer.Write([]byte("world\n"))
		}

	}
}
