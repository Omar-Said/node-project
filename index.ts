import express from "express";
import postRoute from "./routes/posts";
import pingRoute from "./routes/ping";
const app = express();
const port = 3000;

app.use("/api/ping", pingRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
