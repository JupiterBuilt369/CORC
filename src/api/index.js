// File: src/api/index.js

const PRODUCTS = [
  { id: 1, name: "Noir Heavyweight Tee", category: "T-Shirts", price: 55, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800" },
  { id: 2, name: "Vantablack Tech Jacket", category: "Outerwear", price: 220, image: "https://images.unsplash.com/photo-1551488852-7a09d38c44d5?w=800" },
  { id: 3, name: "Gold Stitch Denim", category: "Bottoms", price: 180, image: "https://images.unsplash.com/photo-1542272617-08f082287019?w=800" },
  { id: 4, name: "Eclipse Hoodie", category: "Hoodies", price: 110, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800" },
  { id: 5, name: "Kyoto Silk Bomber", category: "Outerwear", price: 350, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" },
  { id: 6, name: "Utility Vest", category: "Accessories", price: 85, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800" }
];

export const api = {
  // 1. Get All Products (This was missing in your snippet!)
  getProducts: () => new Promise(resolve => {
    setTimeout(() => resolve(PRODUCTS), 500);
  }),

  // 2. Get Single Product
  getProductById: (id) => new Promise(resolve => {
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    setTimeout(() => resolve(product), 400);
  }),

  // 3. Login
  login: (email) => new Promise(resolve => {
    setTimeout(() => resolve({ name: "Admin User", email }), 800);
  }),

  // 4. Get Orders (For Profile Page)
  getOrders: () => new Promise(resolve => {
    setTimeout(() => resolve([
      {
        id: "ORD-7782",
        date: "Feb 14, 2025",
        total: 235,
        status: "Processing",
        items: [
          { name: "Vantablack Tech Jacket", image: "https://images.unsplash.com/photo-1551488852-7a09d38c44d5?w=200" }
        ]
      },
      {
        id: "ORD-5521",
        date: "Jan 22, 2025",
        total: 55,
        status: "Delivered",
        items: [
          { name: "Noir Heavyweight Tee", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200" }
        ]
      }
    ]), 600);
  })
};