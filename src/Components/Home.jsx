import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { UserAgentApplication } from "msal";

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import moment from "moment";
import config from "../Config";
import { getUserDetails, getEvents } from "../GraphService";

const formatDateTime = (datetime) => {
  return moment.utc(datetime).local().format("hh:mm DD/MM/YYYY");
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
  table: {
    minWidth: 700,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [events, setEvents] = useState([]);

  const userAgentApp = new UserAgentApplication({
    auth: {
      clientId: config.appId,
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
  });
  const currentUser = userAgentApp.getAccount();

  const login = async () => {
    try {
      await userAgentApp.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      await getUserProfile();
    } catch (error) {
      setIsAuthenticated(false);
      setUser({});
      setErrors(error);
    }
  };

  const logout = () => {
    userAgentApp.logout();
  };

  const getUserProfile = async () => {
    try {
      let accessToken = await userAgentApp.acquireTokenSilent({
        scopes: config.scopes,
      });
      if (accessToken) {
        let user = await getUserDetails(accessToken);
        setIsAuthenticated(true);
        setUser({
          displayName: user.displayName,
          email: user.email || user.userPrincipalName,
        });
        setErrors([]);
        let data = await getEvents(accessToken);
        setEvents(data.value);
      }
    } catch (error) {}
  };
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
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{
          minHeight: "80vh",
        }}
      >
        {/* <Grid item xs={8}>
          <Card>
            <CardHeader title="Welcome" />
            <CardContent>Welcome back, {user.displayName}</CardContent>
          </Card>
        </Grid> */}
        {isAuthenticated && (
          <Grid item xs={8}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell align="right">Organizer</StyledTableCell>
                    <StyledTableCell align="right">Start</StyledTableCell>
                    <StyledTableCell align="right">End</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <StyledTableRow key={event.id}>
                      <StyledTableCell component="th" scope="row">
                        {event.subject}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {event.organizer.emailAddress.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {formatDateTime(event.start.dateTime)}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {formatDateTime(event.end.dateTime)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
