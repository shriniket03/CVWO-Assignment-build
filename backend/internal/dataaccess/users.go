package users

import (
	"github.com/shriniket03/CRUD/backend/internal/database"
	"github.com/shriniket03/CRUD/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
)

func GetUsers(db *database.Database) ([]models.User, error) {
	app := db.Ref
	rows, err := app.Query("SELECT * FROM Users")
	if err != nil {
		return []models.User{},err
	}
	
	users := []models.User{}

	for rows.Next() {
		var a int64
		var b,c,d string
		err = rows.Scan(&a,&b,&c,&d)
		
		if err != nil {
			return []models.User{},err
		}

		users = append(users,models.User{ID:int(a),Name:b,Username:c,Password:d})
	}

	return users, nil
}

func AddUser(db *database.Database, details models.UserInput) (models.User, error) {
	app := db.Ref

	hash, err := bcrypt.GenerateFromPassword([]byte(details.Password),10)
	hashText := string(hash[:])
	if err != nil {
		return models.User{},err
	}

	lastInsertId := 0
	err = app.QueryRow(`INSERT INTO Users (name,username,password) VALUES ($1,$2,$3) RETURNING ID`, details.Name, details.Username, hashText).Scan(&lastInsertId)

	if err != nil {
		return models.User{}, err
	}

	return models.User{ID: lastInsertId, Username: details.Username, Password: hashText, Name:details.Name}, nil
}

func LoginAction (db *database.Database, params models.Login) (string, string) {
	app := db.Ref
	userInp := params.Username
	passInp := params.Password
	var a int
	var b,c string 
	err := app.QueryRow(`SELECT id,username,password FROM Users WHERE username = $1`,userInp).Scan(&a,&c,&b)

	if err!= nil {
		return "", "invalid username"
	}

	err = bcrypt.CompareHashAndPassword([]byte(b), []byte(passInp))

	if err!=nil {
		return "", "Unauthorized"
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{ 
        "username": string(c), 
        "id": a, 
        })
	tokenString, err := token.SignedString([]byte(database.GoDotEnvVariable("SECRET")))

    if err != nil {
		return "", "unable to generate token"
    }

	return tokenString, ""

}
