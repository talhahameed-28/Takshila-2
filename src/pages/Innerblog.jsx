import { Link } from "react-router-dom";

export default function InnerBlog() {
    return(
        <>  
           <div className="bg-[#e5e2df] min-h-screen font-serif text-[#1a1a1a]">

                    <section className="text-center pt-30 mb-12">
                    <h1 className="text-5xl font-normal tracking-wide text-[#1a1a1a]">
                           Blog Takshila
                    </h1>
                    
                </section>

                    <div className="container max-w-[800px] w-full mx-auto pb-10 md:px-0 px-4">
                                <div className="w-full">
                                        <img src="assets/blog1-desktop.jpg" className="w-full mb-3" alt="Jewelry Luxury, Personalized" />
                                        <h1 className="text-xl md:text-4xl font-medium mb-4 w-full"> A New Era of Jewelry Luxury, Personalized Powered by AI </h1>
                                        <p className="text-zinc-700 mt-4 leading-[1.5]">  Currently, the design space is riddled with hurdles and frictions for upcoming designers in the industry; there's an advancement of technology in our industry and global supply chains, but with that, 
                                            independent designers now have to work on so many hurdles to launch their own jewelry lines, and this problem becomes even more exaggerated in the global markets. This is exactly the problem we set out to solve at Takshila by providing students with a zero-risk launch pad for their vision and creativity. </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]">  Takshila is a simple social marketplace, it is a platform focused on amplifying Peer to peer trade, by creating shared economies and Communities. Think of collaboration, helping each other in creating better unique products, that’s the vibe we want create, when you shop online
                                            Takshila’s approach is not a niche unique solution for a particular problem, instead Takshila takes an industry’s entire supply-chain vertical, and brings every contributor in one place, allowing them to work together on unique individual projects.  </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]"> Starting with the Jewelry industry; we bring three groups of people together, and solve unique problems for each group. Customer, Designers and Artisans - elevating everyone’s digital experience and enhancing collaboration effortlessly.
                                        </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]"> For Customers, Takshila redefines Personal Luxury; With its new Client-to-manufacturing model, at Takshila you don’t just choose a diamond, an off the shelf setting, but you get complete control, from vision to execution, to create completely new and personalized pieces just for you.  You decide the look, select the materials, choose the quality of craftsmanship. You design the jewelry either as a simple doodle on a page, or you can create your own unique design using our AI Designer, by simply prompting it, with your design details. 
                                            Once, you put in the order the experience doesn’t end, instead you come on the journey to see your vision shape reality. You get CAD models to approve design, when we source a diamond, you get early glimpses of it, as we shape and polish your jewelry, neatly set the diamond you get the sneak peaks, behind the scenes footage - a truly personal experience, crafted just for you. On the cost front, while luxury brands charge 5 to 6X margins on each product, Takshila’s peer-to-peer approach by connecting customers directly with manufactures, provides prices about 20-30% lower than industry standards. With Personalized products, experiences and lower prices, Takshila’s Client-to Manufacturer model is hands down; the best in the industry.  </p>
                                

                                        <p className="text-zinc-700 mt-2 leading-[1.5]"> For Designers, Takshila becomes a zero-risk launchpad; You can launch your own jewelry line in minutes, with $0, tonight! You get total ownership of your IP rights, you earn Royalties and Commissions on every sale, and Takshila takes care of the entire manufacturing process with its network of Artisans, including procuring raw materials, at no cost to designers. 
                                            Think of all the friction it takes, in creating a jewelry brand today; you start with design, but then you have to think of manufacturing, finding artisan, buying expensive raw materials, work on supply-chain, shipment and certification. Takshila provides an unique opportunity, where all you need is a design and Takshila will take care of the rest, if you don’t have a design ready, you simply create one using the AI Designer and share it on Community. All that friction is reduced to an idea, if you can think of jewelry, we can craft and deliver it to your customers. On Takshila, you don’t just sell your designs, but you engage with your audience, work hand-in-hand with your customers, they like and comment on your design, helping you refine and improve the design or work with them individually on their unique creation. What Youtube did for Content creators, Takshila can do the same for designers by providing them the platform and the audience to capitalize  on what they do Best!  </p>
                                
                                
                                        <p className="text-zinc-700 mt-2 leading-[1.5]"> 
                                            For artisans Takshila becomes a platform to connect with customers and collaborate with designers. Artisans choose their own price, choose the orders they want to work on, bring their customers on the journey, so the cost to the buyers can appreciate their craft, and work hand in hand with designers to create new trending designs. This approach removes all the middleman between artisan and customer, allowing artisans to. Higher profit margins, while peace while keeping the price competitive for their customers.
                                        </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]"> Takshila is not just an enhancement to online shopping, it is a completely new digital experience.
                                        </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]">
                                            Takshila exists to bring people closer to creation—to turn ideas into heirlooms, sketches into statements, and creativity into opportunity. Whether you’re a customer dreaming of a piece that tells your story, a designer ready to launch your first collection without risk, or an artisan eager to showcase your craft to the world—this is your invitation.
                                        </p>

                                        <p className="text-zinc-700 mt-2 leading-[1.5]">
                                            Create, collaborate, and follow the journey as your vision comes to life—step by step, stone by stone. Join a community where creativity is rewarded, craftsmanship is celebrated, and luxury finally feels personal.
                                        </p>

                                            <p className="text-zinc-700 mt-2 leading-[1.5]">
                                                <strong> Design it. Craft it. Share it. Own it.</strong><br/> Welcome to Takshila. 
                                            </p>

                                            <p className="text-zinc-700 mt-2">
                                            <Link to="/" className="text-[#4A4A4A]"> #Start with a design  </Link> 
                                            <Link to="/" className="px-2 text-[#4A4A4A]"> #Personalize your jewelry today  </Link> 
                                            <Link to="/" className="text-[#4A4A4A]">  #Launch your own brand in minutes </Link> 
                                            </p>
                                    </div>
  
                    </div>
                </div>
        </>
    );
}
 