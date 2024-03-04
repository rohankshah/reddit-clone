import React from "react";
import { Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { votePost } from "../features/post/postSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { PostObj } from "../types/types";

interface CommentScoreProps {
  post: PostObj;
}

const CommentScore: React.FC<CommentScoreProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const currUserId = useAppSelector((state) => state.auth.userInfo?.uid);

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: "flex",
        flexDirection: { md: "column", xs: "row" },
        marginLeft: { md: "10px" },
        width: { md: "2.5rem", xs: "fit-content" },
        height: "fit-content",
        // justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        borderRadius: 2,
        border: "1px solid black",
        padding: { md: "5px", xs: "2px 5px" },
        cursor: "default",
      }}
    >
      <AddIcon
        onClick={(e) => {
          e.stopPropagation();
          dispatch(
            votePost({
              postId: post.postId,
              type: "upvote",
              currPostObj: { ...post },
            })
          );
        }}
        color={
          post.upvoteArr.includes(currUserId as string) ? "primary" : "inherit"
        }
        fontSize="small"
        sx={{ cursor: "pointer" }}
      />
      <Typography>{post.score}</Typography>
      <RemoveIcon
        onClick={(e) => {
          e.stopPropagation;
          dispatch(
            votePost({
              postId: post.postId,
              type: "downvote",
              currPostObj: { ...post },
            })
          );
        }}
        color={
          post.downvoteArr.includes(currUserId as string) ? "error" : "inherit"
        }
        fontSize="small"
        sx={{ cursor: "pointer" }}
      />
    </Box>
  );
};

export default CommentScore;
