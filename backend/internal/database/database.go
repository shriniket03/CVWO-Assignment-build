package database

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
	"log"
	"os"
	"net/url"
)

func GoDotEnvVariable(key string) string {
	// load .env file
	err := godotenv.Load(".env")
	if err != nil {
	  log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}

type Database struct {
	Ref *sql.DB
}

func GetDB() (*Database, error) {
	psqlInfo := GoDotEnvVariable("DATABASE_URI")
	conn, _ := url.Parse(psqlInfo)
	conn.RawQuery = "sslmode=verify-ca;sslrootcert=ca.pem"

	db, err := sql.Open("postgres", conn.String())

	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
  		return nil, err
	}
	fmt.Println("Successfully connected!")
	return &Database{Ref:db}, nil
}

func createTables (db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS Comments (
	id SERIAL PRIMARY KEY,
	author INT, 
	post INT, 
	content TEXT NOT NULL, 
	CONSTRAINT fk_Author FOREIGN KEY(author) REFERENCES Users(id),
	CONSTRAINT fk_Post FOREIGN KEY(post) REFERENCES Posts(id)
	)`

	_, err:= db.Exec(query)
	if err != nil {
		panic(err)
	}

	_,err = db.Exec("INSERT INTO Comments (author,post,content) VALUES (24,49, 'Good job good one')")

	if err != nil {
		panic(err)
	}

	rows, err := db.Query("SELECT * FROM Comments")
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		var id, auth, post int
		var content string
		err = rows.Scan(&id, &auth, &post, &content)
		if err != nil {
			panic(err)
		}

		fmt.Println(id,auth,post,content)
	}


}
