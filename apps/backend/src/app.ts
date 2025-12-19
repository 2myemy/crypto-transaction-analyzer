import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze";

const app = express();
const PORT = 4000;

const allowed = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://onchain-analyzer.netlify.app"
];

app.use(
  cors({
    origin: allowed,
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api", analyzeRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
