import { ChangeEvent, useEffect, useRef, useState } from "react"
import { createWorker } from "tesseract.js"
import { clasifier } from "@utils/imageProcessing"
import { useAppDispatch, useAppSelector } from "../store/store"
import { updateImageUrl, updateOcrResults } from "../store/slice/globalSlice"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { toBase64 } from "@utils/conversions"

function DocumentScan() {
    const dispatch = useAppDispatch()
    const personalInformation = useAppSelector(
        state => state.global.personalInformation
    )
    const birthNumber = useAppSelector(state => state.global.birthNumber)
    const [ocrIsRunning, setOcrIsRunning] = useState(false)
    const [screenshot, setScreenshot] = useState<string | null>()
    const hiddenFileUploadRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (personalInformation == null) {
            navigate("/")
        }
    }, [])

    async function runOCR(screenshotBase64: string) {
        const worker = await createWorker("slk")
        const ret = await worker.recognize(screenshotBase64)
        await worker.terminate()

        const polishedText = ret.data.text
            .split(/([a-zéčíťýžľščôá]+)|(\d+[\/]\d+|\d{2}[.]\d{2}[.]\d{4})/gi)
            .filter(item => item !== undefined && item.length > 1)
            .join(" ")

        let analyze: Record<string, boolean> = {}

        try {
            if (personalInformation == null)
                throw new Error("personal informations are not set")

            Object.entries(personalInformation).map(([key, value]) => {
                analyze[key] = polishedText.includes(value)
            })
            if (birthNumber === null) return

            const birthNumberWithSlash = `${birthNumber.slice(
                0,
                6
            )}/${birthNumber.slice(6)}`
            analyze["birthNumber"] = polishedText.includes(birthNumberWithSlash)
            dispatch(updateOcrResults(analyze))
        } catch (e) {
            console.log(e)
        }
    }

    async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
        setOcrIsRunning(true)
        const file = event.target.files![0]

        const img = new Image()
        const imgSrc = await toBase64(file)

        if (imgSrc == null)
            throw new Error(
                "There was an error converting image to base64 format"
            )

        img.src = imgSrc
        dispatch(updateImageUrl({ imageData: imgSrc }))
        img.onload = async () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            img.width = img.naturalWidth
            img.height = img.naturalHeight
            setScreenshot(imgSrc)
            clasifier.classify(img, (err: any, results: any) => {
                if (err) {
                    console.log("error")
                }
                const data: Record<string, number> = {}
                results.map((item: any) => {
                    data[item.label] = item.confidence
                })
            })

            canvas.width = img.width
            canvas.height = img.height
            if (ctx == null) return
            // Convert the image to grayscale
            ctx.filter =
                "saturate(800%) grayscale(100%) contrast(400%) brightness(100%)"
            ctx.drawImage(img, 0, 0)
            // Set the grayscale image source
            const grayscaleSrc = canvas.toDataURL("image/png")
            await runOCR(grayscaleSrc)
            setOcrIsRunning(false)
            navigate("/face-recognition")
        }
    }

    return (
        <div className="flex items-center flex-col gap-4">
            <h1 className="text-center">
                Nahrajte fotografiu osobného dokladu, na ktorom figuruje meno a
                vaša fotografia.
            </h1>
            <p className="text-sm text-center">
                Uistite sa, že nahraná fotografia je v dostatočnej kvalite a
                optimálnych svetelných podmienkach tak aby boli údaje na nej čo
                najčítateľnejšie.
            </p>

            {screenshot && (
                <img
                    alt="not found"
                    width={"500px"}
                    src={screenshot}
                />
            )}

            <input
                ref={hiddenFileUploadRef}
                type="file"
                className="hidden"
                onChange={handleImageUpload}
            />
            <Button
                disabled={ocrIsRunning}
                handleClick={() => {
                    if (hiddenFileUploadRef.current) {
                        hiddenFileUploadRef.current.click()
                    }
                }}
            >
                {ocrIsRunning ? "Načítavanie..." : "Vložte súbor"}
            </Button>
        </div>
    )
}

export default DocumentScan
