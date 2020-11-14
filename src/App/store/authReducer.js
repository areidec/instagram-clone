import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase";

export const signUpFailed = createAction("auth/signUpFailed");
export const setUser = createAction("auth/setUser");
export const openModal = createAction("auth/openModal");
export const closeModal = createAction("auth/closeModal");
export const resetError = createAction("auth/resetError");
export const updateUserPhoto = createAction("auth/updateUserPhoto");
export const logIn = createAsyncThunk("login", async ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password)
);
export const logOut = createAsyncThunk("logOut", async () => auth.signOut());
export const signUp = createAsyncThunk(
  "signUp",
  async ({ email, password, userName }, { dispatch }) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const {
          user: { uid },
        } = userCredential;
        return Promise.all([
          userCredential.user.updateProfile({ displayName: userName }),
          db.collection("users").doc(uid).set({
            displayName: userName,
            user_id: uid,
            email,
            photoURL: null,
            user_posts: [],
          }),
        ]);
      })
      .catch((err) => {
        dispatch(signUpFailed(err));
      });
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    isLogined: null,
    userData: null,
    error: null,
    isAuthModalOpen: false,
  },
  reducers: {
    openModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeModal: (state) => {
      state.isAuthModalOpen = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    setUser: (state, { payload }) => {
      if (payload) {
        state.isLogined = true;
        state.userData = { ...state.userData, ...payload };
      }
    },
    signUpFailed: (state, { payload }) => {
      state.error = payload.message;
      state.isLogined = false;
    },
    updateUserPhoto: (state, { payload }) => {
      state.userData = {
        ...state.userData,
        photoURL: payload,
      };
    },
  },
  extraReducers: {
    [logIn.fulfilled]: (state, action) => {
      state.error = null;
      state.isAuthModalOpen = false;
    },
    [logIn.rejected]: (state, action) => {
      state.error = action.error.message;
      state.isLogined = false;
    },
    [signUp.fulfilled]: (state, action) => {
      state.error = null;
      state.isAuthModalOpen = false;
      state.userData = {
        ...state.userData,
        displayName: action.meta.arg.userName,
      };
    },
    [logOut.fulfilled]: (state, action) => {
      state.isLogined = null;
      state.userData = null;
      state.error = null;
    },
  },
});
