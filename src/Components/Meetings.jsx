import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import moment from "moment";
import config from "../Config";
import { getEvents } from "../GraphService";

const formatDateTime = (datetime) => {
  return moment.utc(datetime).local().format("DD/MM/YYYY hh:mm");
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const Meetings = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        let accessToken = await window.msal.acquireTokenSilent({
          scopes: config.scopes,
        });
        let data = await getEvents(accessToken);
        setEvents(data.value);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  });

  return (
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
  );
};

export default Meetings;
