package database

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os"
	"net/url"
	"github.com/joho/godotenv"
	"log"
)

func GoDotEnvVariable(key string) string {
	err := godotenv.Load("/etc/secrets/.env")
	// err := godotenv.Load(".env")
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
	if err != nil {
		panic(err)
	}
	return &Database{Ref:db}, nil
}