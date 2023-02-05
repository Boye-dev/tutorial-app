import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";

const SignUpStudent = ({ setIsStudent }) => {
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
      <Box sx={{ width: { xs: "100%", md: "50%" } }}>
        <Box sx={{ padding: "10%" }}>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "30px",
              color: "rgb(0,66,130)",
            }}
          >
            Join the community!
          </Typography>{" "}
          <Typography
            sx={{
              fontWeight: "200",
              fontSize: "13px",
              fontStyle: "italic",
              color: "rgb(0,66,130)",
            }}
          >
            As a student
          </Typography>
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "13px",
              color: "black",
              pt: 1,
            }}
          >
            Already a member ?
            <span style={{ color: "rgb(0,66,130)" }}> Log In</span>
          </Typography>
          <Box>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Controller
                  name="firstname"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="First Name"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("firstname");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: 1 } }}>
                <Controller
                  name="lastname"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="Last Name"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("lastname");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="User Name"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("username");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: 1 } }}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="Email"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("email");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="phonenumber"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="Phone Number"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("phonenumber");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: 1 } }}>
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
              <Grid item xs={12} md={6}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { ref, ...fields },
                    fieldState: { error },
                  }) => (
                    <TextField
                      variant="outlined"
                      sx={{ mt: 4 }}
                      label="ConfirmPassword"
                      fullWidth
                      {...fields}
                      inputRef={ref}
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      onKeyUp={() => {
                        trigger("confirmPassword");
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
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
                    onClick={handleSubmit(onSubmit)}
                  >
                    <span>Sign Up</span>
                  </LoadingButton>
                </Box>
              </Grid>{" "}
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    sx={{
                      mt: 4,
                      width: "100%",
                      height: "50px",
                      backgroundColor: "rgb(185,141,59)",
                      transition: "opacity 0.3s",
                      ":hover": {
                        bgcolor: "rgb(185,141,59)",
                        color: "white",
                        opacity: "0.8",
                      },
                      opacity: "1",
                    }}
                    type="submit"
                    variant="contained"
                    loading={loading}
                    onClick={() => setIsStudent(false)}
                  >
                    <span>Sign Up As A Tutor</span>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUpStudent;
