import { ChangeEvent, useState } from "react"
// import { OcrInstance } from "../axios"
import { createWorker } from "tesseract.js"

// import { toBase64 } from "../utils/conversions"
// @ts-ignore

// const SCREENSHOT_TIME_INTERVAL_MS = 4000

function DocumentScan() {
  const [ocrIsRunning, setOcrIsRunning] = useState(false)
  const [foundText, setFoundText] = useState("")

  const [screenshot, setScreenshot] = useState<Blob | null>()

  async function runOCR(screenshotBase64: string) {
    setOcrIsRunning(true)
    const worker = await createWorker("slk")
    const ret = await worker.recognize(screenshotBase64)
    await worker.terminate()
    const text = ret.data.text

    let tokenizer = text.split(/  \W+ /)

    setFoundText(tokenizer.map(item => item + "\n").toString())
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
      runOCR(grayscaleSrc)
    }
  }

  return (
    <div className="flex items-center flex-col">
      <h1>Upload and Display Image usign React Hook's</h1>

      {screenshot && (
        <div>
          <img
            alt="not found"
            width={"500px"}
            src={URL.createObjectURL(screenshot)}
          />
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
