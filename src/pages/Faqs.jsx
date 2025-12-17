
import React, { useState } from 'react';
 

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border rounded-lg">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-4 font-medium text-left"
      >
        {title}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="px-4 py-0 pb-3 text-gray-600">{content}</div>
      </div>
    </div>
  );
};

export default function Faqs() {
       const items = [
        {
          title: "1. What Exactly is Takshila?",
          content: "Takshila is a digital Client-to-Manufacturing™ platform where customers, independent designers, and master artisans co-create one-of-a-kind fine jewelry. We replace traditional middlemen with a direct, transparent loop powered by AI design tools, 3-D printing, and real-time production updates",
        },
        {
          title: "2. How is Takshila different from a luxury brand or custom jeweler?",
          content: "Traditional houses lean on mark-ups, fixed collections, and opaque supply chains. Takshila lets you design (or commission) a unique piece in minutes, tracks every step of crafting, and delivers museum-grade quality at prices typically 30–45 % below comparable retail.",
        },
        {
          title: "3. Do I need design skills to use the platform?",
          content: "No. Type a short idea or upload a sketch and our AI Design Studio generates professional 3-D concepts you can tweak in real time  . You control metals, stones, and details without any CAD experience.",
        },
         {
          title: "4. Who makes the jewelry after I approve the design?",
          content: "Each piece is 3-D-printed for precision, cast in solid gold, and hand-finished by master artisans in our vetted global network. These craftspeople earn higher-than-industry pay and receive full credit for their work.",
        },
        {
          title: "5. How long does the process take from concept to delivery?",
          content: "Initial AI concepts appear in minutes, your 3-D/AR preview is ready within hours, and finished pieces typically ship in 3–5 weeks, depending on complexity and stone sourcing .",
        },
        {
          title: "6. Are your diamonds and metals ethical?",
          content: "Yes. We use lab-grown or responsibly sourced diamonds that meet GIA or equivalent certification standards and recycle or trace all gold inputs for minimal environmental impact.",
        },
        {
          title: "7. How much can I expect to save?",
          content: "Because we buy gems at the source and skip retail mark-ups, clients usually pay 30–45 % less than they would for a comparable custom piece at a legacy brand.",
        },
        {
          title: "8. What kind of updates will I receive while my jewelry is being made?",
          content: "You’ll get time-stamped photos or short videos of key milestones—stone selection, casting, stone setting, and final polish—so you can watch your piece come to life  .",
        },
        {
          title: "9. Can designers sell on Takshila?",
          content: "Absolutely. Designers upload or AI-generate models, set margins, and earn lifetime royalties on every sale while Takshila manages production, logistics, and customer service.",
        },
        {
          title: "10. What if my ring size or specifications are off?",
          content: "We offer one complimentary resize or minor adjustment within 60 days of delivery. Additional changes are handled at transparent, at-cost rates.",
        },
        {
          title: "11. Where do you ship and how is my purchase protected?",
          content: "Takshila ships worldwide via insured express couriers; every parcel is fully tracked and requires signature on delivery.",
        },
        {
          title: "12. What payment methods and security do you provide?",
          content: "We accept major credit cards and secure crypto options. All transactions are processed through PCI-compliant gateways with 256-bit encryption for maximum safety.",
        },
      ];


        const [openIndex, setOpenIndex] = useState(null);

        
      return (
            <>
            <section className="bg-[#e5e2df]">
              <div className="max-w-5xl font-serif mx-auto px-6 md:px-10 py-32 leading-relaxed text-[#1a1a1a]/90 terms-content">
                     <h1 className="text-3xl md:text-4xl font-light mb-6"> Frequently Asked Questions </h1>
              
                      <div className="mx-auto space-y-2">
                        {items.map((item, index) => (
                          <AccordionItem
                            key={index}
                            {...item}
                            isOpen={openIndex === index}
                            onClick={() =>
                              setOpenIndex(openIndex === index ? null : index)
                            }
                          />
                        ))}
                      </div> 

                    </div>
                </section>        
                            </>
    );
}
