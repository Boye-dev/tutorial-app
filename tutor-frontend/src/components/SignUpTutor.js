import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { useMutation } from "react-query";
import TutorialAppContext from "../context/TutorialAppContext";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
const SignUpTutor = ({ isStudent, setIsStudent }) => {
  const [img1, setImage1] = useState();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [picture, setImageFile1] = useState([]);
  const [err1, setErr1] = useState();
  const [er1, setEr1] = useState(true);
  const [state, setState] = useState({
    values2: false,
    values3: false,
  });
  const [variants, setVariants] = useState([]);
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await api.get(`/api/courses`);
        setVariants(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversation();
  }, []);
  const handleShowNewPassword = () => {
    setState({ ...state, values2: !state.values2 });
  };
  const handleShowConfirmNewPassword = () => {
    setState({ ...state, values3: !state.values3 });
  };
  const onImageChange1 = (e) => {
    const [file] = e.target.files;
    const imageFile = e.target.files[0];

    if (!imageFile) {
      setErr1("Please select image.");
      setEr1(true);
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|jfif|heif|hevc)$/)) {
      setErr1("Please select valid image.");
      setEr1(true);
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageFile1(imageFile);
        setErr1(null);
        setEr1(false);
      };
      img.onerror = () => {
        setErr1("Invalid image content.");
        setEr1(false);
        return false;
      };

      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);

    setImage1(URL.createObjectURL(file));
  };

  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const schema = yup.object().shape({
    firstname: yup.string().required("Firstname Is Required"),
    lastname: yup.string().required("Lastname Is Required"),
    username: yup.string().required("User Name Required"),
    email: yup.string().required("Email Is Required"),
    phonenumber: yup.string().required("Phone Number Is Required"),
    password: yup
      .string()
      .required("Password Is Required")
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        "Password Must Contain An Uppercase, A Digit, and A Special Character"
      )
      .min(8, "Password Should Have At Least 8 Characters")
      .max(32, "Password Should Have At Most 32 Characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password Is Required")
      .oneOf(
        [yup.ref("password"), null],
        "Confirm Password Must Match Password"
      ),
  });
  const { handleSubmit, trigger, control, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const loggIn = async ({ data }) => {
    return api.post(`/api/tutor-signup`, data).then((res) => res.data);
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
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Signed Up Successfully");
      navigate("/login");
    },
  });
  const onSubmit = (payload) => {
    let formData = new FormData();
    payload = { ...payload, picture };
    formData.append("firstname", payload.firstname);
    formData.append("lastname", payload.lastname);
    formData.append("email", payload.email);
    formData.append("phonenumber", payload.phonenumber);
    formData.append("username", payload.username);
    formData.append("password", payload.password);
    formData.append("confirmPassword", payload.confirmPassword);
    formData.append("profilePhoto", payload.picture);
    payload?.areaOfSpecialty?.forEach((course, i) => {
      formData.append(`areaOfSpecialty`, course._id);
    });
    const data = formData;
    mutate({ data });
  };
  const navigate = useNavigate();

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
            As a tutor
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
            <span
              style={{ color: "rgb(0,66,130)", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              {" "}
              Log In
            </span>
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
                      type={state.values2 ? "text" : "password"}
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
                  rules={{
                    required: "Confirm Password is required",
                    validate: {
                      checkIsEmpty: (e) =>
                        e === getValues("newPassword") ||
                        "Passwords must be the same",
                    },
                  }}
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
                      type={state.values3 ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handleShowConfirmNewPassword}>
                            {state.values3 === true ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        ),
                      }}
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
              <Grid item xs={12} md={6} sx={{ display: "flex", mt: 4 }}>
                <Box
                  sx={{
                    width: "50px",
                    display: "flex",
                    justifyContent: "center",
                    ml: 1,
                    mr: 2,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "100%",
                      width: "50px",
                      height: "50px",
                      color: "black",
                    }}
                  >
                    {img1 && (
                      <img
                        style={{
                          borderRadius: "100%",
                          width: "50px",
                          height: "50px",
                        }}
                        src={img1}
                        alt="profile"
                      />
                    )}
                  </Box>
                </Box>
                <Box>
                  <input
                    type="file"
                    id="profilePhoto"
                    style={{ display: "none" }}
                    onChange={onImageChange1}
                  />
                  <label
                    htmlFor={"profilePhoto"}
                    style={{ cursor: "pointer", display: "flex" }}
                  >
                    <Edit sx={{ color: "rgb(0,66,130)" }} />
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "300",
                        color: "rgb(0,66,130)",
                        textAlign: "center",
                      }}
                    >
                      Profile Picture
                    </Typography>
                  </label>
                </Box>
              </Grid>
              <Controller
                control={control}
                name="areaOfSpecialty"
                multiple
                options={variants}
                getOptionLabel={(option) => option?.name}
                render={({
                  field: { onChange, value, onBlur, ref, ...fields },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    style={{
                      width: "100%",
                      mb: 3,
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    multiple
                    onChange={(event, values, reason) => {
                      setValue("areaOfSpecialty", values);
                      onChange(values);
                    }}
                    id="areaOfSpecialty"
                    options={variants}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    getOptionLabel={(option) => option?.name}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option?.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Area Of Specialty"
                        placeholder="Courses"
                      />
                    )}
                  />
                )}
              />
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
                    loading={isLoading}
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
                    onClick={() => setIsStudent(true)}
                  >
                    <span>Sign Up As A Student</span>
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

export default SignUpTutor;
