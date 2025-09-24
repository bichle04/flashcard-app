import React, { useState } from 'react';
import '../styles/FlashcardForm.css';

const FlashcardForm = ({ card, onSave, onCancel }) => {
  const [front, setFront] = useState(card ? card.front : '');
  const [back, setBack] = useState(card ? card.back : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onSave({
        id: card ? card.id : Date.now(),
        front: front.trim(),
        back: back.trim()
      });
      if (!card) {
        setFront('');
        setBack('');
      }
    }
  };

  return (
    <div className="form-container animate-entrance">
      <h3 className="form-title">
        {card ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Mặt trước (Câu hỏi/Từ vựng):
          </label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="form-textarea"
            placeholder="Nhập câu hỏi hoặc từ vựng..."
            required
          />
        </div>
        
        <div className="form-group last">
          <label className="form-label">
            Mặt sau (Đáp án/Định nghĩa):
          </label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="form-textarea"
            placeholder="Nhập đáp án hoặc định nghĩa..."
            required
          />
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="form-button form-button-primary"
          >
            {card ? 'Cập nhật' : 'Thêm'} thẻ
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="form-button form-button-secondary"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardForm;