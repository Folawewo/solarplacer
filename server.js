const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 

app.use(cors());
app.use(express.static("public"));

app.get("/solar", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      res
        .status(400)
        .json({ message: "Missing latitude or longitude in request" });
      return;
    }
    const apiKey = process.env.API_KEY; 
    const response = await axios.get(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`
    );
    if (!response.data || !response.data.solarDetails) {
      res.status(404).json({ message: "Solar details not found" });
      return;
    }
    res.json(response.data);
  } catch (error) {
    console.error(error);
    if (error.message === "socket hang up") {
      res.status(503).json({ message: "Service unavailable" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server running on port ${port}`));
