import request from "supertest";
import express from "express";
import postRoute from "../routes/posts";

const app = express();

app.use("/api/posts", postRoute);

describe("posts route", () => {
  test("getting posts", async () => {
    const res = await request(app).get(
      "/api/posts?tags=tech&sortBy=id&direction=desc"
    );
    expect(res.statusCode).toBe(200);
  });
});
