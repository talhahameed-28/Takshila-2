import React, { useState } from "react";

export default function Blogs() {
   const [items, setItems] = useState([
    { id: 1, img:'https://takshila.co/cdn/shop/articles/artisian_1_Desktop_1728x.jpg?v=1747693332', name: 'Experience Unparalleled Luxury at Exceptional Value with TAKSHILA ', desc:'In the world of luxury jewelry, customization, premium materials, and masterful craftsmanship often come with a substantial price tag. At TAKSHILA, we challenge this notion by making personalized, high-end jewelry accessible without compromising on quality.' },
    { id: 2, img:'https://takshila.co/cdn/shop/articles/riding_the_wave_desktop_1728x.jpg?v=1747691802', name: 'Embark on an Effortless Journey to Your Personalized Masterpiece', desc:'At Takshila, we believe that crafting your own bespoke jewelry should be an exhilarating and seamless experience. Whether you`re envisioning a one-of-a-kind piece for a momentous occasion or indulging in a creation that reflects your unique essence.' }
  ]);

  return (
    <>
    <div className="pt-30 pb-20 text-center text-white">
      <h1 className="text-4xl font-bold">Blogs</h1>
      <p className="text-gray-300 mt-4">
        Read the latest articles and insights from our community.
      </p>
    </div>


    <section className="pt-20 pb-20 bg-[#e5e2df]">
        <div className="container max-w-[1380px] w-full mx-auto">
            <div className="flex flex-wrap w-full md:px-2">
                 

                  <div className="flex-75">
                      <div className="grid grid-cols-2 gap-6">
                        {items.map((item) => (
                            <div key={item.id}>
                                  <img src={item.img} className="mb-3 w-full h-[330px] object-cover" />
                                  <h3 className="text-black text-2xl font-bold leading-[1.2] mb-2"> {item.name} </h3>
                                  <p className="text-stone-500 text-[16px]"> {item.desc} </p>
                                  <a href="#" className="mt-3 px-5 py-3 font-semibold text-sm rounded-full transition-all bg-[#2E4B45] hover:bg-[#1f332e] text-white inline-block "> Read More</a>
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
