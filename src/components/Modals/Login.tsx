import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = (type: "login" | "register" | "forgotPassword") => {
    setAuthModalState((prev) => ({ ...prev, type }));
  };

  // Inputs
  const [inputs, setInputs] = useState({ email: "", password: "" });

  // Firebase
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // Router
  const router = useRouter();

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password)
      return alert("Please fill all fields...");
    try {
      const newUser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  // Error Alert
  useEffect(() => {
    if (error)
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
  }, [error]);

  return (
    <form action='' className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
      <h3 className='text-xl font-medium text-white'>Sign In to L33t</h3>
      {/* email */}
      <div>
        <label
          htmlFor='email'
          className='text-sm font-medium block mb-2 text-white'
        >
          Email
        </label>
        <input
          onChange={handleInputChange}
          type='email'
          name='email'
          id='email'
          autoComplete='email'
          className='border-2 outline-none sm-text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-white placeholder-gray-400 placeholder:italic placeholder:text-slate-500  text-white'
          placeholder='name@l33t.com'
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor='email'
          className='text-sm font-medium block mb-2 text-white'
        >
          Password
        </label>
        <input
          onChange={handleInputChange}
          type='password'
          name='password'
          id='password'
          autoComplete='current-password'
          className='border-2 outline-none sm-text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-white placeholder-gray-400 placeholder:italic placeholder:text-slate-500  text-white'
          placeholder='********'
        />
      </div>

      {/* Submit */}
      <button
        type='submit'
        className='w-full text-white focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s ease-in-out duration-300 hover:ease-in'
      >
        {loading ? "Loading..." : "Sign In"}
      </button>

      {/* Forgot Password */}
      <div className='flex w-full justify-end'>
        <a
          href='#'
          className='text-sm block text-brand-orange hover:underline w-full text-right'
          onClick={() => handleClick("forgotPassword")}
        >
          Forgot Password?
        </a>
      </div>

      {/* divider */}
      <div className='flex items-center justify-center'>
        <div className='border-b border-gray-500 w-1/5'></div>
        <div className='text-white text-sm font-medium mx-2'>OR</div>
        <div className='border-b border-gray-500 w-1/5'></div>
      </div>

      {/* Not Registered? */}
      <div className='flex w-full justify-center'>
        <p className='text-xs text-white'>Not Registered?</p>
        <a
          href='#'
          className='text-xs block text-brand-orange hover:underline w-1/2 text-right'
          onClick={() => handleClick("register")}
        >
          Sign Up
        </a>
      </div>
    </form>
  );
};

export default Login;
