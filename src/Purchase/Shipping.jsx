import { useState } from 'react';
import { auth, db } from '../firebase';
import { ref, set, get, update } from 'firebase/database';
import { useNavigate } from 'react-router';
function Shipping() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        streetAddress: '',
        phone: '',
        zip: '',
        city: '',
        state: '',
    });

    const [errors, setErrors] = useState({
        email: false,
        firstName: false,
        lastName: false,
        streetAddress: false,
        phone: false,
        zip: false,
        city: false,
        state: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    function validemail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, firstName, lastName, streetAddress, phone, zip, city, state } = formData;

        let emailError = '';
        if (email === '') {
            emailError = 'Email is required';
        } else if (!validemail(email)) {
            emailError = 'Invalid email';
        }

        setErrors({
            email: emailError,
            firstName: firstName ? false : 'First name is required',
            lastName: lastName ? false : 'Last name is required',
            streetAddress: streetAddress ? false : 'Street address is required',
            phone: phone ? false : 'Phone number is required',
            zip: zip ? false : 'Zip code is required',
            city: city ? false : 'City is required',
            state: state ? false : 'State is required'
        });

        if (!emailError && firstName && lastName && streetAddress && phone && zip && city && state) {
            console.log(formData);
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const userid = user.uid;
                    const userinfo = ref(db, `users/${userid}/userinfo`)
                    await set(userinfo, formData);
                    setFormData({
                        email: '',
                        firstName: '',
                        lastName: '',
                        streetAddress: '',
                        phone: '',
                        zip: '',
                        city: '',
                        state: '',
                    });
                    navigate('/purchase/payment');
                }
            })
        }
    };
    return (
        <>
            <div>
                <h2 className="text-lg font-semibold mb-4 mt-4">Shipping Information</h2>
                <form className="text-sm pl-2 pr-5" onSubmit={handleSubmit} method="post">
                    <div className="grid grid-cols-1 gap-4">
                        <div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-[14px]">{errors.email}</p>}

                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p className="text-red-500 text-[14px]">{errors.firstName}</p>}
                            </div>

                            <div>

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p className="text-red-500 text-[14px]">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                name="streetAddress"
                                placeholder="Street address"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formData.streetAddress}
                                onChange={handleChange}
                            />
                            {errors.streetAddress && <p className="text-red-500 text-[14px]">{errors.streetAddress}</p>}
                        </div>

                        <div>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="(+91) 1347834384"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="text-red-500 text-[14px]">{errors.phone}</p>}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>

                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="Zip"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.zip}
                                    onChange={handleChange}
                                />
                                {errors.zip && <p className="text-red-500 text-[14px]">{errors.zip}</p>}

                            </div>
                            <div>

                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                {errors.city && <p className="text-red-500 text-[14px]">{errors.city}</p>}

                            </div>
                            <div>

                                <select value={formData.state}
                                    name="state"
                                    className="w-full p-2 border border-gray-300 rounded text-gray-400"
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select state</option>
                                    <option value="Gujarat" >Gujarat</option>
                                    <option value="Maharastra">Maharastra</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Andhra pradesh">Andhra Prades</option>
                                </select>
                                {errors.state && <p className="text-red-500 text-[14px]">{errors.state}</p>}
                            </div>
                        </div>

                        <button type="submit" className="bg-blue-500 p-3 rounded font-bold text-white">
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Shipping;