import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        buyitems: []
    },
    reducers: {
        checkCart: (state, action) => {
            if(state.buyitems != [] && state.items != [] ){
                state.buyitems = []
                state.items = []
            }
            state.items.push(...action.payload)
            
        },
        buyCart: (state, action) => {
            if(state.buyitems != [] && state.items != [] ){
                state.buyitems = []
                state.items = []
            }
            state.buyitems.push(action.payload)
        }
    }
});

export const { checkCart, buyCart } = cartSlice.actions;
export default cartSlice.reducer;