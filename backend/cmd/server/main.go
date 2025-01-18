package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/router"
	"github.com/joho/godotenv"
)

func main() {
	r := router.Setup()
	port := GoDotEnvVariable("PORT")
	fmt.Print("Listening on port 8000 at http://localhost:8000!")
	log.Fatalln(http.ListenAndServe(":8000", r))
}

func GoDotEnvVariable(key string) string {
	// load .env file
	err := godotenv.Load("../../.env")
	if err != nil {
	  log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}

type Database struct {
	Ref *sql.DB
}