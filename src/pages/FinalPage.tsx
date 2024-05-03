import { useEffect } from "react"
import { useAppSelector } from "../store/store"
import { useNavigate } from "react-router-dom"

export default function FinalPage() {
    const global = useAppSelector(state => state.global)
    const navigate = useNavigate()

    useEffect(() => {
        if (global.ocrResults == null) {
            navigate("/")
        }
    }, [])

    return <div>{JSON.stringify(global)}</div>
}
