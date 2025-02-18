package main

import (
	"fmt"
	"helpdesk/internal/config"
	"helpdesk/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// โหลดค่าคอนฟิก
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Println("Error loading config:", err)
		return
	}

	config.ConnectDatabase(cfg)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/api/tickets", handlers.CreateTicket)
	r.GET("/api/tickets", handlers.GetTickets)
	r.PUT("/api/tickets/:id", handlers.UpdateTicketHandler)

	port := cfg.AppPort

	fmt.Println("Server is running on port " + port)
	r.Run(":" + port)
}
