import { Button, TextField, Box } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { fetchAllComments } from "../features/comment/commentSlice";
import Comment from "./Comment";

interface NestedCommentsProps {
  replies: string[];
}

const NestedComments: React.FC<NestedCommentsProps> = ({ replies }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comment.comments);

  useEffect(() => {
    if (replies.length > 0) {
      dispatch(fetchAllComments(replies));
    }
  }, []);

  useEffect(() => console.log(comments), [comments]);

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
        <TextField multiline minRows={4} type="text" sx={{ width: "100%" }} />
        <Button
          variant="contained"
          sx={{ color: "white", width: "fit-content" }}
        >
          Post
        </Button>
      </Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        {comments.length > 0 &&
          comments.map((comment) => (
            <Box
              key={comment.createdByUid}
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
