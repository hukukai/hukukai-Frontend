import { useState } from "react";
import { C } from "../theme";
import { IcPlus, IcFolder, IcList, IcGrid } from "../components/Icons";

export default function ProjelerPage() {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("grid");
  const [projeAdi, setProjeAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [otoSenkron, setOtoSenkron] = useState(false);
  const [projeler, setProjeler] = useState([]);

  const create = () => {
    if (!projeAdi.trim()) return;
    setProjeler(p => [...p, { id: Date.now(), isim: projeAdi, aciklama, dosya: 0, sorgu: 0 }]);
    setProjeAdi(""); setAciklama(""); setOtoSenkron(false); setShowModal(false);
  };

  return (
    <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", background: C.bg }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 4 }}>Projeler</h1>
      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 24 }}>
        {projeler.length} proje ({projeler.reduce((a, p) => a + p.dosya, 0)} dosya) · {projeler.reduce((a, p) => a + p.sorgu, 0)} sorgu
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Proje Dosyaları</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            {["liste", "grid"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "6px 12px", background: view === v ? C.bgGray : C.bg, border: "none", cursor: "pointer", fontSize: 12, color: view === v ? C.text : C.textLight, display: "flex", alignItems: "center", gap: 4 }}>
                {v === "liste" ? <IcList /> : <IcGrid size={16} />}
                {v === "liste" ? "Liste" : "Izgara"}{v === "grid" && " ✓"}
              </button>
            ))}
          </div>
          <input placeholder="Projelerde ara" style={{ padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", color: C.text, width: 160 }} />
          <button onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.blue, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <IcPlus size={16} /> Proje Oluştur
          </button>
        </div>
      </div>

      {projeler.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: C.textXlight, fontSize: 14 }}>
          Henüz dosya yüklenmedi
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {projeler.map(p => (
            <div key={p.id}
              style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, background: C.bg, cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.06)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ width: 40, height: 40, background: C.blueLight, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: C.blue }}>
                <IcFolder size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{p.isim}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>{p.dosya} dosya · {p.sorgu} sorgu</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: C.bg, borderRadius: 16, padding: 32, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: "fadeUp .2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, background: C.bgGray, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: C.textLight }}>
                <IcFolder size={24} />
              </div>
            </div>
            <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>Proje Oluştur</h2>
            <p style={{ textAlign: "center", fontSize: 13, color: C.textLight, marginBottom: 24 }}>Yeni bir proje oluşturun ve dosyalarınızı organize edin</p>

            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>İsim <span style={{ color: "red" }}>*</span></label>
            <input value={projeAdi} onChange={e => setProjeAdi(e.target.value)} placeholder="İsim giriniz..."
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />

            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Açıklama</label>
            <textarea value={aciklama} onChange={e => setAciklama(e.target.value)} placeholder="Açıklama giriniz..." rows={4}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />

            <div style={{ background: C.bgGray, borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Otomatik Senkronizasyon</span>
                  <span style={{ fontSize: 11, color: C.textXlight, marginLeft: 8 }}>50000/50000</span>
                </div>
                <div onClick={() => setOtoSenkron(v => !v)}
                  style={{ width: 40, height: 22, borderRadius: 11, background: otoSenkron ? C.blue : C.borderDark, position: "relative", cursor: "pointer", transition: "background .2s" }}>
                  <div style={{ position: "absolute", top: 3, left: otoSenkron ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: C.textXlight, marginTop: 6 }}>Açıldığında yüklenen dosyalar otomatik olarak senkronize edilir.</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", color: C.textMid }}>İptal</button>
              <button onClick={create} style={{ padding: "9px 20px", background: C.blue, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#fff" }}>Proje Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
