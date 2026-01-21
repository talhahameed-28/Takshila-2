import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ShippingAndDeliveryModal = ({modalStage, id,setModalStage}) => {
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const LINK_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  useEffect(() => {
    const loadShipping=async()=>{
      try {

        axios.defaults.withCredentials=true
         const {data} = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/order/${id}/stages/${modalStage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data)
      if(data.success){
        toast.success("Submissions fetched successfully")
        setDetails(data.data.stage.details)
      }else{
        toast.error("Couldn't fetch submissions")
      }
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }finally{
      setLoading(false)
    }
  }
  
  loadShipping()
  
}, [])
  function parseTextWithLinks(text) {
    console.log(text)
    if(text==null) return "-"
    const parts = text.split(LINK_REGEX);
    console.log(parts)
    return parts.map((part, index) => {
      // If part matches link regex
      if (part.match(LINK_REGEX)) {
        const href = part.startsWith("http")
          ? part
          : `https://${part}`;

        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {part}
          </a>
        );
      }

      // Normal text
      return (
        <span key={index}>
          {part }
        </span>
      );
    });
  }
return (
  <div id="shipping" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

          <div tabIndex="0" className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center sm:p-0">
            <div className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
               <div className="px-3 sm:px-6 pt-6 sm:pt-9 pb-4 sm:pb-6 max-h-[60vh] sm:max-h-[85vh] overflow-y-auto">
                             {loading?<div className="flex flex-col items-center justify-center py-10">
                            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

                            <p className="mt-4 text-sm text-black text-center max-w-xs">
                            Loading {modalStage=="shipping"?"shipping details":modalStage=="delivered"?"delivery details":""}
                            </p>
                        </div>:<div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> {modalStage=="shipping"?"Shipping Details":modalStage=="delivered"?"Delivery Details":""} </h2>
                                <div className="flex flex-wrap flex-row mt-8 mb-5 w-full sm:justify-center">
                                    <div className="w-full sm:basis-1/2 ">
                                        <h5 className="mb-3 text-white font-semibold uppercase"> Shipping Information</h5>
                                         <p className="text-white"> Tracking and address details will appear here. </p>
                                    </div>
                                    <div className="w-full sm:basis-1/2 sm:text-end shrink-0 whitespace-normal wrap-break-word">
                                        <h5 className="text-white mb-0 text-wrap"> Tracking: <strong className='block'>  {parseTextWithLinks(details?.tracking_number ) || "Loading..."}</strong>
                                        </h5>
                                    </div>
                                </div>
                              
                               <h6 className="mb-3 text-white uppercase"> Status: <span className="capitalize font-semibold">  {details?.shipping_status || "Loading..."} </span>  </h6> 
                                <h6 className="mb-3 text-white uppercase"> Estimated arrival: <span className="capitalize font-semibold">  Dec 22, 2025 </span>   </h6>
                                <h6 className="mb-3 text-white uppercase"> Shipping address: <span className="capitalize font-semibold"> {String.prototype.concat(details?.shipping_address.address,", ",details?.shipping_address.city,", ",details?.shipping_address.state,", ",details?.shipping_address.zip,", ",details?.shipping_address.country,)} </span> </h6>
                                {details?.shipping_address.address2!=null && <h6 className="mb-3 text-white uppercase"> Shipping address2: <span className="capitalize font-semibold"> {String.prototype.concat(details?.shipping_address.address2,", ",details?.shipping_address.city,", ",details?.shipping_address.state,", ",details?.shipping_address.zip,", ",details?.shipping_address.country,)} </span> </h6>}                           
                                <h6 className="mb-3 text-white uppercase"> Tracking Details: <span className="capitalize font-semibold"> {parseTextWithLinks(details?.tracking_details) || "No additional details"}  </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Delivery Notes:  <span className="capitalize font-semibold"> {parseTextWithLinks(details?.delivery_notes) || "No additional notes"} </span> </h6> 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>}
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button onClick={()=>setModalStage("")} type="button" command="close" commandfor="shipping" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ShippingAndDeliveryModal
