import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import SocialInteraction from "../assets/social-interaction.svg";

import {
  createNewUser,
  loginExistingUser,
  getCurrUser,
  getAuthLoading,
  getAuthError,
  getAuthErrorMsg,
} from "../features/auth/authSlice";

const LoginSignup = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const authLoading = useAppSelector(getAuthLoading);
  const authError = useAppSelector(getAuthError);
  const authErrorMsg = useAppSelector(getAuthErrorMsg);

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  useEffect(() => {
    console.log(currUser);
  }, [currUser]);

  const toggleLogin: () => void = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPass("");
    setConfirmPass("");
  };

  function handleLoginAccount() {
    dispatch(loginExistingUser({ email, pass }));
  }

  function handleCreateAccount() {
    dispatch(createNewUser({ email: email, pass: pass, displayName: name }));
  }

  return (
    <Grid container sx={{ maxWidth: "lg", height: "100%" }}>
      <Grid item md={4} xs={12}>
        <Box mt={6}>
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: "bold" }}
            mb={5}
          >
            TweetX
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "black",
              borderColor: "black",
              width: "45%",
              borderRadius: 3,
            }}
            onClick={toggleLogin}
          >
            <Typography variant="body1" sx={{ padding: "2px" }}>
              {isLogin ? "Sign Up" : "Login"}
            </Typography>
          </Button>
        </Box>
        <Box mt={12}>
          <Typography
            variant="h4"
            mb={3}
            sx={{ fontWeight: "bold" }}
            color={"secondary.main"}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Typography>
          <Box mb={3} sx={{ display: isLogin ? "none" : "block" }}>
            <TextField
              variant="filled"
              size="small"
              fullWidth
              placeholder="Name"
              InputProps={{
                disableUnderline: true,
                style: { borderRadius: 7 },
              }}
              inputProps={{
                style: {
                  padding: 15,
                },
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              variant="filled"
              size="small"
              fullWidth
              placeholder="Email"
              InputProps={{
                disableUnderline: true,
                style: { borderRadius: 7 },
              }}
              inputProps={{
                style: {
                  padding: 15,
                },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              variant="filled"
              size="small"
              type="password"
              fullWidth
              placeholder="Password"
              InputProps={{
                disableUnderline: true,
                style: { borderRadius: 7 },
              }}
              inputProps={{
                style: {
                  padding: 15,
                },
              }}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </Box>
          <Box mb={3} sx={{ display: isLogin ? "none" : "block" }}>
            <TextField
              variant="filled"
              size="small"
              type="password"
              fullWidth
              placeholder="Confirm Password"
              InputProps={{
                disableUnderline: true,
                style: { borderRadius: 7 },
              }}
              inputProps={{
                style: {
                  padding: 15,
                },
              }}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            mt={6}
          >
            <Typography variant="body2">Forgot Password?</Typography>
            {authLoading ? (
              <CircularProgress size={30} />
            ) : (
              <Box>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "primary.main" }}
                  onClick={
                    isLogin
                      ? () => handleLoginAccount()
                      : () => handleCreateAccount()
                  }
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <Box mt={4} sx={{ display: authError ? "block" : "none" }}>
          <Typography color={"error"}>{authErrorMsg}</Typography>
        </Box>
      </Grid>
      <Grid
        item
        md={8}
        xs={12}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={SocialInteraction} height="80%" width="80%" />
      </Grid>
    </Grid>
  );
};

export default LoginSignup;
