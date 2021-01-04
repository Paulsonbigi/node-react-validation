const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dbConfig = require("./config/key")
const passport = require("passport")

const users = require("./routes/api/users")

const app = express();

// BodyParser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
app.use(bodyParser.json());

// DB Config
const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
mongoose.connect(uri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected successfully")
})
.catch(() => {
    console.log("Database unable to connect")
})

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

//routes
app.use("/api/users", users)
app.get("/", (req, res) => {
    res.send("Hello It is a new year")
})

// port connection
const PORT = process.env.PORT || 8040
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})