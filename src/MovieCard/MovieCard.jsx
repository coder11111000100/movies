import PropTypes from 'prop-types';
import { Image, Typography } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns';

import { HeaderCard } from './HeaderCard/HeaderCard';
import { BottomCard } from './BottomCard/BottomCard';
import { Tags } from './Tags/Tags';
import './MovieCard.css';

const imageUrl = 'https://image.tmdb.org/t/p/w500';
function MovieCard({ movie, onRating }) {
  const { Text, Paragraph } = Typography;
  const { title, img, rate, date, genres, rateValue, id, description } = movie;
  const t = description.split(' ').slice(0, 22).join(' ');
  return (
    <div className="conteiner-card">
      <div className="conteiner-card__item top-card img">
        <Image src={imageUrl + img} />
      </div>
      <div className="conteiner-card__item_1">
        <div className="conteiner-card__content">
          <HeaderCard title={title} rate={rate} />
          <Text type="secondary">{date ? format(new Date(date), 'PP') : 'unknown Date'}</Text>
          <Tags genres={genres} id={id} />
        </div>

        <div className="conteiner-card__paragraph">
          <Paragraph className="description-text">{`${t}...`}</Paragraph>
        </div>
        <BottomCard rateValue={rateValue} id={id} onRating={onRating} />
      </div>
    </div>
  );
}

MovieCard.defaultProps = {
  title: '',
  img: '',
  rate: 0,
  date: '',
  genres: '',
  rateValue: 0,
  description: '',
  id: 0,
};

MovieCard.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  rate: PropTypes.number,
  date: PropTypes.string,
  genres: PropTypes.string,
  rateValue: PropTypes.number,
  description: PropTypes.string,
  id: PropTypes.number,
};

export { MovieCard };
