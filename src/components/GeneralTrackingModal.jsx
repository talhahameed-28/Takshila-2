import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const GeneralTrackingModal = ({modalStage, id,setModalStage}) => {
  const [loading, setLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
    const loadStatus=async()=>{
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
        setSubmissions(data.data.stage.submission)
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
    
    loadStatus()
    
  }, [])
  return (
    <>
    <div aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

          <div tabIndex="0" className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center sm:p-0">
            <div className="relative transform overflow-hidden  bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-3 sm:px-6 pt-6 sm:pt-9 pb-4 sm:pb-6 max-h-[60vh] sm:max-h-[85vh] overflow-y-auto">
                    {loading?<div className="flex flex-col items-center justify-center py-10">
                            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

                            <p className="mt-4 text-sm text-black text-center max-w-xs">
                            Loading {modalStage=="diamond_sourced"?"diamond":modalStage=="ring_in_production"?"ring status":modalStage=="certification"?"certification":""}
                            </p>
                        </div>:<div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> {modalStage=="diamond_sourced"?"Diamond Sourced":modalStage=="ring_in_production"?"Ring Status":modalStage=="certification"?"Certification":""} </h2>
                                <div className="flex flex-row mt-8 w-full justify-center">
                                    <div className="basis-1/2">
                                        <h5 className="mb-2 text-white font-semibold uppercase"> Studio notes </h5>
                                        <p className="text-white pb-3"> {submissions?.notes || "-"}</p>

                                        <h6 className="mt-3 mb-1 text-white text-start"> Version: <strong> V1 </strong> </h6>
                                        <h6 className="mb-1 text-white text-start"> Submitted: <strong> {new Date(submissions?.submitted_at).toUTCString()} </strong> </h6>
                                    </div>
                                    <div className="basis-1/2 text-end">
                                        <h6 className="mb-1 text-white text-start"> Files </h6>
                                        {submissions?.files.map(file=>{return (
                                            <div className='w-full p-3'>
                                                <div>
                                                  
                                                    {
                                                     file.extension=="pdf" && (
                                                         <>
                                                        <iframe className="border border-gray-300 rounded-sm w-full h-[35vh] sm:h-[70vh]" src={file.url}></iframe>
                                                        <a download className="text-white block w-full underline font-bold text-left" href={file.url}>Download PDF</a>
                                                        <p className="text-white text-start">{file.name}</p>
                                                        </>
                                                     ) 
                                                    }
                                                    {[ "jpg", "png", "gif", "webp"].includes(file.extension) &&( 
                                                        <>
                                                        <img className="border border-gray-300 rounded-sm w-full" src={file.url}></img>
                                                        <p className="text-white text-start">{file.name}</p>
                                                        </>
                                                    )}
                                                    {[ "mp4", "mov", "avi", "mkv", "webm"].includes(file.extension) &&( 
                                                        <>
                                                        <video controls className="border border-gray-300 rounded-sm w-full" src={file.url}></video>
                                                        <p className="text-white text-start">{file.name}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )})}
                                        {/* <img src="https://ai-takshila-co-images.s3.eu-north-1.amazonaws.com/orders/82/diamond_sourced/v1/69420dd704b51.png" className="border border-gray-300 rounded-sm" width={230} /> */}
                                    </div> 
                                </div>
                              
 

                                <div className="mt-4 text-center">
                                    {/* <a href="#" id="orderDetailsLink" className="text-white" style="text-decoration: underline;">
                                        for more details
                                    </a> */}
                                </div>
                    </div>}
              </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button onClick={()=>setModalStage("")} type="button" command="close" commandfor="diamondsource" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </div>
          </div>
    </div>
    </>
  )
}

export default GeneralTrackingModal
