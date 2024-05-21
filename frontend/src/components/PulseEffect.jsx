import React from 'react';

const PulseEffect = ({ x, y, size }) => {
    const style = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        boxSizing: 'border-box',
        animation: 'pulse 1.5s infinite',
        pointerEvents: 'none', // Ensure it doesn't interfere with mouse events
        zIndex: 1
    };

    return <div style={style}></div>;
};

export default PulseEffect;
