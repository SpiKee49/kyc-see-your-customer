import Button from "../components/Button"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ErrorLabel from "../components/ErrorLabel"
import { FormSchema, FormSchemaType } from "../assets/types"
import { useAppSelector } from "../store/store"
import { useDispatch } from "react-redux"
import { setPersonalInformations } from "../store/slice/globalSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function InformationForm() {
    const formData = useAppSelector(state => state.global.personalInformation)
    const birthNumber = useAppSelector(state => state.global.birthNumber)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (birthNumber == null) {
            navigate("/")
        }
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) })

    const onSubmit: SubmitHandler<FormSchemaType> = data => {
        console.log(data)
        dispatch(setPersonalInformations(data))
        navigate("/document-scan")
    }

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label className="text-sm">
                Krstné meno:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="text"
                    value={formData?.firstName}
                    {...register("firstName")}
                    required
                />
                <ErrorLabel>
                    {errors.firstName && errors.firstName?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                Priezvisko:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="text"
                    value={formData?.lastName}
                    {...register("lastName")}
                    required
                />
                <ErrorLabel>
                    {errors.lastName && errors.lastName?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                E-mail:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="email"
                    value={formData?.lastName}
                    {...register("email")}
                    required
                />
                <ErrorLabel>
                    {errors.lastName && errors.lastName?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                Dátum narodenia:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="date"
                    value={formData?.dateOfBirth}
                    {...register("dateOfBirth")}
                    required
                />
                <ErrorLabel>
                    {errors.dateOfBirth && errors.dateOfBirth?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                Pohlavie:
                <select
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    value={formData?.gender}
                    {...register("gender")}
                    required
                >
                    <option value={"male"}>Muž</option>
                    <option value={"female"}>Žena</option>
                </select>
                <ErrorLabel>
                    {errors.gender && errors.gender?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                Ulica a číslo domu:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="text"
                    value={formData?.streetNumber}
                    {...register("streetNumber")}
                    required
                />
                <ErrorLabel>
                    {errors.streetNumber && errors.streetNumber?.message}
                </ErrorLabel>
            </label>
            <label className="text-sm">
                Mesto:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="text"
                    value={formData?.city}
                    {...register("city")}
                    required
                />
                <ErrorLabel>{errors.city && errors.city?.message}</ErrorLabel>
            </label>
            <label className="text-sm">
                PSČ:
                <input
                    className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
                    type="text"
                    value={formData?.ZIP}
                    {...register("ZIP")}
                    required
                />
                <ErrorLabel>{errors.ZIP && errors.ZIP?.message}</ErrorLabel>
            </label>

            <Button
                handleClick={() => {}}
                disabled={false}
            >
                Odoslať
            </Button>
        </form>
    )
}

export default InformationForm
