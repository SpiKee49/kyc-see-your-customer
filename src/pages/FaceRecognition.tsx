import { useEffect, useRef } from "react"
import * as faceapi from "face-api.js"

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
    startVideo()
    videoRef && loadModels()
  }, [])

  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(currentStream => {
        if (videoRef.current == null)
          throw Error("Could not find video element reference")
        videoRef.current.srcObject = currentStream
      })
      .catch(err => {
        console.log(err)
      })
  }
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
    ]).then(() => {
      faceMyDetect()
    })
  }

  const faceMyDetect = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    setInterval(async () => {
      if (video == null || canvas == null) return
      const img = new Image()
      img.src = "sample-id.jpg"

      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()

      console.log(detections)
      // DRAW YOU FACE IN WEBCAM @ts-ingore
      canvas.innerHTML = String(faceapi.createCanvasFromMedia(video))
      faceapi.matchDimensions(canvas, {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height
      })

      const resized = faceapi.resizeResults(detections, {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height
      })

      faceapi.draw.drawDetections(canvas, resized)
      faceapi.draw.drawFaceExpressions(canvas, resized)

      const fullFaceDescription = await faceapi.allFaces(img)

      if (!fullFaceDescription) {
        console.log(`no faces detected`)
        return
      }

      const distance = faceapi.euclideanDistance(
        detections[0].descriptor,
        fullFaceDescription[0].descriptor
      )

      console.log(`Face distance ${distance}`)
    }, 1000)
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
