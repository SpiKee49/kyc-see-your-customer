import axios from "axios"

export const OcrInstance = axios.create({
  baseURL: "http://localhost:3000",
  responseType: "json"
})
