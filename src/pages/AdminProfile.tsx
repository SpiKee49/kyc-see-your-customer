import { useNavigate, useParams } from "react-router-dom"
import Profile from "@/components/Profile"
import { useGetVerificationDetailsQuery } from "@api/api"

export default function AdminProfile() {
    const navigate = useNavigate()
    const { id } = useParams()

    function handleBackButton() {
        navigate(-1)
    }

    if (!id) return <>Zadané nevhodné číslo ako parameter.</>

    const { data, error, isLoading } = useGetVerificationDetailsQuery(id)
    if (isLoading) return

    return (
        <section className="w-full flex flex-col ">
            <button
                className="absolute left-3 top-3 p-2"
                onClick={() => handleBackButton()}
            >
                Späť
            </button>
            <h1>Detail požiadavky</h1>

            {error && <>Zadané nevhodné číslo ako parameter.</>}
            {isLoading && <>Načítavanie</>}
            {data && <Profile {...data} />}
        </section>
    )
}
