import { Link } from "react-router-dom";
function Thanks() {
    const date = new Date();
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + 7);

    const futureDateString = futureDate.toLocaleDateString('en-IN'); // Format the date if needed
    console.log(futureDateString);
    return (
        <>
            <div className="w-full min-h-screen flex flex-col justify-center items-center">
                <h1 className="font-bold text-gray-700 text-[1.5rem]">Thank You</h1>
                <p className="mt-3 text-[0.8rem] text-gray-900">Your order has been placed.</p>
                <p className="text-[0.8rem] text-gray-900">An email with your order detail will be sent you shortly.</p>
                <p className="mt-5 text-[0.8rem] text-gray-600">Expected Date: {futureDateString}</p>
                <Link to={'/'} className="mt-5 border-2 p-2 font-bold text-gray-700 border-gray-700">
                    <h1>Continue Shopping</h1>
                </Link>
            </div>
        </>
    )
}
export default Thanks;