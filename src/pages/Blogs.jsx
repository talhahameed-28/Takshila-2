import React, { useState } from "react";
 import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
 

export default function Blogs() {
   const [items, setItems] = useState([
    { id: 1, img:'/assets/blog1-desktop.jpg', name: 'A New Era of Jewelry Luxury, Personalized Powered by AI', desc:"Currently, the design space is riddled with hurdles and frictions for upcoming designers in the industry; there's an advancement of technology in our industry and global supply chains, but with that, independent designers now have to work on so many hurdles to launch their own jewelry lines, and this problem becomes even more exaggerated in the global markets." },

  ]);

  return (
    <>

         <Helmet>
              <title> Takshila News & Blog – AI Jewelry Design Insights & Trends </title>
                <meta name="description"  content="Explore Takshila’s blog for the latest in custom jewelry innovation. Discover AI-driven engagement ring design trends, diamond jewelry insights, community success stories, and the future of personalized luxury."
                    />
                 <meta name="keywords" content="Takshila blog, AI jewelry trends, Custom jewelry insights, Personalized luxury blog, Community success stories, Jewelry design technology, engagement ring trends, diamond jewelry, silver jewelry" />
                  <link rel="canonical" href="https://takshila.co/blogs" />
           </Helmet>

        <div className="pt-30 pb-20 text-center text-white">
          <h1 className="text-4xl font-bold">Blogs</h1>
          <p className="text-gray-300 mt-4">
            Read the latest articles and insights from our community.
          </p>
        </div>


    <section className="pt-20 pb-20 bg-[#e5e2df]">
        <div className="container max-w-345 w-full mx-auto">
            <div className="flex flex-wrap w-full md:px-2">
                 

                  <div className="flex-75">
                      <div className="grid grid-cols-2 gap-6">
                        {items.map((item) => (
                            <div key={item.id}>
                                  <img src={item.img} className="mb-3 w-full object-cover" alt={item.name} />
                                  <h3 className="text-black text-2xl font-bold leading-[1.2] mb-2"> {item.name} </h3>
                                  <p className="text-stone-500 text-[16px]"> {item.desc} </p>
                                  <Link to="/innerBlog" className="mt-3 px-5 py-3 font-semibold text-sm rounded-full transition-all bg-green-gradiant hover:bg-[#1f332e] text-white inline-block "> Read More </Link>
                              </div>
                              )) }
                               
                      </div>
                  </div>
              
            </div>
        </div>
    </section>
    </>
  );
}
