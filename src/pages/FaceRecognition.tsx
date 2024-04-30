import { useEffect, useRef } from "react"
import { startFaceDetection } from "../utils/faceUtils"

export default function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // async function getScreenshot() {
  //   const upscaler = new Upscaler({ model: deblur })
  //   upscaler.warmup({ patchSize: 512, padding: 2 })
  //   const canvas = document.createElement("canvas")
  //   canvas.width = 1280
  //   canvas.height = 720
  //   const ctx = canvas.getContext("2d")
  //   if (ctx == null || !video) return
  //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  //   //screenshot from the video
  //   const data = canvas.toDataURL("image/png", 1)
  // }

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo().then(wasSuccess => {
      if (wasSuccess && videoRef.current && canvasRef.current) {
        startFaceDetection(videoRef.current, canvasRef.current, "sample-id.jpg")
      }
    })
  }, [])

  // OPEN YOU FACE WEBCAM
  const startVideo = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      if (videoRef.current == null)
        throw Error("Could not find video element reference")
      videoRef.current.srcObject = currentStream
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  return (
    <div className="flex items-center flex-col">
      <h1>Video</h1>
      <div className={`relative w-full`}>
        <video className="w-full" autoPlay={true} ref={videoRef}></video>

        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white font-light text-center bg-black bg-opacity-25">
          Umiestnite svoju tvár jasne a zreteľne na obrazovku
        </span>
        <canvas className="absolute top-0 left-0" ref={canvasRef} />
      </div>
    </div>
  )
}
