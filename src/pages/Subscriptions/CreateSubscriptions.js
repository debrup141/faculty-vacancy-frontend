import {useState} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useSelector } from "react-redux";
import Grid from '@mui/material/Grid';
//import Typography from '@mui/material/Typography';
//import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
//import CircularProgress from '@mui/material/CircularProgress';
//import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import {BASE_URL, configToken} from '../../utils/api';
import SubscriptionCard from './SubscriptionCard';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 2;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const theme = createTheme();

const CreateSubscriptions = ({locationsList, collegesList}) => {
    const[locations, setLocations] = useState([]);
    const[colleges, setColleges] = useState([]);
    const[subData, setSubData] = useState([]);

    const { token } = useSelector((state) => state.auth);

    const handleLocationChange = (event) => {
        const {
          target: { value },
        } = event;
        setLocations(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleCollegeChange = (event) => {
        const {
          target: { value },
        } = event;
        setColleges(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const applyFilter = () => {
        const data = {
            colleges,
            locations,
        }
        axios.post(`${BASE_URL}subscriptions/filter`, data, configToken(token))
        .then((response) =>{
            console.log(response.data);
            setSubData(response.data);
        })
        .catch((error) => console.error(error));
    }

    return (
        <Grid container spacing={1} justifyContent="center" sx={{marginTop: 5}}>
            <Grid item xs={12} md={4}>
                <FormControl sx={{ width: '100%' }} size="small">
                    <InputLabel id="location-label">Locations</InputLabel>
                    <Select
                        labelId="location-label"
                        id="location-multiple-chip"
                        multiple
                        value={locations}
                        onChange={handleLocationChange}
                        input={<OutlinedInput id="select-location-chip" label="Locations" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                    {locationsList.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, locations, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
                <FormControl sx={{ width: '100%' }} size="small">
                    <InputLabel id="colleges-label">Colleges</InputLabel>
                    <Select
                        labelId="colleges-label"
                        id="colleges-multiple-chip"
                        multiple
                        value={colleges}
                        onChange={handleCollegeChange}
                        input={<OutlinedInput id="select-colleges-chip" label="Colleges" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                    {collegesList.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, colleges, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
                <Button variant="contained" color="primary" sx={{width: '100%' }} onClick={applyFilter}>Apply</Button>
            </Grid>

            <Grid item container spacing={2} sx={{mt:5}} justifyContent="center">
                {subData.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} lg={4}>
                        <SubscriptionCard item={item} subscribe={true} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default CreateSubscriptions;