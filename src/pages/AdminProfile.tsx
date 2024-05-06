import { useNavigate, useParams } from "react-router-dom"
import Profile from "@/components/Profile"
import {
    useGetVerificationDetailsQuery,
    useUpdateVerificationMutation
} from "@api/api"
import { useEffect, useState } from "react"
import { VERIFICATION_STATUS_DICT } from "../utils/conversions"
import { Verification, VerificationStatus } from "@assets/types"
import Button from "@/components/Button"

export default function AdminProfile() {
    const navigate = useNavigate()
    const [selectedStatus, setSelectedStatus] = useState<VerificationStatus>()
    const [loadedData, setLoadedData] = useState<Verification>()
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const { id } = useParams()
    const [
        updateVerification, // This is the mutation trigger
        { isLoading: isUpdating } // This is the destructured mutation result
    ] = useUpdateVerificationMutation()

    function handleBackButton() {
        navigate(-1)
    }

    function handleSelectChange(value: VerificationStatus) {
        setSelectedStatus(value)
        if (value !== loadedData?.status) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }

    function handleSaveButton() {
        updateVerification({
            status: selectedStatus,
            birthNumber: loadedData!.birthNumber
        })
        setButtonDisabled(true)
    }

    if (!id) return <>Zadané nevhodné číslo ako parameter.</>

    const { data, error, isLoading } = useGetVerificationDetailsQuery(id)

    useEffect(() => {
        setLoadedData(data)
    }, [data])

    if (isLoading) return

    return (
        <section className="w-full flex flex-col gap-5">
            <button
                className="absolute left-5 top-5 p-2 hover:bg-white rounded-lg"
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
                            <h5 className="border-b-2  border-sky-600 my-5">
                                Zmeny
                            </h5>
                            <label className="flex flex-1 justify-between items-center">
                                <span className="text-lg">Stav žiadosti:</span>
                                <select
                                    onChange={e =>
                                        handleSelectChange(
                                            e.target.value as VerificationStatus
                                        )
                                    }
                                    className="font-normal text-base text-right"
                                    value={selectedStatus ?? data.status}
                                >
                                    <option value="processing">
                                        {VERIFICATION_STATUS_DICT["processing"]}
                                    </option>
                                    <option value="redo">
                                        {VERIFICATION_STATUS_DICT["redo"]}
                                    </option>
                                    <option value="prohibited">
                                        {VERIFICATION_STATUS_DICT["prohibited"]}
                                    </option>
                                    <option value="verified">
                                        {VERIFICATION_STATUS_DICT["verified"]}
                                    </option>
                                </select>
                            </label>
                            <Button
                                disabled={buttonDisabled}
                                handleClick={() => handleSaveButton()}
                            >
                                {isUpdating ? "Ukládam..." : "Uložiť"}
                            </Button>
                        </div>
                    }
                />
            )}
        </section>
    )
}
