import { useNavigate, useParams } from "react-router-dom"
import Profile from "@/components/Profile"
import { useGetVerificationDetailsQuery } from "@api/api"
import { useState } from "react"

export default function AdminProfile() {
    const navigate = useNavigate()
    const [selectedStatus, setSelectedStatus] = useState<string>()
    const { id } = useParams()

    function handleBackButton() {
        navigate(-1)
    }

    if (!id) return <>Zadané nevhodné číslo ako parameter.</>

    const { data, error, isLoading } = useGetVerificationDetailsQuery(id)
    if (isLoading) return

    return (
        <section className="w-full flex flex-col gap-5">
            <button
                className="absolute left-3 top-3 p-2"
                onClick={() => handleBackButton()}
            >
                Späť
            </button>
            <h1 className="border-b-2 border-sky-600">Detail požiadavky</h1>

            {error && <>Zadané nevhodné číslo ako parameter.</>}
            {isLoading && <>Načítavanie</>}
            {data && (
                <Profile
                    {...data}
                    customElement={
                        <div>
                            <label>
                                <select>
                                    <option value="processing"></option>
                                    <option value="redo"></option>
                                    <option value=""></option>
                                </select>
                            </label>
                        </div>
                    }
                />
            )}
        </section>
    )
}
