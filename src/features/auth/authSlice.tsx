import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  currAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
  signOut,
} from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import type { RootState } from "../../app/store";
import { User } from "firebase/auth";

interface AuthState {
  userInfo: User | null;
  loading: boolean;
  error: boolean;
  errorMsg: string | undefined;
}

const initialState: AuthState = {
  userInfo: null,
  loading: false,
  error: false,
  errorMsg: "",
};

export const createNewUser = createAsyncThunk(
  "auth/createNewUser",
  async ({
    email,
    pass,
    displayName,
  }: {
    email: string;
    pass: string;
    displayName: string;
  }) => {
    const userObj = await createUserWithEmailAndPassword(currAuth, email, pass);
    await updateProfile(userObj.user, { displayName: displayName });
    await setDoc(doc(db, "users", userObj.user.uid), {
      email: userObj.user.email,
      displayName: userObj.user.displayName,
      followers: [],
    });
    return JSON.stringify(userObj.user);
  }
);

export const loginExistingUser = createAsyncThunk(
  "auth/loginExistingUser",
  async ({ email, pass }: { email: string; pass: string }) => {
    try {
      const userObj = await signInWithEmailAndPassword(currAuth, email, pass);
      return JSON.stringify(userObj.user);
    } catch (error) {
      console.log(error);
      return new Promise((_, reject) => {
        reject(error);
      });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", () => {
  return signOut(currAuth);
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logInUser: (state, action) => {
      state.userInfo = JSON.parse(action.payload);
    },
  },
  extraReducers: (builders) => {
    builders.addCase(createNewUser.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(createNewUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = JSON.parse(action.payload);
    });
    builders.addCase(createNewUser.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = action.error.message;
    });
    builders.addCase(loginExistingUser.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(loginExistingUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = JSON.parse(action.payload as string);
    });
    builders.addCase(loginExistingUser.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = action.error.message;
    });
    builders.addCase(logoutUser.fulfilled, (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = false;
      state.errorMsg = "";
    });
  },
});

export const { logInUser } = authSlice.actions;

export const getCurrUser = (state: RootState) => state.auth.userInfo;
export const getAuthLoading = (state: RootState) => state.auth.loading;
export const getAuthError = (state: RootState) => state.auth.error;
export const getAuthErrorMsg = (state: RootState) => state.auth.errorMsg;

export default authSlice.reducer;
