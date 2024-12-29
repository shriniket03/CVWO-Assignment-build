package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
)

func GetComments(db *database.Database) ([]models.Comment, error) {
	app := db.Ref
	rows, err := app.Query("SELECT Comments.id, Comments.content, Posts.id, username, name FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id")
	if err != nil {
		return []models.Comment{},err
	}
	
	comments := []models.Comment{}

	for rows.Next() {
		var id, post int
		var content,username,name string

		err := rows.Scan(&id,&content,&post,&username,&name)
		
		if err != nil {
			return []models.Comment{},err
		}

		comments = append(comments,models.Comment{ID:int(id),AuthName:name,AuthUsername:username,Post:post,Content:content})
	}

	return comments, nil
}

func AddComment(db *database.Database, details models.CommentInput) (models.Comment, error) {
	app := db.Ref

	lastInsertId := 0
	err := app.QueryRow(`INSERT INTO Comments (author,post,content) VALUES ($1,$2,$3) RETURNING ID`, details.Author, details.Post, details.Content).Scan(&lastInsertId)

	if err != nil {
		return models.Comment{}, err
	}

	row := app.QueryRow("SELECT Comments.id, Comments.content, Posts.id, username, name FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id WHERE Comments.id = $1", lastInsertId)
	var id, post int
	var content,username,name string
	err = row.Scan(&id,&content,&post,&username,&name)
	if err != nil {
		return models.Comment{}, err
	}

	return models.Comment{ID: lastInsertId, AuthName: name, AuthUsername: username, Post:post, Content:content}, nil
}

func GetComment(db *database.Database, inp int) (models.Comment, error) {
	app := db.Ref 
	row := app.QueryRow("SELECT Comments.id, Comments.content, Posts.id, username, name FROM Comments INNER JOIN Posts ON Comments.post = Posts.id INNER JOIN Users ON Comments.author = Users.id WHERE Comments.id = $1", inp)

	var id, post int
	var content,username,name string

	err := row.Scan(&id,&content,&post,&username,&name)

	if err != nil {
		return models.Comment{}, err
	}

	return models.Comment{ID: inp, AuthName: name, AuthUsername: username, Post:post, Content:content}, nil
}

func CommentDeleter(db *database.Database, inp int) (string, error) {
	app := db.Ref
	_, err := app.Exec("DELETE FROM Comments WHERE id = $1", inp)

	if err!= nil {
		return "", err
	}

	return "",nil
}