import React, { useState, useEffect } from 'react';

// Mock localStorage for demo purposes (replace with real localStorage in production)
const mockStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// Flashcard Component with flip animation
const Flashcard = ({ card, onEdit, onDelete, isQuizMode = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container perspective-1000 w-full max-w-md mx-auto mb-4">
      <div
        className={`flashcard relative w-full h-64 cursor-pointer transform-style-preserve-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front */}
        <div className="flashcard-face absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center p-6 backface-hidden">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {card.front}
            </h3>
            <p className="text-blue-100 text-sm">Click to flip</p>
          </div>
        </div>

        {/* Back */}
        <div className="flashcard-face absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg flex items-center justify-center p-6 backface-hidden rotate-y-180">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {card.back}
            </h3>
            <p className="text-green-100 text-sm">Answer</p>
          </div>
        </div>
      </div>

      {!isQuizMode && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Add/Edit Flashcard Form
const FlashcardForm = ({ card, onSave, onCancel }) => {
  const [front, setFront] = useState(card ? card.front : '');
  const [back, setBack] = useState(card ? card.back : '');

  const handleSubmit = (e) => {
    if (front.trim() && back.trim()) {
      onSave({
        id: card ? card.id : Date.now(),
        front: front.trim(),
        back: back.trim()
      });
      setFront('');
      setBack('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {card ? 'Edit Flashcard' : 'Add New Flashcard'}
      </h3>
      
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Front (Question/Word):
          </label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            placeholder="Enter question or word..."
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Back (Answer/Definition):
          </label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            placeholder="Enter answer or definition..."
            required
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            {card ? 'Update' : 'Add'} Card
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Quiz Mode Component
const QuizMode = ({ cards, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Shuffle cards when quiz starts
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

  const handleCorrect = () => {
    setScore({ correct: score.correct + 1, total: score.total + 1 });
    handleNext();
  };

  const handleIncorrect = () => {
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

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">No cards available for quiz</p>
        <button
          onClick={onExit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Back to Cards
        </button>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😕'}
        </div>
        <p className="text-xl mb-2">
          Score: {score.correct}/{score.total} ({percentage}%)
        </p>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleRestart}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onExit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Back to Cards
          </button>
        </div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Quiz Mode</h2>
        <p className="text-gray-600">
          Card {currentIndex + 1} of {shuffledCards.length} | Score: {score.correct}/{score.total}
        </p>
      </div>

      <Flashcard card={currentCard} isQuizMode={true} />

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">Did you get it right?</p>
        <div className="flex space-x-3">
          <button
            onClick={handleIncorrect}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md transition-colors"
          >
            Incorrect
          </button>
          <button
            onClick={handleCorrect}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors"
          >
            Correct
          </button>
        </div>
        <button
          onClick={onExit}
          className="mt-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Exit Quiz
        </button>
      </div>
    </div>
  );
};

// Main App Component
const FlashcardsApp = () => {
  const [cards, setCards] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'add', 'edit', 'quiz'
  const [editingCard, setEditingCard] = useState(null);

  // Load cards from storage on mount
  useEffect(() => {
    const savedCards = mockStorage.getItem('flashcards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error('Error loading cards:', e);
      }
    } else {
      // Sample data for demo
      const sampleCards = [
        { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces" },
        { id: 2, front: "Hello", back: "Xin chào (Vietnamese)" },
        { id: 3, front: "PWA", back: "Progressive Web App" }
      ];
      setCards(sampleCards);
      mockStorage.setItem('flashcards', JSON.stringify(sampleCards));
    }
  }, []);

  // Save cards to storage whenever cards change
  useEffect(() => {
    mockStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]);
    setCurrentView('home');
  };

  const handleEditCard = (updatedCard) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
    setCurrentView('home');
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const startEdit = (card) => {
    setEditingCard(card);
    setCurrentView('edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Custom CSS for 3D effects */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .flashcard-face.rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <BookOpen className="mr-3 text-blue-600" />
            Flashcards App
          </h1>
          <p className="text-gray-600">Learn with interactive flashcards</p>
        </header>

        {/* Navigation */}
        {currentView !== 'home' && (
          <div className="mb-6">
            <button
              onClick={() => {
                setCurrentView('home');
                setEditingCard(null);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'home' && (
          <>
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setCurrentView('add')}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Card
              </button>
              
              {cards.length > 0 && (
                <button
                  onClick={() => setCurrentView('quiz')}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </button>
              )}
            </div>

            {/* Cards Grid */}
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(card => (
                  <Flashcard
                    key={card.id}
                    card={card}
                    onEdit={startEdit}
                    onDelete={handleDeleteCard}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No flashcards yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first flashcard to get started!
                </p>
                <button
                  onClick={() => setCurrentView('add')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Your First Card
                </button>
              </div>
            )}
          </>
        )}

        {currentView === 'add' && (
          <FlashcardForm
            onSave={handleAddCard}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'edit' && (
          <FlashcardForm
            card={editingCard}
            onSave={handleEditCard}
            onCancel={() => {
              setCurrentView('home');
              setEditingCard(null);
            }}
          />
        )}

        {currentView === 'quiz' && (
          <QuizMode
            cards={cards}
            onExit={() => setCurrentView('home')}
          />
        )}
      </div>

      {/* PWA Status Indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
          PWA Ready
        </div>
      </div>
    </div>
  );
};

export default FlashcardsApp;