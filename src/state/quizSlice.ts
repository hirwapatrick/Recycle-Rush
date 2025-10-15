import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuizState = {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  score: number;
  answered: boolean;
};

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  answered: false,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    selectAnswer: (state, action: PayloadAction<string>) => {
      if (!state.answered) {
        state.selectedAnswer = action.payload;
        state.answered = true;
        if (action.payload === state.questions[state.currentIndex].answer) {
          state.score += 1;
        }
      }
    },
    nextQuestion: (state) => {
      state.selectedAnswer = null;
      state.answered = false;
      if (state.currentIndex + 1 < state.questions.length) {
        state.currentIndex += 1;
      }
    },
    resetQuiz: (state) => {
      state.currentIndex = 0;
      state.selectedAnswer = null;
      state.answered = false;
      state.score = 0;
    },
  },
});

export const { setQuestions, selectAnswer, nextQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
