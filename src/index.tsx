import React, { createContext, useState } from "react"
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
// import DocumentScan from "./pages/DocumentScan.tsx"

export const GlobalContex = createContext<GlobalContextType>({
  store: {
    birthNumber: null,
    personalInformation: null,
    documentInformation: null
  },
  updateStore: () => {}
})

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing />} />
      <Route path="personal-info" element={<InformationForm />} />
    </>
  )
)

function App() {
  const [globalStore, setGlobalStore] = useState<StoreType>({
    birthNumber: null,
    personalInformation: null,
    documentInformation: null
  })

  return (
    <div className="w-4/5 mx-auto h-[100vh] flex-1 flex flex-col gap-5 justify-center items-center">
      <div className="bg-white  p-10 rounded-lg shadow-2xl w-full max-w-[700px]">
        <GlobalContex.Provider
          value={{ store: globalStore, updateStore: setGlobalStore }}
        ></GlobalContex.Provider>
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
