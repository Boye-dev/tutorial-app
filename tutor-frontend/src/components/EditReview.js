import React, { useContext, useEffect, useState } from "react";
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
const EditReview = ({
  openEditReview,
  setEditReview,
  refetchReviews,
  reviewed,
  setLoadingReview,
  isLoadingReview,
  setReviews,
  reviews,
  refetchSingleTutor,
}) => {
  const { getCurrentUser } = AuthService;
  const [rating, setRating] = useState(reviewed[0].rating);

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

  useEffect(() => {
    setRating(reviewed[0].rating);
  }, [reviewed]);

  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(TutorialAppContext);
  const { courseId } = useParams();
  const schema = yup.object().shape({
    review: yup.string().required("Review Is Required"),
  });
  const { handleSubmit, trigger, control, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const patchReview = async ({ data }) => {
    return api
      .patch(`/api/reviews/${reviewed[0]._id}`, data)
      .then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(patchReview, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(error.response.data.actualError);
    },
    onSuccess: (data) => {
      setSnackColor("green");
      setIsSnackOpen(true);
      setLoadingReview(!isLoadingReview);
      setSnackMessage("Review Updated Successfully");
      refetchReviews();
      refetchSingleTutor();
      setEditReview(false);
      reset();
    },
  });
  const onSubmit = (data) => {
    data = { ...data, rating };

    mutate({ data });
  };
  return (
    <>
      <Drawer
        anchor={"left"}
        open={openEditReview}
        onClose={() => setEditReview(false)}
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
              Edit Review
            </Typography>
            <Close
              onClick={() => setEditReview(false)}
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
              defaultValue={reviewed[0]?.review}
              render={({
                field: { ref, ...fields },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  multiline
                  rows={10}
                  sx={{ mt: 3, mb: 6 }}
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

export default EditReview;
