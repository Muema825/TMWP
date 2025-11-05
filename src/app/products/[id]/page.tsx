"use client";

import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { useCart } from "~/lib/hooks/use-cart";
import { Button } from "~/ui/primitives/button";
import { Separator } from "~/ui/primitives/separator";

/* -------------------------------------------------------------------------- */
/*                               Type declarations                            */
/* -------------------------------------------------------------------------- */

interface Product {
  category: string;
  description: string;
  features: string[];
  hirePurchase?: {
    deposit: number;
    monthlyInstallment: number;
    period: number;
  };
  id: string;
  image: string;
  inStock: boolean;
  name: string;
  price: number;
  rating: number;
  specs: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/*                         Helpers (shared, memo-safe)                        */
/* -------------------------------------------------------------------------- */

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-KE", {
  currency: "KES",
  style: "currency",
});

/** `feature -> feature` ➜ `feature-feature` (for React keys) */
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

/** Build an integer array `[0,…,length-1]` once */
const range = (length: number) => Array.from({ length }, (_, i) => i);

/* -------------------------------------------------------------------------- */
/*                        Static product data                                 */
/* -------------------------------------------------------------------------- */

const products: Product[] = [
  {
    category: "Water Tanks",
    description:
      "Perfect for medium-sized families. One-piece, seamless tank molded from 100% Food and Drug Administration (FDA) approved material. Will not rust or impart any taste. The corrugated body allows it to stand upright making it more durable and easy to use.",
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Corrugated body for extra durability",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    hirePurchase: {
      deposit: 5000,
      monthlyInstallment: 1300,
      period: 18,
    },
    id: "1",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    inStock: true,
    name: "3000L Rainwater Harvesting Tank",
    price: 19500,
    rating: 4.9,
    specs: {
      capacity: "3000 Liters",
      cashPrice: "KES 19,500",
      construction: "One-piece seamless",
      deposit: "KES 5,000",
      material: "100% FDA approved polymer",
      monthlyInstallment: "KES 1,300 for 18 months",
      warranty: "5 years",
    },
  },
  {
    category: "Water Tanks",
    description:
      "Ideal for larger families or small businesses. This 5000L tank is molded from 100% FDA approved material ensuring your water stays clean and safe. The robust corrugated design ensures maximum durability while the seamless construction prevents leaks.",
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Corrugated body for superior strength",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    hirePurchase: {
      deposit: 7000,
      monthlyInstallment: 1500,
      period: 18,
    },
    id: "2",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    inStock: true,
    name: "5000L Rainwater Storage Tank",
    price: 25000,
    rating: 4.9,
    specs: {
      capacity: "5000 Liters",
      cashPrice: "KES 25,000",
      construction: "One-piece seamless",
      deposit: "KES 7,000",
      material: "100% FDA approved polymer",
      monthlyInstallment: "KES 1,500 for 18 months",
      warranty: "5 years",
    },
  },
  {
    category: "Water Tanks",
    description:
      "Our largest capacity tank for extended families, schools, or commercial use. The 10000L tank features the same FDA-approved construction as our smaller tanks but with enhanced structural support for the larger volume. Perfect for water security in areas with unreliable water supply.",
    features: [
      "100% FDA approved material",
      "One-piece seamless construction",
      "Will not rust or impart any taste",
      "Reinforced corrugated body",
      "Stands upright for easy use",
      "Free nationwide installation included",
    ],
    hirePurchase: {
      deposit: 8000,
      monthlyInstallment: 3000,
      period: 18,
    },
    id: "3",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    inStock: true,
    name: "10000L Large Capacity Tank",
    price: 49500,
    rating: 5.0,
    specs: {
      capacity: "10000 Liters",
      cashPrice: "KES 49,500",
      construction: "One-piece seamless with reinforcement",
      deposit: "KES 8,000",
      material: "100% FDA approved polymer",
      monthlyInstallment: "KES 3,000 for 18 months",
      warranty: "7 years",
    },
  },
  {
    category: "Purification Systems",
    description:
      "Our signature 8-layer purification system removes 99.9% of contaminants including bacteria, viruses, and heavy metals. Designed specifically for rainwater and tap water, ensuring your family drinks safe, clean water every day. Each layer targets specific contaminants for comprehensive protection.",
    features: [
      "8-stage filtration process",
      "Removes bacteria and viruses (99.9%)",
      "Heavy metal filtration",
      "Mineral retention technology",
      "Easy filter replacement",
      "Low maintenance design",
    ],
    id: "4",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80",
    inStock: true,
    name: "8-Layer Tap Water Purifier",
    price: 12000,
    rating: 4.8,
    specs: {
      capacity: "Up to 1000L per day",
      filterLife: "6-12 months (replaceable)",
      filtrationLayers: "8 layers (sediment, carbon, ceramic, UV, mineral)",
      installation: "Wall-mounted or countertop",
      warranty: "3 years",
    },
  },
  {
    category: "Purification Systems",
    description:
      "Advanced UV purification technology for maximum protection. This system uses ultraviolet light to destroy harmful microorganisms without chemicals, perfect for households with young children or elderly members. Automatically activates when water flows through.",
    features: [
      "UV-C sterilization technology",
      "Chemical-free purification",
      "Automatic flow sensor activation",
      "Low energy consumption",
      "Digital display with filter alerts",
      "Annual UV bulb replacement",
    ],
    id: "5",
    image:
      "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?w=800&q=80",
    inStock: true,
    name: "Advanced UV Water Filter",
    price: 18000,
    rating: 4.7,
    specs: {
      capacity: "Up to 2000L per day",
      powerConsumption: "40W",
      technology: "UV-C + Carbon filtration",
      uvBulbLife: "12 months",
      warranty: "3 years",
    },
  },
  {
    category: "Complete Systems",
    description:
      "Everything you need in one package. This complete system includes our 3000L FDA-approved tank, 8-layer purifier, guttering connection kit, and professional installation. Start harvesting clean rainwater immediately with this all-in-one solution.",
    features: [
      "3000L FDA-approved tank included",
      "8-layer purification system",
      "Complete gutter collection kit",
      "Tank stand and base",
      "All plumbing connections",
      "Professional installation included",
    ],
    hirePurchase: {
      deposit: 6000,
      monthlyInstallment: 1700,
      period: 18,
    },
    id: "6",
    image:
      "https://images.unsplash.com/photo-1583266722259-2d6f3d8e65?w=800&q=80",
    inStock: true,
    name: "3000L Complete Water System",
    price: 28500,
    rating: 4.9,
    specs: {
      cashPrice: "KES 28,500",
      components: "3000L Tank + 8-Layer Purifier + Accessories",
      deposit: "KES 6,000",
      installation: "Free professional installation nationwide",
      monthlyInstallment: "KES 1,700 for 18 months",
      warranty: "5 years comprehensive",
    },
  },
  {
    category: "Complete Systems",
    description:
      "Our premium package for families who want the best. Includes our 5000L FDA-approved tank, advanced UV purifier, premium guttering system, and enhanced overflow management. Perfect for larger households seeking total water independence.",
    features: [
      "5000L FDA-approved tank",
      "Advanced UV purification",
      "Premium gutter collection system",
      "Automated overflow management",
      "Water level monitoring",
      "Priority maintenance support",
    ],
    hirePurchase: {
      deposit: 8000,
      monthlyInstallment: 2000,
      period: 18,
    },
    id: "7",
    image:
      "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=80",
    inStock: true,
    name: "5000L Premium Package",
    price: 35000,
    rating: 5.0,
    specs: {
      cashPrice: "KES 35,000",
      components: "5000L Tank + UV Purifier + Premium Accessories",
      deposit: "KES 8,000",
      installation: "Free professional installation + training nationwide",
      monthlyInstallment: "KES 2,000 for 18 months",
      warranty: "5 years comprehensive",
    },
  },
  {
    category: "Complete Systems",
    description:
      "The ultimate water solution for large families, schools, or small businesses. This package includes our massive 10000L FDA-approved tank, advanced purification systems, and professional-grade installation. Never worry about water scarcity again.",
    features: [
      "10000L FDA-approved tank",
      "Dual purification systems",
      "Commercial-grade guttering",
      "Advanced monitoring system",
      "Backup overflow protection",
      "Extended warranty coverage",
    ],
    hirePurchase: {
      deposit: 10000,
      monthlyInstallment: 3500,
      period: 18,
    },
    id: "8",
    image:
      "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80",
    inStock: true,
    name: "10000L Family System",
    price: 59500,
    rating: 5.0,
    specs: {
      cashPrice: "KES 59,500",
      components: "10000L Tank + Dual Purifiers + Commercial Accessories",
      deposit: "KES 10,000",
      installation: "Free professional installation + training nationwide",
      monthlyInstallment: "KES 3,500 for 18 months",
      warranty: "7 years comprehensive",
    },
  },
  {
    category: "Accessories",
    description:
      "Sturdy steel stand for elevated tank installation. Ensures proper water pressure and protects your tank from ground moisture. Includes all mounting hardware and concrete anchoring bolts. Suitable for tanks up to 5000L.",
    features: [
      "Heavy-duty steel construction",
      "Corrosion-resistant coating",
      "Includes concrete base kit",
      "Suitable for tanks up to 5000L",
      "Easy assembly design",
      "Professional installation recommended",
    ],
    id: "9",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    inStock: true,
    name: "Tank Stand & Base Kit",
    price: 6500,
    rating: 4.5,
    specs: {
      loadCapacity: "6000kg",
      material: "Galvanized steel",
      suitableFor: "3000L and 5000L tanks",
      warranty: "3 years",
    },
  },
  {
    category: "Accessories",
    description:
      "Professional-grade guttering system designed to maximize rainwater collection. Includes downpipes, leaf guards, and first-flush diverter to ensure only clean water enters your tank. Easy to install and maintain.",
    features: [
      "UV-resistant PVC guttering",
      "Leaf and debris guards",
      "First-flush diverter included",
      "Easy-clean design",
      "Suitable for most roof types",
      "Complete installation hardware",
    ],
    id: "10",
    image:
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80",
    inStock: true,
    name: "Gutter Collection System",
    price: 9500,
    rating: 4.4,
    specs: {
      coverage: "Up to 50m of roofing",
      includes: "Gutters, downpipes, connectors, guards",
      material: "UV-stabilized PVC",
      warranty: "2 years",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function ProductDetailPage() {
  /* ----------------------------- Routing --------------------------------- */
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  /* ----------------------------- Cart hook ------------------------------- */
  const { addItem } = useCart();

  /* ----------------------------- Local state ----------------------------- */
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);

  /* ------------------------ Derive product object ------------------------ */
  const product = React.useMemo(() => products.find((p) => p.id === id), [id]);

  /* ------------------------------ Handlers ------------------------------- */
  const handleQuantityChange = React.useCallback((newQty: number) => {
    setQuantity((prev) => (newQty >= 1 ? newQty : prev));
  }, []);

  const handleAddToCart = React.useCallback(async () => {
    if (!product) return;

    setIsAdding(true);
    addItem(
      {
        category: product.category,
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
      },
      quantity,
    );
    setQuantity(1);
    toast.success(`${product.name} added to cart`);
    await new Promise((r) => setTimeout(r, 400));
    setIsAdding(false);
  }, [addItem, product, quantity]);

  /* -------------------------- Conditional UI ---------------------------- */
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">Product Not Found</h1>
            <p className="mt-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-6" onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </main>
      </div>
    );
  }

  /* ------------------------------ Markup --------------------------------- */
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          {/* Back link */}
          <Button
            aria-label="Back to products"
            className="mb-6"
            onClick={() => router.push("/products")}
            variant="ghost"
          >
            ← Back to Products
          </Button>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                alt={product.name}
                className="object-cover"
                fill
                priority
                src={product.image}
              />
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Title & rating */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>

                <div className="mt-2 flex items-center gap-2">
                  <div
                    aria-label={`Rating ${product.rating} out of 5`}
                    className="flex items-center"
                  >
                    {range(5).map((i) => (
                      <Star
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : i < product.rating
                              ? "fill-primary/50 text-primary"
                              : "text-muted-foreground"
                        }`}
                        key={`star-${i}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Category & price */}
              <div className="mb-6">
                <p className="text-lg font-medium text-muted-foreground">
                  {product.category}
                </p>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {CURRENCY_FORMATTER.format(product.price)}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Cash Price
                  </span>
                </div>

                {/* Hire purchase option */}
                {product.hirePurchase && (
                  <div className="mt-3 rounded-lg bg-primary/10 p-4">
                    <p className="font-semibold text-primary">
                      Hire Purchase Available
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        Deposit:{" "}
                        <span className="font-medium">
                          {CURRENCY_FORMATTER.format(
                            product.hirePurchase.deposit,
                          )}
                        </span>
                      </p>
                      <p>
                        Monthly:{" "}
                        <span className="font-medium">
                          {CURRENCY_FORMATTER.format(
                            product.hirePurchase.monthlyInstallment,
                          )}{" "}
                          for {product.hirePurchase.period} months
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mb-6 text-muted-foreground">
                {product.description}
              </p>

              {/* Stock */}
              <div aria-atomic="true" aria-live="polite" className="mb-6">
                {product.inStock ? (
                  <p className="text-sm font-medium text-green-600">
                    In Stock - Free Installation Nationwide
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-500">
                    Currently Unavailable
                  </p>
                )}
              </div>

              {/* Quantity & Add to cart */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <Button
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    size="icon"
                    variant="outline"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 select-none text-center">
                    {quantity}
                  </span>
                  <Button
                    aria-label="Increase quantity"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="flex-1"
                  disabled={!product.inStock || isAdding}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAdding ? "Adding…" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Features & Specs */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Features */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li
                    className="flex items-start"
                    key={`feature-${product.id}-${slugify(feature)}`}
                  >
                    <span className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Specifications */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    className="flex justify-between border-b pb-2 text-sm"
                    key={key}
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}