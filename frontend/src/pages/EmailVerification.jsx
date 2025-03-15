import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import { Loader } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRef = useRef([]);
    const navigate = useNavigate();
    const {error, isLoading, verifyEmail} = useAuthStore();

    // const isLoading = true;

    const handelChange =(index, value)=>{
        const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRef.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRef.current[index + 1].focus();
			}
		}
    }


    const handelSubmit = async (e)=>{
        e.preventDefault();
		const verificationCode = code.join("");
        try{
            await verifyEmail(verificationCode);
            navigate('/');
            toast.success("Email verified successfuly");
        }
        catch(error){
            console.log(error);
        }
    }


    const handelKeyDown = (index, e)=>{
        if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRef.current[index - 1].focus();
		}
    }


    // auto submit when all fields are filled...
    useEffect(()=>{
        if(code.every(digit=> digit !== '')){
            handelSubmit(new Event('submit'));
        }
    },[code])
    

  return (
    <div className='max-w-md w-full
     bg-gray-800 bg-opacity-50 
     backdrop-filter backdrop-blur-xl
     rounded-2xl shadow-xl overflow-hidden'
    >
        <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
        >
            <div className="p-8">
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-400 text-transparent bg-clip-text'
                >Verify Your Email
                </h2>


                <form className='space-y-6'
                onSubmit={handelSubmit}
                >
                    <div className="flex justify-between">
                        {code.map((digit, index)=>(
                            <input
                                key={index}
                                ref={(el)=>(inputRef.current[index] = el)}
                                type="text"
                                maxLength='6'
                                value={digit}
                                onChange={(e)=> handelChange(index, e.target.value)}
                                onKeyDown={(e)=> handelKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none'
                            />
                        ))}  
                    </div>
                    {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                    <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-5 w-full py-3 px-4 font-bold rounded-lg shadow-lg 
                                 bg-gradient-to-r from-blue-400 to-blue-600 text-white
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:ring-offset-2 focus:ring-offset-gray-900 
                                 transition duration-200'
                                 type='submit'
                    >{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto'/> : "Verify"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    </div>
  )
}

export default EmailVerification