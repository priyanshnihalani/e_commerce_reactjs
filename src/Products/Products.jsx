import './Products.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { auth, db } from '../firebase';
import { ref, set, get, update, push, onValue } from "firebase/database";
import { buyCart } from '../features/Cart/Cart';
import localData from '../newproduct.json'

function Products() {
    const quantityref = useRef();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [review, setReview] = useState({ headline: '', description: '' });
    const [errorreiveiw, seterrorreiview] = useState({ headline: false, description: false });
    const [dispreview, setDisplayReview] = useState([])
    const [rating, setRating] = useState({ rate: 0, count: 0 })
    useEffect(() => {

        async function fetchProducts() {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const products = await response.json();
                setData([products]);
                setRating(products.rating);

            } catch (error) {


                try {
                    const product = localData.find(item => item.id === parseInt(id));
                    if (product) {
                        setData([product]);
                        setRating(product.rating);
                    } else {
                        throw new Error('Product not found in local data');
                    }

                } catch (error) {
                    console.error('Error fetching data from local JSON file:', error);
                    setError(error); // Set error state to display appropriate message to user
                }
                console.error('Error fetching data from API:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [id]);


    useEffect(() => {
        const reviewsRef = ref(db, `reviews/${id}`);
        const unsubscribe = onValue(reviewsRef, (snapshot) => {
            const reviews = snapshot.val() || {};
            setDisplayReview(reviews);
        });
        return () => unsubscribe();
    }, [id])

    if (loading) {
        return (
            <div className="preloader">
                <svg className="cart" role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
                        <g className="cart__track" stroke="hsla(0,10%,10%,0.1)">
                            <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
                            <circle cx="43" cy="111" r="13" />
                            <circle cx="102" cy="111" r="13" />
                        </g>
                        <g className="cart__lines" stroke="currentColor">
                            <polyline className="cart__top" points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" strokeDasharray="338 338" strokeDashoffset="-338" />
                            <g className="cart__wheel1" transform="rotate(-90,43,111)">
                                <circle className="cart__wheel-stroke" cx="43" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
                            </g>
                            <g className="cart__wheel2" transform="rotate(90,102,111)">
                                <circle className="cart__wheel-stroke" cx="102" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
                            </g>
                        </g>
                    </g>
                </svg>
                <div className="preloader__text">
                    <p className="preloader__msg">Bringing you the goods…</p>
                    <p className="preloader__msg preloader__msg--last">This is taking long. Something’s wrong.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <h1 className="error sm:text-[16px] md:text-[20px] lg:text-[26px] xl:text-[32px]">Error</h1>
    }

    function handlebuy(item, quantities) {
        auth.onAuthStateChanged(userAuth => {
            if (!userAuth) {
                navigate('/login', {
                    state: { message: "Please Sign In or Sign Up before buying." }
                });
                return
            }
            dispatch(buyCart({ ...item, quantity: quantities }));
            navigate('/purchase');
        })
    }
    function handlecart(item, quantities) {
        try {

            auth.onAuthStateChanged(async userAuth => {

                if (userAuth) {
                    const userid = userAuth.uid;
                    const cartRef = ref(db, `users/${userid}/cart/items/${item.id}`);
                    const cartCountsRef = ref(db, `users/${userid}/cart/items`);
                    const countRef = ref(db, `users/${userid}/cart`);

                    const snapshot = await get(cartRef);

                    if (snapshot.exists()) {
                        const existingItem = snapshot.val();
                        const newQuantity = Number(existingItem.quantity) + Number(quantities) || 1;
                        await update(cartRef, { quantity: newQuantity });
                        console.log("Cart Updated");
                    } else {
                        await set(cartRef, { ...item, quantity: quantities });
                        console.log("Item added to cart");

                        const cartCountsSnapshot = await get(cartCountsRef);
                        const remainingItems = cartCountsSnapshot.val() || {};
                        const newCount = Object.keys(remainingItems).length;

                        await update(countRef, { cartcount: newCount });
                    }
                } else {
                    navigate('/login', {
                        state: { message: "Please Sign In or Sign Up before adding to cart." }
                    });
                }
            })
        }
        catch (error) {
            console.error("Error handling cart:", error);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value })
    }
    async function handleSubmit(e) {
        e.preventDefault()

        const { headline, description } = review;
        seterrorreiview({
            headline: headline ? false : "Headline Should not be empty",
            description: description ? false : "Description Should not be empty"
        })

        if (headline !== '' && description !== '') {

            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const userRef = ref(db, `users/${user.uid}/`);
                    let name;

                    const snapshot = await get(userRef);
                    name = snapshot.val().name;

                    const reviewRef = ref(db, `reviews/${id}`);
                    await push(reviewRef, { ...review, username: name });

                    setReview({
                        headline: '',
                        description: '',
                    })

                    alert("Review Recorded");
                }
                else{
                    navigate('/login')
                }
            });
        }
    }
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating.rate) {
                stars.push(<span key={i} style={{ color: 'orange' }}>★</span>);
            } else {
                stars.push(<span key={i} style={{ color: 'silver' }}>★</span>);
            }
        }
        return stars;
    };
    return (
        <>
            <Header />
            <div className="main-content">
                <div className='flex justify-end items-center space-x-2 p-3'>
                    <div>
                        {renderStars()}
                    </div>
                    <span className='text-xs text-gray-700'>{rating.count}</span>
                </div>
                {data.map((item) => (
                    <div className="flex flex-col lg:flex-row items-center  text-[12px] h-full bg-white shadow rounded-lg overflow-hidden py-20"
                        key={item.id}>
                        <img
                            id="images"
                            src={item.image}
                            alt=""
                            className="w-full h-[200px] lg:w-1/4 xl:w-1/3 xl:h-[250px] object-contain m-5"
                        />
                        <div className="w-full lg:w-3/4 xl:w-1/2 p-5">
                            <div className="font-bold text-[20px] lg:text-[22px]">{item.title}</div>
                            <div className="mt-5 text-[14px] lg:text-[16px] xl:text-[18px] leading-relaxed">
                                {item.description.length > 200
                                    ? item.description.substring(0, 200) + '...'
                                    : item.description}
                            </div>
                            <div className="mt-5 text-[16px] xl:text-[18px]">
                                <span className="font-semibold">Price:</span> ${parseInt(item.price).toFixed(2)}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 xl:w-1/2 p-5">
                            <div className="text-center flex justify-center items-center mb-5">
                                <h1 className="font-semibold text-[16px] xl:text-[18px]">Quantity:</h1>
                                <select
                                    name=""
                                    id=""
                                    className="ml-2 px-2 py-1 rounded-sm border-2 xl:py-2 xl:px-3"
                                    ref={quantityref}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div className="flex justify-center text-center space-x-2">
                                <button
                                    type="submit"
                                    className="mt-2 mb-2 w-1/2 md:w-1/3 lg:w-[45%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => handlebuy(item, quantityref.current.value)}
                                >
                                    Buy Now
                                </button>
                                <button
                                    type="submit"
                                    className="mt-2 mb-2 w-1/6 md:w-[10%] lg:w-[12%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => handlecart(item, quantityref.current.value)}
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {Object.keys(dispreview).length > 0 ? (<div className='w-full my-0 pt-[4rem] p-4 bg-white'>
                    <h1 className='font-bold text-lg mb-6 text-center'>What our Customers Say?</h1>
                    <div className='space-y-2'>
                        {Object.keys(dispreview).map((reviewKeyz, index) => (
                            <div key={index} className='review-card p-6 border rounded-lg bg-white'>
                                <h2 className='text-lg font-semibold mb-2'>{dispreview[reviewKeyz].username}</h2>
                                <h3 className='text-sm text-gray-700 mb-2'>{dispreview[reviewKeyz].headline}</h3>
                                <p className='text-xs text-gray-600'>{dispreview[reviewKeyz].description}</p>
                            </div>
                        ))}
                    </div>
                </div>) : (<div></div>)}

                <div className='flex flex-col items-center m-3'>
                    <div>
                        <div>
                            <h1 className='text-[1.1rem] font-semibold mb-4 mt-8 md:mb-3 lg:mt-14'>Create Review</h1>
                        </div>
                    </div>
                    <hr className='border w-full' />
                    <div className='flex flex-col w-full md:w-1/2 mt-3'>
                        <h1 className='font-semibold text-[18px] mt-3 mb-2'>Add a headline</h1>
                        <input type="text" name="headline" value={review.headline} id="" placeholder="What's most important to know?" className='border-2 text-[16px] py-1 px-2' onChange={handleChange} />
                        {errorreiveiw.headline && <p className="text-red-500 text-[14px]">{errorreiveiw.headline}</p>}
                    </div>
                    <hr className='border w-full mt-5' />
                    <div className='flex flex-col w-full md:w-1/2 mb-3 mt-4'>
                        <h1 className='font-semibold text-[18px] mt-3 mb-2'>Add a written review</h1>
                        <textarea name="description" id="" className='border-2 text-[14px] py-[0.40rem] px-2' placeholder='what did you like or dislike? what did you use this product for?' rows={7} onChange={handleChange} value={review.description}></textarea>
                        {errorreiveiw.description && <p className="text-red-500 text-[14px]">{errorreiveiw.description}</p>}
                    </div>
                    <div className='flex flex-col justify m-3'>
                        <button className='text-[20px] bg-blue-500 text-white px-5 py-2 rounded' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Products;
