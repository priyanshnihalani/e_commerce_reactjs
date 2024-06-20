import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import './Order.css'
function Order() {
    const [total, setTotal] = useState(0);
    const [finalAmount, setfinalAmount] = useState(0)
    const selector = useSelector(state => state.cart.items.length > 0 ? state.cart.items : state.cart.buyitems)
    const [data, setData] = useState([]);
    const setSelector = useSelector(state => state.purchase.completePurchase)
    useEffect(() => {
        setData(selector)
        let totalAmount = 0;
        let finalamount = 0;
        if (selector) { 
            selector.forEach(item => {
                totalAmount += item.price * item.quantity;
            })
        };

        finalamount = totalAmount;
        setTotal(parseFloat(totalAmount).toFixed(2))
        setfinalAmount(parseFloat(finalamount).toFixed(2))


    }, [selector])

    
    
    return (
        <>
            <div className='bg-gray-100 p-3 h-full'>
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                    {
                        data?.map((item) => (
                            <div className="flex flex-col  md:flex-row md:justify-between md:space-x-4 items-center space-y-0 py-3" id="items" key={item.id}>
                                <div className="flex flex-col items-center  space-x-4 space-y-3 md:flex-row">

                                    <div>
                                    <img src={item.image} alt="" className="w-20 md:w-12 lg:w-20" id="productimage"/>
                                    </div> 
                                    <div className="flex flex-col md:block justify-center items-center ">
                                        <p className="font-medium text-[12px] lg:text-[16px]">{item.title} </p>
                                        <p className="text-xs mt-2 text-gray-500">Quantity: {Number(item.quantity)}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-[12px] lg:text-[16px] pt-1 md:pt-[4rem] lg:pt-[3.2rem] lg:ml-1 ">${`${Number(item.quantity) * Number(item.price)}`}</p>
                            </div>
                        ))}
                    <div className="border-t pt-4">
                        <button className="w-full text-left text-sm text-blue-500 font-medium mb-2">+ Add Discount</button>
                        <button className="w-full text-left text-sm text-blue-500 font-medium">+ Add Giftcard</button>
                    </div>
                    <div className="border-t pt-4 text-sm">
                        <div className="flex justify-between items-center mb-2">
                            <p>Subtotal</p>
                            <p>${total}</p>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <p>Delivery</p>
                            <p>--</p>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <p>Taxes</p>
                            <p>--</p>
                        </div>
                        <div className="flex justify-between items-center font-bold text-sm">
                            <p>Total</p>
                            <p>${finalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Order;