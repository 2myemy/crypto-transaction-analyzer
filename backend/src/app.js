"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const allowed = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://onchain-analyzer.netlify.app"
];
app.use((0, cors_1.default)({
    origin: allowed,
    credentials: true,
}));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api", analyze_1.default);
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map