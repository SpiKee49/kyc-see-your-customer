import { useEffect } from "react"
import { useAppSelector } from "../store/store"
import { useNavigate } from "react-router-dom"
import Profile from "@/components/Profile"

export default function FinalPage() {
    const global = useAppSelector(state => state.global)
    const navigate = useNavigate()

    useEffect(() => {
        if (global.ocrResults == null) {
            navigate("/")
        }
    }, [])

    return (
        <Profile
            firstName={global.personalInformation!.firstName}
            lastName={global.personalInformation!.lastName}
            dateOfBirth={global.personalInformation!.dateOfBirth}
            gender={global.personalInformation!.gender}
            streetNumber={global.personalInformation!.streetNumber}
            city={global.personalInformation!.city}
            ZIP={global.personalInformation!.ZIP}
            birthNumber={global.birthNumber!}
            idPicture={global.documentInformation!.imageData}
            facePicture={global.faceRecognitionResult!.imageData}
            email={global.personalInformation!.email}
        />
    )
}
