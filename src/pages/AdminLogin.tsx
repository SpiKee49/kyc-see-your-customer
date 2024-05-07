import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import ErrorLabel from "../components/ErrorLabel"
import { useAppDispatch } from "../store/store"
import { usePostUserLoginMutation } from "@api/api"
import { updateId } from "@/store/slice/adminSlice"

function AdminLogin() {
    const dispatch = useAppDispatch()
    const [userLogin] = usePostUserLoginMutation()
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)

    const navigate = useNavigate()
    async function handleClick() {
        const data = await userLogin({ userName, password }).unwrap()

        if (data == null) {
            setError(true)
            return
        }

        dispatch(updateId(data))
        navigate("/admin-page")
    }

    return (
        <>
            <label
                htmlFor="your-id"
                className="flex flex-col gap-1 w-full "
            >
                Prihlásenie
                <input
                    className="p-2 rounded-md outline-sky-600 border-2 border-sky-600"
                    type="text"
                    value={userName}
                    name="your-id"
                    placeholder="login"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="p-2 rounded-md outline-sky-600 border-2 border-sky-600"
                    value={password}
                    type="password"
                    placeholder="heslo"
                    onChange={e => setPassword(e.target.value)}
                    onKeyUp={e => e.key === "Enter" && handleClick()}
                />
                {error && (
                    <ErrorLabel>Zlé prihlasovacie meno alebo heslo</ErrorLabel>
                )}
            </label>
            <Button
                handleClick={handleClick}
                disabled={userName === "" || password === ""}
            >
                Odoslať
            </Button>
        </>
    )
}

export default AdminLogin
