import { Rate, Typography } from 'antd';
import './BottomCard.css';

const { Paragraph } = Typography;
function BottomCard({ description, rateValue, id, onRating }) {
  const text = description.split(' ').slice(0, 22).join(' ');
  return (
    <>
      <Paragraph className="description-text">{`${text}...`}</Paragraph>
      <Rate
        onChange={(value) => onRating(id, value)}
        count={10}
        allowHalf
        defaultValue={rateValue}
        // value={rateValue}
        rootClassName="stars"
      />
    </>
  );
}

export { BottomCard };
