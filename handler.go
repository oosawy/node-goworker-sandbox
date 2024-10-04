package main

import (
	"encoding/json"
	"fmt"
	"io"
)

type MessageType int

const (
	Hello MessageType = iota
)

type Message struct {
	Type MessageType `json:"type"`
}

type HelloRequest struct {
	Message `json:",inline"`
	Name    string `json:"name"`
}

type HelloResponse string

func handleMessage(w io.Writer, id int, message string) {
	var m Message
	err := json.Unmarshal([]byte(message), &m)

	if err != nil {
		reply(w, -id, fmt.Errorf("invalid message"))
		return
	}

	switch m.Type {
	case Hello:
		var m HelloRequest
		err := json.Unmarshal([]byte(message), &m)
		if err != nil {
			reply(w, -id, fmt.Errorf("invalid message"))
			return
		}

		res, err := json.Marshal(HelloResponse("Hello, " + m.Name))
		if err != nil {
			reply(w, -id, err.Error())
			return
		}

		reply(w, id, res)
	default:
		reply(w, -id, "Unknown message type")
	}
}
