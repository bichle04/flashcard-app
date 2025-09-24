import React, { useState, useEffect } from 'react';
import '../styles/QuizMode.css';

const QuizMode = ({ cards, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);

  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, [cards]);

  useEffect(() => {
    if (shuffledCards.length > 0 && currentIndex < shuffledCards.length) {
      generateOptions();
    }
  }, [shuffledCards, currentIndex]);

  const generateOptions = () => {
    const currentCard = shuffledCards[currentIndex];
    if (!currentCard) return;

    const correctAnswer = currentCard.back;
    const otherCards = shuffledCards.filter((_, index) => index !== currentIndex);
    
    let wrongAnswers = otherCards
      .map(card => card.back)
      .filter(answer => answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    while (wrongAnswers.length < 3) {
      wrongAnswers.push(`${correctAnswer} (không đúng)`);
    }

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setMultipleChoiceOptions(allOptions);
  };

  const handleAnswerSelect = (selectedOption) => {
    if (isAnswered) return;

    setSelectedAnswer(selectedOption);
    setIsAnswered(true);

    const currentCard = shuffledCards[currentIndex];
    const isCorrect = selectedOption === currentCard.back;
    
    if (isCorrect) {
      setScore({ correct: score.correct + 1, total: score.total + 1 });
    } else {
      setScore({ ...score, total: score.total + 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  if (shuffledCards.length < 2) {
    return (
      <div className="quiz-empty animate-entrance">
        <div className="quiz-empty-icon">Chưa đủ thẻ</div>
        <h2 className="quiz-empty-title">Cần ít nhất 2 thẻ để làm trắc nghiệm</h2>
        <p className="quiz-empty-description">Vui lòng thêm thêm thẻ để bắt đầu trắc nghiệm</p>
        <button onClick={onExit} className="quiz-empty-button">
          Quay lại danh sách thẻ
        </button>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="quiz-results animate-entrance">
        <h2 className="quiz-results-title">Hoàn thành trắc nghiệm!</h2>
        <p className="quiz-results-score">
          Điểm số: {score.correct}/{score.total} ({percentage}%)
        </p>
        <div className="quiz-results-actions">
          <button onClick={handleRestart} className="quiz-results-button quiz-results-button-primary">
            Làm lại
          </button>
          <button onClick={onExit} className="quiz-results-button quiz-results-button-secondary">
            Về danh sách thẻ
          </button>
        </div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="quiz-container animate-entrance">
      <div className="quiz-header">
        <h2 className="quiz-title">Chế độ trắc nghiệm</h2>
        <p className="quiz-progress">
          Câu {currentIndex + 1} / {shuffledCards.length} | Điểm: {score.correct}/{score.total}
        </p>
      </div>

      <div className="quiz-question-card">
        <div className="quiz-question-content">
          <h3 className="quiz-question-title">Câu hỏi:</h3>
          <p className="quiz-question-text">{currentCard.front}</p>
        </div>
      </div>

      <div className="quiz-options">
        {multipleChoiceOptions.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentCard.back;
          const shouldShowCorrect = isAnswered && isCorrect;
          const shouldShowWrong = isAnswered && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`quiz-option ${
                shouldShowCorrect ? 'quiz-option-correct' : 
                shouldShowWrong ? 'quiz-option-wrong' : 
                isSelected ? 'quiz-option-selected' : ''
              }`}
              disabled={isAnswered}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + index)}.</span>
              <span className="quiz-option-text">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="quiz-actions">
        {isAnswered ? (
          <button onClick={handleNext} className="quiz-next-button">
            {currentIndex < shuffledCards.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        ) : (
          <p className="quiz-instruction">Chọn đáp án đúng</p>
        )}
        
        <button onClick={onExit} className="quiz-exit-button">
          Thoát trắc nghiệm
        </button>
      </div>
    </div>
  );
};

export default QuizMode;