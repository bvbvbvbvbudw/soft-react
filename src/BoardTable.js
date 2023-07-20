import React, { useState } from 'react';

export default function BoardTable ({ title, items, onItemMove, onBoardMove }){
    const [draggedItem, setDraggedItem] = useState(null);

    const handleItemDragStart = (event, item) => {
        setDraggedItem(item);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', ''); // Необходимо для перетаскивания в некоторых браузерах
    };

    const handleItemDragOver = (event, item) => {
        event.preventDefault();
    };

    const handleItemDrop = (event, item) => {
        event.preventDefault();
        onItemMove(draggedItem, item);
        setDraggedItem(null);
    };

    const handleBoardDragStart = (event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', ''); // Необходимо для перетаскивания в некоторых браузерах
    };

    const handleBoardDragOver = (event) => {
        event.preventDefault();
    };

    const handleBoardDrop = (event) => {
        event.preventDefault();
        onBoardMove();
    };

    return (
        <div className="board" draggable onDragStart={handleBoardDragStart} onDragOver={handleBoardDragOver} onDrop={handleBoardDrop}>
            <h2>{title}</h2>
            <div className="items">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="item"
                        draggable
                        onDragStart={(event) => handleItemDragStart(event, item)}
                        onDragOver={(event) => handleItemDragOver(event, item)}
                        onDrop={(event) => handleItemDrop(event, item)}
                    >
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    );
};