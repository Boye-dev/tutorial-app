import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Add } from "@mui/icons-material";
import AddResource from "../components/AddResource";
import AuthService from "../auth_service";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import api from "../api/api";
const Resources = () => {
  const [openAddResource, setAddResource] = useState(false);
  const [isLoadingResource, setLoadingResource] = useState(true);
  const [data, setData] = useState(null);
  const [resour, setResour] = useState("");
  const { getCurrentUser } = AuthService;
  const { courseId } = useParams();

  const { status, refetch: refetchResource } = useQuery("get-tutors", () => {
    return api.get(`/api/resources/${courseId}`).then((data) => {
      setData(data.data);

      setLoadingResource(false);
      return data;
    });
  });

  return (
    <>
      <Box
        sx={{
          mt: { xs: "230px !important", md: "120px !important" },
          margin: { xs: "0 0", md: "0 20%" },
          width: "100%",
        }}
      >
        <TextField
          value={resour}
          onChange={(e) => setResour(e.target.value)}
          placeholder="Search For Resource"
          sx={{
            width: { xs: "100%", md: "70%" },
            mb: 5,
            pl: { xs: 2, md: 0 },
            pr: { xs: 2, md: 0 },
          }}
        />
        {getCurrentUser()?.role === "Tutor" && (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  color: "rgb(0,66,130)",
                  fontSize: "45px",
                  pl: 3,
                  fontWeight: "400",
                }}
              >
                Uploaded Resources
              </Typography>
              {getCurrentUser()?.role === "Tutor" && (
                <Tooltip title="Add Resource">
                  <Box
                    onClick={() => setAddResource(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "100%",
                      height: "80%",
                      ml: 3,
                      p: 1,
                      boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                      cursor: "pointer",
                    }}
                  >
                    <Add />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <Divider
              sx={{ backgroundColor: "rgb(185,141,59)", height: "3.5px" }}
            />

            {isLoadingResource ? (
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
              data.resources
                .filter((item) => getCurrentUser()?._id === item.tutorId._id)
                .map((item) => {
                  return (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: { xs: "column", md: "row" },
                          width: "100%",
                          mb: 2,
                          mt: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: "100%", md: "65%" },
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <a
                            href={`https://${item.link}`}
                            target="_blank"
                            style={{ textDecoration: "none", width: "100%" }}
                          >
                            <Typography
                              sx={{
                                pl: 2,
                                color: "blue",
                                fontSize: "14px",
                                fontWeight: "300",
                                width: "100%",
                                wordWrap: "break-word",
                              }}
                            >
                              {item.link}
                            </Typography>
                          </a>
                        </Box>
                        <Box
                          sx={{
                            width: { xs: "100%", md: "35%" },
                            display: "flex",

                            pl: 1,
                            pr: 1,
                            justifyContent: "flex-end",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "grey",
                              fontSize: "14px",
                              fontWeight: "700",
                            }}
                          >
                            Tutor - {item.tutorId.lastname}{" "}
                            {item.tutorId.firstname}
                          </Typography>
                          <Typography
                            sx={{
                              color: "grey",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        sx={{ backgroundColor: "rgb(0,66,130)", height: "1px" }}
                      />
                    </>
                  );
                })
            )}
          </>
        )}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Typography
            sx={{
              color: "rgb(0,66,130)",
              fontSize: "45px",
              pl: 3,
              fontWeight: "400",
            }}
          >
            Resources
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "rgb(185,141,59)", height: "3.5px" }} />
        {isLoadingResource ? (
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
          data.resources
            .filter((item) => getCurrentUser()?._id !== item.tutorId._id)
            .filter((item) => {
              return item.description
                .toLowerCase()
                .includes(resour.replace(/ /g, "").toLowerCase());
            })
            .map((item) => {
              return (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: { xs: "column", md: "row" },
                      width: "100%",
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", md: "65%" },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href={`https://${item.link}`}
                        target="_blank"
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <Typography
                          sx={{
                            pl: 2,
                            color: "blue",
                            fontSize: "14px",
                            fontWeight: "300",
                            width: "100%",
                            wordWrap: "break-word",
                          }}
                        >
                          {item.link}
                        </Typography>
                      </a>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: "100%", md: "35%" },
                        display: "flex",

                        pl: 1,
                        pr: 1,
                        justifyContent: "flex-end",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "grey",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        Tutor - {item.tutorId.lastname} {item.tutorId.firstname}
                      </Typography>
                      <Typography
                        sx={{
                          color: "grey",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider
                    sx={{ backgroundColor: "rgb(0,66,130)", height: "1px" }}
                  />
                </>
              );
            })
        )}
      </Box>
      <AddResource
        refetchResource={refetchResource}
        openAddResource={openAddResource}
        setAddResource={setAddResource}
      />
    </>
  );
};

export default Resources;
