import React, { useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  Drawer,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../api/api";
import TutorialAppContext from "../context/TutorialAppContext";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthService from "../auth_service";
import { useParams } from "react-router-dom";
const AddTutorial = ({
  openAddTutorial,
  setAddTutorial,
  refetchSingleTutor,
}) => {
  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const { getCurrentUser } = AuthService;

  const { courseId } = useParams();
  const schema = yup.object().shape({
    title: yup.string().required("Title Is Required"),
    description: yup.string().required("Description Is Required"),
    type: yup.string().required("Type Is Required"),
    venue: yup.string().required("Venue Is Required"),
    date: yup.date().required("Date Is Required"),
    startTime: yup.string().required("Start Time Is Required"),
    endTime: yup.string().required("End Time Is Required"),
  });
  const { handleSubmit, trigger, control, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const postTutorial = async ({ data }) => {
    return api.post(`/api/tutorials`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(postTutorial, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Review Added Successfully");
      refetchSingleTutor();
      setAddTutorial(false);
      reset();
    },
  });
  const onSubmit = (data) => {
    data = { ...data, tutorId: getCurrentUser()?._id, courseId: courseId };
    mutate({ data });
  };

  return (
    <>
      <Drawer
        anchor={"left"}
        open={openAddTutorial}
        onClose={() => setAddTutorial(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "100%", md: "450px" },
            backgroundColor: "white",
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: "0",
            backgroundColor: "white",
            zIndex: "100",
          }}
        >
          <Box
            sx={{
              paddingTop: "9%",
              pl: 3,
              pr: 3,
              pb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "rgb(0,66,130)",
                fontWeight: "700",
                fontSize: "30px",
              }}
            >
              Add Tutorial
            </Typography>
            <Close
              onClick={() => setAddTutorial(false)}
              sx={{
                fontSize: "30px",
                color: "rgb(0,66,130)",
                cursor: "pointer",
              }}
            />
          </Box>
          <Divider />
        </Box>
        <Divider />
        <Box>
          <Box sx={{ pl: 3, pr: 3 }}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  sx={{ mt: 4, mb: 4 }}
                  label="Title"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("title");
                  }}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <>
                  <FormControl fullWidth>
                    <InputLabel id="type">Type</InputLabel>
                    <Select
                      {...fields}
                      id="type"
                      label="Type"
                      error={Boolean(error?.message)}
                    >
                      <MenuItem style={{ padding: 10 }} value={"Virtual"}>
                        Virtual
                      </MenuItem>
                      <MenuItem style={{ padding: 10 }} value={"On-Site"}>
                        On-Site
                      </MenuItem>
                    </Select>
                    <FormHelperText
                      sx={{
                        color: "red",
                      }}
                    >
                      {error?.message}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
            <Controller
              name="venue"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  sx={{ mt: 4 }}
                  label="Venue/Link"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("venue");
                  }}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  type="date"
                  variant="outlined"
                  sx={{ mt: 4 }}
                  label="Date"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("date");
                  }}
                />
              )}
            />
            <Controller
              name="startTime"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  sx={{ mt: 4 }}
                  label="Start Time"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("startTime");
                  }}
                />
              )}
            />
            <Controller
              name="endTime"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  sx={{ mt: 4 }}
                  label="End Time"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("endTime");
                  }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  multiline
                  rows={10}
                  sx={{ mt: 4 }}
                  label="Description"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("description");
                  }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              position: "sticky",
              bottom: "0",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              mt: 4,
              borderTop: "1px solid grey",
              zIndex: "300",
            }}
          >
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="primary"
              loading={isLoading}
              fullWidth
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AddTutorial;
