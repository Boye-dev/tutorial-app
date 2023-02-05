import { Box, Divider, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Add } from "@mui/icons-material";
import AddResource from "../components/AddResource";
const Resources = () => {
  const [openAddResource, setAddResource] = useState(false);
  const role = "Tutor";
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
          sx={{
            width: { xs: "100%", md: "70%" },
            mb: 5,
            pl: { xs: 2, md: 0 },
            pr: { xs: 2, md: 0 },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
          {role === "Tutor" && (
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
        <Divider sx={{ backgroundColor: "rgb(185,141,59)", height: "3.5px" }} />

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
            <a href="#" style={{ textDecoration: "none", width: "100%" }}>
              <Typography
                sx={{
                  pl: 2,
                  color: "grey",
                  fontSize: "14px",
                  fontWeight: "700",
                  width: "100%",
                  wordWrap: "break-word",
                }}
              >
                http://localhost:3000/student/levels/300/courses/math-101/1/resources
              </Typography>
            </a>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
              display: "flex",
              alignItems: "center",
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
              By - Oyelola Adeboye
            </Typography>
            <Typography
              sx={{
                color: "grey",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              lacinia, mi euismod feugiat tincidunt, nibh velit efficitur velit,
              vel gravida velit metus eu nunc. P
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: "rgb(0,66,130)", height: "1px" }} />
      </Box>
      <AddResource
        openAddResource={openAddResource}
        setAddResource={setAddResource}
      />
    </>
  );
};

export default Resources;
