import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { signOut } from "../redux/features/auth/authSlice";
import { addToast } from "../redux/features/toast/toastSlice";
import { useNavigate } from "react-router-dom";

const Teacherpages = [
  { Name: "Vacancies", pagePath: "vacancy" },
  { Name: "Subscriptions", pagePath: "subscriptions" },
  { Name: "Profile", pagePath: "profile" },
];
const Adminpages = [
  { Name: "Dashboard", pagePath: "dashboard" },
  { Name: "Vacancies", pagePath: "vacancy" },
  { Name: "Add Teachers", pagePath: "addteacher" },
  { Name: "View Teachers", pagePath: "viewteachers" },
  { Name: "Create Vacancy", pagePath: "createvacancy" },
];
const SuperAdminpages = [{ Name: "Dashboard", pagePath: "dashboard" }];

const TempNavbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    if (isLoggedIn) {
      dispatch(signOut());
      dispatch(addToast({ type: "info", message: "You are logged out!" }));
      navigate("/login");
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#263354" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            RECRUITEASY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {isLoggedIn && (
                <section>
                  {!isAdmin && !isSuperAdmin
                    ? Teacherpages.map((page, index) => (
                        <MenuItem key={index} onClick={handleCloseNavMenu}>
                          <NavLink to={`/${page.pagePath}`}>
                            <Typography textAlign="center">
                              {page.Name}
                            </Typography>
                          </NavLink>
                        </MenuItem>
                      ))
                    : isAdmin
                    ? Adminpages.map((page, index) => (
                        <MenuItem key={index} onClick={handleCloseNavMenu}>
                          <NavLink to={`/admin/${page.pagePath}`}>
                            <Typography textAlign="center">
                              {page.Name}
                            </Typography>
                          </NavLink>
                        </MenuItem>
                      ))
                    : SuperAdminpages.map((page, index) => (
                        <MenuItem key={index} onClick={handleCloseNavMenu}>
                          <NavLink to={`/superadmin/${page.pagePath}`}>
                            <Typography textAlign="center">
                              {page.Name}
                            </Typography>
                          </NavLink>
                        </MenuItem>
                      ))}
                </section>
              )}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isLoggedIn && (
              <>
                {!isAdmin && !isSuperAdmin
                  ? Teacherpages.map((page, index) => (
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <NavLink to={`/${page.pagePath}`}>
                          <Typography textAlign="center" color="white">
                            {page.Name}
                          </Typography>
                        </NavLink>
                      </MenuItem>
                    ))
                  : isAdmin
                  ? Adminpages.map((page, index) => (
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <NavLink to={`/admin/${page.pagePath}`}>
                          <Typography textAlign="center" color="white">
                            {page.Name}
                          </Typography>
                        </NavLink>
                      </MenuItem>
                    ))
                  : SuperAdminpages.map((page, index) => (
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <NavLink to={`/superadmin/${page.pagePath}`}>
                          <Typography textAlign="center" color="white">
                            {page.Name}
                          </Typography>
                        </NavLink>
                      </MenuItem>
                    ))}
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <Button
                variant="outlined"
                sx={{ color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <NavLink to="/login">
                <Typography color="white" textAlign="center">
                  Login
                </Typography>
              </NavLink>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TempNavbar;
