package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/router"
	"os"
)

func main() {
	r := router.Setup()
	port := os.Getenv("PORT")
	fmt.Print("Listening on port 8000 at http://localhost:8000!")
	log.Fatalln(http.ListenAndServe(":"+port, r))
}

