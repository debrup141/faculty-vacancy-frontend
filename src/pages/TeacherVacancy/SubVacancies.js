import {useMemo, useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { BASE_URL } from "../../utils/api";
import Container from "@mui/material/Container";

import VacancyCard from "../../components/VacancyCard";
import CardTable from "../../components/CardTable";
import { SelectColumnFilter } from '../../components/Table';

const SubVacancies = () => {
    const[isLoading, setIsLoading] = useState(false);
    const [subsVacancies, setSubsVacancies] = useState([]);

    const { token, isLoggedIn } = useSelector((state) => state.auth);

    const columns = useMemo(
        () => [
          { 
            Header: 'Card',
            id: 'card',
            customWidth: '100%',
            Cell: (d) => {
                return(
                    <VacancyCard
                        position={d.row.original.position}
                        location={d.row.original.location}
                        college={d.row.original.college}
                        department={d.row.original.department}
                        minimumQualification={d.row.original.minimumQualification}
                        compensation={d.row.original.compensation}
                        numVacancies = {d.row.original.numberOfVacancies}
                        applyLink={d.row.original.applyLink}
                    />
                )
            }
          },
          {
            Header: 'Location',
            accessor: 'location',
          },
          {
            Header: 'College',
            accessor: 'college',
            Filter: SelectColumnFilter,
          },
          {
            Header: 'Department',
            accessor: 'department',
            Filter: SelectColumnFilter,
          },
          {
            Header: 'Role',
            accessor: 'position',
            Filter: SelectColumnFilter,
          },
        ],
    []);

    useEffect(() => {
        if(isLoggedIn){
            setIsLoading(true);
            axios
            .get(`${BASE_URL}vacancies/subscribedvacancies`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSubsVacancies(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setSubsVacancies([]);
            });
        }    
      }, [token, isLoggedIn]);

  const initialState = {hiddenColumns: [] };
  
  return (
    <Container component="main" maxWidth="lg">
        <CardTable columns={columns} data={subsVacancies} initialState={initialState} isLoading={isLoading} />
    </Container>
  )
}

export default SubVacancies;