import React, { useContext, useState } from "react";
import { Box, Typography, Divider, Drawer, TextField } from "@mui/material";
import { Close, Star } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../api/api";
import TutorialAppContext from "../context/TutorialAppContext";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthService from "../auth_service";
import { useParams } from "react-router-dom";
const AddReview = ({
  openAddReview,
  setAddReview,
  refetchReviews,
  refetchSingleTutor,
}) => {
  const { getCurrentUser } = AuthService;

  const { tutorId } = useParams();
  const [rating, setRating] = useState(1);

  const getStars = (rate) => {
    const stars = [];
    for (let i = 1; i < 6; i++) {
      stars.push(
        <Star
          onClick={() => setRating(i)}
          key={i}
          sx={{
            color: i <= rate ? "rgb(185,141,59)" : "grey",
            cursor: "pointer",
            fontSize: "40px",
          }}
        />
      );
    }
    return stars;
  };

  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const schema = yup.object().shape({
    review: yup.string().required("Review Is Required"),
  });
  const { handleSubmit, trigger, control, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const postReview = async ({ data }) => {
    return api.post(`/api/reviews`, data).then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(postReview, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Review Added Successfully");
      refetchReviews();
      refetchSingleTutor();
      setAddReview(false);
      reset();
    },
  });
  const onSubmit = (data) => {
    data = {
      ...data,
      studentID: getCurrentUser()?._id,
      tutorID: tutorId,
      rating,
    };
    mutate({ data });
  };
  return (
    <>
      <Drawer
        anchor={"left"}
        open={openAddReview}
        onClose={() => setAddReview(false)}
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
              Add Review
            </Typography>
            <Close
              onClick={() => setAddReview(false)}
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
            <Typography sx={{ mt: 3, mb: 1 }}>Click To Rate</Typography>
            {getStars(rating)}
            <Controller
              name="review"
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
                  sx={{ mb: 6, mt: 4 }}
                  label="Review"
                  fullWidth
                  {...fields}
                  inputRef={ref}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  onKeyUp={() => {
                    trigger("review");
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

export default AddReview;
