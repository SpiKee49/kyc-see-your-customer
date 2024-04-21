import { useEffect, useRef, useState } from "react"
// import { OcrInstance } from "../axios"
import { createWorker } from "tesseract.js"
import Upscaler from "upscaler"
import deblur from "@upscalerjs/maxim-deblurring"

// const SCREENSHOT_TIME_INTERVAL_MS = 4000

function DocumentScan() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ocrIsRunning, setOcrIsRunning] = useState(false)
  const [foundText, setFoundText] = useState("")

  const [screenshot, setScreenshot] = useState<string>()
  const [deblured, setDeblur] = useState<string>()

  async function getScreenshot() {
    const upscaler = new Upscaler({ model: deblur })
    upscaler.warmup({ patchSize: 512, padding: 2 })
    const canvas = document.createElement("canvas")
    canvas.width = 1280
    canvas.height = 720
    const ctx = canvas.getContext("2d")
    if (ctx == null || ocrIsRunning || !videoRef.current) return
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    let data = canvas.toDataURL("image/png", 1)
    setScreenshot(data)
    const image = new Image()
    image.src = data

    const result = await upscaler.upscale(image, {
      output: "base64",
      patchSize: 512,
      padding: 2,
      progress: progress => console.log(progress)
    })
    setDeblur(result)
    // const API_URL = "127.0.0.1/upload"

    // const res = await axios.post(API_URL, { base64Img: data })
    // console.log(JSON.stringify(res.data))

    // runOCR(data)
  }

  // function streamCamVideo() {
  //   const constraints = {
  //     audio: false,
  //     video: {
  //       facingMode: "environment"
  //     }
  //   }

  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then(async mediaStream => {
  //       const video = videoRef.current

  //       if (video === null) {
  //         console.log("video null")
  //         return
  //       }

  //       video.srcObject = mediaStream
  //       video.onloadedmetadata = () => video.play()
  //     })
  //     .catch(function (err) {
  //       console.log(err.name + ": " + err.message)
  //     }) // always check for errors at the end.
  // }

  async function runOCR(screenshotBase64: string) {
    setOcrIsRunning(true)
    try {
      const worker = await createWorker("slk")
      const ret = await worker.recognize(screenshotBase64)
      console.log(ret.data.text)
      await worker.terminate()
    } catch (error) {
      console.log(error)
    }

    setOcrIsRunning(false)
  }

  useEffect(() => {
    // streamCamVideo()
    // const screenShotInterval = setInterval(() => {},
    // SCREENSHOT_TIME_INTERVAL_MS)

    return () => {
      // clearInterval(screenShotInterval)
      videoRef.current?.pause()
    }
  }, [])

  return (
    <div className="flex items-center flex-col">
      <h1>Video</h1>
      <div className={`relative w-full`}>
        <video className="w-full" autoPlay={true} ref={videoRef}></video>

        <div className="absolute border-2 w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "></div>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white font-light text-center bg-black bg-opacity-25">
          {ocrIsRunning
            ? "Loading..."
            : "Umiestnite doklad na vyhradené miesto"}
        </span>
      </div>
      <button
        className="mx-auto bg-sky-600 text-white rounded-sm my-5 p-10"
        onClick={() => getScreenshot()}
      >
        Take screenshot
      </button>
      <h1>Found text</h1>
      <p>{foundText}</p>
      {screenshot && (
        <>
          <h1>Screenshot </h1>
          <img src={screenshot} />
        </>
      )}
      {deblured && (
        <>
          <h1>deblured </h1>
          <img src={deblured} />
        </>
      )}
    </div>
  )
}

export default DocumentScan
