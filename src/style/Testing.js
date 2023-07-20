import React, { useState } from 'react';
import Board from './Board';

export default function Testing(){
    const [boards, setBoards] = useState([
        { id: 1, title: 'Доска 1', items: [{ id: 1, content: 'Элемент 1' }, { id: 2, content: 'Элемент 2' }] },
        { id: 2, title: 'Доска 2', items: [{ id: 3, content: 'Элемент 3' }, { id: 4, content: 'Элемент 4' }] },
    ]);

    const handleItemMove = (draggedItem, targetItem) => {
        setBoards((prevBoards) => {
            const updatedBoards = [...prevBoards];

            // Находим доску, на которой произошло перемещение элемента
            const board = updatedBoards.find((board) => board.items.includes(draggedItem));

            if (board) {
                // Перемещаем элемент внутри доски
                board.items = moveItem(board.items, draggedItem, targetItem);
            }

            return updatedBoards;
        });
    };

    const handleBoardMove = () => {
        setBoards((prevBoards) => {
            // Меняем местами первые две доски в массиве
            return moveItem(prevBoards, prevBoards[0], prevBoards[1]);
        });
    };

    const moveItem = (array, draggedItem, targetItem) => {
        const draggedIndex = array.indexOf(draggedItem);
        const targetIndex = array.indexOf(targetItem);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const updatedArray = [...array];
            updatedArray[draggedIndex] = targetItem;
            updatedArray[targetIndex] = draggedItem;
            return updatedArray;
        }

        return array;
    };

    return (
        <div>
            {boards.map((board) => (
                <Board
                    key={board.id}
                    title={board.title}
                    items={board.items}
                    onItemMove={handleItemMove}
                    onBoardMove={handleBoardMove}
                />
            ))}
        </div>
    );
};