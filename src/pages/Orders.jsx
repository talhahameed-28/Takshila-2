import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Orders() {
  const [tab, setTab] = useState("orders"); // "orders" or "delivered"
   const [activeIndex, setActiveIndex] = useState(null);
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState({})
  const toggle =async (id) => {
    try {
      axios.defaults.withCredentials=true
      const {data} = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/order/${id}`,
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
    // setActiveIndex(activeIndex === index ? null : index);
  };

  // const sampleOrders = [
  //   {
  //     id: "xx908290320xx",
  //     name: "The name of the product",
  //     date: "dd/mm/yy",
  //     price: "$ 'Price'",
  //     status: "In Transit",
  //     statusColor: "text-gray-500",
  //   },
  //   {
  //     id: "xx908290320xx",
  //     name: "The name of the product",
  //     date: "dd/mm/yy",
  //     price: "$ 'Price'",
  //     status: "Payment Failed!",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     id: "xx908290320xx",
  //     name: "The name of the product",
  //     date: "dd/mm/yy",
  //     price: "$ 'Price'",
  //     status: "Processed",
  //     statusColor: "text-gray-500",
  //   },
  // ];


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
     
        <div className="w-full max-w-4xl space-y-6">
           
           {orders.map(order=>(
              <div key={order.id} className="w-full bg-[#d8d8d8] rounded-2xl p-5 flex items-center justify-between shadow-sm" onClick={() => toggle(order.id)}>
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
                <span className="mt-1 text-gray-600">{order.payment_status} </span>
              </div>
                
            </div>
            )
           )}
            <div className="w-full bg-[#d8d8d8] rounded-2xl p-5 flex items-center justify-between shadow-sm" onClick={() => toggle(1)}>
              {/* Left Side */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl"></div>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold"> The name of the product </span>
                  <span className="text-gray-600">Ordered on : dd/mm/yy </span>
                  <span className="text-gray-600">Order id : xx908290320xx </span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">$60 </span>
                <span className="mt-1 text-gray-600"> In Transi </span>
              </div>
                
            </div>


             {activeIndex === 1 &&
            <div className="pb-3 border-bottom mb-4 border-dark">
                            <table className="table track-table bg-transparent w-full m-auto max-w-[780px] font-montserrat text-gray-600">
                                <tbody>
                                    <tr>
                                        <td><strong> Order Status </strong> </td>
                                        <td> Completed on :  12/10/2025 </td>
                                        <td>  <button className="underline decoration-1 hover:text-zinc-900" command="show-modal" commandfor="dialog"> View Details</button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td><strong> CAD Approved</strong> </td>
                                        <td> Completed on :  14/10/2025 </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#cadDetailsModal"> View CAD </button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td><strong> Diamond Sourced </strong></td>
                                        <td> Pending... </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#diamondDetailsModal">  View Diamond </button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td> <strong> Ring Status </strong> </td>
                                        <td> Completed on :  16/10/2025 </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#ringstatusModal">  View Info</button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td> Certification </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#certificationModal">  View Cart </button> </td>
                                        <td> <span className="no-fill"> </span> </td>
                                    </tr>
                                    <tr>
                                        <td> Shipping </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order=''>  View Address </button> </td>
                                        <td> <span className="no-fill"></span> </td>
                                    </tr>
                                    <tr>
                                        <td> Delivered </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order=''>  View Address </button> </td>
                                        <td> <span className="no-fill"></span> </td>
                                    </tr>
                                </tbody>
                            </table>   
                        </div>
                      }


            <div className="w-full bg-[#d8d8d8] rounded-2xl p-5 flex items-center justify-between shadow-sm" onClick={() => toggle(2)}>
              {/* Left Side */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl"></div>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold"> The name of the product </span>
                  <span className="text-gray-600">Ordered on : dd/mm/yy </span>
                  <span className="text-gray-600">Order id : xx908290320xx </span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">$60 </span>
                <span className="mt-1 text-red-600"> Payment Failed </span>
              </div>
            </div>


           {activeIndex === 2 && 
            <div className="pb-3 border-bottom mb-4 border-dark">
                            <table className="table track-table bg-transparent w-full m-auto max-w-[780px] font-montserrat text-gray-600">
                                <tbody>
                                    <tr>
                                        <td><strong> Order Status </strong> </td>
                                        <td> Completed on :  12/10/2025 </td>
                                        <td>  <button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#orderDetailsModal"> View Details</button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td><strong> CAD Approved</strong> </td>
                                        <td> Completed on :  14/10/2025 </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#cadDetailsModal"> View CAD </button> </td>
                                        <td> <span className="fill-check"><svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span> </td>
                                    </tr>
                                    <tr>
                                        <td> Diamond Sourced </td>
                                        <td> Pending... </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#diamondDetailsModal">  View Diamond </button> </td>
                                        <td> <span className="no-fill"> </span> </td>
                                    </tr>
                                    <tr>
                                        <td> Ring Status </td>
                                        <td> Completed on :  16/10/2025 </td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#ringstatusModal">  View Info</button> </td>
                                        <td> <span className="no-fill"></span> </td>
                                    </tr>
                                    <tr>
                                        <td> Certification </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-bs-toggle="modal" data-bs-target="#certificationModal">  View Cart </button> </td>
                                        <td> <span className="no-fill"> </span> </td>
                                    </tr>
                                    <tr>
                                        <td> Shipping </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order=''>  View Address </button> </td>
                                        <td> <span className="no-fill"></span> </td>
                                    </tr>
                                    <tr>
                                        <td> Delivered </td>
                                        <td> Pending</td>
                                        <td><button className="underline decoration-1 hover:text-zinc-900" data-order-id="18" data-order=''>  View Address </button> </td>
                                        <td> <span className="no-fill"></span> </td>
                                    </tr>
                                </tbody>
                            </table>   
                        </div>
                      }
          
        </div>
     
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

      <el-dialog>
        <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div tabindex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
                            <div className="col-md-12 details-generate text-start">
                                <h2 className="text-center text-2xl text-bold uppercase text-white"> Order Details </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/3">
                                        <h5 className="mb-3 text-white text-uppercase"> Payment Received </h5>
                                    </div>
                                    <div className="basis-1/3 text-end">
                                        <h5 className="text-white mb-0">Order Amount: $<span id="modalOrderAmount">0.00</span>
                                        </h5>
                                    </div>
                                </div>
                                <h6 className="mb-3 text-white text-start"> Order Secured </h6>
                                <p className="text-white"> Payment verified and your build slot is reserved. </p>


                                <div className="flex flex-row mt-5 w-full">
                                    <div className="basis-1/3">
                                        <h5 className="mb-3 text-white text-uppercase"> ORDER CONFIRMED </h5>
                                    </div>
                                    <div className="basis-1/3 text-end">
                                        <h5 className="text-white mb-0">Order id: <span id="modalOrderId">-</span></h5>
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
                <button type="button" command="close" commandfor="dialog" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
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
