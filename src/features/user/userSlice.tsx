import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { currAuth, db } from "../../firebase";
import { UserObj } from "../../types/types";
import { RootState } from "../../app/store";

interface UserState {
  users: UserObj[] | undefined;
  loading: boolean;
  errorMsg: string;
}

const initialState: UserState = {
  users: undefined,
  loading: false,
  errorMsg: "",
};

function updateUsersArr(
  arr: UserObj[],
  targetId: string,
  currId: string,
  type: string
) {
  return arr.map((user) => {
    if (user.id === targetId) {
      if (type === "follow") {
        user.followers?.push(currId);
      } else if (type === "unfollow") {
        user.followers = user.followers?.filter((user) => user !== currId);
      }
      return user;
    } else {
      return user;
    }
  });
}

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async () => {
    const userSnapshot = await getDocs(collection(db, "users"));
    const usersArr: UserObj[] = [];
    userSnapshot.forEach((doc) => {
      usersArr.push({ ...doc.data(), id: doc.id } as UserObj);
    });
    return usersArr;
  }
);

export const followUnfollowUser = createAsyncThunk(
  "user/followUser",
  async (
    { userId, type }: { userId: string; type: string },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const currId = currAuth.currentUser?.uid;
    const usersArr = JSON.parse(JSON.stringify(state.user.users));
    const userRef = doc(db, "users", userId);
    if (type === "follow") {
      await updateDoc(userRef, {
        followers: arrayUnion(currId),
      });
      const updatedArr = updateUsersArr(
        usersArr,
        userId,
        currId as string,
        "follow"
      );
      dispatch(userSlice.actions.updateUserArr(updatedArr));
    } else if (type === "unfollow") {
      await updateDoc(userRef, {
        followers: arrayRemove(currId),
      });
      const updatedArr = updateUsersArr(
        usersArr,
        userId,
        currId as string,
        "unfollow"
      );
      dispatch(userSlice.actions.updateUserArr(updatedArr));
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserArr(state, action) {
      state.users = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builders.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.errorMsg = action.error as string;
    });
  },
});

export default userSlice.reducer;
