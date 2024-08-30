// src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io();

function App() {
  const [checkboxes, setCheckboxes] = useState(Array(10).fill(false));

  useEffect(() => {
    socket.on('initialState', (initialCheckboxState) => {
      console.log('initial')
      setCheckboxes(initialCheckboxState);
    });

    socket.on('updateCheckbox', (index) => {
      setCheckboxes(prevState => {
        const newCheckboxes = [...prevState];
        newCheckboxes[index] = true;
        return newCheckboxes;
      });
    });

    return () => {
      socket.off('initialState');
      socket.off('updateCheckbox');
    };
  }, []);

  const handleCheckboxClick = (index) => {
    if (!checkboxes[index]) {
      socket.emit('toggleCheckbox', index);
    }
  };
  const handleReset = () => {
    console.log('handleReset')
    socket.emit('ResetBoxes')
  }

  const allChecked = checkboxes.every(checkbox => checkbox);

  return (
    <div className='Wrapper'>
      {allChecked && <div>Nice that you clicked everything ... now Reset it</div>}
      <h2>Tick it off & before the other one ticks</h2>
      <div className="grid">
        {checkboxes.map((checked, index) => (
          <input
            type="checkbox"
            key={index}
            checked={checked}
            onChange={() => handleCheckboxClick(index)}
            disabled={checked}
          />
        ))}
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;


