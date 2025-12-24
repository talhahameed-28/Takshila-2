import axios from "axios";
import { Underline } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



function Checkout(){
    const navigate=useNavigate()
    const user=useSelector(state=>state.user)
    const [productInfo, setProductInfo] = useState({})
    const [designerInfo, setDesignerInfo] = useState("")
    const [orderPlacing,setOrderPlacing]=useState(false)

    useEffect(() => {
      async function loadDetails(){
        try {
            axios.defaults.withCredentials=true
            const {data:productData}=await  axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist`,        
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type":'application/json'
                    },
                    withCredentials: true,
                }
            );
            console.log(productData.data.wishlist_items[0])
            const {data:{data:{product:{user:userData}}}}=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/${productData.data.wishlist_items[0].product_id}`,        
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type":'application/json'
                    },
                    withCredentials: true,
                }
            );
            if(productData.success){
                setProductInfo(productData.data.wishlist_items[0])
                setDesignerInfo(userData)
                toast.success("Product loaded")
            }else{
                toast.error("Couldn't process your request")
                navigate("/community")
            }
        } catch (error) {
            toast.error("Some error occurred")
            console.log(error)
        }
      }
      loadDetails()
    
     
    }, [])


    const handleSubmit=async (e) => {
        try {
            setOrderPlacing(true)
            e.preventDefault()
            axios.defaults.withCredentials=true
            const form=new FormData(e.target)
            const payload=Object.fromEntries(form.entries())
            const {same_address,additional_details,terms_accepted}=payload
            const customer=(({firstName,lastName,email})=>({firstName,lastName,email}))(payload)
            const shipping=(({address,city,state,country,zip})=>({address,city,state,country,zip}))(payload)
            console.log(customer)
            const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/place`,
                { 
                    product_id:productInfo.product.id,
                    customer,
                    shipping,
                    same_address:same_address=="on"?true:false,
                    terms_accepted:terms_accepted=="on"?true:false,
                    additional_details,
                    create_payment_session: true
                },
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
                }
            );
            console.log(data)
        } catch (error) {
            toast.error("Some error occurred")
            console.log(error)
        }finally{
            setOrderPlacing(false)
        }
    }
    
    return(
        <>
         <div className="bg-[#e5e2df] min-h-screen font-serif text-[#1a1a1a]">

                <section className="text-center pt-30 mb-12">
                    <h1 className="text-5xl font-normal tracking-wide text-[#1a1a1a]">
                            Checkout Form  </h1>
                </section>



        <section className="pt-10 pb-17">
        <div className="container max-w-[1000px] mx-auto">
                <div className="flex md:flex-row flex-col md:px-0 px-5">
                    
        {/* left side */}
            <div className="md:basis-2/3 basis-full">
                <div className="w-full">
                    <h2 className="text-3xl md:text-2xl font-bold mb-0"> Customer Information </h2>
                    <form onSubmit={handleSubmit}>
                            <div className="border-b border-gray-900/10 pb-6">
                            
                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label for="firstName" className="block text-sm/7 font-medium text-gray-900">First name</label>
                                    <div className="mt-1">
                                        <input type="text" name="firstName" defaultValue={user.user.name.split(" ")[0]} autocomplete="given-name" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label for="lastName" className="block text-sm/7 font-medium text-gray-900">Last name</label>
                                    <div className="mt-1">
                                        <input type="text" name="lastName" defaultValue={user.user.name.split(" ")[1]} autocomplete="family-name" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                    </div>
                                </div>

                                <div class="sm:col-span-3">
                                    <label for="email" className="block text-sm/7 font-medium text-gray-900">Email address</label>
                                    <div className="mt-1">
                                        <input id="email" type="email" name="email" defaultValue={user.user.email} autocomplete="email" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                <label for="country" className="block text-sm/7 font-medium text-gray-900">Country</label>
                                <div className="mt-1 grid grid-cols-1">
                                    <select id="country" name="country" autocomplete="country-name" className="col-start-1 row-start-1 rounded-full w-full font-montserrat appearance-non bg-white/40 py-3 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-400">
                                        <option>United States</option>
                                    </select>
                                    <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4">
                                    <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                                    </svg>
                                </div>
                                </div>

                                <div className="col-span-full">
                                <label for="address" className="block text-sm/7 font-medium text-gray-900">Street address</label>
                                <div className="mt-1">
                                    <input id="address" type="text" name="address" autocomplete="address" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                <label for="city" className="block text-sm/7 font-medium text-gray-900">City</label>
                                <div className="mt-1">
                                    <input id="city" type="text" name="city" autocomplete="address-level2" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                </div>
                                </div>

                                <div className="sm:col-span-2">
                                <label for="state" className="block text-sm/7 font-medium text-gray-900">State / Province</label>
                                <div className="mt-1">
                                    <select name="state" className="block w-full rounded-full bg-white/40 font-montserrat px-3 py-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-400 sm:text-sm/6" id="shipping_state_dropdown" required>
                                        <option value="" selected="">Select a State
                                        </option>
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="DC">District Of Columbia</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </select>
                                </div>
                                </div>

                                <div class="sm:col-span-2">
                                    <label for="zip" class="block text-sm/7 font-medium text-gray-900">ZIP / Postal code</label>
                                    <div class="mt-1">
                                        <input id="zip" type="text" name="zip" autocomplete="zip" className="w-full font-montserrat bg-white/40 text-grey px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40" />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                <label for="additional_details" class="block text-sm/7 font-medium text-gray-900"> Additional Details </label>
                                <div class="mt-1">
                                    <textarea id="additional_details" name="additional_details" rows="3" className="block w-full font-montserrat rounded-lg bg-white/40 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-400 sm:text-sm/6"></textarea>
                                </div>
                                        <p class="mt-3 text-sm/6 text-gray-600"> Any Special Instructions, notes, or additional information.. </p>
                                </div>


                            </div>
                            </div>

                                
                            <div class="mt-2 space-y-10">
                                <fieldset className="mb-0">
                                <div class="mt-3 space-y-6">
                                    <div class="flex gap-3">
                                    <div class="flex h-6 shrink-0 items-center">
                                        <div class="group grid size-4 grid-cols-1">
                                        <input id="same_address" type="checkbox" name="same_address"  aria-describedby="same_address" className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
                                        <svg viewBox="0 0 14 14" fill="none" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                            <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="opacity-0 group-has-checked:opacity-100" />
                                            <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                                        </svg>
                                        </div>
                                    </div>
                                    <div class="text-sm/6">
                                        <label for="comments" className="font-medium text-gray-900"> </label>
                                        <p id="comments-description" className="text-gray-500"> Save this information for future checkouts </p>
                                    </div>
                                    </div>
                                        
                                </div>
                                </fieldset>


                                <fieldset>
                                <div class="mt-3 space-y-6">
                                    <div class="flex gap-3">
                                    <div class="flex h-6 shrink-0 items-center">
                                        <div class="group grid size-4 grid-cols-1">
                                        <input id="terms_accepted" type="checkbox" name="terms_accepted"  aria-describedby="terms_accepted" class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
                                        <svg viewBox="0 0 14 14" fill="none" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                            <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                                            <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                                        </svg>
                                        </div>
                                    </div>
                                    
                                    <div class="text-sm/6">
                                        <label for="comments" className="font-medium text-gray-900"> </label>
                                        <p id="comments-description" className="text-gray-500">  I agree to the <Link className="underline hover:text-blue-500" to="/terms-&-conditions"> Terms and Conditions </Link> and <Link className="underline hover:text-blue-500"  to="/privacy-policy"> Privacy Policy </Link> </p>
                                    </div>
                                    </div>
                                    

                                        
                                </div>
                                </fieldset>

                                
                            </div>
                            

                        <div class="mt-6 flex items-center justify-end gap-x-6">
                                <button type="submit" className={`${orderPlacing?"bg-gray-600 cursor-not-allowed":"cursor-pointer bg-black/80"} w-full text-sm  py-3 rounded-full text-white font-medium hover:bg-black transition`}> Submit </button>
                        </div>
                        </form>
                </div>
            </div>
        {/* left side */}


                       
                      {/* right side */}
                <div className="md:basis-1/3 basis-full md:px-7">
                    <div className="w-100">
                        <div className="flex items-start gap-4 mb-7">
                                <img src={productInfo?.product?.image} alt="Product"
                                    className="w-35 h-35 rounded-lg object-cover" />
                                
                                <div className="flex-1 my-auto">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                    {productInfo?.product?.name}
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                    Designer: {designerInfo?.name}
                                    </p>

                                    <div className="mt-2 text-md font-montserrat font-medium text-gray-900">
                                    ${productInfo?.amount}
                                    </div>
                                </div>
                            </div>

                            <h4 className="md:text-2xl font-bold mb-3"> Product Details </h4>
                            <table class="table-auto font-montserrat table-design md:w-full w-[80%] text-[15px]">
                                    
                                <tbody>
                                    <tr>
                                    <td> Gold Type </td>
                                    <td> {productInfo?.product_options?.goldType} </td>
                                    </tr>

                                    <tr>
                                    <td> Gold Karat </td>
                                    <td> {productInfo?.product_options?.goldKarat} </td>
                                    </tr>

                                    <tr>
                                    <td> Ring Size </td>
                                    <td> {productInfo?.product_options?.ringSize}(US) </td>
                                    </tr>

                                    <tr>
                                    <td> Diamond Shape </td>
                                    <td> {productInfo?.product_options?.diamondShape} </td>
                                    </tr>

                                    <tr>
                                    <td> Quality </td>
                                    <td> {productInfo?.product_options?.quality} </td>
                                    </tr>

                                    <tr>
                                    <td> Center Stone Carat </td>
                                    <td> {productInfo?.product_options?.centerStoneCarat} carat </td>
                                    </tr>

                                    <tr>
                                    <td> Total Carat Weight </td>
                                    <td> {productInfo?.product_options?.totalCaratWeight} carat </td>
                                    </tr>

                                        <tr>
                                    <td> Ring Details </td>
                                    <td>  Gold Type: {productInfo?.product_options?.goldType} <br/> Gold Karat: {productInfo?.product_options?.goldKarat} <br/> Ring Size: {productInfo?.product_options?.ringSize}(US) <br/> Quality: {productInfo?.product_options?.quality}  </td>
                                    </tr>
                                    

                                </tbody>
                                </table>

                                <div className="pt-5 pb-5"></div>

                                <h4 className="md:text-2xl font-bold mb-3"> Costing </h4>
                            <table class="table-auto font-montserrat table-design md:w-full w-[80%] text-[15px]">
                                    
                                <tbody>
                                    <tr>
                                    <td> Quality Cost </td>
                                    <td> ${productInfo?.product_options?.qualityCost} </td>
                                    </tr>

                                    <tr>
                                    <td> Metal Cost </td>
                                    <td> ${productInfo?.product_options?.metalCost} </td>
                                    </tr>

                                    <tr>
                                    <td> Working Charges </td>
                                    <td> ${productInfo?.product_options?.workingChargesCost} </td>
                                    </tr>

                                    <tr>
                                    <td> Setting Cost </td>
                                    <td> ${productInfo?.product_options?.diamondSettingCost} </td>
                                    </tr>

                                    <tr>
                                    <td> Certification Cost </td>
                                    <td> ${productInfo?.product_options?.certificationCost} </td>
                                    </tr>

                                    <tr>
                                    <td> Shipping Cost </td>
                                    <td> ${productInfo?.product_options?.shipmentCost} </td>
                                    </tr>

                                        
                                </tbody>
                                </table>
                    </div>
                    
                </div>
                             
                    {/* right side */}
                
                </div>
                
        </div>
        </section>


            </div>
        </>
    );
}


export default Checkout;