import { useState } from "react";
import HotMeter from "../components/HotMeter";

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
/* SINGLE REEL ITEM */
/* ------------------------------------------------------------------ */

function ReelItem({ item, loadProduct }) {
  const [liked, setLiked] = useState(item.user_liked || false);
  const [likes, setLikes] = useState(item.likes_count || 0);
  const [expanded, setExpanded] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const designerAvatar = item.user?.avatar || null;
  const designerCallname =
    item.user?.callname || item.user?.username || "takshila";

  return (
    <div className="h-screen snap-start relative flex flex-col">
      {/* BACKDROP */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* EXPANDED DESCRIPTION OVERLAY */}
      {expanded && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-light tracking-wide mb-2">
            {item.name}
          </h2>

          <p className="text-sm opacity-90 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

      {/* TOP FLEX */}
      <div className="flex-1" />

      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center gap-4 px-4 relative z-30">
        {/* AVATAR + CALLNAME */}
        <div className="flex items-center gap-3 self-start">
          <div className="w-11 h-11 rounded-full border border-white overflow-hidden flex items-center justify-center bg-black">
            {designerAvatar ? (
              <img
                src={designerAvatar}
                alt={designerCallname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm uppercase">
                {designerCallname.charAt(0)}
              </span>
            )}
          </div>

          <span className="text-white text-sm font-light">
            @{designerCallname}
          </span>
        </div>

        {/* IMAGE */}
        <div className="bg-[#f3ece4] rounded-2xl overflow-hidden w-full max-w-[360px]">
          <img
            src={item.image}
            alt={item.name}
            onClick={() => loadProduct?.(item.id)}
            className="w-full object-contain"
          />
        </div>
      </div>

      <HotMeter
        average={item.average_rating || 50}
        userRating={item.user_rating || null}
        onRate={(rating) => {
          console.log("User rated:", rating);

          // axios.post("/api/rate", {
          //   productId: item.id,
          //   rating,
          // });
        }}
      />

      {/* BOTTOM FLEX */}
      <div className="flex-1" />

      {/* ACTION ICONS */}
      <div className="absolute right-5 bottom-10 flex flex-col items-center gap-6 z-30">
        <button onClick={() => loadProduct(item.id)}>
          <img src="/assets/edit.png" alt="Edit" className="w-6 h-6" />
        </button>

        <button onClick={toggleLike} className="flex flex-col items-center">
          <img
            src={liked ? "/assets/like2.png" : "/assets/like.png"}
            alt="Like"
            className="w-7 h-7"
          />
          <span className="text-xs mt-1">{likes}</span>
        </button>

        <button
          onClick={() => loadProduct?.(item.id)}
          className="flex flex-col items-center"
        >
          <img src="/assets/comments.png" alt="Comments" className="w-6 h-6" />
          <span className="text-xs mt-1">{item.reviews_count || 0}</span>
        </button>

        <button>
          <img src="/assets/Share.svg" alt="Share" className="w-6 h-6" />
        </button>
      </div>

      {/* COLLAPSED DESCRIPTION (HIDDEN WHEN EXPANDED) */}
      <div
        className={`relative z-30 px-6 pb-8 transition-opacity duration-200 ${
          expanded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h2 className="text-3xl font-light tracking-wide">{item.name}</h2>

        <p className="text-sm opacity-80 leading-relaxed line-clamp-1">
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
    </div>
  );
}
