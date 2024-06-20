import { useState } from "react";
import {  useSelector } from "react-redux";
import Order from "./Order";
import { auth, db } from "../firebase";
import { push, ref} from "firebase/database";
import { useNavigate } from "react-router";

function Payment() {
    const navigate = useNavigate();
    const selector = useSelector(state => state.cart.items.length > 0 ? state.cart.items : state.cart.buyitems)
    const [paymentMethod, setPaymentMethod] = useState('');
    const [delivery, setDelivery] = useState('standard');
    const [detail, setDetails] = useState({ cardName: '', cardNumber: '', expDate: '', cvv: '' })
    const [error, setError] = useState({ cardName: false, cardNumber: false, expDate: false, cvv: false })
    const date = new Date()
    let orderdate = date.toLocaleDateString('en-IN')
    function handleData(e) {
        if (paymentMethod === 'card') {
            setDetails({ ...detail, [e.target.name]: e.target.value })
        }
    }

    function handleSubmit() {
        const { cardName, cardNumber, expDate, cvv } = detail;
        if (paymentMethod === 'card') {
            if (cardName !== '' && cardNumber !== '' && expDate !== '' && cvv !== null) {
                auth.onAuthStateChanged(async user => {
                    if (user) {
                        const orderRef = ref(db, `users/${user.uid}/orders`)
                        await push(orderRef, selector.map(item => ({ ...item, payment: 'card', date: orderdate, deliveryType: delivery, cardInfo: { cardName, cardNumber, expDate, cvv } })))
                        navigate('/thankyou')
                    }
                })
            }
            else {
                setError({
                    cardName: cardName ? false : 'Card Name should not be empty',
                    cardNumber: cardName ? false : 'Card Number should not be empty',
                    expDate: cardName ? false : 'Expiry Date should not be empty',
                    cvv: cardName ? false : 'CVV should not be empty',
                })
            }
        }
        else {
            auth.onAuthStateChanged(async user => {
                if (user) {
                    const orderRef = ref(db, `users/${user.uid}/orders`)
                    await push(orderRef, selector.map(item => ({ ...item, payment: 'cash', date: orderdate, deliveryType: delivery })))
                    navigate('/thankyou')
                }
            })
        }

    }


    return (
        <>
            <div className="bg-gray-100 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto bg-white shadow p-4 sm:p-6 md:p-8">
                    <div className="flex justify-between items-center mb-7">
                        <h1 className="text-xl sm:text-2xl font-bold">Apna Bazar</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        <div>
                            <h2 className="text-lg font-semibold mb-4 mt-4">Payment Information</h2>
                            <div className="space-y-4 bg-white p-2 xl:mx-0">
                                <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5'>
                                    <label className="block p-4 border-2 border-gray-200 rounded-md hover:border-brand transition-colors cursor-pointer w-full sm:w-auto">
                                        <div className="flex items-center space-x-3">
                                            <input type="radio" name="delivery" value="standard" className="text-brand focus:ring-brand"
                                                onChange={() => setDelivery("standard")} defaultChecked />
                                            <span className="font-semibold text-[16px]">Standard Delivery</span>
                                        </div>
                                        <p className="mt-2 ml-3 text-xs text-gray-600">Free, 3-5 business days</p>
                                    </label>

                                    <label className="block p-4 border-2  border-gray-200 rounded-md hover:border-brand transition-colors cursor-pointer w-full sm:w-auto">
                                        <div className="flex items-center space-x-3">
                                            <input type="radio" name="delivery" value="express" className="text-brand focus:ring-brand" onChange={() => setDelivery("express")}
                                            />
                                            <span className="font-semibold text-[16px]">Express Delivery</span>
                                        </div>
                                        <p className="mt-2 ml-3 text-xs text-gray-600">$9.99, 1-2 business days</p>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-8 p-0 py-5 bg-white w-full">
                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
                                    <div
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors w-full sm:w-auto ${paymentMethod === 'cash' ? 'border-brand bg-brand bg-opacity-10' : 'border-gray-200 hover:border-brand'
                                            }`}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                                className="text-brand focus:ring-brand"
                                            />
                                            <label className="font-semibold text-[16px] px-0">Cash on Delivery</label>
                                        </div>
                                        <p className="text-xs text-gray-600 ml-0">Pay with cash when your order is delivered.</p>
                                    </div>

                                    <div
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors w-full sm:w-auto ${paymentMethod === 'card' ? 'border-brand bg-brand bg-opacity-10' : 'border-gray-200 hover:border-brand'
                                            }`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethod('card')}
                                                className="text-brand focus:ring-brand"
                                            />
                                            <label className="font-semibold text-[16px]">Credit / Debit Card</label>
                                        </div>
                                        <p className="text-xs text-gray-600 ml-0 px-3">Pay securely with your credit or debit card.</p>
                                    </div>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                                        <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                                        <form className="space-y-4">
                                            <div>
                                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                                <input type="text" id="cardName" name="cardName" placeholder="Name on card" className="w-full text-[16px] p-1 px-2 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" onChange={handleData} />
                                                {error.cardName && <p className="text-red-500 text-[14px]">{error.cardName}</p>}

                                            </div>

                                            <div>
                                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" className="w-full text-[16px] p-1 px-2 sm:p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" onChange={handleData} />
                                                {error.cardNumber && <p className="text-red-500 text-[14px]">{error.cardNumber}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                                    <input type="text" id="expDate" name="expDate" placeholder="MM / YY" className="w-full text-[14px] p-1 px-2 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" onChange={handleData} />
                                                    {error.expDate && <p className="text-red-500 text-[14px]">{error.expDate}</p>}

                                                </div>
                                                <div>
                                                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                    <input type="text" id="cvv" name="cvv" placeholder="123" className="w-full text-[14px] p-1 px-2 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" onChange={handleData} />
                                                    {error.cvv && <p className="text-red-500 text-[14px]">{error.cvv}</p>}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <button
                                    className={`w-full bg-brand bg-blue-600 text-white p-4 rounded-md font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 ${!paymentMethod && 'opacity-50 cursor-not-allowed'}`}
                                    disabled={!paymentMethod} onClick={handleSubmit}
                                >
                                    {paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
                                </button>
                            </div>
                        </div>
                        <Order />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
