import React from 'react';
import { List as AntdList, Avatar } from 'antd-mobile';
import styled from 'styled-components';

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: white;
  border-radius: 8px;
`;

const List = ({ properties }) => {
  const {
    items = [
      {
        avatar: '👤',
        title: '列表项1',
        description: '描述信息1'
      },
      {
        avatar: '📱',
        title: '列表项2',
        description: '描述信息2'
      },
      {
        avatar: '💡',
        title: '列表项3',
        description: '描述信息3'
      }
    ],
    showAvatar = true,
  } = properties;

  return (
    <ListWrapper>
      <AntdList>
        {items.map((item, index) => (
          <AntdList.Item
            key={index}
            prefix={showAvatar && (
              <Avatar src={null} style={{ background: '#f5f5f5' }}>
                {item.avatar}
              </Avatar>
            )}
            description={item.description}
          >
            {item.title}
          </AntdList.Item>
        ))}
      </AntdList>
    </ListWrapper>
  );
};

export default List; 