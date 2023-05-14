import { Card, Image, Typography } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns';

import { HeaderCard } from './HeaderCard/HeaderCard';
import { BottomCard } from './BottomCard/BottomCard';
import { Tags } from './Tags/Tags';
import './MovieCard.css';

const imageUrl = 'https://image.tmdb.org/t/p/w500';
const { Text } = Typography;
function MovieCard({ movie, onRating }) {
  const { title, img, rate, date, genres, rateValue, description, id } = movie;
  return (
    <Card className="card" hoverable bodyStyle={{ padding: 0 }}>
      <div className="cardContent">
        <div className="top-card">
          <Image src={imageUrl + img} />
          <div className="right-side">
            <HeaderCard title={title} rate={rate} />
            <Text type="secondary">{date ? format(new Date(date), 'PP') : 'unknown Date'}</Text>
            <Tags genres={genres} id={id} />
            <div className="hide_or_show">
              <BottomCard description={description} rateValue={rateValue} id={id} onRating={onRating} />
            </div>
          </div>
        </div>
        <div className="show_or_hide">
          <BottomCard description={description} rateValue={rateValue} id={id} onRating={onRating} />
        </div>
      </div>
    </Card>
  );
}

export { MovieCard };
