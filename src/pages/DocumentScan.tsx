import { useEffect, useRef, useState } from "react"
import { OcrInstance } from "../axios"

const SCREENSHOT_TIME_INTERVAL_MS = 4000
// const VIDEO_HEIGHT = 720
// const VIDEO_WIDTH = 1280

function DocumentScan() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ocrIsRunning, setOcrIsRunning] = useState(false)
  const [foundText, setFoundText] = useState("")

  const [screenshot, setScreenshot] = useState<string>()
  const maskRef = useRef<HTMLCanvasElement>(null)

  async function getScreenshot() {
    if (maskRef.current == null) return

    const ctx = maskRef.current.getContext("2d")
    if (ctx == null || ocrIsRunning || !videoRef.current) return
    const videoRect = videoRef.current.getBoundingClientRect()
    const maskRect = maskRef.current.getBoundingClientRect()

    maskRef.current.width = videoRect.width
    maskRef.current.height = videoRect.height

    ctx.drawImage(videoRef.current, 0, 0)
    let data = maskRef.current.toDataURL("image/png", 1)
    setScreenshot(data)
    runOCR(data)
  }

  function streamCamVideo() {
    const constraints = {
      audio: false,
      video: {
        // width: VIDEO_WIDTH,
        // height: VIDEO_HEIGHT,
        facingMode: "environment"
      }
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async mediaStream => {
        const video = videoRef.current

        if (video === null) {
          console.log("video null")
          return
        }

        video.srcObject = mediaStream
        video.onloadedmetadata = () => video.play()
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message)
      }) // always check for errors at the end.
  }

  async function runOCR(screenshotBase64: string) {
    setOcrIsRunning(true)
    try {
      const formData = new FormData()
      formData.append("base64Image", screenshotBase64)
      formData.append("language", "cze")
      formData.append("scale", "true")
      formData.append("apikey", import.meta.env.VITE_API_KEY)

      const res = await OcrInstance.post("", formData)
      const text = res.data.ParsedResults
      setFoundText(JSON.stringify(text))
      console.log(text)
    } catch (error) {
      console.log(error)
    }

    setOcrIsRunning(false)
  }

  useEffect(() => {
    streamCamVideo()
    const screenShotInterval = setInterval(() => {},
    SCREENSHOT_TIME_INTERVAL_MS)

    return () => {
      clearInterval(screenShotInterval)
      videoRef.current?.pause()
    }
  }, [])

  return (
    <div className="flex items-center flex-col">
      <h1>Video</h1>
      <div className={`relative w-full`}>
        <video className="w-full" autoPlay={true} ref={videoRef}></video>
        <canvas
          className="absolute border-2 w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-0"
          ref={maskRef}
        ></canvas>
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
    </div>
  )
}

export default DocumentScan
