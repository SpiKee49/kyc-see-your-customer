import { ChangeEvent, useState } from "react"
import { createWorker } from "tesseract.js"
import { clasifier } from "../utils/image-processing"
import { number } from "zod"

// import { toBase64 } from "../utils/conversions"
// @ts-ignore

// const SCREENSHOT_TIME_INTERVAL_MS = 4000

function DocumentScan() {
  const [ocrIsRunning, setOcrIsRunning] = useState(false)
  const [foundText, setFoundText] = useState("")

  const [screenshot, setScreenshot] = useState<string | null>()

  async function runOCR(screenshotBase64: string) {
    setOcrIsRunning(true)
    const worker = await createWorker("slk")
    const ret = await worker.recognize(screenshotBase64)
    await worker.terminate()
    const text = ret.data.text

    let tokenizer = text
      .split(/([a-zéčíťýžľščôá]+)|(\d+[\/]\d+|\d{2}[.]\d{2}[.]\d{4})/gi)
      .filter(item => item !== undefined && item.length > 1)
      .join(" ")
    //TODO: analyze
    setFoundText(tokenizer)
    setOcrIsRunning(false)
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      // Convert the image to grayscale
      ctx!.drawImage(img, 0, 0)
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)

      clasifier.classify(imageData, (err: any, results: Array<any>) => {
        if (err) {
          console.log("error")
        }
        // const data: Record<string, number> = {}
        // results.map(item => {
        //   data[item.label] = item.confidence
        // })
        console.log(results)
      })
      const data = imageData.data

      const factor = (259 * (75 + 255)) / (255 * (259 - 90))
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg // Red
        data[i + 1] = avg // Green
        data[i + 2] = avg // Blue

        // Apply contrast
        data[i] = factor * (data[i] - 128) + 128
        data[i + 1] = factor * (data[i + 1] - 128) + 128
        data[i + 2] = factor * (data[i + 2] - 128) + 128
      }

      ctx!.putImageData(imageData, 0, 0)

      // Set the grayscale image source
      const grayscaleSrc = canvas.toDataURL("image/png")
      setScreenshot(grayscaleSrc)
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
      {foundText && <p>{foundText}</p>}
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
