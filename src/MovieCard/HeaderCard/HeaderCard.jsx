/* eslint-disable no-nested-ternary */
import { Typography } from 'antd';
import './HeaderCard.css';

const { Title } = Typography;

function HeaderCard({ title, rate }) {
  const styleColor = {
    red: '#E90000',
    orange: '#E97E00',
    yellow: '#E9D100',
    green: '#66E900',
  };

  return (
    <div className="card-header">
      <Title style={{ margin: 0 }} level={4}>
        {title}
      </Title>
      <div
        style={{
          borderColor:
            rate <= 3
              ? styleColor.red
              : rate > 3 && rate <= 5
              ? styleColor.orange
              : rate > 5 && rate <= 7
              ? styleColor.yellow
              : styleColor.green,
        }}
        className="rate"
      >
        {rate}
      </div>
    </div>
  );
}

export { HeaderCard };
