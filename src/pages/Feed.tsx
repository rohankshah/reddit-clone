import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Grid,
  Card,
  Modal,
  TextField,
  CardActions,
} from "@mui/material";
import moment from "moment";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createNewPost,
  fetchAllPosts,
  votePost,
} from "../features/post/postSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: "50%", xs: "100%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: { md: 4, xs: 2 },
};

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const postArr = useAppSelector((state) => state.post.postInfo);
  const fetchPostLoading = useAppSelector((state) => state.post.loading);
  const currUserId = useAppSelector((state) => state.auth.userInfo?.uid);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostBody, setNewPostBody] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
    console.log(postArr);
  }, [postArr]);

  function handleNewPostCreate() {
    dispatch(createNewPost({ title: newPostTitle, body: newPostBody }));
    setNewPostTitle("");
    setNewPostBody("");
    handleClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
            Create New Post
          </Typography>
          <TextField
            required
            variant="filled"
            label="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            required
            multiline
            minRows={5}
            variant="filled"
            label="Body"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            sx={{ mb: 4, width: "100%" }}
          />
          <Button variant="contained" onClick={handleNewPostCreate}>
            Post
          </Button>
        </Box>
      </Modal>
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
          <Grid item md={5.5} xs={12}>
            {!fetchPostLoading && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: { md: 4, xs: 2 },
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  sx={{ color: "white" }}
                >
                  New post
                </Button>
              </Box>
            )}
            {fetchPostLoading && (
              <Box
                sx={{
                  margin: "10em auto",
                }}
              >
                <Typography variant="h5">Loading...</Typography>
              </Box>
            )}
            {!fetchPostLoading &&
              postArr &&
              postArr.map((post) => {
                return (
                  <Card
                    key={post.postId}
                    sx={{
                      width: "100%",
                      border: "1px",
                      borderColor: "primary.main",
                      mb: 2,
                      display: { md: "flex", xs: "block" },
                      flexDirection: { md: "row-reverse" },
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/post/${post.postId}`)}
                  >
                    <CardContent>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          Created by: {post.displayName}
                        </Typography>
                        <Typography variant="body2">
                          {moment(
                            moment.unix(post.published.seconds)
                          ).fromNow()}
                        </Typography>
                      </Box>
                      <Typography>{post.body.slice(0, 250) + "..."}</Typography>
                    </CardContent>
                    <CardActions>
                      <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          display: "flex",
                          flexDirection: { md: "column", xs: "row" },
                          marginLeft: { md: "10px" },
                          width: { md: "2.5rem" },
                          justifyContent: "space-between",
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
                            post.upvoteArr.includes(currUserId as string)
                              ? "primary"
                              : "inherit"
                          }
                          fontSize="small"
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
                            post.downvoteArr.includes(currUserId as string)
                              ? "error"
                              : "inherit"
                          }
                          fontSize="small"
                        />
                      </Box>
                    </CardActions>
                  </Card>
                );
              })}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Feed;
