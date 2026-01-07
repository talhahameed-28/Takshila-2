import { useState, useEffect, useRef } from "react";
import HotMeter from "../components/HotMeter";
import axios from "axios";
import toast from "react-hot-toast";

export default function CommunityMobile({setJewelleryData,totalPages,setTotalPages, jewelleryData = [], loadProduct }) {
  const loadMoreDesignRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
   useEffect(() => {

    const loadMoreProducts=async()=>{
      try {
         const { data } = await axios.get(
                  `${
                    import.meta.env.VITE_BASE_URL
                  }/api/product?per_page=9&page=${currentPage+1}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                console.log(data);
                if (data.success) {
                  setCurrentPage(prev=>prev+1)
                  setJewelleryData([...jewelleryData,...data.data.products]);
                  setTotalPages(data.data.pagination.last_page)
                } else toast.error("Couldn't fetch products");
              } catch (error) {
                console.log(error);
              }
    }
     
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          if(currentPage==totalPages) return;
          loadMoreProducts()
        };
      }, 
      {
        root:null,
        rootMargin:"1000px 0px",
        threshold: 0, // 10% visible
      }
    );

    if (loadMoreDesignRef.current) observer.observe(loadMoreDesignRef.current);

    return () => observer.disconnect();
  }, [jewelleryData]);


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
      className="bg-black h-screen overflow-y-scroll snap-y snap-mandatory text-white"
      style={{ WebkitOverflowScrolling: "touch" }}
      >
      {jewelleryData.map((item,idx) =>{
          return(
            <>
            <ReelItem  
            
            key={item.id} item={item} loadProduct={loadProduct} />
            {idx==jewelleryData.length-1 && totalPages!=currentPage &&
            <div ref={loadMoreDesignRef} className="flex flex-col items-center justify-center py-10">
              <div className="h-10 w-10 -mt-24 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-white text-center max-w-xs">
              Loading more designs...
            </p>
            </div>}
            </>
        
      )})}
      
    </div>
    
      </>
  );
}

/* ------------------------------------------------------------------ */
/* COMMENTS BOTTOM SHEET */
/* ------------------------------------------------------------------ */

function CommentsSheet({productId, onClose }) {
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
          <button onClick={handleComment} disabled={posting} className="text-sm">
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

function ReelItem({ item, loadProduct }) {
  const [liked, setLiked] = useState(item.is_liked);
  const [likes, setLikes] = useState(item.likes_count || 0);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);


  const handleLike = async () => {
    try {
      axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/product/${item.id}/engage`,
          {type:"like",
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

            setLiked(data.data.liked)
            setLikes(data.data.likes_count)
   
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
      toast.error("Some error occurred");
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
    <div className="h-screen snap-start relative flex flex-col pt-24 mb-24">
      <div className="flex-1" />

      {/* IMAGE + HEADER */}
      <div className="flex flex-col items-center gap-4 px-4">
        <div className="flex items-center gap-3 self-start">
          <div className="w-11 h-11 rounded-full border border-white overflow-hidden flex items-center justify-center bg-black">
            {designerAvatar ? (
              <img
                src={designerAvatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm uppercase">
                {designerCallname.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-sm">@{designerCallname}</span>
        </div>

        <div className="bg-[#f3ece4] rounded-2xl overflow-hidden w-full max-w-[360px]">
          <img
            src={item.image}
            alt={item.name}
            onClick={() => loadProduct?.(item.id)}
            className="w-full object-contain"
          />
        </div>

        {/* ACTION ROW — ALIGNED TO IMAGE WIDTH */}
        <div className="w-full max-w-[360px] mx-auto px-1 mt-4">
          <div className="flex items-center justify-between">
            {/* LEFT — CUSTOMIZE */}
            <button
              onClick={() => loadProduct(item.id)}
              className="
        px-7 py-3
        rounded-full
        text-sm font-semibold
        bg-white text-black
        hover:bg-white/90
        transition
      "
            >
              Customize
            </button>

            {/* RIGHT — ICONS */}
            <div className="flex items-center gap-5">
              {/* LIKE */}
              <button  onClick={handleLike} className="flex items-center gap-1">
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
                          liked
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
                <span className="text-xs">{item.reviews_count || 0}</span>
              </button>

              {/* SHARE */}
              <button>
                <img src="/assets/Share.svg" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* HOT METER */}
        <div className="w-full max-w-[360px] mt-4">
          <HotMeter
            average={item.average_rating || 50}
            userRating={item.user_rating || null}
            onRate={(rating) => console.log("User rated:", rating)}
          />
        </div>
      </div>

      <div className="flex-1" />

   

      {/* DESCRIPTION */}
      <div className="px-6 pb-8">
        <h2 className="text-3xl font-light">{item.name}</h2>
        <p className="text-sm opacity-80 line-clamp-1">
          {item.description || "No description provided"}
        </p>

        {item.description && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-white/70 mt-1"
          >
            Read more
          </button>
        )}
      </div>

      {showComments && (
        <CommentsSheet
          productId={item.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}
