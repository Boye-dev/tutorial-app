import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Tooltip,
  MenuItem,
  Divider,
  Drawer,
  TextField,
  Button,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
const AddResource = ({ openAddResource, setAddResource }) => {
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
            <TextField fullWidth label="Link" sx={{ mt: 4 }} />
            <TextField
              fullWidth
              label="Description"
              sx={{ mt: 2, mb: 2 }}
              multiline
              rows={10}
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
            <Button variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AddResource;
