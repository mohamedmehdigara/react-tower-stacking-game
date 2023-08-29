import React from 'react';
import styled from 'styled-components';

const BlockContainer = styled.div`
  width: ${props => props.width}px;
  height: 20px;
  background-color: ${props => props.color};
  margin-bottom: 5px;
`;

const Block = ({ width, color }) => {
  return <BlockContainer width={width} color={color} />;
};

export default Block;
