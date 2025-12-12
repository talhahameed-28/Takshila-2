import { useEffect } from "react";



export default function Shippingpolicy() {
    
      return (
            <>
            <section className="bg-[#e5e2df]">
              <div className="max-w-5xl font-serif mx-auto px-6 md:px-10 py-32 leading-relaxed text-[#1a1a1a]/90 terms-content">
                     <h1 className="text-3xl md:text-4xl font-light mb-6"> Shipping Policy</h1>
              
                        <ul>
                        <li>
                        <strong> Shipping Locations:</strong> Initially, Takshila ships jewelry orders within the United States. We are looking to serve a global customer base; if you are outside the U.S., please check our shipping policy or contact us to confirm if we can ship to your country and any special terms that may apply (like duties or restrictions). </li>
                        <li>
                        <strong> Delivery Times:</strong> Any delivery timeframes provided (e.g., 4-6 weeks for custom jewelry creation) are estimates. Custom-designed jewelry often requires a production period before shipping. While we strive to meet estimated timelines, actual delivery dates may vary due to factors like the complexity of the design, artisan scheduling, supply of materials, or shipping carrier delays. Takshila is not liable for delays in delivery, but we will communicate with you and work to resolve any significant delays. </li>
                        <li>
                        <strong> Shipping Carriers and Costs:</strong> We use reputable shipping carriers (UPS, FedEx, USPS, etc.) to deliver products. Shipping options and costs will be presented at checkout. Any free shipping offers will be subject to stated conditions (such as minimum purchase amounts or limited to certain regions). </li>
                        <li> <strong> Risk of Loss: </strong> Title to products and risk of loss or damage passes to the customer upon delivery of the item to the address specified in the order. We typically require a signature upon delivery for high-value jewelry shipments to ensure receipt. If an item is lost or damaged in transit, please notify us immediately so we can assist in filing a claim with the carrier. We insure most shipments for their value, but you must report any loss or damage promptly to be eligible for coverage. </li>
                        <li> <strong> International Shipments:</strong> For orders shipped outside of the U.S., you are considered the importer of record. This means you are responsible for any import duties, taxes, or customs clearance fees that may be imposed by your country. We have no control over these charges and cannot predict their amount. Customs policies vary widely, so you should contact your local customs office for information. Additionally, international shipments may be subject to opening and inspection by customs authorities. </li>
                        <li> <strong> Incorrect Addresses: </strong> Please ensure your shipping address is correct and complete. We cannot guarantee delivery if the address provided was incorrect or insufficient. If a package is returned to us due to an addressing error or because it was unclaimed, we will contact you for an updated address, and additional shipping fees may apply for re-delivery. </li>
                        <li>
                        <strong> Notification of Delivery Issues: </strong> Upon receipt of your order, please inspect the items. If you believe any product is missing, incorrect, or damaged upon arrival, contact Takshila Customer Support within 5 business days of delivery to report the issue . We will work with you to investigate and resolve the problem. Failure to notify us of shipping or delivery issues in a timely manner may limit our ability to assist. </li>
                        </ul>
                        <h3 className="text-2xl font-bold mb-2 mt-2"> 2. Custom and Personalized Orders</h3>
                        <ul>
                        <li> <strong>Definition of Personalized Products:</strong> Any jewelry piece that is custom-made or altered specifically for a customer is considered a Personalized Item. This includes but is not limited to: 
                        <ul>
                            <li> Jewelry designs generated or customized using Takshila’s AI design feature (based on your prompt or specifications). </li>
                            <li> Designs uploaded by a customer or designer from an outside source (e.g., you upload an image or CAD file of a design you want made). </li>
                            <li> Community-sourced designs (any design posted on Takshila’s community page/marketplace by an independent designer, which you order). </li>
                            <li> Modifications to an existing Takshila catalog product at your request (such as non-standard ring sizes, engraving, changing a gemstone, increasing diamond size or quality, or other design alterations). </li>
                        </ul>
                            </li>
                        <li>
                        <strong> One-of-a-Kind Creation:</strong> Personalized Items are made uniquely for you and have limited resale value to others. Accordingly, all sales of Personalized Items are final. No cancellations or returns are permitted once production has begun on a custom order. We cannot accept returns or offer full refunds for custom-made jewelry simply for change of heart, as these pieces are tailored to your specifications and cannot be restocked or resold. </li>
                        <li>
                        <strong> Exceptional Cancellation/Return Policy:</strong> In rare cases, and at Takshila’s sole discretion, we may agree to cancel a custom order or accept a return of a Personalized Item. Typically, this would only occur before production has significantly progressed, or in situations of severe dissatisfaction where we choose to make an exception for customer service reasons. If a cancellation or return of a Personalized Item is authorized by us, any refund will be subject to deductions. Takshila will deduct from the refund an amount sufficient to cover all costs incurred up to that point, including but not limited to:
                        <ul>
                            <li> Designer or design commission costs for the work done on the design. </li>
                        <li> Artisan labor costs and fees for any work already completed. </li>
                        <li> Costs of materials that have been purchased or used (precious metals,
                        gemstones, etc.). </li>
                        <li> Any unrecoverable third-party fees or expenses. Only the remaining balance (if any) after such deductions would be refunded to the customer. In some cases, instead of a refund, we might offer credit toward a different purchase as a courtesy. </li>
                        </ul>
                        </li>
                        <li> <strong> Changes to Custom Orders:</strong> Once you approve a design and place a custom order, any requested changes (e.g., altering the design, material, size) are subject to our approval and may incur additional charges and time. If the custom piece is already in production, changes might not be possible. We will communicate with you about any feasibility of changes and associated costs. </li>
                        <li>
                        <strong> Representation of Designs: </strong> We work hard to translate custom designs from concept to reality. However, you acknowledge that for Personalized Items, especially those based on AI-generated images or user-uploaded designs, the final crafted jewelry may have minor differences from the initial concept image. These differences can result from practical considerations in manufacturing, material properties, or compliance with safety and durability standards. Such minor deviations are not considered defects or misrepresentations. We consider a custom piece successfully made if it matches the agreed specifications in all material
                        aspects (metal type and purity, gemstone type, carat weight, ring size, engraving content, etc.) even if there are slight artistic or structural adjustments made in crafting. </li>
                        <li>
                        <strong> No Implied Approval of Design Legality:</strong> Our acceptance of a custom design order (whether AI-generated, user-uploaded, or community-sourced) does not imply that Takshila has determined the design to be non-infringing or lawful. We do not guarantee that your custom design does not infringe others’ intellectual property (see Section 8 on user responsibilities for design content). We primarily rely on your representations that you have the rights to use and commission the design. If we later discover or are notified that a design may violate someone’s rights or any law, we reserve the right to halt production, cancel the order, and/or refrain from delivering the item until the issue is resolved. In such case, we will work with you on a fair resolution, which may include obtaining permissions, altering the design, or issuing a refund minus any costs already incurred. (Also see Section 8 and 9 regarding user warranties and Takshila’s rights in these scenarios.) </li> 
                        </ul>
                        <h3 className="text-2xl font-bold mb-2 mt-2"> 3. CAD Model Approval Process </h3>
                        <p> For all custom jewelry orders—including AI-generated designs, community-sourced designs, user-uploaded content, or modifications to Takshila’s existing catalog designs—Takshila will first produce a Computer-Aided Design (CAD) Model incorporating the design specifications </p>
                        <ul>
                        <li> The CAD model will be shared with the customer for review prior to beginning production. </li>
                        <li> At this stage, the customer may request modifications to the design. Takshila will make reasonable efforts to accommodate such changes and may revise the price of the final product accordingly to reflect the updated design, materials, or complexity.</li>
                        <li> Once the customer confirms approval of the CAD model and the final price,the order is locked in. No further changes to the design, size, materials, or specifications will be accepted. </li>
                        <li> Upon final approval, Takshila will begin procuring raw materials and initiating the crafting process. Due to the personalized nature of these products, no further modifications or cancellations will be possible after this point. </li>
                        </ul>
                        <p><strong> Important: </strong> By placing a custom jewelry order with Takshila, you acknowledge and agree to the above conditions. This policy ensures that we can continue offering bespoke creative services while safeguarding Takshila from undue losses on items crafted to unique customer specifications. </p>
                        
                    </div>
                </section>        
                            </>
    );
}
