import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════
// MEDIA TYPE — perbedaan fundamental ebook vs cetak
// ═══════════════════════════════════════════════
const MEDIA = {
  cetak: {
    label: "Buku Cetak",
    desc: "Dicetak & dijilid — margin asimetris, nomor halaman, header/footer",
    icon: "📗",
    // Margin dalam twips (1440 twip = 1 inch)
    // Cetak: luar 18mm, dalam 20mm (gutter), atas 20mm, bawah 25mm
    margins: {
      islami:   { top:1134, bottom:1418, outer:1020, inner:1134, gutter:360 },
      anak:     { top:1020, bottom:1134, outer:1020, inner:1134, gutter:288 },
      akademik: { top:1440, bottom:1440, outer:1440, inner:1800, gutter:360 },
      memoir:   { top:1134, bottom:1418, outer:1020, inner:1134, gutter:360 },
      bisnis:   { top:1134, bottom:1418, outer:1020, inner:1134, gutter:360 },
      fiksi:    { top:1134, bottom:1418, outer:1020, inner:1134, gutter:360 },
    },
    hasPageNum: true,
    hasHeader: true,
    hasFooter: true,
    fontSizeAdj: 0, // ukuran normal
  },
  ebook: {
    label: "E-Book / Digital",
    desc: "Dibaca di layar — margin tipis, font screen-friendly, tanpa nomor halaman",
    icon: "📱",
    // Ebook: margin sangat tipis (5mm ≈ 284 twip), semua sisi sama
    margins: {
      islami:   { top:568, bottom:568, outer:568, inner:568, gutter:0 },
      anak:     { top:568, bottom:568, outer:568, inner:568, gutter:0 },
      akademik: { top:720, bottom:720, outer:720, inner:720, gutter:0 },
      memoir:   { top:568, bottom:568, outer:568, inner:568, gutter:0 },
      bisnis:   { top:568, bottom:568, outer:568, inner:568, gutter:0 },
      fiksi:    { top:568, bottom:568, outer:568, inner:568, gutter:0 },
    },
    hasPageNum: false, // ebook tidak butuh nomor halaman
    hasHeader: false,
    hasFooter: false,
    fontSizeAdj: 2, // +1pt untuk layar (lebih besar)
  },
};

// ═══════════════════════════════════════════════
// THEMES — DNA layout per kategori buku
// berdasarkan referensi: Reedsy, Liberscript, Designrr, Kotobee, Haqqipublisher
// ═══════════════════════════════════════════════
const THEMES = {
  islami: {
    label:"Islami / Religi", desc:"Tafsir, fiqh, biografi ulama, doa", icon:"📖",
    palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"],
    bg:"#F5F0E8", text:"#1a1a1a",
    // Font: Amiri untuk Arab/Islami, Palatino untuk body — klasik & kuat
    headingFont:"Amiri", headingSize:40, headingBold:true,
    subheadFont:"Amiri", subheadSize:28, subheadColor:"#C9A227",
    bodyFont:"Palatino Linotype", bodySize:24,     // 12pt untuk cetak
    ebookBodyFont:"Georgia",  ebookBodySize:26,    // 13pt untuk layar
    bodyAlign:"both", bodyLine:400, bodyIndent:720, bodyAfter:120,
    ebookBodyLine:440, ebookBodyIndent:0,          // ebook: tanpa indent, spasi lebih lega
    pullquoteFont:"Amiri", pullquoteSize:30,
    arabicFont:"Amiri", arabicSize:36,
    footnoteFont:"Palatino Linotype", footnoteSize:18,
    headingStyle:"islami", footerStyle:"ornamen-tengah", headerStyle:"ornamen-tengah",
    ornamen:"✦", primary:"#1B4F72", accent:"#C9A227",
  },
  anak: {
    label:"Anak-anak", desc:"Cerita anak, dongeng, edukasi, komik", icon:"🎨",
    palette:["#E53935","#FDD835","#43A047","#1E88E5","#FF7043"],
    bg:"#FFFDE7", text:"#1a1a1a",
    // Font: Nunito/Trebuchet — bulat, ramah anak, mudah dibaca
    headingFont:"Trebuchet MS", headingSize:48, headingBold:true,
    subheadFont:"Trebuchet MS", subheadSize:32, subheadColor:"#43A047",
    bodyFont:"Trebuchet MS", bodySize:28,          // 14pt — besar untuk anak
    ebookBodyFont:"Verdana", ebookBodySize:30,     // 15pt layar
    bodyAlign:"left", bodyLine:480, bodyIndent:0, bodyAfter:240,
    ebookBodyLine:520, ebookBodyIndent:0,
    pullquoteFont:"Trebuchet MS", pullquoteSize:32,
    arabicFont:"Amiri", arabicSize:32,
    footnoteFont:"Trebuchet MS", footnoteSize:20,
    headingStyle:"anak", footerStyle:"warna-tengah", headerStyle:"warna-kiri",
    ornamen:"★", primary:"#E53935", accent:"#FDD835",
  },
  akademik: {
    label:"Akademik / Ilmiah", desc:"Skripsi, jurnal, textbook, penelitian", icon:"🎓",
    palette:["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"],
    bg:"#FFFFFF", text:"#111111",
    // Font: Times New Roman — standar akademik universal (APA, Chicago, dll)
    // Untuk ebook: Cambria lebih baik di layar daripada TNR
    headingFont:"Times New Roman", headingSize:32, headingBold:true,
    subheadFont:"Times New Roman", subheadSize:26, subheadColor:"#1565C0",
    bodyFont:"Times New Roman", bodySize:24,       // 12pt — standar akademik
    ebookBodyFont:"Cambria", ebookBodySize:26,     // 13pt Cambria untuk layar
    bodyAlign:"both", bodyLine:360, bodyIndent:0, bodyAfter:120,
    ebookBodyLine:400, ebookBodyIndent:0,
    pullquoteFont:"Times New Roman", pullquoteSize:22,
    arabicFont:"Traditional Arabic", arabicSize:28,
    footnoteFont:"Times New Roman", footnoteSize:18, // 9pt footnote
    headingStyle:"akademik", footerStyle:"angka-tengah", headerStyle:"kiri-kanan",
    ornamen:"", primary:"#1A237E", accent:"#1565C0",
  },
  memoir: {
    label:"Memoir / Sastra", desc:"Memoar, novel, cerpen, biografi", icon:"✍️",
    palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41","#EFEBE9"],
    bg:"#FDF6EE", text:"#2c1a0e",
    // Font: Garamond — klasik, elegan, standar novel sastra
    // Janson/Sabon alternatif — referensi Reedsy & Liberscript
    headingFont:"Garamond", headingSize:38, headingBold:false,
    subheadFont:"Garamond", subheadSize:26, subheadColor:"#A1887F",
    bodyFont:"Garamond", bodySize:24,              // 12pt Garamond
    ebookBodyFont:"Georgia", ebookBodySize:26,     // Georgia lebih baik di layar
    bodyAlign:"both", bodyLine:400, bodyIndent:640, bodyAfter:0,
    ebookBodyLine:440, ebookBodyIndent:0,
    pullquoteFont:"Garamond", pullquoteSize:28,
    arabicFont:"Amiri", arabicSize:32,
    footnoteFont:"Garamond", footnoteSize:18,
    headingStyle:"memoir", footerStyle:"titik-tengah", headerStyle:"italic-tengah",
    ornamen:"❧", primary:"#4E342E", accent:"#A1887F",
  },
  bisnis: {
    label:"Bisnis / Profesional", desc:"Manajemen, self-help, motivasi, keuangan", icon:"💼",
    palette:["#212121","#C62828","#424242","#757575","#F5F5F5"],
    bg:"#FFFFFF", text:"#111111",
    // Font: Arial/Helvetica — bersih, modern, mudah di-scan
    // Untuk ebook: Open Sans lebih optimal di layar digital
    headingFont:"Arial", headingSize:36, headingBold:true,
    subheadFont:"Arial", subheadSize:26, subheadColor:"#C62828",
    bodyFont:"Arial", bodySize:22,                 // 11pt Arial
    ebookBodyFont:"Arial", ebookBodySize:24,       // 12pt untuk layar
    bodyAlign:"both", bodyLine:340, bodyIndent:0, bodyAfter:180,
    ebookBodyLine:380, ebookBodyIndent:0,
    pullquoteFont:"Arial Narrow", pullquoteSize:28,
    arabicFont:"Amiri", arabicSize:28,
    footnoteFont:"Arial", footnoteSize:18,
    headingStyle:"bisnis", footerStyle:"kanan-bold", headerStyle:"garis-bold",
    ornamen:"◆", primary:"#212121", accent:"#C62828",
  },
  fiksi: {
    label:"Fiksi / Novel", desc:"Novel, romance, thriller, fantasi, sci-fi", icon:"📚",
    palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"],
    bg:"#FAF7FF", text:"#1a1a2e",
    // Font: Palatino — elegan, nyaman dibaca panjang
    // Referensi Reedsy: Sabon, Bembo, Caslon untuk novel
    headingFont:"Palatino Linotype", headingSize:40, headingBold:false,
    subheadFont:"Palatino Linotype", subheadSize:26, subheadColor:"#7B1FA2",
    bodyFont:"Palatino Linotype", bodySize:23,     // 11.5pt — standar novel
    ebookBodyFont:"Georgia", ebookBodySize:26,     // Georgia untuk layar
    bodyAlign:"both", bodyLine:380, bodyIndent:680, bodyAfter:0,
    ebookBodyLine:420, ebookBodyIndent:0,
    pullquoteFont:"Palatino Linotype", pullquoteSize:26,
    arabicFont:"Amiri", arabicSize:30,
    footnoteFont:"Palatino Linotype", footnoteSize:18,
    headingStyle:"fiksi", footerStyle:"titik-tengah", headerStyle:"italic-tengah",
    ornamen:"✦", primary:"#4A148C", accent:"#7B1FA2",
  },
};

const FORMATS = {
  A5:     { w:8391,  h:11906, label:"A5 (14.8×21 cm)" },
  A4:     { w:11906, h:16838, label:"A4 (21×29.7 cm)" },
  B5:     { w:9978,  h:14175, label:"B5 (17.6×25 cm)" },
  "Custom":{ w:8788, h:13032, label:"Custom (15.5×23 cm)" },
};

// Format khusus ebook — ukuran layar tablet/phone
const EBOOK_FORMATS = {
  "Tablet 7\"": { w:5760, h:8640,  label:'Tablet 7" (10.2×15.2 cm)' },
  "Tablet 10\"":{ w:7920, h:11520, label:'Tablet 10" (14×20.3 cm)' },
  "Kindle":     { w:7272, h:9792,  label:"Kindle (12.8×17.3 cm)" },
  "A4 Screen":  { w:11906, h:16838, label:"A4 Layar (21×29.7 cm)" },
};

const STEPS = ["Media & Tema", "Format & Konten", "Metadata", "Preview & Unduh"];

const COMMON_ID = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","bang","kak","lagi","pula","sedang","sambil","selama","hingga","sampai","bahkan","hanya","saja","juga","memang","tentu","malah","justru","tapi","kalau","walau","meski","agar","supaya","demi","lewat","sesuai","setiap"]);
const isForeign = w => /^[a-zA-Z]/.test(w) && !w.toLowerCase().split(/\s+/).every(x => COMMON_ID.has(x) || x.length <= 2);
const esc = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export default function App() {
  const [step,   setStep]   = useState(0);
  const [media,  setMedia]  = useState("cetak");
  const [theme,  setTheme]  = useState("islami");
  const [format, setFormat] = useState("A5");
  const [content,setContent]= useState("");
  const [fileName,setFileName]=useState("");
  const [meta,   setMeta]   = useState({judul:"",penulis:"",penerbit:"",tahun:new Date().getFullYear(),subjudul:""});
  const [generating,setGenerating]=useState(false);
  const [preview,setPreview]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const [status, setStatus] = useState("");

  const M  = MEDIA[media];
  const TH = THEMES[theme];
  const ph = TH.primary.replace("#","");
  const ah = TH.accent.replace("#","");
  const isEbook = media === "ebook";

  // Font & ukuran aktif sesuai media
  const activeBodyFont = isEbook ? TH.ebookBodyFont : TH.bodyFont;
  const activeBodySize = isEbook ? (TH.ebookBodySize + M.fontSizeAdj) : (TH.bodySize + M.fontSizeAdj);
  const activeBodyLine = isEbook ? TH.ebookBodyLine : TH.bodyLine;
  const activeIndent   = isEbook ? TH.ebookBodyIndent : TH.bodyIndent;

  const handleFile = useCallback((file)=>{
    if(!file) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = e => setContent(e.target.result);
    r.readAsText(file,"UTF-8");
  },[]);

  const onDrop = e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const parseContent = text => {
    const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
    const sections=[]; let cur=null, paras=[];
    for(const line of lines){
      if(/^#+\s/.test(line)||/^(BAB|PASAL|BAGIAN|CHAPTER)\s+[IVX\d]/i.test(line)){
        if(cur) sections.push({...cur,paragraphs:paras});
        cur={type:"heading",text:line.replace(/^#+\s*/,"")}; paras=[];
      } else if(/^\[KUTIPAN\]/i.test(line)) paras.push({type:"pullquote",text:line.replace(/^\[KUTIPAN\]/i,"").trim()});
      else if(/^\[ARAB\]/i.test(line))      paras.push({type:"arabic",   text:line.replace(/^\[ARAB\]/i,"").trim()});
      else if(/^\[CATATAN\]/i.test(line))   paras.push({type:"footnote", text:line.replace(/^\[CATATAN\]/i,"").trim()});
      else paras.push({type:"paragraph",text:line});
    }
    if(cur) sections.push({...cur,paragraphs:paras});
    else if(paras.length) sections.push({type:"body",text:"",paragraphs:paras});
    return sections;
  };

  const italicHTML = text => text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g, m=>isForeign(m)?`<em>${m}</em>`:m);

  // ════════════════════════════════════════════════
  // BUILD DOCX
  // ════════════════════════════════════════════════
  const buildDocx = async () => {
    if(!window.JSZip){
      await new Promise((res,rej)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=res; s.onerror=rej;
        document.head.appendChild(s);
      });
    }

    const sections = parseContent(content);
    const fmt = isEbook ? EBOOK_FORMATS[format] || EBOOK_FORMATS["Tablet 10\""] : FORMATS[format] || FORMATS["A5"];
    const mg  = M.margins[theme];

    // Twip helpers
    const run=(text,opts={})=>{
      const rPr=[
        opts.bold?"<w:b/><w:bCs/>":"",
        opts.italic?"<w:i/><w:iCs/>":"",
        opts.size?`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>` :"",
        opts.color?`<w:color w:val="${opts.color}"/>`:"",
        opts.font?`<w:rFonts w:ascii="${opts.font}" w:hAnsi="${opts.font}" w:cs="${opts.font}"/>`:"",
        opts.rtl?"<w:rtl/>":"",
        opts.spacing?`<w:spacing w:val="${opts.spacing}"/>`:"",
        opts.underline?`<w:u w:val="single"/>`:"",
      ].filter(Boolean).join("");
      return `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
    };

    const runMixed=(text,opts={})=>
      text.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g).filter(Boolean)
        .map(part=>run(part,{...opts,italic:opts.italic||isForeign(part)})).join("");

    const para=(runs,opts={})=>{
      const pPr=[
        opts.pStyle?`<w:pStyle w:val="${opts.pStyle}"/>`:"",
        opts.align?`<w:jc w:val="${opts.align}"/>`:"",
        (opts.before!==undefined||opts.after!==undefined||opts.line)?
          `<w:spacing w:before="${opts.before||0}" w:after="${opts.after||0}" w:line="${opts.line||240}" w:lineRule="auto"/>`:
          `<w:spacing w:after="0" w:line="240" w:lineRule="auto"/>`,
        opts.indent?`<w:ind w:firstLine="${opts.indent}"/>`:"",
        opts.indL?`<w:ind w:left="${opts.indL}"/>`:"",
        opts.indLR?`<w:ind w:left="${opts.indLR}" w:right="${opts.indLR}"/>`:"",
        opts.pageBreak?"<w:pageBreakBefore/>":"",
        opts.keepNext?"<w:keepNext/>":"",
        opts.keepLines?"<w:keepLines/>":"",
        opts.rtl?"<w:bidi/>":"",
        opts.shading?`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shading}"/>`:"",
        // borders
        opts.borderL||opts.borderTop||opts.borderFull?`<w:pBdr>${
          opts.borderL?`<w:left w:val="single" w:sz="${opts.borderLSz||12}" w:space="8" w:color="${ah}"/>`:""}${
          opts.borderFull?`<w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/>`:""}${
          opts.borderTop?`<w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/>`:""}
        </w:pBdr>`:"",
      ].filter(Boolean).join("");
      return `<w:p><w:pPr>${pPr}</w:pPr>${runs}</w:p>`;
    };

    let body = "";

    // ── COVER — per tema & media ─────────────────────
    const coverHeadSz = isEbook ? TH.headingSize + 4 : TH.headingSize;

    if(theme==="islami"){
      if(!isEbook) body+=para(run("بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",{size:28,font:"Amiri",color:ah,rtl:true}),{align:"center",before:720,after:240,rtl:true});
      body+=para(run(meta.judul||"Judul Buku",{bold:true,size:coverHeadSz,color:ph,font:"Amiri"}),{align:"center",before:isEbook?480:240,after:160,keepNext:true});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:28,color:ah,font:"Amiri"}),{align:"center",after:240});
      body+=para(run(`── ${TH.ornamen} ──`,{size:22,color:ah}),{align:"center",before:120,after:320});
      body+=para(run(meta.penulis||"",{size:24,color:ph,font:"Amiri"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:20,color:"777777",font:"Palatino Linotype"}),{align:"center",after:60});
      body+=para(run(String(meta.tahun),{size:18,color:"999999"}),{align:"center",after:1200});
    } else if(theme==="anak"){
      body+=para(run(meta.judul||"Judul Buku",{bold:true,size:coverHeadSz+8,color:ph,font:"Trebuchet MS"}),{align:"center",before:720,after:240,shading:TH.bg.replace("#","")});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:36,color:"438a47",font:"Trebuchet MS"}),{align:"center",after:360});
      body+=para(run("★  ★  ★",{size:36,color:ah}),{align:"center",before:120,after:360});
      body+=para(run(meta.penulis||"",{bold:true,size:30,color:ph,font:"Trebuchet MS"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:24,color:"777777"}),{align:"center",after:1200});
    } else if(theme==="akademik"){
      body+=para(run((meta.penerbit||"UNIVERSITAS / LEMBAGA").toUpperCase(),{size:22,color:"555555",font:"Times New Roman"}),{align:"center",before:720,after:480});
      body+=para(run("",{size:4}),{borderFull:true,after:720});
      body+=para(run(meta.judul||"JUDUL PENELITIAN",{bold:true,size:coverHeadSz,color:ph,font:"Times New Roman"}),{align:"center",before:360,after:200});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:24,color:"444444",font:"Times New Roman"}),{align:"center",after:720});
      body+=para(run("Oleh:",{size:22,color:"555555",font:"Times New Roman"}),{align:"center",before:360,after:120});
      body+=para(run(meta.penulis||"",{bold:true,size:24,color:ph,font:"Times New Roman"}),{align:"center",after:720});
      body+=para(run(String(meta.tahun),{size:22,color:"555555"}),{align:"center",after:1200});
    } else if(theme==="memoir"){
      body+=para(run(meta.judul||"Judul Buku",{size:coverHeadSz,color:ph,font:"Garamond"}),{align:"center",before:1200,after:80,keepNext:true});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:24,color:ah,font:"Garamond"}),{align:"center",after:480});
      body+=para(run("❧",{size:48,color:ah,font:"Garamond"}),{align:"center",before:80,after:480});
      body+=para(run(meta.penulis||"",{size:22,color:ph,font:"Garamond"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:18,color:"888888",font:"Garamond"}),{align:"center",after:60});
      body+=para(run(String(meta.tahun),{size:18,color:"aaaaaa",font:"Garamond"}),{align:"center",after:1200});
    } else if(theme==="bisnis"){
      body+=para(run(meta.judul||"JUDUL BUKU",{bold:true,size:coverHeadSz+4,color:ph,font:"Arial"}),{align:"left",before:720,after:120});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:24,color:ah,font:"Arial"}),{align:"left",after:480});
      body+=para(run("",{size:4}),{borderFull:true,after:480});
      body+=para(run(meta.penulis||"",{bold:true,size:24,color:ph,font:"Arial"}),{align:"left",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:20,color:"666666",font:"Arial"}),{align:"left",after:1200});
    } else { // fiksi
      body+=para(run(meta.judul||"Judul Buku",{size:coverHeadSz+4,color:ph,font:"Palatino Linotype"}),{align:"center",before:960,after:80,keepNext:true});
      body+=para(run("✦",{size:28,color:ah}),{align:"center",after:80});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:22,color:ah,font:"Palatino Linotype"}),{align:"center",after:600});
      body+=para(run(meta.penulis||"",{italic:true,size:20,color:"555555",font:"Palatino Linotype"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:18,color:"888888"}),{align:"center",after:1200});
    }

    // ── KONTEN per tema ──────────────────────────────
    for(const sec of sections){
      if(sec.type==="heading"){
        if(theme==="islami"){
          if(!isEbook) body+=para(run("",{size:4}),{borderFull:true,after:0});
          body+=para(run(sec.text,{bold:true,size:TH.headingSize,color:ph,font:"Amiri"}),
            {align:"center",pageBreak:!isEbook,before:isEbook?480:320,after:80,keepNext:true,shading:"F5F0E8"});
          body+=para(run(`── ${TH.ornamen} ──`,{size:18,color:ah}),{align:"center",before:0,after:320,keepNext:true});
        } else if(theme==="anak"){
          body+=para(run(`${TH.ornamen} ${sec.text} ${TH.ornamen}`,{bold:true,size:TH.headingSize,color:ph,font:"Trebuchet MS"}),
            {align:"center",pageBreak:!isEbook,before:isEbook?480:320,after:240,keepNext:true,shading:TH.bg.replace("#","")});
        } else if(theme==="akademik"){
          body+=para(run(sec.text.toUpperCase(),{bold:true,size:TH.headingSize,color:ph,font:"Times New Roman"}),
            {align:"center",pageBreak:!isEbook,before:isEbook?480:480,after:480,keepNext:true});
          body+=para(run("",{size:4}),{borderFull:true,before:0,after:480,keepNext:true});
        } else if(theme==="memoir"){
          body+=para(run(sec.text,{size:TH.headingSize,color:ph,font:"Garamond"}),
            {align:"center",pageBreak:!isEbook,before:isEbook?480:960,after:80,keepNext:true});
          body+=para(run("❧",{size:28,color:ah,font:"Garamond"}),{align:"center",before:0,after:480,keepNext:true});
        } else if(theme==="bisnis"){
          body+=para(run(sec.text,{bold:true,size:TH.headingSize,color:ph,font:"Arial"}),
            {align:"left",pageBreak:!isEbook,before:isEbook?480:360,after:0,keepNext:true,borderL:true,borderLSz:24});
          body+=para(run("",{size:4}),{borderTop:true,before:0,after:240,keepNext:true});
        } else { // fiksi
          body+=para(run(sec.text,{size:TH.headingSize,color:ph,font:"Palatino Linotype"}),
            {align:"center",pageBreak:!isEbook,before:isEbook?480:960,after:80,keepNext:true});
          body+=para(run("✦  ✦  ✦",{size:20,color:ah}),{align:"center",before:0,after:480,keepNext:true});
        }
      }

      for(const p of sec.paragraphs||[]){
        if(p.type==="paragraph"){
          body+=para(
            runMixed(p.text,{size:activeBodySize,font:activeBodyFont}),
            {align:TH.bodyAlign,indent:activeIndent,line:activeBodyLine,after:TH.bodyAfter,keepLines:true}
          );

        } else if(p.type==="pullquote"){
          if(theme==="islami"){
            body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ph,font:"Amiri"}),
              {align:"center",indLR:720,before:320,after:320,keepLines:true,borderL:true,borderLSz:18});
          } else if(theme==="anak"){
            body+=para(run(`"${p.text}"`,{bold:true,size:TH.pullquoteSize,color:ph,font:"Trebuchet MS"}),
              {align:"center",before:200,after:200,keepLines:true,shading:TH.bg.replace("#",""),borderFull:true});
          } else if(theme==="akademik"){
            body+=para(run(p.text,{italic:true,size:TH.pullquoteSize,color:"444444",font:"Times New Roman"}),
              {align:"both",indLR:1440,before:200,after:200,keepLines:true,borderL:true,borderLSz:6});
          } else if(theme==="memoir"){
            body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ph,font:"Garamond"}),
              {align:"center",before:320,after:320,keepLines:true});
          } else if(theme==="bisnis"){
            body+=para(run(`"${p.text}"`,{bold:true,size:TH.pullquoteSize,color:ph,font:"Arial Narrow"}),
              {align:"left",indLR:720,before:200,after:200,keepLines:true,shading:"F5F5F5",borderL:true,borderLSz:20});
          } else {
            body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ah,font:"Palatino Linotype"}),
              {align:"center",before:320,after:320,keepLines:true});
          }

        } else if(p.type==="arabic"){
          body+=para(run(p.text,{size:TH.arabicSize,font:TH.arabicFont,rtl:true}),
            {align:"right",before:200,after:200,rtl:true,keepLines:true});

        } else if(p.type==="footnote"){
          // Ebook: footnote jadi catatan di akhir paragraf
          body+=para(run(`* ${p.text}`,{size:TH.footnoteSize,color:"666666",font:TH.footnoteFont}),
            {before:200,after:60,borderTop:true});
        }
      }
    }

    // ── SECTION PROPS ───────────────────────────────
    const headerRef = M.hasHeader ? `<w:headerReference w:type="default" r:id="rId3"/>` : "";
    const footerRef = M.hasFooter ? `<w:footerReference w:type="default" r:id="rId4"/>` : "";

    // Margin: cetak pakai inner/outer berbeda, ebook pakai seragam
    const marginXml = isEbook
      ? `<w:pgMar w:top="${mg.top}" w:right="${mg.outer}" w:bottom="${mg.bottom}" w:left="${mg.inner}" w:header="0" w:footer="0" w:gutter="0"/>`
      : `<w:pgMar w:top="${mg.top}" w:right="${mg.outer}" w:bottom="${mg.bottom}" w:left="${mg.inner}" w:header="568" w:footer="568" w:gutter="${mg.gutter}"/>`;

    body += `<w:sectPr>${headerRef}${footerRef}
      <w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>
      ${marginXml}
    </w:sectPr>`;

    // ── HEADER XML ──────────────────────────────────
    let headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:hdr>`;
    if(M.hasHeader){
      if(TH.headerStyle==="ornamen-tengah"){
        headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r>
  </w:p></w:hdr>`;
      } else if(TH.headerStyle==="warna-kiri"){
        headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="double" w:sz="6" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="22"/><w:rFonts w:ascii="Trebuchet MS" w:hAnsi="Trebuchet MS"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p></w:hdr>`;
      } else if(TH.headerStyle==="kiri-kanan"){
        headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/></w:pBdr>
    <w:tabs><w:tab w:val="right" w:pos="${fmt.w - mg.inner - mg.outer}"/></w:tabs></w:pPr>
    <w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:tab/></w:r>
    <w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="16"/></w:rPr>
      <w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p></w:hdr>`;
      } else if(TH.headerStyle==="italic-tengah"){
        headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${TH.bodyFont}" w:hAnsi="${TH.bodyFont}"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p></w:hdr>`;
      } else if(TH.headerStyle==="garis-bold"){
        headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r>
    <w:r><w:rPr><w:color w:val="AAAAAA"/><w:sz w:val="17"/></w:rPr><w:t xml:space="preserve">  |  ${esc(meta.judul||"Judul")}</w:t></w:r>
  </w:p></w:hdr>`;
      }
    }

    // ── FOOTER XML ──────────────────────────────────
    const pgNum = `<w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    let footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:ftr>`;
    if(M.hasFooter){
      if(TH.footerStyle==="ornamen-tengah"){
        footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r>${pgNum}
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r>
  </w:p></w:ftr>`;
      } else if(TH.footerStyle==="warna-tengah"){
        footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="24"/><w:rFonts w:ascii="Trebuchet MS" w:hAnsi="Trebuchet MS"/></w:rPr>
      <w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p></w:ftr>`;
      } else if(TH.footerStyle==="angka-tengah"){
        footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    ${pgNum}
  </w:p></w:ftr>`;
      } else if(TH.footerStyle==="titik-tengah"){
        footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">— </w:t></w:r>${pgNum}
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve"> —</w:t></w:r>
  </w:p></w:ftr>`;
      } else if(TH.footerStyle==="kanan-bold"){
        footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:top w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>
    <w:tabs><w:tab w:val="right" w:pos="${fmt.w - mg.inner - mg.outer}"/></w:tabs></w:pPr>
    <w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="17"/><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:tab/></w:r>${pgNum}
  </w:p></w:ftr>`;
      }
    }

    // ── PACK ────────────────────────────────────────
    const hasHF = M.hasHeader || M.hasFooter;
    const relsXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  ${M.hasHeader?`<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>`:""}
  ${M.hasFooter?`<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>`:""}
</Relationships>`;

    const overrides = [
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`,
      `<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>`,
      M.hasHeader?`<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>`:"",
      M.hasFooter?`<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`:"",
    ].filter(Boolean).join("\n  ");

    const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${overrides}
</Types>`;

    const pkgRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:body>${body}</w:body></w:document>`;

    const stylesXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr>
    <w:rFonts w:ascii="${activeBodyFont}" w:hAnsi="${activeBodyFont}"/>
    <w:sz w:val="${activeBodySize}"/><w:szCs w:val="${activeBodySize}"/>
  </w:rPr></w:rPrDefault></w:docDefaults>
</w:styles>`;

    const settingsXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>
</w:settings>`;

    const zip = new window.JSZip();
    zip.file("[Content_Types].xml", contentTypes);
    zip.file("_rels/.rels", pkgRels);
    zip.file("word/document.xml", documentXml);
    zip.file("word/styles.xml", stylesXml);
    zip.file("word/settings.xml", settingsXml);
    zip.file("word/_rels/document.xml.rels", relsXml);
    if(M.hasHeader) zip.file("word/header1.xml", headerXml);
    if(M.hasFooter) zip.file("word/footer1.xml", footerXml);

    const blob = await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`${(meta.judul||"buku").replace(/\s+/g,"_")}_${theme}_${media}.docx`;
    a.click(); URL.revokeObjectURL(url);
  };

  const downloadDocx = async () => {
    setGenerating(true); setStatus("Memuat library...");
    try{ await buildDocx(); setStatus("✅ File berhasil diunduh!"); }
    catch(e){ console.error(e); setStatus("❌ Gagal: "+e.message); }
    setGenerating(false); setTimeout(()=>setStatus(""),4000);
  };

  const generatePreview = () => {
    setGenerating(true);
    setTimeout(()=>{ setPreview(parseContent(content)); setGenerating(false); setStep(3); }, 400);
  };

  const canNext = [true, content.trim().length>10, meta.judul.trim().length>0 && meta.penulis.trim().length>0, true];
  const fmtOptions = isEbook ? EBOOK_FORMATS : FORMATS;

  // ── RENDER ──────────────────────────────────────
  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:740,margin:"0 auto",padding:"1rem"}}>

      {/* Header */}
      <div style={{background:TH.primary,borderRadius:12,padding:"1rem 1.5rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:26}}>{TH.icon}</span>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:17}}>Book Layout Studio Pro</div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:11}}>Layout profesional — Cetak & Digital, distinktif per kategori</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          {TH.palette.map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:c,border:"1.5px solid rgba(255,255,255,0.3)"}}/>)}
        </div>
      </div>

      {/* Steps */}
      <div style={{display:"flex",gap:3,marginBottom:"1rem"}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{height:3,borderRadius:4,background:i<=step?TH.primary:"#e5e7eb",marginBottom:4}}/>
            <div style={{fontSize:10,color:i===step?TH.primary:"#aaa",fontWeight:i===step?700:400}}>{s}</div>
          </div>
        ))}
      </div>

      {/* ── STEP 0: Media & Tema ── */}
      {step===0&&(
        <div>
          {/* Media selector */}
          <div style={{fontWeight:700,fontSize:14,marginBottom:10,color:"#333"}}>Jenis Publikasi</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
            {Object.entries(MEDIA).map(([k,v])=>(
              <div key={k} onClick={()=>setMedia(k)} style={{
                border:media===k?`2px solid ${TH.primary}`:"1px solid #e5e7eb",
                borderRadius:10,padding:"14px 16px",cursor:"pointer",
                background:media===k?`${TH.primary}0f`:"#fff",transition:"all 0.18s"
              }}>
                <div style={{fontSize:22,marginBottom:6}}>{v.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:media===k?TH.primary:"#1a1a1a"}}>{v.label}</div>
                <div style={{fontSize:11,color:"#777",marginTop:3,lineHeight:1.5}}>{v.desc}</div>
                {media===k&&(
                  <div style={{marginTop:8,fontSize:10,color:TH.primary,fontWeight:600}}>
                    {k==="cetak"
                      ?"✓ Margin asimetris · header/footer · nomor halaman"
                      :"✓ Margin tipis · font layar · tanpa nomor halaman"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Theme selector */}
          <div style={{fontWeight:700,fontSize:14,marginBottom:10,color:"#333"}}>Kategori Buku</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:9,marginBottom:4}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <div key={k} onClick={()=>setTheme(k)} style={{
                border:theme===k?`2px solid ${v.primary}`:"1px solid #e5e7eb",
                borderRadius:10,padding:"11px 13px",cursor:"pointer",
                background:theme===k?v.bg:"#fff",transition:"all 0.18s"
              }}>
                <div style={{fontSize:20,marginBottom:3}}>{v.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:v.primary}}>{v.label}</div>
                <div style={{fontSize:10,color:"#888",marginTop:2,lineHeight:1.4}}>{v.desc}</div>
                <div style={{display:"flex",gap:3,marginTop:7}}>
                  {v.palette.slice(0,4).map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                </div>
                {theme===k&&(
                  <div style={{fontSize:9,color:v.primary,marginTop:6,fontWeight:600,lineHeight:1.4}}>
                    {k==="islami"   ?"Amiri + Palatino · 12pt"
                    :k==="anak"    ?"Trebuchet · 14pt · spasi lega"
                    :k==="akademik"?"Times New Roman · 12pt · standar APA"
                    :k==="memoir"  ?"Garamond · 12pt · klasik novel"
                    :k==="bisnis"  ?"Arial · 11pt · kompak modern"
                                   :"Palatino · 11.5pt · elegan"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Format & Konten ── */}
      {step===1&&(
        <div>
          {/* Format */}
          <div style={{fontWeight:700,fontSize:14,marginBottom:8,color:"#333"}}>
            Ukuran {isEbook?"Layar":"Halaman"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:18}}>
            {Object.entries(fmtOptions).map(([k,v])=>(
              <div key={k} onClick={()=>setFormat(k)} style={{
                border:format===k?`2px solid ${TH.primary}`:"1px solid #e5e7eb",
                borderRadius:8,padding:"9px 13px",cursor:"pointer",
                background:format===k?`${TH.primary}11`:"#fff"
              }}>
                <div style={{fontSize:12,fontWeight:700,color:format===k?TH.primary:"#1a1a1a"}}>{k}</div>
                <div style={{fontSize:10,color:"#888"}}>{v.label}</div>
              </div>
            ))}
          </div>

          {/* Konten */}
          <div style={{fontWeight:700,fontSize:14,marginBottom:7,color:"#333"}}>Upload atau Tempel Konten</div>
          <div style={{fontSize:11,color:"#666",marginBottom:11,lineHeight:1.7}}>
            Tag struktur: <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}># BAB I</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[KUTIPAN]</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[ARAB]</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[CATATAN]</code>
          </div>
          <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop}
            onClick={()=>document.getElementById("fi").click()} style={{
              border:`2px dashed ${dragOver?TH.primary:"#d1d5db"}`,borderRadius:10,padding:18,
              textAlign:"center",cursor:"pointer",background:dragOver?`${TH.primary}08`:"#f9fafb",marginBottom:12}}>
            <div style={{fontSize:28,marginBottom:5}}>📂</div>
            <div style={{fontSize:12,fontWeight:600,color:TH.primary}}>{fileName||"Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{fontSize:10,color:"#aaa",marginTop:3}}>Mendukung .txt dan .md</div>
            <input id="fi" type="file" accept=".txt,.md" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          <div style={{fontSize:11,color:"#bbb",textAlign:"center",marginBottom:8}}>— atau tempel teks langsung —</div>
          <textarea value={content} onChange={e=>setContent(e.target.value)}
            placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali — hanya tata letak, font, dan margin yang disesuaikan."
            style={{width:"100%",minHeight:190,borderRadius:8,padding:"10px 12px",fontFamily:"inherit",fontSize:13,lineHeight:1.7,resize:"vertical",border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
          <div style={{fontSize:10,color:"#bbb",marginTop:4}}>
            {content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}
          </div>
        </div>
      )}

      {/* ── STEP 2: Metadata ── */}
      {step===2&&(
        <div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14,color:"#333"}}>Informasi Buku</div>
          {[{key:"judul",label:"Judul Buku *",ph:"Masukkan judul buku"},{key:"subjudul",label:"Sub-judul",ph:"Opsional"},{key:"penulis",label:"Nama Penulis *",ph:"Nama lengkap penulis"},{key:"penerbit",label:"Penerbit",ph:"Nama penerbit"},{key:"tahun",label:"Tahun Terbit",ph:"2026"}].map(({key,label,ph:p})=>(
            <div key={key} style={{marginBottom:13}}>
              <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>{label}</label>
              <input value={meta[key]} onChange={e=>setMeta(m=>({...m,[key]:e.target.value}))} placeholder={p}
                style={{width:"100%",padding:"9px 12px",borderRadius:8,fontSize:13,border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
            </div>
          ))}

          {/* Layout DNA summary */}
          <div style={{background:`${TH.primary}0d`,borderRadius:10,padding:"12px 15px",marginTop:4,border:`1px solid ${TH.primary}22`}}>
            <div style={{fontSize:12,fontWeight:700,color:TH.primary,marginBottom:8}}>Layout DNA Aktif</div>
            <div style={{fontSize:11,color:"#555",lineHeight:2.1}}>
              <span style={{background:isEbook?"#dbeafe":"#f0fdf4",color:isEbook?"#1e40af":"#166534",borderRadius:4,padding:"1px 7px",fontWeight:700,fontSize:10,marginRight:8}}>{M.label}</span>
              <span style={{background:`${TH.primary}15`,color:TH.primary,borderRadius:4,padding:"1px 7px",fontWeight:700,fontSize:10}}>{TH.label}</span>
              <br/>
              📐 Format: <strong>{fmtOptions[format]?.label||format}</strong><br/>
              🔤 Body font: <em>{activeBodyFont}</em> · {activeBodySize/2}pt · spasi {(activeBodyLine/240).toFixed(1)}×{activeIndent>0?` · indent ${(activeIndent/1440).toFixed(2)}"`:""}<br/>
              📏 Margin: {isEbook?`seragam ${(M.margins[theme].top/1440*25.4).toFixed(0)}mm`:`dalam ${(M.margins[theme].inner/1440*25.4).toFixed(0)}mm · luar ${(M.margins[theme].outer/1440*25.4).toFixed(0)}mm`}<br/>
              📄 Header/Footer: {M.hasHeader?"✓":"✗"} / {M.hasFooter?"✓":"✗"} · Nomor halaman: {M.hasPageNum?"✓ ada":"✗ tidak ada (ebook)"}<br/>
              🎨 <span style={{color:TH.primary}}>■</span> {TH.primary} + <span style={{color:TH.accent}}>■</span> {TH.accent}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview & Unduh ── */}
      {step===3&&(
        <div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:10,color:"#333"}}>
            Preview — <span style={{color:TH.primary}}>{TH.label}</span>
            <span style={{fontSize:11,color:isEbook?"#1e40af":"#166534",background:isEbook?"#dbeafe":"#f0fdf4",borderRadius:4,padding:"2px 8px",marginLeft:8,fontWeight:700}}>{M.label}</span>
          </div>

          {/* Preview page */}
          <div style={{
            border:"1px solid #e5e7eb",borderRadius:8,background:TH.bg,
            padding:isEbook?"16px 18px":"24px 28px",maxHeight:400,overflowY:"auto",
            fontFamily:activeBodyFont,boxShadow:"2px 4px 16px rgba(0,0,0,0.07)"
          }}>
            {/* Header mock — only cetak */}
            {!isEbook&&(
              <div style={{borderBottom:`2px solid ${TH.accent}`,marginBottom:14,paddingBottom:5,display:"flex",justifyContent:TH.headerStyle==="kiri-kanan"||TH.headerStyle==="garis-bold"?"space-between":"center",fontSize:9,color:TH.primary}}>
                {TH.headerStyle==="ornamen-tengah"&&<span style={{fontStyle:"italic"}}>{TH.ornamen} {meta.judul||"Judul Buku"} {TH.ornamen}</span>}
                {TH.headerStyle==="warna-kiri"&&<span style={{fontWeight:700}}>{meta.judul||"Judul Buku"}</span>}
                {TH.headerStyle==="kiri-kanan"&&<><span>{meta.judul||"Judul"}</span><span style={{color:"#aaa"}}>1</span></>}
                {TH.headerStyle==="italic-tengah"&&<span style={{fontStyle:"italic"}}>{meta.judul||"Judul Buku"}</span>}
                {TH.headerStyle==="garis-bold"&&<><span style={{fontWeight:700}}>{meta.penulis||""}</span><span style={{color:"#aaa"}}> | {meta.judul||"Judul"}</span></>}
              </div>
            )}

            {/* Cover mini */}
            <div style={{textAlign:theme==="bisnis"?"left":"center",marginBottom:16}}>
              <div style={{fontFamily:TH.headingFont,fontWeight:TH.headingBold?700:400,fontSize:isEbook?17:15,color:TH.primary,lineHeight:1.3}}>
                {theme==="anak"?`★ ${meta.judul||"Judul Buku"} ★`:meta.judul||"Judul Buku"}
              </div>
              {meta.subjudul&&<div style={{fontSize:10,color:TH.accent,fontStyle:"italic",marginTop:2}}>{meta.subjudul}</div>}
              <div style={{height:1,background:`linear-gradient(to right,transparent,${TH.accent},transparent)`,margin:"7px auto",width:theme==="bisnis"?"40%":"50%"}}/>
              <div style={{fontSize:10,color:TH.primary}}>{meta.penulis}</div>
            </div>

            {/* Content */}
            {preview&&preview.slice(0,6).map((sec,i)=>(
              <div key={i}>
                {sec.type==="heading"&&(
                  <div style={{
                    fontFamily:TH.headingFont,fontSize:13,fontWeight:TH.headingBold?700:400,color:TH.primary,
                    margin:"12px 0 6px",
                    ...(theme==="islami"?{textAlign:"center",background:"#F5F0E8",padding:"4px 6px",borderTop:`1px solid ${TH.accent}`,borderBottom:`1px solid ${TH.accent}`}:{}),
                    ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",borderRadius:6}:{}),
                    ...(theme==="akademik"?{textAlign:"center",letterSpacing:1}:{}),
                    ...(theme==="memoir"?{textAlign:"center"}:{}),
                    ...(theme==="bisnis"?{borderLeft:`3px solid ${TH.accent}`,paddingLeft:7}:{}),
                    ...(theme==="fiksi"?{textAlign:"center"}:{}),
                  }}>
                    {theme==="akademik"?sec.text.toUpperCase():sec.text}
                  </div>
                )}
                {(sec.paragraphs||[]).slice(0,4).map((p,j)=>(
                  <div key={j}>
                    {p.type==="paragraph"&&(
                      <p style={{
                        fontSize:isEbook?12:11,lineHeight:activeBodyLine/200,
                        textAlign:TH.bodyAlign,
                        textIndent:activeIndent>0?`${activeIndent/1440}in`:"0",
                        margin:`0 0 ${TH.bodyAfter>0?8:3}px`,
                        fontFamily:activeBodyFont,color:TH.text
                      }} dangerouslySetInnerHTML={{__html:italicHTML(p.text)}}/>
                    )}
                    {p.type==="pullquote"&&(
                      <div style={{
                        fontFamily:TH.pullquoteFont,fontSize:11,color:TH.primary,fontStyle:"italic",margin:"8px 0",
                        ...(theme==="islami"?{textAlign:"center",borderLeft:`3px solid ${TH.accent}`,paddingLeft:8}:{}),
                        ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",border:`1px solid ${TH.accent}`}:{}),
                        ...(theme==="akademik"?{paddingLeft:20,borderLeft:`2px solid ${TH.accent}`}:{}),
                        ...(theme==="bisnis"?{background:"#F5F5F5",padding:"5px 9px",borderLeft:`4px solid ${TH.primary}`}:{}),
                      }}>{`"${p.text}"`}</div>
                    )}
                    {p.type==="arabic"&&<div style={{textAlign:"right",fontSize:13,fontFamily:"Amiri,serif",direction:"rtl",margin:"7px 0",color:TH.primary}}>{p.text}</div>}
                    {p.type==="footnote"&&<div style={{fontSize:9,color:"#888",borderTop:`0.5px solid #ccc`,marginTop:9,paddingTop:3}}>* {p.text}</div>}
                  </div>
                ))}
              </div>
            ))}
            {!preview&&<div style={{textAlign:"center",color:"#ccc",padding:"20px 0",fontSize:13}}>Preview akan muncul di sini...</div>}

            {/* Footer mock — only cetak */}
            {!isEbook&&(
              <div style={{borderTop:`1.5px solid ${TH.accent}`,marginTop:14,paddingTop:5,fontSize:9,color:TH.primary,textAlign:"center"}}>
                {TH.footerStyle==="ornamen-tengah"&&`${TH.ornamen} 1 ${TH.ornamen}`}
                {TH.footerStyle==="warna-tengah"&&<span style={{fontWeight:700}}>1</span>}
                {TH.footerStyle==="angka-tengah"&&"1"}
                {TH.footerStyle==="titik-tengah"&&"— 1 —"}
                {TH.footerStyle==="kanan-bold"&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#aaa"}}>{meta.penulis||""}</span><span>1</span></div>}
              </div>
            )}
            {isEbook&&<div style={{marginTop:12,fontSize:9,color:"#ccc",textAlign:"center",fontStyle:"italic"}}>ebook: nomor halaman dihitung otomatis oleh perangkat</div>}
          </div>

          {status&&(
            <div style={{marginTop:10,padding:"10px 14px",borderRadius:8,fontSize:12,textAlign:"center",
              background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",
              color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#555"}}>
              {status}
            </div>
          )}

          <button onClick={downloadDocx} disabled={generating} style={{
            marginTop:12,width:"100%",padding:13,borderRadius:10,
            background:generating?"#ccc":TH.primary,color:"#fff",
            fontWeight:700,fontSize:14,border:"none",cursor:generating?"not-allowed":"pointer",transition:"all 0.2s"
          }}>
            {generating?(status||"Memproses..."):`⬇️ Unduh File .docx — ${M.label}, ${TH.label}`}
          </button>
          <div style={{fontSize:10,color:"#bbb",textAlign:"center",marginTop:6}}>Bisa dibuka di Microsoft Word · LibreOffice · Google Docs</div>
        </div>
      )}

      {/* Nav */}
      <div style={{display:"flex",gap:10,marginTop:16}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:9,borderRadius:8,background:"transparent",border:"1px solid #d1d5db",cursor:"pointer",fontSize:13}}>← Kembali</button>}
        {step<2&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{flex:2,padding:9,borderRadius:8,background:canNext[step]?TH.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[step]?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>Lanjut →</button>}
        {step===2&&<button onClick={generatePreview} disabled={!canNext[2]||generating} style={{flex:2,padding:9,borderRadius:8,background:canNext[2]?TH.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[2]?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>{generating?"Memproses...":"Generate Preview →"}</button>}
      </div>
    </div>
  );
}
