import { ChangeEvent, useState } from "react"
import Button from "../components/Button"
import { literal, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.literal("male").or(literal("female")),
  dateOfBirth: z.string().date(),
  street: z.string(),
  city: z.string(),
  ZIP: z
    .number()
    .gte(5, { message: "PSČ musí obsahovať 5 cifier" })
    .lte(5, { message: "PSČ musí obsahovať 5 cifier" })
})
type FormSchemaType = z.infer<typeof FormSchema>

function InformationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    ZIP: ""
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="text-sm">
        Krstné meno:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="text"
          value={formData.firstName}
          {...register("firstName")}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Priezvisko:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="text"
          value={formData.lastName}
          {...register("lastName")}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Dátum narodenia:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="date"
          value={formData.dateOfBirth}
          {...register("dateOfBirth")}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Pohlavie:
        <select
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          value={formData.gender}
          {...register("gender")}
          onChange={handleChange}
          required
        >
          <option value={"male"}>Muž</option>
          <option value={"female"}>Žena</option>
        </select>
      </label>
      <label className="text-sm">
        Ulica a číslo domu:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="tel"
          value={formData.dateOfBirth}
          {...register("dateOfBirth")}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Mesto:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="text"
          value={formData.ZIP}
          {...register("ZIP")}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        PSČ:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="number"
          value={formData.street}
          {...register("street")}
          onChange={handleChange}
          required
        />
      </label>

      <Button handleClick={() => {}} disabled={true}>
        Odoslať
      </Button>
    </form>
  )
}

export default InformationForm
