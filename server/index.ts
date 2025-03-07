import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// For different domains when deployed
app.use(cors());

app.get("/", (req, res) => {
  console.log("Root route request received.");
  res.send({ message: "Hello from the backend!" });
});

app.listen(port, () => {
  console.log("Server is running!");
});
