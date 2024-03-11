import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";

const Profile = () => {
  const [profileMenu, setProfileMenu] = useState("Posts");

  function handleToggleProfile(menu: string) {
    setProfileMenu(menu);
  }

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
        <Grid item md={6} xs={12} sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { md: 5, xs: 3 },
              py: { md: 6, xs: 3 },
            }}
          >
            <Image
              sx={{
                height: { xs: "3em", md: "5em" },
                width: { xs: "3em", md: "5em" },
                border: "1px solid black",
                borderRadius: "100%",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, md: 2 },
              }}
            >
              <Typography variant="h6">Rohan Shah</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, md: 2 },
                }}
              >
                <Typography variant="body1">Posts: 5</Typography>
                <Typography variant="body1">Followers: 5</Typography>
                <Typography variant="body1">Following: 5</Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "2px solid",
              borderTopColor: "primary.main",
              display: "flex",
              justifyContent: "space-evenly",
              py: 1,
            }}
          >
            <Box
              sx={{
                color: profileMenu === "Posts" ? "primary.main" : "black",
                cursor: "pointer",
              }}
              onClick={() => handleToggleProfile("Posts")}
            >
              Posts
            </Box>
            <Box
              sx={{
                color: profileMenu === "Followers" ? "primary.main" : "black",
                cursor: "pointer",
              }}
              onClick={() => handleToggleProfile("Followers")}
            >
              Followers
            </Box>
            <Box
              sx={{
                color: profileMenu === "Following" ? "primary.main" : "black",
                cursor: "pointer",
              }}
              onClick={() => handleToggleProfile("Following")}
            >
              Following
            </Box>
          </Box>
          {profileMenu === "Posts" && <ProfilePosts />}
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
