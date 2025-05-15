import React from 'react';
import { Table as AntTable } from 'antd';
import styled from 'styled-components';

const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: white;
  border-radius: 8px;

  .ant-table-wrapper {
    height: 100%;
  }

  .ant-table {
    font-size: 14px;
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: #fafafa;
    padding: 8px 12px;
  }

  .ant-table-tbody > tr > td {
    padding: 8px 12px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f5f5f5;
  }

  // 隐藏分页
  .ant-table-pagination {
    display: none;
  }
`;

const Table = ({ properties }) => {
  const {
    columns = [
      { title: '标题1', dataIndex: 'col1', key: 'col1' },
      { title: '标题2', dataIndex: 'col2', key: 'col2' },
      { title: '标题3', dataIndex: 'col3', key: 'col3' }
    ],
    data = [
      { key: '1', col1: '内容1-1', col2: '内容1-2', col3: '内容1-3' },
      { key: '2', col1: '内容2-1', col2: '内容2-2', col3: '内容2-3' }
    ]
  } = properties;

  return (
    <TableWrapper>
      <AntTable
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered={false}
      />
    </TableWrapper>
  );
};

export default Table; 