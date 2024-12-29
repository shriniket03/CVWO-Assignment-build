package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
)

func InsertPost (db *database.Database, details models.PostInput, userID string) (models.Post, error) {
	app := db.Ref
	tagInp := details.Tag
	contentInp := details.Content

	lastInsertId := 0
	intUserID := 0 
	err := app.QueryRow(`SELECT id FROM Users WHERE username = $1`, userID).Scan(&intUserID)
	if err != nil {
		return models.Post{}, err
	}

	err = app.QueryRow(`INSERT INTO Posts (author,likes,tag,content) VALUES ($1,0,$2,$3) RETURNING ID`, intUserID, tagInp, contentInp).Scan(&lastInsertId)

	if err != nil {
		return models.Post{}, err
	}

	return models.Post{ID: lastInsertId, Author: intUserID, Likes: 0, Tag:tagInp, Content: contentInp}, nil
}

func GetPosts(db *database.Database) ([]models.PostInfo, error) {
	app := db.Ref
	rows, err := app.Query("SELECT Posts.id,name,username,likes,tag,content FROM Posts INNER JOIN Users ON Posts.author = Users.id")
	if err != nil {
		return []models.PostInfo{},err
	}
	
	posts := []models.PostInfo{}

	for rows.Next() {
		var name,username,tag,content string
		var id,likes int

		err = rows.Scan(&id,&name,&username,&likes,&tag,&content)
		
		if err != nil {
			return []models.PostInfo{},err
		}

		posts = append(posts,models.PostInfo{ID:int(id),AuthName:name,AuthUsername:username,Likes:likes,Tag:tag,Content:content})
	}

	return posts, nil
}

func GetSinglePost(db *database.Database, inp int) (models.PostInfo, error) {
	app := db.Ref 
	row := app.QueryRow("SELECT Posts.id,name,username,likes,tag,content FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", inp)

	var name,username,tag,content string
	var id,likes int

	err := row.Scan(&id,&name,&username,&likes,&tag,&content)

	if err != nil {
		return models.PostInfo{}, err
	}

	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content}, nil
}

func PostDeleter(db *database.Database, inp int) (string, error) {
	app := db.Ref
	_, err := app.Exec("DELETE FROM Posts WHERE id = $1", inp)

	if err!= nil {
		return "", err
	}

	return "",nil
}

func PostUpdater (db *database.Database, details models.PostChange, inp int) (models.PostInfo, error) {
	app := db.Ref 
	likesUpdate := details.Likes
	contentUpdate := details.Content
	tagUpdate := details.Tag

	_, err := app.Exec("UPDATE Posts SET likes = $1, content = $2, tag = $3 WHERE id = $4", likesUpdate,contentUpdate,tagUpdate,inp)

	if err != nil {
		return models.PostInfo{}, err
	}

	row := app.QueryRow("SELECT Posts.id,name,username,likes,tag,content FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", inp)

	var name,username,tag,content string
	var id,likes int

	err = row.Scan(&id,&name,&username,&likes,&tag,&content)

	if err != nil {
		return models.PostInfo{}, err
	}

	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content}, nil
}