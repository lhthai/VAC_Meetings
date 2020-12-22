import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { AuthContext } from "../Context/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { isLoading, isAuthenticated, loggedUser, login, logout } = useContext(
    AuthContext
  );

  if (isLoading) {
    return (
      <Route
        render={() => {
          return <p>Loading...</p>;
        }}
      />
    );
  }

  return (
    <Grid container>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Dashboard
          </Typography>
          {loggedUser && isAuthenticated ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {loggedUser && isAuthenticated && (
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            minHeight: "100vh",
          }}
        >
          <Grid item xs={4}>
            <Card>
              <CardHeader title="Welcome" />
              <CardContent>Welcome back, {loggedUser.displayName}</CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Home;
