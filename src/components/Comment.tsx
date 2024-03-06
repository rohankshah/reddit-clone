import React, { useState } from "react";
import moment from "moment";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { CommentObj } from "../types/types";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { createNewReply } from "../features/comment/commentSlice";

interface CommentProps {
  comment: CommentObj;
}

function getWidthForLevel(level: number) {
  if (level === 1) {
    return "100%";
  } else if (level === 2) {
    return "95%";
  } else if (level === 3) {
    return "90%";
  }
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const currUid = useAppSelector((state) => state.auth.userInfo?.uid);

  const [replyToggle, setReplyToggle] = useState(false);
  const [newComment, setNewComment] = useState<string>("");

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

  const visible = { visibility: comment.level === 3 ? "hidden" : "visible" };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: getWidthForLevel(comment.level),
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 5, alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              {comment.displayName}
            </Typography>
            {comment.createdByUid === currUid && (
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
        <Box>{comment.body}</Box>
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
        {replyToggle && (
          <Box sx={{ mt: 1 }}>
            <TextField
              multiline
              minRows={3}
              sx={{ width: "60%" }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{ color: "white" }}
                onClick={() => handleAddNewComment()}
              >
                Post
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setReplyToggle(false)}
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
