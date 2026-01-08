import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Orders() {
  const [tab, setTab] = useState("orders"); // "orders" or "delivered"
   const [loadingTrackingInfo, setLoadingTrackingInfo] = useState(false);
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [isCadModalOpen, setIsCadModalOpen] = useState(false)
  // const toggle =async (id) => {
  //   try {
  //     if(id==selectedOrder?.order_id) {
  //       setSelectedOrder(null)
  //       return
  //     }
  //     setLoadingTrackingInfo(false)
  //     setSelectedOrder({order_id:id})
  //     axios.defaults.withCredentials=true
  //     const {data} = await axios.get(
  //       `${
  //         import.meta.env.VITE_BASE_URL
  //       }/api/order/${id}/progress`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log(data)
  //     if(data.success) {
  //       setLoadingTrackingInfo(true)
  //       setSelectedOrder(data.data)
  //     }
  //       else toast.error("Couldn't process your request")
  //     } catch (error) {
  //     console.log(error)
  //     toast.error("Some error occurred")
  //   }
  //   // setActiveIndex(activeIndex === index ? null : index);
  // };

  


  useEffect(() => {
    
    const loadProducts=async()=>{
      try {
        axios.defaults.withCredentials=true
        const {data} = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/order`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(data)
        if(data.success){
          setOrders(data.data.orders)
          toast.success("Order information loaded")
        }
        else{
          toast.error("Couldn't process your request")
        }
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred")
      }
    }
    loadProducts()
    
  }, [])
  
  
  
  return (
    <div className="w-full min-h-screen bg-[#e5e3df] text-black flex flex-col items-center pt-20 px-4">
      {/* --- Page Title --- */}
      <h1 className="text-2xl font-semibold mb-10">Track Your Order</h1>

      {/* --- Tabs --- */}
      <div className="flex items-center justify-center space-x-16 text-lg font-medium mb-8">
        {/* My Orders */}
        <button
          onClick={() => setTab("orders")}
          className={`pb-1 ${
            tab === "orders"
              ? "text-black border-b-[1.5px] border-black"
              : "text-gray-400"
          }`}
        >
          My Orders
        </button>

        {/* Delivered */}
        <button
          onClick={() => setTab("delivered")}
          className={`pb-1 ${
            tab === "delivered"
              ? "text-black border-b-[1.5px] border-black"
              : "text-gray-400"
          }`}
        >
          Delivered
        </button>
      </div>

      {/* --- CONTENT BASED ON TAB --- */}

      {/* ---------- My Orders Tab ---------- */}
     
       {tab ==="orders" && (<div className="w-full max-w-4xl space-y-6">
           
            {orders.map(order=>(
              <div key={order.id}>
              <div   className="w-full cursor-pointer hover:scale-102 transition-all duration-200 hover:bg-[#7e7e7e] bg-[#d8d8d8] rounded-2xl p-5 flex items-center justify-between shadow-sm" onClick={() => {console.log(order);selectedOrder?.id==order.id?setSelectedOrder(null):setSelectedOrder(order)}}>
              {/* Left Side */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl">
                  <img className="w-full h-full rounded-xl object-cover" src={order.product.image} alt="order-image" />
                </div>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold"> {order.product.name} </span>
                  <span className="text-gray-600">Ordered on : {order.created_at.split(" ")[0]} </span>
                  <span className="text-gray-600">Order id : {order.order_number} </span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">${order.amount} </span>
                <span className="mt-1 text-gray-600 capitalize">{order.payment_status} </span>
              </div>
                
            </div>
             {/* {(selectedOrder && selectedOrder.id==order.id) && */}
            {(selectedOrder && selectedOrder.id==order.id) && (
              <div className="pb-3 border-bottom mb-4 border-dark">
                            <table className="table track-table bg-transparent w-full m-auto max-w-[780px] font-montserrat text-gray-600">
                                <tbody>
                                  
                                    <tr>
                                        <td > 
                                          <div className={`${selectedOrder.progress[0].is_completed?"font-bold":""}`}> 
                                            Order Status 
                                            </div>
                                        </td>
                                        <td> {selectedOrder.progress[0].is_completed?`Completed on :  ${selectedOrder.progress[0].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>  <button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="viewdetails"> View Details</button> </td>
                                        <td> 
                                          {selectedOrder.progress[0].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <div className={`${selectedOrder.progress[1].is_completed?"font-bold":""}`}> 
                                            CAD approved 
                                            </div>
                                         </td>
                                        <td> {selectedOrder.progress[1].is_completed && selectedOrder.progress[1].completed_at!=null ?`Completed on :  ${selectedOrder.progress[1]?. completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td> {selectedOrder.progress[1].started_at!=null?<button className="underline decoration-1 hover:text-zinc-900" onClick={()=>setIsCadModalOpen(true)} command="show-modal" commandfor="cadmodal"> View CAD </button>:""} </td>

                                        <td> 
                                          {selectedOrder.progress[1].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <div className={`${selectedOrder.progress[2].is_completed?"font-bold":""}`}> 
                                            Diamond sourced
                                          </div>
                                            </td>
                                        <td> {selectedOrder.progress[2].is_completed  && selectedOrder.progress[2].completed_at!=null?`Completed on :  ${selectedOrder.progress[2].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[2].is_completed?<button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="diamondsource">  View Diamond </button>:"" }</td>
                                        <td> 
                                          {selectedOrder.progress[2].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                      </tr>
                                    <tr>
                                        <td>
                                          <div className={`${selectedOrder.progress[3].is_completed?"font-bold":""}`}> 
                                            Ring status 
                                          </div>
                                           </td>
                                        <td> {selectedOrder.progress[3].is_completed && selectedOrder.progress[3].completed_at!=null?`Completed on :  ${selectedOrder.progress[3].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[3].is_completed?<button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="ringstatus">  View Info</button>:""} </td>
                                        <td> 
                                          {selectedOrder.progress[3].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[4].is_completed?"font-bold":""}`}> 
                                            Certification
                                          </div> </td>
                                        <td> {selectedOrder.progress[4].is_completed && selectedOrder.progress[4].completed_at!=null?`Completed on :  ${selectedOrder.progress[4].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[4].is_completed?<button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="certification">  View Cart </button>:""} </td>
                                        <td> 
                                          {selectedOrder.progress[4].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[5].is_completed?"font-bold":""}`}> 
                                            Shipping 
                                          </div> </td>
                                        <td> {selectedOrder.progress[5].is_completed && selectedOrder.progress[5].completed_at!=null?`Completed on :  ${selectedOrder.progress[5].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[5].is_completed?<button className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order='' command="show-modal" commandfor="shipping">  View Address </button>:""} </td>
                                        <td> 
                                          {selectedOrder.progress[5].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[6].is_completed?"font-bold":""}`}> 
                                            Delivered 
                                          </div> </td>
                                        <td> {selectedOrder.progress[6].is_completed  && selectedOrder.progress[6].completed_at!=null?`Completed on :  ${selectedOrder.progress[6].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{ selectedOrder.progress[6].is_completed?<button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="delivered">  View Address </button>:""} </td>
                                         <td> 
                                          {selectedOrder.progress[6].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                </tbody>
                            </table>   
                        </div>)
                        
                      }
                      </div>
            )
           )}



  
          
        </div>)}
     
      {/* ---------- Delivered Tab ---------- */}
      {tab === "delivered" && (
        <div className="w-full max-w-3xl flex flex-col items-center mt-16">
          <p className="text-gray-600 text-lg mb-6">No orders yet</p>

          <Link
            to="/cart"
            className="bg-[#d8d8d8] text-gray-700 px-6 py-2 rounded-full shadow 
                       hover:bg-[#cecece] transition"
          >
            Go to cart !
          </Link>
        </div>
      )}


      {/* View Details */}
      <el-dialog>
        <dialog id="viewdetails" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden -lg bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Order Details </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white font-semibold uppercase"> Payment Received </h5>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="text-white mb-0">Order Amount: $<strong>{selectedOrder?.amount}</strong>
                                        </h5>
                                    </div>
                                </div>
                                <h6 className="mb-1 text-white text-start"> Order Secured </h6>
                                <p className="text-white"> Payment verified and your build slot is reserved. </p>


                                <div className="flex flex-row mt-7 w-full">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white uppercase font-semibold"> ORDER CONFIRMED </h5>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="text-white mb-0">Order id: <strong className="block"> {selectedOrder?.order_number}</strong></h5>
                                    </div>
                                </div>
                                <h6 className="mb-3 text-white text-start"> Artisan Assigned </h6>
                                <p className="text-white"> Your order is now with our master atelier. </p>

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="viewdetails" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>




      {/* View CAD */}
      <el-dialog>
        <dialog id="cadmodal" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                           {isCadModalOpen && <CADModal id={selectedOrder?.id}/>}
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" onClick={()=>setIsCadModalOpen(false)} commandfor="cadmodal" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>



        {/* Diamond Sourced */}
      <el-dialog>
        <dialog id="diamondsource" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Diamond Sourced </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-2 text-white font-semibold uppercase"> Text Content </h5>
                                        <p className="text-white pb-3"> testing diamond source </p>

                                        <h6 className="mt-3 mb-1 text-white text-start"> Version: <strong> V1 </strong> </h6>
                                        <h6 className="mb-1 text-white text-start"> Submitted: <strong> 12/17/2025, 6:56:41 AM </strong> </h6>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h6 className="mb-1 text-white text-start"> Files </h6>
                                        <img src="https://ai-takshila-co-images.s3.eu-north-1.amazonaws.com/orders/82/diamond_sourced/v1/69420dd704b51.png" className="border border-gray-300 rounded-sm" width={230} />
                                    </div> 
                                </div>
                              
 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="diamondsource" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>



        {/* Ring Status */}
      <el-dialog>
        <dialog id="ringstatus" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Ring Status </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-2 text-white font-semibold uppercase"> Text Content </h5>
                                        <p className="text-white pb-3"> testing diamond source </p>

                                        <h6 className="mt-3 mb-1 text-white text-start"> Version: <strong> V1 </strong> </h6>
                                        <h6 className="mb-1 text-white text-start"> Submitted: <strong> 12/17/2025, 6:56:41 AM </strong> </h6>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h6 className="mb-1 text-white text-start"> Files </h6>
                                        <img src="https://ai-takshila-co-images.s3.eu-north-1.amazonaws.com/orders/82/diamond_sourced/v1/69420dd704b51.png" className="border border-gray-300 rounded-sm" width={230} />
                                    </div> 
                                </div>
                              
 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="ringstatus" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>



        
        {/* Certifications */}
      <el-dialog>
        <dialog id="certification" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Certification </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-2 text-white font-semibold uppercase"> Text Content </h5>
                                        <p className="text-white pb-3"> testing diamond source </p>

                                        <h6 className="mt-3 mb-1 text-white text-start"> Version: <strong> V1 </strong> </h6>
                                        <h6 className="mb-1 text-white text-start"> Submitted: <strong> 12/17/2025, 6:56:41 AM </strong> </h6>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h6 className="mb-1 text-white text-start"> Files </h6>
                                        <img src="https://ai-takshila-co-images.s3.eu-north-1.amazonaws.com/orders/82/diamond_sourced/v1/69420dd704b51.png" className="border border-gray-300 rounded-sm" width={230} />
                                    </div> 
                                </div>
                              
 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="certification" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>

        

         {/*  Shipping Details */}
      <el-dialog>
        <dialog id="shipping" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
               <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Shipping Details </h2>
                                <div className="flex flex-row mt-8 mb-5 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white font-semibold uppercase"> Shipping Information</h5>
                                         <p className="text-white"> Tracking and address details will appear here. </p>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="text-white mb-0"> Tracking: <strong>  {selectedOrder?.order_number} </strong>
                                        </h5>
                                    </div>
                                </div>
                              
                               <h6 className="mb-3 text-white uppercase"> Status: <span className="capitalize font-semibold"> Preparing for shipment </span>  </h6> 
                                <h6 className="mb-3 text-white uppercase"> Estimated arrival: <span className="capitalize font-semibold">  Dec 22, 2025 </span>   </h6>
                                <h6 className="mb-3 text-white uppercase"> Shipping address: <span className="capitalize font-semibold"> Laborum praesentium, Veritatis exercitati, Explicabo Consequun, CA, 63394, United </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Tracking Details: <span className="capitalize font-semibold"> No tracking details available  </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Delivery Notes:  <span className="capitalize font-semibold"> No additional notes </span> </h6> 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="shipping" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>



        {/*  Delivered Details */}
      <el-dialog>
        <dialog id="delivered" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
               <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> Delivered Details </h2>
                                <div className="flex flex-row mt-8 mb-5 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white font-semibold uppercase"> Shipping Information</h5>
                                         <p className="text-white"> Tracking and address details will appear here. </p>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="text-white mb-0"> Tracking: <strong>  ORD2025121769420C7EDFDBC </strong>
                                        </h5>
                                    </div>
                                </div>
                              
                               <h6 className="mb-3 text-white uppercase"> Status: <span className="capitalize font-semibold"> Preparing for shipment </span>  </h6> 
                                <h6 className="mb-3 text-white uppercase"> Estimated arrival: <span className="capitalize font-semibold">  Dec 22, 2025 </span>   </h6>
                                <h6 className="mb-3 text-white uppercase"> Shipping address: <span className="capitalize font-semibold"> Laborum praesentium, Veritatis exercitati, Explicabo Consequun, CA, 63394, United </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Tracking Details: <span className="capitalize font-semibold"> No tracking details available  </span> </h6>
                                <h6 className="mb-3 text-white uppercase"> Delivery Notes:  <span className="capitalize font-semibold"> No additional notes </span> </h6> 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                            </div>
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" commandfor="delivered" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>



      {/* --- Footer Help Text --- */}
      <div className="w-full max-w-3xl border-t border-gray-400 mt-10 pt-4 text-center text-gray-700 text-sm">
        Need Help? Call us Now!
      </div>
    </div>
  );
}

function CADModal({id}){
  useEffect(() => {
    const loadCADs=async()=>{
      try {
        axios.defaults.withCredentials=true
         const {data} = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/order/${id}/stages/cad_approved`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data)
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred")
      }
    }
    
    loadCADs()
    
  }, [])
  
  return (
    <div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> CAD Details </h2>
                                
                                <h6 className="mb-1 text-white text-start"> Review CAD submissions </h6>
                                  
                                   <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                       <p className="text-white pb-2"> Version: V2 </p>
                                       <p className="text-white pb-2"> Submitted: 12/17/2025, 6:55:23 AM </p>
                                        <p className="text-white"> Studio notes: submiting glb </p>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h5 className="bg-red-500 px-3 rounded-xl py-2 inline-block text-white mb-3"> Revisions Requested 
                                        </h5>
                                        <p className="text-yellow-300"> Your feedback: reject 1 </p>
                                    </div>
                                </div>  
 
                                <div className="mt-6 text-center relative flex gap-4">
                                      <img src="https://img.freepik.com/premium-photo/magic-ring_665280-62586.jpg" className="inline-block border border-gray-300 rounded-xl" width={240} />
                                       <img src="https://img.freepik.com/premium-photo/magic-ring_665280-62586.jpg" className="inline-block border border-gray-300 rounded-xl" width={240} />
                                </div>
                            </div>
  )
}
