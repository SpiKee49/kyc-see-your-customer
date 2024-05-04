import { configureStore } from "@reduxjs/toolkit"
import globalSlice from "./slice/globalSlice"
import {
    TypedUseSelectorHook,
    createSelectorHook,
    useDispatch
} from "react-redux"
import { globalApi } from "@api/api"

export const store = configureStore({
    reducer: {
        global: globalSlice,
        [globalApi.reducerPath]: globalApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(globalApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> =
    createSelectorHook()
// export const createAppSelector = createSelector.withTypes<RootState>()
