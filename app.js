const express = require("express")
const dotenv = require("dotenv")
const session = require('express-session');
const passport = require('passport');
const path = require("path");
const cors = require("cors")

dotenv.config()

const morgan = require("morgan")
const connectDb = require("../src/db/db")
const app = express()
const signup = require("../src/routes/signup.routes")

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(session({ secret: 'your secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send('<a href="/auth/google"> Continue with google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', successRedirect: '/dashboard' }),
  (req, res) => {
    res.redirect('/');
  }
);
app.get("/dashboard", (req, res) => {
  res.send("hello")
})

app.use("/api/v1", signup)




const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`We are on: 🚀 ${process.env.NODE_ENV}`);
  console.log(`Server is running on port ${port}`)
  connectDb()
})