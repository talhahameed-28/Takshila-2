// import { createContext, useContext, useState, useEffect } from "react";

// const WishlistContext = createContext();

// export function WishlistProvider({ children }) {
//   const [wishlistItems, setWishlistItems] = useState([]);

//   useEffect(() => {
//     async function loadWishlist() {
//       try {
//         const res = await fetch("https://takshila.cloud/api/getWishlist");
//         const data = await res.json();

//         if (data.success && Array.isArray(data.wishlistItems)) {
//           // Map backend format → UI format
//           const mapped = data.wishlistItems.map((item) => ({
//             id: item.wishlistId,
//             productId: item.productId,
//             name: item.title,
//             price: `$${item.basePrice}`,
//             image: item.imageUrl || "assets/placeholder.jpg", // update when backend confirms field
//             goldKarat: item.goldKarat,
//             quality: item.quality,
//             ringSize: item.ringSize,
//             diamondShape: item.diamondShape,
//             centerStoneCarat: item.centerStoneCarat,
//             totalCarats: item.totalCarats,
//           }));

//           setWishlistItems(mapped);
//         }
//       } catch (err) {
//         console.error("Failed to load wishlist:", err);
//       }
//     }

//     loadWishlist();
//   }, []);

//   /* ADD TO WISHLIST (POST)*/
//   async function addToWishlist(item) {
//     try {
//       const res = await fetch("https://takshila.cloud/api/addToWishlist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: item.productId,
//           title: item.name,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setWishlistItems((prev) => [
//           ...prev,
//           {
//             id: data.wishlistId,
//             productId: item.productId,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//           },
//         ]);
//       }
//     } catch (err) {
//       console.error("Failed to add to wishlist:", err);
//     }
//   }

//   /* ------------------------------------------------------
//       REMOVE FROM WISHLIST (POST)
//   ------------------------------------------------------ */
//   async function removeFromWishlist(wishlistId) {
//     try {
//       const res = await fetch("https://takshila.cloud/api/removeFromWishlist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ wishlistId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setWishlistItems((prev) =>
//           prev.filter((item) => item.id !== wishlistId)
//         );
//       }
//     } catch (err) {
//       console.error("Failed to remove from wishlist:", err);
//     }
//   }

//   /* ------------------------------------------------------
//       REPLACES toggleWishlist() WITH BACKEND LOGIC
//   ------------------------------------------------------ */
//   const toggleWishlist = (item) => {
//     const exists = wishlistItems.some((w) => w.productId === item.productId);
//     if (exists) {
//       const target = wishlistItems.find((w) => w.productId === item.productId);
//       removeFromWishlist(target.id);
//     } else {
//       addToWishlist(item);
//     }
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         toggleWishlist,
//         removeFromWishlist,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export function useWishlist() {
//   return useContext(WishlistContext);
// }
