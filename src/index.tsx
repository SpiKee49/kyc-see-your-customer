import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import Landing from "./pages/Landing.tsx"
import { createHashRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import InformationForm from "./pages/InformationForm.tsx"
import { store } from "./store/store.ts"
import { Provider } from "react-redux"
import DocumentScan from "./pages/DocumentScan.tsx"
import FaceRecognition from "./pages/FaceRecognition.tsx"
import { loadModels } from "./utils/faceUtils.ts"
import FinalPage from "./pages/FinalPage.tsx"
import AdminPage from "./pages/AdminPage.tsx"
import AdminProfile from "./pages/AdminProfile.tsx"
import AdminLogin from "./pages/AdminLogin.tsx"

export const router = createHashRouter(
    [
        {
            path: "/",
            element: <Landing />
        },
        {
            path: "/personal-info",
            element: <InformationForm />
        },
        {
            path: "/document-scan",
            element: <DocumentScan />
        },
        {
            path: "/face-recognition",
            element: <FaceRecognition />
        },
        {
            path: "/final",
            element: <FinalPage />
        },
        {
            path: "/admin",
            element: <AdminLogin />
        },
        {
            path: "/admin-page",
            element: <AdminPage />
        },
        {
            path: "/verification/:id",
            element: <AdminProfile />
        }
    ],
    { basename: "/" }
)

function App() {
    useEffect(() => {
        loadModels()
    }, [])

    return (
        <div className="w-4/5 mx-auto h-[100vh] flex-1 flex flex-col gap-5 justify-start p-7 items-center">
            <div className="bg-white  p-10 rounded-lg shadow-2xl w-full min-w-[700px] max-h-[80vw] overflow-y-auto overflow-x-hidden">
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
