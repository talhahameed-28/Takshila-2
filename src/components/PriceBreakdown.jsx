import { useState } from "react";

export default function PricingBreakdownModal({setShowBreakdown,breakdown}) {
  const [openSections, setOpenSections] = useState({
    raw: false,
    crafting: false,
    designer: false,
    cert: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      

      {/* Modal */}
      
        <div onClick={()=>setShowBreakdown(false)} className="fixed inset-0 z-51 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div onClick={(e)=>e.stopPropagation()} className="w-full h-[75vh] no-scrollbar overflow-auto max-w-md rounded-xl bg-[#8f8f8f] p-6 shadow-xl">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-teal-200">
                Pricing Breakdown:
              </h2>
              <div className="mt-2 flex justify-between text-xl font-semibold text-white">
                <span>Price:</span>
                <span>${breakdown.totalPriceWithRoyalties}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="mt-4 space-y-3">
              {/* Raw Material */}
              <div className="border-b border-white/20 pb-3">
                <button
                  onClick={() => toggleSection("raw")}
                  className="flex w-full justify-between text-lg text-white"
                >
                <div className="flex gap-1">
                    <img src="/assets/rawMaterial.svg" alt="" />
                  <span>Raw Material</span>
                  <img className={`${openSections["raw"]==true?"":"-rotate-90"}`} src="/assets/chevron.svg" alt="" />

                    </div>
                  <span className="text-teal-200">${(Number(breakdown.breakdown.qualityCost) + Number(breakdown.breakdown.metalCost) + Number(breakdown.breakdown.rodiumCost)).toFixed(2)}</span>
                </button>

                {openSections.raw && (
                  <div className="mt-2 space-y-1 pl-4 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Diamond</span>
                      <span>${breakdown.breakdown.qualityCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metal</span>
                      <span>${breakdown.breakdown.metalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rhodium</span>
                      <span>${breakdown.breakdown.rodiumCost}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Crafting Charges */}
              <div className="border-b border-white/20 pb-3">
                <button
                  onClick={() => toggleSection("crafting")}
                  className="flex w-full justify-between text-lg text-white"
                >
                     <div className="flex gap-1">
                    <img src="/assets/craftingCharges.svg" alt="" />

                  <span>Crafting Charges</span>
                  <img className={`${openSections["crafting"]==true?"":"-rotate-90"}`} src="/assets/chevron.svg" alt="" />

                    </div>
                  <span className="text-teal-200">${(Number(breakdown.breakdown.workingChargesCost)+ Number(breakdown.breakdown.diamondSettingCost)).toFixed(2)}</span>
                </button>

                {openSections.crafting && (
                  <div className="mt-2 space-y-1 pl-4 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Working Charges</span>
                      <span>${breakdown.breakdown.workingChargesCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diamond Setting</span>
                      <span>${breakdown.breakdown.diamondSettingCost}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Designer Payout */}
              <div className="border-b border-white/20 pb-3">
                <button
                  onClick={() => toggleSection("designer")}
                  className="flex w-full justify-between text-lg text-white"
                >
                    <div className="flex gap-1">
                    <img src="/assets/designerPayout.svg" alt="" />

                  <span>Designer Payout</span>
                  <img className={`${openSections["designer"]==true?"":"-rotate-90"}`} src="/assets/chevron.svg" alt="" />

                    </div>
                  <span className="text-teal-200">${(Number(breakdown.royalties)+Number(breakdown.commission)).toFixed(2)}</span>
                </button>

                {openSections.designer && (
                  <div className="mt-2 space-y-1 pl-4 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Royalties</span>
                      <span>${breakdown.royalties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission</span>
                      <span>${breakdown.commission}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Certification & Shipment */}
              <div className="border-b border-white/20 pb-3">
                <button
                  onClick={() => toggleSection("cert")}
                  className="flex w-full justify-between text-lg text-white"
                >
                <div className="flex gap-1">
                    <img src="/assets/certAndShip.svg" alt="" />

                  <span className="text-nowrap">Certification & Shipment</span>
                  <img className={`${openSections["cert"]==true?"":"-rotate-90"}`} src="/assets/chevron.svg" alt="" />

                    </div>
                  <span className="text-teal-200">${(Number(breakdown.breakdown.certificationCost) + Number(breakdown.breakdown.shipmentCost)).toFixed(2)}</span>
                </button>

                {openSections.cert && (
                  <div className="mt-2 space-y-1 pl-4 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Certification</span>
                      <span>${breakdown.breakdown.certificationCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipment incl. Insurance</span>
                      <span>${breakdown.breakdown.shipmentCost}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between pt-2 text-lg text-white">
                <div className="flex gap-1">

                <img src="/assets/platformFee.svg" alt="" />

                <span>Platform Fee</span>
                </div>
                <span className="text-teal-200">$289.56</span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowBreakdown(false)}
              className="mt-4 w-full rounded-lg bg-teal-500 py-2 font-semibold text-black hover:bg-teal-400"
            >
              Close
            </button>
          </div>
        </div>
      
    </>
  );
}
