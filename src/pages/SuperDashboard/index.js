import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, configToken } from "../../utils/api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Tab, Tabs } from "@mui/material";
import LocationwiseData from "./LocationwiseData";
import CollegewiseData from "./CollegewiseData";

//https://recruit-teacher.herokuapp.com/superadmin/getsuperadmindashboard/locations/:noOfDays
//https://recruit-teacher.herokuapp.com/superadmin/getsuperadmindashboard/colleges/:noOfDays

const SuperDashboard = () => {
  const [numDays, setNumDays] = useState(1000);
  const [value, setValue] = useState("one");

  const { isLoggedIn, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!isLoggedIn || !isSuperAdmin) {
    return (
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          You are not Authorized!
        </Typography>
      </Box>
    );
  }

  return (
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Tabs value={value} onChange={handleChange}>
              <Tab value="one" label="Location" />
              <Tab value="two" label="College" />
            </Tabs>
          </Grid>
          {value === "one" ? <LocationwiseData /> : <CollegewiseData />}
        </Box>
      </Container>
    );
};

export default SuperDashboard;
