import { Button, TextField, Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  createNewComment,
  fetchAllComments,
  deleteExistingComment,
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
  const [openDelete, setOpenDelete] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<string>("");

  useEffect(() => {
    if (replies.length > 0) {
      dispatch(fetchAllComments(replies));
    }
  }, [dispatch, replies]);

  function handleAddNewComment() {
    dispatch(createNewComment({ comment: newComment, postId: postId }));
    setNewComment("");
  }

  function handleDeleteCancel() {
    setOpenDelete(false);
  }

  function handleSetDeleteCommentId(id: string) {
    setDeleteCommentId(id);
    setOpenDelete(true);
  }

  function handleCommentDelete() {
    dispatch(deleteExistingComment({ commentId: deleteCommentId })).then(() =>
      handleDeleteCancel()
    );
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    px: 4,
    py: 3,
    borderRadius: 2,
  };

  return (
    <>
      <Modal
        open={openDelete}
        onClose={handleDeleteCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color={"error"}
            sx={{ fontWeight: "bold" }}
          >
            Confirm Delete?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              id="modal-modal-description"
              sx={{ mt: 2, color: "white" }}
              variant="contained"
              size="small"
              onClick={() => handleCommentDelete()}
            >
              Delete
            </Button>
            <Button
              id="modal-modal-description"
              sx={{ mt: 2 }}
              variant="outlined"
              size="small"
              onClick={() => handleDeleteCancel()}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
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
              <Comment
                comment={comment}
                setDeleteId={handleSetDeleteCommentId}
              />
            </Box>
          ))}
      </Box>
    </>
  );
};

export default NestedComments;
