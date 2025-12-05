import React from "react";

export default function StoriesSection() {
  const stories = [
    {
      img: "assets/story1.webp",
      date: "14 MAY",
      label: "NEWS",
      headline:
        "Experience Unparalleled Luxury at Exceptional Value with TAKSHILA",
      description:
        "In the world of luxury jewelry, customization, premium materials, and masterful craftsmanship often come with a substantial price tag. At TAKSHILA, we challenge this notion by making personalized, high-end jewelry accessible without compromising on quality.",
    },
    {
      img: "assets/story2.webp",
      date: "10 MAR",
      label: "NEWS",
      headline:
        "Embark on an Effortless Journey to Your Personalized Masterpiece",
      description:
        "At Takshila, we believe that crafting your own bespoke jewelry should be an exhilarating and seamless experience. Whether you’re envisioning a one-of-a-kind piece for a momentous occasion or indulging in a creation that reflects your unique essence, we make the process effortless.",
    },
  ];

  return (
    <section
      className="
        bg-[#e5e2df] 
        min-h-screen 
        flex 
        justify-center 
        items-center 
        px-6 
        md:px-16 
        py-10 
        overflow-hidden
      "
    >
      <div
        className="
          max-w-[1500px] 
          w-full 
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-10
        "
      >
        {stories.map((story, index) => (
          <div
            key={index}
            className="
              bg-[#d8d6d3] 
              rounded-xl 
              overflow-hidden 
              shadow-lg 
              hover:shadow-2xl 
              transition-shadow 
              duration-300 
              h-[80vh] 
              flex 
              flex-col
            "
          >
            {/* Image Section */}
            <div className="relative flex-grow">
              <img
                src={story.img}
                alt={story.headline}
                className="
                  w-full 
                  h-full 
                  object-cover 
                  rounded-t-xl
                "
              />
              {/* Date Badge */}
              <div
                className="
                  absolute 
                  top-4 
                  left-4 
                  bg-white 
                  text-black 
                  text-center 
                  font-semibold 
                  rounded-full 
                  w-14 
                  h-14 
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  shadow-md
                "
              >
                <span className="text-lg leading-none">
                  {story.date.split(" ")[0]}
                </span>
                <span className="text-[10px]">{story.date.split(" ")[1]}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 bg-[#d8d6d3]">
              <span
                className="
                  text-xs 
                  bg-black 
                  text-white 
                  px-2 
                  py-1 
                  uppercase 
                  tracking-wider 
                  rounded-sm
                "
              >
                {story.label}
              </span>
              <h2
                className="
                  mt-3 
                  text-xl 
                  font-semibold 
                  leading-snug 
                  text-[#1a1a1a]
                "
              >
                {story.headline}
              </h2>
              <p
                className="
                  text-sm 
                  text-gray-700 
                  mt-3 
                  mb-4 
                  leading-relaxed
                "
              >
                {story.description}
              </p>
              <a
                href="#"
                className="
                  text-sm 
                  font-medium 
                  underline 
                  hover:text-gray-900 
                  transition-colors
                "
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
