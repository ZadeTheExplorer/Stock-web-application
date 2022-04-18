import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "../style.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import StockChart from "../components/StockChart";
import { Container, Row, Col, Alert } from "react-bootstrap";

export default function PriceHistory({ match }) {
  const [rowData, setRowData] = useState([]);
  const [date, setDate] = useState({
    startDate: "2020-03-15",
    endDate: "2020-03-20",
  });

  const token = localStorage.getItem("token");

  const columns = [
    { headerName: "Date", field: "timestamp", sortable: true },
    { headerName: "Open", field: "open", sortable: true },
    { headerName: "High", field: "high", sortable: true },
    { headerName: "Low", field: "low", sortable: true },
    { headerName: "Close", field: "close", sortable: true },
    { headerName: "Volumnes", field: "volumes", sortable: true },
  ];

  const fetchSingleRowData = async () => {
    const singleRowData = await fetch(
      `http://131.181.190.87:3000/stocks/${match.params.symbol}`
    );
    const singleRow = await singleRowData.json();
    setRowData(
      [singleRow].map((row) => {
        return { ...row, timestamp: new Date(row.timestamp).toDateString() };
      })
    );
  };

  const fetchQueriedRowData = async () => {
    try {
      const rowsData = await fetch(
        `http://131.181.190.87:3000/stocks/authed/${match.params.symbol}?from=${date.startDate}T00%3A00%3A00.000Z&to=${date.endDate}T00%3A00%3A00.000Z`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rows = await rowsData.json();

      setRowData(
        rows.map((row) => {
          return { ...row, timestamp: new Date(row.timestamp).toDateString() };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onStartDateHandler = (event) => {
    const start = event.target.value;
    setDate((prev) => {
      return { startDate: start, endDate: prev.endDate };
    });
  };

  const onEndDateHandler = (event) => {
    const end = event.target.value;
    setDate((prev) => {
      return { startDate: prev.startDate, endDate: end };
    });
  };

  useEffect(() => {
    if (token) {
      fetchQueriedRowData();
    } else {
      fetchSingleRowData();
    }
  });

  return (
    <div className="tableContainer">
      <h2>{rowData.length > 0 ? rowData[0].name : null}</h2>
      <br/>
      <form className="dateInput" style={token ? null : {display: 'none'}}>
        <h5>Select Date from 2019-11-01 to 2020-03-24</h5>
        <Container>
          <Row>
            <h5>From</h5>
            <input
              name="startDate"
              type="date"
              value={date.startDate}
              onChange={onStartDateHandler}
              min="2019-11-06"
              max="2020-03-24"
            />
            <h5>To</h5>
            <input
              name="endDate"
              type="date"
              value={date.endDate}
              onChange={onEndDateHandler}
              min="2019-11-06"
              max="2020-03-24"
            />
          </Row>
          <Row>
            <Col sm>
              {date.startDate > date.endDate ? (
                <Alert variant="danger">
                  {" "}
                  <p>Start date must come before end date!</p>{" "}
                </Alert>
              ) : (
                <br />
              )}
            </Col>
          </Row>
        </Container>
      </form>

      <div
        className="ag-theme-balham"
        style={{
          height: "350px",
          width: "901px",
          margin: "auto",
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{ width: 150, resizable: true }}
        />
      </div>

      <div className="stockChart">
        <StockChart stocks={rowData} />
      </div>
    </div>
  );
}
