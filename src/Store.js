import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from './features/Cart/Cart';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import  purchaseReducer  from "./features/Purchase/Purchase";
const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
  cart: cartReducer,
  purchase: purchaseReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
});

const persistor = persistStore(store);
export {persistor, store} ;