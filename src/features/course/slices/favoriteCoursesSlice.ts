import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteCoursesState {
    favoriteCourses: string[];
}


const initialState: FavoriteCoursesState = {
    favoriteCourses: [],
};

const favoriteCoursesSlice = createSlice({
    name: 'favoriteCourses',
    initialState,
    reducers: {
        setFavoriteCourses: (state, action: PayloadAction<string[]>) => {
            state.favoriteCourses = action.payload;
        },
        addFavoriteCourse: (state, action: PayloadAction<string>) => {
            if (!state.favoriteCourses.includes(action.payload)) {
                state.favoriteCourses.push(action.payload);
            }
        },
        removeFavoriteCourse: (state, action: PayloadAction<string>) => {
            state.favoriteCourses = state.favoriteCourses.filter(id => id !== action.payload);
        },
    },
});

export const { setFavoriteCourses, addFavoriteCourse, removeFavoriteCourse } = favoriteCoursesSlice.actions;
export default favoriteCoursesSlice.reducer;
