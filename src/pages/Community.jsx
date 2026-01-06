import React, { useEffect, useState } from "react";
import axios from "axios";

import CommunityDesktop from "./CommunityDesktop";
import CommunityMobile from "./CommunityMobile";
import CommunityProductModal from "./CommunityProductModal";

export default function Community(props) {
  const [jewelleryData, setJewelleryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product?per_page=9&page=1`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setJewelleryData(data.data.products);
          setTotalPages(data.data.pagination.last_page)
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadProducts();
  }, []);

  const loadProduct = async (id) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setSelectedProductId(id);
        setSelectedProductDetails(data.data.product);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setSelectedProductDetails(null);
  };

  return (
    <>
      {/* MOBILE */}
      <div className="block lg:hidden">
        <CommunityMobile
          {...props}
          jewelleryData={jewelleryData}
          setJewelleryData={setJewelleryData}
          loadProduct={loadProduct}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <CommunityDesktop
          {...props}
          jewelleryData={jewelleryData}
          setJewelleryData={setJewelleryData}
          loadProduct={loadProduct}
          selectedProductId={selectedProductId}
          selectedProductDetails={selectedProductDetails}
          closeModal={closeModal}
        />
      </div>

      {selectedProductId && selectedProductDetails && (
        <CommunityProductModal
          selectedProductId={selectedProductId}
          selectedProductDetails={selectedProductDetails}
          closeModal={closeModal}
          {...props}
        />
      )}
    </>
  );
}
