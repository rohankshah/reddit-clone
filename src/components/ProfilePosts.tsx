import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Box, Card, Typography } from "@mui/material";
import { fetchCurrUserPosts } from "../features/post/postSlice";
import moment from "moment";

const ProfilePosts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const postsArr = useAppSelector((state) => state.post.profilePostArr);

  useEffect(() => {
    if (!postsArr) {
      dispatch(fetchCurrUserPosts());
    }
  });

  return (
    <Box sx={{ mt: 2 }}>
      {postsArr &&
        postsArr.map((post) => (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 1,
              py: 2,
              px: 4,
              cursor: "pointer",
              mb: 1,
            }}
            onClick={() => navigate(`/post/${post.postId}`)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>{post.title}</Typography>
              <Typography variant="body2">
                {" "}
                {moment(moment.unix(post.published.seconds)).fromNow()}
              </Typography>
            </Box>
            <Typography>{post.body.slice(0, 150) + "..."}</Typography>
          </Card>
        ))}
    </Box>
  );
};

export default ProfilePosts;
