package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
	"time"
	"errors"
)

func InsertPost (db *database.Database, details models.PostInput, userID int) (models.PostInfo, error) {
	app := db.Ref
	tagInp := details.Tag
	contentInp := details.Content
	time := time.Now().Unix()

	lastInsertId := 0
	err := app.QueryRow(`INSERT INTO Posts (author,likes,tag,content,time) VALUES ($1,0,$2,$3,$4) RETURNING ID`, userID, tagInp, contentInp,time).Scan(&lastInsertId)

	if err != nil {
		return models.PostInfo{}, err
	}

	row := app.QueryRow("SELECT Posts.id,name,username,likes,tag,content,time FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", lastInsertId)

	var name,username,tag,content string
	var id,likes,times int

	err = row.Scan(&id,&name,&username,&likes,&tag,&content,&times)

	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to get Post Info`)
	}

	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content,Time:times}, nil
}

func GetPosts(db *database.Database) ([]models.PostInfo, error) {
	app := db.Ref
	rows, err := app.Query("SELECT Posts.id,name,username,likes,tag,content,time FROM Posts INNER JOIN Users ON Posts.author = Users.id")
	if err != nil {
		return []models.PostInfo{},err
	}
	
	posts := []models.PostInfo{}

	for rows.Next() {
		var name,username,tag,content string
		var id,likes,time int

		err = rows.Scan(&id,&name,&username,&likes,&tag,&content,&time)
		
		if err != nil {
			return []models.PostInfo{},err
		}

		posts = append(posts,models.PostInfo{ID:int(id),AuthName:name,AuthUsername:username,Likes:likes,Tag:tag,Content:content,Time:time})
	}

	return posts, nil
}

func GetSinglePost(db *database.Database, inp int) (models.PostInfo, error) {
	app := db.Ref 
	row := app.QueryRow("SELECT Posts.id,name,username,likes,tag,content,time FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", inp)

	var name,username,tag,content string
	var id,likes,time int

	err := row.Scan(&id,&name,&username,&likes,&tag,&content,&time)

	if err != nil {
		return models.PostInfo{}, err
	}

	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content,Time:time}, nil
}

func PostDeleter(db *database.Database, inp int, userID int) (string, error) {
	app := db.Ref
	row := app.QueryRow("SELECT author FROM Posts WHERE id = $1", inp)
	var actID int
	err := row.Scan(&actID)
	if err != nil {
		return "", errors.New(`Post does not exist`)
	}
	if actID != userID {
		return "", errors.New(`Unauthorized`)
	}
	_, err = app.Exec("DELETE FROM Posts WHERE id = $1", inp)
	_, err = app.Exec("DELETE FROM Comments WHERE post = $1", inp)

	if err!= nil {
		return "", errors.New(`Unable to delete post`)
	}

	return "",nil
}

func ModifyPostLikes (db *database.Database, inp int) (models.PostInfo, error) {
	app := db.Ref
	row := app.QueryRow("SELECT likes FROM Posts WHERE id = $1", inp)
	var befLikes int 
	err := row.Scan(&befLikes)
	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to extract post`)
	}
	_, err = app.Exec("UPDATE Posts SET likes = $1 WHERE id = $2", befLikes+1,inp)
	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to Update in DB`)
	}

	row = app.QueryRow("SELECT Posts.id,name,username,likes,tag,content,time FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", inp)

	var name,username,tag,content string
	var id,likes,time int

	err = row.Scan(&id,&name,&username,&likes,&tag,&content,&time)

	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to get Post Info`)
	}
	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content,Time:time}, nil
}


func PostUpdater (db *database.Database, details models.PostInput, inp int, userID int) (models.PostInfo, error) {
	app := db.Ref 
	contentUpdate := details.Content
	tagUpdate := details.Tag

	row := app.QueryRow("SELECT author FROM Posts WHERE id = $1", inp)
	var actID int 
	err := row.Scan(&actID)
	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to extract post`)
	}
	if actID != userID {
		return models.PostInfo{}, errors.New(`Unauthorized`)
	}

	_, err = app.Exec("UPDATE Posts SET content = $1, tag = $2 WHERE id = $3", contentUpdate,tagUpdate,inp)

	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to Update in DB`)
	}

	row = app.QueryRow("SELECT Posts.id,name,username,likes,tag,content,time FROM Posts INNER JOIN Users ON Posts.author = Users.id WHERE Posts.id = $1", inp)

	var name,username,tag,content string
	var id,likes,time int

	err = row.Scan(&id,&name,&username,&likes,&tag,&content,&time)

	if err != nil {
		return models.PostInfo{}, errors.New(`Unable to get Post Info`)
	}

	return models.PostInfo{ID: int(id), AuthName: name, AuthUsername:username, Likes:likes, Tag:tag,Content:content,Time:time}, nil
}