import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { validateBirthNumber } from "../utils/validators"
import Button from "../components/Button"
import ErrorLabel from "../components/ErrorLabel"
import { setBirthNumber } from "../store/slice/globalSlice"
import { useAppDispatch } from "../store/store"

function Landing() {
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [valid, setValid] = useState(true)

  const navigate = useNavigate()
  function handleClick() {
    if (inputRef.current) {
      dispatch(setBirthNumber(inputRef.current.value))
      navigate("/personal-info")
    }
  }

  function handleInputChange(value: string) {
    const isValid = validateBirthNumber(value)
    setValid(isValid)
    setButtonDisabled(!isValid)
  }

  return (
    <>
      <label htmlFor="your-id" className="flex flex-col gap-1 w-full ">
        Rodné číslo
        <input
          ref={inputRef}
          className="p-2 rounded-md outline-sky-600 border-2 border-sky-600"
          type="text"
          name="your-id"
          placeholder="0000000000"
          onChange={e => handleInputChange(e.target.value)}
        />
        {!valid && <ErrorLabel> Neplátne rodné číslo</ErrorLabel>}
        <small className="w-full text-center font-light text-sm">
          Vložte rodné číslo bez '/ '
        </small>
      </label>
      <Button handleClick={handleClick} disabled={buttonDisabled}>
        Odoslať
      </Button>
    </>
  )
}

export default Landing
