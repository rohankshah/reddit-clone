import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { Box, Card, Grid, Typography } from "@mui/material";
import { PostObj } from "../types/types";
import { fetchExistingPost } from "../features/post/postSlice";

import Navbar from "../components/Navbar";
import CommentScore from "../components/CommentScore";
import NestedComments from "../components/NestedComments";
import BackButton from "../components/BackButton";

const Post = () => {
  const dispatch = useAppDispatch();
  const postId = useParams();

  const [post, setPost] = useState<PostObj | undefined>(undefined);

  useEffect(() => {
    if (postId && postId.id) {
      dispatch(fetchExistingPost(postId.id))
        .unwrap()
        .then((data) => {
          setPost(data as PostObj);
        });
    }
  }, [dispatch, postId]);

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
          padding: { md: "1rem 0rem", xs: "1rem 1rem" },
          width: "100%",
        }}
      >
        <Grid item md={9} lg={7} xs={12} sx={{ width: "100%" }}>
          <BackButton />
          {post && (
            <Card
              sx={{
                width: "100%",
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
            </Card>
          )}
          {post && (
            <Box
              sx={{
                mt: 3,
                padding: { md: "2rem", xs: "1rem 1rem" },
              }}
            >
              <Typography sx={{ mb: 1 }}>Comments:</Typography>
              <NestedComments replies={post?.replies} postId={post.postId} />
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Post;
