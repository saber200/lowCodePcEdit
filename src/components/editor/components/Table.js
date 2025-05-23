import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Form, Space } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ properties = {}, style }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const initialData = properties.data || [
      { key: '1', name: '示例1', age: '32', address: '北京' },
      { key: '2', name: '示例2', age: '28', address: '上海' },
    ];
    setData(initialData);
  }, [properties.data]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    }
  ];

  const columns = (properties.columns || defaultColumns).map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  columns.push({
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <Space>
          <Button
            type="link"
            onClick={() => save(record.key)}
          >
            保存
          </Button>
          <Button 
            type="link"
            onClick={cancel}
          >
            取消
          </Button>
        </Space>
      ) : (
        <Button
          type="link"
          disabled={editingKey !== ''}
          onClick={() => edit(record)}
        >
          编辑
        </Button>
      );
    },
  });

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Form form={form} component={false} style={{ width: '100%', height: '100%' }}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          style={{ ...style, width: '100%', height: '100%' }}
        />
      </Form>
    </div>
  );
};

export default EditableTable; 