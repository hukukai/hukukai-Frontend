// KararAramaPage.jsx
import { useState } from "react";
import { C } from "../theme";
import { IcArrowL, IcPlus, IcMic, IcDownload, IcBookmark, IcX, IcChevD } from "../components/Icons";

const MAHKEMELER = ["Yargıtay","Birinci Derece Mahkemesi","Bölge Adliye Mahkemesi","Bölge İdare Mahkemesi","Danıştay","Uyuşmazlık Mahkemesi","Anayasa Mahkemesi","AIHM","Rekabet Kurulu","Reklam Kurulu","KVKK Kurulu","Sayıştay","Ağır ceza Mahkemesi"];
const ORNEK_SORULAR = [
  { baslik:"Kira Sözleşmesi Uyuşmazlığı", aciklama:"Bir kiracı, ev sahibinin habersiz şekilde eve girerek inceleme yapmaya çalıştığını iddia etmektedir." },
  { baslik:"Künyede Arama", aciklama:"2022/585 Esas numarasına, 2023/418 Karar numarasına sahip yargıtay kararını getir." },
  { baslik:"Haksız Fesih ve Tazminat Talebi", aciklama:"Bir işçi, işveren tarafından performans düşüklüğü gerekçesiyle işten çıkarılmıştır." },
  { baslik:"Tahliye Taahhütnamesi Zorlaması", aciklama:"Bir kiracı, ev sahibi tarafından tahliye taahhütnamesi imzalamaya zorlandığını iddia etmektedir." },
  { baslik:"Erken Ödeme Cezası İtirazı", aciklama:"Bir tüketici, bankadan kullandığı tüketici kredisi için erken ödeme yapmış." },
  { baslik:"Mal Rejimi ve Edinilmiş Mal Paylaşımı", aciklama:"Evlilik birliği içinde edinilen taşınmaz ve banka hesabı, boşanma davasında paylaşım konusu." },
  { baslik:"Kişisel Veri İhlali ve Tazminat", aciklama:"Bir şirket, müşterilerinin kişisel verilerini yeterince korumamış." },
  { baslik:"Sendika Üyeliği Gerekçesiyle Fesih", aciklama:"Bir işçi, sendika üyeliği nedeniyle işveren tarafından işten çıkarılmıştır." },
  { baslik:"Tıbbi İhmal Sonrası Tazminat", aciklama:"Bir hasta, ameliyat sonrası hekimin ihmali nedeniyle komplikasyonlar yaşamıştır." },
];

const MOCK_KARARLAR = [
  { id:1, mahkeme:"Yargıtay", daire:"3. Hukuk Dairesi", esas:"2023/2919 E.", karar:"2024/1215 K.", tarih:"20.03.2024", eslesme:95, tip:"Huk", ozet:"Somut olayda; taraflar arasında 01.12.2015 başlangıç tarihli ve bir yıl süreli konut kira sözleşmesi bulunmakla, sözleşme bir yıl sonunda kanun gereği bir yıl süre ile yenilenmiştir. Davacı kiracı, yenilenen dönemde geçici süre evde bulunmadığı sırada kiraya veren tarafından kiralanana girilerek eşyalarının ve parasının alındığını iddia etmiş..." },
  { id:2, mahkeme:"Yargıtay", daire:"4. Ceza Dairesi", esas:"2014/46929 E.", karar:"2015/1908 K.", tarih:"24.06.2010", eslesme:95, tip:"Ceza", ozet:"Zira, bir sözleşme ilişkisi kurulduktan sonra, taraflardan birinin fesih ihbarının karşı tarafa ulaştırılmasıyla sözleşmenin sona ereceği açık ise de, aradaki ihtilaf ve uyuşmazlıkları, fesheden ya da muhatabı tarafından işgal, el koyma vb. hareketlerle çözümlenmeye çalışılması..." },
  { id:3, mahkeme:"Yargıtay", daire:"6. Hukuk Dairesi", esas:"2016/8493 E.", karar:"2016/6719 K.", tarih:"16.11.2016", eslesme:40, tip:"Huk", ozet:"Türk Borçlar Kanununun 3. maddesi hükmünce kiracı kiralananı sözleşmeye uygun olarak özenle kullanmak ve kiralananın bulunduğu taşınmazda oturan kişiler ile komşulara gerekli saygıyı göstermekle yükümlüdür..." },
  { id:4, mahkeme:"Yargıtay", daire:"3. Hukuk Dairesi", esas:"2017/1448 E.", karar:"2017/405 K.", tarih:"01.01.2017", eslesme:40, tip:"Huk", ozet:"Türk Borçlar Kanununun 3. maddesi hükmünce kiracı kiralananı sözleşmeye uygun olarak özenle kullanmak ve kiralananın bulunduğu taşınmazda oturan kişiler ile komşulara gerekli saygıyı göstermekle yükümlüdür..." },
  { id:5, mahkeme:"Yargıtay", daire:"(Kapatılan) 6. Hukuk Dairesi", esas:"2013/3538 E.", karar:"2013/8408 K.", tarih:"14.05.2013", eslesme:40, tip:"Huk", ozet:"2. madde sayfasının son ve kiracı lehine olan cümlesinde kiracının sözleşme süresi öncesi evden çıkış yapmak istemesi halinde, üç ay evvelinden bildirimde bulunması gerekmekte olup..." },
];

const MOCK_ANALIZ = `Bu hukuki sorun, kira sözleşmesinden doğan hak ve yükümlülükler ile özel hayatın gizliliği hakkının kesiştiği önemli bir alanı teşkil etmektedir. Türk hukuku çerçevesinde bu durumun akademik ve hukuki yönleri aşağıda açıklanmıştır:

**I. Kira Sözleşmesi ve Kiraya Verenin Hakları**

Kira sözleşmesi, kiraya verenin bir şeyin kullanılmasını veya kullanmayla birlikte ondan yararlanılmasını kiracıya bırakmayı, kiracının da buna karşılık kararlaştırılan kira bedelini ödemeyi üstlendiği bir sözleşmedir.

• **Sözleşmeye Aykırılık:** Kiraya verenin, kira sözleşmesinde belirtilen koşullara aykırı olarak kiralanana girmesi, sözleşmeye aykırılık oluşturabilir.`;

export default function KararAramaPage({ navTo }) {
  const [query,          setQuery]          = useState("");
  const [results,        setResults]        = useState(null);
  const [analiz,         setAnaliz]         = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [selectedMhk,   setSelectedMhk]    = useState([]);
  const [analizModu,    setAnalizModu]     = useState(true);
  const [detayKarar,    setDetayKarar]     = useState(null);
  const [gecmis,        setGecmis]         = useState([]);

  const ara = () => {
    if (!query.trim()) return;
    setLoading(true); setResults(null); setAnaliz(null);
    if (!gecmis.includes(query)) setGecmis(p => [query, ...p].slice(0, 10));
    setTimeout(() => { setResults(MOCK_KARARLAR); if (analizModu) setAnaliz(MOCK_ANALIZ); setLoading(false); }, 800);
  };

  if (detayKarar) return <KararDetay karar={detayKarar} onBack={() => setDetayKarar(null)} />;

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sol panel */}
      <div style={{ width: 268, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg }}>
        <div style={{ padding: "14px 14px 12px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <button onClick={() => navTo("asistan")} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 2 }}><IcArrowL /></button>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Karar Arama</span>
          </div>
          <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.textMid }}
            onClick={() => { setResults(null); setAnaliz(null); setQuery(""); }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
            onMouseLeave={e => e.currentTarget.style.background = C.bg}>
            <IcPlus size={16} /> Yeni Karar Araması
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {gecmis.length > 0 && (
            <div style={{ fontSize: 11, color: C.textXlight, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, padding: "4px 8px 6px" }}>Arama Geçmişi</div>
          )}
          {gecmis.map((g, i) => (
            <button key={i} onClick={() => { setQuery(g); setTimeout(ara, 50); }}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "9px 10px", borderRadius: 7, color: C.textMid, fontSize: 13, marginBottom: 2, transition: "background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              {g.length > 40 ? g.slice(0, 40) + "..." : g}
            </button>
          ))}
        </div>
      </div>

      {/* Ana içerik */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 2 }}>HukukAI</h1>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 20 }}>Karar Arama Motoru</h2>

        {/* Arama kutusu */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, background: C.bg, boxShadow: "0 1px 6px rgba(0,0,0,.04)" }}>
          <textarea value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ara(); } }}
            placeholder="Emsal davaları ve daha fazlasını keşfedin..."
            rows={3}
            style={{ width: "100%", border: "none", outline: "none", fontSize: 14, color: C.text, lineHeight: 1.65, background: "transparent" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMid, cursor: "pointer" }}>
              <span>Analiz modu</span>
              <div onClick={() => setAnalizModu(v => !v)} style={{ width: 40, height: 22, borderRadius: 11, background: analizModu ? C.blue : C.bgGray2, position: "relative", cursor: "pointer", transition: "background .2s" }}>
                <div style={{ position: "absolute", top: 3, left: analizModu ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
              </div>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcMic size={18} /></button>
              <button onClick={ara} disabled={loading || !query.trim()}
                style={{ background: !query.trim() || loading ? "#c7cce8" : C.blue, border: "none", borderRadius: 8, padding: "7px 20px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: !query.trim() || loading ? "not-allowed" : "pointer" }}>
                {loading ? "Aranıyor..." : "Ara"}
              </button>
            </div>
          </div>
        </div>

        {/* Mahkeme filtreleri */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 10 }}>Mahkeme</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {MAHKEMELER.map(m => (
              <button key={m} onClick={() => setSelectedMhk(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])}
                style={{ padding: "5px 12px", border: `1px solid ${selectedMhk.includes(m) ? C.blue : C.border}`, borderRadius: 20, background: selectedMhk.includes(m) ? C.blueLight : C.bg, color: selectedMhk.includes(m) ? C.blue : C.textMid, fontSize: 12, cursor: "pointer", transition: "all .15s" }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Yükleniyor */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.textLight, fontSize: 14, padding: "20px 0" }}>
            <div style={{ width: 18, height: 18, border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            Kararlar aranıyor...
          </div>
        )}

        {/* Örnekler */}
        {!results && !loading && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 14 }}>Örnekler</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {ORNEK_SORULAR.map((s, i) => (
                <button key={i} onClick={() => { setQuery(s.aciklama); }}
                  style={{ textAlign: "left", padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", transition: "all .15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.06)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 6 }}>{s.baslik}</div>
                  <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.5, marginBottom: 10 }}>{s.aciklama}</div>
                  <div style={{ color: C.blue, fontSize: 16 }}>→</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Sonuçlar */}
        {results && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: C.textLight }}>{results.length} Sonuç bulundu</span>
              <select style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: C.textMid, outline: "none", background: C.bg }}>
                <option>İlgi Sırasına Göre</option><option>Tarihe Göre</option>
              </select>
            </div>
            {results.map(k => (
              <KararRow key={k.id} karar={k} onView={() => setDetayKarar(k)} />
            ))}
          </div>
        )}
      </div>

      {/* Analiz paneli */}
      {analiz && (
        <div style={{ width: 320, borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "24px 18px", background: C.bg, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.blue }}>Analiz</h3>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}><IcDownload /></button>
          </div>
          <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: analiz.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n\n/g, "</p><p style='margin-top:10px'>").replace(/\n/g, "<br/>") }} />
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10 }}>Kaynakça</div>
            {results?.slice(0, 5).map((k, i) => (
              <div key={k.id} style={{ fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: C.textXlight, marginRight: 4 }}>{i + 1}.</span>
                <button onClick={() => setDetayKarar(k)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, padding: 0, textAlign: "left" }}>
                  {k.daire} {k.esas}, {k.karar}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KararRow({ karar, onView }) {
  const [expanded, setExpanded] = useState(false);
  const pct = karar.eslesme;
  const barColor = pct >= 75 ? C.success : pct >= 50 ? C.warn : C.borderDark;
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px", marginBottom: 12, background: C.bg }}>
      <button onClick={onView} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", display: "block", width: "100%" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.blue, marginBottom: 8 }}>
          {karar.daire} {karar.esas}, {karar.karar}
        </div>
      </button>
      <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.textLight }}>🏛 {karar.mahkeme}</span>
        <span style={{ fontSize: 11, color: C.textLight }}>📄 {karar.tip}</span>
        <span style={{ fontSize: 11, color: C.textLight }}>📅 {karar.tarih}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 4, background: C.bgGray2, borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 11, color: C.textLight, whiteSpace: "nowrap" }}>Eşleşme %{pct}</span>
      </div>
      <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>{expanded ? karar.ozet : karar.ozet.slice(0, 180) + "..."}</p>
      <button onClick={() => setExpanded(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 12, padding: "4px 0", display: "flex", alignItems: "center", gap: 3 }}>
        {expanded ? "Daha az göster" : "Devamını Gör"} <IcChevD />
      </button>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcDownload /></button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcBookmark /></button>
        <button onClick={onView} style={{ marginLeft: "auto", background: C.blue, border: "none", borderRadius: 7, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Görüntüle</button>
      </div>
    </div>
  );
}

function KararDetay({ karar, onBack }) {
  const [tab,     setTab]     = useState("metin");
  const [sideTab, setSideTab] = useState("ozet");
  const [not,     setNot]     = useState("");
  const [notlar,  setNotlar]  = useState([]);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: C.bg, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcArrowL /></button>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, flex: 1 }}>{karar.daire} {karar.esas}</span>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 12 }}>🔗 Paylaş</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 12 }}><IcDownload />İndir</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 12 }}>🖨 Yazdır</button>
        <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", color: C.textMid, fontSize: 12 }}>📁 Projeye Ekle</button>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 40px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {["metin", "pdf"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: "7px 20px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: tab === t ? 600 : 400, background: tab === t ? C.blue : C.bgGray, color: tab === t ? "#fff" : C.textLight }}>
                {t === "pdf" ? "PDF" : "Metin"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.9 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Karar Bilgileri</h3>
            <p><strong>Esas No:</strong> {karar.esas}</p>
            <p><strong>Karar No:</strong> {karar.karar}</p>
            <p><strong>Tarih:</strong> {karar.tarih}</p>
            <p><strong>Mahkeme:</strong> {karar.mahkeme} {karar.daire}</p>
            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Karar Özeti</h3>
            <p>{karar.ozet}</p>
          </div>
        </div>
        <div style={{ width: 340, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
            {[{ id: "notlar", label: "📝 Notlar" }, { id: "ozet", label: "📄 Özet" }].map(t => (
              <button key={t.id} onClick={() => setSideTab(t.id)}
                style={{ flex: 1, padding: "12px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: sideTab === t.id ? 600 : 400, background: sideTab === t.id ? C.blue : C.bg, color: sideTab === t.id ? "#fff" : C.textLight }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {sideTab === "notlar" ? (
              notlar.length === 0 ? (
                <div style={{ textAlign: "center", color: C.textXlight, fontSize: 13, paddingTop: 40 }}>Henüz not eklenmemiş.</div>
              ) : notlar.map((n, i) => (
                <div key={i} style={{ background: C.bgGray, borderRadius: 8, padding: "10px 12px", marginBottom: 8, fontSize: 13, color: C.textMid }}>{n}</div>
              ))
            ) : (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Belgenin özeti</h3>
                <ul style={{ paddingLeft: 16, fontSize: 13, color: C.textMid, lineHeight: 1.8 }}>
                  <li>Karar: {karar.esas} numaralı dosya</li>
                  <li>Mahkeme: {karar.mahkeme}</li>
                  <li>Tarih: {karar.tarih}</li>
                </ul>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginTop: 12 }}>{karar.ozet}</p>
              </div>
            )}
          </div>
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
            <input value={not} onChange={e => setNot(e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              onKeyDown={e => { if (e.key === "Enter" && not.trim()) { setNotlar(p => [...p, not]); setNot(""); } }}
              style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", marginBottom: 8, color: C.text }} />
            <button onClick={() => { if (not.trim()) { setNotlar(p => [...p, not]); setNot(""); } }}
              style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Not Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
