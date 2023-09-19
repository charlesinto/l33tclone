import { auth } from "@/firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

type LogoutProps = {};

const Logout: React.FC<LogoutProps> = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const handleLogout = () => {
    signOut();
  };
  return (
    <button
      title='logout'
      className='bg-gradient-to-r from-blue-600 to-blue-800 py-1.5 px-3 rounded text-white drop-shadow-lg hover:from-brand-orange hover:to-brand-orange-s'
      onClick={handleLogout}
    >
      <FiLogOut />
    </button>
  );
};

export default Logout;
