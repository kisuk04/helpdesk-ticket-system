package repositories

import (
	"fmt"
	"helpdesk/internal/config"
	"helpdesk/internal/models"
	"log"
	"time"
)

func CreateTicket(ticket *models.Ticket) error {
	query := `INSERT INTO tickets (title, description, contact_info, status, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	err := config.DB.QueryRow(query,
		ticket.Title, ticket.Description, ticket.ContactInfo,
		"Pending", time.Now(), time.Now()).Scan(&ticket.ID)

	return err

}

func GetAllTickets(status, sortBy, order string) ([]models.Ticket, error) {
	log.Printf("Received Params - Status: %s, SortBy: %s, Order: %s", status, sortBy, order)

	query := `SELECT id, title, description, contact_info, status, created_at, updated_at FROM tickets WHERE 1=1`
	args := []interface{}{}
	placeholderCount := 1

	if status != "" {
		query += fmt.Sprintf(" AND LOWER(status) COLLATE \"C\" = LOWER($%d) COLLATE \"C\"", placeholderCount)
		args = append(args, status)
		placeholderCount++
	}

	sortFields := map[string]string{
		"status":     "LOWER(status) COLLATE \"C\"",
		"updated_at": "updated_at",
		"created_at": "created_at",
	}
	orderDirections := map[string]string{
		"asc":  "ASC",
		"desc": "DESC",
	}

	sortColumn := "created_at"
	if val, ok := sortFields[sortBy]; ok {
		sortColumn = val
	}

	orderDirection := "ASC"
	if val, ok := orderDirections[order]; ok {
		orderDirection = val
	}

	query += fmt.Sprintf(" ORDER BY %s %s", sortColumn, orderDirection)

	log.Printf("Executing Query: %s", query)

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		log.Printf("Error fetching tickets: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tickets []models.Ticket
	for rows.Next() {
		var ticket models.Ticket
		err := rows.Scan(&ticket.ID, &ticket.Title, &ticket.Description, &ticket.ContactInfo, &ticket.Status, &ticket.CreatedAt, &ticket.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning ticket: %v", err)
			return nil, err
		}
		tickets = append(tickets, ticket)
	}

	return tickets, nil
}

func UpdateTicket(id int, ticket models.Ticket) error {
	var currentTicket models.Ticket
	err := config.DB.QueryRow(`
        SELECT title, description, contact_info FROM tickets WHERE id = $1
    `, id).Scan(&currentTicket.Title, &currentTicket.Description, &currentTicket.ContactInfo)

	if err != nil {
		return fmt.Errorf("failed to fetch current ticket data: %v", err)
	}

	// ถ้า Title, Description และ Contact Info ไม่ได้ถูกส่งมา ให้ใช้ค่าปัจจุบัน
	if ticket.Title == "" {
		ticket.Title = currentTicket.Title
	}
	if ticket.Description == "" {
		ticket.Description = currentTicket.Description
	}
	if ticket.ContactInfo == "" {
		ticket.ContactInfo = currentTicket.ContactInfo
	}

	// อัปเดตข้อมูลทั้งหมดในฐานข้อมูล
	query := `
        UPDATE tickets 
        SET title = $1, description = $2, contact_info = $3, status = $4, updated_at = NOW()
        WHERE id = $5
    `

	result, err := config.DB.Exec(query, ticket.Title, ticket.Description, ticket.ContactInfo, ticket.Status, id)
	if err != nil {
		return fmt.Errorf("failed to update ticket: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("ticket not found with ID %d", id)
	}

	return nil
}
