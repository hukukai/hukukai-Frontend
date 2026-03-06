// ─── PaketlerPage.jsx ────────────────────────────────────────────────────────
import { C } from "../theme";
import { IcCheck } from "../components/Icons";

const PAKETLER = [
  {
    baslik: "6 Aylık Tam Paket",
    fiyat: "₺32.500",
    periyot: "6 Aylık Tam Paket",
    popular: false,
    ozellikler: [
      "Sınırsız kullanım",
      "Tüm içtihat arama özellikleri",
      "İçtihat, kanun ve doktrinin desteklediği yapay zeka asistanı",
      "Sözleşme analizi & risk tespiti",
      "Yapay zeka destekli Dilekçe & Sözleşme yazımı",
    ],
  },
  {
    baslik: "Yıllık Tam Paket",
    fiyat: "₺50.000",
    periyot: "Yıllık Tam Paket",
    popular: true,
    ozellikler: [
      "Sınırsız kullanım",
      "Tüm içtihat arama özellikleri",
      "İçtihat, kanun ve doktrinin desteklediği yapay zeka asistanı",
      "Sözleşme analizi & risk tespiti",
      "Yapay zeka destekli Dilekçe & Sözleşme yazımı",
    ],
  },
  {
    baslik: "Özel Paket",
    fiyat: null,
    periyot: "İhtiyaçlarınıza özel tasarlanmış çözümler",
    popular: false,
    ozellikler: [
      "Sizin ihtiyaçlarınıza özel ayarlanmış çözümler",
      "Kişiselleştirilmiş destek ve danışmanlık",
      "Özel entegrasyonlar",
      "Esnek fiyatlandırma seçenekleri",
    ],
  },
];

export function PaketlerPage() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "60px 40px", background: "linear-gradient(135deg,#f8f9ff 0%,#fff 100%)" }}>
      <h1 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 8, letterSpacing: "-1px" }}>
        İhtiyacınıza Uygun Paketler
      </h1>
      <p style={{ textAlign: "center", color: C.textLight, marginBottom: 48, fontSize: 15 }}>
        Tüm avukatlar ve hukuk büroları için
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", maxWidth: 920, margin: "0 auto" }}>
        {PAKETLER.map((p, i) => (
          <PaketKart key={i} paket={p} />
        ))}
      </div>
    </div>
  );
}

function PaketKart({ paket }) {
  return (
    <div style={{
      flex: "1 1 260px", maxWidth: 290,
      border: paket.popular ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
      borderRadius: 16, padding: "32px 28px",
      background: C.bg, position: "relative",
      boxShadow: paket.popular ? "0 8px 32px rgba(59,82,217,.12)" : "none",
    }}>
      {paket.popular && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(90deg,#7c3aed,#3b52d9)",
          color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "4px 16px", borderRadius: 20, letterSpacing: .5, whiteSpace: "nowrap",
        }}>EN POPÜLER</div>
      )}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>{paket.baslik}</h2>
      {paket.fiyat ? (
        <>
          <div style={{ fontSize: 36, fontWeight: 800, color: paket.popular ? C.blue : C.text, marginBottom: 4, letterSpacing: "-1px" }}>
            {paket.fiyat}
          </div>
          <div style={{ fontSize: 13, color: C.textLight, marginBottom: 24 }}>{paket.periyot}</div>
        </>
      ) : (
        <div style={{ fontSize: 14, color: C.textLight, marginBottom: 24, lineHeight: 1.5 }}>{paket.periyot}</div>
      )}
      <div style={{ marginBottom: 28 }}>
        {paket.ozellikler.map((o, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 13, color: C.textMid }}>
            <span style={{ color: C.success, flexShrink: 0, marginTop: 1 }}><IcCheck /></span>
            {o}
          </div>
        ))}
      </div>
      {paket.fiyat ? (
        <button
          style={{ width: "100%", background: C.blue, border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = C.blueDark}
          onMouseLeave={e => e.currentTarget.style.background = C.blue}
        >
          Şimdi Başla
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.textLight, marginBottom: 12, background: C.bgGray, padding: "6px 12px", borderRadius: 6, fontFamily: "monospace" }}>
            info@hukukai.com
          </div>
          <button style={{ width: "100%", background: C.blue, border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Bize Ulaşabilirsiniz
          </button>
        </div>
      )}
    </div>
  );
}
