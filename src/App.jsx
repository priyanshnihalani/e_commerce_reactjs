import React from 'react';
import Mains from './main/Mains.jsx';
import { Routes } from 'react-router';
import { Route } from 'react-router-dom';
import Login from './Login/Login.jsx';
import SignUp from './SignUp/Signup.jsx';
import Cart from './Cart/Cart.jsx';
import Products from './Products/Products.jsx';
import Purchase from './Purchase/Purchase.jsx';
import Profile from './Profiles/Profile.jsx';
import Payment from './Purchase/Payment.jsx';
import Thanks from './ThankYou/Thanks.jsx';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Mains />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/cart/' element={<Cart />} />
        <Route path='/products/:id' element={<Products />} />
        <Route path='/purchase' element={<Purchase />} />
        <Route path='/purchase/payment' element={<Payment />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/thankyou' element={<Thanks />} />
      </Routes>
    </>
  );
};

export default App;
