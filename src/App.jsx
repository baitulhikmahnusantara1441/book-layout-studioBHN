import { useState, useCallback, useRef } from "react";

// ═══════════════ FONT CATALOG ═══════════════
const FONTS = {
  serif: [
    { id:"Georgia",           css:"Georgia,serif",                        sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Klasik, nyaman di layar" },
    { id:"Palatino Linotype", css:"'Palatino Linotype',Palatino,serif",   sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Elegan, cocok novel & islami" },
    { id:"Garamond",          css:"Garamond,'EB Garamond',serif",          sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Klasik sastra, ringan" },
    { id:"Times New Roman",   css:"'Times New Roman',Times,serif",         sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Standar akademik APA/Chicago" },
    { id:"Book Antiqua",      css:"'Book Antiqua',Palatino,serif",         sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Hangat, cocok untuk memoir" },
    { id:"Cambria",           css:"Cambria,Georgia,serif",                 sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Tajam di layar & cetak" },
  ],
  sansserif: [
    { id:"Arial",             css:"Arial,'Helvetica Neue',sans-serif",     sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Bersih, modern, bisnis" },
    { id:"Calibri",           css:"Calibri,'Gill Sans',sans-serif",        sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Ringan, informal modern" },
    { id:"Trebuchet MS",      css:"'Trebuchet MS',Tahoma,sans-serif",      sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Ramah, dinamis" },
    { id:"Verdana",           css:"Verdana,Geneva,sans-serif",             sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Lebar, sangat mudah dibaca" },
    { id:"Tahoma",            css:"Tahoma,Geneva,sans-serif",              sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Rapat, profesional" },
    { id:"Segoe UI",          css:"'Segoe UI',Tahoma,sans-serif",          sample:"Ilmu adalah cahaya yang menerangi jiwa",  note:"Modern, UI-friendly" },
  ],
  anak: [
    { id:"Comic Sans MS",     css:"'Comic Sans MS',cursive",               sample:"Belajar itu menyenangkan dan seru!",       note:"Bulat, ramah anak" },
    { id:"Arial Rounded",     css:"'Arial Rounded MT Bold',Arial,sans-serif",sample:"Belajar itu menyenangkan dan seru!",    note:"Bulat tebal, playful" },
    { id:"Trebuchet MS",      css:"'Trebuchet MS',sans-serif",             sample:"Belajar itu menyenangkan dan seru!",       note:"Cerah, mudah dibaca anak" },
  ],
  arab: [
    { id:"Amiri",             css:"Amiri,Georgia,serif",                   sample:"بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",   note:"Nasakh elegan, standar kitab" },
    { id:"Traditional Arabic",css:"'Traditional Arabic',Amiri,serif",      sample:"بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",   note:"Formal, cetak Timur Tengah" },
  ],
};

const ALL_FONTS = Object.values(FONTS).flat();
const getCSS = id => ALL_FONTS.find(f=>f.id===id)?.css || id;

// ═══════════════ THEMES ═══════════════
const THEMES = {
  islami:{
    label:"Islami / Religi", icon:"📖", desc:"Tafsir, fiqh, biografi ulama, doa",
    p:"#1B4F72", a:"#C9A227", bg:"#F5F0E8", text:"#1a1a1a",
    palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32"],
    dHeadFont:"Amiri", dBodyFont:"Palatino Linotype",
    headSz:40, bodySz:24, ebodySz:26,
    bAlign:"both", bLine:400, bIndent:720, bAfter:0, ebLine:440, ebIndent:0, ebAfter:160,
    pqSz:28, arabSz:36, fnSz:18,
    hStyle:"ornamen", fStyle:"ornamen", ornamen:"✦",
    rec:["Amiri","Palatino Linotype","Georgia"],
    margins:{cetak:{top:1134,bot:1418,out:1020,inn:1250,gut:360}, ebook:{top:568,bot:568,out:568,inn:568,gut:0}},
  },
  anak:{
    label:"Anak-anak", icon:"🎨", desc:"Cerita anak, dongeng, edukasi",
    p:"#E53935", a:"#FDD835", bg:"#FFFDE7", text:"#1a1a1a",
    palette:["#E53935","#FDD835","#43A047","#1E88E5"],
    dHeadFont:"Comic Sans MS", dBodyFont:"Trebuchet MS",
    headSz:46, bodySz:28, ebodySz:30,
    bAlign:"left", bLine:480, bIndent:0, bAfter:200, ebLine:520, ebIndent:0, ebAfter:240,
    pqSz:30, arabSz:32, fnSz:20,
    hStyle:"warna", fStyle:"warna", ornamen:"★",
    rec:["Comic Sans MS","Arial Rounded","Trebuchet MS","Verdana"],
    margins:{cetak:{top:1020,bot:1134,out:1020,inn:1250,gut:288}, ebook:{top:568,bot:568,out:568,inn:568,gut:0}},
  },
  akademik:{
    label:"Akademik / Ilmiah", icon:"🎓", desc:"Skripsi, jurnal, textbook",
    p:"#1A237E", a:"#1565C0", bg:"#FFFFFF", text:"#111111",
    palette:["#1A237E","#1565C0","#546E7A","#37474F"],
    dHeadFont:"Times New Roman", dBodyFont:"Times New Roman",
    headSz:32, bodySz:24, ebodySz:26,
    bAlign:"both", bLine:360, bIndent:0, bAfter:120, ebLine:400, ebIndent:0, ebAfter:160,
    pqSz:22, arabSz:28, fnSz:18,
    hStyle:"kiri-kanan", fStyle:"angka", ornamen:"",
    rec:["Times New Roman","Cambria","Georgia"],
    margins:{cetak:{top:1440,bot:1440,out:1440,inn:1800,gut:360}, ebook:{top:720,bot:720,out:720,inn:720,gut:0}},
  },
  memoir:{
    label:"Memoir / Sastra", icon:"✍️", desc:"Memoar, novel, cerpen, biografi",
    p:"#4E342E", a:"#A1887F", bg:"#FDF6EE", text:"#2c1a0e",
    palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41"],
    dHeadFont:"Garamond", dBodyFont:"Garamond",
    headSz:38, bodySz:24, ebodySz:26,
    bAlign:"both", bLine:400, bIndent:640, bAfter:0, ebLine:440, ebIndent:0, ebAfter:160,
    pqSz:26, arabSz:32, fnSz:18,
    hStyle:"italic", fStyle:"titik", ornamen:"❧",
    rec:["Garamond","Book Antiqua","Palatino Linotype","Georgia"],
    margins:{cetak:{top:1134,bot:1418,out:1020,inn:1250,gut:360}, ebook:{top:568,bot:568,out:568,inn:568,gut:0}},
  },
  bisnis:{
    label:"Bisnis / Profesional", icon:"💼", desc:"Manajemen, self-help, motivasi",
    p:"#212121", a:"#C62828", bg:"#FFFFFF", text:"#111111",
    palette:["#212121","#C62828","#424242","#757575"],
    dHeadFont:"Arial", dBodyFont:"Calibri",
    headSz:34, bodySz:22, ebodySz:24,
    bAlign:"both", bLine:340, bIndent:0, bAfter:180, ebLine:380, ebIndent:0, ebAfter:200,
    pqSz:28, arabSz:28, fnSz:18,
    hStyle:"bold", fStyle:"kanan", ornamen:"◆",
    rec:["Arial","Calibri","Verdana","Segoe UI","Tahoma"],
    margins:{cetak:{top:1134,bot:1418,out:1020,inn:1250,gut:360}, ebook:{top:568,bot:568,out:568,inn:568,gut:0}},
  },
  fiksi:{
    label:"Fiksi / Novel", icon:"📚", desc:"Novel, romance, thriller, fantasi",
    p:"#4A148C", a:"#7B1FA2", bg:"#FAF7FF", text:"#1a1a2e",
    palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8"],
    dHeadFont:"Palatino Linotype", dBodyFont:"Palatino Linotype",
    headSz:40, bodySz:23, ebodySz:26,
    bAlign:"both", bLine:380, bIndent:680, bAfter:0, ebLine:420, ebIndent:0, ebAfter:160,
    pqSz:24, arabSz:30, fnSz:18,
    hStyle:"italic", fStyle:"titik", ornamen:"✦",
    rec:["Palatino Linotype","Garamond","Georgia","Book Antiqua"],
    margins:{cetak:{top:1134,bot:1418,out:1020,inn:1250,gut:360}, ebook:{top:568,bot:568,out:568,inn:568,gut:0}},
  },
};

const FORMATS = {A5:{w:8391,h:11906,l:"A5 · 14.8×21 cm"},A4:{w:11906,h:16838,l:"A4 · 21×29.7 cm"},B5:{w:9978,h:14175,l:"B5 · 17.6×25 cm"},Custom:{w:8788,h:13032,l:"Custom · 15.5×23 cm"}};
const EFORMATS = {"Tablet 7\"":{w:5760,h:8640,l:'Tablet 7"'},"Tablet 10\"":{w:7920,h:11520,l:'Tablet 10"'},Kindle:{w:7272,h:9792,l:"Kindle"},A4:{w:11906,h:16838,l:"A4 Layar"}};

const COMMON = new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","bang","lagi","pula","sedang","hingga","sampai","bahkan","hanya","saja","memang","tentu","malah","tapi","kalau","walau","meski"]);
const isForeign = w => /^[a-zA-Z]/.test(w) && !w.toLowerCase().split(/\s+/).every(x => COMMON.has(x)||x.length<=2);
const esc = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

// ═══════════════ MAIN APP ═══════════════
export default function App() {
  const [step,setStep]       = useState(0);
  const [media,setMedia]     = useState("cetak");
  const [theme,setTheme]     = useState("islami");
  const [format,setFormat]   = useState("A5");
  const [content,setContent] = useState("");
  const [fileName,setFile]   = useState("");
  const [meta,setMeta]       = useState({judul:"",penulis:"",penerbit:"",tahun:new Date().getFullYear(),subjudul:""});
  const [headFont,setHF]     = useState("Amiri");
  const [bodyFont,setBF]     = useState("Palatino Linotype");
  const [preview,setPreview] = useState(null);
  const [generating,setGen]  = useState(false);
  const [status,setStatus]   = useState("");
  const [dragOver,setDrag]   = useState(false);
  const [fontSection,setFS]  = useState("rec"); // rec | serif | sansserif | anak | arab
  const [pickTarget,setPT]   = useState("head"); // head | body
  const [showFontPicker,setSFP] = useState(false);

  const TH = THEMES[theme];
  const isEbook = media==="ebook";
  const ph = TH.p.replace("#","");
  const ah = TH.a.replace("#","");
  const aBodySz  = isEbook ? TH.ebodySz : TH.bodySz;
  const aBodyLn  = isEbook ? TH.ebLine  : TH.bLine;
  const aBodyIn  = isEbook ? TH.ebIndent: TH.bIndent;
  const aBodyAft = isEbook ? TH.ebAfter : TH.bAfter;
  const mg = TH.margins[media];

  const switchTheme = k => { setTheme(k); setHF(THEMES[k].dHeadFont); setBF(THEMES[k].dBodyFont); };

  const handleFile = useCallback(file=>{
    if(!file) return;
    setFile(file.name);
    const r=new FileReader(); r.onload=e=>setContent(e.target.result); r.readAsText(file,"UTF-8");
  },[]);

  // ── FOOTNOTE COUNTER (global across doc) ──
  const fnCounterRef = { n: 0 };

  const parseCnt = text => {
    const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
    const secs=[];let cur=null,ps=[];
    // Footnote patterns:
    // Inline: teks[1] atau teks(1) atau teks^1  → simpan sebagai marker di dalam teks
    // Block:  [1] Teks referensi  atau  (1) Teks  atau  ^1 Teks  → footnote definition
    // [CATATAN] Teks → manual footnote tag
    const fnDefs = {}; // { "1": "teks referensi", "2": ... }

    // Pass 1: kumpulkan footnote definitions dari baris
    for(const line of lines){
      // Pattern: [1] teks, (1) teks, ^1 teks di awal baris
      const defMatch = line.match(/^[\[\(](\d+)[\]\)]\s+(.+)$/) || line.match(/^\^(\d+)\s+(.+)$/);
      if(defMatch) { fnDefs[defMatch[1]] = defMatch[2]; }
    }

    // Pass 2: parse struktur
    for(const line of lines){
      // Skip baris yang merupakan footnote definition murni
      const defMatch = line.match(/^[\[\(](\d+)[\]\)]\s+(.+)$/) || line.match(/^\^(\d+)\s+(.+)$/);
      if(defMatch && fnDefs[defMatch[1]]) continue;

      if(/^#+\s/.test(line)||/^(BAB|PASAL|BAGIAN)\s+[IVX\d]/i.test(line)){
        if(cur) secs.push({...cur,p:ps}); cur={type:"h",text:line.replace(/^#+\s*/,"")}; ps=[];
      } else if(/^\[KUTIPAN\]/i.test(line)) ps.push({type:"q",text:line.replace(/^\[KUTIPAN\]/i,"").trim()});
      else if(/^\[ARAB\]/i.test(line))      ps.push({type:"a",text:line.replace(/^\[ARAB\]/i,"").trim()});
      else if(/^\[CATATAN\]/i.test(line))   ps.push({type:"f",text:line.replace(/^\[CATATAN\]/i,"").trim(), fnKey:null});
      else {
        // Inline footnote markers: [1] (2) ^1 di dalam teks
        const hasInline = /\[(\d+)\]|\((\d+)\)|\^(\d+)/.test(line);
        ps.push({type:"p", text:line, fnDefs: hasInline ? fnDefs : null});
      }
    }
    if(cur) secs.push({...cur,p:ps}); else if(ps.length) secs.push({type:"body",text:"",p:ps});
    return {secs, fnDefs};
  };

  // Render inline teks dengan superscript footnote marker
  const renderInlineFn = (text, fnDefs, fnMap) => {
    // fnMap: { "1": globalNum, "2": globalNum2 }
    return text.replace(/\[(\d+)\]|\((\d+)\)|\^(\d+)/g, (match, a, b, c) => {
      const key = a||b||c;
      const num = fnMap[key] || key;
      return `<sup style="font-size:0.7em;color:${TH.p};font-weight:700;line-height:0;vertical-align:super">${num}</sup>`;
    });
  };

  const iHTML = t => t.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g, m=>isForeign(m)?`<em>${m}</em>`:m);

  // ═══════ DOCX BUILD ═══════
  const buildDocx = async () => {
    if(!window.JSZip){
      await new Promise((res,rej)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=res;s.onerror=rej;document.head.appendChild(s);
      });
    }
    const {secs, fnDefs}=parseCnt(content);
    // Build fnMap: local key → global sequential number
    let globalFnCounter=0;
    const fnMap={};
    for(const key of Object.keys(fnDefs).sort((a,b)=>Number(a)-Number(b))){
      globalFnCounter++;
      fnMap[key]=globalFnCounter;
    }
    const fmt=(isEbook?EFORMATS:FORMATS)[format]||(isEbook?EFORMATS["Tablet 10\""]:FORMATS.A5);
    const hf=headFont, bf=bodyFont;

    const r=(txt,o={})=>{
      const rp=[o.b?"<w:b/><w:bCs/>":"",o.i?"<w:i/><w:iCs/>":"",
        o.sz?`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>` :"",
        o.c?`<w:color w:val="${o.c}"/>`:"",
        o.f?`<w:rFonts w:ascii="${o.f}" w:hAnsi="${o.f}" w:cs="${o.f}"/>`:"",
        o.rtl?"<w:rtl/>":""].filter(Boolean).join("");
      return `<w:r><w:rPr>${rp}</w:rPr><w:t xml:space="preserve">${esc(txt)}</w:t></w:r>`;
    };

    const rMix=(txt,o={})=>txt.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g).filter(Boolean)
      .map(p=>r(p,{...o,i:o.i||isForeign(p)})).join("");

    const p=(runs,o={})=>{
      const bdr=[];
      if(o.bL) bdr.push(`<w:left w:val="single" w:sz="${o.bLsz||12}" w:space="8" w:color="${ah}"/>`);
      if(o.bF){bdr.push(`<w:top w:val="single" w:sz="4" w:space="4" w:color="${ph}"/>`);bdr.push(`<w:bottom w:val="single" w:sz="4" w:space="4" w:color="${ph}"/>`);}
      if(o.bT) bdr.push(`<w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/>`);
      const pp=[
        o.al?`<w:jc w:val="${o.al}"/>`:"",
        `<w:spacing w:before="${o.be||0}" w:after="${o.af||0}" w:line="${o.ln||240}" w:lineRule="auto"/>`,
        o.ind?`<w:ind w:firstLine="${o.ind}"/>`:"",
        o.iLR?`<w:ind w:left="${o.iLR}" w:right="${o.iLR}"/>`:"",
        o.iL?`<w:ind w:left="${o.iL}"/>`:"",
        o.pb?"<w:pageBreakBefore/>":"",
        o.kn?"<w:keepNext/>":"",
        o.kl?"<w:keepLines/>":"",
        o.rtl?"<w:bidi/>":"",
        o.shd?`<w:shd w:val="clear" w:color="auto" w:fill="${o.shd}"/>`:"",
        "<w:widowControl/>",
        bdr.length?`<w:pBdr>${bdr.join("")}</w:pBdr>`:"",
      ].filter(Boolean).join("");
      return `<w:p><w:pPr>${pp}</w:pPr>${runs}</w:p>`;
    };

    let body="";

    // ── COVER ──
    const hSz=isEbook?TH.headSz+4:TH.headSz;
    const covers={
      islami:()=>{
        body+=p(r("بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",{sz:30,f:"Amiri",c:ah,rtl:true}),{al:"center",be:600,af:0,rtl:true});
        body+=p(r("",{sz:6}),{af:0,bF:true});
        body+=p(r(meta.judul||"Judul Buku",{b:true,sz:hSz,c:ph,f:hf}),{al:"center",be:240,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:26,c:ah,f:hf}),{al:"center",be:80,af:0});
        body+=p(r(`── ${TH.ornamen} ──`,{sz:22,c:ah}),{al:"center",be:140,af:0});
        body+=p(r(meta.penulis||"",{sz:24,c:ph,f:hf}),{al:"center",be:120,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:18,c:"777777",f:bf}),{al:"center",be:60,af:0});
        body+=p(r(String(meta.tahun),{sz:16,c:"999999"}),{al:"center",be:60,af:0});
        body+=p(r("",{sz:6}),{be:240,af:0,bF:true});
      },
      anak:()=>{
        body+=p(r(`★ ${meta.judul||"Judul Buku"} ★`,{b:true,sz:hSz+8,c:ph,f:hf}),{al:"center",be:720,af:0,shd:TH.bg.replace("#",""),kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:32,c:"438a47",f:hf}),{al:"center",be:80,af:0});
        body+=p(r("★  ◆  ★",{sz:32,c:ah}),{al:"center",be:160,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:28,c:ph,f:bf}),{al:"center",be:200,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:22,c:"777777"}),{al:"center",be:60,af:0});
      },
      akademik:()=>{
        body+=p(r("",{sz:6}),{bF:true,be:0,af:0});
        body+=p(r((meta.penerbit||"UNIVERSITAS / LEMBAGA").toUpperCase(),{sz:20,c:ph,f:hf}),{al:"center",be:480,af:0});
        body+=p(r("",{sz:6}),{bF:true,be:120,af:0});
        body+=p(r((meta.judul||"JUDUL PENELITIAN").toUpperCase(),{b:true,sz:hSz,c:ph,f:hf}),{al:"center",be:360,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:22,c:"444444",f:hf}),{al:"center",be:100,af:0});
        body+=p(r("",{sz:6}),{bF:true,be:360,af:0});
        body+=p(r("Oleh:",{sz:20,c:"555555",f:bf}),{al:"center",be:360,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:24,c:ph,f:bf}),{al:"center",be:80,af:0});
        body+=p(r(String(meta.tahun),{sz:20,c:"555555"}),{al:"center",be:120,af:0});
        body+=p(r("",{sz:6}),{bF:true,be:200,af:0});
      },
      memoir:()=>{
        body+=p(r(meta.judul||"Judul Buku",{sz:hSz,c:ph,f:hf}),{al:"center",be:1200,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:22,c:ah,f:hf}),{al:"center",be:80,af:0});
        body+=p(r("",{sz:6}),{bF:true,be:200,af:0});
        body+=p(r("❧",{sz:48,c:ah,f:hf}),{al:"center",be:120,af:0});
        body+=p(r("",{sz:6}),{bF:true,be:0,af:0});
        body+=p(r(meta.penulis||"",{sz:22,c:ph,f:bf}),{al:"center",be:360,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:16,c:"888888",f:bf}),{al:"center",be:60,af:0});
        body+=p(r(String(meta.tahun),{sz:16,c:"aaaaaa"}),{al:"center",be:60,af:0});
      },
      bisnis:()=>{
        body+=p(r(meta.judul||"JUDUL BUKU",{b:true,sz:hSz+6,c:ph,f:hf}),{al:"left",be:720,af:0,kn:true,bL:true,bLsz:28});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:22,c:ah,f:bf}),{al:"left",be:80,af:0,iL:160});
        body+=p(r("",{sz:6}),{bF:true,be:240,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:24,c:ph,f:bf}),{al:"left",be:240,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:18,c:"666666",f:bf}),{al:"left",be:60,af:0});
        body+=p(r(String(meta.tahun),{sz:16,c:"888888"}),{al:"left",be:60,af:0});
      },
      fiksi:()=>{
        body+=p(r(meta.judul||"Judul Buku",{i:true,sz:hSz+4,c:ph,f:hf}),{al:"center",be:960,af:0,kn:true});
        body+=p(r("✦",{sz:28,c:ah}),{al:"center",be:60,af:0,kn:true});
        body+=p(r("",{sz:6}),{bF:true,be:0,af:0});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:20,c:ah,f:hf}),{al:"center",be:120,af:0});
        body+=p(r(meta.penulis||"",{i:true,sz:20,c:"555555",f:bf}),{al:"center",be:280,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:16,c:"888888"}),{al:"center",be:60,af:0});
      },
    };
    covers[theme]();

    // ── FOOTNOTE XML BUILDER ──
    // Word proper footnotes via w:footnote elements
    // We collect all footnotes, then inject at end + in footnotesPart
    const footnotesXml = []; // array of {id, text}
    let fnIdCounter = 1;

    // helper: inline footnote reference run
    const fnRef = id => `<w:r><w:rPr><w:vertAlign w:val="superscript"/><w:color w:val="${ph}"/><w:sz w:val="${TH.fnSz}"/><w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/></w:rPr><w:t>${id}</w:t></w:r>`;

    // Build run with inline footnote markers replaced
    const rWithFn = (text, opts={}) => {
      // Replace [1] (1) ^1 with Word footnote references
      const parts = text.split(/(\[\d+\]|\(\d+\)|\^\d+)/g);
      return parts.filter(Boolean).map(part => {
        const km = part.match(/^\[(\d+)\]$|^\((\d+)\)$|^\^(\d+)$/);
        if(km){
          const key = km[1]||km[2]||km[3];
          if(fnDefs[key]){
            const gn = fnMap[key] || key;
            // Register footnote if not yet
            if(!footnotesXml.find(f=>f.id===gn)){
              footnotesXml.push({id:gn, text:fnDefs[key]});
            }
            return fnRef(gn);
          }
        }
        return rMix(part, opts);
      }).join("");
    };

    // ── CONTENT ──
    for(const sec of secs){
      if(sec.type==="h"){
        const headMap={
          islami:()=>{
            body+=p(r("",{sz:4}),{bF:true,be:0,af:0});
            body+=p(r(sec.text,{b:true,sz:TH.headSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:240,af:0,kn:true,shd:"F5F0E8"});
            body+=p(r(`── ${TH.ornamen} ──`,{sz:16,c:ah}),{al:"center",be:40,af:240,kn:true});
          },
          anak:()=>body+=p(r(`${TH.ornamen} ${sec.text} ${TH.ornamen}`,{b:true,sz:TH.headSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:240,af:200,kn:true,shd:TH.bg.replace("#","")}),
          akademik:()=>{
            body+=p(r(sec.text.toUpperCase(),{b:true,sz:TH.headSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:400,af:0,kn:true});
            body+=p(r("",{sz:4}),{bF:true,be:0,af:320,kn:true});
          },
          memoir:()=>{
            body+=p(r(sec.text,{sz:TH.headSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:800,af:0,kn:true});
            body+=p(r("❧",{sz:26,c:ah,f:hf}),{al:"center",be:40,af:320,kn:true});
          },
          bisnis:()=>{
            body+=p(r(sec.text,{b:true,sz:TH.headSz,c:ph,f:hf}),{al:"left",pb:!isEbook,be:isEbook?360:280,af:0,kn:true,bL:true,bLsz:22});
            body+=p(r("",{sz:4}),{bT:true,be:0,af:180,kn:true});
          },
          fiksi:()=>{
            body+=p(r(sec.text,{sz:TH.headSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:800,af:0,kn:true});
            body+=p(r("✦  ✦  ✦",{sz:18,c:ah}),{al:"center",be:40,af:320,kn:true});
          },
        };
        headMap[theme]();
      }
      for(const pp of sec.p||[]){
        if(pp.type==="p"){
          // Use rWithFn to handle inline footnote markers
          const runs = pp.fnDefs ? rWithFn(pp.text,{sz:aBodySz,f:bf}) : rMix(pp.text,{sz:aBodySz,f:bf});
          body+=p(runs,{al:TH.bAlign,ind:aBodyIn,ln:aBodyLn,af:aBodyAft,be:0,kl:true});
        }else if(pp.type==="q"){
          const qMap={
            islami:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",iLR:720,be:180,af:180,kl:true,bL:true}),
            anak:()=>body+=p(r(`"${pp.text}"`,{b:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",be:140,af:140,kl:true,bF:true,shd:TH.bg.replace("#","")}),
            akademik:()=>body+=p(r(pp.text,{i:true,sz:TH.pqSz,c:"444444",f:bf}),{al:"both",iLR:1440,be:140,af:140,kl:true,bL:true,bLsz:6}),
            memoir:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",be:200,af:200,kl:true}),
            bisnis:()=>body+=p(r(`"${pp.text}"`,{b:true,sz:TH.pqSz,c:ph,f:bf}),{al:"left",iLR:720,be:140,af:140,kl:true,shd:"F5F5F5",bL:true,bLsz:20}),
            fiksi:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ah,f:hf}),{al:"center",be:200,af:200,kl:true}),
          };
          qMap[theme]();
        }else if(pp.type==="a"){
          body+=p(r(pp.text,{sz:TH.arabSz,f:TH.arabFont||"Amiri",rtl:true}),{al:"right",be:160,af:160,rtl:true,kl:true});
        }else if(pp.type==="f"){
          // Manual [CATATAN] tag → juga masuk sebagai footnote proper
          fnIdCounter++;
          const manualId = fnIdCounter;
          footnotesXml.push({id:manualId, text:pp.text});
          body+=`<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="${aBodyLn}" w:lineRule="auto"/><w:ind w:firstLine="${aBodyIn}"/><w:widowControl/></w:pPr>${fnRef(manualId)}</w:p>`;
        }
      }
    }

    // Section props
    const hRef=media==="cetak"?`<w:headerReference w:type="default" r:id="rId3"/>` :"";
    const fRef=media==="cetak"?`<w:footerReference w:type="default" r:id="rId4"/>` :"";
    // MARGIN FIX: gunakan nilai eksak twips, gutter hanya untuk cetak
    const mxml=isEbook
      ?`<w:pgMar w:top="${mg.top}" w:right="${mg.out}" w:bottom="${mg.bot}" w:left="${mg.inn}" w:header="0" w:footer="0" w:gutter="0"/>`
      :`<w:pgMar w:top="${mg.top}" w:right="${mg.out}" w:bottom="${mg.bot}" w:left="${mg.inn}" w:header="568" w:footer="568" w:gutter="${mg.gut}"/>`;
    body+=`<w:sectPr>${hRef}${fRef}<w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>${mxml}</w:sectPr>`;

    // Header/Footer builders
    const pgn=`<w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    const bBt=`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
    const bBtBold=`<w:pBdr><w:bottom w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;
    const bTp=`<w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
    const bTpBold=`<w:pBdr><w:top w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;

    const headers={
      ornamen:`<w:p><w:pPr><w:jc w:val="center"/>${bBt}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r></w:p>`,
      warna:`<w:p><w:pPr><w:jc w:val="left"/>${bBt}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="20"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
      "kiri-kanan":`<w:p><w:pPr><w:jc w:val="left"/>${bBt}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.inn-mg.out}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`,
      italic:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
      bold:`<w:p><w:pPr><w:jc w:val="left"/>${bBtBold}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:color w:val="AAAAAA"/><w:sz w:val="17"/></w:rPr><w:t xml:space="preserve">  |  ${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
    };
    const footers={
      ornamen:`<w:p><w:pPr><w:jc w:val="center"/>${bTp}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">${TH.ornamen}  </w:t></w:r>${pgn}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">  ${TH.ornamen}</w:t></w:r></w:p>`,
      warna:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="22"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`,
      angka:`<w:p><w:pPr><w:jc w:val="center"/>${bTp}</w:pPr>${pgn}</w:p>`,
      titik:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">— </w:t></w:r>${pgn}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve"> —</w:t></w:r></w:p>`,
      kanan:`<w:p><w:pPr><w:jc w:val="left"/>${bTpBold}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.inn-mg.out}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="17"/><w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:tab/></w:r>${pgn}</w:p>`,
    };

    const mkHdr=x=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${x}</w:hdr>`;
    const mkFtr=x=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${x}</w:ftr>`;

    // ── BUILD FOOTNOTES PART (Word proper footnotes) ──
    const hasFn = footnotesXml.length > 0;
    // Word requires separator footnotes (id=-1 and id=0)
    const fnPartXml = hasFn ? `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:footnote w:type="separator" w:id="-1">
    <w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
      <w:r><w:separator/></w:r></w:p></w:footnote>
  <w:footnote w:type="continuationSeparator" w:id="0">
    <w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
      <w:r><w:continuationSeparator/></w:r></w:p></w:footnote>
  ${footnotesXml.map(fn=>`
  <w:footnote w:id="${fn.id}">
    <w:p>
      <w:pPr>
        <w:pStyle w:val="FootnoteText"/>
        <w:spacing w:before="0" w:after="80" w:line="240" w:lineRule="auto"/>
        <w:jc w:val="both"/>
      </w:pPr>
      <w:r><w:rPr>
        <w:vertAlign w:val="superscript"/>
        <w:sz w:val="${TH.fnSz}"/>
        <w:color w:val="${ph}"/>
        <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
      </w:rPr><w:t>${fn.id}</w:t></w:r>
      <w:r><w:rPr>
        <w:sz w:val="${TH.fnSz}"/>
        <w:szCs w:val="${TH.fnSz}"/>
        <w:color w:val="444444"/>
        <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
      </w:rPr><w:t xml:space="preserve"> ${esc(fn.text)}</w:t></w:r>
    </w:p>
  </w:footnote>`).join("")}
</w:footnotes>` : null;

    // Styles with FootnoteText style defined
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr>
    <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
    <w:sz w:val="${aBodySz}"/><w:szCs w:val="${aBodySz}"/>
  </w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="character" w:styleId="FootnoteReference">
    <w:name w:val="footnote reference"/>
    <w:rPr><w:vertAlign w:val="superscript"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="FootnoteText">
    <w:name w:val="footnote text"/>
    <w:pPr><w:spacing w:after="80" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:rPr>
      <w:sz w:val="${TH.fnSz}"/><w:szCs w:val="${TH.fnSz}"/>
      <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
    </w:rPr>
  </w:style>
</w:styles>`;

    const ov=[
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`,
      `<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>`,
      hasFn?`<Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>`:"",
      media==="cetak"?`<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>` :"",
      media==="cetak"?`<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>` :"",
    ].filter(Boolean).join("\n");

    // Document rels — tambah footnotes relationship
    const docRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  ${hasFn?`<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>`:""}
  ${media==="cetak"?`<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>`:""}
</Relationships>`;

    const zip=new window.JSZip();
    zip.file("[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${ov}</Types>`);
    zip.file("_rels/.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    zip.file("word/document.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"><w:body>${body}</w:body></w:document>`);
    zip.file("word/styles.xml", stylesXml);
    zip.file("word/settings.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
    zip.file("word/_rels/document.xml.rels", docRels);
    if(hasFn) zip.file("word/footnotes.xml", fnPartXml);
    if(media==="cetak"){
      zip.file("word/header1.xml",mkHdr(headers[TH.hStyle]||headers.italic));
      zip.file("word/footer1.xml",mkFtr(footers[TH.fStyle]||footers.titik));
    }
    const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download=`${(meta.judul||"buku").replace(/\s+/g,"_")}_${theme}_${media}.docx`;
    a.click();URL.revokeObjectURL(url);
  };

  const doDownload=async()=>{
    setGen(true);setStatus("Memuat library...");
    try{await buildDocx();setStatus("✅ Berhasil diunduh!");}
    catch(e){console.error(e);setStatus("❌ "+e.message);}
    setGen(false);setTimeout(()=>setStatus(""),4000);
  };

  const doPreview=()=>{
    setGen(true);
    setTimeout(()=>{
      const parsed=parseCnt(content);
      // Build fnMap for preview rendering
      let n=0;const fm={};
      Object.keys(parsed.fnDefs).sort((a,b)=>Number(a)-Number(b)).forEach(k=>{n++;fm[k]=n;});
      setPreview({...parsed,fnMap:fm});
      setGen(false);setStep(3);
    },400);
  };

  const fmtOpts=isEbook?EFORMATS:FORMATS;
  const canNext=[true,true,content.trim().length>10,meta.judul.trim().length>0&&meta.penulis.trim().length>0,true];

  // ═══════════════════════════════════════════════════
  // FONT PICKER MODAL
  // ═══════════════════════════════════════════════════
  const FontModal=()=>{
    const tabs=[
      {id:"rec",label:"⭐ Rekomendasi"},
      {id:"serif",label:"Serif"},
      {id:"sansserif",label:"Sans-Serif"},
      {id:"anak",label:"Anak-anak"},
      {id:"arab",label:"Arab / Islami"},
    ];
    const recFonts=ALL_FONTS.filter(f=>TH.rec.includes(f.id));
    const listMap={rec:recFonts,serif:FONTS.serif,sansserif:FONTS.sansserif,anak:FONTS.anak,arab:FONTS.arab};
    const list=listMap[fontSection]||recFonts;
    const cur=pickTarget==="head"?headFont:bodyFont;
    const setCur=pickTarget==="head"?setHF:setBF;

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setSFP(false)}>
        <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:620,maxHeight:"88vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
          {/* Modal header */}
          <div style={{background:`linear-gradient(135deg,${TH.p},${TH.a})`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>Pilih Font — {pickTarget==="head"?"Judul & Heading":"Isi / Body Text"}</div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginTop:2}}>Klik font untuk memilih · Preview langsung di bawah</div>
            </div>
            <button onClick={()=>setSFP(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,fontWeight:600}}>✕ Tutup</button>
          </div>
          {/* Toggle head/body */}
          <div style={{display:"flex",gap:0,borderBottom:"1px solid #f0f0f0"}}>
            {["head","body"].map(t=>(
              <button key={t} onClick={()=>setPT(t)} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:pickTarget===t?`${TH.p}12`:"#fff",color:pickTarget===t?TH.p:"#888",borderBottom:pickTarget===t?`2px solid ${TH.p}`:"2px solid transparent"}}>
                {t==="head"?"🔠 Font Judul":"📝 Font Isi"}
              </button>
            ))}
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:4,padding:"10px 16px",overflowX:"auto",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setFS(t.id)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap",background:fontSection===t.id?TH.p:"#f1f5f9",color:fontSection===t.id?"#fff":"#666"}}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Font list */}
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {list.map(f=>{
              const sel=cur===f.id;
              const isArab=f.id==="Amiri"||f.id==="Traditional Arabic";
              return(
                <div key={f.id} onClick={()=>{setCur(f.id);}}
                  style={{border:sel?`2px solid ${TH.p}`:"1px solid #e8e8e8",borderRadius:10,padding:"11px 13px",cursor:"pointer",background:sel?`${TH.p}0d`:"#fafafa",transition:"all 0.15s",position:"relative"}}>
                  {sel&&<div style={{position:"absolute",top:6,right:8,fontSize:11,color:TH.p,fontWeight:700}}>✓</div>}
                  {TH.rec.includes(f.id)&&!sel&&<div style={{position:"absolute",top:6,right:8,fontSize:9,background:`${TH.a}44`,color:TH.a,borderRadius:4,padding:"1px 5px",fontWeight:700}}>★ Rec</div>}
                  <div style={{fontSize:10,fontWeight:700,color:sel?TH.p:"#444",marginBottom:6,fontFamily:"system-ui"}}>{f.id}</div>
                  <div style={{fontFamily:f.css,fontSize:isArab?15:13,color:sel?TH.p:"#222",lineHeight:1.6,direction:isArab?"rtl":"ltr",wordBreak:"break-word"}}>
                    {f.sample}
                  </div>
                  <div style={{fontSize:9,color:"#aaa",marginTop:5,fontFamily:"system-ui"}}>{f.note}</div>
                </div>
              );
            })}
          </div>
          {/* Live preview bar */}
          <div style={{borderTop:"1px solid #f0f0f0",padding:"12px 16px",background:`${TH.p}06`}}>
            <div style={{fontSize:10,color:TH.p,fontWeight:700,marginBottom:6}}>PREVIEW KOMBINASI</div>
            <div style={{fontFamily:getCSS(headFont),fontSize:15,color:TH.p,fontWeight:600,marginBottom:4}}>{meta.judul||"Judul Buku Contoh"}</div>
            <div style={{fontFamily:getCSS(bodyFont),fontSize:12,color:TH.text,lineHeight:1.75}}>Ini adalah contoh teks isi buku. <em>Foreign words appear in italic.</em> Pemilihan font yang tepat membuat bacaan terasa nyaman dan estetis.</div>
            <div style={{marginTop:6,fontSize:10,color:"#888"}}>Heading: <strong style={{fontFamily:getCSS(headFont)}}>{headFont}</strong> · Body: <strong style={{fontFamily:getCSS(bodyFont)}}>{bodyFont}</strong></div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════ COVER PREVIEW ═══════════════
  const CoverThumb=({size=160})=>{
    const s=size; const ratio=1.414;
    const h=s*ratio;
    const style={width:s,height:h,borderRadius:6,overflow:"hidden",boxShadow:"3px 6px 20px rgba(0,0,0,0.2)",background:TH.bg,fontFamily:getCSS(headFont),flexShrink:0,position:"relative"};
    const fs=n=>Math.round(n*(s/220));
    return(
      <div style={style}>
        {theme==="islami"&&<>
          <div style={{position:"absolute",top:0,left:0,right:0,height:fs(5),background:TH.a}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(5),background:TH.a}}/>
          <div style={{padding:`${fs(18)}px ${fs(14)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(5)}}>
            <div style={{fontSize:fs(9),color:TH.a,fontFamily:"Amiri,serif",direction:"rtl"}}>بِسْمِ اللهِ</div>
            <div style={{width:"80%",height:0.5,background:TH.a}}/>
            <div style={{fontSize:fs(14),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.25}}>{meta.judul||"Judul Buku"}</div>
            {meta.subjudul&&<div style={{fontSize:fs(8),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
            <div style={{fontSize:fs(10),color:TH.a}}>── ✦ ──</div>
            <div style={{fontSize:fs(9),color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div>
            {meta.penerbit&&<div style={{fontSize:fs(7),color:"#999"}}>{meta.penerbit}</div>}
            <div style={{width:"80%",height:0.5,background:TH.a}}/>
          </div>
        </>}
        {theme==="anak"&&<>
          <div style={{height:fs(7),background:`linear-gradient(90deg,${TH.p},${TH.a},#43A047,#1E88E5)`}}/>
          <div style={{padding:`${fs(12)}px ${fs(12)}px`,display:"flex",flexDirection:"column",alignItems:"center",gap:fs(6)}}>
            <div style={{fontSize:fs(22)}}>🌟</div>
            <div style={{fontSize:fs(14),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.2}}>★ {meta.judul||"Judul Buku"} ★</div>
            <div style={{fontSize:fs(12),color:TH.a}}>★  ◆  ★</div>
            <div style={{fontSize:fs(10),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(7),background:`linear-gradient(90deg,#1E88E5,#43A047,${TH.a},${TH.p})`}}/>
        </>}
        {theme==="akademik"&&<>
          <div style={{height:fs(4),background:TH.p}}/>
          <div style={{padding:`${fs(14)}px ${fs(12)}px`,display:"flex",flexDirection:"column",alignItems:"center",gap:fs(5)}}>
            <div style={{fontSize:fs(7),color:TH.p,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"center"}}>{meta.penerbit||"Universitas / Lembaga"}</div>
            <div style={{width:"100%",height:0.5,background:TH.p}}/><div style={{width:"100%",height:0.5,background:TH.a,marginTop:1}}/>
            <div style={{fontSize:fs(12),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.3,textTransform:"uppercase",letterSpacing:0.5}}>{meta.judul||"JUDUL PENELITIAN"}</div>
            <div style={{width:"100%",height:0.5,background:TH.a}}/><div style={{width:"100%",height:0.5,background:TH.p,marginTop:1}}/>
            <div style={{fontSize:fs(7),color:"#666"}}>Oleh:</div>
            <div style={{fontSize:fs(9),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div>
            <div style={{fontSize:fs(7),color:"#888"}}>{meta.tahun}</div>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(4),background:TH.p}}/>
        </>}
        {theme==="memoir"&&<>
          <div style={{position:"absolute",inset:fs(5),border:`0.5px solid ${TH.a}`,borderRadius:3,pointerEvents:"none"}}/>
          <div style={{padding:`${fs(20)}px ${fs(16)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(5)}}>
            <div style={{fontSize:fs(18),color:TH.p,textAlign:"center",lineHeight:1.3}}>{meta.judul||"Judul Buku"}</div>
            {meta.subjudul&&<div style={{fontSize:fs(8),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
            <div style={{width:"50%",height:0.5,background:TH.a}}/>
            <div style={{fontSize:fs(16),color:TH.a}}>❧</div>
            <div style={{width:"50%",height:0.5,background:TH.a}}/>
            <div style={{fontSize:fs(9),color:TH.p,fontFamily:getCSS(bodyFont),marginTop:fs(4)}}>{meta.penulis||"Nama Penulis"}</div>
            {meta.penerbit&&<div style={{fontSize:fs(7),color:"#999"}}>{meta.penerbit}</div>}
          </div>
        </>}
        {theme==="bisnis"&&<>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"42%",background:TH.p}}/>
          <div style={{position:"absolute",top:"41%",left:0,right:0,height:fs(3),background:TH.a}}/>
          <div style={{padding:`${fs(12)}px ${fs(14)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative"}}>
            <div>
              <div style={{fontSize:fs(6),color:"rgba(255,255,255,0.65)",letterSpacing:2,textTransform:"uppercase",marginBottom:fs(6)}}>{meta.penerbit||"PENERBIT"}</div>
              <div style={{fontSize:fs(15),fontWeight:700,color:"#fff",lineHeight:1.2}}>{meta.judul||"JUDUL BUKU"}</div>
              {meta.subjudul&&<div style={{fontSize:fs(7),color:TH.a,marginTop:fs(4)}}>{meta.subjudul}</div>}
            </div>
            <div style={{paddingTop:fs(10)}}>
              <div style={{fontSize:fs(9),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div>
              <div style={{fontSize:fs(7),color:"#888",marginTop:fs(2)}}>{meta.tahun}</div>
            </div>
          </div>
        </>}
        {theme==="fiksi"&&<>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 35%,${TH.a}28 0%,transparent 65%)`}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/>
          <div style={{padding:`${fs(16)}px ${fs(14)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(6),position:"relative"}}>
            <div style={{fontSize:fs(17),fontStyle:"italic",color:TH.p,textAlign:"center",lineHeight:1.3}}>{meta.judul||"Judul Buku"}</div>
            <div style={{fontSize:fs(14),color:TH.a}}>✦</div>
            <div style={{width:"55%",height:0.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/>
            {meta.subjudul&&<div style={{fontSize:fs(7),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}
            <div style={{marginTop:fs(8),fontSize:fs(8),color:"#888",fontStyle:"italic",fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div>
          </div>
        </>}
      </div>
    );
  };

  // ═══════════════ RENDER ═══════════════
  const STEPS=["Tema","Konten","Metadata","Preview & Font"];
  const btnStyle=(active,col)=>({padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:active?col:"#f1f5f9",color:active?"#fff":"#666",transition:"all 0.15s"});

  return(
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f4f6f8"}}>
      {showFontPicker&&<FontModal/>}

      {/* ── TOP HEADER ── */}
      <div style={{background:`linear-gradient(135deg,${TH.p} 0%,${TH.a} 100%)`,padding:"1rem 1.25rem",marginBottom:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{TH.icon}</div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,letterSpacing:0.3}}>Book Layout Studio Pro</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11}}>Cetak · Digital · Font Kustom · Cover Estetik</div>
          </div>
          {/* Media badge */}
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            {["cetak","ebook"].map(m=>(
              <button key={m} onClick={()=>setMedia(m)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${media===m?"#fff":"rgba(255,255,255,0.4)"}`,background:media===m?"rgba(255,255,255,0.25)":"transparent",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {m==="cetak"?"📗 Cetak":"📱 Ebook"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP BAR ── */}
      <div style={{background:"#fff",borderBottom:"1px solid #e8e8e8",padding:"0 1.25rem"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex"}}>
          {STEPS.map((s,i)=>(
            <div key={i} onClick={()=>i<step&&setStep(i)} style={{flex:1,padding:"10px 4px",textAlign:"center",cursor:i<step?"pointer":"default",borderBottom:i===step?`3px solid ${TH.p}`:"3px solid transparent"}}>
              <div style={{fontSize:18,marginBottom:2}}>
                {i<step?"✅":i===step?["🎨","📄","📋","👁️"][i]:["🎨","📄","📋","👁️"][i]}
              </div>
              <div style={{fontSize:10,fontWeight:700,color:i===step?TH.p:i<step?"#666":"#bbb"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"1.25rem"}}>

        {/* ── STEP 0: Tema ── */}
        {step===0&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
              {Object.entries(THEMES).map(([k,v])=>(
                <div key={k} onClick={()=>switchTheme(k)} style={{border:theme===k?`2.5px solid ${v.p}`:"1.5px solid #e0e0e0",borderRadius:12,padding:"14px 15px",cursor:"pointer",background:theme===k?v.bg:"#fff",transition:"all 0.18s",boxShadow:theme===k?`0 4px 16px ${v.p}28`:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${v.p},${v.a})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{v.icon}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:theme===k?v.p:"#1a1a1a"}}>{v.label}</div>
                      <div style={{fontSize:10,color:"#888",marginTop:1}}>{v.desc}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4,marginBottom:8}}>
                    {v.palette.map((c,i)=><div key={i} style={{width:14,height:14,borderRadius:4,background:c}}/>)}
                  </div>
                  {theme===k&&(
                    <div style={{fontSize:9,color:v.p,fontWeight:700,background:`${v.p}12`,borderRadius:6,padding:"4px 8px",lineHeight:1.5}}>
                      ✓ Heading: {v.dHeadFont} · Body: {v.dBodyFont}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Format */}
            <div style={{marginTop:18,fontWeight:700,fontSize:13,color:"#333",marginBottom:10}}>Ukuran {isEbook?"Layar":"Halaman"}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
              {Object.entries(fmtOpts).map(([k,v])=>(
                <div key={k} onClick={()=>setFormat(k)} style={{border:format===k?`2px solid ${TH.p}`:"1.5px solid #e0e0e0",borderRadius:9,padding:"9px 12px",cursor:"pointer",background:format===k?`${TH.p}0f`:"#fff",transition:"all 0.15s"}}>
                  <div style={{fontSize:12,fontWeight:700,color:format===k?TH.p:"#1a1a1a"}}>{k}</div>
                  <div style={{fontSize:10,color:"#888"}}>{v.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Konten ── */}
        {step===1&&(
          <div>
            <div style={{background:"#fff",borderRadius:12,padding:"16px",marginBottom:14,border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:8}}>Upload File</div>
              <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>document.getElementById("fi").click()}
                style={{border:`2px dashed ${dragOver?TH.p:"#d0d0d0"}`,borderRadius:10,padding:"22px",textAlign:"center",cursor:"pointer",background:dragOver?`${TH.p}08`:"#fafafa",transition:"all 0.18s"}}>
                <div style={{fontSize:32,marginBottom:6}}>📂</div>
                <div style={{fontSize:13,fontWeight:600,color:TH.p}}>{fileName||"Klik atau seret file .txt / .md"}</div>
                <div style={{fontSize:10,color:"#bbb",marginTop:4}}>Format: .txt dan .md</div>
                <input id="fi" type="file" accept=".txt,.md" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:"16px",border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:6}}>Atau Tempel Teks</div>
              <div style={{fontSize:11,color:"#888",marginBottom:10,lineHeight:1.7}}>
                Tag: <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 6px",borderRadius:4,fontSize:10}}># BAB I</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 6px",borderRadius:4,fontSize:10}}>[KUTIPAN]</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 6px",borderRadius:4,fontSize:10}}>[ARAB]</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 6px",borderRadius:4,fontSize:10}}>[CATATAN]</code>
              </div>
              <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Tempelkan isi buku di sini... Konten tidak akan diubah sama sekali."
                style={{width:"100%",minHeight:200,borderRadius:8,padding:"10px 12px",fontFamily:"inherit",fontSize:12,lineHeight:1.75,resize:"vertical",border:"1.5px solid #e0e0e0",boxSizing:"border-box",outline:"none"}}/>
              <div style={{fontSize:10,color:"#bbb",marginTop:4}}>{content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}</div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Metadata ── */}
        {step===2&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"start"}}>
            <div style={{background:"#fff",borderRadius:12,padding:"16px",border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:14}}>Informasi Buku</div>
              {[{k:"judul",l:"Judul Buku *",ph:"Masukkan judul buku"},{k:"subjudul",l:"Sub-judul",ph:"Opsional"},{k:"penulis",l:"Nama Penulis *",ph:"Nama lengkap"},{k:"penerbit",l:"Penerbit",ph:"Nama penerbit"},{k:"tahun",l:"Tahun Terbit",ph:"2026"}].map(({k,l,ph:pl})=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>{l}</label>
                  <input value={meta[k]} onChange={e=>setMeta(m=>({...m,[k]:e.target.value}))} placeholder={pl}
                    style={{width:"100%",padding:"8px 11px",borderRadius:8,fontSize:13,border:"1.5px solid #e0e0e0",boxSizing:"border-box",outline:"none",transition:"border 0.15s"}}
                    onFocus={e=>e.target.style.border=`1.5px solid ${TH.p}`} onBlur={e=>e.target.style.border="1.5px solid #e0e0e0"}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:2}}>Preview Cover</div>
              <CoverThumb size={150}/>
              <div style={{fontSize:9,color:"#bbb",textAlign:"center"}}>Diperbarui otomatis</div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Preview & Font ── */}
        {step===3&&(
          <div>
            {/* Font picker bar — di atas preview */}
            <div style={{background:"#fff",borderRadius:12,padding:"12px 14px",marginBottom:12,border:"1.5px solid #e8e8e8",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#333"}}>🔤 Font Aktif:</div>
              <button onClick={()=>{setPT("head");setFS("rec");setSFP(true);}} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",borderRadius:8,border:`1.5px solid ${TH.p}`,background:`${TH.p}0d`,cursor:"pointer"}}>
                <span style={{fontSize:10,color:TH.p,fontWeight:700}}>Judul</span>
                <span style={{fontFamily:getCSS(headFont),fontSize:13,color:TH.p,fontWeight:600}}>{headFont}</span>
                <span style={{fontSize:10,color:TH.a}}>▼</span>
              </button>
              <button onClick={()=>{setPT("body");setFS("rec");setSFP(true);}} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",borderRadius:8,border:`1.5px solid ${TH.a}`,background:`${TH.a}0d`,cursor:"pointer"}}>
                <span style={{fontSize:10,color:"#666",fontWeight:700}}>Isi</span>
                <span style={{fontFamily:getCSS(bodyFont),fontSize:13,color:"#444"}}>{bodyFont}</span>
                <span style={{fontSize:10,color:TH.a}}>▼</span>
              </button>
              <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#aaa"}}>{isEbook?"📱 Ebook":"📗 Cetak"}</span>
                <CoverThumb size={48}/>
              </div>
            </div>

            {/* Preview area */}
            <div style={{border:"1.5px solid #e0e0e0",borderRadius:12,background:TH.bg,padding:isEbook?"14px 16px":"20px 26px",maxHeight:400,overflowY:"auto",boxShadow:"0 4px 20px rgba(0,0,0,0.08)",fontFamily:getCSS(bodyFont)}}>
              {/* Header mock */}
              {!isEbook&&(
                <div style={{borderBottom:`1.5px solid ${TH.a}`,marginBottom:12,paddingBottom:5,display:"flex",justifyContent:["kiri-kanan","bold"].includes(TH.hStyle)?"space-between":"center",fontSize:9,color:TH.p,fontFamily:getCSS(headFont)}}>
                  {TH.hStyle==="ornamen"&&<span style={{fontStyle:"italic"}}>{TH.ornamen} {meta.judul||"Judul Buku"} {TH.ornamen}</span>}
                  {TH.hStyle==="warna"&&<span style={{fontWeight:700}}>{meta.judul||"Judul Buku"}</span>}
                  {TH.hStyle==="kiri-kanan"&&<><span>{meta.judul||"Judul"}</span><span style={{color:"#aaa"}}>1</span></>}
                  {TH.hStyle==="italic"&&<span style={{fontStyle:"italic"}}>{meta.judul||"Judul Buku"}</span>}
                  {TH.hStyle==="bold"&&<><span style={{fontWeight:700}}>{meta.penulis||""}</span><span style={{color:"#aaa"}}> | {meta.judul||"Judul"}</span></>}
                </div>
              )}

              {/* Preview content */}
              {preview?preview.secs.slice(0,8).map((sec,i)=>(
                <div key={i}>
                  {sec.type==="h"&&(
                    <div style={{fontFamily:getCSS(headFont),fontSize:14,fontWeight:TH.headSz>=38?700:400,color:TH.p,margin:"12px 0 5px",
                      ...(theme==="islami"?{textAlign:"center",background:"#F5F0E8",padding:"4px 8px",borderTop:`1px solid ${TH.a}`,borderBottom:`1px solid ${TH.a}`}:{}),
                      ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",borderRadius:6}:{}),
                      ...(theme==="akademik"?{textAlign:"center",textTransform:"uppercase",letterSpacing:0.8}:{}),
                      ...(theme==="memoir"?{textAlign:"center",fontWeight:400}:{}),
                      ...(theme==="bisnis"?{borderLeft:`3px solid ${TH.a}`,paddingLeft:8}:{}),
                      ...(theme==="fiksi"?{textAlign:"center",fontStyle:"italic"}:{}),
                    }}>
                      {theme==="anak"?`★ ${sec.text} ★`:theme==="akademik"?sec.text.toUpperCase():sec.text}
                    </div>
                  )}
                  {(sec.p||[]).slice(0,5).map((pp,j)=>(
                    <div key={j}>
                      {pp.type==="p"&&<p style={{
                        fontSize:isEbook?12:11,lineHeight:aBodyLn/200,textAlign:TH.bAlign,
                        textIndent:aBodyIn>0?`${aBodyIn/1440}in`:"0",
                        margin:`0 0 ${aBodyAft>0?8:2}px`,
                        fontFamily:getCSS(bodyFont),color:TH.text,wordSpacing:"normal",
                      }} dangerouslySetInnerHTML={{__html:
                        // Render inline footnote markers as superscript in preview
                        iHTML(pp.text).replace(/\[(\d+)\]|\((\d+)\)|\^(\d+)/g, (m,a,b,c)=>{
                          const k=a||b||c;
                          return `<sup style="font-size:0.75em;color:${TH.p};font-weight:700;line-height:0">${preview.fnMap?.[k]||k}</sup>`;
                        })
                      }}/>}
                      {pp.type==="q"&&<div style={{fontFamily:getCSS(headFont),fontSize:11,color:TH.p,fontStyle:"italic",margin:"7px 0",
                        ...(theme==="islami"?{textAlign:"center",borderLeft:`3px solid ${TH.a}`,paddingLeft:8}:{}),
                        ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"5px",border:`1px solid ${TH.a}`}:{}),
                        ...(theme==="akademik"?{paddingLeft:20,borderLeft:`2px solid ${TH.a}`}:{}),
                        ...(theme==="bisnis"?{background:"#F5F5F5",padding:"5px 9px",borderLeft:`4px solid ${TH.p}`}:{}),
                      }}>{`"${pp.text}"`}</div>}
                      {pp.type==="a"&&<div style={{textAlign:"right",fontSize:14,fontFamily:"Amiri,serif",direction:"rtl",margin:"7px 0",color:TH.p}}>{pp.text}</div>}
                      {pp.type==="f"&&<div style={{fontSize:9,color:"#888",borderTop:"0.5px solid #ccc",marginTop:8,paddingTop:3,fontFamily:getCSS(bodyFont)}}>
                        <sup style={{color:TH.p,fontWeight:700}}>†</sup> {pp.text}
                      </div>}
                    </div>
                  ))}
                </div>
              )):<div style={{textAlign:"center",padding:"40px 0",color:"#ccc",fontSize:13}}>Preview konten akan tampil di sini</div>}

              {/* Footnote preview area */}
              {preview&&preview.fnDefs&&Object.keys(preview.fnDefs).length>0&&(
                <div style={{marginTop:16,borderTop:`1.5px solid ${TH.a}`,paddingTop:8}}>
                  <div style={{width:"35%",height:0.5,background:"#ccc",marginBottom:6}}/>
                  {Object.entries(preview.fnDefs).map(([k,txt])=>(
                    <div key={k} style={{display:"flex",gap:5,marginBottom:4,fontFamily:getCSS(bodyFont),fontSize:9,color:"#555",lineHeight:1.6}}>
                      <sup style={{color:TH.p,fontWeight:700,flexShrink:0,marginTop:1}}>{preview.fnMap?.[k]||k}</sup>
                      <span>{txt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer mock */}
              {!isEbook&&preview&&(
                <div style={{borderTop:`1.5px solid ${TH.a}`,marginTop:12,paddingTop:5,fontSize:9,color:TH.p,textAlign:"center"}}>
                  {TH.fStyle==="ornamen"&&`${TH.ornamen} 1 ${TH.ornamen}`}
                  {TH.fStyle==="warna"&&<span style={{fontWeight:700,fontFamily:getCSS(headFont)}}>1</span>}
                  {TH.fStyle==="angka"&&"1"}
                  {TH.fStyle==="titik"&&"— 1 —"}
                  {TH.fStyle==="kanan"&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#aaa"}}>{meta.penulis||""}</span><span>1</span></div>}
                </div>
              )}
            </div>

            {status&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:8,fontSize:12,textAlign:"center",background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#666"}}>{status}</div>}

            <button onClick={doDownload} disabled={generating} style={{marginTop:12,width:"100%",padding:14,borderRadius:10,background:generating?"#ccc":`linear-gradient(135deg,${TH.p},${TH.a})`,color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:generating?"not-allowed":"pointer",boxShadow:generating?"none":`0 4px 16px ${TH.p}44`,transition:"all 0.2s"}}>
              {generating?(status||"Memproses..."):`⬇️ Unduh .docx — ${TH.label} · ${isEbook?"Ebook":"Cetak"}`}
            </button>
            <div style={{fontSize:10,color:"#bbb",textAlign:"center",marginTop:6}}>Microsoft Word · LibreOffice · Google Docs</div>
          </div>
        )}

        {/* ── NAV ── */}
        <div style={{display:"flex",gap:10,marginTop:16}}>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:10,borderRadius:9,background:"#fff",border:"1.5px solid #e0e0e0",cursor:"pointer",fontSize:13,fontWeight:600,color:"#555"}}>← Kembali</button>}
          {step<2&&<button onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{flex:2,padding:10,borderRadius:9,background:canNext[step]?`linear-gradient(135deg,${TH.p},${TH.a})`:"#ccc",color:"#fff",border:"none",cursor:canNext[step]?"pointer":"not-allowed",fontSize:13,fontWeight:700,boxShadow:canNext[step]?`0 3px 12px ${TH.p}40`:"none"}}>Lanjut →</button>}
          {step===2&&<button onClick={doPreview} disabled={!canNext[2]||generating} style={{flex:2,padding:10,borderRadius:9,background:canNext[2]?`linear-gradient(135deg,${TH.p},${TH.a})`:"#ccc",color:"#fff",border:"none",cursor:canNext[2]?"pointer":"not-allowed",fontSize:13,fontWeight:700,boxShadow:canNext[2]?`0 3px 12px ${TH.p}40`:"none"}}>{generating?"Memproses...":"Generate Preview →"}</button>}
        </div>
      </div>
    </div>
  );
}
