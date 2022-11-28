import {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

import {BASE_URL, configToken} from '../../utils/api';

import MySubscriptions from './MySubscriptions';
import CreateSubscriptions from './CreateSubscriptions';

const Subscriptions = () => {
    const [value, setValue] = useState('one');
    const [collegesList, setCollegesList] = useState([]);
    const [locationsList, setLocationsList] = useState([]);

    const { isLoggedIn, token } = useSelector((state) => state.auth);

    useEffect(() =>{
        if(isLoggedIn){
            axios
                .get(`${BASE_URL}subscriptions/colleges`, configToken(token))
                .then((response) => setCollegesList(response.data))
                .catch(err => console.log(err));

            axios
                .get(`${BASE_URL}subscriptions/locations`, configToken(token))
                .then((response) => setLocationsList(response.data))
                .catch(err => console.log(err));
        }
    }, [isLoggedIn, token]);

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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Typography variant="h3" gutterBottom>
                        Subscriptions
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                        >
                            <Tab value="one" label="My Subscriptions" />
                            <Tab value="two" label="Create Subscriptions" />
                        </Tabs>
                    </Grid>

                    {value === 'one' ? <MySubscriptions /> : <CreateSubscriptions collegesList={collegesList} locationsList={locationsList} />}
                </Box>
            </Container>
    )
}

export default Subscriptions;