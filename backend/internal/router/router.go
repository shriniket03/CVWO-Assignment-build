package router

import (
	"github.com/shriniket03/CRUD/backend/internal/routes"
	"github.com/go-chi/chi/v5"
	// "github.com/go-chi/cors"
	"os"
	"path/filepath"
	"strings"
	"net/http"
)

func Setup() chi.Router {
	r := chi.NewRouter()
	// r.Use(cors.Handler(cors.Options{
	// 	// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
	// 	AllowedOrigins:   []string{"https://*", "http://*"},
	// 	// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
	// 	AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
	// 	AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	// 	ExposedHeaders:   []string{"Link"},
	// 	AllowCredentials: false,
	// 	MaxAge:           300, // Maximum value not ignored by any of major browsers
	//   }))
	setUpRoutes(r)
	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "../../build"))
	// filesDir := http.Dir(filepath.Join(workDir, "./build"))
	FileServer(r, "/", filesDir)
	return r
}

func setUpRoutes(r chi.Router) {
	r.Group(routes.GetRoutes())
}


// FileServer conveniently sets up a http.FileServer handler to serve
// static files from a http.FileSystem.
func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}