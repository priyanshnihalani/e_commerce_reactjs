import './Footer.css';
import { FaCopyright, FaCcMastercard, FaCcVisa, FaGooglePay, FaEnvelope } from 'react-icons/fa';
import { useLocation } from 'react-router';

function Footer() {
    const location = useLocation()
    let footerStyle = {}
    if (location.pathname.startsWith('/Products')) {
        footerStyle = { backgroundColor: 'white' };
      }
    return (
        <footer className="w-full border-t-2" style={footerStyle}>
            <div className="flex flex-col md:flex-row justify-center md:justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-20 p-3 border-b-2 foot pb-3">
                <div className="flex-1 md:flex-none">
                    <ul className="text-sm space-y-1">
                        <li className="font-bold text-blue-400">Account</li>
                        <li>User Login</li>
                        <li>User Register</li>
                        <li>Account Settings</li>
                        <li>My Orders</li>
                    </ul>
                </div>
                <div className="flex-1 md:flex-none">
                    <ul className="text-sm space-y-1">
                        <li className="font-bold text-blue-400">Categories</li>
                        <li>Sports & Fitness</li>
                        <li>Furniture</li>
                        <li>Clothing</li>
                        <li>Grocery</li>
                    </ul>
                </div>
                <div className="flex-1 md:flex-none">
                    <ul className="text-sm space-y-1">
                        <li className="font-bold text-gray-800">Company</li>
                        <li>About Us</li>
                        <li>Career</li>
                        <li>Rules and Terms</li>
                        <li>Find a Store</li>
                    </ul>
                </div>
                <div className="flex-1 md:flex-none hidden md:block">
                    <ul className="text-sm space-y-1">
                        <li className="font-bold text-blue-400">Help</li>
                        <li>Contact Us</li>
                        <li>Money Refund</li>
                        <li>Order Status</li>
                        <li>Shipping Info</li>
                    </ul>
                </div>
                <div className="flex-1 md:flex-none hidden lg:block">
                    <ul className="text-sm space-y-1">
                        <li className="font-bold text-gray-800">Social</li>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                        <li>Youtube</li>
                    </ul>
                </div>
            </div>
            <div className="hidden sm:flex justify-between items-center mx-3 mt-2 mb-2 -m-3 space-y-0 text-[.8rem] text-gray-700">
                <div className="flex items-center space-x-2">
                    <FaCopyright />
                    <span>2024 Apna Bazar</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope />
                    <span>apnabazar16@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaCcMastercard size={18} />
                    <FaCcVisa size={18} />
                    <FaGooglePay size={18} />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
