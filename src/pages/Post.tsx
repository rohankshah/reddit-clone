import moment from "moment";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { Box, Grid, Typography } from "@mui/material";

import Navbar from "../components/Navbar";
import CommentScore from "../components/CommentScore";
import { fetchExistingPost } from "../features/post/postSlice";
import { useParams } from "react-router-dom";
import { PostObj } from "../types/types";

const Post = () => {
  const dispatch = useAppDispatch();
  const postId = useParams();

  const [post, setPost] = useState<PostObj | undefined>(undefined);

  useEffect(() => {
    if (postId && postId.id) {
      dispatch(fetchExistingPost(postId.id))
        .unwrap()
        .then((data) => {
          console.log(data);
          setPost(data as PostObj);
        });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Navbar />
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { md: "2rem 0rem", xs: "1rem 1rem" },
          width: "100%",
        }}
      >
        <Grid item md={5.5} xs={12} sx={{ width: "100%" }}>
          {post && (
            <Box
              sx={{
                width: "100%",
                border: "2px",
                borderColor: "secondary.main",
                borderStyle: "solid",
                borderRadius: 2,
                padding: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexDirection: { xs: "column-reverse", md: "row" },
                }}
              >
                <CommentScore post={post} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="body2">
                      {moment(moment.unix(post.published.seconds)).fromNow()}
                      &nbsp;by&nbsp;
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        width: "fit-content",
                        padding: "0px 2px",
                        display: "inline",
                      }}
                    >
                      Rohan
                    </Typography>
                  </Box>
                  <Typography>{post.body}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Post;
