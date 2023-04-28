require("dotenv").config();

const cors = require("cors");
const timeout = require("connect-timeout");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const express = require("express");
const router = require("./app/routers");
const port = process.env.PORT || 3000;
const app = express();


//url encoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: '*',
  credentials: true,
  methods: 'GET, POST, PATCH, DELETE',
  allowedHeaders: '*'

}));

//helmet
app.use(helmet());

//timeout
app.use(timeout("1m"));
app.use(function(req, res, next){
  if (!req.timedout) next();
});

app.use(router);

app.listen(port, () => {
  console.log(`Server ready: http://localhost:${port}`);
});









