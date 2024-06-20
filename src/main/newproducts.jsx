import React, { useState, useEffect } from 'react';
import data from '../newproduct.json';
import { Link } from 'react-router-dom';
import './Mains.css'
const ProductComponent = () => {
    const [products, setProducts] = useState([]);
    const [visibleData, setVisibleData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProducts(data);
                setVisibleData(data.slice(0, 10));
            } catch (error) {
                console.log('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    const loadMore = () => {
        setVisibleData(products.slice(0, visibleData.length + 10));
    };

    return (
        <>
            <div className="flex justify-between items-center mt-0 py-5 bg-white  ">
                <div className="md:text-[23px] ml-10 font-bold mt-5">
                    <h2>Newly Available Products</h2>
                </div>
                <div className="flex flex-row justify-end mr-10 text-[13px] md:text-[16px] ">
                    {visibleData.length !== products.length && (
                        <button className="bg-transparent text-blue-500 p-2 rounded border-blue-400 border-2 lg:px-3 mt-5" onClick={loadMore}>
                            See All
                        </button>   
                    )}
                </div>
            </div>
            <div className="flex flex-wrap w-full justify-center bg-white pb-5">
                {visibleData.map(product => (
                    <div key={product.id} className="product mx-2 border-[1px]">
                        <Link to={`/Products/${product.id}`}>
                            <div className="mt-0">
                                <img src={product.image} alt="" className="w-full" />
                            </div>
                            <div className="titleprice border-t-0">
                                <h2 className="text-[16px] font-medium mt-6 mb-0">{product.title.length > 15 ? product.title.substring(0, 20) + '...' : product.title}</h2>
                                <p className="text-[12px] font-semibold">${product.price}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProductComponent;
