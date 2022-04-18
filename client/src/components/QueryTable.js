import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import {DataContext} from './Context';

function QueryTable() {

  const rowData = useContext(DataContext)[0];
  
  let history = useHistory();

  const columns = [
    { headerName: "Name", field: "name", sortable:true},
    { headerName: "Symbol", field: "symbol"},
    { headerName: "Industry", field: "industry", sortable:true}
  ]

  const onRowClick = (symbol) =>{
    history.push(`/priceHistory/${symbol}`);
  }

  return (
    <div className="scontainer">
      <div 
        className="ag-theme-balham"
        style={{
        height: "350px",
        width: "605px",
        margin: 'auto'
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          onRowClicked = {(data)=>{onRowClick(data.data.symbol)}}
        />
      </div>
    </div>
  );

}

export default QueryTable;