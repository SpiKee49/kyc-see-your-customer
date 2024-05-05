import { useGetAllVerificationsQuery } from "@api/api"
import { Verification } from "@assets/types"
import { verificationStatus } from "@utils/conversions"
import { useNavigate } from "react-router-dom"

function AdminPage() {
    const navigate = useNavigate()
    const { data, error, isLoading } = useGetAllVerificationsQuery()

    const dummyData: Array<Partial<Verification>> = data
        ? Array(10).fill(data[0])
        : []

    function handleItemClick(id?: string) {
        if (id == null) return

        navigate(`/verification/${id}`)
    }

    return (
        <div className="w-full">
            <h1 className="text-center mb-5">Administracia</h1>
            <div className="flex flex-col items-stretch justify-start gap-3">
                <div className="flex flex-row flex-1 justify-start items-center [&>span]:flex-1 [&>span]:text-sm border-b-2 border-sky-600 px-4">
                    <span>Rodné číslo</span>
                    <span>Krstné meno</span>
                    <span>Priezvisko</span>
                    <span>Stav verifikacie</span>
                </div>
                {isLoading && <span>Načítavanie...</span>}
                {error && (
                    <span>
                        Vyskytla sa chyba, skúste to znova neskôr prosím.
                    </span>
                )}
                {data &&
                    dummyData.map((item, index) => (
                        <div
                            key={item.birthNumber! + index}
                            className="flex flex-row flex-1 text-base justify-start items-center [&>span]:flex-1 [&>span]:font-normal p-4 hover:bg-gray-100 rounded-xl cursor-pointer"
                            onClick={() => handleItemClick(item.birthNumber)}
                        >
                            <span>{item.birthNumber}</span>
                            <span>{item.firstName}</span>
                            <span>{item.lastName}</span>
                            <span>
                                {item.status && verificationStatus[item.status]}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default AdminPage
