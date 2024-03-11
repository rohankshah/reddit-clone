import { Box, Typography, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { UserObj } from "../types/types";
import React from "react";
import { followUnfollowUser } from "../features/user/userSlice";

interface UsersBoxPros {
  user: UserObj;
  last: boolean;
}

const UsersBox: React.FC<UsersBoxPros> = ({ user, last }) => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector((state) => state.auth.userInfo?.uid);

  function handleFollow() {
    dispatch(followUnfollowUser({ userId: user.id, type: "follow" }));
  }
  function handleUnfollow() {
    dispatch(followUnfollowUser({ userId: user.id, type: "unfollow" }));
  }

  return (
    <Box
      key={user.id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 4,
        borderBottom: last ? 0 : 1,
        borderBottomColor: "primary.main",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <img
          style={{
            border: 1,
            borderStyle: "solid",
            borderColor: "primary.main",
            borderRadius: "50%",
            height: "4em",
            width: "4em",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">{user.displayName}</Typography>
          <Typography variant="body2">
            Followers: {user.followers?.length}
          </Typography>
        </Box>
      </Box>
      <Box>
        {user.followers?.includes(currUser as string) ? (
          <Button
            variant="outlined"
            sx={{ color: "black" }}
            onClick={() => handleUnfollow()}
          >
            Following
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ color: "white" }}
            onClick={() => handleFollow()}
          >
            Follow
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UsersBox;
