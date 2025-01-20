# CVWO Winter Assignment (SHRINIKET SUBRAMANIAN)

This repo contains the backend (Go) & frontend (Typescript) for my attempt of CVWO's Winter Assignment

Link to deployed application: https://cvwo-assignment-4v24.onrender.com

# Local Installation

The application runs on a PostgreSQL DB that is hosted online with a secret key for access that needs to be provided 
as a DATABASE_URI parameter in a .env file. 

To run the app, the env file should be placed at the root of the repository. The env file should have 2 parameters (DATABASE_URI & SECRET). The SECRET
parameter is used for the signing of JWT Tokens used for the purpose of authenticating the user

A build of the frontend has already been generated and can be found in the backend folder. The relative path for the env file and the build folder should 
be modified before running it locally. 

To install dependencies for the frontend: 
```console
   $ yarn install 
```

To generate a build of the frontend 
```console
   $ yarn build 
```

Copy over the build of the frontend to the backend folder
```console
   $ cp -r build ../backend
```

Run Backend Server 
```console
   $ go run cmd/server/main.go 
```

You may now open the app running on localhost:8000
Alternatively, you may skip this process and access the deployed app on: https://cvwo-assignment-4v24.onrender.com

# User Guide

# Home Page 
Upon successful launch of the application, the unauthenticated user will be able to view all the post but will not be able to like, modify or create any post 
and will have a view-only permission on the site.

You may filter the posts based on category using the slicer on the left hand side between the Nav Bar and the Posts or using the search bar on the top right hand side of the Navigation Bar. 

You may also sort the posts By Newest/By Likes by using the combo box beside the category slicer

# Sign Up 
You may sign up for an account to get started. Click on the Sign Up Button on the top left hand side
For existing users, you may login instead. 

# Log In
Once the account has been successfully registered, you will then be able to log in to the application. 

Do note that once logged in, your login will be stored on the browser storage allowing you to return without re-entering your password when refreshing your browser page. However, this will expire 30 min since you first logged in and the user will have to re-login after that.

# Home Page (Authenticated)
The authenticated user will be able to see & like all the posts on the websites. 

You will be able to delete/modify the details of the posts that YOU have contributed to the page. Do note that you will NOT be able to delete or modify posts contributed by other users of the forum. You can only like these posts. A user can like a post multiple times.

You may also click on the posts to view the full text and scroll to the bottom to add comments to the post. 

There is an add post icon on the bottom right hand side of the page which will open the Create Posts page which you can use to contribute your own posts to the blog site. 
