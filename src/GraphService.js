import moment from "moment";
const graph = require("@microsoft/microsoft-graph-client");

const getAuthenticatedClient = (accessToken) => {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    },
  });

  return client;
};

export const getUserDetails = async (accessToken) => {
  const client = getAuthenticatedClient(accessToken);
  const user = await client.api("/me").get();

  return user;
};

export const getEvents = async (accessToken) => {
  const client = getAuthenticatedClient(accessToken);
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 2);
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 999);

  const events = await client
    .api("/me/calendarview")
    .query({
      startDateTime: startTime.toUTCString(),
      endDateTime: endTime.toUTCString(),
    })
    .select("subject,organizer,start,end")
    .orderby("createdDateTime ASC")
    .get();

  return events;
};
