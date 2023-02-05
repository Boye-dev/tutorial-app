import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import classes from "../styles/login.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

import * as yup from "yup";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
          <Box sx={{ padding: "10%" }}>
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: "30px",
                color: "rgb(0,66,130)",
              }}
            >
              Log In
            </Typography>
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "13px",
                color: "black",
                pt: 1,
              }}
            >
              Not a member ?
              <span style={{ color: "rgb(0,66,130)" }}> Sign Up</span>
            </Typography>
            <Box>
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    name="user"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { ref, ...fields },
                      fieldState: { error },
                    }) => (
                      <TextField
                        variant="outlined"
                        sx={{ mt: 4 }}
                        label="User Name/ Email"
                        fullWidth
                        {...fields}
                        inputRef={ref}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        onKeyUp={() => {
                          trigger("user");
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { ref, ...fields },
                      fieldState: { error },
                    }) => (
                      <TextField
                        variant="outlined"
                        sx={{ mt: 4 }}
                        label="Password"
                        fullWidth
                        {...fields}
                        inputRef={ref}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        onKeyUp={() => {
                          trigger("password");
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: "center" }}>
                <LoadingButton
                  sx={{
                    mt: 4,
                    width: "100%",
                    height: "50px",
                    transition: "opacity 0.3s",
                    ":hover": {
                      bgcolor: "rgb(0,66,130)",
                      color: "white",
                      opacity: "0.8",
                    },
                    opacity: "1",
                    backgroundColor: "rgb(0,66,130)",
                  }}
                  type="submit"
                  variant="contained"
                  loading={loading}
                  onClick={() => navigate("/tutor/courses")}
                >
                  <span>Log In</span>
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
