import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { currAuth, db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { PostObj } from "../../types/types";
import { RootState } from "../../app/store";

interface PostState {
  postInfo: PostObj[] | undefined;
  loading: boolean;
  error: boolean;
  errorMsg: string | undefined;
  profilePostArr: PostObj[] | undefined;
}

const initialState: PostState = {
  postInfo: undefined,
  loading: false,
  error: false,
  errorMsg: "",
  profilePostArr: undefined,
};

async function getCreatorNameFromId(uid: string) {
  const creatorNameRef = doc(db, "users", uid);
  const creatorNameSnap = await getDoc(creatorNameRef);
  if (creatorNameSnap.exists()) {
    const name = await creatorNameSnap.data().displayName;
    return name;
  } else {
    return undefined;
  }
}

export const createNewPost = createAsyncThunk(
  "post/createNewPost",
  async ({ title, body }: { title: string; body: string }) => {
    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        body: body,
        createdByUid: currAuth.currentUser?.uid,
        published: serverTimestamp(),
        score: 0,
        upvoteArr: [],
        downvoteArr: [],
        replies: [],
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }
);

export const fetchAllPosts = createAsyncThunk(
  "post/fetchAllPosts",
  async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsArr: PostObj[] = [];
      const promises = querySnapshot.docs.map(async (doc) => {
        const displayName = await getCreatorNameFromId(doc.data().createdByUid);
        const postObj: PostObj = {
          ...doc.data(),
          postId: doc.id,
          displayName: displayName as string,
        } as PostObj;
        return postObj;
      });
      const resolvedPosts = await Promise.all(promises);
      postsArr.push(...resolvedPosts);
      return JSON.stringify(postsArr);
    } catch (error) {
      return error;
    }
  }
);

export const fetchExistingPost = createAsyncThunk(
  "post/fetchExistingPost",
  async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      return postSnap.data();
    } else {
      return undefined;
    }
  }
);

export const votePost = createAsyncThunk(
  "post/votePost",
  async ({
    postId,
    type,
    currPostObj,
  }: {
    postId: string;
    type: string;
    currPostObj: PostObj;
  }) => {
    try {
      const currUid = currAuth.currentUser?.uid;
      const creatorNameRef = doc(db, "posts", postId);
      if (currPostObj) {
        if (
          type === "upvote" &&
          !currPostObj?.upvoteArr.includes(currUid as string)
        ) {
          console.log(currPostObj);
          console.log("1");
          // check if already downvoted, if yes then remove
          if (currPostObj?.downvoteArr.includes(currUid as string)) {
            let tempArr = currPostObj?.downvoteArr;
            if (tempArr) {
              tempArr = tempArr.filter((ele: string) => ele !== currUid);
            }
            currPostObj.downvoteArr = tempArr;
            currPostObj.score = (currPostObj.score ?? 0) + 1;
          }

          // add to upvote arr
          currPostObj.upvoteArr = [...currPostObj.upvoteArr, currUid as string];
          currPostObj.score = (currPostObj.score ?? 0) + 1;
        } else if (
          type === "downvote" &&
          !currPostObj?.downvoteArr.includes(currUid as string)
        ) {
          console.log("2");
          // check if already upvoted, if yes then remove
          if (currPostObj?.upvoteArr.includes(currUid as string)) {
            let tempArr = currPostObj?.upvoteArr;
            if (tempArr) {
              tempArr = tempArr.filter((ele: string) => ele !== currUid);
            }
            currPostObj.upvoteArr = tempArr;
            currPostObj.score = (currPostObj.score ?? 0) - 1;
          }

          // add to downvote arr
          currPostObj.downvoteArr = [
            ...currPostObj.downvoteArr,
            currUid as string,
          ];
          currPostObj.score = (currPostObj.score ?? 0) - 1;
        } else if (
          type === "upvote" &&
          currPostObj?.upvoteArr.includes(currUid as string)
        ) {
          console.log("3");
          currPostObj.upvoteArr = currPostObj.upvoteArr.filter(
            (ele: string) => ele !== currUid
          );
          currPostObj.score = (currPostObj.score ?? 0) - 1;
        } else if (
          type === "downvote" &&
          currPostObj?.downvoteArr.includes(currUid as string)
        ) {
          console.log("4");
          currPostObj.downvoteArr = currPostObj.downvoteArr.filter(
            (ele: string) => ele !== currUid
          );
          currPostObj.score = (currPostObj.score ?? 0) + 1;
        }

        try {
          console.log(currPostObj);
          await updateDoc(creatorNameRef, { ...currPostObj });
          return JSON.stringify({ ...currPostObj, postId: postId });
        } catch (error) {
          console.error("Error updating post:", error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchCurrUserPosts = createAsyncThunk(
  "post/fetchCurrUserPosts",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const postsRef = collection(db, "posts");
    const currUid = state.auth.userInfo?.uid;
    const q = query(postsRef, where("createdByUid", "==", currUid));
    const postSnap = await getDocs(q);
    const postsArr: PostObj[] = [];
    postSnap.forEach((post) => {
      postsArr.push(post.data() as PostObj);
    });
    dispatch(postSlice.actions.setCurrProfilePosts(postsArr));
    // return postsArr;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setCurrProfilePosts: (state, action) => {
      state.profilePostArr = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders.addCase(fetchAllPosts.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.postInfo = JSON.parse(action.payload as string) as PostObj[];
    });
    builders.addCase(fetchAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = action.error.message;
    });
    builders.addCase(votePost.fulfilled, (state, action) => {
      const currPostObj = JSON.parse(action.payload as string) as PostObj;
      const allPosts = current(state.postInfo);
      if (currPostObj && allPosts) {
        const tempArr = allPosts.map((post) =>
          post.postId === currPostObj.postId ? currPostObj : post
        );
        return {
          ...state,
          postInfo: tempArr,
        };
      }
      return state;
    });
  },
});

export default postSlice.reducer;
