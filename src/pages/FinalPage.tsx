import { useEffect, useState } from "react"
import { useAppSelector } from "../store/store"
import { useNavigate } from "react-router-dom"
import Profile from "@/components/Profile"
import { usePostNewVerificationMutation } from "@api/api"
import { Verification } from "@assets/types"
import Spinner from "@/components/Spinner"

export default function FinalPage() {
    const global = useAppSelector(state => state.global)
    const navigate = useNavigate()
    const [data, setData] =
        useState<Omit<Verification, "status" | "faceMatched">>()
    const [postNewVerificationRequest, { isLoading }] =
        usePostNewVerificationMutation()

    async function uploadData() {
        if (
            global.birthNumber == null ||
            global.personalInformation == null ||
            global.ocrResults == null ||
            global.faceRecognitionResult == null
        ) {
            navigate("/")
            return
        }
        const result = await postNewVerificationRequest({
            birthNumber: global.birthNumber,
            personalInformation: global.personalInformation,
            documentInformation: {
                imageData: global.documentInformation.imageData ?? ""
            },
            faceRecognitionResult: {
                faceMatched: global.faceRecognitionResult.faceMatched,
                imageData: global.faceRecognitionResult.imageData ?? ""
            }
        }).unwrap()

        const { status, faceMatched, ...rest } = result
        setData(rest)
    }

    useEffect(() => {
        uploadData()
    }, [])

    if (isLoading || !data) return <Spinner />

    return (
        <Profile
            {...data}
            customElement={
                <div className="my-5 border-t-2 p-3 text-center border-sky-600">
                    Informácie boli úspešne uložené v našom systéme. O
                    akýchkoľvek zmenách budete informovaný e-mailom.
                </div>
            }
        />
    )
}
