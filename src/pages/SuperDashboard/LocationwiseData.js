import { useEffect, useState, useMemo, forwardRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, configToken } from "../../utils/api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CardTable from "../../components/CardTable";
import {SelectColumnFilter} from "../../components/Table";
import Button from "@mui/material/Button";
import FullDialog from './FullDialog';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

function LocationwiseData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [numDays, setNumDays] = useState(180);

  const { isLoggedIn, token, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  

  const decideColor = (current, pending) => {
    return Math.floor((pending/current)*100);
  }

  const columns = useMemo(
    () => [
      {
        Header: "Card",
        id: "card",
        customWidth: "100%",
        Cell: (d) => {
          const [open, setOpen] = useState(false);
          const handleClickOpen = () => {
            setOpen(true);
          };
          const modalContent = () =>{
              return(
                <Grid container spacing={2} sx={{mt: 5, p: 4}}>
                  {d.row.original.vacancies.map((item, index) => (
                    <div key={index}>
                    <Typography variant="h4" color="text.secondary" gutterBottom>
                        {item.college}
                      </Typography>
                    <Grid container item xs={12}>
                      {item.pendingVacancies.map((i, j) => (
                        <Card key={j} sx={{ minWidth: 275 }}>
                          <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                              {i.firstName}{' '}{i.lastName}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              {i.position}
                            </Typography>
                            <Typography variant="h6">
                              {i.department}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              {i.collegeName}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} variant="body1" color="error">
                              Days before retiring : {i.daysToRetire}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            
                            
                            <Grid container sx={{mt: 2}}>
                              <Button variant="contained" size="small" color="error">Send Reminder</Button>
                            </Grid>
                          </CardActions>
                        </Card>
                      ))}
                    </Grid>
                    </div>
                  ))}
                </Grid>  
              )
          }
          return (
            <Grid component={Paper} container item xs={12} sx={{overflow: 'hidden'}}>
              <FullDialog open={open} setOpen={setOpen} modalContent={modalContent} title={d.row.original.location} />
              <Grid item xs={12} md={3} sx={{p:2, backgroundColor: decideColor(d.row.original.totcurvacancies, d.row.original.totpendingvacancies) > 50 ? '#ef233c' : "#38b000", display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                <Typography variant="h3" color="white">{decideColor(d.row.original.totcurvacancies, d.row.original.totpendingvacancies)}%</Typography>
              </Grid>
              <Grid container item xs={12} md={9} sx={{p:2, display: 'flex', justifyContent: 'center', alignItems: "center"}}>                
                <Grid item xs={12}>
                  <Typography variant="h6">{d.row.original.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Current Vacancies</Typography>
                  <Typography variant="h4">{d.row.original.totcurvacancies}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Pending Vacancies</Typography>
                  <Typography variant="h4">{d.row.original.totpendingvacancies}</Typography>
                </Grid>
                <Grid item xs={12} md={6} size="small" sx={{mt: 2}}>
                  <Button variant="contained" color="primary" onClick={()=> handleClickOpen()}>View Details</Button>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
      {
        Header: "College",
        accessor: "collegeName",
        //Filter: SelectColumnFilter,
      },
    ],
    []
  );

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      axios
        .get(
          `${BASE_URL}superadmin/getsuperadmindashboard/locations/${numDays}`,
          configToken(token)
        )
        .then((response) => {
          console.log(response.data);
          setData(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
          setData([]);
        });
    }
  }, [isLoggedIn, token, isSuperAdmin, numDays]);

  const initialState = { hiddenColumns: [] };

  if (isLoading) {
    return (
      <Grid container justifyContent="center" sx={{ my: 2 }}>
        <CircularProgress />
      </Grid>
    );
  }
  if (!isLoggedIn) {
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
  if (data.length > 0) {
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
          <CardTable columns={columns} data={data} initialState={initialState} isLoading={isLoading} />
        </Box>
      </Container>
    );
  }
}

export default LocationwiseData;
