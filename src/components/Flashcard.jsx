import React, { useState } from 'react';
import '../styles/flashcard.css';

const Flashcard = ({ card, onEdit, onDelete, isQuizMode = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flashcard-container ${isQuizMode ? 'flashcard-quiz-mode' : ''}`}>
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* Mặt trc */}
        <div className="flashcard-face">
          <div className="flashcard-content">
            <h3 className="flashcard-title">
              {card.front}
            </h3>
            <p className="flashcard-subtitle">Nhấn để lật thẻ</p>
          </div>
        </div>

        {/* Mặt sau */}
        <div className="flashcard-face back">
          <div className="flashcard-content">
            <h3 className="flashcard-title">
              {card.back}
            </h3>
            <p className="flashcard-subtitle">Đáp án</p>
          </div>
        </div>
      </div>

      {!isQuizMode && (
        <div className="flashcard-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="flashcard-action-button flashcard-edit-button"
            title="Chỉnh sửa"
          >
            Sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="flashcard-action-button flashcard-delete-button"
            title="Xóa"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;