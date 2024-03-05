import React, { useEffect, useState } from "react";
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

  const [commentScore, setCommentScore] = useState(post.score);

  const [upvote, setUpvote] = useState(false);
  const [downvote, setDownvote] = useState(false);

  useEffect(() => {
    post.downvoteArr.includes(currUserId as string)
      ? setDownvote(true)
      : setDownvote(false);
    post.upvoteArr.includes(currUserId as string)
      ? setUpvote(true)
      : setUpvote(false);
  }, []);

  function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (upvote) {
      setUpvote(false);
      setCommentScore((score) => score - 1);
    } else {
      setUpvote(true);
      if (downvote) {
        setDownvote(false);
        setCommentScore((score) => score + 2);
      } else {
        setCommentScore((score) => score + 1);
      }
    }
    dispatch(
      votePost({
        postId: post.postId,
        type: "upvote",
        currPostObj: { ...post },
      })
    );
  }

  function handleDownvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (downvote) {
      setDownvote(false);
      setCommentScore((score) => score + 1);
    } else {
      setDownvote(true);
      if (upvote) {
        setUpvote(false);
        setCommentScore((score) => score - 2);
      } else {
        setCommentScore((score) => score - 1);
      }
    }
    dispatch(
      votePost({
        postId: post.postId,
        type: "downvote",
        currPostObj: { ...post },
      })
    );
  }

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: "flex",
        flexDirection: { md: "column", xs: "row" },
        marginLeft: { md: "10px" },
        width: { md: "2.5rem", xs: "fit-content" },
        height: "fit-content",
        alignItems: "center",
        gap: 2,
        borderRadius: 2,
        border: "1px solid black",
        padding: { md: "5px", xs: "2px 5px" },
        cursor: "default",
      }}
    >
      <AddIcon
        onClick={(e) => handleUpvote(e)}
        color={upvote ? "primary" : "inherit"}
        fontSize="small"
        sx={{ cursor: "pointer" }}
      />
      {/* <Typography>{post.score}</Typography> */}
      <Typography>{commentScore}</Typography>
      <RemoveIcon
        onClick={(e) => handleDownvote(e)}
        color={downvote ? "error" : "inherit"}
        fontSize="small"
        sx={{ cursor: "pointer" }}
      />
    </Box>
  );
};

export default CommentScore;
