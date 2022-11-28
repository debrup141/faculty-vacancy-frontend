import {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BASE_URL, configToken} from '../../utils/api';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Dashboard = () => {
    const[data, setData] = useState({});
    const[isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();  

    const { isLoggedIn, token, isAdmin, college } = useSelector((state) => state.auth);

    useEffect(() =>{
        if(isLoggedIn && isAdmin){
          setIsLoading(true);
          axios
            .get(`${BASE_URL}admin/dashboarddata`, configToken(token))
            .then((response) => {
              console.log(response.data);
              setData(response.data);
              setIsLoading(false);
            })
            .catch(err => {
              setIsLoading(false);
              setData([]);
            });
        }
    }, [isLoggedIn, token, isAdmin]);

    const handleViewMore = (department) => {
      navigate('/admin/vacancy', { state: { dept: department, tab: 'two' } });
    }

    if(isLoading){
      return (
        <Grid container justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress />
        </Grid>
      );
    }

    if(!isLoggedIn || !isAdmin){
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
            You are not Authorized!
          </Typography>
        </Box>
      );
    }

    if(data.length > 0){
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
              <Typography variant="h5" gutterBottom>
                {college}
              </Typography>
              <Grid container spacing={2} justifyContent="center" sx={{my: 2}}>
                {data.map((item, index) => (
                  <Grid key={index} item component={Paper} xs={12} md={8} sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom>{item.name}</Typography>
                    <Grid container spacing={2} justifyContent="center" sx={{mt: 1}}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" gutterBottom>Capacity</Typography>
                        <Typography variant="h4" gutterBottom>{item.capacity}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" gutterBottom>Teacher Count</Typography>
                        <Typography variant="h4" gutterBottom>{item.teacherCount}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body1" gutterBottom>Vacancy</Typography>
                        <Typography variant="h4" gutterBottom>{item.vacancyCount}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3} sx={{mt: 3}}>
                          <Button variant="contained" color="primary" size="small" onClick={()=> handleViewMore(item.name)}>
                            View More
                          </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
        </Container>
      )
    }
}

export default Dashboard;