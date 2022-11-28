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
  firstName: Yup.string().required("This field is required!"),
  lastName: Yup.string().required("This field is required!"),
  email: Yup.string()
    .email("Invalid email address!")
    .required("This field is required!"),
  password: Yup.string()
    .min(8, "Password is minimum 8 characters in length.")
    .required("This field is required!"),
  dob: Yup.date("Select a valid Date!")
    .max(new Date(), "DOB can not be in future!")
    .required("This field is required!"),
  department: Yup.string().required("This field is required!"),
  position: Yup.string().required("This field is required!"),
  dateJoined: Yup.date("Select a valid Date!")
    .max(new Date(), "DOB can not be in future!")
    .required("This field is required!"),
  collegeId: Yup.string().required("This field is required!"),
});

const AddTeacher = () => {
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
      .post(`${BASE_URL}admin/createteacher`, values, configToken(token))
      .then((res) => {
        console.log(res.data);
        dispatch(setLoading(false));
        resetForm();
        dispatch(
          addToast({ type: "success", message: "Successfully added teacher!" })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        dispatch(
          addToast({ type: "error", message: "Could not add teacher." })
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
            Add Teacher
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
                  password: "",
                  dob: "",
                  firstName: "",
                  lastName: "",
                  department: "",
                  position: "",
                  collegeName: collegeName,
                  collegeId: collegeId,
                  dateJoined: "",
                  isOpenToWork: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        First Name
                      </Typography>
                      <MyTextInput
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        type="text"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Last Name
                      </Typography>
                      <MyTextInput
                        label="Last Name"
                        id="lastName"
                        name="lastName"
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
                        Password
                      </Typography>
                      <MyTextInput
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Date of Birth
                      </Typography>
                      <MyTextInput id="dob" name="dob" type="date" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        College Name
                      </Typography>
                      <MyTextInput
                        id="collegeName"
                        name="collegeName"
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
                        Department
                      </Typography>
                      <MySelect name="department">
                        <option value="">Select a Department</option>
                        {deptselectList}
                      </MySelect>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Position
                      </Typography>
                      <MyTextInput id="position" name="position" type="text" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Date of Joining
                      </Typography>
                      <MyTextInput
                        id="dateJoined"
                        name="dateJoined"
                        type="date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MyCheckbox name="isOpenToWork"></MyCheckbox>
                      <Typography variant="subtitle1" gutterBottom>
                        Are you open to work?
                      </Typography>
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
                      "Add Teacher"
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

export default AddTeacher;
