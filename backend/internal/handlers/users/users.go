package users

import (
	"encoding/json"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/api"
	users "github.com/shriniket03/CRUD/backend/internal/dataaccess"
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
	"errors"
)

const (
	ListUsers = "users.HandleList"
	AddUsers = "users.AddUser"
	Login = "users.Login"
	SuccessfulListUsersMessage = "Successfully listed users"
	ErrAddingToDB = "Error Adding Record to Database"
	NotUniqueUsername = "Username Already Exists"
	SuccessfulSignInMessage = "Successful Sign-In"
	ErrRetrieveUsersMsg = "Error retrieving User data from DB"
)

func HandleList(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	users, err := users.GetUsers(db)
	if err != nil {
		return nil, errors.New(ErrRetrieveUsersMsg)
	}

	data, err := json.Marshal(users)
	if err != nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListUsersMessage},
	}, nil
}

func LoginUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()
	var inp models.Login

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	err = json.NewDecoder(r.Body).Decode(&inp)

	if err != nil {
		return nil, errors.New(ErrDecodeRequestMsg)
	}

	err = inp.Validate()

	if err != nil {
		return nil, errors.New(`Invalid Username/Password`)
	}

	tokenstr, msg := users.LoginAction(db,inp)

	data, err := json.Marshal(tokenstr)

	if tokenstr == "" {
		return nil, msg
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulSignInMessage},
	}, nil
	
}

func AddUser(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()
	var inp models.UserInput
	
	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	err = json.NewDecoder(r.Body).Decode(&inp)
	
	if err != nil {
		return nil, errors.New(ErrDecodeRequestMsg)
	}

	err = inp.Validate()
	b, _ := json.Marshal(err)

	if err != nil {
		return nil, errors.New(string(b))	
	}

	user, err := users.AddUser(db,inp)
	if err != nil {
		return nil, errors.New(NotUniqueUsername)
	}

	data, _ := json.Marshal(user)

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListUsersMessage},
	}, nil
}

