import { useDispatch } from 'react-redux';
import './Cart.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { ref, onValue, remove, update, get } from 'firebase/database';
import { useNavigate } from 'react-router';
import { checkCart } from '../features/Cart/Cart';


function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            if (userAuth) {
                const cartRef = ref(db, `users/${userAuth.uid}/cart/items/`);
                onValue(cartRef, (snapshot) => {
                    const cartData = snapshot.val();
                    let items = [];
                    if (cartData) {
                        items = Object.keys(cartData).map(key => ({
                            id: key,
                            ...cartData[key]
                        }));
                    }
                    setCartItems(items);
                });
            } else {
                setLoading(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    function handleDelete(itemId) {
        const userId = auth.currentUser.uid;
        if (userId) {
            const cartRef = ref(db, `users/${userId}/cart/items/${itemId}`);
            const countRef = ref(db, `users/${userId}/cart/`)

            remove(cartRef)
            .then( async () => {
                const snapshot = await get(ref(db, `users/${userId}/cart/items`));
                const remainingItems = snapshot.val();
                const newCount = remainingItems ? Object.keys(remainingItems).length : 0;
                await update(countRef, { cartcount: newCount });
                console.log(newCount)
            }).catch((error) => {
                console.error("Firebase delete failed: ", error);
            });
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    function handleCart(){
        dispatch(checkCart(cartItems))
        console.log(cartItems)
        navigate('/purchase')
    }

    return (
        <div className='pos w-full min-h-screen m-0'>
            {cartItems.length === 0 ? (
                <div className="text-center">
                    <img src={"shopping.png"} alt="Empty Cart Image" className='imgs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                    <h1 className='textpos text-gray-800 mt-3 font-bold text-[10px] md:text-lg absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[180px] md:translate-y-[250px]'>
                        "Oops! Looks like your cart is empty. Time to do some shopping!"
                    </h1>
                </div>
            ) : (
                <div className='flex flex-col items-center w-full pt-10'>
                    {cartItems.map((item) => (
                        <div key={item.id} className='cart-item flex flex-col md:flex-row justify-center items-center space-x-8 m-0 mb-2
                         border-2 py-3 md:p-3 lg:p-3 rounded-lg w-[99%] md:w-[41rem] lg:w-[50rem] lg:px-7 xxl:w-[55rem]'>
                            <img src={item.image} alt={item.title} className='mt-3 w-1/3 md:w-1/4 h-[100px] md:h-[200px] lg:h-[200px] xl:w-1/5 xl:h-[200px] ' />
                            <div className='cart-item-details mt-5'>
                                <h2 className='font-bold text-[12px] md:text-[16px]'>{item.title}</h2>
                                <p className='mt-5  text-[14px] md:text-[18px]'>{item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description}</p>

                                <div className='flex items-center space-x-3 justify-center mt-4 mr-5'>
                                    <p className='text-[12px] md:text-[16px]'><span className='font-bold text-[14px] md:text-[16px]'>Price: </span> ${item.price}</p>
                                    <p className='text-[12px] md:text-[16px]'><span className='font-bold text-[14px] md:text-[16px]'>Quantity: </span> {item.quantity}</p>
                                    <p className='text-[12px] md:text-[16px]'><span className='font-bold text-[14px] md:text-[16px]'>Total Price: </span>
                                     ${parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                    <button className='border-red-500 md:py-2 md:px-3 py-1 px-2 rounded border-2' onClick={() => handleDelete(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} className='text-red-600' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='flex justify-center items-center m-5'>
                        <button className='bg-blue-500 hover:bg-orange-700 text-white font-bold p-2 rounded' onClick={handleCart}>Check It Out</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
