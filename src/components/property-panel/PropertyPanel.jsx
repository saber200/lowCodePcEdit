import React from 'react';
import styled from 'styled-components';
import { Form } from 'antd-mobile';
import PropertyEditor from './PropertyEditor';
import { getComponentProperties } from '../../utils/componentProperties';

const Container = styled.div`
  width: 300px;
  background: white;
  border-left: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
`;

const PropertySection = styled.div`
  margin-bottom: 20px;
`;

const PropertyTitle = styled.h4`
  margin-bottom: 12px;
  color: #333;
`;

const NoSelection = styled.div`
  color: #999;
  text-align: center;
  margin-top: 20px;
`;

const PropertyPanel = ({ selectedComponent, onPropertyChange }) => {
  if (!selectedComponent) {
    return (
      <Container>
        <h3>属性编辑</h3>
        <NoSelection>请选择一个组件进行编辑</NoSelection>
      </Container>
    );
  }

  return (
    <Container>
      <h3>属性编辑</h3>
      <Form layout='vertical'>
        {Object.entries(getComponentProperties(selectedComponent.type)).map(
          ([propName, property]) => (
            <PropertySection key={propName}>
              <PropertyTitle>{property.label}</PropertyTitle>
              <PropertyEditor
                property={property}
                value={selectedComponent.properties[propName]}
                onChange={(value) =>
                  onPropertyChange(selectedComponent.id, propName, value)
                }
              />
            </PropertySection>
          )
        )}
      </Form>
    </Container>
  );
};

export default PropertyPanel; 