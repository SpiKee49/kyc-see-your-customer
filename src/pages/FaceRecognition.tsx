import { useEffect, useRef, useState } from "react"
import { startFaceDetection } from "../utils/faceUtils"
import { useAppSelector } from "../store/store"
import { useNavigate } from "react-router-dom"

export default function FaceRecognition() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream>()
    const imageUrl = useAppSelector(
        state => state.global.documentInformation.imageData
    )
    const [videoError, setVideoError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (imageUrl == null) {
            navigate("/")
        }
        startVideo().then(wasSuccess => {
            setVideoError(!wasSuccess)

            if (
                wasSuccess &&
                videoRef.current &&
                canvasRef.current &&
                imageUrl
            ) {
                startFaceDetection(
                    videoRef.current,
                    canvasRef.current,
                    imageUrl
                )
            }
        })

        return () => {
            if (stream)
                stream.getTracks().forEach(track => {
                    if (track.readyState == "live" && track.kind === "video") {
                        track.stop()
                    }
                })
        }
    }, [])

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            })
            stream.getTracks().forEach(track => track.stop())

            const currentStream = await navigator.mediaDevices.getUserMedia({
                video: true
            })

            setStream(currentStream)

            if (videoRef.current == null)
                throw Error("Could not find video element reference")
            videoRef.current.srcObject = currentStream
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }

    if (videoError) {
        return (
            <div className="flex items-center flex-col">
                <h1>Nastala chyba pri spúšťaní webkamery</h1>
                <p className="text-sm text-center my-5  ">
                    <b className="text-red-700">
                        Uistite sa, že se prehliadaču umožnili prístup ku
                        kamere, alebo či iné aplikácie práve nepoužívajú kameru.
                        Ak toto nie je váš prípad, tak skúste to znova opäť
                        neskôr.
                    </b>
                </p>
            </div>
        )
    }

    return (
        <div className="flex items-center flex-col">
            <h1>Umiestnite svoju tvár jasne a zreteľne na obrazovku</h1>
            <p className="text-sm text-center my-5  ">
                Uistite sa, že vidíte svoj obraz na obrazovke a taktiež, či je
                vaša tvár rozpoznávana pomocou modrého obdlžníka.
                <br />
                <b className="text-red-700">
                    Prvé rozpoznávanie tváre môže trvať niekoľko sekúnd, buďte
                    preto trpezliví.
                </b>
            </p>
            <div className={`relative w-full`}>
                <video
                    className="w-full"
                    autoPlay={true}
                    ref={videoRef}
                ></video>
                <canvas
                    className="absolute top-0 left-0"
                    ref={canvasRef}
                />
            </div>
        </div>
    )
}
