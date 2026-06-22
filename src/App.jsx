import { useState, useCallback } from "react";

// ════════════════════════════════════════════════
// FONT CATALOG — dengan karakter visual berbeda
// ════════════════════════════════════════════════
const FONT_CATALOG = {
  serif: {
    label: "Serif — Klasik & Elegan",
    fonts: [
      { id:"Georgia",          name:"Georgia",           sample:"Ilmu adalah cahaya yang menerangi",  css:"Georgia, serif",                        best:["islami","memoir","fiksi"] },
      { id:"Palatino Linotype",name:"Palatino Linotype", sample:"Ilmu adalah cahaya yang menerangi",  css:"'Palatino Linotype', Palatino, serif",   best:["islami","memoir","fiksi"] },
      { id:"Garamond",         name:"Garamond",          sample:"Ilmu adalah cahaya yang menerangi",  css:"Garamond, 'EB Garamond', serif",          best:["memoir","fiksi"] },
      { id:"Times New Roman",  name:"Times New Roman",   sample:"Ilmu adalah cahaya yang menerangi",  css:"'Times New Roman', Times, serif",         best:["akademik"] },
      { id:"Book Antiqua",     name:"Book Antiqua",      sample:"Ilmu adalah cahaya yang menerangi",  css:"'Book Antiqua', Palatino, serif",         best:["memoir","fiksi"] },
      { id:"Cambria",          name:"Cambria",           sample:"Ilmu adalah cahaya yang menerangi",  css:"Cambria, Georgia, serif",                 best:["akademik","bisnis"] },
      { id:"Amiri",            name:"Amiri",             sample:"Ilmu adalah cahaya yang menerangi",  css:"Amiri, Georgia, serif",                   best:["islami"] },
    ]
  },
  sansserif: {
    label: "Sans-Serif — Modern & Bersih",
    fonts: [
      { id:"Arial",            name:"Arial",             sample:"Ilmu adalah cahaya yang menerangi",  css:"Arial, 'Helvetica Neue', sans-serif",     best:["bisnis"] },
      { id:"Calibri",          name:"Calibri",           sample:"Ilmu adalah cahaya yang menerangi",  css:"Calibri, 'Gill Sans', sans-serif",         best:["bisnis","akademik"] },
      { id:"Trebuchet MS",     name:"Trebuchet MS",      sample:"Ilmu adalah cahaya yang menerangi",  css:"'Trebuchet MS', Tahoma, sans-serif",       best:["anak","bisnis"] },
      { id:"Verdana",          name:"Verdana",           sample:"Ilmu adalah cahaya yang menerangi",  css:"Verdana, Geneva, sans-serif",              best:["anak"] },
      { id:"Tahoma",           name:"Tahoma",            sample:"Ilmu adalah cahaya yang menerangi",  css:"Tahoma, Geneva, sans-serif",               best:["bisnis","akademik"] },
      { id:"Segoe UI",         name:"Segoe UI",          sample:"Ilmu adalah cahaya yang menerangi",  css:"'Segoe UI', Tahoma, sans-serif",           best:["bisnis"] },
      { id:"Franklin Gothic",  name:"Franklin Gothic",   sample:"Ilmu adalah cahaya yang menerangi",  css:"'Franklin Gothic Medium', Arial, sans-serif",best:["bisnis"] },
    ]
  },
  anak_font: {
    label: "Anak-anak — Ramah & Bulat",
    fonts: [
      { id:"Comic Sans MS",    name:"Comic Sans MS",     sample:"Belajar sambil bermain itu asyik!",   css:"'Comic Sans MS', cursive, sans-serif",    best:["anak"] },
      { id:"Arial Rounded MT", name:"Arial Rounded",     sample:"Belajar sambil bermain itu asyik!",   css:"'Arial Rounded MT Bold', Arial, sans-serif",best:["anak"] },
    ]
  },
  arabic: {
    label: "Arab & Islami",
    fonts: [
      { id:"Amiri",            name:"Amiri",             sample:"بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ", css:"Amiri, serif",                           best:["islami"] },
      { id:"Traditional Arabic",name:"Traditional Arabic",sample:"بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",css:"'Traditional Arabic', Amiri, serif",     best:["islami"] },
    ]
  }
};

const ALL_FONTS = Object.values(FONT_CATALOG).flatMap(g => g.fonts);
const getFontCss = id => ALL_FONTS.find(f=>f.id===id)?.css || id;

// ════════════════════════════════════════════════
// MEDIA TYPE
// ════════════════════════════════════════════════
const MEDIA = {
  cetak: {
    label:"Buku Cetak", icon:"📗",
    desc:"Margin asimetris · header/footer · nomor halaman",
    margins:{
      islami:{top:1134,bottom:1418,outer:1020,inner:1250,gutter:360},
      anak:{top:1020,bottom:1134,outer:1020,inner:1250,gutter:288},
      akademik:{top:1440,bottom:1440,outer:1440,inner:1800,gutter:360},
      memoir:{top:1134,bottom:1418,outer:1020,inner:1250,gutter:360},
      bisnis:{top:1134,bottom:1418,outer:1020,inner:1250,gutter:360},
      fiksi:{top:1134,bottom:1418,outer:1020,inner:1250,gutter:360},
    },
    hasHeader:true, hasFooter:true,
  },
  ebook: {
    label:"E-Book Digital", icon:"📱",
    desc:"Margin tipis seragam · font layar · tanpa nomor halaman",
    margins:{
      islami:{top:568,bottom:568,outer:568,inner:568,gutter:0},
      anak:{top:568,bottom:568,outer:568,inner:568,gutter:0},
      akademik:{top:720,bottom:720,outer:720,inner:720,gutter:0},
      memoir:{top:568,bottom:568,outer:568,inner:568,gutter:0},
      bisnis:{top:568,bottom:568,outer:568,inner:568,gutter:0},
      fiksi:{top:568,bottom:568,outer:568,inner:568,gutter:0},
    },
    hasHeader:false, hasFooter:false,
  },
};

// ════════════════════════════════════════════════
// THEMES
// ════════════════════════════════════════════════
const THEMES = {
  islami:{
    label:"Islami / Religi",desc:"Tafsir, fiqh, biografi ulama, doa",icon:"📖",
    palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32","#8B6914"],
    bg:"#F5F0E8",text:"#1a1a1a",
    defaultHeadFont:"Amiri",defaultBodyFont:"Palatino Linotype",
    headingSize:40,bodySize:24,ebookBodySize:26,
    bodyAlign:"both",bodyLine:400,bodyIndent:720,bodyAfter:0,
    ebookBodyLine:440,ebookBodyIndent:0,ebookBodyAfter:160,
    pullquoteSize:28,arabicFont:"Amiri",arabicSize:36,footnoteSize:18,
    headingStyle:"islami",footerStyle:"ornamen",headerStyle:"ornamen",
    ornamen:"✦",primary:"#1B4F72",accent:"#C9A227",
  },
  anak:{
    label:"Anak-anak",desc:"Cerita anak, dongeng, edukasi",icon:"🎨",
    palette:["#E53935","#FDD835","#43A047","#1E88E5","#FF7043"],
    bg:"#FFFDE7",text:"#1a1a1a",
    defaultHeadFont:"Trebuchet MS",defaultBodyFont:"Trebuchet MS",
    headingSize:46,bodySize:28,ebookBodySize:30,
    bodyAlign:"left",bodyLine:480,bodyIndent:0,bodyAfter:200,
    ebookBodyLine:520,ebookBodyIndent:0,ebookBodyAfter:240,
    pullquoteSize:30,arabicFont:"Amiri",arabicSize:32,footnoteSize:20,
    headingStyle:"anak",footerStyle:"warna",headerStyle:"warna",
    ornamen:"★",primary:"#E53935",accent:"#FDD835",
  },
  akademik:{
    label:"Akademik / Ilmiah",desc:"Skripsi, jurnal, textbook",icon:"🎓",
    palette:["#1A237E","#1565C0","#546E7A","#37474F","#B0BEC5"],
    bg:"#FFFFFF",text:"#111111",
    defaultHeadFont:"Times New Roman",defaultBodyFont:"Times New Roman",
    headingSize:32,bodySize:24,ebookBodySize:26,
    bodyAlign:"both",bodyLine:360,bodyIndent:0,bodyAfter:120,
    ebookBodyLine:400,ebookBodyIndent:0,ebookBodyAfter:160,
    pullquoteSize:22,arabicFont:"Traditional Arabic",arabicSize:28,footnoteSize:18,
    headingStyle:"akademik",footerStyle:"angka",headerStyle:"kiri-kanan",
    ornamen:"",primary:"#1A237E",accent:"#1565C0",
  },
  memoir:{
    label:"Memoir / Sastra",desc:"Memoar, novel, cerpen, biografi",icon:"✍️",
    palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41","#EFEBE9"],
    bg:"#FDF6EE",text:"#2c1a0e",
    defaultHeadFont:"Garamond",defaultBodyFont:"Garamond",
    headingSize:38,bodySize:24,ebookBodySize:26,
    bodyAlign:"both",bodyLine:400,bodyIndent:640,bodyAfter:0,
    ebookBodyLine:440,ebookBodyIndent:0,ebookBodyAfter:160,
    pullquoteSize:26,arabicFont:"Amiri",arabicSize:32,footnoteSize:18,
    headingStyle:"memoir",footerStyle:"titik",headerStyle:"italic",
    ornamen:"❧",primary:"#4E342E",accent:"#A1887F",
  },
  bisnis:{
    label:"Bisnis / Profesional",desc:"Manajemen, self-help, motivasi",icon:"💼",
    palette:["#212121","#C62828","#424242","#757575","#F5F5F5"],
    bg:"#FFFFFF",text:"#111111",
    defaultHeadFont:"Arial",defaultBodyFont:"Arial",
    headingSize:34,bodySize:22,ebookBodySize:24,
    bodyAlign:"both",bodyLine:340,bodyIndent:0,bodyAfter:180,
    ebookBodyLine:380,ebookBodyIndent:0,ebookBodyAfter:200,
    pullquoteSize:28,arabicFont:"Amiri",arabicSize:28,footnoteSize:18,
    headingStyle:"bisnis",footerStyle:"kanan",headerStyle:"bold",
    ornamen:"◆",primary:"#212121",accent:"#C62828",
  },
  fiksi:{
    label:"Fiksi / Novel",desc:"Novel, romance, thriller, fantasi",icon:"📚",
    palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8","#F3E5F5"],
    bg:"#FAF7FF",text:"#1a1a2e",
    defaultHeadFont:"Palatino Linotype",defaultBodyFont:"Palatino Linotype",
    headingSize:40,bodySize:23,ebookBodySize:26,
    bodyAlign:"both",bodyLine:380,bodyIndent:680,bodyAfter:0,
    ebookBodyLine:420,ebookBodyIndent:0,ebookBodyAfter:160,
    pullquoteSize:24,arabicFont:"Amiri",arabicSize:30,footnoteSize:18,
    headingStyle:"fiksi",footerStyle:"titik",headerStyle:"italic",
    ornamen:"✦",primary:"#4A148C",accent:"#7B1FA2",
  },
};

const FORMATS={A5:{w:8391,h:11906,label:"A5 (14.8×21 cm)"},A4:{w:11906,h:16838,label:"A4 (21×29.7 cm)"},B5:{w:9978,h:14175,label:"B5 (17.6×25 cm)"},Custom:{w:8788,h:13032,label:"Custom (15.5×23 cm)"}};
const EBOOK_FORMATS={"Tablet 7\"":{w:5760,h:8640,label:'Tablet 7"'},"Tablet 10\"":{w:7920,h:11520,label:'Tablet 10"'},Kindle:{w:7272,h:9792,label:"Kindle"},A4:{w:11906,h:16838,label:"A4 Layar"}};
const STEPS=["Media & Tema","Font","Format & Konten","Metadata","Preview & Unduh"];
const COMMON_ID=new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","buku","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","bang","kak","lagi","pula","sedang","sambil","selama","hingga","sampai","bahkan","hanya","saja","juga","memang","tentu","malah","justru","tapi","kalau","walau","meski"]);
const isForeign=w=>/^[a-zA-Z]/.test(w)&&!w.toLowerCase().split(/\s+/).every(x=>COMMON_ID.has(x)||x.length<=2);
const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export default function App(){
  const[step,setStep]=useState(0);
  const[media,setMedia]=useState("cetak");
  const[theme,setTheme]=useState("islami");
  const[format,setFormat]=useState("A5");
  const[content,setContent]=useState("");
  const[fileName,setFileName]=useState("");
  const[meta,setMeta]=useState({judul:"",penulis:"",penerbit:"",tahun:new Date().getFullYear(),subjudul:""});
  const[generating,setGenerating]=useState(false);
  const[preview,setPreview]=useState(null);
  const[dragOver,setDragOver]=useState(false);
  const[status,setStatus]=useState("");
  // Font state — per-element
  const[headFont,setHeadFont]=useState("Amiri");
  const[bodyFont,setBodyFont]=useState("Palatino Linotype");
  const[fontTab,setFontTab]=useState("serif");

  const TH=THEMES[theme];
  const M=MEDIA[media];
  const isEbook=media==="ebook";
  const ph=TH.primary.replace("#","");
  const ah=TH.accent.replace("#","");

  const activeHeadFont=getFontCss(headFont);
  const activeBodyFont=getFontCss(bodyFont);
  const activeBodySize=isEbook?TH.ebookBodySize:TH.bodySize;
  const activeBodyLine=isEbook?TH.ebookBodyLine:TH.bodyLine;
  const activeBodyIndent=isEbook?TH.ebookBodyIndent:TH.bodyIndent;
  const activeBodyAfter=isEbook?TH.ebookBodyAfter:TH.bodyAfter;

  // Sync default fonts when theme changes
  const handleThemeChange=t=>{
    setTheme(t);
    setHeadFont(THEMES[t].defaultHeadFont);
    setBodyFont(THEMES[t].defaultBodyFont);
  };

  const handleFile=useCallback((file)=>{
    if(!file)return;
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
        if(cur)sections.push({...cur,paragraphs:paras});
        cur={type:"heading",text:line.replace(/^#+\s*/,"")};paras=[];
      }else if(/^\[KUTIPAN\]/i.test(line))paras.push({type:"pullquote",text:line.replace(/^\[KUTIPAN\]/i,"").trim()});
      else if(/^\[ARAB\]/i.test(line))paras.push({type:"arabic",text:line.replace(/^\[ARAB\]/i,"").trim()});
      else if(/^\[CATATAN\]/i.test(line))paras.push({type:"footnote",text:line.replace(/^\[CATATAN\]/i,"").trim()});
      else paras.push({type:"paragraph",text:line});
    }
    if(cur)sections.push({...cur,paragraphs:paras});
    else if(paras.length)sections.push({type:"body",text:"",paragraphs:paras});
    return sections;
  };

  const italicHTML=text=>text.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g,m=>isForeign(m)?`<em>${m}</em>`:m);

  // ════════════════════════════════════════════════
  // BUILD DOCX
  // ════════════════════════════════════════════════
  const buildDocx=async()=>{
    if(!window.JSZip){
      await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});
    }
    const sections=parseContent(content);
    const fmt=isEbook?EBOOK_FORMATS[format]||EBOOK_FORMATS["Tablet 10\""]:FORMATS[format]||FORMATS.A5;
    const mg=M.margins[theme];
    const hf=headFont; const bf=bodyFont;

    const run=(text,opts={})=>{
      const rPr=[
        opts.bold?"<w:b/><w:bCs/>":"",
        opts.italic?"<w:i/><w:iCs/>":"",
        opts.size?`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`:"",
        opts.color?`<w:color w:val="${opts.color}"/>`:"",
        opts.font?`<w:rFonts w:ascii="${opts.font}" w:hAnsi="${opts.font}" w:cs="${opts.font}"/>`:"",
        opts.rtl?"<w:rtl/>":"",
      ].filter(Boolean).join("");
      return `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
    };

    const runMixed=(text,opts={})=>
      text.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g).filter(Boolean)
        .map(part=>run(part,{...opts,italic:opts.italic||isForeign(part)})).join("");

    // FIX PARAGRAPH SPACING: gunakan spasi after tetap, line spacing eksak
    // Tidak ada widows/orphans, tidak ada spasi extra dari Word
    const para=(runs,opts={})=>{
      const pPr=[
        opts.align?`<w:jc w:val="${opts.align}"/>`:"",
        // FIX: gunakan exact spacing — after selalu 0 atau nilai kecil, before selalu explicit
        `<w:spacing w:before="${opts.before||0}" w:after="${opts.after||0}" w:line="${opts.line||240}" w:lineRule="${opts.lineRule||'auto'}"/>`,
        opts.indent?`<w:ind w:firstLine="${opts.indent}"/>`:"",
        opts.indLR?`<w:ind w:left="${opts.indLR}" w:right="${opts.indLR}"/>`:"",
        opts.indL?`<w:ind w:left="${opts.indL}"/>`:"",
        opts.pageBreak?"<w:pageBreakBefore/>":"",
        opts.keepNext?"<w:keepNext/>":"",
        opts.keepLines?"<w:keepLines/>":"",
        opts.rtl?"<w:bidi/>":"",
        opts.shading?`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shading}"/>`:"",
        // Widow/orphan control — mencegah paragraf terpotong aneh
        "<w:widowControl/>",
        opts.borderL||opts.borderTop||opts.borderFull?`<w:pBdr>${
          opts.borderL?`<w:left w:val="single" w:sz="${opts.borderLSz||12}" w:space="8" w:color="${ah}"/>`:""}${
          opts.borderFull?`<w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/><w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/>`:""}${
          opts.borderTop?`<w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/>`:""}
        </w:pBdr>`:"",
      ].filter(Boolean).join("");
      return `<w:p><w:pPr>${pPr}</w:pPr>${runs}</w:p>`;
    };

    let body="";

    // ── COVER ESTETIK per tema ───────────────────────
    const hSz=TH.headingSize; const hSzE=hSz+4;
    const coverSz=isEbook?hSzE:hSz;

    if(theme==="islami"){
      // Cover: Islami — bismillah atas, garis emas, judul Amiri, ornamen
      body+=para(run("",{size:8}),{after:0});
      body+=para(run("بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",{size:32,font:"Amiri",color:ah,rtl:true}),{align:"center",before:isEbook?480:600,after:0,rtl:true});
      body+=para(run("",{size:8}),{after:0,borderFull:true});
      body+=para(run("",{size:24}),{after:0});
      body+=para(run(meta.judul||"Judul Buku",{bold:true,size:coverSz,color:ph,font:hf}),{align:"center",before:0,after:0,keepNext:true});
      if(meta.subjudul)body+=para(run(meta.subjudul,{italic:true,size:28,color:ah,font:hf}),{align:"center",before:80,after:0});
      body+=para(run(`── ${TH.ornamen} ──`,{size:24,color:ah}),{align:"center",before:160,after:0});
      body+=para(run("",{size:24}),{after:0});
      body+=para(run(meta.penulis||"",{size:26,color:ph,font:hf}),{align:"center",before:0,after:0});
      if(meta.penerbit)body+=para(run(meta.penerbit,{size:20,color:"777777",font:bf}),{align:"center",before:80,after:0});
      body+=para(run(String(meta.tahun),{size:18,color:"999999"}),{align:"center",before:60,after:0});
      body+=para(run("",{size:24}),{before:0,after:0,borderFull:true});
    } else if(theme==="anak"){
      // Cover: Anak — warna-warni, besar, playful
      body+=para(run("",{size:48}),{before:240,after:0,shading:TH.bg.replace("#","")});
      body+=para(run(`${TH.ornamen} ${meta.judul||"Judul Buku"} ${TH.ornamen}`,{bold:true,size:coverSz+10,color:ph,font:hf}),{align:"center",before:0,after:0,shading:TH.bg.replace("#",""),keepNext:true});
      if(meta.subjudul)body+=para(run(meta.subjudul,{size:36,color:"438a47",font:hf}),{align:"center",before:80,after:0});
      body+=para(run("★  ◆  ★",{size:36,color:ah}),{align:"center",before:160,after:0});
      body+=para(run("",{size:36}),{after:0});
      body+=para(run(meta.penulis||"",{bold:true,size:30,color:ph,font:bf}),{align:"center",before:0,after:0});
      if(meta.penerbit)body+=para(run(meta.penerbit,{size:24,color:"777777"}),{align:"center",before:80,after:0});
    } else if(theme==="akademik"){
      // Cover: Akademik — formal, simetris, minimalis
      body+=para(run("",{size:8}),{before:0,after:0,borderFull:true});
      body+=para(run((meta.penerbit||"UNIVERSITAS / LEMBAGA").toUpperCase(),{size:22,color:ph,font:hf}),{align:"center",before:480,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run("",{size:8}),{borderFull:true,before:0,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run((meta.judul||"JUDUL PENELITIAN").toUpperCase(),{bold:true,size:coverSz,color:ph,font:hf}),{align:"center",before:0,after:0,keepNext:true});
      if(meta.subjudul)body+=para(run(meta.subjudul,{size:24,color:"444444",font:hf}),{align:"center",before:100,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run("",{size:8}),{borderFull:true,before:0,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run("Oleh:",{size:22,color:"555555",font:bf}),{align:"center",before:0,after:0});
      body+=para(run(meta.penulis||"",{bold:true,size:26,color:ph,font:bf}),{align:"center",before:80,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run(String(meta.tahun),{size:22,color:"555555",font:bf}),{align:"center",before:0,after:0});
      body+=para(run("",{size:8}),{borderFull:true,before:120,after:0});
    } else if(theme==="memoir"){
      // Cover: Memoir — elegan, minimalis, satu garis ornamen
      body+=para(run("",{size:48}),{before:480,after:0});
      body+=para(run("",{size:48}),{after:0});
      body+=para(run(meta.judul||"Judul Buku",{size:coverSz,color:ph,font:hf}),{align:"center",before:0,after:0,keepNext:true});
      if(meta.subjudul)body+=para(run(meta.subjudul,{italic:true,size:24,color:ah,font:hf}),{align:"center",before:100,after:0});
      body+=para(run("",{size:8}),{borderFull:true,before:240,after:0});
      body+=para(run("❧",{size:52,color:ah,font:hf}),{align:"center",before:160,after:0});
      body+=para(run("",{size:8}),{borderFull:true,before:0,after:0});
      body+=para(run("",{size:36}),{after:0});
      body+=para(run(meta.penulis||"",{size:24,color:ph,font:bf}),{align:"center",before:0,after:0});
      if(meta.penerbit)body+=para(run(meta.penerbit,{size:18,color:"888888",font:bf}),{align:"center",before:80,after:0});
      body+=para(run(String(meta.tahun),{size:18,color:"aaaaaa",font:bf}),{align:"center",before:60,after:0});
    } else if(theme==="bisnis"){
      // Cover: Bisnis — modern, asimetris, bold accent
      body+=para(run("",{size:8}),{shading:ph,before:0,after:0});
      body+=para(run("",{size:8}),{shading:ph,before:0,after:0});
      body+=para(run("",{size:8}),{shading:ph,before:0,after:0});
      body+=para(run("",{size:48}),{before:360,after:0});
      body+=para(run(meta.judul||"JUDUL BUKU",{bold:true,size:coverSz+6,color:ph,font:hf}),{align:"left",before:0,after:0,keepNext:true,borderL:true,borderLSz:28});
      if(meta.subjudul)body+=para(run(meta.subjudul,{size:24,color:ah,font:bf}),{align:"left",before:100,after:0,indL:160});
      body+=para(run("",{size:8}),{borderFull:true,before:240,after:0});
      body+=para(run("",{size:28}),{after:0});
      body+=para(run(meta.penulis||"",{bold:true,size:26,color:ph,font:bf}),{align:"left",before:0,after:0});
      if(meta.penerbit)body+=para(run(meta.penerbit,{size:20,color:"666666",font:bf}),{align:"left",before:80,after:0});
    } else {
      // Cover: Fiksi — dramatis, ornamen ✦, judul besar italic
      body+=para(run("",{size:48}),{before:600,after:0});
      body+=para(run("",{size:48}),{after:0});
      body+=para(run(meta.judul||"Judul Buku",{size:coverSz+4,italic:true,color:ph,font:hf}),{align:"center",before:0,after:0,keepNext:true});
      body+=para(run("✦",{size:32,color:ah}),{align:"center",before:80,after:0,keepNext:true});
      body+=para(run("",{size:8}),{before:0,after:0,borderFull:true});
      if(meta.subjudul)body+=para(run(meta.subjudul,{italic:true,size:22,color:ah,font:hf}),{align:"center",before:160,after:0});
      body+=para(run("",{size:36}),{after:0});
      body+=para(run(meta.penulis||"",{italic:true,size:22,color:"555555",font:bf}),{align:"center",before:0,after:0});
      if(meta.penerbit)body+=para(run(meta.penerbit,{size:18,color:"888888"}),{align:"center",before:80,after:0});
    }

    // ── KONTEN per tema ─────────────────────────────
    for(const sec of sections){
      if(sec.type==="heading"){
        if(theme==="islami"){
          body+=para(run("",{size:4}),{borderFull:true,before:0,after:0});
          body+=para(run(sec.text,{bold:true,size:TH.headingSize,color:ph,font:hf}),{align:"center",pageBreak:!isEbook,before:isEbook?400:280,after:0,keepNext:true,shading:"F5F0E8"});
          body+=para(run(`── ${TH.ornamen} ──`,{size:18,color:ah}),{align:"center",before:60,after:280,keepNext:true});
        }else if(theme==="anak"){
          body+=para(run(`${TH.ornamen} ${sec.text} ${TH.ornamen}`,{bold:true,size:TH.headingSize,color:ph,font:hf}),{align:"center",pageBreak:!isEbook,before:isEbook?400:280,after:200,keepNext:true,shading:TH.bg.replace("#","")});
        }else if(theme==="akademik"){
          body+=para(run(sec.text.toUpperCase(),{bold:true,size:TH.headingSize,color:ph,font:hf}),{align:"center",pageBreak:!isEbook,before:isEbook?400:400,after:0,keepNext:true});
          body+=para(run("",{size:4}),{borderFull:true,before:0,after:360,keepNext:true});
        }else if(theme==="memoir"){
          body+=para(run(sec.text,{size:TH.headingSize,color:ph,font:hf}),{align:"center",pageBreak:!isEbook,before:isEbook?400:800,after:0,keepNext:true});
          body+=para(run("❧",{size:28,color:ah,font:hf}),{align:"center",before:60,after:360,keepNext:true});
        }else if(theme==="bisnis"){
          body+=para(run(sec.text,{bold:true,size:TH.headingSize,color:ph,font:hf}),{align:"left",pageBreak:!isEbook,before:isEbook?400:300,after:0,keepNext:true,borderL:true,borderLSz:24});
          body+=para(run("",{size:4}),{borderTop:true,before:0,after:200,keepNext:true});
        }else{
          body+=para(run(sec.text,{size:TH.headingSize,color:ph,font:hf}),{align:"center",pageBreak:!isEbook,before:isEbook?400:800,after:0,keepNext:true});
          body+=para(run("✦  ✦  ✦",{size:20,color:ah}),{align:"center",before:60,after:360,keepNext:true});
        }
      }
      for(const p of sec.paragraphs||[]){
        if(p.type==="paragraph"){
          // FIX UTAMA: after=0 untuk cetak (indent paragraf), after=kecil untuk ebook
          // lineRule=auto dengan line tetap — tidak ada loncat aneh
          body+=para(
            runMixed(p.text,{size:activeBodySize,font:bf}),
            {align:TH.bodyAlign,indent:activeBodyIndent,line:activeBodyLine,
             after:activeBodyAfter,before:0,keepLines:true,lineRule:"auto"}
          );
        }else if(p.type==="pullquote"){
          if(theme==="islami")body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ph,font:hf}),{align:"center",indLR:720,before:200,after:200,keepLines:true,borderL:true,borderLSz:18});
          else if(theme==="anak")body+=para(run(`"${p.text}"`,{bold:true,size:TH.pullquoteSize,color:ph,font:hf}),{align:"center",before:160,after:160,keepLines:true,shading:TH.bg.replace("#",""),borderFull:true});
          else if(theme==="akademik")body+=para(run(p.text,{italic:true,size:TH.pullquoteSize,color:"444444",font:bf}),{align:"both",indLR:1440,before:160,after:160,keepLines:true,borderL:true,borderLSz:6});
          else if(theme==="memoir")body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ph,font:hf}),{align:"center",before:240,after:240,keepLines:true});
          else if(theme==="bisnis")body+=para(run(`"${p.text}"`,{bold:true,size:TH.pullquoteSize,color:ph,font:"Arial Narrow"}),{align:"left",indLR:720,before:160,after:160,keepLines:true,shading:"F5F5F5",borderL:true,borderLSz:20});
          else body+=para(run(`"${p.text}"`,{italic:true,size:TH.pullquoteSize,color:ah,font:hf}),{align:"center",before:240,after:240,keepLines:true});
        }else if(p.type==="arabic"){
          body+=para(run(p.text,{size:TH.arabicSize,font:TH.arabicFont,rtl:true}),{align:"right",before:160,after:160,rtl:true,keepLines:true});
        }else if(p.type==="footnote"){
          body+=para(run(`* ${p.text}`,{size:TH.footnoteSize,color:"666666",font:bf}),{before:160,after:0,borderTop:true});
        }
      }
    }

    // Section props + margin
    const headerRef=M.hasHeader?`<w:headerReference w:type="default" r:id="rId3"/>`:"";
    const footerRef=M.hasFooter?`<w:footerReference w:type="default" r:id="rId4"/>`:"";
    const marginXml=isEbook
      ?`<w:pgMar w:top="${mg.top}" w:right="${mg.outer}" w:bottom="${mg.bottom}" w:left="${mg.inner}" w:header="0" w:footer="0" w:gutter="0"/>`
      :`<w:pgMar w:top="${mg.top}" w:right="${mg.outer}" w:bottom="${mg.bottom}" w:left="${mg.inner}" w:header="568" w:footer="568" w:gutter="${mg.gutter}"/>`;
    body+=`<w:sectPr>${headerRef}${footerRef}<w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>${marginXml}</w:sectPr>`;

    // Header/Footer XML
    const buildHeader=()=>{
      if(!M.hasHeader)return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:hdr>`;
      const s=TH.headerStyle;
      const borderB=`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
      const borderBT=`<w:pBdr><w:bottom w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;
      if(s==="ornamen")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/>${borderB}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r></w:p></w:hdr>`;
      if(s==="warna")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="left"/>${borderB}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="22"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r></w:p></w:hdr>`;
      if(s==="kiri-kanan")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="left"/>${borderB}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.inner-mg.outer}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:hdr>`;
      if(s==="italic")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul Buku")}</w:t></w:r></w:p></w:hdr>`;
      if(s==="bold")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="left"/>${borderBT}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:color w:val="AAAAAA"/><w:sz w:val="17"/></w:rPr><w:t xml:space="preserve">  |  ${esc(meta.judul||"Judul")}</w:t></w:r></w:p></w:hdr>`;
      return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:hdr>`;
    };

    const pgNum=`<w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    const buildFooter=()=>{
      if(!M.hasFooter)return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:ftr>`;
      const s=TH.footerStyle;
      const borderT=`<w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
      const borderTB=`<w:pBdr><w:top w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;
      if(s==="ornamen")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/>${borderT}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r>${pgNum}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r></w:p></w:ftr>`;
      if(s==="warna")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="24"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
      if(s==="angka")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/>${borderT}</w:pPr>${pgNum}</w:p></w:ftr>`;
      if(s==="titik")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">— </w:t></w:r>${pgNum}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve"> —</w:t></w:r></w:p></w:ftr>`;
      if(s==="kanan")return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="left"/>${borderTB}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.inner-mg.outer}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="17"/><w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:tab/></w:r>${pgNum}</w:p></w:ftr>`;
      return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p/></w:ftr>`;
    };

    const overrides=[
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`,
      `<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>`,
      M.hasHeader?`<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>`:"",
      M.hasFooter?`<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`:"",
    ].filter(Boolean).join("\n");

    const zip=new window.JSZip();
    zip.file("[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${overrides}</Types>`);
    zip.file("_rels/.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    zip.file("word/document.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"><w:body>${body}</w:body></w:document>`);
    zip.file("word/styles.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/><w:sz w:val="${activeBodySize}"/><w:szCs w:val="${activeBodySize}"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`);
    zip.file("word/settings.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
    zip.file("word/_rels/document.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${M.hasHeader?`<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>`:""}${M.hasFooter?`<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>`:""}
</Relationships>`);
    if(M.hasHeader)zip.file("word/header1.xml",buildHeader());
    if(M.hasFooter)zip.file("word/footer1.xml",buildFooter());

    const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`${(meta.judul||"buku").replace(/\s+/g,"_")}_${theme}_${media}.docx`;
    a.click();URL.revokeObjectURL(url);
  };

  const downloadDocx=async()=>{
    setGenerating(true);setStatus("Memuat library...");
    try{await buildDocx();setStatus("✅ File berhasil diunduh!");}
    catch(e){console.error(e);setStatus("❌ Gagal: "+e.message);}
    setGenerating(false);setTimeout(()=>setStatus(""),4000);
  };

  const generatePreview=()=>{
    setGenerating(true);
    setTimeout(()=>{setPreview(parseContent(content));setGenerating(false);setStep(4);},400);
  };

  const canNext=[true,true,content.trim().length>10,meta.judul.trim().length>0&&meta.penulis.trim().length>0,true];
  const fmtOptions=isEbook?EBOOK_FORMATS:FORMATS;

  // ════════════════════════════════════════════════
  // FONT PICKER COMPONENT
  // ════════════════════════════════════════════════
  const FontPicker=({value,onChange,label,filterBest})=>{
    const recommended=ALL_FONTS.filter(f=>f.best.includes(theme));
    return(
      <div style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,color:"#444",marginBottom:8}}>{label}</div>
        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
          {["recommended","serif","sansserif","anak_font"].map(t=>(
            <button key={t} onClick={()=>setFontTab(t)} style={{
              padding:"4px 10px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
              background:fontTab===t?TH.primary:"#f1f5f9",
              color:fontTab===t?"#fff":"#555"
            }}>
              {t==="recommended"?"⭐ Rekomendasi":t==="serif"?"Serif":t==="sansserif"?"Sans-Serif":"Anak-anak"}
            </button>
          ))}
        </div>
        {/* Font list */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,maxHeight:240,overflowY:"auto",paddingRight:4}}>
          {(fontTab==="recommended"?recommended:FONT_CATALOG[fontTab]?.fonts||[]).map(f=>(
            <div key={f.id} onClick={()=>onChange(f.id)} style={{
              border:value===f.id?`2px solid ${TH.primary}`:"1px solid #e5e7eb",
              borderRadius:8,padding:"10px 12px",cursor:"pointer",
              background:value===f.id?`${TH.primary}0d`:"#fff",transition:"all 0.15s"
            }}>
              <div style={{fontSize:11,fontWeight:700,color:value===f.id?TH.primary:"#444",marginBottom:4,fontFamily:"system-ui"}}>
                {f.name}
                {f.best.includes(theme)&&<span style={{marginLeft:5,fontSize:9,background:`${TH.accent}33`,color:TH.accent,borderRadius:3,padding:"1px 5px",fontWeight:700}}>Rekomendasi</span>}
              </div>
              {/* Sample teks dengan font aslinya */}
              <div style={{fontFamily:f.css,fontSize:f.id.includes("Arab")||f.id==="Amiri"?15:12,color:"#333",lineHeight:1.5,
                direction:f.id.includes("Arab")||f.id==="Traditional Arabic"?"rtl":"ltr"}}>
                {f.sample}
              </div>
            </div>
          ))}
        </div>
        {/* Selected */}
        {value&&<div style={{marginTop:8,padding:"8px 12px",background:`${TH.primary}08`,borderRadius:6,fontSize:11,color:TH.primary,fontWeight:600}}>
          ✓ Dipilih: <span style={{fontFamily:getFontCss(value)}}>{value}</span>
        </div>}
      </div>
    );
  };

  // ════════════════════════════════════════════════
  // COVER PREVIEW — estetik per tema
  // ════════════════════════════════════════════════
  const CoverPreview=()=>(
    <div style={{
      width:"100%",maxWidth:240,margin:"0 auto",
      aspectRatio:"1/1.414",position:"relative",overflow:"hidden",
      borderRadius:8,boxShadow:"4px 8px 24px rgba(0,0,0,0.18)",
      background:TH.bg,fontFamily:activeHeadFont,
    }}>
      {theme==="islami"&&<>
        <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:TH.accent}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:6,background:TH.accent}}/>
        <div style={{padding:"18px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
          <div style={{fontSize:10,color:TH.accent,fontFamily:"Amiri,serif",direction:"rtl",letterSpacing:1}}>بِسْمِ اللهِ</div>
          <div style={{width:"80%",height:1,background:TH.accent}}/>
          <div style={{fontSize:15,fontWeight:700,color:TH.primary,textAlign:"center",lineHeight:1.3,fontFamily:activeHeadFont}}>{meta.judul||"Judul Buku"}</div>
          {meta.subjudul&&<div style={{fontSize:9,color:TH.accent,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
          <div style={{fontSize:11,color:TH.accent}}>── ✦ ──</div>
          <div style={{fontSize:10,color:TH.primary,fontFamily:activeBodyFont}}>{meta.penulis||"Nama Penulis"}</div>
          {meta.penerbit&&<div style={{fontSize:8,color:"#888"}}>{meta.penerbit}</div>}
          <div style={{width:"80%",height:1,background:TH.accent,marginTop:4}}/>
        </div>
      </>}
      {theme==="anak"&&<>
        <div style={{position:"absolute",top:0,left:0,right:0,height:8,background:`linear-gradient(90deg,${TH.primary},${TH.accent},#43A047,#1E88E5)`}}/>
        <div style={{padding:"16px 14px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
          <div style={{fontSize:24}}>🌟</div>
          <div style={{fontSize:16,fontWeight:700,color:TH.primary,textAlign:"center",fontFamily:activeHeadFont,lineHeight:1.2}}>★ {meta.judul||"Judul Buku"} ★</div>
          {meta.subjudul&&<div style={{fontSize:9,color:"#43A047",fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
          <div style={{fontSize:14,color:TH.accent}}>★  ◆  ★</div>
          <div style={{fontSize:11,fontWeight:700,color:TH.primary,fontFamily:activeBodyFont}}>{meta.penulis||"Nama Penulis"}</div>
          {meta.penerbit&&<div style={{fontSize:8,color:"#777"}}>{meta.penerbit}</div>}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:8,background:`linear-gradient(90deg,#1E88E5,#43A047,${TH.accent},${TH.primary})`}}/>
      </>}
      {theme==="akademik"&&<>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:TH.primary}}/>
        <div style={{position:"absolute",top:4,left:0,right:0,height:1.5,background:TH.accent}}/>
        <div style={{padding:"16px 14px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
          <div style={{fontSize:8,color:TH.primary,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{meta.penerbit||"Universitas / Lembaga"}</div>
          <div style={{width:"100%",height:1,background:TH.primary}}/>
          <div style={{width:"100%",height:0.5,background:TH.accent,marginTop:2}}/>
          <div style={{width:"100%",height:0.5,background:TH.accent}}/>
          <div style={{height:8}}/>
          <div style={{fontSize:13,fontWeight:700,color:TH.primary,textAlign:"center",fontFamily:activeHeadFont,lineHeight:1.3,textTransform:"uppercase",letterSpacing:0.5}}>{meta.judul||"JUDUL PENELITIAN"}</div>
          {meta.subjudul&&<div style={{fontSize:8,color:"#444",textAlign:"center"}}>{meta.subjudul}</div>}
          <div style={{height:6}}/>
          <div style={{width:"100%",height:0.5,background:TH.accent}}/>
          <div style={{width:"100%",height:0.5,background:TH.accent,marginBottom:2}}/>
          <div style={{width:"100%",height:1,background:TH.primary}}/>
          <div style={{height:6}}/>
          <div style={{fontSize:8,color:"#555"}}>Oleh:</div>
          <div style={{fontSize:10,fontWeight:700,color:TH.primary,fontFamily:activeBodyFont}}>{meta.penulis||"Nama Penulis"}</div>
          <div style={{fontSize:8,color:"#777"}}>{meta.tahun}</div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,background:TH.primary}}/>
      </>}
      {theme==="memoir"&&<>
        <div style={{position:"absolute",inset:6,border:`1px solid ${TH.accent}`,borderRadius:4,pointerEvents:"none"}}/>
        <div style={{padding:"22px 18px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
          <div style={{fontSize:20,fontFamily:activeHeadFont,color:TH.primary,textAlign:"center",lineHeight:1.3}}>{meta.judul||"Judul Buku"}</div>
          {meta.subjudul&&<div style={{fontSize:8,color:TH.accent,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
          <div style={{width:"50%",height:0.5,background:TH.accent}}/>
          <div style={{fontSize:16,color:TH.accent,fontFamily:activeHeadFont}}>❧</div>
          <div style={{width:"50%",height:0.5,background:TH.accent}}/>
          <div style={{fontSize:9,color:TH.primary,fontFamily:activeBodyFont,marginTop:4}}>{meta.penulis||"Nama Penulis"}</div>
          {meta.penerbit&&<div style={{fontSize:7,color:"#999"}}>{meta.penerbit}</div>}
        </div>
      </>}
      {theme==="bisnis"&&<>
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"42%",background:TH.primary}}/>
        <div style={{position:"absolute",top:"40%",left:0,width:"100%",height:4,background:TH.accent}}/>
        <div style={{padding:"14px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:7,color:"rgba(255,255,255,0.7)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{meta.penerbit||"PENERBIT"}</div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",lineHeight:1.2,fontFamily:activeHeadFont}}>{meta.judul||"JUDUL BUKU"}</div>
            {meta.subjudul&&<div style={{fontSize:8,color:TH.accent,marginTop:4}}>{meta.subjudul}</div>}
          </div>
          <div style={{paddingTop:12}}>
            <div style={{fontSize:9,fontWeight:700,color:TH.primary,fontFamily:activeBodyFont}}>{meta.penulis||"Nama Penulis"}</div>
            <div style={{fontSize:7,color:"#888",marginTop:2}}>{meta.tahun}</div>
          </div>
        </div>
      </>}
      {theme==="fiksi"&&<>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 30%, ${TH.accent}22 0%, transparent 70%)`}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${TH.accent},transparent)`}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${TH.accent},transparent)`}}/>
        <div style={{padding:"18px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:7}}>
          <div style={{fontSize:18,fontStyle:"italic",color:TH.primary,textAlign:"center",lineHeight:1.3,fontFamily:activeHeadFont}}>{meta.judul||"Judul Buku"}</div>
          <div style={{fontSize:14,color:TH.accent}}>✦</div>
          <div style={{width:"60%",height:0.5,background:`linear-gradient(90deg,transparent,${TH.accent},transparent)`}}/>
          {meta.subjudul&&<div style={{fontSize:8,color:TH.accent,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
          <div style={{height:8}}/>
          <div style={{fontSize:9,color:"#777",fontStyle:"italic",fontFamily:activeBodyFont}}>{meta.penulis||"Nama Penulis"}</div>
          {meta.penerbit&&<div style={{fontSize:7,color:"#aaa"}}>{meta.penerbit}</div>}
        </div>
      </>}
    </div>
  );

  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:740,margin:"0 auto",padding:"1rem"}}>

      {/* Header */}
      <div style={{background:TH.primary,borderRadius:12,padding:"1rem 1.5rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:26}}>{TH.icon}</span>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:17}}>Book Layout Studio Pro</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>Layout profesional · Font kustom · Cover estetik · Cetak & Digital</div>
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
          <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:"#333"}}>Jenis Publikasi</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {Object.entries(MEDIA).map(([k,v])=>(
              <div key={k} onClick={()=>setMedia(k)} style={{border:media===k?`2px solid ${TH.primary}`:"1px solid #e5e7eb",borderRadius:10,padding:"13px 15px",cursor:"pointer",background:media===k?`${TH.primary}0f`:"#fff"}}>
                <div style={{fontSize:22,marginBottom:5}}>{v.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:media===k?TH.primary:"#1a1a1a"}}>{v.label}</div>
                <div style={{fontSize:11,color:"#777",marginTop:3}}>{v.desc}</div>
              </div>
            ))}
          </div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:"#333"}}>Kategori Buku</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:9}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <div key={k} onClick={()=>handleThemeChange(k)} style={{border:theme===k?`2px solid ${v.primary}`:"1px solid #e5e7eb",borderRadius:10,padding:"11px 13px",cursor:"pointer",background:theme===k?v.bg:"#fff"}}>
                <div style={{fontSize:20,marginBottom:3}}>{v.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:v.primary}}>{v.label}</div>
                <div style={{fontSize:10,color:"#888",marginTop:2,lineHeight:1.4}}>{v.desc}</div>
                <div style={{display:"flex",gap:3,marginTop:7}}>
                  {v.palette.slice(0,4).map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Font ── */}
      {step===1&&(
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:4,color:"#333"}}>Pilih Font Buku</div>
          <div style={{fontSize:11,color:"#888",marginBottom:16,lineHeight:1.6}}>
            Font yang ditandai <span style={{background:`${TH.accent}33`,color:TH.accent,borderRadius:3,padding:"1px 5px",fontWeight:700,fontSize:9}}>Rekomendasi</span> adalah pilihan terbaik untuk tema <strong>{TH.label}</strong>.
          </div>

          <FontPicker value={headFont} onChange={setHeadFont} label="🔠 Font Judul & Heading" filterBest={true}/>
          <FontPicker value={bodyFont} onChange={setBodyFont} label="📝 Font Isi / Body Text" filterBest={true}/>

          {/* Live preview */}
          <div style={{background:TH.bg,borderRadius:10,padding:"16px 18px",border:`1px solid ${TH.accent}44`,marginTop:4}}>
            <div style={{fontSize:10,fontWeight:700,color:TH.primary,marginBottom:10,letterSpacing:0.5}}>PREVIEW KOMBINASI FONT</div>
            <div style={{fontFamily:activeHeadFont,fontSize:16,fontWeight:TH.headingSize>=38?700:400,color:TH.primary,marginBottom:6}}>
              {meta.judul||"Judul Buku Contoh"}
            </div>
            <div style={{fontFamily:activeBodyFont,fontSize:12,color:TH.text,lineHeight:1.8,textAlign:"justify"}}>
              Ini adalah contoh teks isi buku dengan font yang dipilih. Bacaan yang nyaman dan estetis sangat bergantung pada pemilihan font yang tepat. <em>This is an example of foreign text in italic.</em> Kalimat berikutnya kembali ke Bahasa Indonesia yang baik dan benar.
            </div>
            <div style={{marginTop:8,fontSize:10,color:"#888"}}>
              Heading: <strong style={{fontFamily:activeHeadFont}}>{headFont}</strong> · Body: <strong style={{fontFamily:activeBodyFont}}>{bodyFont}</strong> · {activeBodySize/2}pt
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Format & Konten ── */}
      {step===2&&(
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:"#333"}}>Ukuran {isEbook?"Layar":"Halaman"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:8,marginBottom:18}}>
            {Object.entries(fmtOptions).map(([k,v])=>(
              <div key={k} onClick={()=>setFormat(k)} style={{border:format===k?`2px solid ${TH.primary}`:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",cursor:"pointer",background:format===k?`${TH.primary}11`:"#fff"}}>
                <div style={{fontSize:12,fontWeight:700,color:format===k?TH.primary:"#1a1a1a"}}>{k}</div>
                <div style={{fontSize:10,color:"#888"}}>{v.label}</div>
              </div>
            ))}
          </div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:7,color:"#333"}}>Upload atau Tempel Konten</div>
          <div style={{fontSize:11,color:"#666",marginBottom:11,lineHeight:1.7}}>
            Tag: <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}># BAB I</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[KUTIPAN]</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[ARAB]</code> · <code style={{background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>[CATATAN]</code>
          </div>
          <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop} onClick={()=>document.getElementById("fi").click()} style={{border:`2px dashed ${dragOver?TH.primary:"#d1d5db"}`,borderRadius:10,padding:18,textAlign:"center",cursor:"pointer",background:dragOver?`${TH.primary}08`:"#f9fafb",marginBottom:12}}>
            <div style={{fontSize:28,marginBottom:5}}>📂</div>
            <div style={{fontSize:12,fontWeight:600,color:TH.primary}}>{fileName||"Klik atau seret file .txt / .md ke sini"}</div>
            <div style={{fontSize:10,color:"#aaa",marginTop:3}}>Format: .txt dan .md</div>
            <input id="fi" type="file" accept=".txt,.md" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          <div style={{fontSize:11,color:"#bbb",textAlign:"center",marginBottom:8}}>— atau tempel teks langsung —</div>
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali."
            style={{width:"100%",minHeight:180,borderRadius:8,padding:"10px 12px",fontFamily:"inherit",fontSize:12,lineHeight:1.7,resize:"vertical",border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
          <div style={{fontSize:10,color:"#bbb",marginTop:4}}>{content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}</div>
        </div>
      )}

      {/* ── STEP 3: Metadata ── */}
      {step===3&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
          <div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:"#333"}}>Informasi Buku</div>
            {[{key:"judul",label:"Judul Buku *",ph:"Masukkan judul buku"},{key:"subjudul",label:"Sub-judul",ph:"Opsional"},{key:"penulis",label:"Nama Penulis *",ph:"Nama lengkap"},{key:"penerbit",label:"Penerbit",ph:"Nama penerbit"},{key:"tahun",label:"Tahun Terbit",ph:"2026"}].map(({key,label,ph:p})=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>{label}</label>
                <input value={meta[key]} onChange={e=>setMeta(m=>({...m,[key]:e.target.value}))} placeholder={p}
                  style={{width:"100%",padding:"8px 11px",borderRadius:7,fontSize:13,border:"1px solid #d1d5db",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          {/* Cover preview live */}
          <div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:"#333"}}>Preview Cover</div>
            <CoverPreview/>
            <div style={{fontSize:10,color:"#aaa",textAlign:"center",marginTop:8}}>Cover diperbarui otomatis</div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Preview & Unduh ── */}
      {step===4&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start",marginBottom:12}}>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:4}}>
                Preview Isi — <span style={{color:TH.primary}}>{TH.label}</span>
                <span style={{fontSize:10,marginLeft:8,background:isEbook?"#dbeafe":"#f0fdf4",color:isEbook?"#1e40af":"#166534",borderRadius:4,padding:"2px 7px",fontWeight:700}}>{M.label}</span>
              </div>
              <div style={{fontSize:10,color:"#888"}}>Font: <em>{headFont}</em> (heading) · <em>{bodyFont}</em> (body)</div>
            </div>
            <div style={{width:80}}>
              <CoverPreview/>
            </div>
          </div>

          {/* Isi preview */}
          <div style={{border:"1px solid #e5e7eb",borderRadius:8,background:TH.bg,padding:isEbook?"14px 16px":"20px 24px",maxHeight:360,overflowY:"auto",boxShadow:"2px 4px 16px rgba(0,0,0,0.07)"}}>
            {!isEbook&&(
              <div style={{borderBottom:`1.5px solid ${TH.accent}`,marginBottom:12,paddingBottom:5,display:"flex",justifyContent:TH.headerStyle==="kiri-kanan"||TH.headerStyle==="bold"?"space-between":"center",fontSize:9,color:TH.primary,fontFamily:activeHeadFont}}>
                {TH.headerStyle==="ornamen"&&<span style={{fontStyle:"italic"}}>{TH.ornamen} {meta.judul||"Judul Buku"} {TH.ornamen}</span>}
                {TH.headerStyle==="warna"&&<span style={{fontWeight:700}}>{meta.judul||"Judul Buku"}</span>}
                {TH.headerStyle==="kiri-kanan"&&<><span>{meta.judul||"Judul"}</span><span style={{color:"#aaa"}}>1</span></>}
                {TH.headerStyle==="italic"&&<span style={{fontStyle:"italic"}}>{meta.judul||"Judul Buku"}</span>}
                {TH.headerStyle==="bold"&&<><span style={{fontWeight:700}}>{meta.penulis||""}</span><span style={{color:"#aaa"}}> | {meta.judul||"Judul"}</span></>}
              </div>
            )}

            {preview&&preview.slice(0,6).map((sec,i)=>(
              <div key={i}>
                {sec.type==="heading"&&(
                  <div style={{
                    fontFamily:activeHeadFont,fontSize:14,fontWeight:TH.headingSize>=38?700:400,color:TH.primary,margin:"12px 0 6px",
                    ...(theme==="islami"?{textAlign:"center",background:"#F5F0E8",padding:"4px 6px",borderTop:`1px solid ${TH.accent}`,borderBottom:`1px solid ${TH.accent}`}:{}),
                    ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",borderRadius:6}:{}),
                    ...(theme==="akademik"?{textAlign:"center",letterSpacing:1,textTransform:"uppercase"}:{}),
                    ...(theme==="memoir"?{textAlign:"center"}:{}),
                    ...(theme==="bisnis"?{borderLeft:`3px solid ${TH.accent}`,paddingLeft:7}:{}),
                    ...(theme==="fiksi"?{textAlign:"center"}:{}),
                  }}>{theme==="anak"?`★ ${sec.text} ★`:sec.text}</div>
                )}
                {(sec.paragraphs||[]).slice(0,4).map((p,j)=>(
                  <div key={j}>
                    {p.type==="paragraph"&&(
                      <p style={{
                        fontSize:isEbook?12:11,
                        lineHeight:activeBodyLine/200,
                        textAlign:TH.bodyAlign,
                        textIndent:activeBodyIndent>0?`${activeBodyIndent/1440}in`:"0",
                        // FIX: margin bottom kecil untuk cetak (indent), lebih besar untuk ebook
                        margin:`0 0 ${activeBodyAfter>0?8:2}px`,
                        fontFamily:activeBodyFont,color:TH.text,
                        wordSpacing:"normal",  // mencegah word-spacing loncat pada justify
                      }} dangerouslySetInnerHTML={{__html:italicHTML(p.text)}}/>
                    )}
                    {p.type==="pullquote"&&(
                      <div style={{fontFamily:activeHeadFont,fontSize:11,color:TH.primary,fontStyle:"italic",margin:"8px 0",
                        ...(theme==="islami"?{textAlign:"center",borderLeft:`3px solid ${TH.accent}`,paddingLeft:8}:{}),
                        ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",border:`1px solid ${TH.accent}`}:{}),
                        ...(theme==="akademik"?{paddingLeft:20,borderLeft:`2px solid ${TH.accent}`}:{}),
                        ...(theme==="bisnis"?{background:"#F5F5F5",padding:"5px 9px",borderLeft:`4px solid ${TH.primary}`}:{}),
                      }}>{`"${p.text}"`}</div>
                    )}
                    {p.type==="arabic"&&<div style={{textAlign:"right",fontSize:14,fontFamily:"Amiri,serif",direction:"rtl",margin:"7px 0",color:TH.primary}}>{p.text}</div>}
                    {p.type==="footnote"&&<div style={{fontSize:9,color:"#888",borderTop:`0.5px solid #ccc`,marginTop:9,paddingTop:3}}>* {p.text}</div>}
                  </div>
                ))}
              </div>
            ))}
            {!preview&&<div style={{textAlign:"center",color:"#ccc",padding:"20px 0",fontSize:12}}>Preview akan muncul di sini...</div>}

            {!isEbook&&(
              <div style={{borderTop:`1.5px solid ${TH.accent}`,marginTop:12,paddingTop:5,fontSize:9,color:TH.primary,textAlign:"center"}}>
                {TH.footerStyle==="ornamen"&&`${TH.ornamen} 1 ${TH.ornamen}`}
                {TH.footerStyle==="warna"&&<span style={{fontWeight:700,fontFamily:activeHeadFont}}>1</span>}
                {TH.footerStyle==="angka"&&"1"}
                {TH.footerStyle==="titik"&&"— 1 —"}
                {TH.footerStyle==="kanan"&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#aaa"}}>{meta.penulis||""}</span><span>1</span></div>}
              </div>
            )}
            {isEbook&&<div style={{marginTop:10,fontSize:9,color:"#ccc",textAlign:"center",fontStyle:"italic"}}>ebook: nomor halaman otomatis oleh perangkat pembaca</div>}
          </div>

          {status&&<div style={{marginTop:10,padding:"9px 13px",borderRadius:8,fontSize:12,textAlign:"center",background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#555"}}>{status}</div>}

          <button onClick={downloadDocx} disabled={generating} style={{marginTop:12,width:"100%",padding:13,borderRadius:10,background:generating?"#ccc":TH.primary,color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:generating?"not-allowed":"pointer"}}>
            {generating?(status||"Memproses..."):`⬇️ Unduh .docx — ${TH.label} · ${M.label}`}
          </button>
          <div style={{fontSize:10,color:"#bbb",textAlign:"center",marginTop:6}}>Microsoft Word · LibreOffice · Google Docs</div>
        </div>
      )}

      {/* Nav */}
      <div style={{display:"flex",gap:10,marginTop:16}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:9,borderRadius:8,background:"transparent",border:"1px solid #d1d5db",cursor:"pointer",fontSize:13}}>← Kembali</button>}
        {step<3&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{flex:2,padding:9,borderRadius:8,background:canNext[step]?TH.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[step]?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>Lanjut →</button>}
        {step===3&&<button onClick={generatePreview} disabled={!canNext[3]||generating} style={{flex:2,padding:9,borderRadius:8,background:canNext[3]?TH.primary:"#ccc",color:"#fff",border:"none",cursor:canNext[3]?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>{generating?"Memproses...":"Generate Preview →"}</button>}
      </div>
    </div>
  );
}
