const express = require("express");
const path = require("path");
const validUrl = require("valid-url");
const mongoose = require("mongoose");
const hash = require("./hash");
const linkSchema = require("./linkSchema");
const { query, response } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || "localhost:3000/";
const password = process.env.PASSWORD || process.argv[2];

const urlMongo = `mongodb+srv://fullstack:${password}@cluster0-4pzo8.mongodb.net/tiny?retryWrites=true`;
mongoose.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
const Link = mongoose.model("Link", linkSchema);

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/:suspect(*)", (req, res) => {
  if (validUrl.isUri(req.params.suspect)) {
    const hashString = hash(req.params.suspect);
    const success = {
      "full url": req.params.suspect,
      "short url": url + hashString,
    };
    const link = new Link({
      fullUrl: req.params.suspect,
      shortUrl: url + hashString,
    });

    link.save().then((result) => {
      console.log("link saved!");
    });

    res.json(success);
  } else {
    const error = { error: "not a valid url" };
    res.json(error);
  }
});

app.get("/:hashCode", async (req, res) => {
  try {
    const link = await Link.findOne({ shortUrl: url + req.params.hashCode });

    if (link) {
      return res.redirect(link.fullUrl);
    } else {
      return res.status(404).json("No url found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

app.listen(port, () => console.log("running"));
