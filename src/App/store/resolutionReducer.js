import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const updateResolution = createAsyncThunk(
  "resolution/update",
  (width) => {
    return {
      resolution: width,
      isMobile: width > 600 ? false : true,
    };
  }
);

export const resolutionReducer = createSlice({
  name: "resolution",
  initialState: {
    resolution: null,
    isMobile: null,
  },
  reducers: {},
  extraReducers: {
    [updateResolution.fulfilled]: (state, { payload }) => {
      state.resolution = payload.resolution;
      state.isMobile = payload.isMobile;
    },
  },
});
