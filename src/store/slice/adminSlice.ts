import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

const initialState: { id: string | null } = {
    id: null
}

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        updateId: (state, action: PayloadAction<string | null>) => {
            state.id = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateId } = adminSlice.actions

export default adminSlice.reducer
