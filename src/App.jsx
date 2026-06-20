import { useState, useCallback } from "react";

const THEMES = {
  islami: {
    label: "Islami / Religi",
    desc: "Buku doa, tafsir, fiqh, biografi ulama",
    primary: "#1B4F72", accent: "#C9A227", bg: "#F5F0E8", text: "#1a1a1a",
    headingFont: "Amiri, Georgia, serif", bodyFont: "'Palatino Linotype', Palatino, serif",
    icon: "📖", palette: ["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"]
  },
  anak: {
    label: "Anak-anak",
    desc: "Buku cerita, edukasi anak, komik",
    primary: "#E53935", accent: "#FDD835", bg: "#FFFDE7", text: "#1a1a1a",
    headingFont: "'Comic Sans MS', 'Segoe UI', sans-serif", bodyFont: "'Trebuchet MS', sans-serif",
    icon: "🎨", palette: ["#E53935","#FDD835","#43A047","#1E88E5","#FB8C00"]
  },
  akademik: {
    label: "Akademik / Ilmiah",
    desc: "Jurnal, skripsi, textbook, penelitian",
    primary: "#1A237E", accent: "#1565C0", bg: "#FAFAFA", text: "#111111",
    headingFont: "'Times New Roman', Times, serif", bodyFont: "'Times New Roman', Times, serif",
    icon: "🎓", palette: ["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"]
  },
  memoir: {
    label: "Memoir / Sastra",
    desc: "Memoar, novel, cerpen, biografi",
    primary: "#4E342E", accent: "#A1887F", bg: "#FDF6EE", text: "#1a1a1a",
    headingFont: "Garamond, 'Book Antiqua', Georgia, serif", bodyFont: "Garamond, Georgia, serif",
    icon: "✍️", palette: ["#4E342E","#A1887F","#D7CCC8","#6D4C41","#BCAAA4"]
  },
  bisnis: {
    label: "Bisnis / Profesional",
    desc: "Manajemen, motivasi, self-help, keuangan",
    primary: "#212121", accent: "#D32F2F", bg: "#FFFFFF", text: "#111111",
    headingFont: "'Arial Narrow', Arial, sans-serif", bodyFont: "Arial, 'Helvetica Neue', sans-serif",
    icon: "💼", palette: ["#212121","#D32F2F","#424242","#757575","#BDBDBD"]
  },
  fiksi: {
    label: "Fiksi / Novel",
    desc: "Novel romance, thriller, fantasi, sci-fi",
    primary: "#4A148C", accent: "#7B1FA2", bg: "#F3E5F5", text: "#1a1a1a",
    headingFont: "Garamond, 'Book Antiqua', serif", bodyFont: "'Palatino Linotype', Palatino, serif",
    icon: "📚", palette: ["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"]
  },
};

const FORMATS = {
  A5: { w: "14.8cm", h: "21cm", label: "A5 (14.8×21 cm)", margin: "2cm 1.8cm" },
  A4: { w: "21cm", h: "29.7cm", label: "A4 (21×29.7 cm)", margin: "2.5cm 2.5cm" },
  B5: { w: "17.6cm", h: "25cm", label: "B5 (17.6×25 cm)", margin: "2cm 2cm" },
  "Custom": { w: "15.5cm", h: "23cm", label: "Custom (15.5×23 cm)", margin: "2cm 1.8cm" },
};

const STEPS = ["Tema & Format", "Input Konten", "Metadata", "Preview & Unduh"];

export default function App() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("islami");
  const [format, setFormat] = useState("A5");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [meta, setMeta] = useState({ judul: "", penulis: "", penerbit: "", tahun: new Date().getFullYear(), subjudul: "" });
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const t = THEMES[theme];

  const handleFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target.result);
    reader.readAsText(file, "UTF-8");
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const parseContent = (text) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const sections = [];
    let currentSection = null;
    let currentParagraphs = [];

    for (const line of lines) {
      if (/^#+\s/.test(line) || /^(BAB|PASAL|BAGIAN|CHAPTER)\s+[IVX\d]/i.test(line)) {
        if (currentSection) {
          sections.push({ ...currentSection, paragraphs: currentParagraphs });
          currentParagraphs = [];
        }
        currentSection = { type: "heading", text: line.replace(/^#+\s*/, "") };
      } else if (/^(###|##)\s/.test(line)) {
        currentParagraphs.push({ type: "subheading", text: line.replace(/^#+\s*/, "") });
      } else if (/^\[KUTIPAN\]|^\[QUOTE\]/i.test(line)) {
        currentParagraphs.push({ type: "pullquote", text: line.replace(/^\[KUTIPAN\]|\[QUOTE\]/i, "").trim() });
      } else if (/^\[ARAB\]|^\[ARABIC\]/i.test(line)) {
        currentParagraphs.push({ type: "arabic", text: line.replace(/^\[ARAB\]|\[ARABIC\]/i, "").trim() });
      } else if (/^\[CATATAN\]|^\[FOOTNOTE\]/i.test(line)) {
        currentParagraphs.push({ type: "footnote", text: line.replace(/^\[CATATAN\]|\[FOOTNOTE\]/i, "").trim() });
      } else if (line) {
        currentParagraphs.push({ type: "paragraph", text: line });
      }
    }
    if (currentSection) sections.push({ ...currentSection, paragraphs: currentParagraphs });
    else if (currentParagraphs.length) sections.push({ type: "body", text: "", paragraphs: currentParagraphs });
    return sections;
  };

  const italicizeForeign = (text) => {
    const result = text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,4})\b/g, (match) => {
      const commonID = ["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai"];
      const words = match.toLowerCase().split(/\s+/);
      const isIndonesian = words.every(w => commonID.includes(w) || /^[a-z]{1,2}$/.test(w));
      return isIndonesian ? match : `<em>${match}</em>`;
    });
    return result;
  };

  const generatePreview = () => {
    setGenerating(true);
    setTimeout(() => {
      const sections = parseContent(content);
      setPreview(sections);
      setGenerating(false);
      setStep(3);
    }, 800);
  };

  const downloadDocx = async () => {
    setGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Buat instruksi layout profesional untuk buku "${meta.judul}" karya ${meta.penulis}. Tema: ${t.label}. Format: ${format}. Font heading: ${t.headingFont}. Font body: ${t.bodyFont}. Warna primer: ${t.primary}. Warna aksen: ${t.accent}. Berikan saran singkat layout dalam 3 kalimat Bahasa Indonesia.`
          }]
        })
      });
      const data = await response.json();

      const sections = parseContent(content);
      const bodyXml = sections.map(sec => {
        const secHeading = sec.type === "heading" ? `
          <w:p><w:pPr><w:pStyle w:val="Heading1"/><w:jc w:val="center"/><w:spacing w:before="480" w:after="240"/></w:pPr>
          <w:r><w:rPr><w:color w:val="${t.primary.replace('#','')}"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr><w:t>${sec.text}</w:t></w:r></w:p>` : "";
        const paras = (sec.paragraphs || []).map(p => {
          if (p.type === "subheading") return `<w:p><w:pPr><w:pStyle w:val="Heading2"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="${t.accent.replace('#','')}"/></w:rPr><w:t>${p.text}</w:t></w:r></w:p>`;
          if (p.type === "pullquote") return `<w:p><w:pPr><w:ind w:left="720" w:right="720"/><w:jc w:val="center"/><w:spacing w:before="240" w:after="240"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="${t.accent.replace('#','')}"/><w:sz w:val="28"/></w:rPr><w:t>"${p.text}"</w:t></w:r></w:p>`;
          if (p.type === "arabic") return `<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="120" w:after="120"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="28"/><w:szCs w:val="28"/><w:rtl/></w:rPr><w:t>${p.text}</w:t></w:r></w:p>`;
          if (p.type === "footnote") return `<w:p><w:pPr><w:pStyle w:val="FootnoteText"/><w:ind w:left="360"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>* ${p.text}</w:t></w:r></w:p>`;
          return `<w:p><w:pPr><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="120"/><w:ind w:firstLine="720"/></w:pPr><w:r><w:t xml:space="preserve">${p.text}</w:t></w:r></w:p>`;
        }).join("");
        return secHeading + paras;
      }).join("");

      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="720" w:after="240"/></w:pPr>
      <w:r><w:rPr><w:b/><w:color w:val="${t.primary.replace('#','')}"/><w:sz w:val="64"/></w:rPr><w:t>${meta.judul || "Judul Buku"}</w:t></w:r></w:p>
    ${meta.subjudul ? `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="${t.accent.replace('#','')}"/><w:sz w:val="32"/></w:rPr><w:t>${meta.subjudul}</w:t></w:r></w:p>` : ""}
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="480"/></w:pPr>
      <w:r><w:rPr><w:color w:val="555555"/><w:sz w:val="24"/></w:rPr><w:t>${meta.penulis || ""}</w:t></w:r></w:p>
    <w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="${format === "A4" ? "11906" : format === "B5" ? "9978" : "8391"}" w:h="${format === "A4" ? "16838" : format === "B5" ? "14175" : "11906"}"/>
      <w:pgMar w:top="1134" w:right="1020" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

      const blob = new Blob([docXml], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(meta.judul || "buku").replace(/\s+/g, "_")}_layout.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch(e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const canNext = [
    true,
    content.trim().length > 10,
    meta.judul.trim().length > 0 && meta.penulis.trim().length > 0,
    true
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ background: t.primary, borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }}>{t.icon}</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>Book Layout Studio Pro</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Tata letak buku profesional — mudah untuk semua kalangan</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {t.palette.map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.3)" }}/>)}
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.25rem" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 4, background: i <= step ? t.primary : "#e5e7eb", marginBottom: 6 }}/>
            <div style={{ fontSize: 11, color: i === step ? t.primary : "#888", fontWeight: i === step ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Pilih Tema Buku</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginBottom: 20 }}>
            {Object.entries(THEMES).map(([k, v]) => (
              <div key={k} onClick={() => setTheme(k)} style={{
                border: theme === k ? `2px solid ${v.primary}` : "1px solid #e5e7eb",
                borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                background: theme === k ? v.bg : "#fff"
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{v.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: v.primary }}>{v.label}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{v.desc}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {v.palette.slice(0, 4).map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }}/>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Format Halaman</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
            {Object.entries(FORMATS).map(([k, v]) => (
              <div key={k} onClick={() => setFormat(k)} style={{
                border: format === k ? `2px solid ${t.primary}` : "1px solid #e5e7eb",
                borderRadius: 8, padding: "10px 14px", cursor: "pointer",
                background: format === k ? `${t.primary}11` : "#fff"
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: format === k ? t.primary : "#1a1a1a" }}>{k}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Upload atau Tempel Konten Buku</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.6 }}>
            Tandai struktur: <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}># BAB I</code> untuk judul bab, <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>[KUTIPAN]</code> pull quote, <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>[ARAB]</code> teks Arab, <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>[CATATAN]</code> footnote.
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: `2px dashed ${dragOver ? t.primary : "#d1d5db"}`,
              borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer",
              background: dragOver ? `${t.primary}08` : "#f9fafb", marginBottom: 14
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.primary }}>{fileName || "Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Mendukung format .txt dan .md</div>
            <input id="fileInput" type="file" accept=".txt,.md" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          </div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>— atau tempel teks langsung —</div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali."
            style={{
              width: "100%", minHeight: 220, borderRadius: 8, padding: "10px 12px",
              fontFamily: "inherit", fontSize: 13, lineHeight: 1.7, resize: "vertical",
              border: "1px solid #d1d5db", boxSizing: "border-box"
            }}
          />
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
            {content.length > 0 ? `${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata` : "Belum ada konten"}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Informasi Buku</div>
          {[
            { key: "judul", label: "Judul Buku *", placeholder: "Masukkan judul buku" },
            { key: "subjudul", label: "Sub-judul", placeholder: "Opsional" },
            { key: "penulis", label: "Nama Penulis *", placeholder: "Nama lengkap penulis" },
            { key: "penerbit", label: "Penerbit", placeholder: "Nama penerbit" },
            { key: "tahun", label: "Tahun Terbit", placeholder: "2025" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 5 }}>{label}</label>
              <input
                value={meta[key]}
                onChange={e => setMeta(m => ({ ...m, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, border: "1px solid #d1d5db", boxSizing: "border-box" }}
              />
            </div>
          ))}
          <div style={{ background: `${t.primary}10`, borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.primary, marginBottom: 6 }}>Pengaturan Aktif</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8 }}>
              Tema: <strong>{t.label}</strong> · Format: <strong>{FORMATS[format].label}</strong><br/>
              Font Judul: <em>{t.headingFont.split(",")[0]}</em> · Font Isi: <em>{t.bodyFont.split(",")[0]}</em>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Preview Layout Buku</div>
          <div style={{
            border: "1px solid #e5e7eb", borderRadius: 8,
            background: t.bg, padding: "28px 32px", maxHeight: 420, overflowY: "auto",
            fontFamily: t.bodyFont, boxShadow: "2px 4px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{ borderBottom: `2px solid ${t.accent}`, marginBottom: 20, paddingBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: t.primary, fontStyle: "italic" }}>{meta.judul || "Judul Buku"}</span>
              <span style={{ fontSize: 10, color: t.accent }}>1</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontFamily: t.headingFont, fontWeight: 700, color: t.primary }}>{meta.judul || "Judul Buku"}</div>
              {meta.subjudul && <div style={{ fontSize: 13, color: t.accent, fontStyle: "italic", marginTop: 4 }}>{meta.subjudul}</div>}
              <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, margin: "10px auto", width: "60%" }}/>
              <div style={{ fontSize: 12, color: t.primary }}>{meta.penulis}</div>
            </div>
            {preview && preview.slice(0, 6).map((sec, i) => (
              <div key={i}>
                {sec.type === "heading" && (
                  <div style={{ fontFamily: t.headingFont, fontSize: 16, fontWeight: 700, color: t.primary, margin: "16px 0 8px", paddingLeft: 8, borderLeft: `3px solid ${t.accent}` }}>{sec.text}</div>
                )}
                {(sec.paragraphs || []).slice(0, 3).map((p, j) => (
                  <div key={j}>
                    {p.type === "paragraph" && <p style={{ fontSize: 12, lineHeight: 1.8, textAlign: "justify", textIndent: "2em", margin: "0 0 8px", color: t.text }} dangerouslySetInnerHTML={{ __html: italicizeForeign(p.text) }}/>}
                    {p.type === "subheading" && <div style={{ fontFamily: t.headingFont, fontSize: 13, fontWeight: 600, color: t.accent, margin: "10px 0 5px" }}>{p.text}</div>}
                    {p.type === "pullquote" && <div style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 12, margin: "12px 0", fontStyle: "italic", fontSize: 12, color: t.primary }}>{p.text}</div>}
                    {p.type === "arabic" && <div style={{ textAlign: "right", fontSize: 16, fontFamily: "Amiri, serif", direction: "rtl", margin: "12px 0", color: t.primary }}>{p.text}</div>}
                    {p.type === "footnote" && <div style={{ fontSize: 10, color: "#888", borderTop: `0.5px solid ${t.accent}44`, marginTop: 16, paddingTop: 4 }}>* {p.text}</div>}
                  </div>
                ))}
              </div>
            ))}
            {!preview && <div style={{ textAlign: "center", color: "#888", fontSize: 13, padding: "20px 0" }}>Preview akan muncul setelah konten diproses...</div>}
          </div>
          <button
            onClick={downloadDocx}
            disabled={generating}
            style={{
              marginTop: 16, width: "100%", padding: "13px", borderRadius: 10,
              background: generating ? "#ccc" : t.primary,
              color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: generating ? "not-allowed" : "pointer"
            }}
          >
            {generating ? "Memproses..." : "⬇️ Unduh File .docx"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", border: "1px solid #d1d5db", cursor: "pointer", fontSize: 14 }}>
            ← Kembali
          </button>
        )}
        {step < 2 && (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]} style={{
            flex: 2, padding: "10px", borderRadius: 8,
            background: canNext[step] ? t.primary : "#ccc",
            color: "#fff", border: "none", cursor: canNext[step] ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600
          }}>
            Lanjut →
          </button>
        )}
        {step === 2 && (
          <button onClick={generatePreview} disabled={!canNext[2] || generating} style={{
            flex: 2, padding: "10px", borderRadius: 8,
            background: canNext[2] ? t.primary : "#ccc",
            color: "#fff", border: "none", cursor: canNext[2] ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600
          }}>
            {generating ? "Memproses..." : "Generate Preview →"}
          </button>
        )}
      </div>
    </div>
  );
}
