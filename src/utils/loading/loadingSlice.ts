import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  globalLoading: boolean; // Trạng thái loading toàn cục
  contextLoading: Record<string, boolean>; // Trạng thái loading theo ngữ cảnh
}

const initialState: LoadingState = {
  globalLoading: false,
  contextLoading: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    /**
     * Cập nhật trạng thái loading toàn cục
     * @param state - Trạng thái hiện tại
     * @param action - Giá trị boolean (true: hiển thị, false: ẩn)
     */
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    /**
     * Cập nhật trạng thái loading cho một ngữ cảnh
     * @param state - Trạng thái hiện tại
     * @param action - Payload chứa context và isLoading
     */
    setContextLoading: (
      state,
      action: PayloadAction<{ context: string; isLoading: boolean }>
    ) => {
      const { context, isLoading } = action.payload;
      if (isLoading) {
        state.contextLoading[context] = true;
      } else {
        delete state.contextLoading[context];
      }
    },
  },
});

export const { setGlobalLoading, setContextLoading } = loadingSlice.actions;
export default loadingSlice.reducer;