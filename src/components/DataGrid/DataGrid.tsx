import React, { FC } from 'react';
import { PageHeader, Tooltip } from 'antd';
import { AgGridReact } from 'ag-grid-react';

import { TEntry } from '../../App';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './DataGrid.less';

type Props = {
  orders: TEntry[]
};

const columnDefs = [
  { headerName: "Action", field: "action", width: 75, suppressSizeToFit: true, cellStyle: (params: any) => params.value === 'Buy' ? { backgroundColor: 'green', color: 'white' } : { backgroundColor: 'red', color: 'white' }} ,
  { headerName: "Symbol", field: "ticker" },
  { headerName: "Qty", field: "qty" },
  { headerName: "Type", field: "oType" },
  { headerName: "TIF", field: "tif" },
  { headerName: "Price", field: "price" },
  { headerName: "Stop Price", field: "stopPrice" },
  { headerName: "Comments", field: "comments", width: 130, suppressSizeToFit: true, cellRenderer: (params: any) => `<Tooltip title="${params.value}">${params.value}</Tooltip>` },
  { headerName: "Last Updated", field: "lastUpdated", width: 145, suppressSizeToFit: true }
];

const DataGrid: FC<Props> = ({ orders }) => {
  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="data-grid">
      <PageHeader title="Order Blotter" className="section-header" />
      <div className="ag-theme-alpine grid">
        <AgGridReact
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={orders}>
        </AgGridReact>
      </div>
    </div>
  );
};

export default DataGrid;