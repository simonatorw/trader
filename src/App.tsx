import React, { FC, useState } from 'react';
import { Layout, Modal } from 'antd';

import DataGrid from './components/DataGrid/DataGrid';
import Ticket from './components/Ticket/Ticket';
import { ELAPSE_TIME_ERROR } from './constants';

import './App.less';

const { Header, Content } = Layout;

export type TEntry = {
  action: string;
  ticker: string;
  qty: number;
  oType: string;
  tif: string;
  price: string;
  stopPrice: string;
  comments: string;
  lastUpdated: string;
};

const initialOrders: TEntry[] = [
  {
    action: "Buy",
    ticker: "MSFT",
    qty: 100,
    oType: 'Limit',
    tif: 'GTC',
    price: '20.00',
    stopPrice: '10.00',
    comments: 'Good buy',
    lastUpdated: '10/20/2019 10:20'
  },
  {
    action: "Sell",
    ticker: "AAPL",
    qty: 200,
    oType: 'Market',
    tif: 'DAY',
    price: '',
    stopPrice: '',
    comments: '',
    lastUpdated: '10/10/2019 12:30'
  }
];

const App: FC = () => {
  const [ orders, setOrders ] = useState<TEntry[]>(initialOrders);
  const [ showProgress, setShowProgress ] = useState(false);
  const [ hasAdded, setHasAdded ] = useState(false);
  const [ count, setCount ] = useState(1);

  const addEntry = (newEntry: TEntry) => {
    if (!(count % 10)) {
      const modal = Modal.error({
        title: ELAPSE_TIME_ERROR.title,
        content: ELAPSE_TIME_ERROR.content,
        onOk: () => modal.destroy()
      });
    } else {
      const newOrders = orders.slice();

      newOrders.unshift(newEntry);

      setShowProgress(true);
      setTimeout(() => {
        setOrders(newOrders);
        setShowProgress(false);
        setHasAdded(true);

        setTimeout(() => setHasAdded(false), 2200);
      }, 2000);
    }
    
    setCount(count + 1);
  };

  return (
    <Layout className="app">
      <Header className="app-header">
        <h1>
          <i className="logo">
            <span className="l1">E</span>
            <span className="l2">X</span>
            <span className="l3">D</span>
          </i> Trader
        </h1>
        {showProgress ? <div className="progress-bar"></div> : <div style={{ height: '2px' }}></div>}
      </Header>
      <Content className="controls">
        <Ticket addEntry={addEntry} />
      </Content>
      <Content className={`${hasAdded && 'added'}`}>
        <DataGrid orders={orders} />
      </Content>
    </Layout>
    
  );
};

export default App;
