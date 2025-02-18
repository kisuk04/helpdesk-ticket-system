import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import TicketList from "./pages/TicketList";
import ItTicketList from "./pages/ItTicketList";
import UserSelection from "./pages/UserSelection";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelection />} />
        <Route path="/mytickets" element={<TicketList />} />
        <Route path="/create-ticket" element={<Create />} />
        <Route path="/it-ticket-list" element={<ItTicketList />} />
      </Routes>
    </Router>
  );
}

export default App;
