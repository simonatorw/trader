import React, { FC, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  AutoComplete,
  Row,
  Col,
  Tooltip
} from 'antd';

import { ACTIONS, ORDER_TYPES, NOT_FOUND, TIF } from '../../constants';
import { TEntry } from '../../App';
import { getDate } from '../../api';

import './Ticket.less';

type TOptions = {
  value: string
};

type TProps = {
  addEntry(newEntry: TEntry): void;
};

const tickers: TOptions[] = [
  { value: 'GOOG' },
  { value: 'AMZN' },
  { value: 'C' },
  { value: 'AAPL' },
  { value: 'MSFT' },
  { value: 'IBM' },
  { value: 'T' }
];

const Ticket: FC<TProps> = ({ addEntry }) => {
  const [ action, setAction ] = useState(ACTIONS.buy);
  const [ ticker, setTicker ] = useState('');
  const [ qty, setQty ] = useState(0);
  const [ oType, setOType ] = useState(ORDER_TYPES.market);
  const [ options, setOptions ] = useState<TOptions[]>([]);
  const [ price, setPrice ] = useState('');
  const [ stopPrice, setStopPrice ] = useState('');
  const [ comments, setComments ] = useState('');
  const [ tif, setTif ] = useState(TIF.gtc);
  const [ display, setDisplay ] = useState('');

  const updateSelect = (val: string) => {
    setAction(val);
  };

  const updateQty = (val: any) => {
    const num = parseInt(val, 10);

    if (!isNaN(num)) {
      setQty(num);
    } else {
      setQty(0);
    }
  };

  const updateOType = (val: string) => {
    setOType(val);
  };

  const onSearch = (searchText: string) => {
    let result: Array<TOptions> = [];

    if (searchText) {
      result = tickers.filter(item => 
        item.value.toLowerCase().includes(searchText.toLowerCase()));

      if (!result.length) {
        result = [{ value: NOT_FOUND }];
      }
    }

    setOptions(result);
  };

  const updateTicker = (tickerStr: string) => {
    if (tickerStr !== NOT_FOUND) {
      setTicker(tickerStr);
    }
  };

  const updatePrice = (e: any) => {
    const val = parseFloat(e.target.value);

    if (!isNaN(val)) {
      setPrice(val.toFixed(2));
    } else {
      setPrice('');
    }
  }

  const updateStopPrice = (e: any) => {
    const val = parseFloat(e.target.value);

    if (!isNaN(val)) {
      setStopPrice(val.toFixed(2));
    } else {
      setPrice('');
    }
  }

  const updateComments = (e: any) => {
    setComments(e.target.value);
  }

  const updateTif = (val: string) => {
    setTif(val);
  }

  const isValidTicker = (): boolean => !!tickers.find(item => item.value === ticker);

  const isDisabled = (): boolean => {
    if (oType === ORDER_TYPES.market) {
      return !ticker || !qty || oType !== ORDER_TYPES.market || !isValidTicker();
    } else {
      return !ticker || !qty || oType !== ORDER_TYPES.limit || !isValidTicker() || !price || !stopPrice;
    }
  };

  const toggleShowHide = () => {
    if (display === 'hide') {
      setDisplay('show');
    } else {
      setDisplay('hide');
    }
  };

  const submitOrder = () => {
    addEntry({
      action,
      ticker,
      qty,
      oType,
      tif,
      price,
      stopPrice,
      comments,
      lastUpdated: getDate()
    });
  };

  return (
    <div className="ticket">
      {display === 'hide' && (
        <div className="maximize">
          <Tooltip title="Maximize" placement="right">
            <span onClick={toggleShowHide}>+</span>
          </Tooltip>
        </div>
      )}
      <Card title="Order Entry" size="small" className={`order-entry ${display}`} extra={<Tooltip title="Minimize" placement="right"><span className="minimize" onClick={toggleShowHide}>-</span></Tooltip>}>
        <Form
          layout="vertical"
          size="small"
        >
          <Row gutter={10}>
            <Col span={3}>
              <Form.Item label="Action">
                <Select defaultValue={ACTIONS.buy} onChange={updateSelect} className={action}>
                  <Select.Option value={ACTIONS.buy}>{ACTIONS.buy}</Select.Option>
                  <Select.Option value={ACTIONS.sell}>{ACTIONS.sell}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Symbol">
                <AutoComplete
                  value={ticker}
                  options={options}
                  onSearch={onSearch}
                  onChange={updateTicker}
                  placeholder="Enter Ticker"
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Qty">
                <InputNumber min={0} max={999} defaultValue={0} onChange={updateQty} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="TIF">
                <Select defaultValue={TIF.gtc} onChange={updateTif}>
                  <Select.Option value={TIF.gtc}>{TIF.gtc}</Select.Option>
                  <Select.Option value={TIF.day}>{TIF.day}</Select.Option>
                  <Select.Option value={TIF.fok}>{TIF.fok}</Select.Option>
                  <Select.Option value={TIF.ioc}>{TIF.ioc}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={3}>
              <Form.Item label="Type">
                <Select defaultValue={ORDER_TYPES.market} onChange={updateOType}>
                  <Select.Option value={ORDER_TYPES.market}>{ORDER_TYPES.market}</Select.Option>
                  <Select.Option value={ORDER_TYPES.limit}>{ORDER_TYPES.limit}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Price">
                <Input onChange={updatePrice} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Stop Price">
                <Input onChange={updateStopPrice} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Comments">
                <Input.TextArea onChange={updateComments} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" disabled={isDisabled()} onClick={submitOrder}>Enter Order</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Ticket;