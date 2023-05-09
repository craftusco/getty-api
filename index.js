const express = require("express");
const session = require("express-session");
const app = express();
const knex = require("./config/db");
const { logMessage } = require("./api/logs");
const startCronJobs = require("./cron");

// add session middleware
app.use(
  session({
    secret: "gettySecret", // You should replace this with your own secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, unset: "destroy" }, // set this to true if using HTTPS
  })
);

// Require the Getty library
const {
  getCountImages,
  getLocalCount,
  getCurrentUser,
  retrieveGettyImagesData,
  retrieveGettyUri,
  retrieveGettyMeta,
} = require("./api/getty");
const { uploadImages, testUpload } = require("./api/cloudinary");
const { getBearerToken } = require("./api/auth.getty");

// Middleware to add the Getty access token to each request
app.use(async (req, res, next) => {
  req.token = await getBearerToken(req);
  /* dynamic URL */
  global.currentUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  next();
});

app.get("/user", async (req, res) => {
  //console.log(req.session); // Add this line
  //const token = await getBearerToken(req);
  const currentUser = await getCurrentUser(req);
  res.json({
    token: req.token,
    currentUser: currentUser ?? null,
  });
});

// Define cron job outside of the endpoint handler
app.get("/", async (req, res) => {
  try {
    // get count from localhost
    const local = await getLocalCount();
    //console.log('local', local);
    // Get count from Getty
    const gettyCount = await getCountImages(req);

    /* Check if Getty count is greater than local count */
    if (gettyCount > local?.total_local_images) {
      const refresh = await retrieveGettyImagesData(req);
    }

    res.json({
      total_getty_images: gettyCount,
      ...local,
    });
    logMessage("Success refresh files");
  } catch (error) {
    console.error("Error getting count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* Route Sync Images */
app.post("/upload", async (req, res) => {
  try {
    const updateMETA = await retrieveGettyMeta(req);
    const updateURI = await retrieveGettyUri(req);

    const uplodaProcess = await uploadImages(req);

    res.json({ success: true, message: "Images downloaded successfully" });
  } catch (error) {
    logMessage("Error uploading images:");
    console.error("Error uploading images:", error);
    res.status(500).json("Error uploading images");
  }
});

/* Route Logs */
app.get("/logs", async (req, res) => {
  try {
    const data = await knex("getty_logs").orderBy("id", "desc");
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* Route Test */
app.post("/test", async (req, res) => {
  testUpload();
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  startCronJobs();
});
