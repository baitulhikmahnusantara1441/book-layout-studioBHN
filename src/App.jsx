import { useState, useCallback } from "react";

const THEMES = {
  islami:   { label:"Islami / Religi",      desc:"Buku doa, tafsir, fiqh, biografi ulama",       primary:"#1B4F72", accent:"#C9A227", bg:"#F5F0E8", text:"#1a1a1a", icon:"📖", palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"] },
  anak:     { label:"Anak-anak",            desc:"Buku cerita, edukasi anak, komik",              primary:"#E53935", accent:"#FDD835", bg:"#FFFDE7", text:"#1a1a1a", icon:"🎨", palette:["#E53935","#FDD835","#43A047","#1E88E5","#FB8C00"] },
  akademik: { label:"Akademik / Ilmiah",    desc:"Jurnal, skripsi, textbook, penelitian",         primary:"#1A237E", accent:"#1565C0", bg:"#FAFAFA", text:"#111111", icon:"🎓", palette:["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"] },
  memoir:   { label:"Memoir / Sastra",      desc:"Memoar, novel, cerpen, biografi",               primary:"#4E342E", accent:"#A1887F", bg:"#FDF6EE", text:"#1a1a1a", icon:"✍️", palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41","#BCAAA4"] },
  bisnis:   { label:"Bisnis / Profesional", desc:"Manajemen, motivasi, self-help, keuangan",      primary:"#212121", accent:"#D32F2F", bg:"#FFFFFF", text:"#111111", icon:"💼", palette:["#212121","#D32F2F","#424242","#757575","#BDBDBD"] },
  fiksi:    { label:"Fiksi / Novel",        desc:"Novel romance, thriller, fantasi, sci-fi",       primary:"#4A148C", accent:"#7B1FA2", bg:"#F3E5F5", text:"#1a1a1a", icon:"📚", palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"] },
};

const FORMATS = {
  A5:     { w:8391,  h:11906, label:"A5 (14.8×21 cm)"  },
  A4:     { w:11906, h:16838, label:"A4 (21×29.7 cm)"  },
  B5:     { w:9978,  h:14175, label:"B5 (17.6×25 cm)"  },
  Custom: { w:8788,  h:13032, label:"Custom (15.5×23 cm)" },
};

const STEPS = ["Tema & Format","Input Konten","Metadata","Preview & Unduh"];

const COMMON_ID = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","bang","kak","itu","ini"]);

const isForeign = w => /^[a-zA-Z]/.test(w) && !w.toLowerCase().split(/\s+/).every(x => COMMON_ID.has(x) || x.length <= 2);

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export default function App() {
  const [step, setStep]       = useState(0);
  const [theme, setTheme]     = useState("islami");
  const [format, setFormat]   = useState("A5");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [meta, setMeta]       = useState({ judul:"", penulis:"", penerbit:"", tahun:new Date().getFullYear(), subjudul:"" });
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus]   = useState("");

  const t = THEMES[theme];

  const handleFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = e => setContent(e.target.result);
    r.readAsText(file, "UTF-8");
  }, []);

  const onDrop = e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const parseContent = text => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const sections = []; let cur = null, paras = [];
    for (const line of lines) {
      if (/^#+\s/.test(line) || /^(BAB|PASAL|BAGIAN|CHAPTER)\s+[IVX\d]/i.test(line)) {
        if (cur) sections.push({...cur, paragraphs: paras});
        cur = { type:"heading", text: line.replace(/^#+\s*/,"") }; paras = [];
      } else if (/^\[KUTIPAN\]/i.test(line)) paras.push({ type:"pullquote", text: line.replace(/^\[KUTIPAN\]/i,"").trim() });
      else if (/^\[ARAB\]/i.test(line))      paras.push({ type:"arabic",    text: line.replace(/^\[ARAB\]/i,"").trim() });
      else if (/^\[CATATAN\]/i.test(line))   paras.push({ type:"footnote",  text: line.replace(/^\[CATATAN\]/i,"").trim() });
      else paras.push({ type:"paragraph", text: line });
    }
    if (cur) sections.push({...cur, paragraphs: paras});
    else if (paras.length) sections.push({ type:"body", text:"", paragraphs: paras });
    return sections;
  };

  const italicHTML = text => text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g, m => isForeign(m) ? `<em>${m}</em>` : m);

  // ── BUILD DOCX ──────────────────────────────────────────────────────────────
  const buildDocx = async () => {
    // Load JSZip from CDN
    if (!window.JSZip) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    const ph = t.primary.replace("#","");
    const ah = t.accent.replace("#","");
    const fmt = FORMATS[format];
    const sections = parseContent(content);

    // helper: paragraph XML
    const para = (runs, opts = {}) => {
      const pPr = [
        opts.align     ? `<w:jc w:val="${opts.align}"/>` : "",
        opts.before    ? `<w:spacing w:before="${opts.before}" w:after="${opts.after||120}" w:line="${opts.line||240}" w:lineRule="auto"/>` : `<w:spacing w:after="120" w:line="${opts.line||240}" w:lineRule="auto"/>`,
        opts.indent    ? `<w:ind w:firstLine="${opts.indent}"/>` : "",
        opts.indLR     ? `<w:ind w:left="${opts.indLR}" w:right="${opts.indLR}"/>` : "",
        opts.pageBreak ? `<w:pageBreakBefore/>` : "",
        opts.keepNext  ? `<w:keepNext/>` : "",
        opts.keepLines ? `<w:keepLines/>` : "",
        opts.pStyle    ? `<w:pStyle w:val="${opts.pStyle}"/>` : "",
        opts.borderL   ? `<w:pBdr><w:left w:val="single" w:sz="18" w:space="8" w:color="${ah}"/></w:pBdr>` : "",
        opts.borderTop ? `<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/></w:pBdr>` : "",
        opts.rtl       ? `<w:bidi/>` : "",
      ].filter(Boolean).join("");
      return `<w:p><w:pPr>${pPr}</w:pPr>${runs}</w:p>`;
    };

    const run = (text, opts = {}) => {
      const rPr = [
        opts.bold   ? "<w:b/><w:bCs/>" : "",
        opts.italic ? "<w:i/><w:iCs/>" : "",
        opts.size   ? `<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>` : "",
        opts.color  ? `<w:color w:val="${opts.color}"/>` : "",
        opts.font   ? `<w:rFonts w:ascii="${opts.font}" w:hAnsi="${opts.font}" w:cs="${opts.font}"/>` : "",
        opts.rtl    ? "<w:rtl/>" : "",
      ].filter(Boolean).join("");
      return `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
    };

    const runMixed = (text, baseOpts = {}) => {
      const parts = text.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g);
      return parts.filter(Boolean).map(part => {
        const foreign = isForeign(part);
        return run(part, { ...baseOpts, italic: baseOpts.italic || foreign });
      }).join("");
    };

    // ── Build body XML ──
    let body = "";

    // Cover
    body += para(run(meta.judul||"Judul Buku", {bold:true, size:56, color:ph, font:"Georgia"}), {align:"center", before:1440, after:240});
    if (meta.subjudul) body += para(run(meta.subjudul, {italic:true, size:28, color:ah, font:"Georgia"}), {align:"center", before:0, after:200});
    body += para(run(meta.penulis||"", {size:24, color:ph, font:"Calibri"}), {align:"center", before:480, after:120});
    if (meta.penerbit) body += para(run(meta.penerbit, {size:20, color:"777777", font:"Calibri"}), {align:"center", before:60, after:60});
    body += para(run(String(meta.tahun), {size:20, color:"999999", font:"Calibri"}), {align:"center", before:60, after:1440});

    for (const sec of sections) {
      if (sec.type === "heading") {
        body += para(run(sec.text, {bold:true, size:40, color:ph, font:"Georgia"}), {pageBreak:true, before:480, after:240, keepNext:true, borderL:true});
      }
      for (const p of sec.paragraphs || []) {
        if (p.type === "paragraph") {
          body += para(runMixed(p.text, {size:24, font:"Palatino Linotype"}), {align:"both", indent:720, line:360, after:120, keepLines:true});
        } else if (p.type === "pullquote") {
          body += para(run(`"${p.text}"`, {italic:true, size:28, color:ph, font:"Georgia"}), {align:"center", indLR:720, before:240, after:240, keepLines:true, borderL:true});
        } else if (p.type === "arabic") {
          body += para(run(p.text, {size:32, font:"Traditional Arabic", rtl:true}), {align:"right", before:120, after:120, rtl:true, keepLines:true});
        } else if (p.type === "footnote") {
          body += para(run(`* ${p.text}`, {size:18, color:"666666", font:"Calibri"}), {before:240, after:60, borderTop:true});
        }
      }
    }

    // Section properties
    body += `<w:sectPr>
      <w:headerReference w:type="default" r:id="rId3"/>
      <w:footerReference w:type="default" r:id="rId4"/>
      <w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>
      <w:pgMar w:top="1134" w:right="1020" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>`;

    // Header XML
    const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr><w:jc w:val="right"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p>
</w:hdr>`;

    // Footer XML
    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="18"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
      <w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p>
</w:ftr>`;

    // Document XML
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  mc:Ignorable="w14" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
  <w:body>${body}</w:body>
</w:document>`;

    // Relationships
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`;

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

    const pkgRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="Palatino Linotype" w:hAnsi="Palatino Linotype"/>
      <w:sz w:val="24"/><w:szCs w:val="24"/>
    </w:rPr></w:rPrDefault>
  </w:docDefaults>
</w:styles>`;

    const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
</w:settings>`;

    // Pack with JSZip
    const zip = new window.JSZip();
    zip.file("[Content_Types].xml", contentTypes);
    zip.file("_rels/.rels", pkgRels);
    zip.file("word/document.xml", documentXml);
    zip.file("word/styles.xml", stylesXml);
    zip.file("word/settings.xml", settingsXml);
    zip.file("word/header1.xml", headerXml);
    zip.file("word/footer1.xml", footerXml);
    zip.file("word/_rels/document.xml.rels", relsXml);

    const blob = await zip.generateAsync({ type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(meta.judul||"buku").replace(/\s+/g,"_")}_layout.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDocx = async () => {
    setGenerating(true);
    setStatus("Memuat library...");
    try {
      await buildDocx();
      setStatus("✅ File berhasil diunduh!");
    } catch(e) {
      console.error(e);
      setStatus("❌ Gagal: " + e.message);
    }
    setGenerating(false);
    setTimeout(() => setStatus(""), 4000);
  };

  const generatePreview = () => {
    setGenerating(true);
    setTimeout(() => { setPreview(parseContent(content)); setGenerating(false); setStep(3); }, 500);
  };

  const canNext = [true, content.trim().length > 10, meta.judul.trim().length > 0 && meta.penulis.trim().length > 0, true];

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:720, margin:"0 auto", padding:"1rem" }}>

      {/* Header */}
      <div style={{ background:t.primary, borderRadius:12, padding:"1.25rem 1.5rem", marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:28 }}>{t.icon}</span>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Book Layout Studio Pro</div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>Tata letak buku profesional — mudah untuk semua kalangan</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
          {t.palette.map((c,i) => <div key={i} style={{ width:13, height:13, borderRadius:"50%", background:c, border:"1.5px solid rgba(255,255,255,0.3)" }}/>)}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display:"flex", gap:4, marginBottom:"1.25rem" }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <div style={{ height:4, borderRadius:4, background:i<=step?t.primary:"#e5e7eb", marginBottom:5 }}/>
            <div style={{ fontSize:10, color:i===step?t.primary:"#999", fontWeight:i===step?700:400 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 0 */}
      {step===0 && (
        <div>
          <div style={{ fontWeight:600, marginBottom:12 }}>Pilih Tema Buku</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))", gap:10, marginBottom:20 }}>
            {Object.entries(THEMES).map(([k,v]) => (
              <div key={k} onClick={()=>setTheme(k)} style={{ border:theme===k?`2px solid ${v.primary}`:"1px solid #e5e7eb", borderRadius:10, padding:"12px 14px", cursor:"pointer", background:theme===k?v.bg:"#fff" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{v.icon}</div>
                <div style={{ fontSize:13, fontWeight:600, color:v.primary }}>{v.label}</div>
                <div style={{ fontSize:11, color:"#777", marginTop:2 }}>{v.desc}</div>
                <div style={{ display:"flex", gap:4, marginTop:8 }}>
                  {v.palette.slice(0,4).map((c,i)=><div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c }}/>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontWeight:600, marginBottom:10 }}>Format Halaman</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))", gap:8 }}>
            {Object.entries(FORMATS).map(([k,v]) => (
              <div key={k} onClick={()=>setFormat(k)} style={{ border:format===k?`2px solid ${t.primary}`:"1px solid #e5e7eb", borderRadius:8, padding:"10px 14px", cursor:"pointer", background:format===k?`${t.primary}11`:"#fff" }}>
                <div style={{ fontSize:13, fontWeight:600, color:format===k?t.primary:"#1a1a1a" }}>{k}</div>
                <div style={{ fontSize:11, color:"#777" }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step===1 && (
        <div>
          <div style={{ fontWeight:600, marginBottom:8 }}>Upload atau Tempel Konten Buku</div>
          <div style={{ fontSize:12, color:"#666", marginBottom:12, lineHeight:1.7 }}>
            Tag: <code style={{ background:"#f1f5f9", padding:"1px 6px", borderRadius:4 }}># BAB I</code> · <code style={{ background:"#f1f5f9", padding:"1px 6px", borderRadius:4 }}>[KUTIPAN]</code> · <code style={{ background:"#f1f5f9", padding:"1px 6px", borderRadius:4 }}>[ARAB]</code> · <code style={{ background:"#f1f5f9", padding:"1px 6px", borderRadius:4 }}>[CATATAN]</code>
          </div>
          <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop} onClick={()=>document.getElementById("fi").click()}
            style={{ border:`2px dashed ${dragOver?t.primary:"#d1d5db"}`, borderRadius:10, padding:20, textAlign:"center", cursor:"pointer", background:dragOver?`${t.primary}08`:"#f9fafb", marginBottom:14 }}>
            <div style={{ fontSize:30, marginBottom:6 }}>📂</div>
            <div style={{ fontSize:13, fontWeight:500, color:t.primary }}>{fileName||"Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{ fontSize:11, color:"#999", marginTop:4 }}>Format: .txt dan .md</div>
            <input id="fi" type="file" accept=".txt,.md" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          <div style={{ fontSize:12, color:"#aaa", textAlign:"center", marginBottom:8 }}>— atau tempel teks langsung —</div>
          <textarea value={content} onChange={e=>setContent(e.target.value)}
            placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali — hanya tata letak yang disesuaikan."
            style={{ width:"100%", minHeight:200, borderRadius:8, padding:"10px 12px", fontFamily:"inherit", fontSize:13, lineHeight:1.7, resize:"vertical", border:"1px solid #d1d5db", boxSizing:"border-box" }}/>
          <div style={{ fontSize:11, color:"#999", marginTop:4 }}>
            {content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2 && (
        <div>
          <div style={{ fontWeight:600, marginBottom:14 }}>Informasi Buku</div>
          {[{key:"judul",label:"Judul Buku *",placeholder:"Masukkan judul buku"},{key:"subjudul",label:"Sub-judul",placeholder:"Opsional"},{key:"penulis",label:"Nama Penulis *",placeholder:"Nama lengkap penulis"},{key:"penerbit",label:"Penerbit",placeholder:"Nama penerbit"},{key:"tahun",label:"Tahun Terbit",placeholder:"2026"}].map(({key,label,placeholder})=>(
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"#555", display:"block", marginBottom:5 }}>{label}</label>
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
      {step===3 && (
        <div>
          <div style={{ fontWeight:600, marginBottom:12 }}>Preview Layout</div>
          <div style={{ border:"1px solid #e5e7eb", borderRadius:8, background:t.bg, padding:"24px 28px", maxHeight:380, overflowY:"auto", fontFamily:"Georgia,serif", boxShadow:"2px 4px 16px rgba(0,0,0,0.07)" }}>
            <div style={{ borderBottom:`2px solid ${t.accent}`, marginBottom:16, paddingBottom:6, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:t.primary, fontStyle:"italic" }}>{meta.judul||"Judul Buku"}</span>
              <span style={{ fontSize:10, color:t.accent }}>1</span>
            </div>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:20, fontWeight:700, color:t.primary }}>{meta.judul||"Judul Buku"}</div>
              {meta.subjudul&&<div style={{ fontSize:12, color:t.accent, fontStyle:"italic", marginTop:3 }}>{meta.subjudul}</div>}
              <div style={{ height:2, background:`linear-gradient(to right,transparent,${t.accent},transparent)`, margin:"8px auto", width:"60%" }}/>
              <div style={{ fontSize:11, color:t.primary }}>{meta.penulis}</div>
            </div>
            {preview&&preview.slice(0,8).map((sec,i)=>(
              <div key={i}>
                {sec.type==="heading"&&<div style={{ fontSize:15, fontWeight:700, color:t.primary, margin:"14px 0 6px", paddingLeft:8, borderLeft:`3px solid ${t.accent}` }}>{sec.text}</div>}
                {(sec.paragraphs||[]).slice(0,4).map((p,j)=>(
                  <div key={j}>
                    {p.type==="paragraph"&&<p style={{ fontSize:12, lineHeight:1.8, textAlign:"justify", textIndent:"2em", margin:"0 0 8px", color:t.text }} dangerouslySetInnerHTML={{__html:italicHTML(p.text)}}/>}
                    {p.type==="pullquote"&&<div style={{ borderLeft:`3px solid ${t.accent}`, paddingLeft:10, margin:"10px 0", fontStyle:"italic", fontSize:12, color:t.primary }}>{p.text}</div>}
                    {p.type==="arabic"&&<div style={{ textAlign:"right", fontSize:15, direction:"rtl", margin:"10px 0", color:t.primary }}>{p.text}</div>}
                    {p.type==="footnote"&&<div style={{ fontSize:10, color:"#888", borderTop:`0.5px solid ${t.accent}44`, marginTop:12, paddingTop:4 }}>* {p.text}</div>}
                  </div>
                ))}
              </div>
            ))}
            {!preview&&<div style={{ textAlign:"center", color:"#aaa", padding:"20px 0" }}>Preview akan muncul di sini...</div>}
          </div>

          {status&&(
            <div style={{ marginTop:12, padding:"10px 14px", borderRadius:8, fontSize:13, textAlign:"center",
              background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",
              color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#444" }}>
              {status}
            </div>
          )}

          <button onClick={downloadDocx} disabled={generating} style={{
            marginTop:14, width:"100%", padding:14, borderRadius:10,
            background:generating?"#ccc":t.primary, color:"#fff", fontWeight:700, fontSize:15,
            border:"none", cursor:generating?"not-allowed":"pointer" }}>
            {generating ? (status||"Memproses...") : "⬇️ Unduh File .docx"}
          </button>
          <div style={{ fontSize:11, color:"#aaa", textAlign:"center", marginTop:8 }}>Bisa dibuka di Microsoft Word, LibreOffice, Google Docs</div>
        </div>
      )}

      {/* Nav */}
      <div style={{ display:"flex", gap:10, marginTop:18 }}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:10, borderRadius:8, background:"transparent", border:"1px solid #d1d5db", cursor:"pointer", fontSize:14 }}>← Kembali</button>}
        {step<2&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{ flex:2, padding:10, borderRadius:8, background:canNext[step]?t.primary:"#ccc", color:"#fff", border:"none", cursor:canNext[step]?"pointer":"not-allowed", fontSize:14, fontWeight:600 }}>Lanjut →</button>}
        {step===2&&<button onClick={generatePreview} disabled={!canNext[2]||generating} style={{ flex:2, padding:10, borderRadius:8, background:canNext[2]?t.primary:"#ccc", color:"#fff", border:"none", cursor:canNext[2]?"pointer":"not-allowed", fontSize:14, fontWeight:600 }}>{generating?"Memproses...":"Generate Preview →"}</button>}
      </div>
    </div>
  );
}
