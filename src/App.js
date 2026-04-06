import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { create } from 'zustand';

// --- State Management (Zustand) ---
const useGameStore = create((set) => ({
  score: 0,
  stack: [{ id: 0, width: 200, left: 150 }], // Initial block
  status: 'playing', // 'playing' | 'gameover'
  addBlock: (block) => set((state) => ({ 
    stack: [...state.stack, block], 
    score: state.score + 1 
  })),
  resetGame: () => set({ 
    score: 0, 
    stack: [{ id: 0, width: 200, left: 150 }], 
    status: 'playing' 
  }),
  setGameOver: () => set({ status: 'gameover' }),
}));

// --- Styled Components ---
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  color: white;
  cursor: pointer;
`;

const UI = styled.div`
  position: absolute;
  top: 20px;
  text-align: center;
  z-index: 10;
  pointer-events: none;
`;

const move = (start, end) => keyframes`
  0% { left: ${start}px; }
  100% { left: ${end}px; }
`;

const Block = styled.div.attrs(props => ({
  style: {
    width: `${props.width}px`,
    left: `${props.left}px`,
    bottom: `${props.bottom}px`,
  },
}))`
  height: 40px;
  position: absolute;
  background: ${props => props.color || '#e94560'};
  border: 2px solid #16213e;
  transition: bottom 0.3s ease-out;
`;

const MovingBlock = styled(Block)`
  animation: ${props => move(0, 500 - props.width)} 2s infinite alternate linear;
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  pointer-events: all;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  background: #0f3460;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  &:hover { background: #e94560; }
`;

// --- Main App Component ---
export default function App() {
  const { score, stack, status, addBlock, resetGame, setGameOver } = useGameStore();
  const [movingPos, setMovingPos] = useState(0);
  const movingRef = useRef(null);

  const containerWidth = 500;
  const blockHeight = 40;

  const handleAction = () => {
    if (status === 'gameover') return;

    // Get current horizontal position of the moving block
    const movingElement = movingRef.current;
    if (!movingElement) return;
    
    const rect = movingElement.getBoundingClientRect();
    const containerRect = movingElement.parentElement.getBoundingClientRect();
    const currentLeft = rect.left - containerRect.left;

    const lastBlock = stack[stack.length - 1];
    
    // Check collision logic
    const isOverlapping = 
      currentLeft < lastBlock.left + lastBlock.width &&
      currentLeft + lastBlock.width > lastBlock.left;

    if (isOverlapping) {
      // Calculate new width based on overlap (simplified)
      const newLeft = Math.max(currentLeft, lastBlock.left);
      const rightEdge = Math.min(currentLeft + lastBlock.width, lastBlock.left + lastBlock.width);
      const newWidth = rightEdge - newLeft;

      if (newWidth <= 5) {
        setGameOver();
      } else {
        addBlock({
          id: Date.now(),
          width: newWidth,
          left: newLeft,
        });
      }
    } else {
      setGameOver();
    }
  };

  return (
    <GameContainer onClick={handleAction}>
      <UI>
        <h1>Score: {score}</h1>
        {status === 'playing' && <p>Click to Drop!</p>}
      </UI>

      <div style={{ position: 'relative', width: '500px', height: '100%' }}>
        {/* Render the Stack */}
        {stack.map((b, index) => (
          <Block 
            key={b.id} 
            width={b.width} 
            left={b.left} 
            bottom={index * blockHeight}
            color={`hsl(${index * 20}, 70%, 50%)`}
          />
        ))}

        {/* Render the Moving Block */}
        {status === 'playing' && (
          <MovingBlock
            ref={movingRef}
            width={stack[stack.length - 1].width}
            bottom={stack.length * blockHeight}
            color={`hsl(${stack.length * 20}, 70%, 50%)`}
          />
        )}
      </div>

      {status === 'gameover' && (
        <GameOverScreen>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <Button onClick={(e) => { e.stopPropagation(); resetGame(); }}>
            Try Again
          </Button>
        </GameOverScreen>
      )}
    </GameContainer>
  );
}