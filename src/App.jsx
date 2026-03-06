import "./index.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar";

// Pages
import AsistanPage   from "./pages/AsistanPage";
import ProjelerPage  from "./pages/ProjelerPage";
import KararAramaPage from "./pages/KararAramaPage";
import EditorPage    from "./pages/EditorPage";
import SablonlarPage from "./pages/SablonlarPage";
import TakvimPage    from "./pages/TakvimPage";
import { PaketlerPage } from "./pages/PaketlerPage";
import AyarlarPage   from "./pages/AyarlarPage";

export default function App() {
  const [page, setPage] = useState("asistan");

  const navTo = (p) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case "asistan":     return <AsistanPage    navTo={navTo} />;
      case "projeler":    return <ProjelerPage   navTo={navTo} />;
      case "karar-arama": return <KararAramaPage navTo={navTo} />;
      case "editor":      return <EditorPage     navTo={navTo} />;
      case "sablonlar":   return <SablonlarPage  navTo={navTo} />;
      case "takvim":      return <TakvimPage     navTo={navTo} />;
      case "paketler":    return <PaketlerPage   navTo={navTo} />;
      case "ayarlar":     return <AyarlarPage    navTo={navTo} />;
      default:
        return (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af", fontSize:15 }}>
            Bu sayfa yakında gelecek...
          </div>
        );
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar page={page} navTo={navTo} />
      <main style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {renderPage()}
      </main>
    </div>
  );
}
