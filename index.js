const express = require("express")
const mongoose = require("mongoose");
const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER } = require("./config/config");

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

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hi There KOKO</h2>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.port || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))
