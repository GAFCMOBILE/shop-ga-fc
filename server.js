const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware để xử lý dữ liệu POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Lưu trữ tạm thời sản phẩm trong RAM
let products = [
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


let orders = [];

// Cấu hình multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Trang chủ - Hiển thị danh sách sản phẩm
app.get('/', (req, res) => {
  res.render("index", { title: "Trang chủ", products });
  // res.render('index', { products: products });
});

// Trang quản trị - Thêm, sửa, xóa sản phẩm
app.get('/admin-products', (req, res) => {
  res.render('admin-products', { products: products });
});

const generateId = () => {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

app.post('/add-product', upload.single('image'), (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? '/images/' + req.file.filename : '';
  const id = generateId(); // Tạo ID không trùng lặp

  products.push({ id, name, price, image });

  res.redirect('/admin-products');
});


// Xử lý xóa sản phẩm
app.post('/delete-product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(product => product.id !== id);
  res.redirect('/admin-products');
});

// Xử lý sửa sản phẩm
app.post('/edit-product/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  const image = req.file ? '/images/' + req.file.filename : '';

  // Cập nhật thông tin sản phẩm
  products = products.map(product => {
    if (product.id === id) {
      return {
        id: product.id,
        name: name || product.name,
        price: price || product.price,
        image: image || product.image
      };
    }
    return product;
  });

app.get('/get-product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log("🔍 Đang tìm sản phẩm ID:", id); // Log kiểm tra ID
  const product = products.find(p => p.id === id);
  
  if (!product) {
    console.log("❌ Không tìm thấy sản phẩm!");
    return res.status(404).json({ error: "Sản phẩm không tồn tại" });
  }
  
  res.json(product);
});


  res.redirect('/admin-products');
});


// Route chi tiết sản phẩm
app.get("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.render("product", { product });
    } else {
        res.status(404).send("Sản phẩm không tồn tại");
    }
});




// === ROUTE QUẢN LÝ ĐƠN HÀNG ===
app.get('/admin-orders', (req, res) => {
  res.render('admin-orders', { orders });
});

app.post('/add-order', upload.single('receiptImage'), (req, res) => {
    const { loginMethod, phone, account, password, characterName, price, note } = req.body;
    const receiptImage = req.file ? '/images/' + req.file.filename : ''; // Lưu ảnh
    const id = orders.length + 1;

    // Tạo đơn hàng mới
    const newOrder = {
        id,
        loginMethod,
        phone,
        account,
        password,
        characterName,
        price,
        note,
        receiptImage,
        status: "Chờ xử lý" // Mặc định trạng thái chờ xử lý
    };

    orders.push(newOrder);
    res.redirect('/order-success'); // Điều hướng đến trang xác nhận thành công
});


app.post('/update-order/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  orders = orders.map(order => order.id === id ? { ...order, status } : order);
  res.redirect('/admin-orders');
});

app.get('/order-success', (req, res) => {
  res.render('order-success');
});


app.post("/update-order-status", async (req, res) => {
    try {
        const { id, status } = req.body;

        // Kiểm tra ID có hợp lệ không
        if (!ObjectId.isValid(id)) {
            return res.json({ success: false, error: "ID không hợp lệ" });
        }

        const result = await db.collection("orders").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        );

        if (result.modifiedCount > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: "Không tìm thấy đơn hàng hoặc trạng thái không thay đổi" });
        }
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.json({ success: false, error: error.message });
    }
});



// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
