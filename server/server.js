const express = require('express');
// import apolloserver
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const path = require('path');

//import our typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
//create a new apollo server
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: authMiddleware
});


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// create a new instance of Apollo server with graphQL schema
const startApolloServer = async(typeDefs, resolvers) => {
  await server.start();
  //integrate apollo server with express app as middleware
  server.applyMiddleware({ app });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can test gql api
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

//call the async function to start
startApolloServer(typeDefs, resolvers);
