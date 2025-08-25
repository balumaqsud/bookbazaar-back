import mongoose from "mongoose";
import dotenv from "dotenv";
import server from "./app";
import path from "path";
mongoose.set("strictQuery", false);
const envPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === "production" ? "../.env.production" : "../.env"
);
console.log("Loading env file:", envPath);
dotenv.config({
  path: envPath,
});

//env variables
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("process.env.PORT after dotenv:", process.env.PORT);

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT ?? 3004
    : process.env.PORT ?? 3000;
console.log("Final PORT:", PORT);

const MONGO_URL = process.env.MONGO_URL;

//mongo connection with mongoose
mongoose
  .connect(MONGO_URL as string, {})
  .then((data) => {
    console.log("mongo db is successfully connected");
    server.listen(PORT, () => {
      console.log(`app is running in port ${PORT}`);
      console.log(`http://localhost:${PORT}/admin`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
