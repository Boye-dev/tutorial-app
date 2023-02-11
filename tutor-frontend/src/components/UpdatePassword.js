import {
  Container,
  Typography,
  IconButton,
  TextField,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Controller, useForm } from "react-hook-form";
import React, { useContext, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth_service";
import TutorialAppContext from "../context/TutorialAppContext";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = AuthService;
  const { setIsSnackOpen, setSnackMessage } = useContext(TutorialAppContext);

  const id = getCurrentUser()?._id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState({
    values: false,
    values2: false,
    values3: false,
  });
  const {
    handleSubmit,
    trigger,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    currentPassword: "",
    confirmPassword: "",
    newPassword: "",
  });

  const handleShowCurrentPassword = () => {
    setState({ ...state, values: !state.values });
  };
  const handleShowNewPassword = () => {
    setState({ ...state, values2: !state.values2 });
  };
  const handleShowConfirmNewPassword = () => {
    setState({ ...state, values3: !state.values3 });
  };

  const update = async (data) => {
    let formData = new FormData();
    formData.append("currentPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmNewPassword", data.confirmNewPassword);

    // const body = formData;
    if (getCurrentUser()?.role === "Tutor") {
      try {
        setLoading(true);

        await api.put(`/api/editTutor/password/${id}`, data);

        // console.log(response);
        setIsSnackOpen(true);
        setSnackMessage("Updated Password Successfully");
        reset();
        setLoading(false);
        // navigate("/admin/dashboard");
      } catch (err) {
        if (!err.response) {
          setError("Server Is Not Responding");
          setLoading(false);
          setIsSnackOpen(true);
          setSnackMessage("hello");
        } else if (err.response) {
          setError(err.response.data.error);
          setIsSnackOpen(true);
          // console.log(err.response.data.errors[0])
          setSnackMessage(`${err.response.data.errors[0]}`);
          // console.log(error.response);
          setLoading(false);
        } else if (err.request) {
          setError(err.request);
          setIsSnackOpen(true);
          setSnackMessage(err.request);
          setLoading(false);
        } else {
          setError(err.message);
          setIsSnackOpen(true);
          setSnackMessage(err.message);
          // console.log(err.message);
          setLoading(false);
        }
      }
    }
    if (getCurrentUser()?.role === "Student") {
      try {
        setLoading(true);

        await api.put(`/api/editStudent/password/${id}`, data);

        // console.log(response);
        setIsSnackOpen(true);
        setSnackMessage("Updated Password Successfully");
        reset();
        setLoading(false);
        // navigate("/admin/dashboard");
      } catch (err) {
        if (!err.response) {
          setError("Server Is Not Responding");
          setLoading(false);
          setIsSnackOpen(true);
          setSnackMessage("hello");
        } else if (err.response) {
          setError(err.response.data.error);
          setIsSnackOpen(true);
          // console.log(err.response.data.errors[0])
          setSnackMessage(`${err.response.data.errors[0]}`);
          // console.log(error.response);
          setLoading(false);
        } else if (err.request) {
          setError(err.request);
          setIsSnackOpen(true);
          setSnackMessage(err.request);
          setLoading(false);
        } else {
          setError(err.message);
          setIsSnackOpen(true);
          setSnackMessage(err.message);
          // console.log(err.message);
          setLoading(false);
        }
      }
    }
  };

  const onSubmit = (data) => {
    update(data);
  };

  return (
    <Container disableGutters>
      <Box>
        <Typography variant="h6" sx={{ pl: 2 }}>
          <EditIcon /> Update Password
        </Typography>

        <Grid container>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Box>
              <Grid item xs={12} sx={{ p: 2 }}>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Controller
                    name="currentPassword"
                    control={control}
                    rules={{
                      required: "Current Password is required",
                    }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextField
                        color={errors.currentPassword ? `error` : `primary`}
                        id="currentPassword"
                        label="CurrentPassword"
                        sx={{
                          width: { xs: "100%", md: "60%" },
                          mb: 3,
                          "& .MuiFormHelperText-root": {
                            color: "red",
                          },
                        }}
                        value={value}
                        type={state.values ? "text" : "password"}
                        onBlur={onBlur}
                        onKeyUp={() => {
                          trigger("currentPassword");
                        }}
                        helperText={
                          errors.currentPassword &&
                          `${errors.currentPassword.message}`
                        }
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={handleShowCurrentPassword}>
                              {state.values === true ? (
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
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} sx={{ p: 2 }}>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                          required: "New Password Is Required",
                          pattern: {
                            value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
                            message:
                              "Password Must Contain An Uppercase,A Digit And A Special Character",
                          },
                          minLength: {
                            value: 8,
                            message:
                              "Password Should Have At Least 8 Characters",
                          },
                          maxLength: {
                            value: 32,
                            message:
                              "Password Should Have At Most 32 Characters",
                          },
                        }}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <TextField
                            color={errors.newPassword ? `error` : `primary`}
                            id="newPassword"
                            label="NewPassword"
                            value={value}
                            type={state.values2 ? "text" : "password"}
                            onBlur={onBlur}
                            helperText={
                              errors.newPassword &&
                              `${errors.newPassword.message}`
                            }
                            onChange={onChange}
                            InputProps={{
                              endAdornment: (
                                <IconButton onClick={handleShowNewPassword}>
                                  {state.values2 === true ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              ),
                            }}
                            onKeyUp={() => {
                              trigger("newPassword");
                            }}
                            sx={{
                              width: { xs: "100%", md: "60%" },
                              mb: 3,
                              "& .MuiFormHelperText-root": {
                                color: "red",
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sx={{ p: 2 }}>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <Controller
                        name="confirmNewPassword"
                        control={control}
                        rules={{
                          required: "Confirm Password is required",
                          validate: {
                            checkIsEmpty: (e) =>
                              e === getValues("newPassword") ||
                              "Passwords must be the same",
                          },
                        }}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <TextField
                            color={
                              errors.confirmNewPassword ? `error` : `primary`
                            }
                            id="confirmNewPassword"
                            label="ConfirmNewPassword"
                            value={value}
                            type={state.values3 ? "text" : "password"}
                            onBlur={onBlur}
                            onKeyUp={() => {
                              trigger("confirmNewPassword");
                            }}
                            helperText={
                              errors.confirmNewPassword &&
                              `${errors.confirmNewPassword.message}`
                            }
                            onChange={onChange}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={handleShowConfirmNewPassword}
                                >
                                  {state.values3 === true ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              ),
                            }}
                            sx={{
                              width: { xs: "100%", md: "60%" },
                              mb: 3,
                              "& .MuiFormHelperText-root": {
                                color: "red",
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        <Box sx={{ textAlign: "center", pb: 5 }}>
          <LoadingButton
            sx={{
              mt: 3,
              mb: 3,
              width: { xs: "100%", md: "60%" },
              height: "50px",
              backgroundColor: "rgb(0,66,130)",
              transition: "opacity 0.3s",
              ":hover": {
                bgcolor: "rgb(0,66,130)",
                color: "white",
                opacity: "0.8",
              },
              opacity: "1",
            }}
            type="submit"
            variant="contained"
            loading={loading}
            color="success"
            onClick={handleSubmit(onSubmit)}
          >
            <EditIcon /> Update Password
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};
export default UpdatePassword;
