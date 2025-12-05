import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const EmailVerify = () => {
  const {email}=useParams()
    const resendEmail=async()=>{
      try {
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/email/verification-notification`,{email})
        console.log(data)
        if(data.success) toast.success(data.message)
          else toast.error("Couldn't resend email")
      } catch (error) {
        console.log(error)
        toast.error("Request cannot be processed")
      }
    }
    const navigate=useNavigate()
  return (
    <>
  {/* Overlay */}
  <div
    className={`
      inset-0 bg-black/50 backdrop-blur-sm z-40 
      flex items-center justify-center 
      transition-opacity duration-300 
      opacity-100
      fixed
    `}
  ></div>

  {/* Centered Modal */}
  <div
    className={`
      p-33 inset-0 z-50 fixed
      flex items-center justify-center
      transition-all duration-300 
      opacity-100 scale-100 translate-y-0
    `}
  >
    <div
      className={`
        relative bg-white/15 backdrop-blur-2xl 
        border border-white/30 shadow-2xl rounded-3xl 
        w-[90%] max-w-4xl text-white p-4
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Logo Circle */}
      <div
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                   bg-black backdrop-blur-md rounded-full 
                   w-20 h-20 shadow-xl flex items-center justify-center 
                   border border-white/30"
      >
        <img src="/assets/logoo.svg" alt="Logo" className="h-14 w-14 rounded-full" />
      </div>

      {/* Close Button */}
     

      {/* LOGIN MODAL */}
      <div className="w-full flex flex-col justify-center items-center mt-5 px-0 md:px-16"><h1 className="text-3xl font-bold text-center mb-4">
          Verify Your Email Address
        </h1>

        {/* Subtitle */}
        <p className="text-center mb-6">
          Thanks for signing up! Before you can start using your account,
          you need to verify your email address.
        </p>

        {/* Success Box */}
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-8 text-center">
          Registration successful! Please check your email to verify your account.
        </div>

        {/* Custom content — replace this section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">What happens next?</h2>
          <ul className="list-disc ml-5 space-y-2 text-black">
            <li>We've sent a verification email to your registered address</li>
            <li>Click the verification link in the email to activate your account</li>
            <li>If you don't see the email, check your spam folder</li>
            <li>You can request a new verification email if needed</li>
          </ul>
        </div>

        {/* Button */}
        <button onClick={resendEmail} className="w-full cursor-pointer py-3 rounded-full bg-gray-800 text-white font-medium flex items-center justify-center gap-2">
          <span>↻</span> Resend Verification Email
        </button>

        {/* Logout */}
        <div className="text-center mt-4">
          <div onClick={()=>navigate("/")} className="text-blue-400 hover:underline cursor-pointer">Back to home</div>
        </div></div>
    </div>
  </div>
</>

  );
};

export default EmailVerify;

