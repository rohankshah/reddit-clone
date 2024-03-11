import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Grid } from "@mui/material";

import Navbar from "../components/Navbar";
import { fetchAllUsers } from "../features/user/userSlice";
import UsersBox from "../components/UsersBox";

const Users = () => {
  const dispatch = useAppDispatch();
  const usersArr = useAppSelector((state) => state.user.users);
  const currUser = useAppSelector((state) => state.auth.userInfo?.uid);

  useEffect(() => {
    if (!usersArr) {
      dispatch(fetchAllUsers());
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
          padding: { md: "1rem 0rem", xs: "1rem 1rem" },
          width: "100%",
        }}
      >
        <Grid item md={4} xs={12} sx={{ width: "100%" }}>
          {usersArr &&
            usersArr.map((user, index) => {
              if (user.id !== currUser) {
                return (
                  <UsersBox
                    user={user}
                    key={user.id}
                    last={index === usersArr.length - 1 ? true : false}
                  />
                );
              }
            })}
        </Grid>
      </Grid>
    </div>
  );
};

export default Users;
