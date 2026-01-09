import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ShippingAndDeliveryModal = ({modalStage, id,setModalStage}) => {
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
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
    return (
    <div id="shipping" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
               <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                             {loading?<div className="flex flex-col items-center justify-center py-10">
                            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

                            <p className="mt-4 text-sm text-black text-center max-w-xs">
                            Loading {modalStage=="shipping"?"shipping details":modalStage=="delivered"?"delivery details":""}
                            </p>
                        </div>:<div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> {modalStage=="shipping"?"Shipping Details":modalStage=="delivered"?"Delivery Details":""} </h2>
                                <div className="flex flex-row mt-8 mb-5 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white font-semibold uppercase"> Shipping Information</h5>
                                         <p className="text-white"> Tracking and address details will appear here. </p>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="text-white mb-0"> Tracking: <strong>  {details?.tracking_number || "Loading..."}</strong>
                                        </h5>
                                    </div>
                                </div>
                              
                               <h6 className="mb-3 text-white uppercase"> Status: <span className="capitalize font-semibold">  {details?.shipping_status || "Loading..."} </span>  </h6> 
                                <h6 className="mb-3 text-white uppercase"> Estimated arrival: <span className="capitalize font-semibold">  Dec 22, 2025 </span>   </h6>
                                <h6 className="mb-3 text-white uppercase"> Shipping address: <span className="capitalize font-semibold"> {String.prototype.concat(details?.shipping_address.address,", ",details?.shipping_address.city,", ",details?.shipping_address.state,", ",details?.shipping_address.zip,", ",details?.shipping_address.country,)} </span> </h6>
                                {details?.shipping_address.address2!=null && <h6 className="mb-3 text-white uppercase"> Shipping address2: <span className="capitalize font-semibold"> {String.prototype.concat(details?.shipping_address.address2,", ",details?.shipping_address.city,", ",details?.shipping_address.state,", ",details?.shipping_address.zip,", ",details?.shipping_address.country,)} </span> </h6>}                           
                                <h6 className="mb-3 text-white uppercase"> Tracking Details: <span className="capitalize font-semibold"> {details?.tracking_details || "No additional details"}  </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Delivery Notes:  <span className="capitalize font-semibold"> {details?.delivery_notes || "No additional notes"} </span> </h6> 

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
            </el-dialog-panel>
          </div>
        </div>
  )
}

export default ShippingAndDeliveryModal
