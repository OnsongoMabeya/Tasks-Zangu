package main

import (
	"log"
	"simple-demo/backend/config"
	"simple-demo/backend/routes"
)

func main() {
	// Initialize database
	db, err := config.InitDB()
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}

	// Initialize router
	r := routes.SetupRouter(db)

	// Start server
	r.Run(":8080")
}
