import React from 'react';
import styled from 'styled-components';
import { Tabs, Form, Input, InputNumber, Select, Switch, ColorPicker } from 'antd';
import EventEditor from '../editor/EventEditor';

const PanelContainer = styled.div`
  width: 300px;
  background: white;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const TabContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
`;

// 组件属性配置
const COMPONENT_PROPERTIES = {
  Button: [
    { name: 'text', label: '文本', type: 'string' },
    { name: 'type', label: '类型', type: 'select', options: [
      { label: '主要', value: 'primary' },
      { label: '默认', value: 'default' },
      { label: '虚线', value: 'dashed' },
      { label: '文本', value: 'text' },
      { label: '链接', value: 'link' }
    ]},
    { name: 'size', label: '大小', type: 'select', options: [
      { label: '大', value: 'large' },
      { label: '中', value: 'middle' },
      { label: '小', value: 'small' }
    ]},
    { name: 'disabled', label: '禁用', type: 'boolean' }
  ],
  Input: [
    { name: 'placeholder', label: '占位文本', type: 'string' },
    { name: 'disabled', label: '禁用', type: 'boolean' },
    { name: 'allowClear', label: '允许清除', type: 'boolean' }
  ],
  Image: [
    { name: 'src', label: '图片地址', type: 'string' },
    { name: 'alt', label: '替代文本', type: 'string' },
    { name: 'preview', label: '允许预览', type: 'boolean' }
  ],
  Text: [
    { name: 'content', label: '文本内容', type: 'string' },
    { name: 'color', label: '颜色', type: 'color' },
    { name: 'fontSize', label: '字号', type: 'number' }
  ]
};

const PropertyPanel = ({ 
  selectedComponent,
  components = [],
  onPropertyChange,
  onSaveEvents 
}) => {
  if (!selectedComponent) {
    return (
      <PanelContainer>
        <div style={{ padding: 16, color: '#999', textAlign: 'center' }}>
          请选择一个组件
        </div>
      </PanelContainer>
    );
  }

  // 获取所有可用的目标组件
  const availableTargets = (components || [])
    .filter(comp => comp && comp.id !== selectedComponent.id)
    .map(comp => ({
      label: comp.name || comp.type || '未命名组件',
      value: comp.id
    }));

  // 获取组件的属性配置
  const properties = COMPONENT_PROPERTIES[selectedComponent.type] || [];

  // 渲染属性编辑器
  const renderPropertyEditor = () => {
    return (
      <Form layout="vertical">
        {properties.map(prop => (
          <Form.Item
            key={prop.name}
            label={prop.label}
          >
            {prop.type === 'string' && (
              <Input
                value={selectedComponent.properties?.[prop.name] || ''}
                onChange={e => onPropertyChange?.(selectedComponent.id, prop.name, e.target.value)}
              />
            )}
            {prop.type === 'number' && (
              <InputNumber
                value={selectedComponent.properties?.[prop.name]}
                onChange={value => onPropertyChange?.(selectedComponent.id, prop.name, value)}
                style={{ width: '100%' }}
              />
            )}
            {prop.type === 'boolean' && (
              <Switch
                checked={selectedComponent.properties?.[prop.name]}
                onChange={value => onPropertyChange?.(selectedComponent.id, prop.name, value)}
              />
            )}
            {prop.type === 'select' && (
              <Select
                value={selectedComponent.properties?.[prop.name]}
                onChange={value => onPropertyChange?.(selectedComponent.id, prop.name, value)}
                options={prop.options}
                style={{ width: '100%' }}
              />
            )}
            {prop.type === 'color' && (
              <ColorPicker
                value={selectedComponent.properties?.[prop.name]}
                onChange={value => onPropertyChange?.(selectedComponent.id, prop.name, value.toHexString())}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    );
  };

  return (
    <PanelContainer>
      <Tabs
        items={[
          {
            key: 'props',
            label: '属性',
            children: (
              <TabContent>
                {renderPropertyEditor()}
              </TabContent>
            ),
          },
          {
            key: 'events',
            label: '事件',
            children: (
              <TabContent>
                <EventEditor
                  componentId={selectedComponent.id}
                  availableTargets={availableTargets}
                  onSave={(config) => {
                    onSaveEvents?.(selectedComponent.id, config);
                  }}
                />
              </TabContent>
            ),
          },
        ]}
      />
    </PanelContainer>
  );
};

export default PropertyPanel; 