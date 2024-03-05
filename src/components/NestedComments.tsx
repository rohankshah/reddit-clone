import { Button, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { CommentObj } from "../types/types";

import { fetchAllComments } from "../features/comment/commentSlice";

interface NestedCommentsProps {
  replies: string[];
}

const NestedComments: React.FC<NestedCommentsProps> = ({ replies }) => {
  const dispatch = useAppDispatch();

  const [comments, setComments] = useState<CommentObj>();

  useEffect(() => {
    if (replies.length > 0) {
      dispatch(fetchAllComments(replies))
        .unwrap()
        .then((data) => setComments(JSON.parse(data)));
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
    </>
  );
};

export default NestedComments;
