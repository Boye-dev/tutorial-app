import { RateReview, Reviews, Star } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleMessage from "../components/SingleMessage";

const SingleTutor = () => {
  const [openSingle, setOpenSingle] = useState(false);
  const navigate = useNavigate();
  const rating = 3;
  const getStars = (rate) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} sx={{ color: i < rate ? "rgb(185,141,59)" : "grey" }} />
      );
    }
    return stars;
  };
  return (
    <>
      <Box
        sx={{
          mt: { xs: "230px !important", md: "120px !important" },
          margin: { xs: "0 0", md: "0 10%" },

          width: "100%",
        }}
      >
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
                  border: "2px solid black",
                  borderRadius: "100%",
                  width: "250px",
                  height: "250px",
                  color: "black",
                }}
              ></Box>
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
                Oyelola Adeboye
              </Typography>
              <Typography
                sx={{
                  color: "rgb(0,66,130)",
                  fontSize: "15px",

                  fontWeight: "200",
                }}
              >
                07061071933
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map(() => {
                  return (
                    <Box
                      sx={{
                        width: "auto",
                        height: "auto",
                        borderRadius: "10px",
                        p: 1,
                        m: 0.5,
                        backgroundColor: "rgb(185,141,59)",
                      }}
                    >
                      <Typography sx={{ color: "white", fontSize: "12px" }}>
                        MATH 101
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mt: 1,
                }}
              >
                <Button
                  onClick={() => setOpenSingle(true)}
                  variant="text"
                  color="primary"
                >
                  <Typography>Message</Typography>
                </Button>
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
              {rating}.0 {getStars(rating)}
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{ height: "3px", backgroundColor: "rgb(0,66,130)", mt: 3 }}
        />
        <Box sx={{ ml: 2, mr: 2 }}>
          <Box display="flex" alignItems="center">
            <RateReview />
            <Typography sx={{ fontSize: "25px", fontWeight: "700" }}>
              Reviews
            </Typography>
          </Box>

          <Box
            sx={{ ml: { xs: 0, md: 15 }, mr: { xs: 0, md: 15 }, mt: 5, mb: 5 }}
          >
            {[1, 2, 4, 5, 5].map(() => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 5,
                    cursor: "pointer",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",

                    p: 2,
                    zIndex: "10",
                  }}
                >
                  <Box sx={{ width: "100%", display: "flex" }}>
                    <Box
                      sx={{
                        border: "2px solid black",
                        borderRadius: "100%",
                        width: "70px",
                        height: "70px",
                        color: "black",
                      }}
                    ></Box>
                    <Box sx={{ width: "calc(100% - 70px)", pl: 2 }}>
                      <Typography
                        sx={{
                          color: "grey",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        Oyelola Adeboye
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
                        {getStars(rating)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "grey",
                          fontSize: "12px",
                          fontWeight: "700",
                          mt: 1,
                        }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam lacinia, mi euismod feugiat tincidunt, nibh velit
                        efficitur velit, vel gravida velit metus eu nunc. Proin
                        ut semper sapien. Sed condimentum, libero a ullamcorper
                        malesuada, libero dolor porttitor ligula, sit amet
                        faucibus nisl lectus eu sapien. Suspendisse eget libero
                        id dui feugiat accumsan. Aliquam erat volutpat. Nunc
                        euismod mauris id
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <SingleMessage openSingle={openSingle} setOpenSingle={setOpenSingle} />
    </>
  );
};

export default SingleTutor;
