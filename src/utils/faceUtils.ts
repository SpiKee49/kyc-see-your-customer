import * as faceapi from "face-api.js"

export const loadModels = () => {
  return Promise.all([
    // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
  ])
}

export const startFaceDetection = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  idImageSrc: string
) => {
  setInterval(async () => {
    if (video == null || canvas == null) return
    const img = new Image()
    img.src = idImageSrc

    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()

    // console.log(detections)
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

    // const fullFaceDescription = await faceapi.allFaces(img)

    // if (!fullFaceDescription) {
    //   console.log(`no faces detected`)
    //   return
    // }

    // const distance = faceapi.euclideanDistance(
    //   detections[0].descriptor,
    //   fullFaceDescription[0].descriptor
    // )

    // console.log(`Face distance ${distance}`)
  }, 1000)
}
