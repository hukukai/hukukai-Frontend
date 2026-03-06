import { useState } from "react";
import { C } from "../theme";
import { IcPlus, IcList, IcGrid, IcDoc } from "../components/Icons";

const HAZIR_SABLONLAR = [
  { id: 1, isim: "Kira İhtarnamesi", kategori: "Kira Hukuku", aciklama: "Kiracıya gönderilecek standart ihtarname şablonu" },
  { id: 2, isim: "İş Akdi Fesih Bildirimi", kategori: "İş Hukuku", aciklama: "İşveren tarafından iş akdinin feshine ilişkin bildirim" },
  { id: 3, isim: "Vekaletname Taslağı", kategori: "Genel", aciklama: "Avukata verilecek genel vekaletname şablonu" },
  { id: 4, isim: "Boşanma Dilekçesi", kategori: "Aile Hukuku", aciklama: "Anlaşmalı boşanma davası dilekçe şablonu" },
  { id: 5, isim: "Trafik Kazası Tazminat", kategori: "Tazminat Hukuku", aciklama: "Trafik kazası nedeniyle tazminat talep dilekçesi" },
  { id: 6, isim: "Ticari Sözleşme", kategori: "Ticaret Hukuku", aciklama: "Genel ticari sözleşme çerçeve şablonu" },
];

export default function SablonlarPage() {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("grid");
  const [sablonAdi, setSablonAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [sablonlar, setSablonlar] = useState([]);
  const [aramaQuery, setAramaQuery] = useState("");
  const [activeTab, setActiveTab] = useState("kendi"); // kendi | hazir

  const create = () => {
    if (!sablonAdi.trim()) return;
    setSablonlar(p => [...p, { id: Date.now(), isim: sablonAdi, aciklama, kategori: "Özel", tarih: new Date().toLocaleDateString("tr-TR") }]);
    setSablonAdi(""); setAciklama(""); setShowModal(false);
  };

  const gosterilen = activeTab === "hazir" ? HAZIR_SABLONLAR : sablonlar;
  const filtered = gosterilen.filter(s => s.isim.toLowerCase().includes(aramaQuery.toLowerCase()));

  return (
    <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", background: C.bg }}>
      {/* Başlık */}
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 4 }}>Şablonlar</h1>
      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 24 }}>
        {sablonlar.length} şablon (0 dosya) · 0 sorgu
      </p>

      {/* Sekmeler */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {[{ id: "kendi", label: "Şablonlarım" }, { id: "hazir", label: "Hazır Şablonlar" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "9px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? C.blue : C.textLight, borderBottom: activeTab === tab.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -1, transition: "all .15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Şablon Dosyaları</p>

      {/* Kontroller */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            {["liste", "grid"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "6px 12px", background: view === v ? C.bgGray : C.bg, border: "none", cursor: "pointer", fontSize: 12, color: view === v ? C.text : C.textLight, display: "flex", alignItems: "center", gap: 4 }}>
                {v === "liste" ? <IcList /> : <IcGrid size={16} />}
                {v === "liste" ? "Liste" : "Izgara"}
              </button>
            ))}
          </div>
          <input value={aramaQuery} onChange={e => setAramaQuery(e.target.value)}
            placeholder="Ara"
            style={{ padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", color: C.text, width: 160 }} />
          {activeTab === "kendi" && (
            <button onClick={() => setShowModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.blue, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <IcPlus size={16} /> Şablon Oluştur
            </button>
          )}
        </div>
      </div>

      {/* İçerik */}
      {filtered.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: C.textXlight, fontSize: 14, flexDirection: "column", gap: 12 }}>
          <IcDoc size={40} />
          {activeTab === "kendi" ? "Henüz şablon oluşturulmadı" : "Şablon bulunamadı"}
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map(s => (
            <SablonKart key={s.id} sablon={s} />
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.textLight }}>
            <span>Ad</span><span>Kategori</span><span>Tarih</span><span />
          </div>
          {filtered.map(s => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer", transition: "background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: C.blue }}><IcDoc size={18} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{s.isim}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{s.aciklama}</div>
                </div>
              </div>
              <span style={{ fontSize: 12, color: C.textMid }}>{s.kategori}</span>
              <span style={{ fontSize: 12, color: C.textLight }}>{s.tarih || "-"}</span>
              <button style={{ background: C.blue, border: "none", borderRadius: 6, padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Kullan</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: C.bg, borderRadius: 16, padding: "32px", width: 460, boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: "fadeUp .2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, background: C.blueLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue }}>
                <IcDoc size={24} />
              </div>
            </div>
            <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>Şablon Oluştur</h2>
            <p style={{ textAlign: "center", fontSize: 13, color: C.textLight, marginBottom: 24 }}>Yeni bir şablon oluşturun ve belgelerinizi organize edin</p>
            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>İsim <span style={{ color: "red" }}>*</span></label>
            <input value={sablonAdi} onChange={e => setSablonAdi(e.target.value)}
              placeholder="Şablon adı giriniz"
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />
            <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Açıklama</label>
            <textarea value={aciklama} onChange={e => setAciklama(e.target.value)}
              placeholder="Şablon açıklaması giriniz"
              rows={4}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 20, color: C.text }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", color: C.textMid }}>İptal</button>
              <button onClick={create} style={{ padding: "9px 20px", background: C.blue, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#fff" }}>Şablon Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SablonKart({ sablon }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ border: `1px solid ${hover ? C.blue : C.border}`, borderRadius: 12, padding: "18px", background: hover ? C.blueLight : C.bg, cursor: "pointer", transition: "all .15s" }}>
      <div style={{ width: 40, height: 40, background: C.blueLight, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: C.blue }}>
        <IcDoc size={20} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{sablon.isim}</div>
      <div style={{ fontSize: 11, color: C.blue, marginBottom: 6, fontWeight: 500 }}>{sablon.kategori}</div>
      <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{sablon.aciklama}</div>
      {hover && (
        <button style={{ marginTop: 12, width: "100%", background: C.blue, border: "none", borderRadius: 7, padding: "7px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          Kullan
        </button>
      )}
    </div>
  );
}
