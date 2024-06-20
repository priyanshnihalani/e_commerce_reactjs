import Order from './Order';
import Shipping from './Shipping';
import { useState, useEffect } from 'react';
import { ref, get  } from 'firebase/database';
import { auth, db } from '../firebase';
import Info from './Info';
import { useSelector } from 'react-redux';

const Purchase = () => {
  const [exist, setexist] = useState(false)
  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const userinfo = ref(db, `users/${user.uid}/userinfo`);
        const snapshot = await get(userinfo);
        if (snapshot.exists()) {
          setexist(true)
        }
        else{
          setexist(false)
        }
      }
    })
      return unsubsribe
  }, [])
  function handleExistChange(value){
    setexist(value)
  }

  return (
    <div className="bg-gray-100 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-7">
          <h1 className="text-xl sm:text-2xl font-bold">Apna Bazar</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {exist ? <Info onExistChange={handleExistChange} /> : <Shipping />}
          <Order />
        </div>
      </div>
    </div>
  );
};

export default Purchase;
