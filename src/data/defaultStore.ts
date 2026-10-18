export const defaultStoreData = {
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
  }
};
