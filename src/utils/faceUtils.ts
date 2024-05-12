import * as faceapi from "face-api.js"
import { router } from "../index"
import { store } from "../store/store"
import { updateFaceRecognitionResult } from "../store/slice/globalSlice"

const MAX_RETRIES = 30

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
    let numberOfRetries = 0

    var interval = setInterval(async () => {
        if (video == null || canvas == null) return
        const img = new Image()
        img.src = idImageSrc

        let distance = 1
        try {
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

            const fullFaceDescription = await faceapi.allFaces(img)

            if (!fullFaceDescription) {
                console.log(`no faces detected`)
                return
            }

            distance = faceapi.euclideanDistance(
                detections[0].descriptor,
                fullFaceDescription[0].descriptor
            )
        } catch (e) {
            console.log(e)
        } finally {
            if (distance <= 0.5 || numberOfRetries === MAX_RETRIES) {
                const cnv = document.createElement("canvas")
                cnv.width = video.videoWidth
                cnv.height = video.videoHeight
                const ctx = cnv.getContext("2d")
                ctx!.drawImage(video, 0, 0, cnv.width, cnv.height)
                const screenShot = cnv.toDataURL("image/png")

                store.dispatch(
                    updateFaceRecognitionResult({
                        faceMatched: distance <= 0.5,
                        imageData: screenShot
                    })
                )

                router.navigate("/final")
                clearInterval(interval)
            }
            numberOfRetries += 1
        }
    }, 1000)
}
