import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { FormSchemaType } from "../../Types"

interface GlobalState {
  birthNumber: number | null
  personalInformation: FormSchemaType | null
  documentInformation: {
    imageUrl: string
  } | null
}

const initialState: GlobalState = {
  birthNumber: null,
  personalInformation: null,
  documentInformation: null
}

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setBirthNumber: (state, action: PayloadAction<number>) => {
      state.birthNumber = action.payload
    },
    setPersonalInformations: (state, action: PayloadAction<FormSchemaType>) => {
      state.personalInformation = action.payload
    },
    updateImageUrl: (state, action: PayloadAction<string>) => {
      state.documentInformation = {
        imageUrl: action.payload
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setBirthNumber, setPersonalInformations, updateImageUrl } =
  globalSlice.actions

export default globalSlice.reducer
