import { useState } from "react";
import { C } from "../theme";
import { IcPlus, IcChevL, IcChevR, IcX, IcTrash, IcBell } from "../components/Icons";

const GUNLER = ["PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ", "PAZAR"];
const AYLAR  = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Pazartesi = 0
}

export default function TakvimPage() {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [viewMode,     setViewMode]     = useState("ay"); // ay | hafta | yil
  const [gorevler,     setGorevler]     = useState([]);
  const [panel,        setPanel]        = useState(null); // null | { date, gorev? }

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0);  setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };
  const goToday   = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

  const daysInMonth  = getDaysInMonth(currentYear, currentMonth);
  const firstDayIdx  = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);

  // Takvim hücrelerini oluştur
  const cells = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push({ day: prevMonthDays - firstDayIdx + 1 + i, current: false });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, current: true });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, current: false });

  const isToday = (cell) => cell.current && cell.day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getGorevlerForDay = (day) => gorevler.filter(g => {
    const d = new Date(g.tarih);
    return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const openNewGorev = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setPanel({ date: dateStr, gorev: null });
  };

  const openGorev = (gorev) => setPanel({ date: gorev.tarih, gorev });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg, position: "relative" }}>

      {/* Header */}
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Takvim</h1>
        <span style={{ fontSize: 13, color: C.textLight }}>{gorevler.length} Görev</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setPanel({ date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`, gorev: null })}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.blue, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <IcPlus size={16} /> Yeni Görev
        </button>
      </div>

      {/* Navigasyon */}
      <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={goToday} style={{ padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 7, background: C.bg, cursor: "pointer", fontSize: 13, color: C.textMid, fontWeight: 500 }}>Bugün</button>
        <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: C.textMid, display: "flex" }}><IcChevL /></button>
        <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: C.textMid, display: "flex" }}><IcChevR /></button>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.text, minWidth: 120 }}>{AYLAR[currentMonth]} {currentYear}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          {["ay", "hafta", "yil"].map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              style={{ padding: "6px 14px", border: "none", cursor: "pointer", fontSize: 13, background: viewMode === v ? C.blue : C.bg, color: viewMode === v ? "#fff" : C.textLight, fontWeight: viewMode === v ? 600 : 400, transition: "all .15s" }}>
              {v === "ay" ? "Ay" : v === "hafta" ? "Hafta" : "Yıl"}
            </button>
          ))}
        </div>
      </div>

      {/* Takvim grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
        {/* Gün başlıkları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${C.border}` }}>
          {GUNLER.map(g => (
            <div key={g} style={{ padding: "10px 0", textAlign: "center", fontSize: 11, fontWeight: 600, color: C.textLight, letterSpacing: .5 }}>{g}</div>
          ))}
        </div>

        {/* Hücreler */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", flex: 1 }}>
          {cells.map((cell, idx) => {
            const dayGorevler = cell.current ? getGorevlerForDay(cell.day) : [];
            return (
              <div key={idx}
                onClick={() => cell.current && openNewGorev(cell.day)}
                style={{
                  minHeight: 100,
                  border: `1px solid ${C.border}`,
                  borderTop: "none",
                  borderLeft: idx % 7 === 0 ? `1px solid ${C.border}` : "none",
                  padding: "8px",
                  cursor: cell.current ? "pointer" : "default",
                  background: isToday(cell) ? C.blueLight : "transparent",
                  transition: "background .1s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (cell.current && !isToday(cell)) e.currentTarget.style.background = C.bgGray; }}
                onMouseLeave={e => { if (!isToday(cell)) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{
                    fontSize: 13, fontWeight: isToday(cell) ? 700 : 400,
                    color: !cell.current ? C.textXlight : isToday(cell) ? "#fff" : C.text,
                    width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%",
                    background: isToday(cell) ? C.blue : "transparent",
                  }}>{cell.day}</span>
                </div>
                {dayGorevler.map(g => (
                  <div key={g.id} onClick={e => { e.stopPropagation(); openGorev(g); }}
                    style={{ marginTop: 4, padding: "2px 6px", background: C.blue, borderRadius: 4, fontSize: 11, color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>
                    {g.baslik}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Görev Detayları Panel */}
      {panel && (
        <>
          <div onClick={() => setPanel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.2)", zIndex: 100 }} />
          <GorevPanel
            panel={panel}
            onClose={() => setPanel(null)}
            onSave={(gorev) => {
              if (panel.gorev) {
                setGorevler(p => p.map(g => g.id === gorev.id ? gorev : g));
              } else {
                setGorevler(p => [...p, { ...gorev, id: Date.now() }]);
              }
              setPanel(null);
            }}
            onDelete={(id) => {
              setGorevler(p => p.filter(g => g.id !== id));
              setPanel(null);
            }}
          />
        </>
      )}
    </div>
  );
}

function GorevPanel({ panel, onClose, onSave, onDelete }) {
  const [baslik,      setBaslik]      = useState(panel.gorev?.baslik || "Yeni Görev");
  const [aciklama,    setAciklama]    = useState(panel.gorev?.aciklama || "");
  const [tarih,       setTarih]       = useState(panel.gorev?.tarih || panel.date);
  const [takvimde,    setTakvimde]    = useState(panel.gorev?.takvimde ?? true);
  const [tamamlandi,  setTamamlandi]  = useState(panel.gorev?.tamamlandi || false);
  const [hatirlatici, setHatirlatici] = useState(panel.gorev?.hatirlatici || false);

  const handleSave = () => {
    onSave({ baslik, aciklama, tarih, takvimde, tamamlandi, hatirlatici, id: panel.gorev?.id });
  };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0,
      width: 320, background: C.bg,
      borderLeft: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      zIndex: 101, animation: "slideInRight .2s ease",
      boxShadow: "-4px 0 20px rgba(0,0,0,.08)",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Görev Detayları</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, display: "flex", padding: 4 }}><IcX /></button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Başlık</label>
        <input value={baslik} onChange={e => setBaslik(e.target.value)}
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />

        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Açıklama</label>
        <textarea value={aciklama} onChange={e => setAciklama(e.target.value)}
          placeholder="Görev açıklaması (isteğe bağlı)"
          rows={4}
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />

        <label style={{ fontSize: 13, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Tarih</label>
        <input type="date" value={tarih} onChange={e => setTarih(e.target.value)}
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", marginBottom: 16, color: C.text }} />

        {/* Checkboxlar */}
        <div style={{ marginBottom: 16 }}>
          {[
            { label: "Takvimde göster", value: takvimde,    set: setTakvimde },
            { label: "Tamamlandı",      value: tamamlandi,  set: setTamamlandi },
          ].map(({ label, value, set }) => (
            <label key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer", fontSize: 14, color: C.textMid }}>
              <div onClick={() => set(v => !v)}
                style={{ width: 18, height: 18, border: `2px solid ${value ? C.blue : C.border}`, borderRadius: 4, background: value ? C.blue : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                {value && <svg width={10} height={10} viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" /></svg>}
              </div>
              {label}
            </label>
          ))}
        </div>

        {/* Hatırlatıcı kartı */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", background: C.blueLight, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.blue, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <IcBell size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Hatırlatıcı Ayarla</div>
              <div style={{ fontSize: 11, color: C.textLight }}>Görev yaklaşınca sizi bilgilendirelim</div>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer", background: C.bg }}>
            <div onClick={() => setHatirlatici(v => !v)}
              style={{ width: 18, height: 18, border: `2px solid ${hatirlatici ? C.blue : C.border}`, borderRadius: 4, background: hatirlatici ? C.blue : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
              {hatirlatici && <svg width={10} height={10} viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" /></svg>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Hatırlatıcıyı Aç</div>
              <div style={{ fontSize: 11, color: C.textLight }}>Bu göreve özel hatırlatıcı oluştur</div>
            </div>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        <button onClick={handleSave}
          style={{ flex: 1, background: C.blue, border: "none", borderRadius: 8, padding: "11px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = C.blueDark}
          onMouseLeave={e => e.currentTarget.style.background = C.blue}>
          Kaydet
        </button>
        {panel.gorev && (
          <button onClick={() => onDelete(panel.gorev.id)}
            style={{ padding: "11px 14px", background: "#fef2f2", border: `1px solid #fecaca`, borderRadius: 8, cursor: "pointer", color: C.danger, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcTrash />
          </button>
        )}
      </div>
    </div>
  );
}
