import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";



const CADModal=({setModalStage,id})=>{
   const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState([])
  const [openFeedback, setOpenFeedback] = useState(false)
  const [allSubmissions, setallSubmissions] = useState({glb:[],stl:[],pdf:[]})
  const [loading, setLoading] = useState(true)
    const feedbackRef = useRef(null)
    const handleApproval=async (decision)=>{
        try {
          axios.defaults.withCredentials=true
          const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/${id}/submissions/${submissions[currentIndex].id}/${decision}`,
              {...(decision=="reject"?{feedback:feedbackRef.current.value.trim()}:{})
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            console.log(data)
            if(data.success){
              toast.success("Review sent")
              setModalStage("")
            }else toast.error("Couldn't send review")
        } catch (error) {
            console.log(error)
            toast.error("Some error occurred")
        }
    }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? submissions.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === submissions.length - 1 ? 0 : prev + 1
    );
  };

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
      if(data.success){
        toast.success("Submissions fetched successfully")
        setSubmissions(data.data.stage.submissions)
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
    
    loadCADs()
    
  }, [])

//   useEffect(() => {
//       const categorized = { glb: [], stl: [], pdf: [] };

//     submissions[currentIndex]?.files.forEach(file => {
//       const ext = file.extension?.toLowerCase();

//     if (categorized[ext]) {
//       categorized[ext].push(file);
//       }
//     });
//     setallSubmissions(categorized)
//     console.log(categorized)
  
    
//   }, [currentIndex,submissions])
  
  
  return (
    <>
            <div aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-4xl overflow-y-auto bg-transparent backdrop:bg-transparent mx-auto">

    <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

          <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden bg-[#716F6DE0] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border rounded-xl border-gray-300">
              <div className="px-6 pt-9 pb-6 sm:p-6 sm:pb-4">
    {loading?<div className="flex flex-col items-center justify-center py-10">
            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

            <p className="mt-4 text-sm text-black text-center max-w-xs">
              Loading submissions
            </p>
          </div>:<div className="col-md-12 details-generate text-start md:px-12 px-4 pt-5">
                                
      <h2 className="text-center text-2xl font-bold uppercase text-white pb-5"> CAD Details </h2>
                                
      <h6 className="mb-1 text-white text-start"> Review CAD submissions </h6>
       <>
               <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black transition"
        >
          ◀
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black transition"
          >
          ▶
        </button>
    

     <div className="px-16 mt-8 w-full">
          <div className="relative">
            
            <div className="absolute w-1/3 text-center space-y-3 top-0 right-0">
                <div className={` p-2 ${submissions[currentIndex]?.status=="rejected"?"opacity-90 bg-red-400":submissions[currentIndex]?.status=="under_review"?"opacity-70 bg-amber-300":"bg-emerald-300"} rounded-xl text-white font-semibold`}>{submissions[currentIndex]?.status=="rejected"?"Revisions requested":submissions[currentIndex]?.status=="under_review"?"Under Review":"Approved"}</div>
            </div>
            
              <p className="text-white pb-2"> Version: V{submissions[currentIndex]?.version} </p>
              <p className="text-white pb-2"> Submitted: {submissions[currentIndex]?.submitted_at} </p>
              <p className="text-white pb-2"> Studio notes: {submissions[currentIndex]?.notes || "No studio notes"} </p>
              <p className="text-white">Files:{" "}
                    {submissions[currentIndex]?.files
                      .filter(file =>["pdf","zip"].includes(file.extension))
                      .map((file, idx, arr) => (
                        <span key={idx}>
                          <a download={file.extension=="zip"?file.name:undefined} className="underline" target="_blank" href={file.url}>{file.name}</a>
                          {idx < arr.length - 1 && ", "}
                        </span>
                      ))}
                </p>
                <div className="flex gap-1 flex-wrap pt-2">
                    {submissions[currentIndex]?.files
                      .filter(file => ["jpg","jpeg","png"].includes(file.extension))
                      .map((file, idx, arr) => (
                        <div className="p-2 rounded-xl flex-1/4 bg-[rgba(0,0,0,0.3)]">
                            <div className="">
                              <img className="w-full" src={file.url} alt="image" />
                            </div>
                            <p className="text-white">{file.name}</p>
                        </div>
                      ))}
              </div>
              <div>
                    {submissions[currentIndex]?.files
                      .filter(file => file.extension === "stl")
                      .map((file, idx, arr) => (
                        <div key={idx} className="mt-10 border-black border-t-3 w-full h-[50vh]">
                            <p className="text-white">{file.name}</p>
                            <Canvas  onCreated={({ gl }) => {
                                gl.setClearColor("#ffffff");
                            }}
                            camera={{ position: [0, 0, 5], fov: 5 }}>
                            {/* Lights */}
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />


                            {/* Choose ONE model type */}
                            {/* <GLBModel path="/models/sample.glb" /> */}
                            <STLModel path={file.url} />


                            {/* Mouse / touch interaction */}
                            <OrbitControls enablePan enableZoom enableRotate />
                            </Canvas>
                            </div>
                      ))}
              </div>
              <div>
                    {submissions[currentIndex]?.files
                      .filter(file => file.extension === "glb")
                      .map((file, idx, arr) => (
                        <div className="mt-10 border-black border-t-3 w-full h-[50vh]">
                            <p className="text-white">{file.name}</p>
                            <Canvas  onCreated={({ gl }) => {
                                gl.setClearColor("#ffffff");
                            }}
                            camera={{ position: [0, 0, 5], fov: 60 }}>
                            {/* Lights */}
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />


                            {/* Choose ONE model type */}
                            <GLBModel path={file.url} />
                            


                            {/* Mouse / touch interaction */}
                            <OrbitControls target={[0,0,0]}enablePan enableZoom enableRotate />
                            </Canvas>
                            </div>
                      ))}
              </div>

          </div>
          {/* <div className="basis-1/2 text-end">
              <h5 className="bg-red-500 px-3 rounded-xl py-2 inline-block text-white mb-3"> Revisions Requested 
              </h5>
              <p className="text-yellow-300"> Your feedback: reject 1 </p>
          </div> */}
      </div>  

     {submissions[currentIndex]?.status=="under_review" &&  <div className="mt-16 flex justify-around gap-6">
                <button
                onClick={()=>handleApproval("approve")}
                    className="cursor-pointer
                    px-6 py-2
                    rounded-lg
                    font-semibold
                    bg-green-600 text-white
                    hover:bg-green-700
                    active:scale-95
                    transition
                    shadow-md
                    "
                >
                    Approve
                </button>

                <button
                onClick={()=>setOpenFeedback(true)}
                    className="cursor-pointer
                    px-6 py-2
                    rounded-lg
                    font-semibold
                    bg-red-600 text-white
                    hover:bg-red-700
                    active:scale-95
                    transition
                    shadow-md
                    "
                >
                    Reject
                </button>
        </div>}
        {submissions[currentIndex]?.status=="rejected" && <div className="text-yellow-300 mt-5 pt-2">Your Feedback:{submissions[currentIndex]?.feedback}</div>}
                <div  className={`relative
                                         overflow-hidden
                                        transition-all duration-700 ease-in-out
                                        ${openFeedback
                                        ? "max-h-[1000px] opacity-100 pt-4 mt-4"
                                        : "max-h-0 opacity-0 pt-0 mt-0"}
                                    `}>
                                <button
                                type="button"
                                    onClick={()=>setOpenFeedback(false)}
                                    className="absolute top-4 right-4 text-xl opacity-60 hover:opacity-100"
                                    >
                                    ✕
                                    </button>
                        <div className="col-span-full border-t pt-4 border-gray-900/10">
                        <h2 className="text-3xl md:text-2xl font-bold mb-2"> Please submit your feedback </h2>
                            <div><textarea maxLength="1000" ref={feedbackRef} placeholder="Feedback..." className="w-full h-[90px] rounded-xl p-3 pb-8 bg-black/10 text-white text-sm resize-none outline-none"></textarea></div>
                        </div>
                         <button
                onClick={()=>handleApproval("reject")}
                    className="cursor-pointer
                    px-6 py-2
                    rounded-lg
                    font-semibold
                    bg-red-600 text-white
                    hover:bg-red-700
                    active:scale-95
                    transition
                    shadow-md
                    "
                >
                    Submit
                </button>
                </div>
       </>                           
  </div>}
  </div>

              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" command="close" onClick={()=>setModalStage("")} commandfor="cadmodal" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"> Close </button>
              </div>
            </div>
          </div>
          </div>
                </>
  )
}
function GLBModel({ path }) {
    const { scene } = useGLTF(path);
      return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}


function STLModel({ path }) {
  const geometry = useLoader(STLLoader, path);

  // 🔥 Fix pivot / center issue
  geometry.computeBoundingBox();
  geometry.center();
  geometry.computeVertexNormals();

  return (
    <group>
      <mesh geometry={geometry} scale={0.01}>
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
    </group>
  );
}

export default CADModal
