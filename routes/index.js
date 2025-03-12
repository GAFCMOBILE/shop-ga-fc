const express = require("express");
const router = express.Router();

const products = [
    {
		id: 1,
        name: "Gói Gcoin PUBG PC Siêu Rẻ",
        price: "134.000đ",
        image: "/images/gcoin.png"
    },
    {
		id: 2,
        name: "Split Fiction",
        price: "899.000đ",
        image: "/images/split-fiction.png"
    },
    {
		id: 3,
        name: "PUPG PC: Crafter Pass Spring Fest 2025",
        price: "325.000đ ~ 1.020.000đ",
        image: "/images/pubg-pass.png"
    },
    {
		id: 4,
        name: "Random Code Steam Product",
        price: "8.000đ ~ 8.000đ",
        image: "/images/steam-key.png"
    },
    {
		id: 5,
        name: "Gói Nạp Enigma of Sépia",
        price: "25.000đ ~ 2.150.000đ",
        image: "/images/enigma.png"
    },
    {
		id: 6,
        name: "Super Grok AI 1 tháng",
        price: "170.000đ ~ 499.000đ",
        image: "/images/grok-ai.png"
    }
];

router.get("/", (req, res) => {
    res.render("index", { title: "Trang chủ", products });
});


// Route chi tiết sản phẩm
router.get("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.render("product", { product });
    } else {
        res.status(404).send("Sản phẩm không tồn tại");
    }
});

// Xuất `router` và `products`
module.exports = router;
module.exports.products = products;

