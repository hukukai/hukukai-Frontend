import { useState, useRef, useEffect } from "react";
import { C } from "../theme";
import { IcArrowL, IcPlus, IcAttach, IcMic, IcWand, IcChevD, IcDownload, IcBookmark, IcX } from "../components/Icons";
import API_BASE from "../config";

const ORNEK_SORULAR = [
  { baslik: "Kira Sözleşmesi Uyuşmazlığı", aciklama: "Ev sahibinin habersiz şekilde eve girmesi halinde kiracının hakları nelerdir?" },
  { baslik: "Haksız Fesih ve Tazminat", aciklama: "İşçi performans düşüklüğü gerekçesiyle işten çıkarıldı, tazminat hakları nelerdir?" },
  { baslik: "Tahliye Taahhütnamesi", aciklama: "Kiracı baskı altında tahliye taahhütnamesi imzaladığını iddia ediyor, geçerli mi?" },
  { baslik: "Erken Ödeme Cezası", aciklama: "Tüketici kredisinde erken ödeme cezası talep edilebilir mi?" },
  { baslik: "Mal Rejimi Paylaşımı", aciklama: "Boşanmada edinilmiş mallara katılma rejiminde paylaşım nasıl yapılır?" },
  { baslik: "Tıbbi İhmal Tazminatı", aciklama: "Ameliyat sonrası oluşan komplikasyon nedeniyle doktor aleyhine dava açılabilir mi?" },
];

const mockKararlar = [
  { id: 1, mahkeme: "Yargıtay", daire: "3. Hukuk Dairesi", esas: "2023/2919 E.", karar: "2024/1215 K.", tarih: "20.03.2024", eslesme: 95, tip: "Huk" },
  { id: 2, mahkeme: "Yargıtay", daire: "4. Ceza Dairesi", esas: "2014/46929 E.", karar: "2015/1908 K.", tarih: "24.06.2010", eslesme: 95, tip: "Ceza" },
  { id: 3, mahkeme: "Yargıtay", daire: "6. Hukuk Dairesi", esas: "2016/8493 E.", karar: "2016/6719 K.", tarih: "16.11.2016", eslesme: 60, tip: "Huk" },
];

export default function AsistanPage({ navTo }) {
  const [sohbetListOpen, setSohbetListOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [kararPanel, setKararPanel] = useState(false);
  const msgEnd = useRef(null);
  const inputRef = useRef(null);

  const mockSohbetler = [
    "Lojistik Hasar İhtarnamesi ve Alt...",
    "Medeni Kanun Yerleşim Yeri ...",
    "Kira sözleşmesi feshi koşulları",
    "İş akdi fesih tazminat hesabı",
  ];

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streaming]);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setStreaming("");
    const userMsg = { role: "user", content: q };
    setMessages(p => [...p, userMsg]);
    setKararPanel(false);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      if (!res.ok) throw new Error("API hatası: " + res.status);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let full = "";
      let sources = { mevzuat: [], kararlar: [] };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const d = JSON.parse(line.slice(6));
            if (d.type === "sources") {
              sources = d;
            } else if (d.type === "text") {
              full += d.content;
              setStreaming(full);
            }
          } catch { }
        }
      }

      setMessages(p => [...p, {
        role: "assistant",
        content: full,
        karar_sayisi: sources.kararlar?.length || 0,
        mevzuat_sayisi: sources.mevzuat?.length || 0,
        mevzuat_docs: sources.mevzuat || [],
        karar_docs: sources.kararlar || [],
        suggestions: ["Bu konuda emsal karar var mı?", "Dava açma süreleri nelerdir?", "Alternatif çözüm yolları neler?"],
      }]);
      setStreaming("");

    } catch (err) {
      setMessages(p => [...p, { role: "assistant", content: `Hata: ${err.message}`, error: true }]);
      setStreaming("");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

      {/* Sohbet listesi */}
      {sohbetListOpen && (
        <div style={{ width: 280, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg, animation: "slideInLeft .2s ease" }}>
          <div style={{ padding: "14px 14px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <button onClick={() => setSohbetListOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 2 }}><IcArrowL /></button>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Asistan</span>
            </div>
            <button onClick={() => setMessages([])}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.textMid }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
              onMouseLeave={e => e.currentTarget.style.background = C.bg}>
              <IcPlus /> Yeni Çalışma Başlat
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
            <div style={{ fontSize: 11, color: C.textXlight, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, padding: "4px 8px 6px" }}>Bugün</div>
            {mockSohbetler.map((s, i) => (
              <button key={i} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "9px 10px", borderRadius: 7, color: C.textMid, fontSize: 13, marginBottom: 2, transition: "background .1s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Ana içerik */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        {!isEmpty && (
          <div style={{ padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {!sohbetListOpen && (
              <button onClick={() => setSohbetListOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 4 }}><IcArrowL /></button>
            )}
            <span style={{ fontSize: 14, fontWeight: 500, color: C.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {messages[0]?.content?.slice(0, 60)}...
            </span>
            <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 12px", fontSize: 13, cursor: "pointer", color: C.textMid }}>Bize Ulaşın</button>
            <button onClick={() => navTo("editor")} style={{ background: C.blue, border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 13, cursor: "pointer", color: "#fff", fontWeight: 600 }}>Editör</button>
          </div>
        )}

        {/* Mesajlar */}
        <div style={{ flex: 1, overflowY: "auto", padding: isEmpty ? 0 : "24px 0" }}>
          {isEmpty ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", animation: "fadeUp .4s ease" }}>
              <h1 style={{ fontSize: 38, fontWeight: 800, color: C.text, letterSpacing: "-1px", marginBottom: 4 }}>
                HukukAI <span style={{ fontWeight: 300, fontSize: 26, color: C.textLight }}>Yapay Zeka Hukuk Asistanı</span>
              </h1>
              <p style={{ color: C.textLight, marginBottom: 32, fontSize: 15 }}>Yargıtay kararları ve mevzuata dayalı, kaynak göstererek cevap verir.</p>
              <div style={{ width: "100%", maxWidth: 680 }}>
                <ChatInput value={input} onChange={setInput} onSend={sendMessage} loading={loading} inputRef={inputRef} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", maxWidth: 680, marginTop: 18 }}>
                {ORNEK_SORULAR.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.aciklama)}
                    style={{ background: C.bgGray, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all .15s", animation: `fadeUp .3s ease ${i * .05}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.blueLight; e.currentTarget.style.borderColor = C.blueMid; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.bgGray; e.currentTarget.style.borderColor = C.border; }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: C.text, marginBottom: 4 }}>{s.baslik}</div>
                    <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.5 }}>{s.aciklama}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 820, width: "100%", margin: "0 auto", padding: "0 20px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 24, animation: "fadeUp .3s ease" }}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ maxWidth: "75%", background: C.bgGray, border: `1px solid ${C.border}`, borderRadius: "14px 14px 4px 14px", padding: "12px 16px", fontSize: 14, color: C.text, lineHeight: 1.65 }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {!msg.error && (msg.mevzuat_sayisi > 0 || msg.karar_sayisi > 0) && (
                        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                          {[
                            { label: `Karar Sonuçları (${msg.karar_sayisi})`, key: "karar", flag: "🇹🇷" },
                            { label: `Mevzuat Sonuçları (${msg.mevzuat_sayisi})`, key: "mevzuat", flag: "🇹🇷" },
                            { label: "Belgelerim (0)", key: "belgeler", flag: "📄" },
                            { label: "Doktrin (0)", key: "doktrin", flag: "🇹🇷" },
                            { label: "Web Araması (0)", key: "web", flag: "🌐" },
                          ].map(tab => (
                            <button key={tab.key}
                              onClick={() => { if (tab.key === "karar" || tab.key === "mevzuat") setKararPanel(v => !v); }}
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${C.border}`, background: C.bg, color: C.textLight, transition: "all .15s" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; e.currentTarget.style.background = C.blueLight; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; e.currentTarget.style.background = C.bg; }}>
                              <span>{tab.flag}</span>{tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: 14, color: msg.error ? C.danger : C.text, lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            .replace(/\n\n/g, `</p><p style="margin-top:10px">`)
                            .replace(/\n/g, "<br/>")
                        }} />
                      {msg.suggestions && (
                        <div style={{ marginTop: 20 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>Devam sorusu önerileri</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {msg.suggestions.map((s, j) => (
                              <button key={j} onClick={() => sendMessage(s)}
                                style={{ textAlign: "left", padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.textMid, transition: "all .15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = C.bgGray; e.currentTarget.style.borderColor = C.borderDark; }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = C.border; }}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><IcDownload />İndir</button>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>📋 Kopyala</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {streaming && (
                <div style={{ marginBottom: 24, fontSize: 14, color: C.text, lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: streaming.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") + `<span style="display:inline-block;width:2px;height:14px;background:${C.blue};margin-left:2px;animation:pulse .7s infinite;vertical-align:text-bottom"></span>` }} />
              )}
              {loading && !streaming && (
                <div style={{ display: "flex", gap: 5, marginBottom: 24 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.blue, animation: `bounce 1.2s infinite`, animationDelay: `${i * .15}s` }} />)}
                </div>
              )}
              <div ref={msgEnd} />
            </div>
          )}
        </div>

        {/* Input (alt) */}
        {!isEmpty && (
          <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <ChatInput value={input} onChange={setInput} onSend={sendMessage} loading={loading} inputRef={inputRef} />
              <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.textXlight }}>
                HukukAI yanıtları yalnızca bilgi amaçlıdır; hukuki danışmanlık ya da bağlayıcı görüş niteliği taşımaz.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Karar paneli */}
      {kararPanel && (
        <div style={{ width: 380, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg, animation: "slideInRight .2s ease" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
              {[`Karar Sonuçları (${mockKararlar.length})`, `Mevzuat Sonuçları (2)`, "Belgelerim (0)"].map((t, i) => (
                <button key={i} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 16, border: `1px solid ${i === 0 ? C.blue : C.border}`, background: i === 0 ? C.blueLight : C.bg, color: i === 0 ? C.blue : C.textLight, cursor: "pointer" }}>
                  {i < 2 && "🇹🇷 "}{t}
                </button>
              ))}
            </div>
            <button onClick={() => setKararPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 4 }}><IcX /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {mockKararlar.map(k => <KararCard key={k.id} karar={k} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatInput({ value, onChange, onSend, loading, inputRef }) {
  return (
    <div style={{ background: C.bgGray, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 4px", display: "flex", gap: 6 }}>
        <span style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, color: C.textMid, cursor: "pointer" }}>
          Hukuk Sistemleri (1)
        </span>
      </div>
      <textarea value={value} ref={inputRef}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder="İstediğiniz hukuki soruyu sorun..."
        rows={3}
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: "6px 14px", fontSize: 14, color: C.text, lineHeight: 1.6, maxHeight: 120, overflowY: "auto" }}
        onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
      />
      <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}><IcAttach size={16} />Dosya ekleyin</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 13 }}>📂 Kaynaklar</button>
        <div style={{ flex: 1 }} />
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>Özelleştir <IcChevD /></button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: loading ? C.textXlight : C.textLight, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><IcWand size={14} />Geliştir</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 4 }}><IcMic size={18} /></button>
        <button onClick={onSend} disabled={!value.trim() || loading}
          style={{ background: !value.trim() || loading ? "#c7cce8" : C.blue, border: "none", borderRadius: 8, padding: "7px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: !value.trim() || loading ? "not-allowed" : "pointer", transition: "background .15s" }}>
          {loading ? "..." : "Sor"}
        </button>
      </div>
    </div>
  );
}

function KararCard({ karar }) {
  const [expanded, setExpanded] = useState(false);
  const pct = karar.eslesme;
  const barColor = pct >= 75 ? C.success : pct >= 50 ? C.warn : C.borderDark;
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10, background: C.bg, padding: "12px 14px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 6 }}>
        {karar.daire} {karar.esas}, {karar.karar}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.textLight }}>🏛 {karar.mahkeme}</span>
        <span style={{ fontSize: 11, color: C.textLight }}>📄 {karar.tip}</span>
        <span style={{ fontSize: 11, color: C.textLight }}>📅 {karar.tarih}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 4, background: C.bgGray2, borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 11, color: C.textLight }}>Eşleşme %{pct}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}><IcDownload /></button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}><IcBookmark /></button>
        <button style={{ marginLeft: "auto", background: C.blue, border: "none", borderRadius: 7, padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Görüntüle</button>
      </div>
    </div>
  );
}