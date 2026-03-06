import { useState, useRef } from "react";
import { C } from "../theme";
import { IcArrowL, IcPlus, IcAttach, IcMic, IcWand, IcUpload, IcBox, IcSend, IcDownload, IcX } from "../components/Icons";

const SYSTEM_PROMPT = `Sen HukukAI, Türk hukuku uzmanı bir yapay zeka asistanısın.
Hukuki belge oluşturma, düzenleme ve analiz konusunda yardım edersin.
Dilekçe, ihtarname, sözleşme taslağı hazırlayabilirsin.
Her zaman Türk hukuku terminolojisini ve formatını kullan.`;

export default function EditorPage({ navTo }) {
  const [mode, setMode] = useState("landing"); // landing | editor | upload
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [docTitle, setDocTitle] = useState("Başlığınızı girin");
  const [apiKey, setApiKey] = useState("");
  const msgEnd = useRef(null);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setStreaming("");
    const userMsg = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (mode === "landing") setMode("editor");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
          stream: true,
        }),
      });
      if (!res.ok) throw new Error("API hatası: " + res.status);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value).split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.type === "content_block_delta" && d.delta?.text) { full += d.delta.text; setStreaming(full); }
            } catch {}
          }
        }
      }
      setMessages(p => [...p, { role: "assistant", content: full }]);
      setStreaming("");
      // Eğer belge içeriği varsa editöre aktar
      if (full.length > 200 && !editorContent) setEditorContent(full);
    } catch (err) {
      setMessages(p => [...p, { role: "assistant", content: `Hata: ${err.message}`, error: true }]);
      setStreaming("");
    } finally { setLoading(false); }
  };

  if (mode === "editor") return <DocEditor content={editorContent} setContent={setEditorContent} title={docTitle} setTitle={setDocTitle} messages={messages} streaming={streaming} loading={loading} input={input} setInput={setInput} sendMessage={sendMessage} onBack={() => setMode("landing")} msgEnd={msgEnd} />;

  // Landing page
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sol panel - geçmiş */}
      <div style={{ width: 260, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg }}>
        <div style={{ padding: "14px 14px 12px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <button onClick={() => navTo("asistan")} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 2 }}><IcArrowL /></button>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Belge Oluştur</span>
          </div>
          <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.textMid }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgGray}
            onMouseLeave={e => e.currentTarget.style.background = C.bg}>
            <IcPlus size={16} /> Yeni Döküman Oluştur
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: C.textXlight, textAlign: "center", padding: "0 20px" }}>Henüz geçmiş döküman bulunmuyor</span>
        </div>
      </div>

      {/* Ana içerik */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: C.bg }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.blue, letterSpacing: "-1px", marginBottom: 8, textAlign: "center" }}>
          Nereden başlayalım?
        </h1>
        <p style={{ fontSize: 15, color: C.textLight, marginBottom: 36, textAlign: "center" }}>
          HukukAI ile hukuki belgelerinizi kolayca oluşturun
        </p>

        {/* Chat input */}
        <div style={{ width: "100%", maxWidth: 600, marginBottom: 32 }}>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: C.bg, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              placeholder="HukukAI'e bir soru sorun..."
              style={{ width: "100%", border: "none", outline: "none", padding: "14px 16px", fontSize: 14, color: C.text, background: "transparent" }}
            />
            <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}><IcPlus size={16} /></button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>⚙️ Araçlar</button>
              <div style={{ flex: 1 }} />
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcMic size={18} /></button>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ background: !input.trim() || loading ? C.bgGray2 : C.blue, border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: !input.trim() ? "not-allowed" : "pointer", color: !input.trim() || loading ? C.textXlight : "#fff", transition: "background .15s" }}>
                <IcSend size={15} />
              </button>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: C.textXlight, marginTop: 8 }}>
            HukukAI'nın yanıtları yalnızca bilgi amaçlıdır; hukuki danışmanlık ya da bağlayıcı görüş niteliği taşımaz.
          </p>
        </div>

        {/* VEYA */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, width: "100%", maxWidth: 600 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.blue, letterSpacing: 1 }}>VEYA</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* İki kart */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: "100%", maxWidth: 600 }}>
          <UploadCard
            icon={<IcUpload size={36} />}
            title="Kendi Belgenizi Yükleyin"
            desc="Elinizdeki bir sözleşme, dilekçe veya mahkeme kararını (DOCX veya UDF formatında) buraya yükleyin. HukukAI Asistan, belgenizi analiz ederek hukuki metinleri yeniden yazmanıza, maddeleri düzenlemenize ve içeriği geliştirmenize yardımcı olacaktır."
            btnLabel="Belgenizi Yükleyin"
            btnColor={C.blue}
            note="Desteklenen formatlar: DOCX, UDF"
            onClick={() => setMode("editor")}
          />
          <UploadCard
            icon={<IcBox size={36} />}
            title="Analiz İçin Kaynak Ekleyin"
            desc="Yeni bir belge oluştururken yapay zekanın incelemesini istediğiniz kaynak dosyaları (örnek kararlar, ilgili mevzuat, notlar) buraya ekleyin. Asistan, bu belgelerdeki bilgileri kullanarak size daha isabetli ve bağlama uygun metinler hazırlar."
            btnLabel="Kaynaklarınızı Ekleyin"
            btnColor={C.blue}
            note={<>Desteklenen formatlar: PDF, DOCX, TXT, UDF<br />Belge başına maksimum 50MB · Tek seferde maksimum 20 belge</>}
            onClick={() => setMode("editor")}
          />
        </div>
      </div>
    </div>
  );
}

function UploadCard({ icon, title, desc, btnLabel, btnColor, note, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ border: `2px dashed ${hover ? C.blue : C.border}`, borderRadius: 14, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: hover ? C.blueLight : C.bg, transition: "all .2s", cursor: "default" }}>
      <div style={{ color: hover ? C.blue : C.textLight, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 12, color: C.textLight, lineHeight: 1.65, marginBottom: 20 }}>{desc}</p>
      <button onClick={onClick}
        style={{ background: btnColor, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10, transition: "opacity .15s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        {btnLabel}
      </button>
      <p style={{ fontSize: 11, color: C.textXlight, lineHeight: 1.6 }}>{note}</p>
    </div>
  );
}

function DocEditor({ content, setContent, title, setTitle, messages, streaming, loading, input, setInput, sendMessage, onBack, msgEnd }) {
  const [wordCount, setWordCount] = useState(content.split(/\s+/).filter(Boolean).length);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setWordCount(e.target.value.split(/\s+/).filter(Boolean).length);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, background: C.bg, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcArrowL size={18} /></button>
        <input value={title} onChange={e => setTitle(e.target.value)}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontWeight: 600, color: C.text, background: "transparent" }} />
        <span style={{ fontSize: 12, color: C.textXlight }}>{wordCount} kelime</span>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}>💾</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}>🔗</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex" }}><IcDownload /></button>
        <button style={{ background: C.blue, border: "none", borderRadius: 8, padding: "6px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Versiyonlar</button>
      </div>

      {/* Format toolbar */}
      <div style={{ padding: "6px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", background: C.bgGray, flexShrink: 0 }}>
        {["↩", "↪"].map((t, i) => <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMid, padding: "4px 6px", borderRadius: 4, fontSize: 14 }}>{t}</button>)}
        <select style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 12, color: C.textMid, outline: "none", background: C.bg }}>
          <option>Normal</option><option>Başlık 1</option><option>Başlık 2</option>
        </select>
        {[{ t: "B", fw: "bold" }, { t: "I", fw: "normal" }, { t: "U", fw: "normal" }, { t: "S", fw: "normal" }].map(({ t, fw }) => (
          <button key={t} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMid, padding: "4px 8px", borderRadius: 4, fontSize: 13, fontWeight: fw }}>{t}</button>
        ))}
        {["●", "≡", "≣", "⇐", "⇒", "☰", "☷", "❝"].map((t, i) => (
          <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMid, padding: "4px 6px", borderRadius: 4, fontSize: 13 }}>{t}</button>
        ))}
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Document area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px 60px", background: C.bgGray, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 680, background: C.bg, borderRadius: 4, padding: "60px 72px", boxShadow: "0 2px 20px rgba(0,0,0,.06)", minHeight: 600 }}>
            <textarea value={content} onChange={handleContentChange}
              placeholder="Belge içeriğinizi buraya yazın veya HukukAI'ya oluşturmasını söyleyin..."
              style={{ width: "100%", border: "none", outline: "none", fontSize: 14, lineHeight: 1.9, color: C.text, background: "transparent", minHeight: 500, fontFamily: "inherit" }} />
          </div>
        </div>

        {/* AI chat panel */}
        <div style={{ width: 340, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.bg }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text }}>
            🤖 HukukAI Asistan
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
            {messages.length === 0 && (
              <p style={{ fontSize: 12, color: C.textXlight, textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
                Belge hakkında soru sorun veya düzenleme isteyin
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 12, animation: "fadeUp .2s ease" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: m.role === "user" ? C.blue : C.textLight, marginBottom: 4, textTransform: "uppercase", letterSpacing: .3 }}>
                  {m.role === "user" ? "Sen" : "HukukAI"}
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
              </div>
            ))}
            {streaming && (
              <div style={{ marginBottom: 12, fontSize: 13, color: C.text, lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{ __html: streaming.replace(/\n/g, "<br/>") + `<span style="display:inline-block;width:2px;height:12px;background:${C.blue};margin-left:2px;animation:pulse .7s infinite;vertical-align:text-bottom"></span>` }} />
            )}
            <div ref={msgEnd} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Asistana bir şey sorun..."
                style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", color: C.text, background: C.bg }} />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ background: !input.trim() || loading ? C.bgGray2 : C.blue, border: "none", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: !input.trim() ? "not-allowed" : "pointer", color: !input.trim() || loading ? C.textXlight : "#fff", flexShrink: 0 }}>
                <IcSend size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
