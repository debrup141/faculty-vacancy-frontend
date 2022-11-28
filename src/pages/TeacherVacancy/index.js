import { useState } from "react";
import { useSelector } from "react-redux";
import AllVacancies from "./AllVacancies";
import SubVacancies from "./SubVacancies";
import {
  Grid,
  Tabs,
  Tab,
  Typography,
  Container,
  CssBaseline,
  Box,
} from "@mui/material";

function TeacherVacancy() {
  const [value, setValue] = useState('one');
  const{isLoggedIn} = useSelector((state) => state.auth);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if(!isLoggedIn){
    return(
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
          You are not Logged In!
        </Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Vacancies
        </Typography>
        <Tabs 
            value={value}
            onChange={handleChange}
        >
          <Tab value="one" label="All Vacancies" />
          <Tab value="two"label="Subscribed Vacancies" />
        </Tabs>
        <Grid container spacing={2} justifyContent="center" sx={{my: 2}}>
          {value === 'one' ? <AllVacancies /> : <SubVacancies />}
        </Grid>
      </Box>
    </Container>
  );
}

export default TeacherVacancy;
