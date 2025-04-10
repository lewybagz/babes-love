import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../products/ProductCard";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

const HomePage: React.FC = () => {
  const { products } = useAppContext();

  // Select products for different sections (using slice for simplicity)
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 4); // Use different products if available

  // Mock categories - replace with real data if available
  const categories = [
    {
      name: "Hats",
      imageUrl: "/images/category_hats_placeholder.jpg",
      link: "/products?category=hats",
    },
    {
      name: "Apparel",
      imageUrl: "/images/category_apparel_placeholder.jpg",
      link: "/products?category=apparel",
    },
    {
      name: "Custom Gear",
      imageUrl: "/images/category_custom_placeholder.jpg",
      link: "/customize",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* --- Hero Section --- */}
      <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 dark:from-brand-700 dark:to-brand-900 pt-16 pb-24 sm:pt-24 sm:pb-32 text-white">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>{" "}
        {/* Optional overlay for contrast */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl">
            Babes Love Birdies
          </h1>
          <p className="mt-6 text-lg leading-8 text-brand-100 dark:text-brand-200 max-w-2xl mx-auto">
            Handcrafted hats & apparel with unique styles and custom fonts.
            Express yourself with gear that speaks volumes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/products"
              className="rounded-md bg-white px-5 py-3 text-base font-semibold text-brand-600 shadow-sm hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300"
            >
              Shop All Products
            </Link>
            <Link
              to="/customize"
              className="text-base font-semibold leading-6 text-white hover:text-brand-100 transition-colors duration-300"
            >
              Create Your Own <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- Featured Products --- */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900 dark:text-white">
            Featured Products
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.images?.[0] || product.imageUrl}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No featured products yet.
            </p>
          )}
        </div>
      </section>

      {/* --- Shop by Category --- */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-brand-200 group-hover:underline">
                    Shop Now <ArrowRight className="inline h-4 w-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- New Arrivals --- */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900 dark:text-white">
            New Arrivals
          </h2>
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.images?.[0] || product.imageUrl}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No new arrivals yet.</p>
          )}
        </div>
      </section>

      {/* --- Promotional Banner --- */}
      <section className="bg-brand text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold mb-4">
            Get 15% Off Your First Order!
          </h3>
          <p className="mb-6 text-brand-100">
            Sign up for our newsletter and stay updated on the latest drops and
            special offers.
          </p>
          <form className="max-w-sm mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow rounded-l-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-300"
              required
            />
            <button
              type="submit"
              className="rounded-r-md bg-gray-800 dark:bg-gray-700 px-6 py-2 font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>

      {/* --- Testimonials/Social Proof --- */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900 dark:text-white">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Placeholder Testimonials - Replace with real data or component */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex mb-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "Absolutely love my custom hat! The quality is amazing and the
                  font choices were perfect. Highly recommend!"
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  - Customer Name {i}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
