import {useMemo, useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import {BASE_URL, configToken} from '../../utils/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableComponent from '../../components/Table';
import { SelectColumnFilter } from '../../components/Table';
import DetailDialog from '../Subscriptions/DetailDialog';
import Button from '@mui/material/Button';

const ViewTeachers = () => {
    const[teachersData, setTeachersData] = useState([]);
    const[modalData, setModalData] = useState({});
    const[isLoading, setIsLoading] = useState(false);    
    const [open, setOpen] = useState(false);

    const { isLoggedIn, token, isAdmin } = useSelector((state) => state.auth);

    useEffect(() =>{
        if(isLoggedIn && isAdmin){
          setIsLoading(true);
            axios
                .get(`${BASE_URL}admin/getallteachers`, configToken(token))
                .then((response) => {
                  console.log(response.data);
                  setTeachersData(response.data);
                  setIsLoading(false);
                })
                .catch(err => {
                  setIsLoading(false);
                  setTeachersData([]);
                });
        }
    }, [isLoggedIn, token, isAdmin]);

    const handleClickOpen = (data) => {
      setModalData(data);
      setOpen(true);
    };

    const modalContent = () =>{
      return(
        <>
          <b>Name : </b>{" "}{modalData.firstName}{" "}{modalData.lastName}<br/>
          <b>Email : </b>{" "}{modalData.email}<br/>
          <b>Date of Joining : </b>{" "}{modalData.dateJoined?.split('T')[0]}<br/>
          <b>Date of Birth : </b>{" "}{modalData.dob?.split('T')[0]}<br />
          <b>Currently Available to Join : </b>{" "}{modalData.isOpenToWork ? "Yes" : "No"}<br/>
          <b>College : </b>{modalData.collegeName}<br/>
          <b>Department : </b>{modalData.department}<br/>
          <b>Role : </b>{modalData.position}<br/>
        </>  
      )
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Name',
            id: 'name',
            Cell: (d) => {
              return (
                <Typography variant="body1">
                  {d.row.original.firstName}{" "}{d.row.original.lastName}
                </Typography>
              );
            },
            customWidth: "15%"
          },
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
          {
            Header: 'Email',
            accessor: 'email',
            customWidth: "15%"
          },
          {
            Header: 'Available to Work',
            id: "isOpenToWork",
            Cell: (d) => {
              return (
                <Typography variant="body1">
                  {d.row.original.isOpenToWork ? 'Yes': 'No'}
                </Typography>
              );
            },
          },
          {
            Header: 'College',
            accessor: 'collegeName',
            customWidth: '20%',
            Filter: SelectColumnFilter,
          },
          {
            Header: 'Department',
            accessor: 'department',
            customWidth: '20%',
            Filter: SelectColumnFilter,
          },
          {
            Header: 'Role',
            accessor: 'position',
            customWidth: '15%',
            Filter: SelectColumnFilter,
          },
          {
            Header: '',
            id: "button",
            Cell: (d) => {
              return (
                  <Button variant="contained" color="primary" size="small" 
                    onClick={() =>handleClickOpen(d.row.original)}>
                    View Details
                  </Button>
              );
            },
            customWidth: "15%"
          }
        ],
    []);
        
  const initialState = {hiddenColumns: ['firstName', 'lastName', 'isOpenToWork'], pageSize: 5 };

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

  return (
    <Container component="main" maxWidth="lg">
        <DetailDialog open={open} setOpen={setOpen} modalContent={modalContent} title="Details" />
        <TableComponent columns={columns} data={teachersData} initialState={initialState} isLoading={isLoading} />
    </Container>
  )
}

export default ViewTeachers;