import { useState, useEffect } from "react";
import HotMeter from "../components/HotMeter";
import axios from "axios";

export default function CommunityMobile({ jewelleryData = [], loadProduct }) {
  if (jewelleryData.length === 0) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white text-sm opacity-60">
        Loading designs...
      </div>
    );
  }

  return (
    <div
      className="bg-black h-screen overflow-y-scroll snap-y snap-mandatory text-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {jewelleryData.map((item) => (
        <ReelItem key={item.id} item={item} loadProduct={loadProduct} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMMENTS BOTTOM SHEET */
/* ------------------------------------------------------------------ */

function CommentsSheet({ productId, onClose }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setComments(data.data.product.reviews || []);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const addComment = async () => {
    if (!comment.trim() || posting) return;

    try {
      setPosting(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/${productId}/review`,
        { review: comment },
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
            review: comment,
            user: { name: "You" },
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
                <p className="text-sm text-white/80">{c.review}</p>
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
          <button onClick={addComment} disabled={posting} className="text-sm">
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
  const [liked, setLiked] = useState(item.user_liked || false);
  const [likes, setLikes] = useState(item.likes_count || 0);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const designerAvatar = item.user?.avatar || null;
  const designerCallname =
    item.user?.callname || item.user?.username || "takshila";

  return (
    <div className="h-screen snap-start relative flex flex-col pt-24">
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
              <button onClick={toggleLike} className="flex items-center gap-1">
                <img
                  src={liked ? "/assets/like2.png" : "/assets/like.png"}
                  className="w-6 h-6"
                />
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
