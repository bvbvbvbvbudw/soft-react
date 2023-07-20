import React, { useState } from 'react';
import '../style/board.css'
export default function Table(){
    const [boards, setBoards] = useState([
        { id: 1, name: 'Доска 1', items: ['Элемент 1', 'Элемент 2', 'Элемент 3'] },
        { id: 2, name: 'Доска 2', items: ['Элемент 4', 'Элемент 5', 'Элемент 6'] },
        { id: 3, name: 'Доска 3', items: ['Элемент 7', 'Элемент 8', 'Элемент 9'] },
    ]);

    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (boardId, itemId) => {
        setDraggedItem({ boardId, itemId });
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (boardId) => {
        const { boardId: sourceBoardId, itemId } = draggedItem;

        if (boardId !== sourceBoardId) {
            const sourceBoardIndex = boards.findIndex((board) => board.id === sourceBoardId);
            const targetBoardIndex = boards.findIndex((board) => board.id === boardId);

            const sourceItems = [...boards[sourceBoardIndex].items];
            const targetItems = [...boards[targetBoardIndex].items];

            const item = sourceItems.splice(itemId, 1)[0];
            targetItems.push(item);

            const newBoards = [...boards];
            newBoards[sourceBoardIndex] = { ...newBoards[sourceBoardIndex], items: sourceItems };
            newBoards[targetBoardIndex] = { ...newBoards[targetBoardIndex], items: targetItems };

            setBoards(newBoards);
        }
    };

    const handleBoardDragStart = (event, boardId) => {
        event.dataTransfer.setData('boardId', boardId);
    };

    const handleBoardDragOver = (event) => {
        event.preventDefault();
    };

    const handleBoardDrop = (event, targetBoardId) => {
        const sourceBoardId = event.dataTransfer.getData('boardId');

        if (sourceBoardId !== targetBoardId) {
            const sourceBoardIndex = boards.findIndex((board) => board.id === +sourceBoardId);
            const targetBoardIndex = boards.findIndex((board) => board.id === +targetBoardId);

            const newBoards = [...boards];
            [newBoards[sourceBoardIndex], newBoards[targetBoardIndex]] = [
                newBoards[targetBoardIndex],
                newBoards[sourceBoardIndex],
            ];

            setBoards(newBoards);
        }
    };

    return (
        <div className="board-container">
            {boards.map((board) => (
                <div
                    className="board"
                    key={board.id}
                >
                    <h3
                        draggable
                        onDragStart={(event) => handleBoardDragStart(event, board.id)}
                        onDragOver={handleBoardDragOver}
                        onDrop={(event) => handleBoardDrop(event, board.id)}>{board.name}</h3>
                    <ul className="item-list" onDragOver={handleDragOver} onDrop={() => handleDrop(board.id)}>
                        {board.items.map((item, index) => (
                            <li
                                key={index}
                                draggable
                                onDragStart={() => handleDragStart(board.id, index)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
