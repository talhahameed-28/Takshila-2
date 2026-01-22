import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import CADModal from "../components/CADModal";
import GeneralTrackingModal from "../components/GeneralTrackingModal";
import ShippingAndDeliveryModal from "../components/ShippingAndDeliveryModal";

export default function Orders() {
  const [tab, setTab] = useState("orders"); // "orders" or "delivered"
   const [loadingTrackingInfo, setLoadingTrackingInfo] = useState(false);
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalStage, setModalStage] = useState("")

  const completedOrders=orders?.filter(o => o.progress[5]?.is_completed) || [];

  useEffect(() => {
    setSelectedOrder(null)
  }, [tab])
  

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
              <div className={` transition-all ${selectedOrder!=null?"":"hover:bg-[#7e7e7e]"} duration-200 hover:scale-102 bg-[#d8d8d8] rounded-2xl shadow-sm `} key={order.id}>
              <div
                className={`w-full cursor-pointer transition-all ${selectedOrder!=null?"hover:bg-[#7e7e7e]":""}  duration-200 rounded-2xl  px-1 py-2 md:p-5 flex items-center justify-between `}
                onClick={() => {
                  selectedOrder?.id == order.id
                    ? setSelectedOrder(null)
                    : setSelectedOrder(order);
                }}
              >
                {/* Left Side */}
                <div className="flex items-start space-x-2 min-w-0 flex-1"> {/* ✅ */}
                  <div className="w-16 h-16 bg-white rounded-xl shrink-0"> {/* ✅ */}
                    <img
                      className="w-full h-full rounded-xl object-cover"
                      src={order.product.image}
                      alt="order-image"
                    />
                  </div>

                  <div className="flex flex-col text-sm min-w-0"> {/* ✅ */}
                    <div className="text-xs sm:text-base break-words whitespace-normal font-semibold"> {/* ✅ */}
                      {order.product.name}
                    </div>

                    <div className="text-xs sm:text-base w-fit text-gray-600">
                      Ordered on : {order.created_at.split(" ")[0]}
                    </div>

                    <div className="text-xs sm:text-base w-fit text-gray-600">
                      Order id : {order.order_number}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-xs md:text-base flex flex-col flex-wrap text-right shrink-0"> {/* ✅ */}
                  <span className="font-semibold ">
                    ${order.amount}
                  </span>
                  <span className="mt-1  sm:text-end text-gray-600 capitalize">
                    {order.payment_status}
                  </span>
                </div>
              </div>
                  {(order.payment_status=="cancelled" || order.payment_status=="pending") && (
                    <div className="flex justify-center pb-1  ">
                      <button onClick={()=>{
                        window.location.href=order.complete_payment_url
                      }}
                       type="button"
                        className="bg-green-gradiant cursor-pointer w-full md:w-1/2 hover:bg-white/10 text-white px-1 py-2 rounded-full backdrop-blur-md transition text-xs sm:text-base">
                          Complete Payment
                        </button>
                    </div>
                )}
             {/* {(selectedOrder && selectedOrder.id==order.id) && */}
            {(selectedOrder && selectedOrder.id==order.id) && (
              <div className="pb-3 border-bottom mb-4 border-dark">
                            <table className="table track-table p-2 bg-transparent w-full m-auto max-w-[780px] font-montserrat text-gray-600">
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
                                          {selectedOrder.progress[0].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                          <div className={`${selectedOrder.progress[1].is_completed?"font-bold":""}`}> 
                                            CAD approved 
                                            </div>
                                         </td>
                                        <td > {selectedOrder.progress[1].is_completed && selectedOrder.progress[1].completed_at!=null ?`Completed on :  ${selectedOrder.progress[1]?. completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td> {selectedOrder.progress[1].started_at!=null?<button className="underline decoration-1 hover:text-zinc-900" onClick={()=>setModalStage("cad_approved")}> View CAD </button>:""} </td>

                                        <td> 
                                          {selectedOrder.progress[1].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
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
                                        <td>{selectedOrder.progress[2].is_completed?<button onClick={()=>setModalStage("diamond_sourced")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="diamondsource">  View Diamond </button>:"" }</td>
                                        <td> 
                                          {selectedOrder.progress[2].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
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
                                        <td>{selectedOrder.progress[3].is_completed?<button onClick={()=>setModalStage("ring_in_production")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="ringstatus">  View Info</button>:""}</td>
                                        <td> 
                                          {selectedOrder.progress[3].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[4].is_completed?"font-bold":""}`}> 
                                            Certification
                                          </div> </td>
                                        <td> {selectedOrder.progress[4].is_completed && selectedOrder.progress[4].completed_at!=null?`Completed on :  ${selectedOrder.progress[4].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[4].is_completed?<button onClick={()=>setModalStage("certification")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="certification">  View Cert </button>:""} </td>
                                        <td> 
                                          {selectedOrder.progress[4].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[5].is_completed?"font-bold":""}`}> 
                                            Shipping 
                                          </div> </td>
                                        <td> {selectedOrder.progress[5].is_completed && selectedOrder.progress[5].completed_at!=null?`Completed on :  ${selectedOrder.progress[5].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{selectedOrder.progress[5].is_completed?<button onClick={()=>setModalStage("shipping")} className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order='' command="show-modal" commandfor="shipping">  View Address </button>:""}</td>
                                        <td> 
                                          {selectedOrder.progress[5].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
                                           :<span className="no-fill"></span>}            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div className={`${selectedOrder.progress[6].is_completed?"font-bold":""}`}> 
                                            Delivered 
                                          </div> </td>
                                        <td> {selectedOrder.progress[6].is_completed  && selectedOrder.progress[6].completed_at!=null?`Completed on :  ${selectedOrder.progress[6].completed_at.split("T")[0]}`:"Pending..."} </td>
                                        <td>{ selectedOrder.progress[6].is_completed?<button onClick={()=>setModalStage("delivered")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="delivered">  View Address </button>:""} <button onClick={()=>setModalStage("delivered")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="delivered">  View Address </button> </td>
                                         <td> 
                                          {selectedOrder.progress[6].is_completed?<span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> 
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
        
        <div className="w-full max-w-4xl space-y-6">
          
            {completedOrders.length==0?
            <p className="text-gray-600 text-center text-lg mb-6">No orders yet</p>:
            completedOrders.map(order=>{return(
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
                                        <td> {selectedOrder.progress[1].started_at!=null?<button className="underline decoration-1 hover:text-zinc-900" onClick={()=>setModalStage("cad_approved")}> View CAD </button>:""} </td>

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
                                        <td>{selectedOrder.progress[2].is_completed?<button onClick={()=>setModalStage("diamond_sourced")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="diamondsource">  View Diamond </button>:"" }</td>
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
                                        <td>{selectedOrder.progress[3].is_completed?<button onClick={()=>setModalStage("ring_in_production")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="ringstatus">  View Info</button>:""}</td>
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
                                        <td>{selectedOrder.progress[4].is_completed?<button onClick={()=>setModalStage("certification")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="certification">  View Cert </button>:""} </td>
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
                                        <td>{selectedOrder.progress[5].is_completed?<button onClick={()=>setModalStage("shipping")} className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order='' command="show-modal" commandfor="shipping">  View Address </button>:""}</td>
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
                                        <td>{ selectedOrder.progress[6].is_completed?<button onClick={()=>setModalStage("delivered")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="delivered">  View Address </button>:""} <button onClick={()=>setModalStage("delivered")} className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="delivered">  View Address </button> </td>
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
            )})}
        </div>
      )}


      {/* View Details */}
        <dialog id="viewdetails" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

          <div tabIndex="0" className="flex min-h-full items-center justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <div className="relative h-fit transform overflow-hidden -lg bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start md:px-12 pt-5">
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


                                <div className="flex flex-col sm:flex-row mt-7 w-full">
                                    <div className="basis-1/2">
                                        <h5 className="mb-3 text-white uppercase font-semibold"> ORDER CONFIRMED </h5>
                                    </div>
                                    <div className="basis-1/2 shrink-0 wrap-break-word whitespace-normal sm:text-end">
                                        <h5 className="text-white mb-0 text-wrap">Order id: <strong className="block"> {selectedOrder?.order_number}</strong></h5>
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
            </div>
          </div>
        </dialog>
   




      {/* View CAD */}
     
          {modalStage=="cad_approved" && <CADModal setModalStage={setModalStage} id={selectedOrder?.id}/>}
           
        {/* Diamond Sourced */}
        {/* Ring Status */}
        {/* Certifications */}
      
        {["diamond_sourced","ring_in_production","certification"].includes(modalStage) && <GeneralTrackingModal modalStage={modalStage}setModalStage={setModalStage} id={selectedOrder?.id}/>}
  
           {/*  Shipping Details */}
        {/*  Delivered Details */}
          {["shipping","delivered"].includes(modalStage) && <ShippingAndDeliveryModal modalStage={modalStage}setModalStage={setModalStage} id={selectedOrder?.id}/>}
       
            {/* --- Footer Help Text --- */}
      <div className="w-full max-w-3xl border-t border-gray-400 mt-10 pt-4 text-center text-gray-700 text-sm">
        Need Help? Call us Now!
      </div>
    </div>
  );
}


