import { Add, RateReview, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import AuthService from "../auth_service";
import AddReview from "../components/AddReview";
import EditReview from "../components/EditReview";
import SingleMessage from "../components/SingleMessage";

const SingleTutor = () => {
  const [openSingle, setOpenSingle] = useState(false);
  const { getCurrentUser } = AuthService;
  const [openAddReview, setAddReview] = useState(false);
  const [openEditReview, setEditReview] = useState(false);
  const { level } = useParams();
  const navigate = useNavigate();
  const { tutorId } = useParams();

  const getStars = (rate) => {
    const stars = [];
    for (let i = 1; i < 6; i++) {
      stars.push(
        <Star
          // onClick={() => setRating(i)}
          key={i}
          sx={{
            color: i <= rate ? "rgb(185,141,59)" : "grey",
            cursor: "pointer",
            fontSize: "20px",
          }}
        />
      );
    }
    return stars;
  };
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [isLoadingReview, setLoadingReview] = useState(true);
  const [hasReviewed, setHasReviewd] = useState(false);
  const [reviewed, setReviewed] = useState(null);

  const [isLoading, setLoading] = useState(true);

  const { status, refetch: refetchSingleTutor } = useQuery("get-course", () => {
    return api.get(`/api/tutor-courses/${tutorId}`).then((data) => {
      setData(data.data);
      setLoading(false);
      return data;
    });
  });
  const { status: reviewStatus, refetch: refetchReviews } = useQuery(
    "get-review",
    () => {
      return api.get(`/api/reviews/tutors/${tutorId}`).then((data) => {
        setReviews(data.data);
        setLoadingReview(false);
        return data;
      });
    }
  );
  useEffect(() => {
    setReviewed(
      reviews?.filter(
        (entry) =>
          entry?.studentID._id === getCurrentUser()?._id &&
          entry?.tutorID === tutorId
      )
    );
    setHasReviewd(
      reviews?.some(
        (entry) =>
          entry?.studentID._id === getCurrentUser()?._id &&
          entry?.tutorID === tutorId
      )
    );
  }, [reviews, getCurrentUser, tutorId]);

  return (
    <>
      <Box
        sx={{
          mt: { xs: "230px !important", md: "120px !important" },
          margin: { xs: "0 0", md: "0 10%" },

          width: "100%",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: { xs: "block", md: "flex" },
                // alignItems: "center",
                // justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: { xs: "block", md: "flex" },

                  width: { xs: "100%", md: "80%" },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      md: "250px",
                    },
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "100%",
                      width: "250px",
                      height: "250px",
                      color: "black",
                    }}
                  >
                    {" "}
                    <img
                      style={{
                        borderRadius: "100%",
                        width: "250px",
                        height: "250px",
                      }}
                      src={data.profilePhoto}
                      alt="profile"
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    pl: { xs: 0, md: 3 },
                    width: { xs: "100%", md: "calc(100% - 300px)" },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgb(0,66,130)",
                      fontSize: "45px",

                      fontWeight: "400",
                    }}
                  >
                    {data.lastname} {data.firstname}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgb(0,66,130)",
                      fontSize: "15px",

                      fontWeight: "200",
                    }}
                  >
                    {data.phonenumber}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                      alignItems: "center",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgb(0,66,130)",
                        fontSize: "15px",
                        pr: 1,
                        fontWeight: "200",
                      }}
                    >
                      Area Of Specialty
                    </Typography>
                    {data.areaOfSpecialty.map((item) => {
                      return (
                        <Box
                          onClick={() => {
                            if (getCurrentUser()?.role === "Tutor") {
                              navigate(
                                `/tutor/courses/${item.code
                                  .toLocaleLowerCase()
                                  .replace(/ /g, "-")}/${item._id}/space`
                              );
                            } else {
                              navigate(
                                `/student/levels/${level}/courses/${item.code
                                  .toLocaleLowerCase()
                                  .replace(/ /g, "-")}/${item._id}/space`
                              );
                            }
                          }}
                          sx={{
                            width: "auto",
                            height: "auto",
                            borderRadius: "10px",
                            cursor: "pointer",
                            p: 1,
                            m: 0.5,
                            backgroundColor: item.color,
                          }}
                        >
                          <Typography sx={{ color: "white", fontSize: "12px" }}>
                            {item.code}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", md: "20%" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Typography
                  sx={{
                    color: "rgb(0,66,130)",
                    fontSize: "25px",

                    fontWeight: "400",
                  }}
                >
                  {Math.floor(data.avgRating)}.0
                  {getStars(Math.floor(data.avgRating))}
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{ height: "3px", backgroundColor: "rgb(0,66,130)", mt: 3 }}
            />
            <Box sx={{ ml: { xs: 4, md: 15 }, mr: { xs: 4, md: 15 }, mt: 5 }}>
              <Box display="flex" alignItems="center">
                <RateReview />
                <Typography sx={{ fontSize: "25px", fontWeight: "700" }}>
                  Reviews
                </Typography>
                {getCurrentUser()?.role === "Student" && (
                  <Box
                    onClick={() => {
                      hasReviewed ? setEditReview(true) : setAddReview(true);
                    }}
                    sx={{
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "100%",
                      width: "40px",
                      height: "40px",
                      p: 1,
                      ml: 3,
                      boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                      cursor: "pointer",
                    }}
                  >
                    <Add />
                  </Box>
                )}{" "}
              </Box>

              <Box
                sx={{
                  // ml: { xs: 0, md: 15 },
                  // mr: { xs: 0, md: 15 },
                  mt: 5,
                  mb: 5,
                }}
              >
                {isLoadingReview ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 5,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : reviews.length === 0 ? (
                  <Typography>No Reviews Yet</Typography>
                ) : (
                  reviews.map((item) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 5,
                          cursor: "pointer",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow:
                            "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",

                          p: 2,
                          zIndex: "10",
                        }}
                      >
                        <Box sx={{ width: "100%", display: "flex" }}>
                          <Box
                            sx={{
                              borderRadius: "100%",
                              width: "70px",
                              height: "70px",
                              color: "black",
                            }}
                          >
                            <img
                              style={{
                                borderRadius: "100%",
                                width: "50px",
                                height: "50px",
                              }}
                              src={item.studentID.profilePhoto}
                              alt="profile"
                            />
                          </Box>
                          <Box sx={{ width: "calc(100% - 70px)", pl: 2 }}>
                            <Typography
                              sx={{
                                color: "grey",
                                fontSize: "14px",
                                fontWeight: "700",
                              }}
                            >
                              {item.studentID.lastname}{" "}
                              {item.studentID.firstname}
                            </Typography>
                            <Typography
                              sx={{
                                color: "grey",
                                fontSize: "12px",
                                fontWeight: "700",
                                mt: 1,
                              }}
                            >
                              January 1, 2023
                            </Typography>
                            <Typography
                              sx={{
                                color: "grey",
                                fontSize: "14px",
                                fontWeight: "700",
                                mt: 1,
                              }}
                            >
                              {getStars(item.rating)}
                            </Typography>
                            <Typography
                              sx={{
                                color: "grey",
                                fontSize: "12px",
                                fontWeight: "700",
                                mt: 1,
                              }}
                            >
                              {item.review}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
      <SingleMessage openSingle={openSingle} setOpenSingle={setOpenSingle} />
      {!isLoadingReview && hasReviewed ? (
        <EditReview
          refetchReviews={refetchReviews}
          openEditReview={openEditReview}
          setEditReview={setEditReview}
          reviewed={reviewed}
          reviews={reviews}
          setReviews={setReviews}
          isLoadingReview={isLoadingReview}
          setLoadingReview={setLoadingReview}
          refetchSingleTutor={refetchSingleTutor}
        />
      ) : (
        <AddReview
          refetchReviews={refetchReviews}
          openAddReview={openAddReview}
          refetchSingleTutor={refetchSingleTutor}
          setAddReview={setAddReview}
        />
      )}
    </>
  );
};

export default SingleTutor;
