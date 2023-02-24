import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { jsPDF } from "jspdf";
import * as xlsx from "xlsx/xlsx";

import autoTable from "jspdf-autotable";
//To Export CSV Fille
let gridApi;
const handleGridReady = (params) =>
{
  gridApi = params.api;
}
const exportCsv = () =>
{
  gridApi.exportDataAsCsv();
}
const Row = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://jsonplaceholder.typicode.com/posts");

      setData(result.data);
    };
    fetchData();
  }, []);

  const columnDefs = [
    { headerName: "USERID", field: "userId",headerClass: 'my-header-class' },
    { headerName: "ID", field: "id",headerClass: 'my-header-class' },
    { headerName: "Title", field: "title",headerClass: 'my-header-class' },
    { headerName: "Body", field: "body",headerClass: 'my-header-class' },
  ];

  const exportColumns = columnDefs.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  // const exportCsv = () => {
  //   data.exportDataAsCsv();
  // };

  const exportPdf = () => {
    const doc = new jsPDF();
    // doc.text("PDF");
    doc.autoTable(exportColumns, data);
    doc.save("table.pdf");
  };

  const exportExcel = () => {
    const workSheet = xlsx.utils.json_to_sheet(data);
    const workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, workSheet, "table");
    //buffer
    let buf = xlsx.write(workBook, { bookType: "xlsx", type: "buffer" });
    //binary
    xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
    //download
    xlsx.writeFile(workBook, "table.xlsx");
  };
  
 
  const defaultColDef = {
    sortable: true,
    filter: true,
    // floatingFilter: true,
    flex: 1,
  };
  //To select from the dropdown
  const handleExport=(event)=>
    {
        if(event === "exportDataInCsv")
        {
          exportCsv();
        }
        else if(event === "exportDataInExcel")
        {
          exportExcel();
        }
        else if(event === "exportDataInPdf")
        {
          exportPdf();
        }
    }
    //OnClick filter
    const applyFilter = () => {
      let FilterText =  document.getElementById('filterText').value;
      gridApi.setQuickFilter(FilterText);
    };
    const clearFilter=()=>{
      let clearText = document.getElementById('filterText').value = '';
    }
  return (
    <>
      <div className="action">
        <select onChange={(e) => handleExport(e.target.value)} className="select-action" style={{ float: "right" }}>
          <option>Actions</option>
          <option value="exportDataInCsv">Export to CSV</option>
          <option value="exportDataInExcel">Export to Excel</option>
          <option value="exportDataInPdf">Export to PDF</option>
        </select>
      </div>
      <br />

      <br />
      <div className="filter">
        Filter : <input type="search" id="filterText"/>
        <button style={{ marginLeft: "10px" }} onClick={applyFilter}>
          Apply Filter
        </button>
        <button style={{ marginLeft: "10px" }} onClick={clearFilter}>
          Clear Filter
        </button>
      </div>
      <br />

      <div
        className="ag-theme-alpine"
        style={{ height: "250px", width: "100%" }}
      >
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={handleGridReady} 
        />
        {/* <button onClick={exportCsv}>Download Csv</button>
        <button onClick={exportPdf}>Download PDF</button>
        <button onClick={exportExcel}>Download Excel</button> */}
      </div>
    </>
  );
};
export default Row;
//how to make a dropdown  and add onchange functionalities in option?
