import PropTypes from 'prop-types';
import { Space, Tag, Typography } from 'antd';
import React from 'react';
import { nanoid } from 'nanoid';

const { Text } = Typography;
function Tags({ genres }) {
  return (
    <div>
      <Space size={[0, 8]} wrap style={{ marginTop: 7 }}>
        {genres.map((tag) => (
          <Tag key={nanoid(4)}>
            <Text type="secondary">{tag}</Text>
          </Tag>
        ))}
      </Space>
    </div>
  );
}

Tags.defaultProps = {
  genres: [],
};

Tags.propTypes = {
  genres: PropTypes.array,
};

export { Tags };
