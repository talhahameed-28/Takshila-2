import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyActivity() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USER DESIGNS
  useEffect(() => {
    const getMyDesigns = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product/my-designs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setDesigns(data.designs);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getMyDesigns();
  }, []);

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
