package routes

import (
	"encoding/json"
	"net/http"
	"github.com/shriniket03/CRUD/backend/internal/handlers/users"
	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		r.Get("/users", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.HandleList(w, req)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("400 - Bad Request! Some Error Occurred"))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Post("/users", func(w http.ResponseWriter, req *http.Request) {
			response, err  := users.AddUser(w,req)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.WriteHeader(http.StatusCreated)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
			
		})

		r.Post("/login", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.LoginUser(w, req)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("401 - Unauthorized! Invalid Username/Password"))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)	
			}		
		})

		r.Post("/posts", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.CreatePost(w, req)
			if err != nil {
				if err.Error() == `Unauthorized` {
					w.WriteHeader(http.StatusUnauthorized)
					w.Write([]byte(err.Error()))					
				} else {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(err.Error()))
				}
			} else {
				w.WriteHeader(http.StatusCreated)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Get("/posts", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.GetAllPosts(w, req)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Delete("/posts/{id}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.DeletePost(w,req,chi.URLParam(req, "id"))
			if err != nil {
				if err.Error() == `Unauthorized` {
					w.WriteHeader(http.StatusUnauthorized)
				} else {
					w.WriteHeader(http.StatusBadRequest)
				}
				w.Write([]byte(err.Error()))
			} else {
				w.WriteHeader(http.StatusNoContent)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Get("/posts/{id}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.GetSinglePost(w,req,chi.URLParam(req, "id"))
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Patch("/posts/{id}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.UpdatePost(w,req,chi.URLParam(req,"id"))
			if err != nil {
				if err.Error() != `Unauthorized` {
					w.WriteHeader(http.StatusBadRequest)
				} else {
					w.WriteHeader(http.StatusUnauthorized)
				}
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Patch("/likepost/{id}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.LikePost(w,req,chi.URLParam(req,"id"))
			if err != nil {
				if err.Error() != `Unauthorized` {
					w.WriteHeader(http.StatusBadRequest)
				} else {
					w.WriteHeader(http.StatusUnauthorized)
				}
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Get("/comments", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.GetAllComments(w,req)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Post("/comments", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.CreateComment(w,req)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Get("/comments/{id}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.GetSingleComment(w,req,chi.URLParam(req, "id"))
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
			} else {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})

		r.Delete("/comments/{id}", func(w http.ResponseWriter, req *http.Request) {
			// Delete
			response, err := users.DeleteComment(w,req,chi.URLParam(req, "id"))
			if err != nil {
				if err.Error() == `Unauthorized` {
					w.WriteHeader(http.StatusUnauthorized)
				} else {
					w.WriteHeader(http.StatusBadRequest)
				}
				w.Write([]byte(err.Error()))
			} else {
				w.WriteHeader(http.StatusNoContent)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(response)
			}
		})
	}
}
