import { ChangeEvent, useState } from "react"
import { createWorker } from "tesseract.js"
import { clasifier } from "../utils/image-processing"
import { useAppSelector } from "../store/store"

// import { toBase64 } from "../utils/conversions"
// @ts-ignore

// const SCREENSHOT_TIME_INTERVAL_MS = 4000

function DocumentScan() {
  const personalInformation = useAppSelector(
    state => state.global.personalInformation
  )
  const [ocrIsRunning, setOcrIsRunning] = useState(false)
  const [foundText, setFoundText] = useState("")

  const [screenshot, setScreenshot] = useState<string | null>()
  const [analysis, setAnalysis] = useState<Record<string, boolean>>()
  async function runOCR(screenshotBase64: string) {
    setOcrIsRunning(true)
    const worker = await createWorker("slk")
    const ret = await worker.recognize(screenshotBase64)
    await worker.terminate()

    const polishedText = ret.data.text
      .split(/([a-zéčíťýžľščôá]+)|(\d+[\/]\d+|\d{2}[.]\d{2}[.]\d{4})/gi)
      .filter(item => item !== undefined && item.length > 1)
      .join(" ")
    //TODO: analyze
    setFoundText(polishedText)

    let analyze: Record<string, boolean> = {}
    if (personalInformation == null) return

    Object.entries(personalInformation).map(([key, value]) => {
      analyze[key] = polishedText.includes(value)
    })
    console.log(analysis)
    setAnalysis(analyze)
    setOcrIsRunning(false)
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]

    const img = new Image()
    const imgSrc = URL.createObjectURL(file)
    img.src = imgSrc

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      img.width = img.naturalWidth
      img.height = img.naturalHeight
      setScreenshot(imgSrc)
      clasifier.classify(img, (err: any, results: any) => {
        if (err) {
          console.log("error")
        }
        console.log("results", results)
        // const data: Record<string, number> = {}
        // results.map((item: any) => {
        //   data[item.label] = item.confidence
        // })
        // console.log("updated", data)
      })

      canvas.width = img.width
      canvas.height = img.height
      if (ctx == null) return
      // Convert the image to grayscale
      ctx.filter =
        "saturate(700%) grayscale(100%) contrast(400%) brightness(100%)"
      ctx.drawImage(img, 0, 0)
      // Set the grayscale image source
      const grayscaleSrc = canvas.toDataURL("image/png")
      runOCR(grayscaleSrc)
    }
  }

  return (
    <div className="flex items-center flex-col gap-4">
      <h1 className="text-center">
        Nahrajte fotografiu osobného dokladu, na ktorom figuruje meno a vaša
        fotografia.
      </h1>
      <p className="text-sm text-center">
        Uistite sa, že nahraná fotografia je v dostatočnej kvalite a optimálnych
        svetelných podmienkach tak aby boli údaje na nej čo najčítateľnejšie.
      </p>

      {screenshot && (
        <div>
          <img alt="not found" width={"500px"} src={screenshot} />
          <br />
          <button onClick={() => setScreenshot(null)}>Remove</button>
        </div>
      )}

      {ocrIsRunning && <p>Loading...</p>}

      {foundText && <p className="text-sm">{foundText}</p>}
      <h1>Results</h1>
      {analysis &&
        Object.entries(analysis).map(([key, value]) => (
          <p>
            {key} : {value}
          </p>
        ))}
      <input
        type="file"
        name="myImage"
        className="w-1/2 h-auto"
        onChange={handleImageUpload}
      />
    </div>
  )
}

export default DocumentScan
