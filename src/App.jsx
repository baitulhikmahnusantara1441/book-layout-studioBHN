import { useState, useCallback } from "react";

const THEMES = {
  islami: {
    label: "Islami / Religi", desc: "Buku doa, tafsir, fiqh, biografi ulama",
    primary: "#1B4F72", accent: "#C9A227", bg: "#F5F0E8", text: "#1a1a1a",
    headingFont: "Amiri, Georgia, serif", bodyFont: "'Palatino Linotype', Palatino, serif",
    icon: "📖", palette: ["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"]
  },
  anak: {
    label: "Anak-anak", desc: "Buku cerita, edukasi anak, komik",
    primary: "#E53935", accent: "#FDD835", bg: "#FFFDE7", text: "#1a1a1a",
    headingFont: "'Comic Sans MS', 'Segoe UI', sans-serif", bodyFont: "'Trebuchet MS', sans-serif",
    icon: "🎨", palette: ["#E53935","#FDD835","#43A047","#1E88E5","#FB8C00"]
  },
  akademik: {
    label: "Akademik / Ilmiah", desc: "Jurnal, skripsi, textbook, penelitian",
    primary: "#1A237E", accent: "#1565C0", bg: "#FAFAFA", text: "#111111",
    headingFont: "'Times New Roman', Times, serif", bodyFont: "'Times New Roman', Times, serif",
    icon: "🎓", palette: ["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"]
  },
  memoir: {
    label: "Memoir / Sastra", desc: "Memoar, novel, cerpen, biografi",
    primary: "#4E342E", accent: "#A1887F", bg: "#FDF6EE", text: "#1a1a1a",
    headingFont: "Garamond, 'Book Antiqua', Georgia, serif", bodyFont: "Garamond, Georgia, serif",
    icon: "✍️", palette: ["#4E342E","#A1887F","#D7CCC8","#6D4C41","#BCAAA4"]
  },
  bisnis: {
    label: "Bisnis / Profesional", desc: "Manajemen, motivasi, self-help, keuangan",
    primary: "#212121", accent: "#D32F2F", bg: "#FFFFFF", text: "#111111",
    headingFont: "'Arial Narrow', Arial, sans-serif", bodyFont: "Arial, 'Helvetica Neue', sans-serif",
    icon: "💼", palette: ["#212121","#D32F2F","#424242","#757575","#BDBDBD"]
  },
  fiksi: {
    label: "Fiksi / Novel", desc: "Novel romance, thriller, fantasi, sci-fi",
    primary: "#4A148C", accent: "#7B1FA2", bg: "#F3E5F5", text: "#1a1a1a",
    headingFont: "Garamond, 'Book Antiqua', serif", bodyFont: "'Palatino Linotype', Palatino, serif",
    icon: "📚", palette: ["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"]
  },
};

const FORMATS = {
  A5: { w: 8391, h: 11906, label: "A5 (14.8×21 cm)" },
  A4: { w: 11906, h: 16838, label: "A4 (21×29.7 cm)" },
  B5: { w: 9978, h: 14175, label: "B5 (17.6×25 cm)" },
  Custom: { w: 8788, h: 13032, label: "Custom (15.5×23 cm)" },
};

const STEPS = ["Tema & Format", "Input Konten", "Metadata", "Preview & Unduh"];

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
};

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
  const [status, setStatus] = useState("");

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
    handleFile(e.dataTransfer.files[0]);
  };

  const parseContent = (text) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const sections = [];
    let cur = null, paras = [];
    for (const line of lines) {
      if (/^#+\s/.test(line) || /^(BAB|PASAL|BAGIAN|CHAPTER)\s+[IVX\d]/i.test(line)) {
        if (cur) sections.push({ ...cur, paragraphs: paras });
        cur = { type: "heading", text: line.replace(/^#+\s*/, "") };
        paras = [];
      } else if (/^\[KUTIPAN\]/i.test(line)) {
        paras.push({ type: "pullquote", text: line.replace(/^\[KUTIPAN\]/i,"").trim() });
      } else if (/^\[ARAB\]/i.test(line)) {
        paras.push({ type: "arabic", text: line.replace(/^\[ARAB\]/i,"").trim() });
      } else if (/^\[CATATAN\]/i.test(line)) {
        paras.push({ type: "footnote", text: line.replace(/^\[CATATAN\]/i,"").trim() });
      } else {
        paras.push({ type: "paragraph", text: line });
      }
    }
    if (cur) sections.push({ ...cur, paragraphs: paras });
    else if (paras.length) sections.push({ type: "body", text: "", paragraphs: paras });
    return sections;
  };

  const italicizeForeign = (text) => {
    const commonID = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","lah","kah","nya","si","sang","bang","pak","bu","mas","mbak"]);
    return text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g, (match) => {
      const words = match.toLowerCase().split(/\s+/);
      return words.every(w => commonID.has(w) || w.length <= 2) ? match : `<em>${match}</em>`;
    });
  };

  const generatePreview = () => {
    setGenerating(true);
    setTimeout(() => {
      setPreview(parseContent(content));
      setGenerating(false);
      setStep(3);
    }, 600);
  };

  const downloadDocx = async () => {
    setGenerating(true);
    setStatus("Memuat library docx...");
    try {
      // Load docx library from CDN
      if (!window.docx) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/docx@8.5.0/build/index.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      setStatus("Menyusun layout buku...");
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
              BorderStyle, ShadingType, PageOrientation, convertInchesToTwip,
              TableRow, TableCell, Table, WidthType, Header, Footer,
              PageNumber, NumberFormat } = window.docx;

      const pc = hexToRgb(t.primary);
      const ac = hexToRgb(t.accent);
      const pHex = t.primary.replace("#","");
      const aHex = t.accent.replace("#","");

      const sections = parseContent(content);
      const children = [];

      // ── COVER PAGE ──
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 240 },
        children: [new TextRun({ text: meta.judul || "Judul Buku", bold: true, size: 56, color: pHex, font: "Georgia" })],
      }));
      if (meta.subjudul) {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          children: [new TextRun({ text: meta.subjudul, italics: true, size: 28, color: aHex, font: "Georgia" })],
        }));
      }
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 240 },
        children: [new TextRun({ text: meta.penulis || "", size: 24, color: pHex, font: "Calibri" })],
      }));
      if (meta.penerbit) {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 0 },
          children: [new TextRun({ text: meta.penerbit, size: 20, color: "777777", font: "Calibri" })],
        }));
      }
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 1440 },
        children: [new TextRun({ text: String(meta.tahun), size: 20, color: "999999", font: "Calibri" })],
      }));

      // ── CONTENT ──
      for (const sec of sections) {
        if (sec.type === "heading") {
          children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
            spacing: { before: 480, after: 240 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: aHex, space: 4 } },
            children: [new TextRun({ text: sec.text, bold: true, size: 40, color: pHex, font: "Georgia" })],
          }));
        }
        for (const p of sec.paragraphs || []) {
          if (p.type === "paragraph") {
            // Detect & split foreign phrases
            const runs = [];
            const parts = p.text.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g);
            const commonID = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","lah","kah","nya","si","sang"]);
            for (const part of parts) {
              if (!part) continue;
              const words = part.toLowerCase().split(/\s+/);
              const isForeign = /^[a-zA-Z]/.test(part) && !words.every(w => commonID.has(w) || w.length <= 2);
              runs.push(new TextRun({ text: part, italics: isForeign, size: 24, font: "Palatino Linotype" }));
            }
            children.push(new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360, after: 120 },
              indent: { firstLine: convertInchesToTwip(0.4) },
              children: runs.length ? runs : [new TextRun({ text: p.text, size: 24, font: "Palatino Linotype" })],
            }));
          } else if (p.type === "pullquote") {
            children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 240, after: 240 },
              indent: { left: 720, right: 720 },
              border: { left: { style: BorderStyle.THICK, size: 12, color: aHex, space: 8 } },
              children: [new TextRun({ text: `"${p.text}"`, italics: true, size: 28, color: pHex, font: "Georgia" })],
            }));
          } else if (p.type === "arabic") {
            children.push(new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 120, after: 120 },
              bidirectional: true,
              children: [new TextRun({ text: p.text, size: 32, font: "Traditional Arabic", rtl: true })],
            }));
          } else if (p.type === "footnote") {
            children.push(new Paragraph({
              spacing: { before: 240, after: 60 },
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
              children: [new TextRun({ text: `* ${p.text}`, size: 18, color: "666666", font: "Calibri" })],
            }));
          }
        }
      }

      setStatus("Mengemas file .docx...");
      const fmt = FORMATS[format];
      const doc = new Document({
        numbering: { config: [] },
        sections: [{
          properties: {
            page: {
              size: { width: fmt.w, height: fmt.h },
              margin: { top: 1134, right: 1020, bottom: 1134, left: 1134, header: 708, footer: 708 },
            },
          },
          headers: {
            default: new Header({
              children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: aHex, space: 4 } },
                children: [new TextRun({ text: meta.judul || "Judul Buku", size: 16, color: pHex, italics: true, font: "Calibri" })],
              })],
            }),
          },
          footers: {
            default: new Footer({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: aHex, space: 4 } },
                children: [
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888", font: "Calibri" }),
                ],
              })],
            }),
          },
          children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(meta.judul || "buku").replace(/\s+/g,"_")}_layout.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Berhasil diunduh!");
      setTimeout(() => setStatus(""), 3000);
    } catch(e) {
      console.error(e);
      setStatus("❌ Gagal: " + e.message);
    }
    setGenerating(false);
  };

  const canNext = [true, content.trim().length > 10, meta.judul.trim().length > 0 && meta.penulis.trim().length > 0, true];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ background: t.primary, borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }}>{t.icon}</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Book Layout Studio Pro</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Tata letak buku profesional — mudah untuk semua kalangan</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          {t.palette.map((c,i) => <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.3)" }}/>)}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.25rem" }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 4, background: i <= step ? t.primary : "#e5e7eb", marginBottom: 5 }}/>
            <div style={{ fontSize: 10, color: i === step ? t.primary : "#999", fontWeight: i === step ? 700 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Pilih Tema Buku</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: 10, marginBottom: 20 }}>
            {Object.entries(THEMES).map(([k,v]) => (
              <div key={k} onClick={() => setTheme(k)} style={{ border: theme===k ? `2px solid ${v.primary}` : "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", cursor: "pointer", background: theme===k ? v.bg : "#fff" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{v.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: v.primary }}>{v.label}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{v.desc}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {v.palette.slice(0,4).map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }}/>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Format Halaman</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px,1fr))", gap: 8 }}>
            {Object.entries(FORMATS).map(([k,v]) => (
              <div key={k} onClick={() => setFormat(k)} style={{ border: format===k ? `2px solid ${t.primary}` : "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", cursor: "pointer", background: format===k ? `${t.primary}11` : "#fff" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: format===k ? t.primary : "#1a1a1a" }}>{k}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Upload atau Tempel Konten Buku</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.7 }}>
            Tag struktur: <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}># BAB I</code> · <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>[KUTIPAN]</code> · <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>[ARAB]</code> · <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>[CATATAN]</code>
          </div>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}
            onClick={()=>document.getElementById("fi").click()}
            style={{ border: `2px dashed ${dragOver?t.primary:"#d1d5db"}`, borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", background: dragOver?`${t.primary}08`:"#f9fafb", marginBottom: 14 }}
          >
            <div style={{ fontSize: 30, marginBottom: 6 }}>📂</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.primary }}>{fileName || "Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Format: .txt dan .md</div>
            <input id="fi" type="file" accept=".txt,.md" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginBottom: 8 }}>— atau tempel teks langsung —</div>
          <textarea value={content} onChange={e=>setContent(e.target.value)}
            placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali — hanya tata letak yang disesuaikan."
            style={{ width:"100%", minHeight:200, borderRadius:8, padding:"10px 12px", fontFamily:"inherit", fontSize:13, lineHeight:1.7, resize:"vertical", border:"1px solid #d1d5db", boxSizing:"border-box" }}/>
          <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
            {content.length > 0 ? `${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata` : "Belum ada konten"}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Informasi Buku</div>
          {[
            {key:"judul", label:"Judul Buku *", placeholder:"Masukkan judul buku"},
            {key:"subjudul", label:"Sub-judul", placeholder:"Opsional"},
            {key:"penulis", label:"Nama Penulis *", placeholder:"Nama lengkap penulis"},
            {key:"penerbit", label:"Penerbit", placeholder:"Nama penerbit"},
            {key:"tahun", label:"Tahun Terbit", placeholder:"2026"},
          ].map(({key,label,placeholder}) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 5 }}>{label}</label>
              <input value={meta[key]} onChange={e=>setMeta(m=>({...m,[key]:e.target.value}))} placeholder={placeholder}
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, fontSize:14, border:"1px solid #d1d5db", boxSizing:"border-box" }}/>
            </div>
          ))}
          <div style={{ background:`${t.primary}10`, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:12, fontWeight:600, color:t.primary, marginBottom:5 }}>Pengaturan Aktif</div>
            <div style={{ fontSize:12, color:"#555", lineHeight:1.8 }}>
              Tema: <strong>{t.label}</strong> · Format: <strong>{FORMATS[format].label}</strong><br/>
              Warna: <span style={{color:t.primary}}>■</span> {t.primary} + <span style={{color:t.accent}}>■</span> {t.accent}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Preview Layout</div>
          <div style={{ border:"1px solid #e5e7eb", borderRadius:8, background:t.bg, padding:"24px 28px", maxHeight:400, overflowY:"auto", fontFamily:t.bodyFont, boxShadow:"2px 4px 16px rgba(0,0,0,0.07)" }}>
            <div style={{ borderBottom:`2px solid ${t.accent}`, marginBottom:16, paddingBottom:6, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:t.primary, fontStyle:"italic" }}>{meta.judul || "Judul Buku"}</span>
              <span style={{ fontSize:10, color:t.accent }}>1</span>
            </div>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:20, fontFamily:t.headingFont, fontWeight:700, color:t.primary }}>{meta.judul || "Judul Buku"}</div>
              {meta.subjudul && <div style={{ fontSize:12, color:t.accent, fontStyle:"italic", marginTop:3 }}>{meta.subjudul}</div>}
              <div style={{ height:2, background:`linear-gradient(to right,transparent,${t.accent},transparent)`, margin:"8px auto", width:"60%" }}/>
              <div style={{ fontSize:11, color:t.primary }}>{meta.penulis}</div>
            </div>
            {preview && preview.slice(0,8).map((sec,i) => (
              <div key={i}>
                {sec.type==="heading" && <div style={{ fontFamily:t.headingFont, fontSize:15, fontWeight:700, color:t.primary, margin:"14px 0 6px", paddingLeft:8, borderLeft:`3px solid ${t.accent}` }}>{sec.text}</div>}
                {(sec.paragraphs||[]).slice(0,4).map((p,j) => (
                  <div key={j}>
                    {p.type==="paragraph" && <p style={{ fontSize:12, lineHeight:1.8, textAlign:"justify", textIndent:"2em", margin:"0 0 8px", color:t.text }} dangerouslySetInnerHTML={{__html:italicizeForeign(p.text)}}/>}
                    {p.type==="pullquote" && <div style={{ borderLeft:`3px solid ${t.accent}`, paddingLeft:10, margin:"10px 0", fontStyle:"italic", fontSize:12, color:t.primary }}>{p.text}</div>}
                    {p.type==="arabic" && <div style={{ textAlign:"right", fontSize:15, fontFamily:"Amiri,serif", direction:"rtl", margin:"10px 0", color:t.primary }}>{p.text}</div>}
                    {p.type==="footnote" && <div style={{ fontSize:10, color:"#888", borderTop:`0.5px solid ${t.accent}44`, marginTop:12, paddingTop:4 }}>* {p.text}</div>}
                  </div>
                ))}
              </div>
            ))}
            {!preview && <div style={{ textAlign:"center", color:"#aaa", padding:"20px 0" }}>Preview akan muncul di sini...</div>}
          </div>

          {status && (
            <div style={{ marginTop:12, padding:"10px 14px", background: status.includes("✅") ? "#f0fdf4" : status.includes("❌") ? "#fef2f2" : "#fffbeb", borderRadius:8, fontSize:13, color:"#444", textAlign:"center" }}>
              {status}
            </div>
          )}

          <button onClick={downloadDocx} disabled={generating} style={{
            marginTop:14, width:"100%", padding:14, borderRadius:10,
            background: generating ? "#ccc" : t.primary,
            color:"#fff", fontWeight:700, fontSize:15, border:"none",
            cursor: generating ? "not-allowed" : "pointer", transition:"all 0.2s"
          }}>
            {generating ? status || "Memproses..." : "⬇️ Unduh File .docx"}
          </button>
          <div style={{ fontSize:11, color:"#aaa", textAlign:"center", marginTop:8 }}>
            File .docx siap buka di Microsoft Word, LibreOffice, atau Google Docs
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ display:"flex", gap:10, marginTop:18 }}>
        {step > 0 && (
          <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:10, borderRadius:8, background:"transparent", border:"1px solid #d1d5db", cursor:"pointer", fontSize:14 }}>← Kembali</button>
        )}
        {step < 2 && (
          <button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{ flex:2, padding:10, borderRadius:8, background:canNext[step]?t.primary:"#ccc", color:"#fff", border:"none", cursor:canNext[step]?"pointer":"not-allowed", fontSize:14, fontWeight:600 }}>Lanjut →</button>
        )}
        {step === 2 && (
          <button onClick={generatePreview} disabled={!canNext[2]||generating} style={{ flex:2, padding:10, borderRadius:8, background:canNext[2]?t.primary:"#ccc", color:"#fff", border:"none", cursor:canNext[2]?"pointer":"not-allowed", fontSize:14, fontWeight:600 }}>
            {generating ? "Memproses..." : "Generate Preview →"}
          </button>
        )}
      </div>
    </div>
  );
}
