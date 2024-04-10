import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import "./index.css";
import InformationForm from "./pages/InformationForm.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="personal-info" element={<InformationForm />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="w-1/3 min-w-[400px] mx-auto h-[100vh] flex-1 flex flex-col gap-5 justify-center bg-whiteitems-center">
      <div className="bg-white bg-opacity-30 p-10 rounded-lg shadow-2xl">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);
