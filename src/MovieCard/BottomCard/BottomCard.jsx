import PropTypes from 'prop-types';
import { Rate } from 'antd';
import './BottomCard.css';

function BottomCard({ rateValue, id, onRating }) {
  return (
    <Rate
      onChange={(value) => onRating(id, value)}
      count={10}
      allowHalf
      defaultValue={rateValue}
      rootClassName="stars"
    />
  );
}

BottomCard.defaultProps = {
  rateValue: 0,
  id: 0,
  onRating: Function.prototype,
};

BottomCard.propTypes = {
  rateValue: PropTypes.number,
  id: PropTypes.number,
  onRating: PropTypes.func,
};

export { BottomCard };
