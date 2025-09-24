import { useState, useEffect, useCallback } from 'react';
import storageService from '../utils/storageService';

export const useFlashcards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const savedCards = storageService.getCards();
      setCards(savedCards);
      setError(null);
    } catch (err) {
      setError('Failed to load flashcards');
      console.error('Error loading flashcards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && cards.length >= 0) {
      const success = storageService.saveCards(cards);
      if (!success) {
        setError('Failed to save flashcards');
      }
    }
  }, [cards, loading]);

  const addCard = useCallback((newCard) => {
    const cardWithMetadata = {
      ...newCard,
      id: newCard.id || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCards(prevCards => [...prevCards, cardWithMetadata]);
  }, []);

  const updateCard = useCallback((updatedCard) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id 
          ? { ...updatedCard, updatedAt: new Date().toISOString() }
          : card
      )
    );
  }, []);

  const deleteCard = useCallback((cardId) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  }, []);

  const clearAllCards = useCallback(() => {
    setCards([]);
    storageService.clearCards();
  }, []);

  const cardsCount = cards.length;

  return {
    cards,
    loading,
    error,
    cardsCount,
    addCard,
    updateCard,
    deleteCard,
    clearAllCards
  };
};