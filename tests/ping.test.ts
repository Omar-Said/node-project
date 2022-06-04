import request from "supertest";
import express from "express";
import pingRoute from "../routes/ping";

const app = express();

app.use("/api/ping", pingRoute);

describe("ping route", () => {
  test("pinging api", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.statusCode).toBe(200);
  });
});
