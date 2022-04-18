import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [rowData, setRowData] = useState([]);

  return (
    <DataContext.Provider value={[rowData, setRowData]}>
      {props.children}
    </DataContext.Provider>
  );
};
