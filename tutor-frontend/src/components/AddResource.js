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
const AddResource = ({ openAddResource, setAddResource, refetchResource }) => {
  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const { getCurrentUser } = AuthService;

  const { courseId } = useParams();
  const schema = yup.object().shape({
    link: yup.string().required("Link Is Required"),
    description: yup.string().required("Description Is Required"),
  });
  const { handleSubmit, trigger, control, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const postResource = async ({ data }) => {
    return api.post(`/api/resources`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(postResource, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Resource Added Successfully");
      refetchResource();
      setAddResource(false);
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
        open={openAddResource}
        onClose={() => setAddResource(false)}
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
              Add Resource
            </Typography>
            <Close
              onClick={() => setAddResource(false)}
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
          <Box sx={{ pl: 3, pr: 3, mb: 15 }}>
            <Controller
              name="link"
              control={control}
              defaultValue=""
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  sx={{ mt: 4, mb: 4 }}
                  label="Link"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("link");
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
                  sx={{ mb: 6 }}
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
              borderTop: "1px solid grey",
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

export default AddResource;
