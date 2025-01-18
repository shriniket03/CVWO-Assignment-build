package models

import (
	"fmt"
	"github.com/go-ozzo/ozzo-validation"
)

type User struct {
	ID   int   `json:"id"`
	Name string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserToken struct {
	Username string 
	Token string
}

type UserInput struct {
	Name string
	Username string
	Password string
} 

type Login struct {
	Username string
	Password string
}

type PostInput struct {
	Tag string 
	Content string
}

type Post struct {
	ID int 
	Author int
	Likes int
	Tag string
	Content string
	Time int
}

type PostInfo struct {
	ID int
	AuthUsername string
	AuthName string
	Likes int
	Tag string
	Content string
	Time int 
}

type Comment struct {
	ID int
	Content string 
	Post int 
	AuthUsername string 
	AuthName string
	Time int
}

type CommentInput struct {
	Content string
	Post int 
}

func (u UserInput) Validate() error {
	return validation.ValidateStruct(&u,
		validation.Field(&u.Name, validation.Required, validation.Length(5, 50)),
		validation.Field(&u.Username, validation.Required, validation.Length(5, 50)),
		validation.Field(&u.Password, validation.Required, validation.Length(5, 50)),
	)
}

func (u PostInput) Validate() error {
	return validation.ValidateStruct(&u,
		validation.Field(&u.Tag, validation.Required, validation.Length(5, 50)),
		validation.Field(&u.Content, validation.Required, validation.Length(5, 0)),
	)
}

func (u Login) Validate() error {
	return validation.ValidateStruct(&u,
		validation.Field(&u.Username, validation.Required, validation.Length(5, 50)),
		validation.Field(&u.Password, validation.Required, validation.Length(5, 50)),
	)
}

func (u CommentInput) Validate() error {
	return validation.ValidateStruct(&u,
		validation.Field(&u.Content, validation.Required, validation.Length(1, 0)),
	)
}

func (user *User) Greet() string {
	return fmt.Sprintf("Hello, I am %s", user.Name)
}
