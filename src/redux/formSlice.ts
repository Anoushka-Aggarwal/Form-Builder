import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField } from "../types/form";

// Define state shape
interface FormState {
  fields: FormField[];
}

const initialState: FormState = {
  fields: [],
};

// Create the slice
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.fields.push(action.payload);
    },
    resetForm: (state) => {
      state.fields = [];
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((field) => field.id !== action.payload);
    },
    moveFieldUp: (state, action: PayloadAction<string>) => {
      const index = state.fields.findIndex((f) => f.id === action.payload);
      if (index > 0) {
        const temp = state.fields[index];
        state.fields[index] = state.fields[index - 1];
        state.fields[index - 1] = temp;
      }
    },
    moveFieldDown: (state, action: PayloadAction<string>) => {
      const index = state.fields.findIndex((f) => f.id === action.payload);
      if (index < state.fields.length - 1) {
        const temp = state.fields[index];
        state.fields[index] = state.fields[index + 1];
        state.fields[index + 1] = temp;
      }
    },
  },
});

export const { addField, removeField, moveFieldUp, moveFieldDown, resetForm } = formSlice.actions;
export default formSlice.reducer;
