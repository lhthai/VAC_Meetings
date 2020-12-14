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
  const events = await client
    .api("/me/events")
    .select("subject,organizer,start,end")
    .orderby("createdDateTime ASC")
    .get();

  return events;
};
