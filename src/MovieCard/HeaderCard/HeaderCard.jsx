import PropTypes from 'prop-types';
/* eslint-disable no-nested-ternary */
import { Typography } from 'antd';
import './HeaderCard.css';

function HeaderCard({ title, rate }) {
  const { Title } = Typography;
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

HeaderCard.defaultProps = {
  title: '',
  rate: 0,
};

HeaderCard.propTypes = {
  title: PropTypes.string,
  rate: PropTypes.number,
};

export { HeaderCard };
