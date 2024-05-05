import { Verification } from "@assets/types"
import React, { ReactElement } from "react"

function Profile(
    props: Partial<Verification> & { customElement?: ReactElement }
) {
    return (
        <section className="w-full flex flex-row gap-9">
            <div className="flex flex-1 h-full flex-col gap-2 items-stretch justify-start [&>small]:text-sm [&>small]:font-normal [&>small]:flex [&>small]:justify-between">
                <h4>
                    {props.firstName} {props.lastName}
                </h4>
                {props.birthNumber && (
                    <small>
                        <span>Rodné číslo:</span>{" "}
                        <span className="font-bold">{props.birthNumber}</span>
                    </small>
                )}
                {props.email && (
                    <small>
                        <span>E-mail:</span>{" "}
                        <span className="font-bold">{props.email}</span>
                    </small>
                )}
                {props.dateOfBirth && (
                    <small>
                        <span>Dátum narodenia:</span>{" "}
                        <span className="font-bold">{props.dateOfBirth}</span>
                    </small>
                )}
                {props.gender && (
                    <small>
                        <span>Pohlavie:</span>{" "}
                        <span className="font-bold">
                            {props.gender === "male" ? "Muž" : "Žena"}
                        </span>
                    </small>
                )}

                {props.streetNumber && (
                    <small>
                        <span>Ulica:</span>{" "}
                        <span className="font-bold">{props.streetNumber}</span>
                    </small>
                )}
                {props.city && (
                    <small>
                        <span>Obec:</span>{" "}
                        <span className="font-bold">{props.city}</span>
                    </small>
                )}
                {props.ZIP && (
                    <small>
                        <span>PSČ:</span>{" "}
                        <span className="font-bold">{props.ZIP}</span>
                    </small>
                )}
                {props.status && (
                    <small>
                        <span>Stav žiadosti:</span>{" "}
                        <span className="font-bold">{props.status}</span>
                    </small>
                )}

                {props.customElement}
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
                {props.idPicture && (
                    <>
                        <h1 className="text-base">Náhľad OP</h1>
                        <img
                            className="rounded-xl"
                            src={props.idPicture}
                        />
                    </>
                )}
                {props.facePicture && (
                    <>
                        <h1 className="text-base">Náhľad snímky z webkamery</h1>
                        <img
                            className="rounded-xl"
                            src={props.facePicture}
                        />
                    </>
                )}
            </div>
        </section>
    )
}

export default Profile
