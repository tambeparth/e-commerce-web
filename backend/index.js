const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb://localhost:27017/e-commerce").then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
    console.log("Note: Make sure MongoDB is running locally or update the connection string");
});

// API creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint For Images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Creating Product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    tags: [String],
    sizes: [String],
    colors: [String]
});

// Schema for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
        default: {},
    },
    wishlist: {
        type: Array,
        default: [],
    },
    orders: [{
        orderId: String,
        items: Array,
        total: Number,
        date: { type: Date, default: Date.now },
        status: { type: String, default: "pending" }
    }],
    date: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to fetch user
const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ errors: "Please authenticate with a valid token" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Invalid token, authentication failed" });
        }
    }
};

// Product endpoints
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            description: req.body.description || "",
            tags: req.body.tags || [],
            sizes: req.body.sizes || [],
            colors: req.body.colors || []
        });

        await product.save();
        console.log("Product saved");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Product removed");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products Fetched");
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(-8);
        console.log("NewCollection Fetched");
        res.send(newcollection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.get('/popularinwomen', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular_in_women = products.slice(0, 4);
        console.log("Popular in women fetched");
        res.send(popular_in_women);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// Search and filter endpoints
app.get('/search', async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, sortBy } = req.query;
        let filter = {};

        // If there's a search query, add text search
        if (query && query.trim() && query !== 'undefined') {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.new_price = {};
            if (minPrice) filter.new_price.$gte = Number(minPrice);
            if (maxPrice) filter.new_price.$lte = Number(maxPrice);
        }

        let products = await Product.find(filter);

        // Sort products
        if (sortBy) {
            switch (sortBy) {
                case 'price_low':
                    products.sort((a, b) => a.new_price - b.new_price);
                    break;
                case 'price_high':
                    products.sort((a, b) => b.new_price - a.new_price);
                    break;
                case 'rating':
                    products.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                default:
                    // Default sort by newest
                    products.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        }

        console.log(`Search query: "${query || 'none'}", filters: ${JSON.stringify({ category, minPrice, maxPrice, sortBy })}, results: ${products.length}`);
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// User authentication endpoints
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email id" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });

        if (user) {
            const passCompare = req.body.password === user.password;

            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };

                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong Email Id" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// Cart endpoints
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log("Added", req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id });
        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        console.log("Removed", req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0)
            userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    try {
        console.log("GetCart");
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// Wishlist endpoints
app.post('/addtowishlist', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData.wishlist.includes(req.body.itemId)) {
            userData.wishlist.push(req.body.itemId);
            await Users.findOneAndUpdate({ _id: req.user.id }, { wishlist: userData.wishlist });
        }
        res.json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/removefromwishlist', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        userData.wishlist = userData.wishlist.filter(id => id !== req.body.itemId);
        await Users.findOneAndUpdate({ _id: req.user.id }, { wishlist: userData.wishlist });
        res.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

app.post('/getwishlist', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// Review endpoints
app.post('/addreview', fetchUser, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        let userData = await Users.findOne({ _id: req.user.id });

        let product = await Product.findOne({ id: productId });
        product.reviews.push({
            user: userData.name,
            rating: rating,
            comment: comment
        });

        // Calculate average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / product.reviews.length;

        await product.save();
        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// Initialize sample data
const initializeSampleData = async () => {
    try {
        const existingProducts = await Product.find({});
        if (existingProducts.length === 0) {
            console.log("Adding sample products...");

            const sampleProducts = [
                {
                    id: 1,
                    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
                    image: "https://via.placeholder.com/300x400/ff4141/ffffff?text=Product+1",
                    category: "women",
                    new_price: 50,
                    old_price: 80,
                    description: "Beautiful striped blouse perfect for casual and formal occasions",
                    rating: 4.5,
                    tags: ["blouse", "women", "striped", "casual"],
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["Red", "Blue", "White"]
                },
                {
                    id: 2,
                    name: "Men's Regular Fit Cotton Shirt",
                    image: "https://via.placeholder.com/300x400/4169e1/ffffff?text=Product+2",
                    category: "men",
                    new_price: 45,
                    old_price: 65,
                    description: "Comfortable cotton shirt for everyday wear",
                    rating: 4.2,
                    tags: ["shirt", "men", "cotton", "regular"],
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    colors: ["Blue", "White", "Black"]
                },
                {
                    id: 3,
                    name: "Kids Colorful T-Shirt",
                    image: "https://via.placeholder.com/300x400/32cd32/ffffff?text=Product+3",
                    category: "kid",
                    new_price: 25,
                    old_price: 35,
                    description: "Fun and colorful t-shirt for kids",
                    rating: 4.8,
                    tags: ["t-shirt", "kids", "colorful", "fun"],
                    sizes: ["XS", "S", "M", "L"],
                    colors: ["Green", "Yellow", "Pink"]
                },
                {
                    id: 4,
                    name: "Women's Elegant Evening Dress",
                    image: "https://via.placeholder.com/300x400/800080/ffffff?text=Product+4",
                    category: "women",
                    new_price: 120,
                    old_price: 180,
                    description: "Elegant dress perfect for evening events",
                    rating: 4.7,
                    tags: ["dress", "women", "elegant", "evening"],
                    sizes: ["S", "M", "L"],
                    colors: ["Purple", "Black", "Navy"]
                },
                {
                    id: 5,
                    name: "Men's Casual Jeans",
                    image: "https://via.placeholder.com/300x400/4682b4/ffffff?text=Product+5",
                    category: "men",
                    new_price: 60,
                    old_price: 90,
                    description: "Comfortable casual jeans for everyday wear",
                    rating: 4.3,
                    tags: ["jeans", "men", "casual", "denim"],
                    sizes: ["30", "32", "34", "36", "38"],
                    colors: ["Blue", "Black", "Gray"]
                },
                {
                    id: 6,
                    name: "Kids Summer Shorts",
                    image: "https://via.placeholder.com/300x400/ffa500/ffffff?text=Product+6",
                    category: "kid",
                    new_price: 20,
                    old_price: 30,
                    description: "Comfortable shorts for summer activities",
                    rating: 4.4,
                    tags: ["shorts", "kids", "summer", "comfortable"],
                    sizes: ["XS", "S", "M"],
                    colors: ["Orange", "Blue", "Green"]
                },
                {
                    id: 7,
                    name: "Women's Casual Sneakers",
                    image: "https://via.placeholder.com/300x400/ff69b4/ffffff?text=Product+7",
                    category: "women",
                    new_price: 75,
                    old_price: 100,
                    description: "Stylish and comfortable sneakers for daily wear",
                    rating: 4.6,
                    tags: ["sneakers", "women", "casual", "comfortable"],
                    sizes: ["6", "7", "8", "9", "10"],
                    colors: ["Pink", "White", "Black"]
                },
                {
                    id: 8,
                    name: "Men's Formal Blazer",
                    image: "https://via.placeholder.com/300x400/2f4f4f/ffffff?text=Product+8",
                    category: "men",
                    new_price: 150,
                    old_price: 220,
                    description: "Professional blazer for business occasions",
                    rating: 4.5,
                    tags: ["blazer", "men", "formal", "business"],
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["Navy", "Black", "Gray"]
                }
            ];

            for (const productData of sampleProducts) {
                const product = new Product(productData);
                await product.save();
            }

            console.log("Sample products added successfully!");
        } else {
            console.log("Products already exist in database");
        }
    } catch (error) {
        console.error("Error initializing sample data:", error);
    }
};

app.listen(port, (err) => {
    if (!err) {
        console.log("Server Running on Port " + port);
        // Initialize sample data after server starts
        initializeSampleData();
    } else {
        console.log("Error: " + err);
    }
});
