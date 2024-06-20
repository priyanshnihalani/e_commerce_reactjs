import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { off, onValue, ref } from "firebase/database";
import { useNavigate } from 'react-router-dom';



function Info({ onExistChange }) {
    const [userInfo, setUserInfo] = useState(null);
    let [userInfoRef, setUserInfoRef] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {    
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                userInfoRef = ref(db, `users/${user.uid}/userinfo`);
                setUserInfoRef(userInfoRef);
    
                const unsubscribeFromUserInfo = onValue(userInfoRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (userData) {
                        const { email, firstName, lastName, streetAddress, phone, zip, city, state } = userData;
                        setUserInfo({ email, firstName, lastName, streetAddress, phone, zip, city, state });
                    } else {
                        setUserInfo(null); 
                    }
                });
    
                return () => {
                    off(userInfoRef); // Cleanup listener for userInfo
                    unsubscribeFromUserInfo(); // Detach listener
                };
            } else {
                setUserInfo(null); // Reset userInfo when user logs out
                if (userInfoRef) {
                    off(userInfoRef); // Detach listener from previous user's userInfoRef
                }
                userInfoRef = null; // Reset userInfoRef variable
            }
        });
    
        return () => {
            unsubscribe(); // Cleanup authentication listener
            if (userInfoRef) {
                off(userInfoRef); // Additional cleanup of userInfoRef if needed
            }
        };
    }, []);
    
    

    const handleNavigateToPurchase = () => {
        onExistChange(false)
    };

    if (!userInfo) {
        return <p>Loading...</p>;
    }

    const handleContinue = () => {
        navigate('/purchase/payment')
    }

    return (
        <>
            <div className="max-w-xl mx-auto bg-white rounded px-8 py-6">
                <div className="mb-6">
                    <p className="text-lg font-bold">Contact Information</p>
                    <hr className="my-2" />
                    <p><span className="font-bold">Email:</span> {userInfo.email}</p>
                    <p><span className="font-bold">Phone:</span> {userInfo.phone}</p>
                </div>

                <div className="mb-6">
                    <p className="text-lg font-bold">Personal Information</p>
                    <hr className="my-2" />
                    <div className=" w-full flex ">
                        <p className="w-full"><span className="font-bold">Full Name:</span> {userInfo.firstName} {userInfo.lastName}</p>
                    </div>
                    <p className="mt-3"><span className="font-bold">Address:</span> {userInfo.streetAddress}, {userInfo.city}, {userInfo.state} {userInfo.zip}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 md:px-1 lg:px-2 rounded font-bold" onClick={handleContinue}>
                        Continue
                    </button>
                    <button type="submit" disabled className=" text-gray-600 rounded-full font-bold">
                        OR
                    </button>
                    <button onClick={handleNavigateToPurchase} className="bg-blue-500  hover:bg-blue-700 text-white py-2 px-4 rounded font-bold">
                        Change Info
                    </button>
                </div>
            </div>
        </>
    );
}

export default Info;
