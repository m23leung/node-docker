const express = require("express")
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");

const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require("./config/config");

let RedisStore = require("connect-redis").default
const redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}`})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL)
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();

redisClient.connect().catch(console.error)

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    saveUninitialized: true, // allows cookie to show up
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3000000, // in ms
    },
}))

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hi There KOKO</h2>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.port || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))
