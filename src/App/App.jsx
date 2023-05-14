import React from 'react';
import { Row, Col } from 'antd';
import { HeaderTabs } from '../Header/HeaderTabs';
import './App.css';

function App() {
  return (
    <Row justify="center">
      <Col span={18}>
        <HeaderTabs />
      </Col>
    </Row>
  );
}
export default App;
