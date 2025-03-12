const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Import routes
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const productRoutes = require("./routes/index"); // ✅ Nhận đúng Router
const { products } = require("./routes/index"); // ✅ Nhận danh sách sản phẩm

app.use("/", productRoutes); // ✅ Đúng, vì productRoutes là một Router



