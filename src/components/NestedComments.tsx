import { Button, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  createNewComment,
  fetchAllComments,
} from "../features/comment/commentSlice";
import Comment from "./Comment";

interface NestedCommentsProps {
  replies: string[];
  postId: string;
}

const NestedComments: React.FC<NestedCommentsProps> = ({ replies, postId }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comment.comments);
  const commentsLoading = useAppSelector((state) => state.comment.loading);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (replies.length > 0) {
      dispatch(fetchAllComments(replies));
    }
  }, []);

  // useEffect(() => console.log(comments), [comments]);

  function handleAddNewComment() {
    console.log(newComment);
    dispatch(createNewComment({ comment: newComment, postId: postId }));
    setNewComment("");
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          gap: 1,
        }}
      >
        <TextField
          multiline
          minRows={3}
          type="text"
          sx={{ width: "100%" }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          size="small"
          sx={{ color: "white", width: "fit-content" }}
          onClick={() => handleAddNewComment()}
        >
          Post
        </Button>
      </Box>
      {commentsLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "10em",
          }}
        >
          Loading...
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
        }}
      >
        {comments.length > 0 &&
          comments.map((comment) => (
            <Box
              key={comment.commentUid}
              style={{
                marginBottom: "1em",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <Comment comment={comment} />
            </Box>
          ))}
      </Box>
    </>
  );
};

export default NestedComments;
