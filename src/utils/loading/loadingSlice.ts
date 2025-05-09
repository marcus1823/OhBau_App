import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
    globalLoading: boolean; // Loading toàn màn hình
    contextLoading: Record<string, boolean>; // Loading theo ngữ cảnh (ví dụ: "login", "fetchData")
}

const initialState: LoadingState = {
    globalLoading: false,
    contextLoading: {},
};

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            state.globalLoading = action.payload;
        },
        setContextLoading: (state, action: PayloadAction<{ context: string; isLoading: boolean }>) => {
            const { context, isLoading } = action.payload;
            state.contextLoading[context] = isLoading;
        },
        clearContextLoading: (state, action: PayloadAction<string>) => {
            delete state.contextLoading[action.payload];
        },
    },
});

export const { setGlobalLoading, setContextLoading, clearContextLoading } = loadingSlice.actions;
export default loadingSlice.reducer;