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

    return (
        <section className="w-full flex flex-row gap-9">
            <div className="flex flex-1 h-full flex-col gap-2 items-stretch justify-start [&>small]:text-sm [&>small]:font-normal [&>small]:flex [&>small]:justify-between">
                <h1>Osobné informácie</h1>
                <h4>
                    {global.personalInformation?.firstName}{" "}
                    {global.personalInformation?.lastName}
                </h4>
                <small>
                    <span>Rodné číslo:</span>{" "}
                    <span className="font-bold">{global.birthNumber}</span>
                </small>
                <small>
                    <span>E-mail:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.email}
                    </span>
                </small>
                <small>
                    <span>Dátum narodenia:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.dateOfBirth}
                    </span>
                </small>
                <small>
                    <span>Pohlavie:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.gender === "male"
                            ? "Muž"
                            : "Žena"}
                    </span>
                </small>
                <small>
                    <span>Ulica:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.streetNumber}
                    </span>
                </small>
                <small>
                    <span>Obec:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.city}
                    </span>
                </small>
                <small>
                    <span>PSČ:</span>{" "}
                    <span className="font-bold">
                        {global.personalInformation?.ZIP}
                    </span>
                </small>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-base">Náhľad OP</h1>
                <img
                    className="rounded-xl"
                    src={global.documentInformation.imageData}
                />
                <h1 className="text-base">Náhľad snímky z webkamery</h1>
                <img
                    className="rounded-xl"
                    src={global.faceRecognitionResult.imageData}
                />
            </div>
        </section>
    )
}
