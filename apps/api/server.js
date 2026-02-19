const express = require("express");
const app = express();

app.use(express.json({
    limit: "10mb",
}));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "api",
    message: "hello from swarm + traefik",
    time: new Date().toISOString(),
  });
});

app.get("/error", (req, res) => {
    res.status(500).json({
        ok: false,
        service: "api",
        message: "this is an error endpoint",
        time: new Date().toISOString(),
    });
});

app.get("/slow", (req, res) => {
    setTimeout(() => {
        res.json({
            ok: true,
            service: "api",
            message: "this is a slow endpoint",
            time: new Date().toISOString(),
        });
    }, 5000);
});

app.get("/json", (req, res) => {
    res.json({
        ok: true,
        service: "api",
        message: "this is a json endpoint",
        time: new Date().toISOString(),
    });
});

app.get("/text", (req, res) => res.send("this is a text endpoint"));

app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(3000, () => console.log("API listening on :3000"));
