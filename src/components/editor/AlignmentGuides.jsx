import React from 'react';
import styled from 'styled-components';

const GuideLineVertical = styled.div`
  position: absolute;
  width: 1px;
  background-color: #1677ff;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  &::before {
    content: '';
    position: absolute;
    left: -1px;
    width: 3px;
    height: 100%;
    background-color: rgba(22, 119, 255, 0.1);
  }
`;

const GuideLineHorizontal = styled.div`
  position: absolute;
  height: 1px;
  background-color: #1677ff;
  width: 100%;
  pointer-events: none;
  z-index: 1000;
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    height: 3px;
    width: 100%;
    background-color: rgba(22, 119, 255, 0.1);
  }
`;

const AlignmentGuides = ({ guides }) => {
  return (
    <>
      {guides.vertical.map((guide, index) => (
        <GuideLineVertical
          key={`v-${index}`}
          style={{ left: `${guide.position}px` }}
        />
      ))}
      {guides.horizontal.map((guide, index) => (
        <GuideLineHorizontal
          key={`h-${index}`}
          style={{ top: `${guide.position}px` }}
        />
      ))}
    </>
  );
};

export default AlignmentGuides; 