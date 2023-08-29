import React, { useState } from 'react';
import styled from 'styled-components';
import Block from './Block';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 10px;
`;

const Game = () => {
  const [towerHeight, setTowerHeight] = useState(0);
  const [blockWidth, setBlockWidth] = useState(100);
  const [blocks, setBlocks] = useState([]);

  const addBlock = () => {
    setBlocks([...blocks, blockWidth]);
    setTowerHeight(towerHeight + blockWidth);
  };

  return (
    <GameContainer>
      <h1>Tower Stacking Game</h1>
      <div>
        <Button onClick={addBlock}>Add Block</Button>
      </div>
      <div>
        {blocks.map((width, index) => (
          <Block key={index} width={width} color="dodgerblue" />
        ))}
      </div>
      <p>Tower Height: {towerHeight}px</p>
    </GameContainer>
  );
};

export default Game;
