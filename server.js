const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// 🧭 Serve static files (frontend)
const staticPath = path.join(__dirname, "WT_Project");
app.use(express.static(staticPath));

// 🧩 Middleware for parsing form and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(staticPath, "contact.html"));
});

// ✅ Handle contact form submissions
app.post("/contact", (req, res) => {
  console.log("📩 Received form data:", req.body);

  // You can later save this data into a database or file
  res.send(`
    <h2>✅ Thank you, ${req.body.name || "User"}!</h2>
    <p>Your message has been received successfully.</p>
    <a href="/">Go Back Home</a>
  `);
});

// 🚀 Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
