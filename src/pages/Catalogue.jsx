import React, { useState } from "react";

const products = [
  {
    id: 1,
    name: "Aria Dawn",
    price: 3200,
    stock: true,
    image: "assets/jewel1.jpg",
  },
  {
    id: 2,
    name: "Aurora Halo",
    price: 4800,
    stock: true,
    image: "assets/jewel2.jpg",
  },
  {
    id: 3,
    name: "Aurora Spark",
    price: 5500,
    stock: false,
    image: "assets/jewel3.jpg",
  },
  {
    id: 4,
    name: "Celeste Ring",
    price: 6100,
    stock: true,
    image: "assets/jewel4.jpg",
  },
  {
    id: 5,
    name: "Golden Dream",
    price: 4500,
    stock: true,
    image: "assets/jewel5.jpg",
  },
  {
    id: 6,
    name: "Serenity Band",
    price: 2400,
    stock: false,
    image: "assets/jewel6.jpg",
  },
  {
    id: 7,
    name: "Luna Glow",
    price: 3700,
    stock: true,
    image: "assets/jewel7.jpg",
  },
  {
    id: 8,
    name: "Radiant Whisper",
    price: 5200,
    stock: true,
    image: "assets/jewel8.jpg",
  },
];

export default function Catalogue() {
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [sortOrder, setSortOrder] = useState("az");
  const [priceRange, setPriceRange] = useState([0, 6500]);

  const handlePriceChange = (e) => setPriceRange([0, Number(e.target.value)]);

  const filteredProducts = products
    .filter((p) => {
      if (inStock && p.stock) return true;
      if (outOfStock && !p.stock) return true;
      if (!inStock && !outOfStock) return true;
      return false;
    })
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);
      if (sortOrder === "lowhigh") return a.price - b.price;
      if (sortOrder === "highlow") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <div className="bg-[#e5e2df] min-h-screen text-[#1a1a1a] pt-40 px-6 md:px-12 lg:px-20 pb-24 transition-all duration-500">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-5xl font-serif font-light tracking-wide text-[#1a1a1a]">
            PRODUCTS
          </h1>
          <p className="text-sm mt-2 text-gray-600 mb-24">
            <span className="text-gray-500">Home</span> &nbsp;›&nbsp; Products
          </p>
        </section>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 space-y-10">
            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold uppercase mb-4 tracking-wide text-gray-800">
                AVAILABILITY
              </h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => setInStock(!inStock)}
                    className="accent-[#2E4B45] scale-110"
                  />
                  In stock
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={outOfStock}
                    onChange={() => setOutOfStock(!outOfStock)}
                    className="accent-[#2E4B45] scale-110"
                  />
                  Out of stock
                </label>
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-lg font-semibold uppercase mb-4 tracking-wide text-gray-800">
                PRICE
              </h3>
              <input
                type="range"
                min="0"
                max="6500"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full accent-[#2E4B45]"
              />
              <p className="text-gray-600 text-sm mt-2">
                Price: ${priceRange[0].toFixed(2)} — ${priceRange[1].toFixed(2)}
              </p>
            </div>
          </aside>

          {/* Product Section */}
          <section className="flex-1">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-400 bg-white rounded-full px-5 py-2 text-sm text-gray-700 focus:outline-none hover:border-gray-600"
              >
                <option value="az">Alphabetically, A–Z</option>
                <option value="za">Alphabetically, Z–A</option>
                <option value="lowhigh">Price: Low to High</option>
                <option value="highlow">Price: High to Low</option>
              </select>

              {/* Layout Icons (mockup only) */}
              <div className="flex gap-3">
                <button className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100">
                  Ⅱ
                </button>
                <button className="w-8 h-8 border border-gray-400 bg-[#2E4B45] text-white rounded-full flex items-center justify-center">
                  Ⅲ
                </button>
                <button className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100">
                  ☰
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>

                  <h2 className="text-sm font-semibold mt-4 tracking-wide text-gray-800 uppercase">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    ${item.price.toFixed(2)}
                  </p>

                  <button
                    className={`mt-3 px-5 py-2 text-sm rounded-full transition-all ${
                      item.stock
                        ? "bg-[#2E4B45] hover:bg-[#1f332e] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {item.stock ? "Buy Now" : "Out of Stock"}
                  </button>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 mt-20 text-sm">
                No products match your filters.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
