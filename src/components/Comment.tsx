import React, { useState } from "react";
import moment from "moment";
import { Box, Button, TextField, Typography } from "@mui/material";
import { CommentObj } from "../types/types";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  createNewReply,
  deleteExistingComment,
  editExistingComment,
} from "../features/comment/commentSlice";

interface CommentProps {
  comment: CommentObj;
}

function getStylesForComment(level: number) {
  if (level === 1) {
    return { width: "100%" };
  } else if (level === 2) {
    return {
      width: "95%",
      borderLeftStyle: "solid",
      borderLeftSize: 1,
      borderLeftColor: "#D3D3D3",
      paddingLeft: "2.5%",
    };
  } else if (level === 3) {
    return {
      width: "90%",
      borderLeftStyle: "solid",
      borderLeftSize: 1,
      borderLeftColor: "#D3D3D3",
      paddingLeft: "2.5%",
    };
  }
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const currUid = useAppSelector((state) => state.auth.userInfo?.uid);

  const [replyToggle, setReplyToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);

  const [newComment, setNewComment] = useState<string>("");
  const [editComment, setEditComment] = useState<string>("");

  function deleteComment() {
    dispatch(
      deleteExistingComment({ commentId: comment.commentUid as string })
    );
  }

  function handleAddNewComment() {
    dispatch(
      createNewReply({
        reply: newComment,
        level: comment.level + 1,
        parentComment: comment.commentUid as string,
      })
    );
    setNewComment("");
    setReplyToggle(false);
  }

  function handleEditComment() {
    dispatch(
      editExistingComment({
        body: editComment,
        commentId: comment.commentUid as string,
      })
    );
    setEditComment("");
    setEditToggle(false);
  }

  function openEditComment() {
    setEditComment(comment.body);
    setEditToggle(true);
  }

  function closeEditComment() {
    setEditComment("");
    setEditToggle(false);
  }

  const visible = {
    visibility: comment.level === 3 || comment.deleted ? "hidden" : "visible",
  };
  const deleteVisible = {
    visibility:
      comment.createdByUid === currUid && !comment.deleted
        ? "visible"
        : "hidden",
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ...getStylesForComment(comment.level),
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 5, alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              {comment.deleted ? "[deleted]" : comment.displayName}
            </Typography>
            {comment.createdByUid === currUid && !comment.deleted && (
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  padding: "0px 4px",
                  borderRadius: "8px",
                }}
              >
                You
              </Typography>
            )}
          </Box>
          <Typography variant="body2">
            {moment(moment.unix(comment.timestamp.seconds)).fromNow()}
          </Typography>
        </Box>
        <Box>{comment.deleted ? "[deleted]" : comment.body}</Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              width: "fit-content",
              mt: 0.15,
              fontSize: "13px",
              color: "primary.main",
              fontWeight: "bold",
              cursor: "pointer",
              ...visible,
            }}
            onClick={() => setReplyToggle(!replyToggle)}
          >
            Reply
          </Typography>
          <Typography
            sx={{
              width: "fit-content",
              mt: 0.15,
              fontSize: "13px",
              color: "secondary.main",
              fontWeight: "bold",
              cursor: "pointer",
              ...deleteVisible,
            }}
            onClick={() => openEditComment()}
          >
            Edit
          </Typography>
          <Typography
            sx={{
              width: "fit-content",
              mt: 0.15,
              fontSize: "13px",
              color: "red",
              fontWeight: "bold",
              cursor: "pointer",
              ...deleteVisible,
            }}
            onClick={() => deleteComment()}
          >
            Delete
          </Typography>
        </Box>
        {(replyToggle || editToggle) && (
          <Box sx={{ mt: 1 }}>
            <TextField
              multiline
              minRows={3}
              sx={{ width: "60%" }}
              value={editToggle ? editComment : newComment}
              onChange={
                editToggle
                  ? (e) => setEditComment(e.target.value)
                  : (e) => setNewComment(e.target.value)
              }
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{ color: "white" }}
                onClick={
                  editToggle
                    ? () => handleEditComment()
                    : () => handleAddNewComment()
                }
              >
                Post
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={
                  editToggle
                    ? () => closeEditComment()
                    : () => setReplyToggle(false)
                }
                sx={{ fontWeight: "bold" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((comment) => (
          <Comment
            key={(comment as CommentObj).commentUid}
            comment={comment as CommentObj}
          />
        ))}
    </>
  );
};

export default Comment;
