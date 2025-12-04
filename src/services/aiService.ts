// AI Service - Calls Netlify function for Groq API
import { Inspiration } from './storage';

const API_URL = '/.netlify/functions/groq';

interface AIResponse<T> {
  data: T | null;
  error: string | null;
}

export async function generateInspiration(): Promise<AIResponse<Omit<Inspiration, 'id' | 'date'>>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'inspiration' }),
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('AI Inspiration error:', error);
    return { data: null, error: 'Impossible de générer l\'inspiration' };
  }
}

export async function generateQuizCode(): Promise<AIResponse<{ questions: { question: string; options: string[]; correct: number }[] }>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'quiz_code' }),
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('AI Quiz Code error:', error);
    return { data: null, error: 'Impossible de générer le quiz' };
  }
}

export async function generateQuizInspiration(inspirations: Inspiration[]): Promise<AIResponse<{ questions: { question: string; options: string[]; correct: number }[] }>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'quiz_inspi',
        data: { inspirations }
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('AI Quiz Inspi error:', error);
    return { data: null, error: 'Impossible de générer le quiz' };
  }
}

export async function analyzeAIUsage(category: string, question: string, reason: string): Promise<AIResponse<{ score: number; analysis: string; suggestion: string }>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'analyse',
        data: { category, question, reason }
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return { data: null, error: 'Impossible d\'analyser l\'utilisation' };
  }
}
