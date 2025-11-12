import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { List } from "./Components/List/list.tsx";
import CreateExperience from "./Components/Create/CreateExperience.tsx";
import ExperiencePage from "./Components/Experience/ExperiencePage.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/list" element={<List />} />
        <Route path="/create" element={<CreateExperience />} />
        <Route path="/experience/:id" element={<ExperiencePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
