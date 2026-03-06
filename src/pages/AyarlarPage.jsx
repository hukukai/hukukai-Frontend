import { useState } from "react";
import { C } from "../theme";

const TABS = [
  { id: "profil",      label: "Profil",      icon: "👤" },
  { id: "abonelik",    label: "Abonelik",    icon: "📋" },
  { id: "faturalama",  label: "Faturalama",  icon: "📄" },
  { id: "dil",         label: "Dil",         icon: "🌐" },
  { id: "diger",       label: "Diğer",       icon: "···" },
];

const BAROLAR = [
  "İstanbul Barosu","Ankara Barosu","İzmir Barosu","Bursa Barosu",
  "Adana Barosu","Antalya Barosu","Konya Barosu","Diğer",
];

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState("profil");

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px", background: C.bg }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 28 }}>Ayarlar</h1>
      <div style={{ display: "flex", gap: 32 }}>

        {/* Sidebar */}
        <div style={{ width: 180, flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", border: "none",
                background: activeTab === t.id ? C.bgGray : "none",
                borderRadius: 8, cursor: "pointer", fontSize: 14,
                color: activeTab === t.id ? C.text : C.textLight,
                fontWeight: activeTab === t.id ? 500 : 400,
                marginBottom: 2, textAlign: "left", transition: "all .1s",
              }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div style={{ flex: 1, maxWidth: 540 }}>
          {activeTab === "profil" && <ProfilTab />}
          {activeTab === "abonelik" && <AbonelikTab />}
          {activeTab !== "profil" && activeTab !== "abonelik" && (
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, color: C.textLight, fontSize: 14, textAlign: "center" }}>
              Bu bölüm yakında gelecek...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Profil Tab ───────────────────────────────────────────────────────────────
function ProfilTab() {
  const [form, setForm] = useState({
    isim: "", soyisim: "", sirket: "", telefon: "",
    email: "", baro: "İstanbul Barosu", baroNo: "", ilBaroNo: "",
    mevcutSifre: "", yeniSifre: "", yeniSifreTekrar: "",
    adres: "", sistemTalimati: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 24 }}>Profil Detayları</h2>

      {/* İsim / Soyisim */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Field label="İsim" value={form.isim} onChange={set("isim")} placeholder="İsminiz" />
        <Field label="Soyisim" value={form.soyisim} onChange={set("soyisim")} placeholder="Soyisminiz" />
      </div>

      {/* Şirket */}
      <div style={{ marginBottom: 14 }}>
        <Field label="Şirket Adı" value={form.sirket} onChange={set("sirket")} placeholder="Şirket Adı" />
      </div>

      {/* E-Mail */}
      <div style={{ marginBottom: 14 }}>
        <Field label="E-Mail" type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" />
      </div>

      {/* Baro */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Bağlı Bulunan Baro</label>
        <select value={form.baro} onChange={set("baro")}
          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", color: C.text, background: C.bg }}>
          {BAROLAR.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Baro No / İl Baro No */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <Field label="Baro No" value={form.baroNo} onChange={set("baroNo")} placeholder="Baro No" />
        <Field label="İl Baro No" value={form.ilBaroNo} onChange={set("ilBaroNo")} placeholder="İl Baro No" />
      </div>

      {/* Şifre değiştir */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 14 }}>Şifre Değiştir</h3>
        <div style={{ marginBottom: 12 }}>
          <Field label="Mevcut Şifreniz" type="password" value={form.mevcutSifre} onChange={set("mevcutSifre")} placeholder="Mevcut şifreniz" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Field label="Yeni Şifreniz" type="password" value={form.yeniSifre} onChange={set("yeniSifre")} placeholder="Yeni şifrenizi girin" />
          <Field label="Yeni Şifreniz Tekrar" type="password" value={form.yeniSifreTekrar} onChange={set("yeniSifreTekrar")} placeholder="Yeni şifre tekrarını girin" />
        </div>
        <button style={{ background: C.blue, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Şifreyi Değiştir
        </button>
      </div>

      {/* Adres */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Adres</label>
        <textarea value={form.adres} onChange={set("adres")} placeholder="Adresiniz"
          rows={3}
          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", color: C.text }} />
      </div>

      {/* Sistem Talimatı */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Sistem Talimatı</label>
        <textarea value={form.sistemTalimati} onChange={set("sistemTalimati")}
          placeholder="Asistana özel talimatlar giriniz..."
          rows={3}
          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", color: C.text }} />
        <p style={{ fontSize: 12, color: C.textXlight, marginTop: 4 }}>Asistan her sohbette bu talimatları dikkate alır.</p>
      </div>

      {/* Kaydet */}
      <button onClick={handleSave}
        style={{ background: saved ? C.success : C.blue, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background .2s" }}>
        {saved ? "✓ Kaydedildi" : "Kaydet"}
      </button>
    </div>
  );
}

// ─── Abonelik Tab ─────────────────────────────────────────────────────────────
function AbonelikTab() {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Abonelik Bilgileri</h2>
      <div style={{ background: C.bgGray, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Mevcut Plan</span>
          <span style={{ background: C.blueLight, color: C.blue, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Aktif</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.blue, marginBottom: 4 }}>Yıllık Tam Paket</div>
        <div style={{ fontSize: 13, color: C.textLight }}>Sonraki yenileme: 06.03.2027</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ padding: "9px 18px", background: C.blue, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Planı Yükselt
        </button>
        <button style={{ padding: "9px 18px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: 13, cursor: "pointer" }}>
          İptal Et
        </button>
      </div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", color: C.text, background: C.bg }}
        onFocus={e => e.target.style.borderColor = C.blue}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  );
}
