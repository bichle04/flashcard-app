import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import '../styles/StudyMode.css';

const StudyMode = ({ cards, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, [cards]);

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleKnow = () => {
    setScore({ correct: score.correct + 1, total: score.total + 1 });
    handleNext();
  };

  const handleLearning = () => {
    setScore({ ...score, total: score.total + 1 });
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowResult(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  if (showResult) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="study-results animate-entrance">
        <h2 className="study-results-title">Hoàn thành việc học!</h2>
        <p className="study-results-score">
          Kết quả: {score.correct}/{score.total} thẻ đã biết ({percentage}%)
        </p>
        <div className="study-results-actions">
          <button
            onClick={handleRestart}
            className="study-results-button study-results-button-primary"
          >
            Học lại
          </button>
          <button
            onClick={onExit}
            className="study-results-button study-results-button-secondary"
          >
            Về danh sách thẻ
          </button>
        </div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="study-container animate-entrance">
      <div className="study-header">
        <h2 className="study-title">Chế độ học</h2>
        <p className="study-progress">
          Thẻ {currentIndex + 1} / {shuffledCards.length} | Đã biết: {score.correct}/{score.total}
        </p>
      </div>

      <div className="study-card-container">
        <Flashcard card={currentCard} isStudyMode={true} />
      </div>

      <div className="study-actions">
        <div className="study-buttons">
          <button
            onClick={handleLearning}
            className="study-button study-button-learning"
          >
            Đang học
          </button>
          <button
            onClick={handleKnow}
            className="study-button study-button-know"
          >
            Biết
          </button>
        </div>
        <button
          onClick={onExit}
          className="study-exit-button"
        >
          Thoát
        </button>
      </div>
    </div>
  );
};

export default StudyMode;