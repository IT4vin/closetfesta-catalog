import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import faviconUrl from "../logo/Favicon.svg?url";

const faviconLink = document.createElement("link");
faviconLink.rel = "icon";
faviconLink.type = "image/svg+xml";
faviconLink.href = faviconUrl;
document.head.appendChild(faviconLink);

createRoot(document.getElementById("root")!).render(<App />);
