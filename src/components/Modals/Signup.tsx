import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/firebase";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };

  const [inputs, setInputs] = useState({
    email: "",
    displayName: "",
    password: "",
  });

  //  Router
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  // Handle Input Change
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password || !inputs.displayName)
      return alert("Please fill all fields...");
    try {
      toast.loading("Creating your account", {
        position: "top-center",
        toastId: "loadingToast",
      });
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;
      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: inputs.displayName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };

      await setDoc(doc(firestore, "users", newUser.user.uid), userData);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" });
    } finally {
      toast.dismiss("loadingToast");
    }
  };

  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  return (
    <form action='' className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
      <h3 className='text-xl font-medium text-white'>
        Create your L33t account
      </h3>

      {/* email */}
      <div>
        <label
          htmlFor='email'
          className='text-sm font-medium block mb-2 text-white'
        >
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type='email'
          name='email'
          id='email'
          autoComplete='email'
          className='border-2 outline-none sm-text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-white placeholder-gray-400 placeholder:italic placeholder:text-slate-500  text-white'
          placeholder='name@l33t.com'
        />
      </div>

      {/* Display name */}
      <div>
        <label
          htmlFor='displayName'
          className='text-sm font-medium block mb-2 text-white'
        >
          Choose a L33t Name
        </label>
        <input
          onChange={handleChangeInput}
          type='displayName'
          name='displayName'
          id='displayName'
          autoComplete='username'
          className='border-2 outline-none sm-text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-white placeholder-gray-400 placeholder:italic placeholder:text-slate-500  text-white'
          placeholder='L33t_Coder'
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
          onChange={handleChangeInput}
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
        {loading ? "Setting up your L33T dashboard..." : "Register"}
      </button>

      {/* divider */}
      <div className='flex items-center justify-center'>
        <div className='border-b border-gray-500 w-1/5'></div>
        <div className='text-white text-sm font-medium mx-2'>OR</div>
        <div className='border-b border-gray-500 w-1/5'></div>
      </div>
      {/* Already Registered? */}
      <div className='flex w-full justify-center'>
        <p className='text-xs text-white'>Already Registered?</p>
        <a
          href='#'
          className='text-xs block text-brand-orange hover:underline w-1/2 text-right'
          onClick={handleClick}
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default Signup;
