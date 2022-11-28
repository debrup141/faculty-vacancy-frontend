import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/features/auth/authSlice";
import { addToast } from "../../redux/features/toast/toastSlice";

import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { BASE_URL, configToken } from "../../utils/api";
import { useEffect } from "react";
import { Paper } from "@mui/material";

const theme = createTheme();

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        {...field}
        {...props}
        margin="dense"
        size="small"
        fullWidth
        helperText={meta.touched && meta.error ? meta.error : null}
        error={meta.touched && Boolean(meta.error)}
      />
    </>
  );
};

const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const validationSchema = Yup.object({
  location: Yup.string().required("This field is required!"),
  minimumQualification: Yup.string().required("This field is required!"),
  minimumExperience: Yup.string().required("This field is required!"),
  department: Yup.string().required("This field is required!"),
  position: Yup.string().required("This field is required!"),
  compensation: Yup.string().required("This field is required!"),
  college: Yup.string().required("This field is required!"),
  collegeId: Yup.string().required("This field is required!"),
});

const AddVacancy = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [depts, setDepts] = useState([]);
  const [collegeId, setCollegeId] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, token, isAdmin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      dispatch(setLoading(true));
      axios
        .get(`${BASE_URL}admin/getmycollegedata`, configToken(token))
        .then((response) => {
          // console.log(response.data);
          setDepts(response.data.departments);
          setCollegeName(response.data.collegeName);
          setCollegeId(response.data.collegeId);
          dispatch(setLoading(false));
        })
        .catch((err) => {
          console.log(err.message);
          dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token, isAdmin]);

  const deptselectList = depts.map((dept, index) => (
    <option key={index} value={dept.name}>
      {dept.name}
    </option>
  ));

  const handleSubmit = (values, resetForm) => {
    console.log(values);
    dispatch(setLoading(true));
    axios
      .post(`${BASE_URL}admin/createvacancy`, values, configToken(token))
      .then((res) => {
        console.log(res.data);
        dispatch(setLoading(false));
        resetForm();
        dispatch(
          addToast({
            type: "success",
            message: "Successfully created vacancy!",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        dispatch(
          addToast({ type: "error", message: "Could not add vacancy." })
        );
      });
  };

  if (!isLoggedIn || !isAdmin) {
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
    <ThemeProvider theme={theme}>
      <Container
        component={Paper}
        maxWidth="xs"
        sx={{ backgroundColor: "white", py: 1, my: 10, borderRadius: 5 }}
      >
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
          <Typography component="h1" variant="h5">
            Add Vacancy
          </Typography>
          {depts.length === 0 ? (
            <Grid
              container
              spacing={1}
              justifyContent="center"
              sx={{ marginTop: 5 }}
            >
              <CircularProgress color="secondary" size={40} />
            </Grid>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Formik
                initialValues={{
                  email: "",
                  minimumExperience: "",
                  minimumQualification: "",
                  location: "",
                  department: "",
                  position: "",
                  college: collegeName,
                  collegeId: collegeId,
                  compensation: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Position
                      </Typography>
                      <MyTextInput
                        label="Position"
                        id="position"
                        name="position"
                        type="text"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Location
                      </Typography>
                      <MyTextInput
                        label="Location"
                        id="location"
                        name="location"
                        type="text"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Email Address
                      </Typography>
                      <MyTextInput
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        College Name
                      </Typography>
                      <MyTextInput
                        id="college"
                        name="college"
                        type="text"
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        College ID
                      </Typography>
                      <MyTextInput
                        id="collegeId"
                        name="collegeId"
                        type="text"
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Location
                      </Typography>
                      <MySelect name="department">
                        <option value="">Select a Department</option>
                        {deptselectList}
                      </MySelect>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Minimum Qualification
                      </Typography>
                      <MyTextInput
                        id="minimumQualification"
                        name="minimumQualification"
                        type="text"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Minimum Experience
                      </Typography>
                      <MyTextInput
                        id="minimumExperience"
                        name="minimumExperience"
                        type="text"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Compensation
                      </Typography>
                      <MyTextInput
                        id="compensation"
                        name="compensation"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading ? true : false}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress color="primary" size={25} />
                    ) : (
                      "Add Vacancy"
                    )}
                  </Button>
                </Form>
              </Formik>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddVacancy;
