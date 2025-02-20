import React, { useEffect, useState, useMemo } from "react";
import { Table, Form, Container, Modal, Button } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { FaSort, FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import axios from "axios";
import ItSideBar from "../components/ItSideBar";

const API_URL = "http://localhost:8080/api/tickets";
const formatDate = (isoString) => new Date(isoString).toLocaleString();

const StatusFilter = ({ setGlobalFilter }) => (
  <Form.Select onChange={(e) => setGlobalFilter(e.target.value || "")} className="mb-3">
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="accepted">Accepted</option>
    <option value="resolved">Resolved</option>
    <option value="rejected">Rejected</option>
  </Form.Select>
);

const ItTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setTickets(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleEdit = (ticket) => {
    setSelectedTicket({ ...ticket });
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedTicket(null);
    setShowModal(false);
  };

  const handleSave = () => {
    if (!selectedTicket) return;

    axios.put(`${API_URL}/${selectedTicket.id}`, selectedTicket)
      .then(() => axios.get(API_URL))
      .then(response => {
        setTickets(response.data);
        setShowModal(false);
      })
      .catch(error => console.error("Error updating ticket:", error));
  };

  const columns = useMemo(() => [
    { Header: "Issue Title", accessor: "title", disableSortBy: true },
    { Header: "Description", accessor: "description", disableSortBy: true },
    { Header: "Contact", accessor: "contact_info", disableSortBy: true },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Form.Select
          value={row.original.status}
          onChange={(e) => handleEdit({ ...row.original, status: e.target.value })}
          style={{ minWidth: "180px" }}
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </Form.Select>
      ),
    },
    {
      Header: "Last Updated",
      accessor: "updated_at",
      sortType: (rowA, rowB) => new Date(rowB.values.updated_at) - new Date(rowA.values.updated_at),
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(row.original)}>
          <FaEdit /> Edit
        </Button>
      ),
    },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = useTable(
    { columns, data: tickets },
    useGlobalFilter,
    useSortBy
  );

  return (
    <Container
      fluid
      className="d-flex vh-100"
      style={{
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <ItSideBar />
      <Container className="mt-4">


        <h1 className="fw-bold text-center">Ticket List</h1>
        <Form.Group>
          <StatusFilter setGlobalFilter={setGlobalFilter} />
        </Form.Group>

        <Table bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.id === "updated_at" ? (column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTicket && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Issue Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedTicket?.title || ""}
                    onChange={(e) => setSelectedTicket(prev => ({ ...prev, title: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={selectedTicket?.description || ""}
                    onChange={(e) => setSelectedTicket(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedTicket?.contact_info || ""}
                    onChange={(e) => setSelectedTicket(prev => ({ ...prev, contact_info: e.target.value }))}
                  />
                </Form.Group>
                <Form.Label> Are you sure you want to update?</Form.Label>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}
              style={{ width: "140px", height: "50px", borderRadius: "10px" }}>
              Cancel</Button>
            <Button variant="primary" onClick={handleSave}
              style={{ width: "140px", height: "50px", borderRadius: "10px" }}>           
              Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
};

export default ItTicketList;
