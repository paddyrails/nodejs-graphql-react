const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');


mongoose.connect("mongodb://localhost:27017/eventgraphql", 
    { useNewUrlParser: true , useUnifiedTopology: true});

const Event = require('./models/event');
const User = require('./models/user');
const isAuth = require('./middleware/isAuth');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use(
    '/graphql', 
    graphqlhttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

mongoose.connection.on("open", function(ref) {
    console.log("Connected to mongo server.");
  });

app.listen(3000);