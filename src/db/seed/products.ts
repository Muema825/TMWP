// src/db/seed/products.ts

import { db } from "~/db";
import { productsTable } from "~/db/schema/orders/tables";
import type { NewProduct } from "~/db/schema/orders/types";

// Generate consistent IDs
const generateProductId = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

const products: NewProduct[] = [
  // Water Tanks
  {
    id: generateProductId("3000L Rainwater Harvesting Tank"),
    name: "3000L Rainwater Harvesting Tank",
    description: "Perfect for medium-sized families. One-piece, seamless tank molded from 100% Food and Drug Administration (FDA) approved material. Will not rust or impart any taste. The corrugated body allows it to stand upright making it more durable and easy to use.",
    category: "Water Tanks",
    capacity: 3000,
    cashPrice: "19500",
    hirePurchaseDeposit: "5000",
    hirePurchaseMonthly: "1300",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    inStock: true,
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Corrugated body for extra durability",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    specifications: JSON.stringify({
      capacity: "3000 Liters",
      material: "100% FDA approved polymer",
      construction: "One-piece seamless",
      warranty: "5 years",
      color: "Blue/Green",
      weight: "35kg (empty)",
      dimensions: "180cm (H) x 145cm (Diameter)",
    }),
    isActive: true,
  },
  {
    id: generateProductId("5000L Rainwater Storage Tank"),
    name: "5000L Rainwater Storage Tank",
    description: "Ideal for larger families or small businesses. This 5000L tank is molded from 100% FDA approved material ensuring your water stays clean and safe. The robust corrugated design ensures maximum durability while the seamless construction prevents leaks.",
    category: "Water Tanks",
    capacity: 5000,
    cashPrice: "25,000",
    hirePurchaseDeposit: "7000",
    hirePurchaseMonthly: "1500",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    inStock: true,
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Corrugated body for superior strength",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    specifications: JSON.stringify({
      capacity: "5000 Liters",
      material: "100% FDA approved polymer",
      construction: "One-piece seamless",
      warranty: "5 years",
      color: "Blue/Black",
      weight: "55kg (empty)",
      dimensions: "210cm (H) x 170cm (Diameter)",
    }),
    isActive: true,
  },
  {
    id: generateProductId("10,000L Large Capacity Tank"),
    name: "10,000L Large Capacity Tank",
    description: "Our largest capacity tank for extended families, schools, or commercial use. The 10000L tank features the same FDA-approved construction as our smaller tanks but with enhanced structural support for the larger volume. Perfect for water security in areas with unreliable water supply.",
    category: "Water Tanks",
    capacity: 10000,
    cashPrice: "49,500",
    hirePurchaseDeposit: "8000",
    hirePurchaseMonthly: "3000",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    inStock: true,
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Reinforced corrugated body",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    specifications: JSON.stringify({
      capacity: "10,000 Liters",
      material: "100% FDA approved polymer",
      construction: "One-piece seamless with reinforcement",
      warranty: "7 years",
      color: "Black/Green",
      weight: "95kg (empty)",
      dimensions: "270cm (H) x 230cm (Diameter)",
    }),
    isActive: true,
  },
  
  // Purification Systems
  {
    id: generateProductId("8-Layer Tap Water Purifier"),
    name: "8-Layer Tap Water Purifier",
    description: "Our signature 8-layer purification system removes 99.9% of contaminants including bacteria, viruses, and heavy metals. Designed specifically for rainwater and tap water, ensuring your family drinks safe, clean water every day.",
    category: "Purification Systems",
    capacity: null,
    cashPrice: "12,000",
    hirePurchaseDeposit: null,
    hirePurchaseMonthly: null,
    hirePurchasePeriod: null,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80",
    inStock: true,
    features: [
      "8-stage filtration process",
      "Removes bacteria and viruses (99.9%)",
      "Heavy metal filtration",
      "Mineral retention technology",
      "Easy filter replacement",
      "Low maintenance design",
    ],
    specifications: JSON.stringify({
      capacity: "Up to 1000L per day",
      filtrationLayers: "8 layers (sediment, carbon, ceramic, UV, mineral)",
      filterLife: "6-12 months (replaceable)",
      installation: "Wall-mounted or countertop",
      warranty: "3 years",
      dimensions: "45cm (H) x 25cm (W) x 15cm (D)",
    }),
    isActive: true,
  },
  {
    id: generateProductId("Advanced UV Water Filter"),
    name: "Advanced UV Water Filter",
    description: "Advanced UV purification technology for maximum protection. This system uses ultraviolet light to destroy harmful microorganisms without chemicals, perfect for households with young children or elderly members.",
    category: "Purification Systems",
    capacity: null,
    cashPrice: "18000",
    hirePurchaseDeposit: null,
    hirePurchaseMonthly: null,
    hirePurchasePeriod: null,
    imageUrl: "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?w=800&q=80",
    inStock: true,
    features: [
      "UV-C sterilization technology",
      "Chemical-free purification",
      "Automatic flow sensor activation",
      "Low energy consumption",
      "Digital display with filter alerts",
      "Annual UV bulb replacement",
    ],
    specifications: JSON.stringify({
      capacity: "Up to 2000L per day",
      technology: "UV-C + Carbon filtration",
      powerConsumption: "40W",
      uvBulbLife: "12 months",
      warranty: "3 years",
      dimensions: "55cm (H) x 30cm (W) x 20cm (D)",
    }),
    isActive: true,
  },
  
  // Complete Systems
  {
    id: generateProductId("3,000L Complete Water System"),
    name: "3000L Complete Water System",
    description: "Everything you need in one package. This complete system includes our 3000L FDA-approved tank, 8-layer purifier, guttering connection kit, and professional installation.",
    category: "Complete Systems",
    capacity: 3000,
    cashPrice: "28,500",
    hirePurchaseDeposit: "6,000",
    hirePurchaseMonthly: "1,700",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1583266722259-2d6f3d8e65?w=800&q=80",
    inStock: true,
    features: [
      "3,000L FDA-approved tank included",
      "8-layer purification system",
      "Complete gutter collection kit",
      "Tank stand and base",
      "All plumbing connections",
      "Professional installation included",
    ],
    specifications: JSON.stringify({
      tankCapacity: "3,000 Liters",
      purifier: "8-layer system",
      installation: "Free professional installation nationwide",
      warranty: "5 years comprehensive",
      includes: "Tank, Purifier, Guttering, Stand, Installation",
    }),
    isActive: true,
  },
  {
    id: generateProductId("5,000L Premium Package"),
    name: "5000L Premium Package",
    description: "Our premium package for families who want the best. Includes our 5000L FDA-approved tank, advanced UV purifier, premium guttering system, and enhanced overflow management.",
    category: "Complete Systems",
    capacity: 5000,
    cashPrice: "35,000",
    hirePurchaseDeposit: "8,000",
    hirePurchaseMonthly: "2,000",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=80",
    inStock: true,
    features: [
      "5000L FDA-approved tank",
      "Advanced UV purification",
      "Premium gutter collection system",
      "Automated overflow management",
      "Water level monitoring",
      "Priority maintenance support",
    ],
    specifications: JSON.stringify({
      tankCapacity: "5,000 Liters",
      purifier: "UV + Carbon system",
      installation: "Free professional installation + training nationwide",
      warranty: "5 years comprehensive",
      includes: "Tank, UV Purifier, Premium Guttering, Monitoring, Installation",
    }),
    isActive: true,
  },
  {
    id: generateProductId("10,000L Family System"),
    name: "10,000L Family System",
    description: "The ultimate water solution for large families, schools, or small businesses. This package includes our massive 10000L FDA-approved tank, advanced purification systems, and professional-grade installation.",
    category: "Complete Systems",
    capacity: 10000,
    cashPrice: "59500",
    hirePurchaseDeposit: "10000",
    hirePurchaseMonthly: "3500",
    hirePurchasePeriod: 18,
    imageUrl: "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80",
    inStock: true,
    features: [
      "10,000L FDA-approved tank",
      "Dual purification systems",
      "Commercial-grade guttering",
      "Advanced monitoring system",
      "Backup overflow protection",
      "Extended warranty coverage",
    ],
    specifications: JSON.stringify({
      tankCapacity: "10,000 Liters",
      purifier: "Dual system (8-layer + UV)",
      installation: "Free professional installation + training nationwide",
      warranty: "7 years comprehensive",
      includes: "Tank, Dual Purifiers, Commercial Guttering, Monitoring, Installation",
    }),
    isActive: true,
  },
  
  // Accessories
  {
    id: generateProductId("Tank Stand & Base Kit"),
    name: "Tank Stand & Base Kit",
    description: "Sturdy steel stand for elevated tank installation. Ensures proper water pressure and protects your tank from ground moisture. Includes all mounting hardware and concrete anchoring bolts.",
    category: "Accessories",
    capacity: null,
    cashPrice: "6,500",
    hirePurchaseDeposit: null,
    hirePurchaseMonthly: null,
    hirePurchasePeriod: null,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    inStock: true,
    features: [
      "Heavy-duty steel construction",
      "Corrosion-resistant coating",
      "Includes concrete base kit",
      "Suitable for tanks up to 5000L",
      "Easy assembly design",
      "Professional installation recommended",
    ],
    specifications: JSON.stringify({
      material: "Galvanized steel",
      loadCapacity: "6,000kg",
      suitableFor: "3,000L and 5000L tanks",
      warranty: "3 years",
      includes: "Stand, Bolts, Anchors, Assembly Hardware",
    }),
    isActive: true,
  },
  {
    id: generateProductId("Gutter Collection System"),
    name: "Gutter Collection System",
    description: "Professional-grade guttering system designed to maximize rainwater collection. Includes downpipes, leaf guards, and first-flush diverter to ensure only clean water enters your tank.",
    category: "Accessories",
    capacity: null,
    cashPrice: "9,500",
    hirePurchaseDeposit: null,
    hirePurchaseMonthly: null,
    hirePurchasePeriod: null,
    imageUrl: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80",
    inStock: true,
    features: [
      "UV-resistant PVC guttering",
      "Leaf and debris guards",
      "First-flush diverter included",
      "Easy-clean design",
      "Suitable for most roof types",
      "Complete installation hardware",
    ],
    specifications: JSON.stringify({
      material: "UV-stabilized PVC",
      coverage: "Up to 50m of roofing",
      includes: "Gutters, downpipes, connectors, guards",
      warranty: "2 years",
      color: "White/Grey",
    }),
    isActive: true,
  },
];

export async function seedProducts() {
  console.log("🌱 Seeding products...");
  
  try {
    // Insert products
    await db.insert(productsTable).values(products).onConflictDoNothing();
    
    console.log("✅ Successfully seeded products:");
    console.log(`   - ${products.filter(p => p.category === "Water Tanks").length} Water Tanks`);
    console.log(`   - ${products.filter(p => p.category === "Purification Systems").length} Purification Systems`);
    console.log(`   - ${products.filter(p => p.category === "Complete Systems").length} Complete Systems`);
    console.log(`   - ${products.filter(p => p.category === "Accessories").length} Accessories`);
    console.log(`   Total: ${products.length} products`);
    
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.main) {
  await seedProducts();
  process.exit(0);
}