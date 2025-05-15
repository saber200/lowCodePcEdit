import React from 'react';
import { Input, Switch, Selector, TextArea } from 'antd-mobile';

const PropertyEditor = ({ property, value, onChange }) => {
  switch (property.type) {
    case 'string':
      return (
        <Input
          placeholder={`请输入${property.label}`}
          value={value}
          onChange={onChange}
        />
      );
    case 'text':
      return (
        <TextArea
          placeholder={`请输入${property.label}`}
          value={value}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <Selector
          options={property.options.map(opt => ({
            label: opt,
            value: opt
          }))}
          value={[value]}
          onChange={v => onChange(v[0])}
        />
      );
    case 'boolean':
      return (
        <Switch
          checked={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default PropertyEditor; 