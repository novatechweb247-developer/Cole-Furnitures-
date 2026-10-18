import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Admin access uses a deployment-only secret path plus a short-lived signed cookie.
// Configure ADMIN_SECRET_PATH and ADMIN_SESSION_SECRET only in the hosting environment.
const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const ADMIN_COOKIE = 'cole_admin_session';
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function createAdminSession(timestamp: number) {
  const payload = String(timestamp);
  const signature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET || '').update(payload).digest('hex');
  return payload + '.' + signature;
}

function isValidAdminSession(value: string | undefined) {
  if (!value || !ADMIN_SESSION_SECRET) return false;
  const [timestampText, signature] = value.split('.');
  const timestamp = Number(timestampText);
  if (!Number.isFinite(timestamp) || !signature || Date.now() - timestamp > ADMIN_SESSION_TTL_MS || timestamp > Date.now() + 60_000) return false;
  const expected = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(timestampText).digest('hex');
  const actualBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

app.use((req, res, next) => {
  if (ADMIN_SECRET_PATH && ADMIN_SESSION_SECRET && req.method === 'GET' && req.path === ADMIN_SECRET_PATH) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', ADMIN_COOKIE + '=' + createAdminSession(Date.now()) + '; HttpOnly; Path=/; SameSite=Strict; Max-Age=28800' + secure);
  }
  next();
});

// Guard all admin mutation endpoints, including uploads. Public read-only storefront requests remain public.
app.use('/api', (req, res, next) => {
  const adminMutation = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method) && /^\/(upload|products|categories|content|testimonials)(?:\/|$)/.test(req.path);
  if (!adminMutation) return next();
  const cookieHeader = req.headers.cookie || '';
  const sessionCookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(ADMIN_COOKIE + '='));
  const sessionValue = sessionCookie ? decodeURIComponent(sessionCookie.slice(ADMIN_COOKIE.length + 1)) : undefined;
  if (!isValidAdminSession(sessionValue)) return res.status(404).json({ error: 'Not found' });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data and uploads directories exist
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, "store.json");

// Default initial data
const initialData = {
  categories: [
    { id: "cat-1", name: "Living Room", description: "Sofas, armchairs, TV consoles, and center tables crafted for comfort and elegance.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200", sortOrder: 1 },
    { id: "cat-2", name: "Bedroom", description: "Exquisite bed frames, nightstands, and wardrobe solutions for serene personal spaces.", image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&q=80&w=1200", sortOrder: 2 },
    { id: "cat-3", name: "Dining & Kitchen", description: "Dining tables, upholstered chairs, and bespoke cabinetry built for family gatherings.", image: "https://images.unsplash.com/photo-1617806118233-18e1c0c6e2b3?auto=format&fit=crop&q=80&w=1200", sortOrder: 3 },
    { id: "cat-4", name: "Office & Study", description: "Executive desks, ergonomic seating, and professional shelving systems.", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200", sortOrder: 4 }
  ],
  products: [
    {
      id: "prod-1",
      name: "Royal Velvet Sectional Sofa",
      price: 650000,
      description: "A masterpiece of comfort and contemporary design. Upholstered in premium plush velvet with solid hardwood internal framing and high-density foam cushions. Designed for luxury living spaces.",
      categoryId: "cat-1",
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200"
      ],
      isFeatured: true,
      availability: "In Stock",
      sortOrder: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: "prod-2",
      name: "Executive Mahogany Office Desk",
      price: 420000,
      description: "Crafted from seasoned solid mahogany wood with a rich natural polish. Features spacious drawers, integrated cable management, and a commanding executive presence.",
      categoryId: "cat-4",
      images: [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200"
      ],
      isFeatured: true,
      availability: "In Stock",
      sortOrder: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: "prod-3",
      name: "Nordic 6-Seater Dining Set",
      price: 580000,
      description: "An elegant dining table paired with ergonomically contoured upholstered chairs. Combines Scandinavian minimalism with durable African hardwood construction.",
      categoryId: "cat-3",
      images: [
        "https://images.unsplash.com/photo-1617806118233-18e1c0c6e2b3?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1200"
      ],
      isFeatured: true,
      availability: "Made to Order",
      sortOrder: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: "prod-4",
      name: "Imperial King-Size Upholstered Bed",
      price: 750000,
      description: "Transform your bedroom into a sanctuary. Features a tufted headboard, robust slatted frame support, and premium fabric upholstery.",
      categoryId: "cat-2",
      images: [
        "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200"
      ],
      isFeatured: true,
      availability: "In Stock",
      sortOrder: 4,
      createdAt: new Date().toISOString()
    }
  ],
  content: {
    heroTitle: "Timeless Elegance & Bespoke Interior Design",
    heroSubtitle: "Welcome to Cole World Furniture & Interior Designs. Located in Jos, Plateau State, we craft and curate exquisite furniture pieces and transform residential and commercial interiors with unmatched craftsmanship.",
    aboutTitle: "About Cole World Furniture & Interior Designs",
    aboutText: "Cole World Furniture & Interior Designs is dedicated to bringing sophistication, comfort, and durability to homes and offices. Based at No. 10 St Saviour Avenue, Lendere Kabong, Jos, Plateau, Nigeria, we pride ourselves on exceptional woodworking, premium upholstery, and personalized interior styling tailored to our clients' unique tastes.",
    interiorDesignTitle: "Professional Interior Design & Spatial Planning",
    interiorDesignText: "We offer comprehensive interior design services for homes, corporate offices, hotels, and lounges. From initial spatial layout planning and 3D visualization to bespoke furniture fabrication and final styling, our team ensures every corner reflects elegance and functional harmony.",
    whyChooseUs: [
      { id: "w-1", title: "Master Craftsmanship", description: "Every piece is meticulously built by seasoned artisans using premium timber, durable metals, and high-grade fabrics." },
      { id: "w-2", title: "Bespoke Solutions", description: "We tailor dimensions, finishes, and fabrics to fit your exact interior architecture and personal style." },
      { id: "w-3", title: "Jos & Nationwide Reach", description: "Conveniently located at No. 10 St Saviour Avenue, Lendere Kabong, Jos, with reliable delivery and professional installation." }
    ],
    promo: {
      title: "Elevate Your Living Space Today",
      subtitle: "Explore our new collection of handcrafted luxury sofas, dining sets, and executive furniture. Contact us on WhatsApp for custom orders and interior consultations.",
      badge: "New Collection 2026",
      buttonText: "Shop Collection",
      buttonLink: "#shop",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
    },
    testimonials: [
      { id: "t-1", author: "Dr. & Mrs. Pam", location: "Jos, Plateau State", comment: "Cole World Furniture furnished our entire home with absolute precision. The quality of the wooden dining set and sectional sofa is world-class.", rating: 5 },
      { id: "t-2", author: "Barrister David", location: "Jos, Plateau State", comment: "The executive office desk I ordered was delivered and installed professionally. Exceptional craftsmanship and very polite service.", rating: 5 }
    ]
  },
  users: [],
  orders: []
};

function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return initialData;
  }
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'furniture-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// API Routes
app.get("/api/store", (req, res) => {
  const db = getDb();
  res.json(db);
});

// Upload endpoint
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Products CRUD
app.post("/api/products", (req, res) => {
  const db = getDb();
  const newProduct = {
    id: "prod-" + Date.now(),
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description,
    categoryId: req.body.categoryId,
    images: req.body.images || [],
    isFeatured: Boolean(req.body.isFeatured),
    availability: req.body.availability || "In Stock",
    sortOrder: Number(req.body.sortOrder) || db.products.length + 1,
    createdAt: new Date().toISOString()
  };
  db.products.push(newProduct);
  saveDb(db);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = getDb();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  const updated = {
    ...db.products[index],
    name: req.body.name !== undefined ? req.body.name : db.products[index].name,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
    description: req.body.description !== undefined ? req.body.description : db.products[index].description,
    categoryId: req.body.categoryId !== undefined ? req.body.categoryId : db.products[index].categoryId,
    images: req.body.images !== undefined ? req.body.images : db.products[index].images,
    isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : db.products[index].isFeatured,
    availability: req.body.availability !== undefined ? req.body.availability : db.products[index].availability,
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : db.products[index].sortOrder,
  };
  db.products[index] = updated;
  saveDb(db);
  res.json(updated);
});

app.delete("/api/products/:id", (req, res) => {
  const db = getDb();
  db.products = db.products.filter((p: any) => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Categories CRUD
app.post("/api/categories", (req, res) => {
  const db = getDb();
  const newCat = {
    id: "cat-" + Date.now(),
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    sortOrder: Number(req.body.sortOrder) || db.categories.length + 1
  };
  db.categories.push(newCat);
  saveDb(db);
  res.json(newCat);
});

app.put("/api/categories/:id", (req, res) => {
  const db = getDb();
  const index = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Category not found" });
  }
  const updated = {
    ...db.categories[index],
    name: req.body.name !== undefined ? req.body.name : db.categories[index].name,
    description: req.body.description !== undefined ? req.body.description : db.categories[index].description,
    image: req.body.image !== undefined ? req.body.image : db.categories[index].image,
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : db.categories[index].sortOrder,
  };
  db.categories[index] = updated;
  saveDb(db);
  res.json(updated);
});

app.delete("/api/categories/:id", (req, res) => {
  const db = getDb();
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Content Management
app.post("/api/content", (req, res) => {
  const db = getDb();
  db.content = {
    ...db.content,
    ...req.body
  };
  saveDb(db);
  res.json(db.content);
});

// Testimonials management
app.post("/api/testimonials", (req, res) => {
  const db = getDb();
  if (!db.content.testimonials) {
    db.content.testimonials = [];
  }
  const newTestimonial = {
    id: "t-" + Date.now(),
    author: req.body.author,
    location: req.body.location,
    comment: req.body.comment,
    rating: Number(req.body.rating) || 5
  };
  db.content.testimonials.push(newTestimonial);
  saveDb(db);
  res.json(newTestimonial);
});

app.delete("/api/testimonials/:id", (req, res) => {
  const db = getDb();
  if (db.content.testimonials) {
    db.content.testimonials = db.content.testimonials.filter((t: any) => t.id !== req.params.id);
    saveDb(db);
  }
  res.json({ success: true });
});

// Authentication Endpoints
app.post("/api/auth/signup", (req, res) => {
  const db = getDb();
  const { name, email, phone, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const newUser = {
    id: "user-" + Date.now(),
    name,
    email: email.toLowerCase(),
    phone: phone || "",
    password,
    favorites: [],
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDb(db);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
});

app.post("/api/auth/login", (req, res) => {
  const db = getDb();
  const { email, password } = req.body;
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Favorites Endpoints
app.get("/api/users/:id/favorites", (req, res) => {
  const db = getDb();
  const user = db.users.find((u: any) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ favorites: user.favorites || [] });
});

app.post("/api/users/:id/favorites", (req, res) => {
  const db = getDb();
  const user = db.users.find((u: any) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { productId } = req.body;
  if (!user.favorites) user.favorites = [];
  const idx = user.favorites.indexOf(productId);
  if (idx > -1) {
    user.favorites.splice(idx, 1);
  } else {
    user.favorites.push(productId);
  }
  saveDb(db);
  res.json({ favorites: user.favorites });
});

// Orders Endpoints
app.post("/api/orders", (req, res) => {
  const db = getDb();
  const { userId, customerName, email, phone, address, items, subtotal, total, paymentMethod } = req.body;
  const newOrder = {
    id: "ord-" + Date.now(),
    userId: userId || null,
    customerName,
    email,
    phone,
    address,
    items: items || [],
    subtotal: Number(subtotal),
    total: Number(total),
    paymentMethod: paymentMethod || 'whatsapp',
    paymentStatus: paymentMethod === 'paystack' ? 'pending' : 'success',
    paystackReference: null,
    createdAt: new Date().toISOString()
  };
  db.orders.push(newOrder);
  saveDb(db);
  res.json(newOrder);
});

app.get("/api/orders", (req, res) => {
  const db = getDb();
  const userId = req.query.userId as string;
  const email = req.query.email as string;
  let results = db.orders;
  if (userId) {
    results = results.filter((o: any) => o.userId === userId);
  } else if (email) {
    results = results.filter((o: any) => o.email?.toLowerCase() === email.toLowerCase());
  }
  res.json(results);
});

// Paystack Integration Endpoints
app.get("/api/paystack/pubkey", (req, res) => {
  res.json({ publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_b4bfa2804b4c7980b188092289c0deea1394d07d' });
});

app.post("/api/paystack/initialize", async (req, res) => {
  try {
    const { email, amount, orderData } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(400).json({ error: "Paystack secret key is not configured on server." });
    }
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        amount: Math.round(Number(amount) * 100),
        callback_url: req.headers.origin || "http://localhost:3000"
      })
    });
    const data = await response.json();
    if (!data.status) {
      return res.status(400).json({ error: data.message || "Failed to initialize Paystack transaction" });
    }

    const db = getDb();
    const newOrder = {
      id: "ord-" + Date.now(),
      userId: orderData.userId || null,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal),
      total: Number(orderData.total),
      paymentMethod: 'paystack',
      paymentStatus: 'pending',
      paystackReference: data.data.reference,
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    saveDb(db);

    res.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
      orderId: newOrder.id
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/paystack/verify", async (req, res) => {
  try {
    const { reference } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(400).json({ error: "Paystack secret key not configured" });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });
    const data = await response.json();

    const db = getDb();
    const order = db.orders.find((o: any) => o.paystackReference === reference);

    if (data.status && data.data.status === 'success') {
      if (order) {
        order.paymentStatus = 'success';
        saveDb(db);
      }
      return res.json({ success: true, order, data: data.data });
    } else {
      if (order) {
        order.paymentStatus = 'failed';
        saveDb(db);
      }
      return res.status(400).json({ success: false, message: "Payment verification failed or pending", data: data.data });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  app.use('/uploads', express.static(UPLOADS_DIR));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cole World Furniture server running on http://localhost:${PORT}`);
  });
}

startServer();
