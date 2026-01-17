import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useSearchParams } from "react-router-dom";

 

function OrderSuccess(){ 
    const [searchParams]=useSearchParams()
    const order_id=searchParams.get("order_id")
    const [order, setOrder] = useState({})
    const [designerInfo, setDesignerInfo] = useState({})
    useEffect(() => {
        console.log(order_id)
      const loadOrder=async()=>{
     
       try {
      axios.defaults.withCredentials=true
      const {data:orderData} = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/order/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(orderData)
        const {data:designerData} = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/product/${orderData.data.order.product.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(designerData)

        if(designerData.success){
            setOrder(orderData.data.order)
            setDesignerInfo(designerData.data.product.user)
        }
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }
      }
      loadOrder()
      
    }, [])
    
    return(
        <>
              <div className="bg-[#e5e2df] min-h-screen font-serif text-[#1a1a1a]">
                    <section className="text-center pt-30 mb-12">
                    <h1 className="text-5xl font-normal tracking-wide text-[#1a1a1a]">
                            Order Confirmation  </h1>
                     </section>


                     <section className="relative w-full h-[300px] overflow-hidden">
                        <div
                        className="absolute inset-0 bg-cover bg-[url('/assets/Artisian.webp')] bg-center scale-105"
                      
                        ></div>
                        <div className="absolute inset-0 bg-[#e5e2df]/60"></div>
                    </section>


                    <div className="text-center mb-4 pt-12 pb-12">
                            <h1 className="text-4xl font-bold pb-3"> Thank You, Developer!</h1>
                            <p className=""> An Order confirmation email has been sent to your ID. Please check your Spam
                                    Folder, if you can't find it in your Inbox. </p>
                            <p className="order-id"> Order Number: <strong>{order?.order_number}</strong></p>
                            <div className="mt-5">
                                <span className="bg-green-100 px-4 rounded-2xl py-2">Payment Successful</span>
                            </div>
                      </div>


                    <section className="max-w-[1024px] mx-auto md:px-0 py-8 leading-relaxed text-[#1a1a1a]/90">
                             <div className="container">
                                <div className="grid grid-cols-2 gap-7">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Product Details</h2>
                                            <div className="flex items-start gap-4 mb-7 border border-zinc-300 p-4 rounded-xl">
                                                        <img src={order?.product?.image} alt="Product"
                                                            className="w-25 h-25 rounded-lg object-cover" />
                                                    
                                                        <div className="flex-1 my-auto">
                                                            <h4 className="text-lg font-semibold text-gray-900">
                                                            {designerInfo?.name}
                                                            </h4>

                                                            <p className="text-sm text-gray-500">
                                                            Designer: {order?.product?.name}
                                                            </p>

                                                            <div className="mt-2 text-md font-montserrat font-medium text-gray-900">
                                                            ${order?.amount}
                                                            </div>
                                                        </div>
                                              </div>
                                    </div>

                                    <div className="">
                                            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                                                <table className="w-full table order-info border border-zinc-300 font-montserrat text-[15px]">
                                                        <tbody>
                                                            <tr>
                                                                <td> Customer Name </td>
                                                                <td className="text-end">  {`${order?.customer_info?.firstName ?? ""}`.concat(" ",order?.customer_info?.lastName ?? "")} </td>
                                                            </tr>
                                                            
                                                            <tr>
                                                                <td> Email </td>
                                                                <td className="text-end"> {order?.customer_info?.email} </td>
                                                            </tr>
                                                            <tr>
                                                                <td> Additional Details </td>
                                                                <td className="text-end"> {order?.additional_details} </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                              </div>
                                        </div>


                        </div>
                </section>

                    

                      <section className="max-w-[1024px] mx-auto  md:px-0 py-7 leading-relaxed text-[#1a1a1a]/90">
                             <div className="container">
                                <div className="grid grid-cols-2 gap-7">
                                        <div>
                                            <h2 className="text-xl font-bold mb-4">Custom Specifications</h2>
                                            <table className="w-full table order-info border border-zinc-300 font-montserrat text-[15px]">
                                                        <tbody>
                                                            <tr>
                                                                <td> Metal Type </td>
                                                                    <td className="text-end capitalize"> {order?.order_info?.metalType} </td>
                                                                </tr>
                                                           
                                                            {order?.order_info?.metalType=="gold" && <>
                                                            <tr>
                                                                <td> Gold Type </td>
                                                                    <td className="text-end"> {order?.order_info?.goldType} </td>
                                                            </tr>
                                                            <tr>
                                                                <td> Gold Karat </td>
                                                                    <td className="text-end"> {order?.order_info?.goldKarat} </td>
                                                            </tr>
                                                            </>
                                                                }
                                                                <tr>
                                                                <td> Ring Size</td>
                                                                    <td className="text-end"> {order?.order_info?.ringSize} (US) </td>
                                                                </tr>
                                                                <tr>
                                                                <td> Stone Type </td>
                                                                    <td className="text-end capitalize"> {order?.order_info?.stoneType} </td>
                                                                </tr>
                                                               {order?.order_info?.stoneType=="diamond" && <tr>
                                                                <td> Quality</td>
                                                                    <td className="text-end capitalize"> {order?.order_info?.quality} </td>
                                                                </tr>}
                                                                <tr>
                                                                <td> Total Carat Weight </td>
                                                                    <td className="text-end"> {order?.order_info?.totalCaratWeight} carat </td>
                                                                </tr>
                                                                <tr>
                                                                <td> Stone Shape </td>
                                                                    <td className="text-end"> {order?.order_info?.diamondShape} </td>
                                                                </tr>
                                                        </tbody>

                                                </table>
                                            </div>


                                             <div>
                                                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                                                    <table className="w-full table order-info border border-zinc-300 font-montserrat text-[15px]">
                                                        <tbody>
                                                            <tr>
                                                                <td> Address </td>
                                                                    <td className="text-end">  {order?.shipping_address?.address}
                                                                                                        <br/> {order?.shipping_address?.address2} </td>
                                                                </tr>
                                                                 <tr>
                                                                    <td> City </td>
                                                                    <td className="text-end"> {order?.shipping_address?.city}</td>
                                                                </tr>
                                                                 <tr>
                                                                    <td> State, ZIP </td>
                                                                    <td className="text-end"> {order?.shipping_address?.state},
                                                                    {order?.shipping_address?.zip} </td>
                                                                </tr>
                                                                <tr>
                                                                    <td> Country </td>
                                                                    <td className="text-end">{order?.shipping_address?.country}</td>
                                                                </tr>
                                                        </tbody>

                                                    </table>
                                                    
                                            </div>
                                    </div>
                                
                            </div>
                     </section>



                         <section className="max-w-[1024px] mx-auto  md:px-0 py-7 pb-23 leading-relaxed text-[#1a1a1a]/90">
                             <div className="container">
                                        <h2 className="text-xl font-bold mb-4"> Order Summary </h2>
                                        <table className="w-full table order-info border border-zinc-300 font-montserrat text-[15px]">
                                                        <tbody>
                                                            <tr>
                                                                <td> Product Price </td>
                                                                 <td className="text-end"> ${order?.amount} </td>
                                                             </tr>
                                                            
                                                                <tr>
                                                                    <td> Payment Method </td>
                                                                    <td className="text-end"><img src="https://cdn-icons-png.flaticon.com/512/755/755718.png" className="ms-auto me-2 inline-block" width={30} /> Card </td>
                                                                </tr>
                                                                <tr>
                                                                    <td> <strong> Total Amount </strong> </td>
                                                                    <td className="text-end"> <strong> ${order?.amount}  </strong></td>
                                                                </tr>
                                                        </tbody>
                                        </table>
                                        

                                        <div className="w-ful mt-14 text-center">
                                            <Link to="/community" className="text-white rounded-4xl text-[17px] hover:bg-zinc-600 font-semibold py-3 px-6 text-xl bg-black/80"> Continue Shopping </Link>
                                        </div>
                                        
                                </div>
                            </section>

                </div>
        </>
    );
}


export default OrderSuccess;