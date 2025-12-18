import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyActivity() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 12;
   
    const [totalProducts, setTotalProducts] = useState()
    const totalPages = Math.ceil(totalProducts / cardsPerPage);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USER DESIGNS
  useEffect(() => {
    const getMyDesigns = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/my-activity?per_page=12&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          console.log(data.data.products)
          setDesigns(data.data.products);
          setTotalProducts(data.data.pagination.total)
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getMyDesigns();
  }, [currentPage]);


    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
      };


  return (
    <div className="bg-[#e5e2df] min-h-screen flex flex-col text-[#1a1a1a]">
      
      <main className="flex-grow pt-40 px-6 md:px-12 lg:px-20 pb-24 transition-all duration-500">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-5xl font-serif font-light tracking-wide text-[#1a1a1a]">
            MY ACTIVITY
          </h1>
          <div className="w-full max-w-4xl mx-auto border-t border-gray-400 mt-6"></div>
        </section>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-sm mt-10">
            Loading your designs...
          </p>
        )}

        {/* Empty State */}
        {!loading && designs.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-20 h-[40vh]">
            <h2 className="text-2xl font-medium text-gray-700 mb-6">
              No Designs Yet
            </h2>

            <button
              onClick={() => navigate("/design-studio")}
              className="px-10 py-4 bg-[#555555] hover:bg-[#000000] text-white rounded-full text-sm shadow-sm transition cursor-pointer"
            >
              Add Some Designs
            </button>
          </div>
        )}

        {/* Designs Grid */}
        {designs.length > 0 && (
          <section>
            <div className="flex justify-center items-center gap-3 mb-14">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === 1
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, p) => (
            <button
              key={p}
              onClick={() => goToPage(p + 1)}
              className={`w-9 h-9 rounded-full text-sm flex items-center justify-center ${
                currentPage === p + 1
                  ? "bg-[#2E4B45] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-[#d8d6d3]"
              }`}
            >
              {p + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &gt;
          </button>
        </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
              {designs.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>

                  <h2 className="text-sm font-semibold mt-4 tracking-wide text-gray-800 uppercase">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">${item.price}</p>

                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="mt-3 px-5 py-2 text-sm rounded-full transition-all bg-[#2E4B45] hover:bg-[#1f332e] text-white"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );

}
