import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// THEME DEFINITIONS — each theme has unique layout DNA
// ═══════════════════════════════════════════════════════
const THEMES = {
  islami: {
    label:"Islami / Religi", desc:"Tafsir, fiqh, biografi ulama, doa", icon:"📖",
    palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"],
    bg:"#F5F0E8", text:"#1a1a1a",
    // Layout DNA
    headingFont:"Amiri, Georgia, serif", headingSize:40, headingBold:true,
    subheadFont:"Amiri, Georgia, serif", subheadSize:28, subheadColor:"#C9A227",
    bodyFont:"'Palatino Linotype', Palatino, Georgia, serif", bodySize:24,
    bodyAlign:"both", bodyLineHeight:400, bodyIndent:720, bodyAfter:160,
    pullquoteFont:"Amiri, Georgia, serif", pullquoteSize:30, pullquoteAlign:"center",
    arabicFont:"Amiri, 'Traditional Arabic', serif", arabicSize:36,
    headerStyle:"judul-tengah-ornamen", footerStyle:"romawi-tengah",
    pageMargin:{ top:1134, right:1020, bottom:1440, left:1134 },
    ornamen:"☽", ornamenAlt:"✦",
    coverStyle:"islami", // centered, gold divider, bismillah
    primary:"#1B4F72", accent:"#C9A227",
  },
  anak: {
    label:"Anak-anak", desc:"Cerita anak, edukasi, dongeng, komik", icon:"🎨",
    palette:["#E53935","#FDD835","#43A047","#1E88E5","#FF7043"],
    bg:"#FFFDE7", text:"#1a1a1a",
    headingFont:"'Comic Sans MS', 'Segoe UI Rounded', 'Trebuchet MS', sans-serif", headingSize:48, headingBold:true,
    subheadFont:"'Comic Sans MS', 'Trebuchet MS', sans-serif", subheadSize:32, subheadColor:"#43A047",
    bodyFont:"'Trebuchet MS', 'Segoe UI', Verdana, sans-serif", bodySize:26,
    bodyAlign:"left", bodyLineHeight:440, bodyIndent:0, bodyAfter:200,
    pullquoteFont:"'Comic Sans MS', sans-serif", pullquoteSize:32, pullquoteAlign:"center",
    arabicFont:"Amiri, serif", arabicSize:32,
    headerStyle:"nama-buku-kiri-besar", footerStyle:"angka-tengah-warna",
    pageMargin:{ top:1020, right:1020, bottom:1020, left:1020 },
    ornamen:"★", ornamenAlt:"♦",
    coverStyle:"anak",
    primary:"#E53935", accent:"#FDD835",
  },
  akademik: {
    label:"Akademik / Ilmiah", desc:"Skripsi, jurnal, textbook, riset", icon:"🎓",
    palette:["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"],
    bg:"#FFFFFF", text:"#111111",
    headingFont:"'Times New Roman', Times, serif", headingSize:36, headingBold:true,
    subheadFont:"'Times New Roman', Times, serif", subheadSize:26, subheadColor:"#1565C0",
    bodyFont:"'Times New Roman', Times, serif", bodySize:24,
    bodyAlign:"both", bodyLineHeight:360, bodyIndent:0, bodyAfter:120,
    pullquoteFont:"'Times New Roman', serif", pullquoteSize:24, pullquoteAlign:"both",
    arabicFont:"'Traditional Arabic', Amiri, serif", arabicSize:28,
    headerStyle:"bab-kiri-halaman-kanan", footerStyle:"garis-bawah-angka",
    pageMargin:{ top:1440, right:1440, bottom:1440, left:1800 },
    ornamen:"", ornamenAlt:"",
    coverStyle:"akademik",
    primary:"#1A237E", accent:"#1565C0",
  },
  memoir: {
    label:"Memoir / Sastra", desc:"Memoar, novel, cerpen, biografi", icon:"✍️",
    palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41","#EFEBE9"],
    bg:"#FDF6EE", text:"#2c1a0e",
    headingFont:"'EB Garamond', Garamond, 'Book Antiqua', Georgia, serif", headingSize:38, headingBold:false,
    subheadFont:"Garamond, 'Book Antiqua', Georgia, serif", subheadSize:26, subheadColor:"#A1887F",
    bodyFont:"Garamond, 'Book Antiqua', 'Palatino Linotype', Georgia, serif", bodySize:24,
    bodyAlign:"both", bodyLineHeight:400, bodyIndent:640, bodyAfter:0,
    pullquoteFont:"Garamond, Georgia, serif", pullquoteSize:28, pullquoteAlign:"center",
    arabicFont:"Amiri, serif", arabicSize:32,
    headerStyle:"judul-tengah-italic", footerStyle:"titik-angka-titik",
    pageMargin:{ top:1134, right:1020, bottom:1134, left:1020 },
    ornamen:"❧", ornamenAlt:"~",
    coverStyle:"memoir",
    primary:"#4E342E", accent:"#A1887F",
  },
  bisnis: {
    label:"Bisnis / Profesional", desc:"Manajemen, self-help, motivasi, keuangan", icon:"💼",
    palette:["#212121","#C62828","#424242","#757575","#F5F5F5"],
    bg:"#FFFFFF", text:"#111111",
    headingFont:"'Arial', 'Helvetica Neue', sans-serif", headingSize:38, headingBold:true,
    subheadFont:"'Arial', sans-serif", subheadSize:26, subheadColor:"#C62828",
    bodyFont:"'Arial', 'Helvetica Neue', sans-serif", bodySize:22,
    bodyAlign:"both", bodyLineHeight:340, bodyIndent:0, bodyAfter:160,
    pullquoteFont:"'Arial Narrow', Arial, sans-serif", pullquoteSize:30, pullquoteAlign:"center",
    arabicFont:"Amiri, serif", arabicSize:28,
    headerStyle:"garis-atas-bold", footerStyle:"angka-kanan-nama-kiri",
    pageMargin:{ top:1134, right:1020, bottom:1134, left:1134 },
    ornamen:"▌", ornamenAlt:"◆",
    coverStyle:"bisnis",
    primary:"#212121", accent:"#C62828",
  },
  fiksi: {
    label:"Fiksi / Novel", desc:"Novel, romance, thriller, fantasi, sci-fi", icon:"📚",
    palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"],
    bg:"#FAF7FF", text:"#1a1a2e",
    headingFont:"'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif", headingSize:42, headingBold:false,
    subheadFont:"'Palatino Linotype', Georgia, serif", subheadSize:26, subheadColor:"#7B1FA2",
    bodyFont:"'Palatino Linotype', Palatino, Georgia, serif", bodySize:23,
    bodyAlign:"both", bodyLineHeight:380, bodyIndent:680, bodyAfter:0,
    pullquoteFont:"'Palatino Linotype', Georgia, serif", pullquoteSize:26, pullquoteAlign:"center",
    arabicFont:"Amiri, serif", arabicSize:30,
    headerStyle:"judul-tengah-kecil", footerStyle:"angka-tengah-titik",
    pageMargin:{ top:1134, right:1020, bottom:1134, left:1020 },
    ornamen:"✦", ornamenAlt:"···",
    coverStyle:"fiksi",
    primary:"#4A148C", accent:"#7B1FA2",
  },
};

const FORMATS = {
  A5:     { w:8391,  h:11906, label:"A5 (14.8×21 cm)"    },
  A4:     { w:11906, h:16838, label:"A4 (21×29.7 cm)"    },
  B5:     { w:9978,  h:14175, label:"B5 (17.6×25 cm)"    },
  Custom: { w:8788,  h:13032, label:"Custom (15.5×23 cm)" },
};

const STEPS = ["Tema & Format","Input Konten","Metadata","Preview & Unduh"];

const COMMON_ID = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","bang","kak"]);
const isForeign = w => /^[a-zA-Z]/.test(w) && !w.toLowerCase().split(/\s+/).every(x => COMMON_ID.has(x) || x.length<=2);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export default function App() {
  const [step,setStep]         = useState(0);
  const [theme,setTheme]       = useState("islami");
  const [format,setFormat]     = useState("A5");
  const [content,setContent]   = useState("");
  const [fileName,setFileName] = useState("");
  const [meta,setMeta]         = useState({judul:"",penulis:"",penerbit:"",tahun:new Date().getFullYear(),subjudul:""});
  const [generating,setGenerating] = useState(false);
  const [preview,setPreview]   = useState(null);
  const [dragOver,setDragOver] = useState(false);
  const [status,setStatus]     = useState("");

  const th = THEMES[theme];

  const handleFile = useCallback((file)=>{
    if(!file) return;
    setFileName(file.name);
    const r=new FileReader();
    r.onload=e=>setContent(e.target.result);
    r.readAsText(file,"UTF-8");
  },[]);

  const onDrop=e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);};

  const parseContent=text=>{
    const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
    const sections=[];let cur=null,paras=[];
    for(const line of lines){
      if(/^#+\s/.test(line)||/^(BAB|PASAL|BAGIAN|CHAPTER)\s+[IVX\d]/i.test(line)){
        if(cur) sections.push({...cur,paragraphs:paras});
        cur={type:"heading",text:line.replace(/^#+\s*/,"")};paras=[];
      } else if(/^\[KUTIPAN\]/i.test(line)) paras.push({type:"pullquote",text:line.replace(/^\[KUTIPAN\]/i,"").trim()});
      else if(/^\[ARAB\]/i.test(line))      paras.push({type:"arabic",text:line.replace(/^\[ARAB\]/i,"").trim()});
      else if(/^\[CATATAN\]/i.test(line))   paras.push({type:"footnote",text:line.replace(/^\[CATATAN\]/i,"").trim()});
      else paras.push({type:"paragraph",text:line});
    }
    if(cur) sections.push({...cur,paragraphs:paras});
    else if(paras.length) sections.push({type:"body",text:"",paragraphs:paras});
    return sections;
  };

  const italicHTML=text=>text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g,m=>isForeign(m)?`<em>${m}</em>`:m);

  // ══════════════════════════════════════════════════════
  // BUILD DOCX — theme-aware XML generation
  // ══════════════════════════════════════════════════════
  const buildDocx=async()=>{
    if(!window.JSZip){
      await new Promise((res,rej)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=res;s.onerror=rej;
        document.head.appendChild(s);
      });
    }

    const T=th;
    const ph=T.primary.replace("#","");
    const ah=T.accent.replace("#","");
    const fmt=FORMATS[format];
    const sections=parseContent(content);

    const run=(text,opts={})=>{
      const rPr=[
        opts.bold?"<w:b/><w:bCs/>":"",
        opts.italic?"<w:i/><w:iCs/>":"",
        opts.size?`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>` :"",
        opts.color?`<w:color w:val="${opts.color}"/>`:"",
        opts.font?`<w:rFonts w:ascii="${opts.font}" w:hAnsi="${opts.font}" w:cs="${opts.font}"/>`:"",
        opts.rtl?"<w:rtl/>":"",
        opts.spacing?`<w:spacing w:val="${opts.spacing}"/>`:"",
      ].filter(Boolean).join("");
      return `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
    };

    const runMixed=(text,opts={})=>{
      return text.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g).filter(Boolean).map(part=>{
        const foreign=isForeign(part);
        return run(part,{...opts,italic:opts.italic||foreign});
      }).join("");
    };

    const para=(runs,opts={})=>{
      const pPr=[
        opts.pStyle?`<w:pStyle w:val="${opts.pStyle}"/>`:"",
        opts.align?`<w:jc w:val="${opts.align}"/>`:"",
        opts.before||opts.after||opts.line?`<w:spacing w:before="${opts.before||0}" w:after="${opts.after||120}" w:line="${opts.line||240}" w:lineRule="auto"/>`:"",
        opts.indent?`<w:ind w:firstLine="${opts.indent}"/>`:"",
        opts.indL?`<w:ind w:left="${opts.indL}" w:right="${opts.indL||0}"/>`:"",
        opts.pageBreak?"<w:pageBreakBefore/>":"",
        opts.keepNext?"<w:keepNext/>":"",
        opts.keepLines?"<w:keepLines/>":"",
        opts.rtl?"<w:bidi/>":"",
        opts.borderL?`<w:pBdr><w:left w:val="single" w:sz="${opts.borderLSz||12}" w:space="8" w:color="${ah}"/></w:pBdr>`:"",
        opts.borderFull?`<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/></w:pBdr>`:"",
        opts.borderTop?`<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/></w:pBdr>`:"",
        opts.shading?`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shading}"/>`:"",
      ].filter(Boolean).join("");
      return `<w:p><w:pPr>${pPr}</w:pPr>${runs}</w:p>`;
    };

    let body="";

    // ── COVER — per theme ──────────────────────────────
    if(T.coverStyle==="islami"){
      body+=para(run("بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",{size:28,font:"Amiri",color:ah,rtl:true}),{align:"center",before:720,after:240,rtl:true});
      body+=para(run("",{size:6}),{align:"center",after:120});
      body+=para(run(meta.judul||"Judul Buku",{bold:true,size:56,color:ph,font:"Amiri"}),{align:"center",before:240,after:200,keepNext:true});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:28,color:ah,font:"Amiri"}),{align:"center",before:0,after:240});
      body+=para(run("── ✦ ──",{size:24,color:ah}),{align:"center",before:120,after:360});
      body+=para(run(meta.penulis||"",{size:24,color:ph,font:"Palatino Linotype"}),{align:"center",before:0,after:120});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:20,color:"777777",font:"Palatino Linotype"}),{align:"center",after:60});
      body+=para(run(String(meta.tahun),{size:18,color:"999999"}),{align:"center",after:1440});
    } else if(T.coverStyle==="anak"){
      body+=para(run("",{size:48}),{align:"center",before:480});
      body+=para(run(meta.judul||"Judul Buku",{bold:true,size:72,color:ph,font:"'Comic Sans MS'",spacing:60}),{align:"center",before:240,after:240,shading:"FFFDE7"});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:36,color:"#43A047".replace("#",""),font:"'Comic Sans MS'"}),{align:"center",after:360});
      body+=para(run("★ ★ ★",{size:32,color:ah}),{align:"center",before:120,after:360});
      body+=para(run(meta.penulis||"",{bold:true,size:28,color:ph,font:"'Trebuchet MS'"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:22,color:"777777"}),{align:"center",after:1440});
    } else if(T.coverStyle==="akademik"){
      body+=para(run(meta.penerbit||"UNIVERSITAS / LEMBAGA",{size:22,color:"555555",font:"'Times New Roman'"}),{align:"center",before:720,after:720});
      body+=para(run("",{size:4}),{align:"center",borderFull:true,after:720});
      body+=para(run(meta.judul||"JUDUL PENELITIAN",{bold:true,size:40,color:ph,font:"'Times New Roman'"}),{align:"center",before:360,after:200});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:26,color:"444444",font:"'Times New Roman'"}),{align:"center",after:720});
      body+=para(run("Oleh:",{size:22,color:"555555",font:"'Times New Roman'"}),{align:"center",before:360,after:120});
      body+=para(run(meta.penulis||"",{bold:true,size:24,color:ph,font:"'Times New Roman'"}),{align:"center",after:720});
      body+=para(run(String(meta.tahun),{size:22,color:"555555"}),{align:"center",after:1440});
    } else if(T.coverStyle==="memoir"){
      body+=para(run(meta.judul||"Judul Buku",{size:52,color:ph,font:"Garamond"}),{align:"center",before:1440,after:120,keepNext:true});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:26,color:ah,font:"Garamond"}),{align:"center",after:480});
      body+=para(run("❧",{size:48,color:ah}),{align:"center",before:120,after:480});
      body+=para(run(meta.penulis||"",{size:24,color:ph,font:"Garamond"}),{align:"center",after:120});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:20,color:"888888",font:"Garamond"}),{align:"center",after:60});
      body+=para(run(String(meta.tahun),{size:18,color:"aaaaaa",font:"Garamond"}),{align:"center",after:1440});
    } else if(T.coverStyle==="bisnis"){
      body+=para(run("",{size:6}),{after:0,shading:ph.replace("#","")});
      body+=para(run("",{size:48}),{before:480});
      body+=para(run(meta.judul||"JUDUL BUKU",{bold:true,size:60,color:ph,font:"Arial",spacing:80}),{align:"left",before:240,after:160});
      if(meta.subjudul) body+=para(run(meta.subjudul,{size:26,color:ah,font:"Arial"}),{align:"left",after:480});
      body+=para(run("",{size:4}),{align:"left",borderFull:true,after:480});
      body+=para(run(meta.penulis||"",{bold:true,size:26,color:ph,font:"Arial"}),{align:"left",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:20,color:"666666",font:"Arial"}),{align:"left",after:1440});
    } else { // fiksi
      body+=para(run("",{size:48}),{before:720});
      body+=para(run(meta.judul||"Judul Buku",{size:56,color:ph,font:"'Palatino Linotype'"}),{align:"center",before:480,after:120,keepNext:true});
      body+=para(run("✦",{size:28,color:ah}),{align:"center",before:0,after:120});
      if(meta.subjudul) body+=para(run(meta.subjudul,{italic:true,size:24,color:ah,font:"'Palatino Linotype'"}),{align:"center",after:600});
      body+=para(run(meta.penulis||"",{italic:true,size:22,color:"555555",font:"'Palatino Linotype'"}),{align:"center",after:80});
      if(meta.penerbit) body+=para(run(meta.penerbit,{size:18,color:"888888"}),{align:"center",after:1440});
    }

    // ── CONTENT — theme-aware ──────────────────────────
    for(const sec of sections){
      if(sec.type==="heading"){
        // Heading style varies by theme
        if(theme==="islami"){
          body+=para(run("",{size:6}),{align:"center",borderFull:true,before:0,after:0});
          body+=para(run(sec.text,{bold:true,size:T.headingSize,color:ph,font:"Amiri"}),{align:"center",pageBreak:true,before:360,after:120,keepNext:true,shading:"F5F0E8"});
          body+=para(run("── ✦ ──",{size:20,color:ah}),{align:"center",before:0,after:360,keepNext:true});
        } else if(theme==="anak"){
          body+=para(run(`${T.ornamen} ${sec.text} ${T.ornamen}`,{bold:true,size:T.headingSize,color:ph,font:"'Comic Sans MS'"}),{align:"center",pageBreak:true,before:360,after:240,keepNext:true,shading:"FFFDE7"});
        } else if(theme==="akademik"){
          body+=para(run(sec.text.toUpperCase(),{bold:true,size:T.headingSize,color:ph,font:"'Times New Roman'"}),{align:"center",pageBreak:true,before:480,after:480,keepNext:true});
          body+=para(run("",{size:4}),{borderFull:true,before:0,after:480,keepNext:true});
        } else if(theme==="memoir"){
          body+=para(run(sec.text,{size:T.headingSize,color:ph,font:"Garamond"}),{align:"center",pageBreak:true,before:960,after:120,keepNext:true});
          body+=para(run("❧",{size:32,color:ah,font:"Garamond"}),{align:"center",before:0,after:480,keepNext:true});
        } else if(theme==="bisnis"){
          body+=para(run(sec.text,{bold:true,size:T.headingSize,color:ph,font:"Arial"}),{align:"left",pageBreak:true,before:360,after:0,keepNext:true,borderL:true,borderLSz:24});
          body+=para(run("",{size:4}),{borderTop:true,before:0,after:360,keepNext:true});
        } else { // fiksi
          body+=para(run(sec.text,{size:T.headingSize,color:ph,font:"'Palatino Linotype'"}),{align:"center",pageBreak:true,before:960,after:120,keepNext:true});
          body+=para(run("✦  ✦  ✦",{size:22,color:ah}),{align:"center",before:0,after:480,keepNext:true});
        }
      }

      for(const p of sec.paragraphs||[]){
        if(p.type==="paragraph"){
          body+=para(
            runMixed(p.text,{size:T.bodySize,font:T.bodyFont.split(",")[0].replace(/'/g,"")}),
            {align:T.bodyAlign,indent:T.bodyIndent,line:T.bodyLineHeight,after:T.bodyAfter,keepLines:true}
          );
        } else if(p.type==="pullquote"){
          if(theme==="islami"){
            body+=para(run(`"${p.text}"`,{italic:true,size:T.pullquoteSize,color:ph,font:"Amiri"}),{align:"center",indL:720,before:360,after:360,keepLines:true,borderL:true,borderLSz:18});
          } else if(theme==="anak"){
            body+=para(run(`"${p.text}"`,{bold:true,size:T.pullquoteSize,color:ph,font:"'Comic Sans MS'"}),{align:"center",before:240,after:240,keepLines:true,shading:"FFFDE7",borderFull:true});
          } else if(theme==="akademik"){
            body+=para(run(p.text,{italic:true,size:T.pullquoteSize,color:"444444",font:"'Times New Roman'"}),{align:"both",indL:1440,before:240,after:240,keepLines:true,borderL:true,borderLSz:6});
          } else if(theme==="memoir"){
            body+=para(run(`"${p.text}"`,{italic:true,size:T.pullquoteSize,color:ph,font:"Garamond"}),{align:"center",before:360,after:360,keepLines:true});
          } else if(theme==="bisnis"){
            body+=para(run(`"${p.text}"`,{bold:true,size:T.pullquoteSize,color:ph,font:"'Arial Narrow'"}),{align:"left",indL:720,before:240,after:240,keepLines:true,shading:"F5F5F5",borderL:true,borderLSz:20});
          } else {
            body+=para(run(`"${p.text}"`,{italic:true,size:T.pullquoteSize,color:ah,font:"'Palatino Linotype'"}),{align:"center",before:360,after:360,keepLines:true});
          }
        } else if(p.type==="arabic"){
          body+=para(run(p.text,{size:T.arabicSize,font:T.arabicFont.split(",")[0].replace(/'/g,""),rtl:true}),{align:"right",before:240,after:240,rtl:true,keepLines:true});
        } else if(p.type==="footnote"){
          body+=para(run(`*  ${p.text}`,{size:18,color:"666666",font:T.bodyFont.split(",")[0].replace(/'/g,"")}),{before:240,after:60,borderTop:true});
        }
      }
    }

    // ── HEADER XML — theme-aware ──────────────────────
    let headerXml="";
    if(T.headerStyle==="judul-tengah-ornamen"){
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t xml:space="preserve">✦  </w:t></w:r>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t xml:space="preserve">  ✦</w:t></w:r>
  </w:p></w:hdr>`;
    } else if(T.headerStyle==="nama-buku-kiri-besar"){
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="double" w:sz="6" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="24"/><w:rFonts w:ascii="'Comic Sans MS'" w:hAnsi="'Comic Sans MS'"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p></w:hdr>`;
    } else if(T.headerStyle==="bab-kiri-halaman-kanan"){
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="'Times New Roman'" w:hAnsi="'Times New Roman'"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:tab/></w:r>
    <w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p></w:hdr>`;
    } else if(T.headerStyle==="judul-tengah-italic"){
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p></w:hdr>`;
    } else if(T.headerStyle==="garis-atas-bold"){
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:bottom w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r>
    <w:r><w:rPr><w:color w:val="AAAAAA"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">  |  ${esc(meta.judul||"Judul")}</w:t></w:r>
  </w:p></w:hdr>`;
    } else {
      headerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="'Palatino Linotype'" w:hAnsi="'Palatino Linotype'"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r>
  </w:p></w:hdr>`;
    }

    // ── FOOTER XML — theme-aware ──────────────────────
    const pgNum=`<w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    let footerXml="";
    if(T.footerStyle==="romawi-tengah"){
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/><w:rFonts w:ascii="Amiri" w:hAnsi="Amiri"/></w:rPr><w:t xml:space="preserve">✦  </w:t></w:r>${pgNum}
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">  ✦</w:t></w:r>
  </w:p></w:ftr>`;
    } else if(T.footerStyle==="angka-tengah-warna"){
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="24"/><w:rFonts w:ascii="'Comic Sans MS'" w:hAnsi="'Comic Sans MS'"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p></w:ftr>`;
    } else if(T.footerStyle==="garis-bawah-angka"){
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/></w:pBdr></w:pPr>
    ${pgNum}
  </w:p></w:ftr>`;
    } else if(T.footerStyle==="titik-angka-titik"){
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">— </w:t></w:r>${pgNum}
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> —</w:t></w:r>
  </w:p></w:ftr>`;
    } else if(T.footerStyle==="angka-kanan-nama-kiri"){
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="left"/><w:pBdr><w:top w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr><w:tabs><w:tab w:val="right" w:pos="${fmt.w-2040}"/></w:tabs></w:pPr>
    <w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="18"/><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:tab/></w:r>${pgNum}
  </w:p></w:ftr>`;
    } else {
      footerXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">· </w:t></w:r>${pgNum}
    <w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve"> ·</w:t></w:r>
  </w:p></w:ftr>`;
    }

    // Section properties
    body+=`<w:sectPr>
      <w:headerReference w:type="default" r:id="rId3"/>
      <w:footerReference w:type="default" r:id="rId4"/>
      <w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>
      <w:pgMar w:top="${T.pageMargin.top}" w:right="${T.pageMargin.right}" w:bottom="${T.pageMargin.bottom}" w:left="${T.pageMargin.left}" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>`;

    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:body>${body}</w:body></w:document>`;

    const relsXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`;

    const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

    const pkgRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const stylesXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr>
    <w:rFonts w:ascii="${T.bodyFont.split(",")[0].replace(/'/g,"")}" w:hAnsi="${T.bodyFont.split(",")[0].replace(/'/g,"")}"/>
    <w:sz w:val="${T.bodySize}"/><w:szCs w:val="${T.bodySize}"/>
  </w:rPr></w:rPrDefault></w:docDefaults>
</w:styles>`;

    const settingsXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>
</w:settings>`;

    const zip=new window.JSZip();
    zip.file("[Content_Types].xml",contentTypes);
    zip.file("_rels/.rels",pkgRels);
    zip.file("word/document.xml",documentXml);
    zip.file("word/styles.xml",stylesXml);
    zip.file("word/settings.xml",settingsXml);
    zip.file("word/header1.xml",headerXml);
    zip.file("word/footer1.xml",footerXml);
    zip.file("word/_rels/document.xml.rels",relsXml);

    const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`${(meta.judul||"buku").replace(/\s+/g,"_")}_${theme}_layout.docx`;
    a.click();URL.revokeObjectURL(url);
  };

  const downloadDocx=async()=>{
    setGenerating(true);setStatus("Memuat library...");
    try{ await buildDocx(); setStatus("✅ File berhasil diunduh!"); }
    catch(e){ console.error(e); setStatus("❌ Gagal: "+e.message); }
    setGenerating(false);setTimeout(()=>setStatus(""),4000);
  };

  const generatePreview=()=>{
    setGenerating(true);
    setTimeout(()=>{setPreview(parseContent(content));setGenerating(false);setStep(3);},400);
  };

  const canNext=[true,content.trim().length>10,meta.judul.trim().length>0&&meta.penulis.trim().length>0,true];

  // ── PREVIEW RENDERER — theme-aware ──────────────────
  const PreviewPage=()=>{
    if(!preview) return <div style={{textAlign:"center",color:"#aaa",padding:"20px 0"}}>Preview akan muncul di sini...</div>;
    const T=th;
    return (
      <div style={{fontFamily:T.bodyFont,color:T.text}}>
        {/* Cover mini */}
        {theme==="islami"&&<>
          <div style={{textAlign:"center",fontSize:11,color:T.accent,marginBottom:4,fontFamily:"Amiri,serif"}}>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</div>
          <div style={{textAlign:"center",fontSize:18,fontWeight:700,color:T.primary,fontFamily:"Amiri,Georgia,serif"}}>{meta.judul||"Judul Buku"}</div>
          <div style={{textAlign:"center",fontSize:12,color:T.accent,margin:"4px 0 8px"}}>── ✦ ──</div>
        </>}
        {theme==="anak"&&<>
          <div style={{textAlign:"center",fontSize:20,fontWeight:700,color:T.primary,fontFamily:"'Comic Sans MS',sans-serif",background:"#FFFDE7",padding:"8px",borderRadius:8}}>{meta.judul||"Judul Buku"}</div>
          <div style={{textAlign:"center",fontSize:16,color:T.accent,margin:"4px 0 8px"}}>★ ★ ★</div>
        </>}
        {theme==="akademik"&&<>
          <div style={{textAlign:"center",fontSize:14,fontWeight:700,color:T.primary,fontFamily:"'Times New Roman',serif",letterSpacing:1}}>{(meta.judul||"JUDUL PENELITIAN").toUpperCase()}</div>
          <div style={{borderTop:`1px solid ${T.primary}`,borderBottom:`1px solid ${T.primary}`,margin:"6px 0 10px",padding:"2px 0"}}/>
        </>}
        {theme==="memoir"&&<>
          <div style={{textAlign:"center",fontSize:18,color:T.primary,fontFamily:"Garamond,'Book Antiqua',serif",marginBottom:2}}>{meta.judul||"Judul Buku"}</div>
          <div style={{textAlign:"center",fontSize:18,color:T.accent,margin:"2px 0 10px"}}>❧</div>
        </>}
        {theme==="bisnis"&&<>
          <div style={{fontSize:18,fontWeight:700,color:T.primary,fontFamily:"Arial,sans-serif",borderLeft:`4px solid ${T.accent}`,paddingLeft:8,marginBottom:4}}>{meta.judul||"Judul Buku"}</div>
          <div style={{borderTop:`1px solid ${T.primary}`,marginBottom:10}}/>
        </>}
        {theme==="fiksi"&&<>
          <div style={{textAlign:"center",fontSize:18,color:T.primary,fontFamily:"'Palatino Linotype',serif",marginBottom:2}}>{meta.judul||"Judul Buku"}</div>
          <div style={{textAlign:"center",fontSize:14,color:T.accent,margin:"2px 0 10px"}}>✦  ✦  ✦</div>
        </>}

        {/* Content */}
        {preview.slice(0,6).map((sec,i)=>(
          <div key={i}>
            {sec.type==="heading"&&(
              <div style={{
                fontFamily:T.headingFont,fontSize:14,fontWeight:T.headingBold?700:400,color:T.primary,
                margin:"14px 0 6px",
                ...(theme==="islami"?{textAlign:"center",background:"#F5F0E8",padding:"4px 8px",borderTop:`1px solid ${T.accent}`,borderBottom:`1px solid ${T.accent}`}:{}),
                ...(theme==="anak"?{textAlign:"center",background:"#FFFDE7",padding:"6px",borderRadius:6}:{}),
                ...(theme==="akademik"?{textAlign:"center",letterSpacing:1}:{}),
                ...(theme==="memoir"?{textAlign:"center"}:{}),
                ...(theme==="bisnis"?{borderLeft:`3px solid ${T.accent}`,paddingLeft:8}:{}),
                ...(theme==="fiksi"?{textAlign:"center"}:{}),
              }}>{theme==="anak"?`★ ${sec.text} ★`:theme==="akademik"?sec.text.toUpperCase():sec.text}</div>
            )}
            {(sec.paragraphs||[]).slice(0,4).map((p,j)=>(
              <div key={j}>
                {p.type==="paragraph"&&<p style={{fontSize:11,lineHeight:T.bodyLineHeight/200,textAlign:T.bodyAlign,textIndent:T.bodyIndent?`${T.bodyIndent/1440}in`:"0",margin:`0 0 ${T.bodyAfter/120*4}px`,fontFamily:T.bodyFont}} dangerouslySetInnerHTML={{__html:italicHTML(p.text)}}/>}
                {p.type==="pullquote"&&<div style={{
                  fontFamily:T.pullquoteFont,fontSize:11,color:T.primary,fontStyle:"italic",margin:"8px 0",
                  ...(theme==="islami"?{textAlign:"center",borderLeft:`3px solid ${T.accent}`,paddingLeft:8}:{}),
                  ...(theme==="anak"?{textAlign:"center",background:"#FFFDE7",padding:"6px",border:`1px solid ${T.accent}`}:{}),
                  ...(theme==="akademik"?{paddingLeft:24,borderLeft:`2px solid ${T.accent}`}:{}),
                  ...(theme==="bisnis"?{background:"#F5F5F5",padding:"6px 10px",borderLeft:`4px solid ${T.primary}`}:{}),
                }}>{`"${p.text}"`}</div>}
                {p.type==="arabic"&&<div style={{textAlign:"right",fontSize:14,fontFamily:"Amiri,serif",direction:"rtl",margin:"8px 0",color:T.primary}}>{p.text}</div>}
                {p.type==="footnote"&&<div style={{fontSize:9,color:"#888",borderTop:`0.5px solid #ccc`,marginTop:10,paddingTop:3}}>* {p.text}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:720,margin:"0 auto",padding:"1rem"}}>
      {/* Header */}
      <div style={{background:th.primary,borderRadius:12,padding:"1.25rem 1.5rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:28}}>{th.icon}</span>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:18}}>Book Layout Studio Pro</div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:12}}>Layout buku profesional — distinktif per kategori</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          {th.palette.map((c,i)=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:c,border:"1.5px solid rgba(255,255,255,0.3)"}}/>)}
        </div>
      </div>

      {/* Steps */}
      <div style={{display:"flex",gap:4,marginBottom:"1.25rem"}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{height:4,borderRadius:4,background:i<=step?th.primary:"#e5e7eb",marginBottom:5}}/>
            <div style={{fontSize:10,color:i===step?th.primary:"#999",fontWeight:i===step?700:400}}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 0 */}
      {step===0&&(
        <div>
          <div style={{fontWeight:600,marginBottom:12}}>Pilih Tema Buku</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:10,marginBottom:20}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <div key={k} onClick={()=>setTheme(k)} style={{border:theme===k?`2px solid ${v.primary}`:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",cursor:"pointer",background:theme===k?v.bg:"#fff"}}>
                <div style={{fontSize:22,marginBottom:4}}>{v.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:v.primary}}>{v.label}</div>
                <div style={{fontSize:11,color:"#777",marginTop:2}}>{v.desc}</div>
                <div style={{display:"flex",gap:4,marginTop:8}}>
                  {v.palette.slice(0,4).map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
                </div>
                {theme===k&&<div style={{fontSize:10,color:v.primary,marginTop:6,fontWeight:600}}>
                  {k==="islami"?"Amiri · Palatino · margin lebar":k==="anak"?"Comic Sans · Trebuchet · line tinggi":k==="akademik"?"Times New Roman · margin asimetris":k==="memoir"?"Garamond · indent klasik · tanpa spasi antar para":k==="bisnis"?"Arial · kompak · header tebal":"Palatino · indent halus · ornamen ✦"}
                </div>}
              </div>
            ))}
          </div>
          <div style={{fontWeight:600,marginBottom:10}}>Format Halaman</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:8}}>
            {Object.entries(FORMATS).map(([k,v])=>(
              <div key={k} onClick={()=>setFormat(k)} style={{border:format===k?`2px solid ${th.primary}`:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",cursor:"pointer",background:format===k?`${th.primary}11`:"#fff"}}>
                <div style={{fontSize:13,fontWeight:600,color:format===k?th.primary:"#1a1a1a"}}>{k}</div>
                <div style={{fontSize:11,color:"#777"}}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step===1&&(
        <div>
          <div style={{fontWeight:600,marginBottom:8}}>Upload atau Tempel Konten Buku</div>
          <div style={{fontSize:12,color:"#666",marginBottom:12,lineHeight:1.7}}>
            Tag: <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4}}># BAB I</code> · <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4}}>[KUTIPAN]</code> · <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4}}>[ARAB]</code> · <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4}}>[CATATAN]</code>
          </div>
          <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop} onClick={()=>document.getElementById("fi").click()}
            style={{border:`2px dashed ${dragOver?th.primary:"#d1d5db"}`,borderRadius:10,padding:20,textAlign:"center",cursor:"pointer",background:dragOver?`${th.primary}08`:"#f9fafb",marginBottom:14}}>
            <div style={{fontSize:30,marginBottom:6}}>📂</div>
            <div style={{fontSize:13,fontWeight:500,color:th.primary}}>{fileName||"Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{fontSize:11,color:"#999",marginTop:4}}>Format: .txt dan .md</div>
            <input id="fi" type="file" accept=".txt,.md" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          <div style={{fontSize:12,color:"#aaa",textAlign:"center",marginBottom:8}}>— atau tempel teks langsung —</div>
          <textarea value={content} onChange={e=>setContent(e.target.value)}
            placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali."
            style={{width:"100%",minHeight:200,borderRadius:8,padding:"10px 12px",fontFamily:"inherit",fontSize:13,lineHeight:1.7,resize:"vertical",border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
          <div style={{fontSize:11,color:"#999",marginTop:4}}>
            {content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2&&(
        <div>
          <div style={{fontWeight:600,marginBottom:14}}>Informasi Buku</div>
          {[{key:"judul",label:"Judul Buku *",placeholder:"Masukkan judul buku"},{key:"subjudul",label:"Sub-judul",placeholder:"Opsional"},{key:"penulis",label:"Nama Penulis *",placeholder:"Nama lengkap penulis"},{key:"penerbit",label:"Penerbit",placeholder:"Nama penerbit"},{key:"tahun",label:"Tahun Terbit",placeholder:"2026"}].map(({key,label,placeholder})=>(
            <div key={key} style={{marginBottom:14}}>
              <label style={{fontSize:13,fontWeight:500,color:"#555",display:"block",marginBottom:5}}>{label}</label>
              <input value={meta[key]} onChange={e=>setMeta(m=>({...m,[key]:e.target.value}))} placeholder={placeholder}
                style={{width:"100%",padding:"9px 12px",borderRadius:8,fontSize:14,border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
            </div>
          ))}
          <div style={{background:`${th.primary}10`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:th.primary,marginBottom:6}}>Layout DNA — {th.label}</div>
            <div style={{fontSize:12,color:"#555",lineHeight:2}}>
              📐 Format: <strong>{FORMATS[format].label}</strong><br/>
              🔤 Heading: <em>{th.headingFont.split(",")[0]}</em> {th.headingSize/2}pt {th.headingBold?"Bold":""}<br/>
              📝 Body: <em>{th.bodyFont.split(",")[0]}</em> {th.bodySize/2}pt · spasi {th.bodyLineHeight/240}× · indent {th.bodyIndent>0?"ada":"tidak"}<br/>
              📄 Header: {th.headerStyle} · Footer: {th.footerStyle}<br/>
              🎨 <span style={{color:th.primary}}>■</span> {th.primary} + <span style={{color:th.accent}}>■</span> {th.accent}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step===3&&(
        <div>
          <div style={{fontWeight:600,marginBottom:12}}>Preview Layout — <span style={{color:th.primary,fontSize:13}}>{th.label}</span></div>
          <div style={{border:"1px solid #e5e7eb",borderRadius:8,background:th.bg,padding:"20px 24px",maxHeight:400,overflowY:"auto",boxShadow:"2px 4px 16px rgba(0,0,0,0.07)"}}>
            {/* Header mock */}
            <div style={{
              borderBottom:`2px solid ${th.accent}`,marginBottom:14,paddingBottom:6,
              display:"flex",justifyContent:th.headerStyle==="bab-kiri-halaman-kanan"||th.headerStyle==="garis-atas-bold"?"space-between":"center",
              fontFamily:th.bodyFont,fontSize:10
            }}>
              {th.headerStyle==="judul-tengah-ornamen"&&<span style={{color:th.primary,fontStyle:"italic",fontFamily:"Amiri,serif"}}>✦ {meta.judul||"Judul Buku"} ✦</span>}
              {th.headerStyle==="nama-buku-kiri-besar"&&<span style={{color:th.primary,fontWeight:700,fontFamily:"'Comic Sans MS',sans-serif"}}>{meta.judul||"Judul Buku"}</span>}
              {th.headerStyle==="bab-kiri-halaman-kanan"&&<><span style={{color:th.primary}}>{meta.judul||"Judul"}</span><span style={{color:"#888"}}>1</span></>}
              {th.headerStyle==="judul-tengah-italic"&&<span style={{color:th.primary,fontStyle:"italic",fontFamily:"Garamond,serif"}}>{meta.judul||"Judul Buku"}</span>}
              {th.headerStyle==="garis-atas-bold"&&<><span style={{color:th.primary,fontWeight:700}}>{meta.penulis||""}</span><span style={{color:"#aaa"}}> | {meta.judul||"Judul"}</span></>}
              {th.headerStyle==="judul-tengah-kecil"&&<span style={{color:th.primary,fontStyle:"italic",fontFamily:"'Palatino Linotype',serif"}}>{meta.judul||"Judul Buku"}</span>}
            </div>
            <PreviewPage/>
            {/* Footer mock */}
            <div style={{borderTop:`2px solid ${th.accent}`,marginTop:14,paddingTop:6,textAlign:"center",fontSize:10,color:th.primary}}>
              {th.footerStyle==="romawi-tengah"&&`✦ 1 ✦`}
              {th.footerStyle==="angka-tengah-warna"&&<span style={{fontWeight:700,fontFamily:"'Comic Sans MS',sans-serif",color:th.primary}}>1</span>}
              {th.footerStyle==="garis-bawah-angka"&&"1"}
              {th.footerStyle==="titik-angka-titik"&&`— 1 —`}
              {th.footerStyle==="angka-kanan-nama-kiri"&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888"}}>{meta.penulis||""}</span><span>1</span></div>}
              {th.footerStyle==="angka-tengah-titik"&&`· 1 ·`}
            </div>
          </div>

          {status&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:8,fontSize:13,textAlign:"center",
            background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",
            color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#444"}}>{status}</div>}

          <button onClick={downloadDocx} disabled={generating} style={{marginTop:14,width:"100%",padding:14,borderRadius:10,background:generating?"#ccc":th.primary,color:"#fff",fontWeight:700,fontSize:15,border:"none",cursor:generating?"not-allowed":"pointer"}}>
            {generating?(status||"Memproses..."):"⬇️ Unduh File .docx"}
          </button>
          <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:8}}>Bisa dibuka di Microsoft Word, LibreOffice, Google Docs</div>
        </div>
      )}

      {/* Nav */}
      <div style={{display:"flex",gap:10,marginTop:18}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:10,borderRadius:8,background:"transparent",border:"1px solid #d1d5db",cursor:"pointer",fontSize:14}}>← Kembali</button>}
        {step<2&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{flex:2,padding:10,borderRadius:8,background:canNext[step]?th.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[step]?"pointer":"not-allowed",fontSize:14,fontWeight:600}}>Lanjut →</button>}
        {step===2&&<button onClick={generatePreview} disabled={!canNext[2]||generating} style={{flex:2,padding:10,borderRadius:8,background:canNext[2]?th.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[2]?"pointer":"not-allowed",fontSize:14,fontWeight:600}}>{generating?"Memproses...":"Generate Preview →"}</button>}
      </div>
    </div>
  );
}
