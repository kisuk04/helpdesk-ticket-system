package handlers

import (
	"fmt"
	"helpdesk/internal/models"
	"helpdesk/internal/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateTicket(c *gin.Context) {
	var ticket models.Ticket

	if err := c.ShouldBindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := repositories.CreateTicket(&ticket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ticket"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Ticket created successfully", "ticket": ticket})
}

func GetTickets(c *gin.Context) {
	status := c.Query("status")
	sortBy := c.Query("sortBy")
	order := c.Query("order")

	tickets, err := repositories.GetAllTickets(status, sortBy, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
		return
	}

	c.JSON(http.StatusOK, tickets)
}

func UpdateTicketHandler(c *gin.Context) {

	idParam := c.Param("id")
	fmt.Println("Received ID:", idParam)

	id, err := strconv.Atoi(idParam)
	if err != nil {
		fmt.Println("Invalid ticket ID:", idParam)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID. Must be an integer."})
		return
	}

	fmt.Println("Converted ID:", id)

	var ticket models.Ticket
	if err := c.ShouldBindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Updating Ticket ID: %d, Data: %+v\n", id, ticket)

	existingTickets, err := repositories.GetAllTickets("", "updated_at", "desc")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
		return
	}
	found := false
	for _, t := range existingTickets {
		if t.ID == id {
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Ticket with ID %d not found", id)})
		return
	}

	validStatuses := map[string]bool{
		"pending":  true,
		"accepted": true,
		"resolved": true,
		"rejected": true,
	}
	if _, isValid := validStatuses[ticket.Status]; !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	// เรียกใช้ฟังก์ชันอัปเดต Ticket
	err = repositories.UpdateTicket(id, ticket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket updated successfully", "ticket": ticket})
}
