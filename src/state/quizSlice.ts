import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** Dataset types (based on your /data/questions.json structure) */
export type Option = {
  label: string;
  image: string;
};

export type Question = {
  question: string;
  options: Option[];
  answer: string;
  explanation?: string;
};

/** Quiz state */
type QuizState = {
  topic: string;
  level: number;
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  score: number;
  answered: boolean;
  finished: boolean;
};

const initialState: QuizState = {
  topic: '',
  level: 1,
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  answered: false,
  finished: false,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    /** Load questions dynamically from dataset */
    setQuizData: (
      state,
      action: PayloadAction<{ topic: string; level: number; questions: Question[] }>
    ) => {
      state.topic = action.payload.topic;
      state.level = action.payload.level;
      state.questions = action.payload.questions;
      state.currentIndex = 0;
      state.selectedAnswer = null;
      state.score = 0;
      state.answered = false;
      state.finished = false;
    },

    /** Handle when user drops or clicks an answer */
    selectAnswer: (state, action: PayloadAction<string>) => {
      if (!state.answered && !state.finished) {
        state.selectedAnswer = action.payload;
        state.answered = true;
        const correctAnswer = state.questions[state.currentIndex].answer;
        if (action.payload === correctAnswer) {
          state.score += 1;
        }
      }
    },

    /** Move to the next question */
    nextQuestion: (state) => {
      if (state.currentIndex + 1 < state.questions.length) {
        state.currentIndex += 1;
        state.selectedAnswer = null;
        state.answered = false;
      } else {
        state.finished = true;
      }
    },

    /** Reset same level */
    retryLevel: (state) => {
      state.currentIndex = 0;
      state.selectedAnswer = null;
      state.answered = false;
      state.score = 0;
      state.finished = false;
    },

    /** Start a completely new level */
    setNextLevel: (state, action: PayloadAction<{ level: number; questions: Question[] }>) => {
      state.level = action.payload.level;
      state.questions = action.payload.questions;
      state.currentIndex = 0;
      state.selectedAnswer = null;
      state.answered = false;
      state.score = 0;
      state.finished = false;
    },
  },
});

export const {
  setQuizData,
  selectAnswer,
  nextQuestion,
  retryLevel,
  setNextLevel,
} = quizSlice.actions;

export default quizSlice.reducer;
