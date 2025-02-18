import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import "../css/Create.css";
import Sidebar from "../components/Sidebar";


const API_URL = "http://localhost:8080/api/tickets";

const Create = () => {

  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    contact_info: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกัน Refresh หน้า

    try {
      const response = await axios.post(API_URL, ticketData);
      setMessage("Ticket created successfully");
      setError(null);
      setTicketData({ title: "", description: "", contact_info: "" });
    } catch (err) {
      setMessage(null);
      setError("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", err);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Sidebar />

      <h1 className="fw-bold">Create Ticket </h1>
      <Card className="p-4 border" style={{ width: "700px", height: "500px" }}>
        <Form onSubmit={handleSubmit}>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Your Problem</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={ticketData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={ticketData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Info</Form.Label>
            <Form.Control
              type="email"
              name="contact_info"
              placeholder="Email address"
              value={ticketData.contact_info}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setTicketData({ title: "", description: "", contact_info: "" })}
              style={{ width: "120px", height: "50px", borderRadius: "10px" }}>
              Cancel
            </Button>

            <Button variant="primary" type="submit"
              style={{ width: "140px", height: "50px", borderRadius: "10px" }}>
              Create Ticket
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Create;
