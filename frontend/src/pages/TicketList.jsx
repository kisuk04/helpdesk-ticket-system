import React, { useEffect, useMemo, useState } from "react";
import { Container, Form, Table, Badge, Button, Modal } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { FaSort, FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";

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

const TicketList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
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
  
    const updatedTicket = {
      ...selectedTicket,
      status: selectedTicket.status || "pending"
    };
  
    console.log("Updated Ticket Data:", updatedTicket);
  
    axios.put(`${API_URL}/${updatedTicket.id}`, updatedTicket)
      .then(() => {
        console.log("Ticket updated, fetching new data...");
        return axios.get(API_URL); 
      })
      .then(response => {
        console.log("Updated Data:", response.data);
        setData(response.data);
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
      Cell: ({ value }) => {
        if (!value) return <Badge bg="secondary">Unknown</Badge>;

        const statusMap = {
          pending: "warning",
          accepted: "primary",
          resolved: "success",
          rejected: "danger",
        };

        return (
          <Badge bg={statusMap[value.toLowerCase()] || "secondary"}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      },
    },
    {
      Header: "Last Updated",
      accessor: "updated_at",
      sortType: (rowA, rowB) => new Date(rowB.values.updated_at) - new Date(rowA.values.updated_at),
      Cell: ({ value }) => formatDate(value),
    }
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = useTable(
    { columns, data },
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
      <Sidebar />
      <Container className="mt-4">
      <h1 className="fw-bold text-center">Ticket List</h1>

        <Form.Group>
          <StatusFilter setGlobalFilter={setGlobalFilter} />
        </Form.Group>

        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table bordered hover {...getTableProps()} responsive>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")} {" "}
                        {column.id === "updated_at" ? (
                          column.isSorted ? (
                            column.isSortedDesc ? <FaSortDown /> : <FaSortUp />
                          ) : (
                            <FaSort />
                          )
                        ) : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Ticket</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedTicket && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
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
                  <Form.Label>Contact Info</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedTicket?.contact_info || ""}
                    onChange={(e) => setSelectedTicket(prev => ({ ...prev, contact_info: e.target.value }))}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}style={{ width: "100px", height: "50px", borderRadius: "10px" }}>
            Cancel</Button>
            <Button variant="primary" onClick={handleSave}style={{ width: "100px", height: "50px", borderRadius: "10px" }}>
              Save</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
};

export default TicketList;
