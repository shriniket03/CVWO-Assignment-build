package users

import (
	// "github.com/pkg/errors"
	"fmt"
	"encoding/json"
	"strings"
	"github.com/shriniket03/CRUD/backend/internal/models"
	users "github.com/shriniket03/CRUD/backend/internal/dataaccess"
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/api"
	"net/http"
	"github.com/golang-jwt/jwt/v5"
	"strconv"
	"errors"
	"time"
)

const (
	CreatePostMsg = "posts.CreatePost"
	GettingPosts = "posts.GetPosts"
	ErrRetrieveDatabaseMsg        = "Failed to retrieve database"
	ErrDecodeRequestMsg = "Error Decoding Request"
	SuccessfullyAddedMsg = "Successfully Added Post"
	ErrRetrievePostsMsg = "Error Retrieving Posts"
	ErrEncodeViewMsg              = "Failed to retrieve users"
	SuccessfulListPosts = "Successfully Listed All Posts"
	SuccessfulyDeletedPost = "Successfully Deleted Post"
	SuccessFetchPost = "Successfully Fetched Post"
	SuccessfulUpdatePost = "Successfully Updated Post"
)

func CreatePost(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()
	var inp models.PostInput

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

	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")

	if len(splitToken) != 2 {
		return nil, errors.New(`Unauthorized`)
	}
	
	reqToken = splitToken[1]

	userID , err := verifyToken(reqToken)

	if err != nil {
		return nil, errors.New(`Unauthorized`)
	}

	post, err := users.InsertPost(db,inp,userID)
	data, _ := json.Marshal(post)

	if err != nil {
		return nil, errors.New(`Unable to create Post`)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfullyAddedMsg},
	}, nil

}

func GetSinglePost(w http.ResponseWriter, r*http.Request, txt string) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	i, err := strconv.Atoi(txt)

	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	post, err := users.GetSinglePost(db, i)
	if err != nil {
		return nil, errors.New(ErrRetrievePostsMsg)
	}
	data, err := json.Marshal(post)
	if err!= nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessFetchPost},
	}, nil
}

func GetAllPosts(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	posts, err := users.GetPosts(db)
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
		Messages: []string{SuccessfulListPosts},
	}, nil
}

func DeletePost(w http.ResponseWriter, r*http.Request, txt string) (*api.Response, error) {
	db, err := database.GetDB()

	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	i, err := strconv.Atoi(txt)

	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	reqToken = splitToken[1]

	userID , err := verifyToken(reqToken)

	if err != nil {
		return nil, errors.New(`Unauthorized`)
	}
	_, err = users.PostDeleter(db, i, userID)
	if err != nil {
		return nil, err
	}

	data, _ := json.Marshal("")
	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulyDeletedPost},
	}, nil
}

func LikePost(w http.ResponseWriter, r *http.Request, txt string) (*api.Response, error) {
	db, err := database.GetDB()
	if err != nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	i, err := strconv.Atoi(txt)
	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	reqToken = splitToken[1]

	_ , err = verifyToken(reqToken)

	if err != nil {
		return nil, errors.New(`Unauthorized`)
	}

	post, err := users.ModifyPostLikes(db, i)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(post)
	if err != nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulUpdatePost},
	}, nil
}

func UpdatePost(w http.ResponseWriter, r*http.Request, txt string) (*api.Response, error) {
	db, err := database.GetDB()
	if err!=nil {
		return nil, errors.New(ErrRetrieveDatabaseMsg)
	}

	var inp models.PostInput
	err = json.NewDecoder(r.Body).Decode(&inp)
	if err != nil {
		return nil, errors.New(ErrDecodeRequestMsg)
	}

	err = inp.Validate()
	b, _ := json.Marshal(err)

	if err != nil {
		return nil, errors.New(string(b))
	}

	i, err := strconv.Atoi(txt)
	if err != nil {
		return nil, errors.New(`Error converting parameter to integer`)
	}

	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	reqToken = splitToken[1]

	userID , err := verifyToken(reqToken)

	if err != nil {
		return nil, errors.New(`Unauthorized`)
	}

	post, err := users.PostUpdater(db, inp, i, userID)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(post)
	if err != nil {
		return nil, errors.New(ErrEncodeViewMsg)
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulUpdatePost},
	}, nil

}

func verifyToken(tokenString string) (int,error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
	   return []byte(database.GoDotEnvVariable("SECRET")), nil
	})

	if err != nil {
	   return 0,err
	}
	if !token.Valid {
	   return 0,fmt.Errorf("invalid token")
	}
	claims, _ := token.Claims.(jwt.MapClaims)

	exp := int(claims["exp"].(float64))
	id, _ := claims["id"].(float64)
	ids := int(id)

	if exp < int(time.Now().Unix()) {
		return 0, fmt.Errorf("invalid token")
	}

	return ids, nil
 }