import { useState } from "react";
import { C } from "../theme";
import {
  IcChat, IcFolder, IcGrid, IcSearch, IcEdit,
  IcCalendar, IcList, IcPackage, IcSettings
} from "./Icons";

const hizmetler = [
  { id: "karar-arama", label: "Karar Arama",  icon: <IcSearch size={16} /> },
  { id: "editor",      label: "Editör",        icon: <IcEdit   size={16} /> },
  { id: "sablonlar",   label: "Şablonlar",     icon: <IcList   size={16} /> },
  { id: "takvim",      label: "Takvim",        icon: <IcCalendar size={16} /> },
];

export default function Sidebar({ page, navTo }) {
  const [hizOpen, setHizOpen] = useState(false);

  const navItem = (id, label, icon) => {
    const active = page === id || (id === "hizmetler" && hizmetler.some(h => h.id === page));
    return (
      <button
        key={id}
        onClick={() => {
          if (id === "hizmetler") { setHizOpen(v => !v); return; }
          navTo(id);
          setHizOpen(false);
        }}
        style={{
          width: "100%", border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 4, padding: "10px 0",
          color: active ? C.blue : C.textLight,
          backgroundColor: active ? C.blueLight : "transparent",
          transition: "all .15s",
        }}
      >
        {icon}
        <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
      </button>
    );
  };

  return (
    <aside style={{
      width: 64, minWidth: 64,
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      position: "relative", zIndex: 20,
    }}>
      {/* Avatar */}
      <div style={{ padding: "14px 0", display: "flex", justifyContent: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: C.blue, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>A</div>
      </div>

      {/* Top nav */}
      <nav style={{ flex: 1, paddingTop: 4 }}>
        {navItem("asistan",   "Asistan",  <IcChat />)}
        {navItem("projeler",  "Projeler", <IcFolder />)}
        {navItem("hizmetler", "Hizmetler", <IcGrid />)}
      </nav>

      {/* Bottom nav */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        {navItem("paketler", "Paketler", <IcPackage />)}
        {navItem("ayarlar",  "Ayarlar",  <IcSettings />)}
      </div>

      {/* Hizmetler flyout */}
      {hizOpen && (
        <div style={{
          position: "absolute", left: "100%", top: 116,
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.10)",
          padding: "6px 0", minWidth: 170, zIndex: 100,
          animation: "fadeUp .15s ease",
        }}>
          <div style={{ padding: "6px 14px 4px", fontSize: 11, color: C.textXlight, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>
            Özelleşmiş hizmetler
          </div>
          {hizmetler.map(h => (
            <button key={h.id} onClick={() => { navTo(h.id); setHizOpen(false); }}
              style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 16px", color: C.textMid, fontSize: 14,
                transition: "background .1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <span style={{ color: C.textLight }}>{h.icon}</span>
              {h.label}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
