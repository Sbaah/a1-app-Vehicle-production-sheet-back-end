//  Sefa Baah - Acheamphour student#: 015381130
// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");
const m = manager(
  "mongodb+srv://A_db1:A_db1@assignment1-oenmq.mongodb.net/db-a1?retryWrites=true&w=majority"
);

// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Get resources available in this web API
app.get("/api", (req, res) => {
  const links = [];
  links.push({ rel: "collection", href: "/api/vehicles", methods: "GET" });
  links.push({ rel: "collection", href: "/api/vehicle", methods: "POST" });
  links.push({
    rel: "collection",
    href: "/api/vehicle/:id",
    methods: "GET,PUT,DELETE"
  });
  const linkObject = {
    apiName: "BTI 425 - Assignment 1",
    apiDescription: "Node Webservice",
    apiVersion: "1.0",
    apiAuthor: "Sefa Baah - Acheamphour",
    links: links
  };
  res.json(linkObject);
});

// ################################################################################
// Request handlers for data entities (listeners)

// Get all
app.get("/api/vehicles", (req, res) => {
  // Call the manager method
  m.vehicleGetAll()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: error
      });
    });
});

// Get one
app.get("/api/vehicle/:vehicleId", (req, res) => {
  // Call the manager method
  m.vehicleGetById(req.params.vehicleId)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({
        message: "Resource not found"
      });
    });
});

// Add new
app.post("/api/vehicle", (req, res) => {
  // Call the manager method
  m.vehicleAdd(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: error
      });
    });
});

// Edit existing
app.put("/api/vehicle/:vehicleId", (req, res) => {
  // Call the manager method
  m.vehicleEdit(req.params.id, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// Delete item
app.delete("/api/vehicle/:vehicleId", (req, res) => {
  // Call the manager method
  m.vehicleDelete(req.params.vehicleId)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({
        message: "Resource not found"
      });
    });
});

// ################################################################################
// Resource not found (this should be at the end)

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// Step 3
// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("a1-app/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "a1-app", "build", "index.html"));
  });
}

// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Ready to handle requests on port " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
