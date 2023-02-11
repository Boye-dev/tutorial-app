import { CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import svg from "../assets/images/randomSvg.png";
import AuthService from "../auth_service";
const Courses = () => {
  const { level } = useParams();
  const navigate = useNavigate();

  const { getCurrentUser } = AuthService;
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [isLoading, setLoading] = useState(true);
  const { status } = useQuery("get-course", () => {
    return api
      .get(
        getCurrentUser()?.role === "Student"
          ? `/api/courses/${level}`
          : `/api/tutor-courses/${getCurrentUser()?._id}`
      )
      .then((data) => {
        setData(data.data);

        setLoading(false);
        return data;
      });
  });

  return (
    <>
      <Box sx={{ mt: "100px", ml: 5, mr: 5, width: "100%" }}>
        <TextField
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          sx={{ width: { xs: "100%", md: "50%" }, mb: 5 }}
          placeholder="Search For Course"
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-evenly",
          }}
          //   spacing={{ xs: 0, md: 2 }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : getCurrentUser()?.role === "Student" ? (
            data.course
              .filter((item) => {
                return item.code
                  .toLowerCase()
                  .includes(course.replace(/ /g, "").toLowerCase());
              })
              .map((item) => {
                return (
                  <Box
                    onClick={() =>
                      navigate(
                        `${item.code.toLocaleLowerCase().replace(/ /g, "-")}/${
                          item._id
                        }/space`,
                        { state: { color: item.color, level: item.level } }
                      )
                    }
                    sx={{
                      width: { xs: "100%", md: "300px" },
                      boxShadow: "none",
                      transition: "box-shadow 0.2s",
                      height: "250px",
                      borderRadius: "8px",
                      backgroundColor: item.color,
                      mb: 5,
                      ":hover": {
                        cursor: "pointer",
                        boxShadow:
                          "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                      },
                    }}
                  >
                    <Box sx={{ padding: "12%" }}>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "30px",
                          fontWeight: "700",
                        }}
                      >
                        {item.code}
                      </Typography>{" "}
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <img src={svg} alt="" style={{ width: "70%" }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })
          ) : (
            data.areaOfSpecialty
              .filter((item) => {
                return item.code
                  .toLowerCase()
                  .includes(course.replace(/ /g, "").toLowerCase());
              })
              .map((item) => {
                return (
                  <Box
                    onClick={() =>
                      navigate(
                        `${item.code.toLocaleLowerCase().replace(/ /g, "-")}/${
                          item._id
                        }/space`,
                        { state: { color: item.color, level: item.level } }
                      )
                    }
                    sx={{
                      width: { xs: "100%", md: "300px" },
                      boxShadow: "none",
                      transition: "box-shadow 0.2s",
                      height: "250px",
                      borderRadius: "8px",
                      backgroundColor: item.color,
                      mb: 5,
                      ":hover": {
                        cursor: "pointer",
                        boxShadow:
                          "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
                      },
                    }}
                  >
                    <Box sx={{ padding: "12%" }}>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "30px",
                          fontWeight: "700",
                        }}
                      >
                        {item.code}
                      </Typography>{" "}
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <img src={svg} alt="" style={{ width: "70%" }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })
          )}
        </Box>
      </Box>
    </>
  );
};

export default Courses;
