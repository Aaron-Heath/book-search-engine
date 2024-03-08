const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const app = express();
const PORT = process.env.PORT || 3001;

const startApollogServer = async() => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Important for MERN Setup: Any client-side requests that begin with '/graphql' will be handled by our Apollo Server
  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApollogServer();



