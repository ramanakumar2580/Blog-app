import { assets } from '@/Assets/assets';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Header = () => {
  const [email, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const router = useRouter();

  
  const validAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    
    try {
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  
  const handleAdminLogin = () => {
    if (adminEmail === validAdminEmail) {
      router.push("/admin"); 
    } else {
      toast.error("Invalid Admin Email!"); 
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
        <Image src={assets.logo} width={150} alt="Blogger Logo" className="w-[140px] sm:w-[150px] md:w-[160px] h-auto" />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-5px_5px_0px_#000000]"
        >
          Get started <Image src={assets.arrow} alt="Arrow Icon" />
        </button>
      </div>

      
      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blogs</h1>
        <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">
          Welcome to my digital space—where thoughts, experiences, and ideas come to life. Explore, learn, and get inspired!
        </p>

        
        <form onSubmit={onSubmitHandler} className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-5px_5px_0px_#000000]">
          <input 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="pl-4 outline-none w-full"
            required 
          />
          <button type="submit" className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white">
            Subscribe
          </button>
        </form>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-bold mb-3">Enter Admin Email</h2>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Enter Admin Email"
              className="border p-2 w-full rounded-md mb-3"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAdminLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
