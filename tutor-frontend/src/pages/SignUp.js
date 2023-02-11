import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import classes from "../styles/login.module.css";

import SignUpTutor from "../components/SignUpTutor";
import SignUpStudent from "../components/SignUpStudent";
const SignUp = () => {
  const [isStudent, setIsStudent] = useState(true);

  return (
    <>
      <Box
        sx={{
          width: "100%",

          display: "flex",
        }}
      >
        <Box
          sx={{ display: { xs: "none", md: "flex", height: "auto" } }}
          className={classes.boxImage}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "50px",
              fontWeight: "800",
              padding: "10%",
            }}
          >
            CONNECT WITH THE{" "}
            <span style={{ color: "rgb(0,66,130)" }}>BEST TUTORS</span> IN YOUR
            INSTITUTION IN SECONDS.
          </Typography>
        </Box>
        {isStudent ? (
          <SignUpStudent isStudent={isStudent} setIsStudent={setIsStudent} />
        ) : (
          <SignUpTutor isStudent={isStudent} setIsStudent={setIsStudent} />
        )}
      </Box>
    </>
  );
};

export default SignUp;
