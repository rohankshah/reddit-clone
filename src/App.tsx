import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { currAuth } from "./firebase";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { createTheme, ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";
import "./App.css";

import LoginSignup from "./pages/LoginSignup";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import { getCurrUser, logInUser } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#62BBC1",
      },
      secondary: {
        main: "#444545",
      },
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(currAuth, (user) => {
      if (user) {
        dispatch(logInUser(JSON.stringify(user)));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={currUser ? <Feed /> : <LoginSignup />} />
            <Route
              path="/feed"
              element={currUser ? <Feed /> : <LoginSignup />}
            />
            <Route
              path="/post/:id"
              element={currUser ? <Post /> : <LoginSignup />}
            />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
