import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyCourseState {
    addedMyCourses: string[];
}


const initialState: MyCourseState = {
    addedMyCourses: [],
};

const myCourseSlice = createSlice({
    name: 'addedMyCourses',
    initialState,
    reducers: {
        setAddedMyCourses: (state, action: PayloadAction<string[]>) => {
            state.addedMyCourses = action.payload;
        },
    },
});

export const { setAddedMyCourses } = myCourseSlice.actions;
export default myCourseSlice.reducer;