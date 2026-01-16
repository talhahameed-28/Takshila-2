import { useState, useEffect, useRef } from "react";
import HotMeter from "../components/HotMeter";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CommunityMobile({setJewelleryData,totalPages,setTotalPages, jewelleryData = [], loadProduct ,handleOpenModal}) {
  const loadMoreDesignRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
   const loadingRef = useRef(false);
   const {isLoggedIn}=useSelector(state=>state.user)

      useEffect(() => {
        if (!loadMoreDesignRef.current) return;

        const loadMoreProducts = async () => {
          if (loadingRef.current) return;
          if (currentPage >= totalPages) return;

          loadingRef.current = true;

          try {
            const nextPage = currentPage + 1;

            const { data } = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/product?per_page=9&page=${nextPage}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            console.log(data)
            if (data.success) {
              setCurrentPage(nextPage);
              setJewelleryData(prev => [
                ...prev,
                ...data.data.products
              ]);
              setTotalPages(data.data.pagination.last_page);
            } else {
              toast.error("Couldn't fetch products");
            }
          } catch (error) {
            console.log(error);
          } finally {
            loadingRef.current = false;
          }
        };

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              loadMoreProducts();
            }
          },
          {
            root: null,
            rootMargin: "1000px 0px",
            threshold: 0,
          }
        );

        observer.observe(loadMoreDesignRef.current);

        return () => observer.disconnect();
      }, [currentPage, totalPages]);



  if (jewelleryData.length === 0) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white text-sm opacity-60">
        Loading designs...
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-black h-screen overflow-y-scroll text-white"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/*{jewelleryData.map((item,idx) =>{
          return(
            <div key={item.id}>
            <ReelItem handleOpenModal={handleOpenModal} isLoggedIn={isLoggedIn} item={item} loadProduct={loadProduct} />
            {idx==jewelleryData.length-1 && totalPages!=currentPage &&
            <div ref={loadMoreDesignRef} className="flex flex-col items-center justify-center py-10">
              <div className="h-10 w-10 -mt-24 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-white text-center max-w-xs">
                Loading more designs...
                </p>
            </div>}
            </div>
        
      )})}*/}

        {jewelleryData.map((item) => (
          <ReelItem
            key={item.id}
            handleOpenModal={handleOpenModal}
            isLoggedIn={isLoggedIn}
            item={item}
            loadProduct={loadProduct}
          />
        ))}

        {/* Loader — OUTSIDE snap items 
        {totalPages !== currentPage && (
          <div
            ref={loadMoreDesignRef}
            className="flex flex-col items-center justify-center py-10 snap-none"
          >
            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-white text-center max-w-xs">
              Loading more designs...
            </p>
          </div>
        )}*/}

        {/* Infinite scroll sentinel (invisible) */}
        {totalPages !== currentPage && (
          <div ref={loadMoreDesignRef} className="h-px w-full" />
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* COMMENTS BOTTOM SHEET */
/* ------------------------------------------------------------------ */

function CommentsSheet({productId, onClose,isLoggedIn,handleOpenModal}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product/${productId}/engagements`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setComments(data.data.comments.list || []);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleComment = async () => {
    if (!comment.trim() || posting) return;
    if(!isLoggedIn){
      handleOpenModal("login")
      return
    }

    try {
      setPosting(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/${productId}/engage`,
        { type:"comment",comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setComments((prev) => [
          {
            id: Date.now(),
            comment: comment,
            user: { name: data?.data?.comment?.user?.name },
            created_at: new Date(),
          },
          ...prev,
        ]);
        setComment("");
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 h-[75vh] bg-[#1c1c1e] rounded-t-2xl flex flex-col animate-slideUp">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        <h3 className="text-center text-sm mb-2">Comments</h3>

        <div className="flex-1 overflow-y-auto px-4 space-y-5">
          {loading && (
            <p className="text-center text-white/50 text-sm">
              Loading comments...
            </p>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-center text-white/50 text-sm">No comments yet</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                {c.user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {c.user?.name || "Anonymous"}
                </p>
                <p className="text-sm text-white/80">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 px-4 py-3 flex gap-3">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-[#2c2c2e] rounded-full px-4 py-2 text-sm text-white outline-none"
          />
          <button onClick={()=>{handleComment()}} disabled={posting} className="text-sm">
            {posting ? "..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* SINGLE REEL ITEM */
/* ------------------------------------------------------------------ */

function ReelItem({ item, loadProduct,isLoggedIn,handleOpenModal }) {
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [likes, setLikes] = useState(item.likes_count || 0);
  const [isRated, setIsRated] = useState(item.is_rated)
  const [averageRating, setAverageRating] = useState(item.average_rating)
  const [ratingsCount, setRatingsCount] = useState(item.ratings_count)
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const descRef = useRef(null);
  const [showReadMore, setShowReadMore] = useState(false);
   useEffect(() => {
     if (descRef.current) {
       const el = descRef.current;
       setShowReadMore(el.scrollHeight > el.clientHeight);
     }
   }, [item.description]);



  const handleEngage = async (type,rating=0) => {
    try {
      if(!isLoggedIn){
        handleOpenModal("login")
        return
      }
      axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/product/${item.id}/engage`,
          {type,
            ...(type=="rating"?{rating:rating/10}:{})
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        console.log(data);
        if (data.success) {
          
          toast.success(data.message);
           if(type=="like"){ 
            setIsLiked(data.data.liked)
            setLikes(data.data.likes_count)
            }
            else if(type=="rating"){
              setIsRated(true)
              setAverageRating(data.data.average_rating)
              setRatingsCount(data.data.ratings_count)
            }  
            // else if(type=="comment") {
            //   setComment("")
            //   setCommentsList((prev) => [
            //               {
            //                 id: Date.now(),
            //                 review: comment,
                            
            //                 user: { name: data?.data?.comment?.user?.name },
            //                 created_at: new Date(),
            //               },
            //               ...prev,
            //             ]);

            // }
        } else toast.error("Couldn't process request");
    
    } catch (error) {
      console.log(error);
      // toast.error("Some error occurred");
    }
  };

  //  const handleLike = async () => {
  //     try {
  //       axios.defaults.withCredentials = true;
  //       const { data } = await axios.post(
  //         `${
  //           import.meta.env.VITE_BASE_URL
  //         }/api/product/${item.id}/like`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );
  //       console.log(data);
  //       if (data.success) {
  //         toast.success(data.message);
  //         setLiked(data.liked)
  //         setLikes(data.likes_count)
  //         // item.likes_count=data.likes_count
  //         // setSelectedProductDetails({
  //         //   ...item,
  //         //   user_liked: data.liked,
  //         //   likes_count: data.likes_count,
  //         // });
  //       } else toast.error("Couldn't process request");
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Some error occurred");
  //     }
  //   };

  // const toggleLike = () => {
  //   setLiked((prev) => !prev);
  //   setLikes((prev) => (liked ? prev - 1 : prev + 1));
  // };

  const designerAvatar = item.user?.avatar || null;
  const designerCallname =
    item.user?.name || item.user?.username || "takshila";

  return (
    <div className=" relative flex flex-col pt-16 -mb-20">
      {/* IMAGE + HEADER */}
      <div className="flex flex-col items-center gap-4 pt-5 px-4">
        <div className="flex items-center gap-3 self-start">
          <svg
            width="38"
            height="42"
            viewBox="0 0 100 110"
            className="shrink-0"
          >
            {/* HEXAGON STROKE */}
            <polygon
              points="50,5 95,30 95,80 50,105 5,80 5,30"
              fill="black"
              stroke="white"
              strokeWidth="4"
            />

            {/* IMAGE MASK */}
            <defs>
              <clipPath id={`hexClip-${item.id}`}>
                <polygon points="50,5 95,30 95,80 50,105 5,80 5,30" />
              </clipPath>
            </defs>

            {designerAvatar ? (
              <image
                href={designerAvatar}
                x="0"
                y="0"
                width="100"
                height="110"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#hexClip-${item.id})`}
              />
            ) : (
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="40"
                fontWeight="600"
              >
                {designerCallname.charAt(0)}
              </text>
            )}
          </svg>

          <span className="text-xs">@{designerCallname}</span>
        </div>

        <div className="bg-[#f3ece4] rounded-2xl overflow-hidden w-full max-w-90">
          <img
            src={item.image}
            alt={item.name}
            onClick={() => loadProduct?.(item.id)}
            className="w-full object-contain"
          />
        </div>

        {/* ACTION ROW — ALIGNED TO IMAGE WIDTH */}
        <div className="w-full max-w-90 mx-auto px-1 mt-1">
          <div className="flex items-center justify-between">
            {/* LEFT — CUSTOMIZE */}
            <button
              onClick={() => loadProduct(item.id)}
              className="
    px-6 py-2
    rounded-full
    text-sm font-semibold
    text-white
    bg-transparent
    border border-white
    hover:bg-white/10
    transition
  "
            >
              Customize
            </button>

            {/* RIGHT — ICONS */}
            <div className="flex items-center gap-5">
              {/* LIKE */}
              
                <>
                  <button
                    onClick={() => {handleEngage("like")}}
                    className="flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={` lucide lucide-heart-icon lucide-heart transition ${
                        isLiked
                          ? " text-red-700 opacity-100"
                          : " text-transparent opacity-70"
                      }`}
                    >
                      <path
                        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                        fill="currentColor"
                      />{" "}
                    </svg>
                    <span className="text-xs">{likes}</span>
                  </button>
                  {/* COMMENTS */}
                  <button
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-1"
                  >
                    <img src="/assets/comments.png" className="w-6 h-6" />
                    <span className="text-xs">{item.comments_count || 0}</span>
                  </button>
                </>
              

              {/* SHARE */}
              <button>
                <img src="/assets/grp32.svg" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* HOT METER */}
      
          <div className="w-full max-w-90 ">
            <HotMeter
              isRated={isRated}
              average={averageRating || 0}
              userRating={item.user_rating || null}
              onRate={(rating) => {handleEngage("rating", rating)}}
              isLoggedIn={isLoggedIn}
              handleOpenModal={handleOpenModal}
            />
          </div>
        
      </div>

      {/* DESCRIPTION */}
      <div className="px-6 pt-2 pb-4">
        <h2 className="text-2xl font-light">{item.name}</h2>
        {item.description && (
          <>
            <p ref={descRef} className="text-xs opacity-80 line-clamp-1">
              {item.description}
            </p>

            {showReadMore && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-white/70 mt-1"
              >
                Read more
              </button>
            )}
          </>
        )}
      </div>

      {showComments && (
        <CommentsSheet
        handleOpenModal={handleOpenModal}
        isLoggedIn={isLoggedIn}
          productId={item.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}
