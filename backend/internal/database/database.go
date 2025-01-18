package database

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os"
	"net/url"
)

// func GoDotEnvVariable(key string) string {
// 	// load .env file
// 	err := godotenv.Load("../../.env")
// 	if err != nil {
// 	  log.Fatalf("Error loading .env file")
// 	}
// 	return os.Getenv(key)
// }

type Database struct {
	Ref *sql.DB
}

func GetDB() (*Database, error) {
	psqlInfo := os.Getenv("DATABASE_URI")
	fmt.Println(psqlInfo)
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
	// query := `CREATE TABLE IF NOT EXISTS Comments (
	// id SERIAL PRIMARY KEY,
	// author INT, 
	// post INT, 
	// content TEXT NOT NULL, 
	// CONSTRAINT fk_Author FOREIGN KEY(author) REFERENCES Users(id),
	// CONSTRAINT fk_Post FOREIGN KEY(post) REFERENCES Posts(id)
	// )`
	// query := `ALTER TABLE Posts
	// ADD time bigint`
	// _, err:= db.Exec(query)
	// if err != nil {
	// 	panic(err)
	// }
	// _, err := db.Exec("DELETE FROM Posts")
	// _, err = db.Exec("DELETE FROM Comments")
	// _,err = db.Exec("INSERT INTO Comments (author,post,content,time) VALUES (24,49, 'Good job good one',1000)")

	// if err != nil {
	// 	panic(err)
	// }

	// rows, err := db.Query("SELECT * FROM Comments")
	// if err != nil {
	// 	panic(err)
	// }

	// for rows.Next() {
	// 	var id, auth, post,time int
	// 	var content string
	// 	err = rows.Scan(&id, &auth, &post, &content, &time)
	// 	if err != nil {
	// 		panic(err)
	// 	}

	// 	fmt.Println(id,auth,post,content,time)
	// }


}
