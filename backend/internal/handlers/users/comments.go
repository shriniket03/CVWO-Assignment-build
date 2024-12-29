package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"errors"
	"encoding/json"
	"github.com/shriniket03/CRUD/backend/internal/api"
	users "github.com/shriniket03/CRUD/backend/internal/dataaccess"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/models"
	"strconv"
)

const (
	SuccessfullyCreatedComment = `Successfully added comment`
	SuccessfulListComments = `Successfully listed all comments`
	SuccessfulFetchComment = `Successfully fetched single comment`
	SuccessfulDeletion = `Successfully Deleted Comment`
)

func GetAllComments(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	posts, err := users.GetComments(db)
	if err != nil {
		return nil, errors.New(ErrRetrievePostsMsg)
	}

	data, err := json.Marshal(posts)
	if err != nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListComments},
	}, nil
}

func GetSingleComment(w http.ResponseWriter, r *http.Request, inp string) (*api.Response, error) {
	db, err := database.GetDB()
	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	i, err := strconv.Atoi(inp)

	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	comment, err := users.GetComment(db, i)

	if err != nil {
		return nil, errors.New(`Unable to retrieve comment`)
	}

	data, err := json.Marshal(comment)
	if err!= nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulFetchComment},
	}, nil
}

func CreateComment(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()
	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	var inp models.CommentInput

	err = json.NewDecoder(r.Body).Decode(&inp)
	
	if err != nil {
		return nil, errors.New(ErrDecodeRequestMsg)
	}

	err = inp.Validate()
	b, _ := json.Marshal(err)

	if err != nil {
		return nil, errors.New(string(b))	
	}

	comment, err := users.AddComment(db,inp)
	if err != nil {
		return nil, errors.New(`Unable to Add Comment to DB`)
	}

	data, _ := json.Marshal(comment)
	
	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfullyCreatedComment},
	}, nil
}

func DeleteComment(w http.ResponseWriter, req *http.Request, inp string) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	i, err := strconv.Atoi(inp)

	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	_, err = users.CommentDeleter(db, i)
	if err != nil {
		return nil, errors.New(`Error Deleting Comment from DB`)
	}

	data, _ := json.Marshal("")
	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulDeletion},
	}, nil
}