import { useEffect, useRef, useState } from "react"
import { createWorker } from "tesseract.js"

const SCREENSHOT_TIME_INTERVAL_MS = 4000
const VIDEO_HEIGHT = 720
const VIDEO_WIDTH = 1280

function DocumentScan() {
  const cnv = document.createElement("canvas")
  cnv.width = VIDEO_WIDTH
  cnv.height = VIDEO_HEIGHT
  cnv.style.width = VIDEO_WIDTH + "px"
  cnv.style.height = VIDEO_HEIGHT + "px"
  const ctx = cnv.getContext("2d")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [screenshot, setScreenshot] = useState<string>()
  const [ocrIsRunning, setOcrIsRunning] = useState(false)

  async function getScreenshot() {
    if (ctx == null || ocrIsRunning || !videoRef.current) return

    ctx.drawImage(videoRef.current, 0, 0)
    let data = cnv.toDataURL("image/png")
    setScreenshot(data)
    runOCR(data)
  }

  function streamCamVideo() {
    const constraints = {
      audio: false,
      video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT }
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async function (mediaStream) {
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

  async function runOCR(screenshotUri: string) {
    setOcrIsRunning(true)
    const worker = await createWorker("svk")
    const ret = await worker.recognize(screenshotUri)
    console.log(ret.data.text)
    await worker.terminate()
    setOcrIsRunning(false)
  }

  useEffect(() => {
    streamCamVideo()
    const screenShotInterval = setInterval(
      getScreenshot,
      SCREENSHOT_TIME_INTERVAL_MS
    )

    return () => {
      clearInterval(screenShotInterval)
    }
  }, [])

  return (
    <div>
      <h1>Video</h1>

      <video autoPlay={true} ref={videoRef}></video>

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
