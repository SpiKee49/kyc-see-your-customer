// Need to use the React-specific entry point to allow generating React hooks
import { Verification } from "@assets/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// Define a service using a base URL and expected endpoints
export const globalApi = createApi({
    reducerPath: "globalApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:3000/" }),
    endpoints: builder => ({
        getAllVerifications: builder.query<Array<Partial<Verification>>, void>({
            query: () => `verification`
        })
    })
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAllVerificationsQuery } = globalApi
