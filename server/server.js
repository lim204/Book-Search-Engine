const express = require('express');
const path = require('path');
// setting apolloserver
const {ApolloServer} = require ('apollo-server-express');

// setting authentification and token
const {authMiddleware} = require ('./utils/auth');


// uncomment type and resolvers when files are done
const {typeDefts, resolvers} = require ('./schemas');
const db = require('./config/connection');

// uncomment routes since we would use them anymore
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefts,
  resolvers,
  context: authMiddleware,
});

// before pushing change it to true
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'));
})

// uncomment routes
// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer();