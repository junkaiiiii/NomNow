"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const menu_1 = __importDefault(require("../dist/routes/menu"));
const orders_1 = __importDefault(require("../dist/routes/orders"));
const restaurant_1 = __importDefault(require("../dist/routes/restaurant"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/menu", menu_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/restaurant", restaurant_1.default);
// Health check
app.get("/", (_req, res) => {
    res.json({ message: "NomNow API is running 🍽️" });
});
app.listen(PORT, () => {
    console.log(`NomNow backend running on http://localhost:${PORT}`);
});
