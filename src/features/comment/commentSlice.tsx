import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { currAuth, db } from "../../firebase";
import { CommentObj } from "../../types/types";
import { RootState } from "../../app/store";

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

async function getCommentDisplayName(uid: string) {
  const creatorNameRef = doc(db, "users", uid);
  const creatorNameSnap = await getDoc(creatorNameRef);
  if (creatorNameSnap.exists()) {
    const name = await creatorNameSnap.data().displayName;
    return name;
  }
}

async function getCommentData(commentId: string) {
  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);
  const commentData = commentSnap.data();
  const displayName = await getCommentDisplayName(commentData?.createdByUid);
  if (commentData) {
    commentData.displayName = displayName;
    commentData.commentUid = commentId;
  }
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

function addCommentToParent(
  allComments: CommentObj[],
  parentId: string,
  newComment: CommentObj
) {
  for (let i = 0; i < allComments.length; i++) {
    const comment = allComments[i];
    if (comment.commentUid === parentId) {
      comment.replies.push(newComment);
      return true;
    } else if (comment.replies.length > 0) {
      const found = addCommentToParent(
        comment.replies as CommentObj[],
        parentId,
        newComment
      );
      if (found) return true;
    }
  }
  return false;
}

export const createNewReply = createAsyncThunk(
  "comment/createNewReply",
  async (
    {
      reply,
      level,
      parentComment,
    }: {
      reply: string;
      level: number;
      parentComment: string;
    },
    { getState }
  ) => {
    const state = getState();
    const allComments = (state as RootState).comment.comments;
    const newAllComments = JSON.parse(JSON.stringify(allComments));
    try {
      const newCommentDoc = {
        body: reply,
        level: level,
        replies: [],
        timestamp: Timestamp.fromDate(new Date()),
        createdByUid: currAuth.currentUser?.uid as string,
      };
      const dataRef = await addDoc(collection(db, "comments"), newCommentDoc);
      const parentCommentRef = doc(db, "comments", parentComment);
      await updateDoc(parentCommentRef, {
        replies: arrayUnion(dataRef.id),
      });
      addCommentToParent(newAllComments, parentComment, {
        ...newCommentDoc,
        displayName: (state as RootState).auth.userInfo?.displayName as string,
        commentUid: dataRef.id,
      });
      return JSON.stringify(newAllComments);
    } catch (error) {
      console.log(error);
    }
  }
);

// async function addCommentToPostObj(postInfo: PostObj[], postId: string, newComment: CommentObj) {
//   postInfo.map(post => {
//     if (post.postId === postId) {
//       post.replies.push(newComment)
//     } else {
//       return post
//     }
//   })
// }

export const createNewComment = createAsyncThunk(
  "comment/createNewComment",
  async (
    { comment, postId }: { comment: string; postId: string },
    { dispatch }
  ) => {
    try {
      const newCommentDoc = {
        body: comment,
        level: 1,
        replies: [],
        timestamp: Timestamp.fromDate(new Date()),
        createdByUid: currAuth.currentUser?.uid as string,
      };
      const dataRef = await addDoc(collection(db, "comments"), newCommentDoc);
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        replies: arrayUnion(dataRef.id),
      });
      dispatch(
        addNewComment(
          JSON.stringify({
            ...newCommentDoc,
            displayName: currAuth.currentUser?.displayName,
            commentUid: dataRef.id,
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addNewComment(state, action) {
      state.comments.push(JSON.parse(action.payload));
    },
  },
  extraReducers: (builders) => {
    builders.addCase(fetchAllComments.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(fetchAllComments.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = JSON.parse(action.payload);
    });
    builders.addCase(fetchAllComments.rejected, (state) => {
      state.loading = false;
      state.error = "error";
    });
    builders.addCase(createNewReply.fulfilled, (state, action) => {
      state.comments = JSON.parse(action.payload as string);
    });
  },
});

export const { addNewComment } = commentSlice.actions;

export default commentSlice.reducer;
