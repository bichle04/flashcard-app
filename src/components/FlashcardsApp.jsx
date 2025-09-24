import React, { useState, useEffect } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { registerSW, requestNotificationPermission, isStandalone } from '../utils/pwaUtils';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';
import StudyMode from './StudyMode';
import QuizMode from './QuizMode';
import '../styles/FlashcardsApp.css';

const FlashcardsApp = () => {
  const { cards, loading, error, addCard, updateCard, deleteCard } = useFlashcards();
  const [currentView, setCurrentView] = useState('home');
  const [editingCard, setEditingCard] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Handle PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    registerSW();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
      setCurrentView('add');
    } else if (action === 'study' && cards.length > 0) {
      setCurrentView('study');
    } else if (action === 'quiz' && cards.length > 0) {
      setCurrentView('quiz');
    }
  }, [cards.length]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const handleAddCard = (newCard) => {
    addCard(newCard);
    setCurrentView('home');
  };

  const handleEditCard = (updatedCard) => {
    updateCard(updatedCard);
    setCurrentView('home');
    setEditingCard(null);
  };

  const startEdit = (card) => {
    setEditingCard(card);
    setCurrentView('edit');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải thẻ học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header animate-slide-in-top">
          <h1 className="app-title">
            Flashcard
          </h1>
          
          {/* Status indicators */}
          <div className="status-indicators">
            <div className="status-indicator">
              {isOnline ? (
                <span className="status-online">Trực tuyến</span>
              ) : (
                <span className="status-offline">Ngoại tuyến</span>
              )}
            </div>
            {isStandalone() && (
              <div className="status-indicator status-cards">Chế độ ứng dụng</div>
            )}
          </div>
        </header>

        {error && (
          <div className="error-message animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {showInstallButton && (
          <div className="install-container animate-fade-in">
            <button
              onClick={handleInstallClick}
              className="install-button"
            >
              Cài đặt ứng dụng
            </button>
          </div>
        )}

        {currentView !== 'home' && (
          <div className="navigation-container animate-fade-in">
            <button
              onClick={() => {
                setCurrentView('home');
                setEditingCard(null);
              }}
              className="nav-button"
            >
              Về trang chủ
            </button>
          </div>
        )}

        {currentView === 'home' && (
          <div className="main-content animate-fade-in">
            <div className="action-buttons-container">
              <button
                onClick={() => setCurrentView('add')}
                className="action-button action-button-add"
              >
                Thêm thẻ mới
              </button>
              
              {cards.length > 0 && (
                <>
                  <button
                    onClick={() => setCurrentView('study')}
                    className="action-button action-button-study"
                  >
                    Chế độ học
                  </button>
                  <button
                    onClick={() => setCurrentView('quiz')}
                    className="action-button action-button-quiz"
                  >
                    Trắc nghiệm
                  </button>
                </>
              )}
            </div>

            {/* Card */}
            {cards.length > 0 ? (
              <div className="cards-grid">
                {cards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="card-wrapper animate-slide-in-bottom"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Flashcard
                      card={card}
                      onEdit={startEdit}
                      onDelete={deleteCard}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state animate-fade-in">
                <h3 className="empty-state-title">
                  Trống
                </h3>
              </div>
            )}
          </div>
        )}

        {currentView === 'add' && (
          <div className="content-container animate-slide-in-bottom">
            <FlashcardForm
              onSave={handleAddCard}
              onCancel={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'edit' && (
          <div className="content-container animate-slide-in-bottom">
            <FlashcardForm
              card={editingCard}
              onSave={handleEditCard}
              onCancel={() => {
                setCurrentView('home');
                setEditingCard(null);
              }}
            />
          </div>
        )}

        {currentView === 'study' && (
          <div className="study-container animate-slide-in-bottom">
            <StudyMode
              cards={cards}
              onExit={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'quiz' && (
          <div className="quiz-container animate-slide-in-bottom">
            <QuizMode
              cards={cards}
              onExit={() => setCurrentView('home')}
            />
          </div>
        )}
      </div>

      {/* PWA Status Indicator */}
      <div className="pwa-indicator">
        <div className="pwa-badge">
          {isStandalone() ? 'Ứng dụng' : 'Sẵn sàng cài đặt'}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsApp;