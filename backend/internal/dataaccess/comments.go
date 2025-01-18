package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
	"time"
	"errors"
)

func GetComments(db *database.Database) ([]models.Comment, error) {
	app := db.Ref
	rows, err := app.Query("SELECT Comments.id, Comments.content, Posts.id, username, name,Comments.time FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id")
	if err != nil {
		return []models.Comment{},err
	}
	
	comments := []models.Comment{}

	for rows.Next() {
		var id, post, time int
		var content,username,name string

		err := rows.Scan(&id,&content,&post,&username,&name,&time)
		
		if err != nil {
			return []models.Comment{},err
		}

		comments = append(comments,models.Comment{ID:int(id),AuthName:name,AuthUsername:username,Post:post,Content:content, Time: time})
	}
	app.Close()

	return comments, nil
}

func AddComment(db *database.Database, details models.CommentInput, userID int) (models.Comment, error) {
	app := db.Ref
	time := time.Now().Unix()
	lastInsertId := 0
	err := app.QueryRow(`INSERT INTO Comments (author,post,content,time) VALUES ($1,$2,$3,$4) RETURNING ID`, userID, details.Post, details.Content,int(time)).Scan(&lastInsertId)

	if err != nil {
		return models.Comment{}, err
	}

	row := app.QueryRow("SELECT Comments.id, Comments.content, Posts.id, username, name,Comments.time FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id WHERE Comments.id = $1", lastInsertId)
	var id, post,times int
	var content,username,name string
	err = row.Scan(&id,&content,&post,&username,&name,&times)
	if err != nil {
		return models.Comment{}, err
	}
	app.Close()

	return models.Comment{ID: lastInsertId, AuthName: name, AuthUsername: username, Post:post, Content:content, Time: times}, nil
}

func GetComment(db *database.Database, inp int) (models.Comment, error) {
	app := db.Ref 
	row := app.QueryRow("SELECT Comments.id, Comments.content, Posts.id, username, name, Comments.time FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id WHERE Comments.id = $1", inp)

	var id, post, time int
	var content,username,name string

	err := row.Scan(&id,&content,&post,&username,&name, &time)

	if err != nil {
		return models.Comment{}, err
	}
	app.Close()

	return models.Comment{ID: inp, AuthName: name, AuthUsername: username, Post:post, Content:content, Time: time}, nil
}

func CommentDeleter(db *database.Database, inp int, userID int) (string, error) {
	app := db.Ref

	row := app.QueryRow("SELECT author FROM Comments WHERE id = $1", inp)
	var actID int
	err := row.Scan(&actID)

	if err != nil {
		return "", errors.New(`Unable to extract comment`)
	}

	if actID != userID {
		return "", errors.New(`Unauthorized`)
	}

	_, err = app.Exec("DELETE FROM Comments WHERE id = $1", inp)
	if err!= nil {
		return "", errors.New(`Error deleting comment from DB`)
	}
	app.Close()

	return "",nil
}