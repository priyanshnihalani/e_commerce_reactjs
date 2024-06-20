import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

function Signup() {
  const [data, setData] = useState({ name: '', password: '', email: '', repeatPassword: '' });
  const [error, setError] = useState({ name: false, password: false, email: false, repeatPassword: false });
  const navigate = useNavigate();

  const handleData = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  function validEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, repeatPassword } = data;

    let emailError = '';
    let repeatPasswordError = false;

    if (name === '') {
      setError({ ...error, name: true });
    }

    if (email === '') {
      emailError = 'Email is required';
    } else if (!validEmail(email)) {
      emailError = 'Invalid email';
    }

    if (repeatPassword !== password) {
      repeatPasswordError = true;
    }

    setError({
      ...error,
      name: name === '',
      email: emailError,
      password: password === '',
      repeatPassword: repeatPasswordError,
    });

    if (name !== '' && password !== '' && emailError === '' && !repeatPasswordError) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        set(ref(db, 'users/' + user.uid), { name: data.name, email: data.email })
          .then(() => navigate("/"))
          .catch((error) => console.log(error));
      } catch (error) {
        if(error.code == 'auth/e-mail already-in-use'){
          alert("User Aleready exist with this credentials")
        }
        else{
          alert("Someting went wrong, Try again!")
        }
      }
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center h-screen">
        <form className="w-full max-w-xs bg-white p-8 shadow-lg rounded-lg px-[3rem]" onSubmit={handleSubmit}>
          <div className="w-[100%]">
            <h1 className="text-center pb-4 font-bold text-[24px]">Sign Up</h1>
            <div className="mb-5 w-full">
              <label htmlFor="name" className="block mb-2 text-[.8rem] font-bold text-gray-900">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-[.8rem] rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-[.35rem] px-2"
                placeholder="name"
                value={data.name}
                onChange={handleData}
              />
              {error.name && <span className="text-red-500 text-[.6rem]">Name is required</span>}
            </div>
            <div className="mb-5 w-full">
              <label htmlFor="email" className="block mb-2 text-[.8rem] font-bold text-gray-900">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-[.8rem] rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-[.35rem] px-2"
                placeholder="name@mail.com"
                value={data.email}
                onChange={handleData}
              />
              {error.email && <span className="text-red-500 text-[.6rem]">{error.email}</span>}
            </div>
            <div className="mb-5 w-full">
              <label htmlFor="password" className="block mb-2 text-[.8rem] font-bold text-gray-900">Your password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-[.7rem] rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-[.35rem] px-2"
                placeholder="e.g. Aa12$@"
                value={data.password}
                onChange={handleData}
              />
              {error.password && <span className="text-red-500 text-[.6rem]">Password is required</span>}
            </div>
            <div className="mb-5 w-full">
              <label htmlFor="repeat-password" className="block mb-2 text-[.8rem] font-bold text-gray-900">Confirm password</label>
              <input
                type="password"
                id="repeat-password"
                name="repeatPassword"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-[.8rem] rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-[.35rem] px-2"
                value={data.repeatPassword}
                onChange={handleData}
              />
              {error.repeatPassword && <span className="text-red-500 text-sm">Passwords do not match</span>}
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded text-[.7rem] px-2 py-2.5 text-center w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
