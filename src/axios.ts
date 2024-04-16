import axios from "axios"

export const OcrInstance = axios.create({
  baseURL: "https://api.ocr.space/parse/image",
  responseType: "json"
})
