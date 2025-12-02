// src/api.js

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Noir Heavyweight Tee",
    category: "T-Shirts",
    price: 55,
    description: "400gsm cotton, boxy fit, acid wash finish.",
    imageUrls: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"],
    stock: 20
  },
  {
    id: 2,
    name: "Vantablack Tech Jacket",
    category: "Outerwear",
    price: 220,
    description: "Water-resistant, multiple tactical pockets.",
    imageUrls: ["https://images.unsplash.com/photo-1551488852-7a09d38c44d5?w=800"],
    stock: 5
  },
  {
    id: 3,
    name: "Distressed Denim (Gold Stitch)",
    category: "Bottoms",
    price: 180,
    description: "Hand-distressed Japanese denim with 18k gold thread details.",
    imageUrls: ["https://images.unsplash.com/photo-1542272617-08f082287019?w=800"],
    stock: 12
  },
  {
    id: 4,
    name: "Oversized Hoodie 'ECLIPSE'",
    category: "Hoodies",
    price: 110,
    description: "Drop shoulder, french terry cotton.",
    imageUrls: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"],
    stock: 50
  },
  {
    id: 5,
    name: "Silk Bomber 'Kyoto'",
    category: "Outerwear",
    price: 350,
    description: "Limited edition silk embroidery.",
    imageUrls: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"],
    stock: 3
  },
  {
    id: 6,
    name: "Utility Cargo Vest",
    category: "Accessories",
    price: 85,
    description: "Functional streetwear utility vest.",
    imageUrls: ["https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800"],
    stock: 15
  }
];

// --- MOCK API FUNCTIONS ---
export const api = {
  getProducts: async () => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(PRODUCTS), 600);
    });
  },

  getProductById: async (id) => {
    return new Promise((resolve) => {
      const product = PRODUCTS.find(p => p.id === parseInt(id));
      setTimeout(() => resolve(product), 400);
    });
  },

  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Always simulate success
        resolve({
          id: 999,
          fullName: "Admin User",
          email: email,
          token: "fake-jwt-token"
        });
      }, 800);
    });
  }
};