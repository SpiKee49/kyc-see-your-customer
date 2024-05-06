// Need to use the React-specific entry point to allow generating React hooks
import {
    Verification,
    VerificationRequestBody,
    VerificationStatus
} from "@assets/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// Define a service using a base URL and expected endpoints
export const globalApi = createApi({
    reducerPath: "globalApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:3000/" }),
    tagTypes: ["Verifications"],
    endpoints: builder => ({
        getAllVerifications: builder.query<
            Array<Partial<Verification> & Pick<Verification, "birthNumber">>,
            void
        >({
            query: () => `verification`,
            providesTags: results =>
                results
                    ? [
                          ...results.map(
                              ({ birthNumber }) =>
                                  ({
                                      type: "Verifications",
                                      birthNumber
                                  } as const)
                          ),
                          { type: "Verifications", id: "LIST" }
                      ]
                    : [{ type: "Verifications", id: "LIST" }]
        }),
        getVerificationDetails: builder.query<Verification, string>({
            query: id => `verification/${id}`,
            providesTags: [{ type: "Verifications" }]
        }),

        getVerificationStatus: builder.query<VerificationStatus | null, string>(
            {
                query: id => `verification/status/${id}`
            }
        ),

        updateVerification: builder.mutation<
            Verification,
            Partial<Verification> & Pick<Verification, "birthNumber">
        >({
            query: ({ birthNumber, ...data }) => ({
                url: `verification/${birthNumber}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: (result, error, { birthNumber }) => [
                { type: "Verifications", birthNumber }
            ]
        }),

        postNewVerification: builder.mutation<
            Verification,
            VerificationRequestBody
        >({
            query: data => ({
                url: `verification`,
                method: "POST",
                body: data
            })
        })
    })
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
    useGetAllVerificationsQuery,
    useGetVerificationDetailsQuery,
    useUpdateVerificationMutation,
    usePostNewVerificationMutation,
    useLazyGetVerificationStatusQuery
} = globalApi
