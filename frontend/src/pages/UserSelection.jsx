import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserSelection = () => {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType === "user") {
      navigate("/mytickets");
    } else if (selectedType === "it-support") {
      navigate("/it-ticket-list");
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="fw-bold mb-2">Select User Type</h2>

      <div className="d-flex gap-4 mt-3">
        <Card
          className={`p-4 text-center d-flex flex-column align-items-center justify-content-center 
            ${selectedType === "user" ? "border-primary shadow-lg" : "border-light"} 
            hover-effect`}
          style={{
            width: "260px",
            height: "320px",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => handleSelect("user")}
        >
          <div className="d-flex flex-column align-items-center">
            <img src="/images/user.png" alt="User" width="100" height="100" className="mb-3" />
            <h4 className="mt-2">User</h4>
          </div>
        </Card>

        <Card
          className={`p-4 text-center d-flex flex-column align-items-center justify-content-center 
            ${selectedType === "it-support" ? "border-primary shadow-lg" : "border-light"} 
            hover-effect`}
          style={{
            width: "260px",
            height: "320px",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => handleSelect("it-support")}
        >
          <div className="d-flex flex-column align-items-center">
            <img src="/images/maintenance.png" alt="IT Support" width="100" height="100" className="mb-3" />
            <h4 className="mt-2">IT Support</h4>
          </div>
        </Card>
      </div>

      <Button
        variant="primary"
        type="submit"
        className="mt-5 px-4 py-2 fw-bold"
        style={{
          width: "140px",
          height: "50px",
          borderRadius: "10px",
          marginTop: "40px",
        }}
        disabled={!selectedType}
        onClick={handleNext}
      >
        Next
      </Button>

      <style>
        {`
          .hover-effect:hover {
            transform: scale(1.05);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </Container>
  );
};

export default UserSelection;
