import { BiLogOut } from "react-icons/bi";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import './Profile.css'

function Profile() {
    const [name, setName] = useState(null);
    const [data, setData] = useState([]);
    const [userInfo, setuserInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            auth.onAuthStateChanged(async user => {
                if (user) {
                    const username = ref(db, `users/${user.uid}/`)
                    const fetchRef = ref(db, `users/${user.uid}/orders`);
                    const userRef = ref(db, `users/${user.uid}/userinfo`)
                    onValue(fetchRef, (snapshot) => {
                        setData(snapshot.val());
                    })
                    onValue(userRef, (snapshot) => {
                        setuserInfo(snapshot.val());
                    });
                    onValue(username, (snapshot) => {
                        if (snapshot.exists()) {
                            setName(snapshot.val().name);
                        }
                    })
                }
            });
        };
        fetchData();
    }, []);

    function handleLogout() {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    }
    console.log(Object.keys(data))

    return (
        <div className="lg:flex mx-6">
            <div>
                <div className="flex flex-col items-center">
                    <h1 className="text-center text-lg mt-8 text-gray-800 font-bold lg:text-left mx-5 my-5">PROFILE</h1>

                    <div className="flex flex-col items-center shadow mx-2 my-2 py-2 rounded-md w-full lg:px-8 lg:py-5 bg-white" >
    
                        <div className="flex flex-col items-center mt-3 py-1">
                            <div>
                                
                                <img src="user.png" alt="" className="w-40 mb-5" id="images" />
                            </div>
                            <h1 className=" text-md font-semibold text-gray-800">{name}</h1>
                            <div className="flex flex-col items-center mt-3 text-sm">
                                <h1 className="font-semibold text-gray-800">{userInfo && userInfo.state},{userInfo && userInfo.city},{userInfo && userInfo.zip}</h1>
                                <h1 className="font-semibold text-gray-800">{userInfo && userInfo.phone}</h1>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button className=" hidden lg:block bg-red-500 text-white text-3xl px-20 py-2 mt-5 rounded-md" onClick={handleLogout}><BiLogOut /></button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto py-7 px-4">
                <h1 className="text-lg lg:text-lg text-center font-bold text-gray-800 mb-8 lg:text-left">YOUR ORDERS</h1>
                <div>
                    {Object.keys(data).map((key) => (
                        <div key={key}>
                            {data[key].map((item) => (
                                <div key={item.id} className="flex flex-col lg:flex-row bg-white rounded shadow overflow-hidden mt-[.70rem]">
                                    <div className="flex justify-center lg:justify-start lg:ml-10 items-center my-10 lg:my-0 w-full lg:w-[20rem]">
                                        <img src={item.image} alt={item.title} className="w-35 h-40 " />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-md font-semibold text-gray-800 mb-2">{item.title}</h2>
                                        <p className="text-[.8rem] text-gray-600 mb-4">{item.description.length > 100 ? item.description.substring(0, 100) + "..." : item.description}</p>
                                        <div className="flex items-center justify-between mb-4 mt-3 text-sm">
                                            <p className="text-md  text-gray-700"><span className="font-semibold">Total Price:</span> ${parseFloat(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between mb-[0.3rem] text-sm">
                                            <p className="text-gray-700"><span className="font-semibold">Order Date: </span> {item.date}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Quantity:</span> {item.quantity}</p>
                                        </div>
                                        <div className="flex flex-wrap  mr-1 space-y-1 md:space-y-0 items-center justify-between text-sm mt-2">
                                            <p className="text-gray-700"><span className="font-semibold">Payment Type:</span> {item.payment}</p>
                                            <p className="text-gray-700 "><span className="font-semibold">Delivery Type:</span> {item.deliveryType}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


            <div>
                <button className="bg-red-500 w-full py-3 flex justify-center text-white text-2xl rounded-md my-3 lg:hidden" onClick={handleLogout}><BiLogOut /></button>
            </div>
        </div>
    )
}
export default Profile