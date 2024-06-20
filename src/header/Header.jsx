import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch } from 'react-icons/fa';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../firebase';
import { ref, onValue } from 'firebase/database';

function Header() {
    const [name, setName] = useState(null);
    const [itemCount, setitemCount] = useState(0);
    const [user, setUser] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const userRef = ref(db, 'users/' + user.uid)
                const countRef = ref(db, `users/${user.uid}/cart/cartcount`);
                onValue(countRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setitemCount(snapshot.val());
                    }
                });
                setUser(true);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setName(snapshot.val().name);
                    }
                })
            }
        })
    }, [itemCount]);


    return (
        <header className='head p-2 pb-1 md:p-0 md:pt-2 bg-white shadow-sm border-b-[1px] lg:pt-4'>
            <div className='flex justify-between items-center border-b-[1px] pb-2 lg:pb-3'>
                <div className='relative group flex items-center w-full md:w-[20%] lg:w-[20%]'>
                    <span className="m-3 text-lg font-bold text-gray-800 md:ml-4 lg:ml-7">Apna Bazar</span>
                    <div className='bg-white absolute top-10 min-w-full shadow-md hidden group-hover:block md:group-hover:hidden z-10 mt-7 py-4'>
                        <nav className='md:ml-2'>
                            <ul className='flex flex-col space-y-2 text-[14px] lg:text-[16px] items-center text-gray-700'>
                                <li ><Link to="/books">Books</Link></li>
                                <hr className='w-full'/>
                                <li ><Link to="/electronics">Electronics</Link></li>
                                <hr className='w-full'/>
                                <li ><Link to="/fitness">Fitness & Gym</Link></li>
                                <hr className='w-full'/>
                                <li ><Link to="/clothing">Clothing</Link></li>
                                <hr className='w-full'/>
                                <li><Link to='/furniture'>Furniture</Link></li>
                                <hr className='w-full'/>
                                <li><Link to='/grocery'>Grocery</Link></li>
                                <hr className='w-full'/>
                                <li><Link to='/more'>...More</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className='hidden md:flex md:items-center md:flex-grow md:mx-10 space-x-0 lg:ml-[0px] lg:mr-[200px] xl:mr-[300px]'>
                    <input
                        type="text"
                        placeholder='Search'
                        className='border-[1px] border-gray-400 px-3 py-1 rounded-md w-full flex-grow xl:py-1 xl:px-2 '
                    />
                    <button className='bg-blue-600 px-3 py-2 rounded-md text-white ml-2 xl:py-2 xl:px-3 '>
                        <FaSearch />
                    </button>
                </div>

                <div className='flex items-center space-x-3'>
                    {user ? <div className='relative text-gray-400'>
                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[12px] rounded-full w-3 h-3 flex items-center justify-center font-bold'>
                            {itemCount}
                        </span>
                        <Link to={'/cart'}>
                            <FontAwesomeIcon icon={faShoppingCart} className='text-xl' />
                        </Link>
                    </div> : ""}
                    <div className='relative group'>
                         <div className='text-[13px] text-gray-400 flex items-center cursor-pointer'>
                            <span className='mx-2 border-[1px] rounded-full p-2'>
                                <Link to={user? "/profile" : "/login"} >
                                    <FaUser size={18} className='text-[28px]' />
                                </Link>
                            </span>
                        </div> 
                    </div>
                    <div className='hidden lg:block lg:pr-9 text-gray-700'>
                        <h2 className='flex justify-center font-bold'>Welcome!</h2>
                        {name == null || name === '' ? (
                            <div className=' text-[14px] xxl:text-[16px] text-blue-500 font-semibold'>Please Login or Register </div>
                        ) : (
                            <p className='text-[.6rem] text-gray-800 font-playwrite'>{name}.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-center items-center m-3 md:hidden'>
                <input
                    type="text"
                    placeholder='Search'
                    className='border-[1px] border-gray-400 px-3 py-1 rounded-sm w-[70%] md:w-full '
                />
                <button className='bg-blue-600 px-3 py-2 rounded-sm text-white'>
                    <FaSearch />
                </button>
            </div>
            <div className='hidden md:block md:bg-white md:min-w-full md:space-x-0 text-gray-500 pt-2 p-2 lg:pl-4'>
                <nav className='md:ml-2'>
                    <ul className='flex space-x-2 text-[14px] lg:text-[16px] items-center my-auto'>
                        <li ><Link to="/books">Books</Link></li>
                        <li ><Link to="/electronics">Electronics</Link></li>
                        <li ><Link to="/fitness">Fitness & Gym</Link></li>
                        <li ><Link to="/clothing">Clothing</Link></li>
                        <li><Link to='/furniture'>Furniture</Link></li>
                        <li><Link to='/grocery'>Grocery</Link></li>
                        <li><Link to='/more'>...More</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
