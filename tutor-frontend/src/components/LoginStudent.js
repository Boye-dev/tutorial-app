import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useMutation } from "react-query";
import TutorialAppContext from "../context/TutorialAppContext";
import api from "../api/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthService from "../auth_service";

const LoginStudent = ({ setIsStudent }) => {
  const { setWithExpiry } = AuthService;

  const navigate = useNavigate();
  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const handleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const schema = yup.object().shape({
    email: yup.string().required("Email Is Required"),
    password: yup.string().required("Password Is Required"),
  });
  const { handleSubmit, trigger, control, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const loggIn = async ({ data }) => {
    return api.post(`/api/student-login`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(loggIn, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(
        error.response.data.actualError
          ? error.response.data.actualError
          : "Something Went Wrong"
      );
    },
    onSuccess: (data) => {
      setWithExpiry("user", data?.student);
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Logged In Successfully");
      reset();
      navigate("/student/levels");
    },
  });
  const onSubmit = (data) => {
    mutate({ data });
  };

  return (
    <>
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
          Not a member ?
          <span
            style={{ color: "rgb(0,66,130)", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            {" "}
            Sign Up
          </span>
        </Typography>
        <Box>
          <Grid container>
            <Grid item xs={12}>
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
                    type={values.showPassword ? "text" : "password"}
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("password");
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleShowPassword}>
                          {values.showPassword === true ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
                  loading={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  <span>Login </span>
                </LoadingButton>
              </Box>
            </Grid>{" "}
            <Grid item xs={12}>
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
                  onClick={() => setIsStudent(false)}
                >
                  <span>Login As A Tutor</span>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LoginStudent;
