import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import classes from "../styles/login.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

import * as yup from "yup";
import SignUpTutor from "../components/SignUpTutor";
import SignUpStudent from "../components/SignUpStudent";
const SignUp = () => {
  const [isStudent, setIsStudent] = useState(true);
  const schema = yup.object().shape({
    host: yup.string().required("Host Is Required"),
    reason: yup.string().required("Reason Is Required"),
    returnDate: yup.string().required("Return Date Required"),
    departDate: yup.string().required("Departure Date Is Required"),
    type: yup.string().required("Type Is Required"),
    address: yup.string().required("Address Is Required"),
  });
  const { handleSubmit, trigger, control } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxHeight: "100vh",
          display: "flex",
        }}
      >
        <Box
          sx={{ display: { xs: "none", md: "flex" } }}
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
