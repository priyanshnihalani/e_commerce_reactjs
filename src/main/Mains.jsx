import { useState, useEffect } from "react";
import Footer from "../footer/Footer";
import Slider from "./slider/slider";
import './Mains.css'
import Header from "../header/Header";
import { Link } from "react-router-dom";
import ProductComponent from "./newproducts";
import { useDispatch } from "react-redux";

function Mains() {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleData, setVisibleData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const products = await response.json();
                setData(products);
                setVisibleData(products.slice(0, 10));
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

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
        return <h1 className="error sm:text-[16px] md:text-[20px] lg:text-[26px]xl:text-[32px]">Your, Internet May Not Connected.</h1>;
    }

    function loadMore() {
        setVisibleData(data.slice(0, visibleData.length + 10));
    }

    return (
        <>
            <Header />
            <Slider />
            <div className="flex justify-between items-center mt-0 bg-white">
                <div className="md:text-[23px] ml-10 font-bold mt-5 py-5">
                    <h2>Popular Products</h2>
                </div>
                <div className="flex flex-row justify-end mr-10 text-[13px] md:text-[16px] ">
                    {visibleData.length !== data.length && (
                        <button className="bg-transparent text-blue-500 p-2 rounded border-blue-400 border-2 lg:px-3 mt-5" onClick={loadMore}>See All</button>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap w-full justify-center p-2 bg-white">
                {visibleData.map(product => (
                    <div key={product.id} className="product mx-2 border-[1px]">
                        <Link to={`/Products/${product.id}`}>
                            <div className="images">
                                <img src={product.image} alt="" className="" />
                            </div>
                            <div className="titleprice border-t-0">
                                <h2 className="text-[16px] font-medium mt-6 mb-0">{product.title.length > 15 ? product.title.substring(0, 20) + '...' : product.title}</h2>
                                <p className="text-[12px] font-semibold">${product.price}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <ProductComponent />
            <Footer />
        </>
    );
}

export default Mains;
