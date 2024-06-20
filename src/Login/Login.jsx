import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {}
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState({ email: false, password: false });

  const handleData = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  function validemail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = data;

    let emailError = '';
    if (email === '') {
      emailError = 'Email is required';
    } else if (!validemail(email)) {
      emailError = 'Invalid email';
    }
    setError({
      email: emailError,
      password: password === ''
    });
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password).then(() => {
        setLoading(true)
        navigate('/');
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        setLoading(false)
      })
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-full max-w-xs mx-auto bg-white p-10 px-[3rem] shadow-lg rounded-lg">
        <h1 className="font-bold text-center text-lg pb-2">Sign In</h1>
        <h1 className="my-3 text-[.8rem] text-red-500">{message}</h1>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-[.8rem] font-bold text-gray-900">Your email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2"
            placeholder="name@mail.com"
            required
            value={data.email}
            onChange={handleData}
          />
          {error.email && <span className="text-red-500 text-[.6rem]">{error.email}</span>}
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-[.8rem] font-bold text-gray-900">Your password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2"
            placeholder="e.g. Aa12$@"
            value={data.password}
            onChange={handleData}
          />
          {error.password && <span className="text-red-500 text-[.6rem] mb-0 pb-0">Password is required</span>}
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[.8rem] px-5 py-2.5 text-center"
          onClick={handleSubmit}
        >
          Sign in
        </button>
        <div className="mt-5 text-center text-[.75rem]">
          <Link to="/register" className="text-blue-600 hover:underline">Don't have an account? Sign up</Link>
        </div>
      </form>
    </div>

  );
}

export default Login;
