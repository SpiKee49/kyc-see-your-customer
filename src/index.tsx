import React from "react"
import ReactDOM from "react-dom/client"
import Landing from "./pages/Landing.tsx"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom"
import "./index.css"
import InformationForm from "./pages/InformationForm.tsx"
import { store } from "./store/store.ts"
import { Provider } from "react-redux"
import DocumentScan from "./pages/DocumentScan.tsx"
import FaceRecognition from "./pages/FaceRecognition.tsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/personal-info" element={<InformationForm />} />
      <Route path="/document-scan" element={<DocumentScan />} />
      <Route path="/face-recognition" element={<FaceRecognition />} />
    </>
  )
)

function App() {
  return (
    <div className="w-4/5 mx-auto h-[100vh] flex-1 flex flex-col gap-5 justify-center items-center">
      <div className="bg-white  p-10 rounded-lg shadow-2xl w-full max-w-[700px]">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
