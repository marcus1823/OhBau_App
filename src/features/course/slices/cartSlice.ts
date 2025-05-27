import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  addedCourses: string[];
}

const initialState: CartState = {
  addedCourses: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setAddedCourses: (state, action: PayloadAction<string[]>) => {
      state.addedCourses = action.payload;
    },
  },
});

export const { setAddedCourses } = cartSlice.actions;
export default cartSlice.reducer;