import { createSlice } from "@reduxjs/toolkit";

const PurchaseSlice = createSlice({
    name: 'purchase',
    initialState: {
        completePurchase: false
    },
    reducers: {
        purchase: (state, action) => {
            if (state.completePurchase == false) {
                state.completePurchase = action.payload;
            }
            else{
                state.completePurchase = false;
            }
        }
    }
});
export const { purchase } = PurchaseSlice.actions;
export default PurchaseSlice.reducer;