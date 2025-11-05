"use client";

import * as React from "react";

import { useCart } from "~/lib/hooks/use-cart";
import { ProductCard } from "~/ui/components/product-card";
import { Button } from "~/ui/primitives/button";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Category = string;

interface Product {
  category: string;
  id: string;
  image: string;
  inStock: boolean;
  name: string;
  originalPrice?: number;
  price: number;
  rating: number;
}

/* -------------------------------------------------------------------------- */
/*                            Helpers / utilities                             */
/* -------------------------------------------------------------------------- */

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

/* -------------------------------------------------------------------------- */
/*                               Mock data                                    */
/* -------------------------------------------------------------------------- */

const products: Product[] = [
  {
    category: "Water Tanks",
    id: "1",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    inStock: true,
    name: "3000L Rainwater Harvesting Tank",
    price: 19500,
    rating: 4.9,
  },
  {
    category: "Water Tanks",
    id: "2",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    inStock: true,
    name: "5000L Rainwater Storage Tank",
    price: 25000,
    rating: 4.9,
  },
  {
    category: "Water Tanks",
    id: "3",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    inStock: true,
    name: "10000L Large Capacity Tank",
    price: 49500,
    rating: 5.0,
  },
  {
    category: "Purification Systems",
    id: "4",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80",
    inStock: true,
    name: "8-Layer Tap Water Purifier",
    price: 12000,
    rating: 4.8,
  },
  {
    category: "Purification Systems",
    id: "5",
    image:
      "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?w=800&q=80",
    inStock: true,
    name: "Advanced UV Water Filter",
    price: 18000,
    rating: 4.7,
  },
  {
    category: "Complete Systems",
    id: "6",
    image:
      "https://images.unsplash.com/photo-1583266722259-2d6f3d8e65?w=800&q=80",
    inStock: true,
    name: "3000L Complete Water System",
    price: 28500,
    rating: 4.9,
  },
  {
    category: "Complete Systems",
    id: "7",
    image:
      "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=80",
    inStock: true,
    name: "5000L Premium Package",
    price: 35000,
    rating: 5.0,
  },
  {
    category: "Complete Systems",
    id: "8",
    image:
      "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80",
    inStock: true,
    name: "10000L Family System",
    price: 59500,
    rating: 5.0,
  },
  {
    category: "Accessories",
    id: "9",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    inStock: true,
    name: "Tank Stand & Base Kit",
    price: 6500,
    rating: 4.5,
  },
  {
    category: "Accessories",
    id: "10",
    image:
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80",
    inStock: true,
    name: "Gutter Collection System",
    price: 9500,
    rating: 4.4,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export default function ProductsPage() {
  const { addItem } = useCart();

  /* ----------------------- Categories (derived) ------------------------- */
  const categories: Category[] = React.useMemo(() => {
    const dynamic = Array.from(new Set(products.map((p) => p.category))).sort();
    return ["All", ...dynamic];
  }, []);

  /* ----------------------------- State ---------------------------------- */
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category>("All");

  /* --------------------- Filtered products (memo) ----------------------- */
  const filteredProducts = React.useMemo(
    () =>
      selectedCategory === "All"
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  /* --------------------------- Handlers --------------------------------- */
  const handleAddToCart = React.useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        addItem(
          {
            category: product.category,
            id: product.id,
            image: product.image,
            name: product.name,
            price: product.price,
          },
          1, // (quantity) always adds 1 item to the cart
        );
      }
    },
    [addItem],
  );

  const handleAddToWishlist = React.useCallback((productId: string) => {
    // TODO: integrate with Wishlist feature
    console.log(`Added ${productId} to wishlist`);
  }, []);

  /* ----------------------------- Render --------------------------------- */
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-10">
        <div
          className={`
            container px-4
            md:px-6
          `}
        >
          {/* Heading & filters */}
          <div
            className={`
              mb-8 flex flex-col gap-4
              md:flex-row md:items-center md:justify-between
            `}
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Our Water Solutions</h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Browse our complete range of water tanks and purification systems. Flexible payment plans available.
              </p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  aria-pressed={category === selectedCategory}
                  className="rounded-full"
                  key={slugify(category)}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  title={`Filter by ${category}`}
                  variant={
                    category === selectedCategory ? "default" : "outline"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div
            className={`
              grid grid-cols-1 gap-6
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            `}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                product={product}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}

          {/* Pagination */}
          <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Button disabled variant="outline">
              Previous
            </Button>
            <Button aria-current="page" variant="default">
              1
            </Button>
            <Button disabled variant="outline">
              Next
            </Button>
          </nav>
        </div>
      </main>
    </div>
  );
}