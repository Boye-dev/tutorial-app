import { Box } from "@mui/material";
import React, { useState } from "react";
import classes from "../styles/login.module.css";
import { Navigate } from "react-router-dom";
import LoginStudent from "../components/LoginStudent";
import LoginTutor from "../components/LoginTutor";
import AuthService from "../auth_service";

const Login = () => {
  const [isStudent, setIsStudent] = useState(true);
  const { getCurrentUser } = AuthService;
  return (
    <>
      {getCurrentUser() ? (
        getCurrentUser()?.role === "Student" ? (
          <>
            <Navigate to="/student/levels" replace={true} />
          </>
        ) : (
          <>
            <Navigate to="/tutor/courses" replace={true} />
          </>
        )
      ) : (
        <Box
          sx={{
            width: "100%",
            maxHeight: "100vh",
            display: "flex",
          }}
        >
          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            className={classes.boxImageLogin}
          ></Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {isStudent ? (
              <LoginStudent isStudent={isStudent} setIsStudent={setIsStudent} />
            ) : (
              <LoginTutor isStudent={isStudent} setIsStudent={setIsStudent} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Login;
