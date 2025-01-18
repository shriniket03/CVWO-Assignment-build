package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/router"
	"github.com/shriniket03/CRUD/backend/internal/database"
)

func main() {
	r := router.Setup()
	port := database.GoDotEnvVariable("PORT")
	fmt.Println(port)
	fmt.Print("Listening on port 8000 at http://localhost:8000!")
	log.Fatalln(http.ListenAndServe(":8000", r))
}


