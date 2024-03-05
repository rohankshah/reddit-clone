import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { CommentObj } from "../../types/types";

interface CommentState {
  comments: CommentObj[];
  loading: boolean;
  error: string;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: "",
};

async function getCommentData(commentId: string) {
  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);
  const commentData = commentSnap.data();
  if (commentData && commentData.replies.length > 0) {
    const repliesDataPromises = commentData.replies.map((commentId: string) =>
      getCommentData(commentId)
    );
    const repliesData = await Promise.all(repliesDataPromises);
    commentData.replies = repliesData;
  }
  return commentData;
}

export const fetchAllComments = createAsyncThunk(
  "comment/fetchAllComments",
  async (commentsId: string[]) => {
    const commentPromises = commentsId.map((commentId) =>
      getCommentData(commentId)
    );
    const commentData = await Promise.all(commentPromises);
    return JSON.stringify(commentData);
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
});

export default commentSlice.reducer;
