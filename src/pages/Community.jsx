import React, { useEffect, useState } from "react";
import axios from "axios";

import CommunityDesktop from "./CommunityDesktop";
import CommunityMobile from "./CommunityMobile";
import CommunityProductModal from "./CommunityProductModal";
import { Helmet } from "react-helmet-async";


export default function Community({ setHideMobileNavbar, ...props }) {
  const [jewelleryData, setJewelleryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);

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
          setTotalPages(data.data.pagination.last_page);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadProducts();
  }, []);

  const loadProduct = async (id) => {
    setShowMobileNavbar(false);
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
    setShowMobileNavbar(true);
  };

  return (
    <>

       <Helmet>
              <title> Community Jewelry Marketplace | Share Designs & Earn | Takshila </title>
              <meta name="description" content="Launch your jewelry brand with no upfront cost. Design pieces like rings, pendants, earrings, bracelets, or even cufflinks to sell and earn commissions on every sale, while our artisans handle production and delivery with transparent price breakdowns."
              />
              <meta name="keywords" content="Jewelry Community marketplace, Sell Jewelry Designs online, Launch Jewelry Brand, Earn Commission on Jewelry, User-designed jewelry, Social Commerce Jewelry, Sell Ring Designs Online, sell necklace designs online" />
              <link rel="canonical" href="https://takshila.co/community" />
            </Helmet>
            
      {/* MOBILE */}
      <div className="block lg:hidden">
        <CommunityMobile
          {...props}
          jewelleryData={jewelleryData}
          setJewelleryData={setJewelleryData}
          loadProduct={loadProduct}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          setHideMobileNavbar={setHideMobileNavbar}
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
