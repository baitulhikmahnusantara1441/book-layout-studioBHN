import { useState, useCallback } from "react";

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
  islami:{label:"Islami / Religi",icon:"📖",desc:"Tafsir, fiqh, biografi ulama, doa",p:"#1B4F72",a:"#C9A227",bg:"#F5F0E8",text:"#1a1a1a",palette:["#1B4F72","#C9A227","#F5F0E8","#2E7D32"],dHF:"Amiri",dBF:"Palatino Linotype",hSz:40,bSz:24,ebSz:26,bAl:"both",bLn:400,bIn:720,bAf:0,ebLn:440,ebIn:0,ebAf:160,pqSz:28,arSz:36,fnSz:18,hSt:"ornamen",fSt:"ornamen",orn:"✦",rec:["Amiri","Palatino Linotype","Georgia"],mg:{cetak:{t:1134,b:1418,o:1020,i:1250,g:360},ebook:{t:568,b:568,o:568,i:568,g:0}}},
  anak:{label:"Anak-anak",icon:"🎨",desc:"Cerita anak, dongeng, edukasi",p:"#E53935",a:"#FDD835",bg:"#FFFDE7",text:"#1a1a1a",palette:["#E53935","#FDD835","#43A047","#1E88E5"],dHF:"Comic Sans MS",dBF:"Trebuchet MS",hSz:46,bSz:28,ebSz:30,bAl:"left",bLn:480,bIn:0,bAf:200,ebLn:520,ebIn:0,ebAf:240,pqSz:30,arSz:32,fnSz:20,hSt:"warna",fSt:"warna",orn:"★",rec:["Comic Sans MS","Trebuchet MS","Verdana"],mg:{cetak:{t:1020,b:1134,o:1020,i:1250,g:288},ebook:{t:568,b:568,o:568,i:568,g:0}}},
  akademik:{label:"Akademik / Ilmiah",icon:"🎓",desc:"Skripsi, jurnal, textbook",p:"#1A237E",a:"#1565C0",bg:"#FFFFFF",text:"#111111",palette:["#1A237E","#1565C0","#546E7A","#37474F"],dHF:"Times New Roman",dBF:"Times New Roman",hSz:32,bSz:24,ebSz:26,bAl:"both",bLn:360,bIn:0,bAf:120,ebLn:400,ebIn:0,ebAf:160,pqSz:22,arSz:28,fnSz:18,hSt:"kiri-kanan",fSt:"angka",orn:"",rec:["Times New Roman","Cambria","Georgia"],mg:{cetak:{t:1440,b:1440,o:1440,i:1800,g:360},ebook:{t:720,b:720,o:720,i:720,g:0}}},
  memoir:{label:"Memoir / Sastra",icon:"✍️",desc:"Memoar, novel, cerpen, biografi",p:"#4E342E",a:"#A1887F",bg:"#FDF6EE",text:"#2c1a0e",palette:["#4E342E","#A1887F","#D7CCC8","#6D4C41"],dHF:"Garamond",dBF:"Garamond",hSz:38,bSz:24,ebSz:26,bAl:"both",bLn:400,bIn:640,bAf:0,ebLn:440,ebIn:0,ebAf:160,pqSz:26,arSz:32,fnSz:18,hSt:"italic",fSt:"titik",orn:"❧",rec:["Garamond","Book Antiqua","Palatino Linotype","Georgia"],mg:{cetak:{t:1134,b:1418,o:1020,i:1250,g:360},ebook:{t:568,b:568,o:568,i:568,g:0}}},
  bisnis:{label:"Bisnis / Profesional",icon:"💼",desc:"Manajemen, self-help, motivasi",p:"#212121",a:"#C62828",bg:"#FFFFFF",text:"#111111",palette:["#212121","#C62828","#424242","#757575"],dHF:"Arial",dBF:"Calibri",hSz:34,bSz:22,ebSz:24,bAl:"both",bLn:340,bIn:0,bAf:180,ebLn:380,ebIn:0,ebAf:200,pqSz:28,arSz:28,fnSz:18,hSt:"bold",fSt:"kanan",orn:"◆",rec:["Arial","Calibri","Verdana","Segoe UI"],mg:{cetak:{t:1134,b:1418,o:1020,i:1250,g:360},ebook:{t:568,b:568,o:568,i:568,g:0}}},
  fiksi:{label:"Fiksi / Novel",icon:"📚",desc:"Novel, romance, thriller, fantasi",p:"#4A148C",a:"#7B1FA2",bg:"#FAF7FF",text:"#1a1a2e",palette:["#4A148C","#7B1FA2","#AB47BC","#CE93D8"],dHF:"Palatino Linotype",dBF:"Palatino Linotype",hSz:40,bSz:23,ebSz:26,bAl:"both",bLn:380,bIn:680,bAf:0,ebLn:420,ebIn:0,ebAf:160,pqSz:24,arSz:30,fnSz:18,hSt:"italic",fSt:"titik",orn:"✦",rec:["Palatino Linotype","Garamond","Georgia","Book Antiqua"],mg:{cetak:{t:1134,b:1418,o:1020,i:1250,g:360},ebook:{t:568,b:568,o:568,i:568,g:0}}},
};

const FORMATS={A5:{w:8391,h:11906,l:"A5 · 14.8×21 cm"},A4:{w:11906,h:16838,l:"A4 · 21×29.7 cm"},B5:{w:9978,h:14175,l:"B5 · 17.6×25 cm"},Custom:{w:8788,h:13032,l:"Custom · 15.5×23 cm"}};
const EFORMATS={"Tablet 7\"":{w:5760,h:8640,l:'Tablet 7"'},"Tablet 10\"":{w:7920,h:11520,l:'Tablet 10"'},Kindle:{w:7272,h:9792,l:"Kindle"},A4:{w:11906,h:16838,l:"A4 Layar"}};

const COMMON=new Set(["dan","atau","yang","di","ke","dari","pada","untuk","dengan","adalah","ini","itu","juga","ada","tidak","lebih","akan","bisa","dapat","sudah","telah","oleh","atas","dalam","hal","cara","saya","kami","kita","mereka","ia","dia","bagi","agar","sehingga","namun","tetapi","karena","maka","jika","bila","sejak","saat","ketika","setelah","sebelum","antara","seperti","tentang","bahwa","melalui","terhadap","kepada","sebagai","para","pun","nya","si","sang","pak","bu","mas","mbak","lagi","pula","sedang","hingga","sampai","bahkan","hanya","saja","memang","tentu","malah","tapi","kalau","walau","meski"]);
const isForeign=w=>/^[a-zA-Z]/.test(w)&&!w.toLowerCase().split(/\s+/).every(x=>COMMON.has(x)||x.length<=2);
const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

// ═══════════════ DOCX PARSER (upload .docx) ═══════════════
async function parseDocx(file) {
  // Load JSZip to unpack .docx
  if(!window.JSZip){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
  }
  const ab = await file.arrayBuffer();
  const zip = await window.JSZip.loadAsync(ab);

  // Read document.xml
  const docXml = await zip.file("word/document.xml")?.async("string");
  if(!docXml) throw new Error("Bukan file .docx yang valid");

  // Read footnotes.xml if exists
  const fnXml = await zip.file("word/footnotes.xml")?.async("string") || "";

  // Parse footnotes from footnotes.xml
  const fnMap = {}; // id → text
  if(fnXml){
    const fnMatches = [...fnXml.matchAll(/<w:footnote[^>]*w:id="(\d+)"[^>]*>([\s\S]*?)<\/w:footnote>/g)];
    for(const [,id,inner] of fnMatches){
      if(id==="-1"||id==="0") continue;
      // Extract text from runs, skip footnoteReference
      const texts=[];
      const runMatches=[...inner.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)];
      for(const [,t] of runMatches) texts.push(t);
      const txt=texts.join("").trim();
      if(txt) fnMap[id]=txt;
    }
  }

  // Parse paragraphs from document.xml
  const lines = [];
  const parasXml = [...docXml.matchAll(/<w:p[ >]([\s\S]*?)<\/w:p>/g)];

  for(const [,inner] of parasXml){
    // Check paragraph style
    const styleM = inner.match(/<w:pStyle w:val="([^"]+)"/);
    const style = styleM?.[1]?.toLowerCase()||"";

    // Check outline level / heading
    const olvlM = inner.match(/<w:outlineLvl w:val="(\d+)"/);
    const isHeading = style.includes("heading")||style.includes("judul")||olvlM;
    const headLvl = olvlM ? parseInt(olvlM[1])+1 : style.match(/heading(\d)/)?.[1]||null;

    // Extract runs with footnote refs
    let text="";
    const runBits=[...inner.matchAll(/<w:r[ >]([\s\S]*?)<\/w:r>/g)];
    for(const [,rInner] of runBits){
      // Check if run has footnoteRef (superscript number)
      if(/<w:footnoteRef/.test(rInner)) continue; // skip internal marker
      const tM=[...rInner.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)];
      for(const [,t] of tM) text+=t;
    }

    // Check for footnote references inline
    const fnRefs=[...inner.matchAll(/<w:footnoteReference w:id="(\d+)"/g)];
    for(const [,id] of fnRefs){
      text+=`[${id}]`; // embed as [id] marker
    }

    text=text.trim();
    if(!text) continue;

    // Decode XML entities
    text=text.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'");

    if(isHeading && headLvl){
      lines.push(`${"#".repeat(Math.min(parseInt(headLvl)||1,3))} ${text}`);
    } else {
      lines.push(text);
    }
  }

  // Append footnote definitions at end
  if(Object.keys(fnMap).length>0){
    lines.push(""); // blank line separator
    for(const [id,txt] of Object.entries(fnMap)){
      lines.push(`[${id}] ${txt}`);
    }
  }

  return lines.join("\n");
}

// ═══════════════ CONTENT PARSER ═══════════════
function parseCnt(text){
  const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
  const fnDefs={};

  // Pass 1: collect footnote definitions
  for(const line of lines){
    const m=line.match(/^[\[\(](\d+)[\]\)]\s+(.+)$/)||line.match(/^\^(\d+)\s+(.+)$/);
    if(m) fnDefs[m[1]]=m[2];
  }

  // Build fnMap: local key → global sequential number
  let n=0; const fnMap={};
  Object.keys(fnDefs).sort((a,b)=>Number(a)-Number(b)).forEach(k=>{n++;fnMap[k]=n;});

  // Pass 2: parse structure
  const secs=[];let cur=null,ps=[];
  for(const line of lines){
    const isDef=line.match(/^[\[\(](\d+)[\]\)]\s+(.+)$/)||line.match(/^\^(\d+)\s+(.+)$/);
    if(isDef) continue;
    if(/^#+\s/.test(line)||/^(BAB|PASAL|BAGIAN)\s+[IVX\d]/i.test(line)){
      if(cur) secs.push({...cur,p:ps}); cur={type:"h",text:line.replace(/^#+\s*/,"")}; ps=[];
    } else if(/^\[KUTIPAN\]/i.test(line)) ps.push({type:"q",text:line.replace(/^\[KUTIPAN\]/i,"").trim()});
    else if(/^\[ARAB\]/i.test(line))      ps.push({type:"a",text:line.replace(/^\[ARAB\]/i,"").trim()});
    else if(/^\[CATATAN\]/i.test(line))   ps.push({type:"f",text:line.replace(/^\[CATATAN\]/i,"").trim()});
    else {
      const hasFnMark=/\[(\d+)\]|\((\d+)\)|\^(\d+)/.test(line);
      ps.push({type:"p",text:line,hasFn:hasFnMark});
    }
  }
  if(cur) secs.push({...cur,p:ps}); else if(ps.length) secs.push({type:"body",text:"",p:ps});
  return {secs,fnDefs,fnMap};
}

// ═══════════════ MAIN APP ═══════════════
export default function App(){
  const[step,setStep]=useState(0);
  const[media,setMedia]=useState("cetak");
  const[theme,setTheme]=useState("islami");
  const[format,setFormat]=useState("A5");
  const[content,setContent]=useState("");
  const[fileName,setFileName]=useState("");
  const[meta,setMeta]=useState({judul:"",penulis:"",penerbit:"",tahun:new Date().getFullYear(),subjudul:""});
  const[headFont,setHF]=useState("Amiri");
  const[bodyFont,setBF]=useState("Palatino Linotype");
  const[preview,setPreview]=useState(null);
  const[generating,setGen]=useState(false);
  const[parsing,setParsing]=useState(false);
  const[status,setStatus]=useState("");
  const[dragOver,setDrag]=useState(false);
  const[fontSection,setFS]=useState("rec");
  const[pickTarget,setPT]=useState("head");
  const[showFP,setSFP]=useState(false);

  const TH=THEMES[theme];
  const isEbook=media==="ebook";
  const ph=TH.p.replace("#","");
  const ah=TH.a.replace("#","");
  const aBSz=isEbook?TH.ebSz:TH.bSz;
  const aBLn=isEbook?TH.ebLn:TH.bLn;
  const aBIn=isEbook?TH.ebIn:TH.bIn;
  const aBAf=isEbook?TH.ebAf:TH.bAf;
  const mg=TH.mg[media];

  const switchTheme=k=>{setTheme(k);setHF(THEMES[k].dHF);setBF(THEMES[k].dBF);};

  // ─── FILE HANDLER — supports .txt .md .docx ───
  const handleFile=useCallback(async(file)=>{
    if(!file) return;
    setFileName(file.name);
    const ext=file.name.split(".").pop().toLowerCase();
    if(ext==="docx"){
      setParsing(true);
      setStatus("📄 Membaca file .docx...");
      try{
        const txt=await parseDocx(file);
        setContent(txt);
        setStatus("✅ File .docx berhasil dibaca!");
        setTimeout(()=>setStatus(""),3000);
      }catch(e){
        setStatus("❌ Gagal baca .docx: "+e.message);
      }
      setParsing(false);
    } else {
      const r=new FileReader();
      r.onload=e=>setContent(e.target.result);
      r.readAsText(file,"UTF-8");
    }
  },[]);

  const onDrop=e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);};

  // ─── DOCX BUILDER ───
  const buildDocx=async()=>{
    if(!window.JSZip){
      await new Promise((res,rej)=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=res;s.onerror=rej;document.head.appendChild(s);
      });
    }

    const {secs,fnDefs,fnMap}=parseCnt(content);
    const fmt=(isEbook?EFORMATS:FORMATS)[format]||(isEbook?EFORMATS["Tablet 10\""]:FORMATS.A5);
    const hf=headFont,bf=bodyFont;

    // ── Word XML helpers ──
    const r=(txt,o={})=>{
      const rp=[o.b?"<w:b/><w:bCs/>":"",o.i?"<w:i/><w:iCs/>":"",
        o.sz?`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>` :"",
        o.c?`<w:color w:val="${o.c}"/>`:"",
        o.f?`<w:rFonts w:ascii="${o.f}" w:hAnsi="${o.f}" w:cs="${o.f}"/>`:"",
        o.rtl?"<w:rtl/>":"",o.sup?"<w:vertAlign w:val=\"superscript\"/>":"",
      ].filter(Boolean).join("");
      return `<w:r><w:rPr>${rp}</w:rPr><w:t xml:space="preserve">${esc(txt)}</w:t></w:r>`;
    };

    const rMix=(txt,o={})=>txt.split(/(\b[a-zA-Z]+(?:\s+[a-zA-Z]+){0,3}\b)/g).filter(Boolean)
      .map(part=>r(part,{...o,i:o.i||isForeign(part)})).join("");

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

    // ── FOOTNOTE XML — proper w:footnoteReference ──
    // Footnotes are referenced inline via w:footnoteReference, NOT superscript text
    const fnRefXml=(id)=>`<w:r><w:rPr><w:rStyle w:val="FootnoteReference"/></w:rPr><w:footnoteReference w:id="${id}"/></w:r>`;

    // Build runs with inline footnote markers replaced by proper Word footnote refs
    const rWithFn=(txt,o={})=>{
      const parts=txt.split(/(\[\d+\]|\(\d+\)|\^\d+)/g);
      return parts.filter(Boolean).map(part=>{
        const km=part.match(/^\[(\d+)\]$|^\((\d+)\)$|^\^(\d+)$/);
        if(km){
          const key=km[1]||km[2]||km[3];
          if(fnDefs[key]){
            const gn=fnMap[key]||key;
            return fnRefXml(gn); // ← proper Word footnote reference
          }
        }
        return rMix(part,o);
      }).join("");
    };

    // ── COVER ──
    let body="";
    const hSz=isEbook?TH.hSz+4:TH.hSz;
    const covers={
      islami:()=>{
        body+=p(r("بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ",{sz:30,f:"Amiri",c:ah,rtl:true}),{al:"center",be:600,af:0,rtl:true});
        body+=p(r("",{sz:4}),{af:0,bF:true});
        body+=p(r(meta.judul||"Judul Buku",{b:true,sz:hSz,c:ph,f:hf}),{al:"center",be:200,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:26,c:ah,f:hf}),{al:"center",be:60,af:0});
        body+=p(r(`── ${TH.orn} ──`,{sz:22,c:ah}),{al:"center",be:120,af:0});
        body+=p(r(meta.penulis||"",{sz:24,c:ph,f:hf}),{al:"center",be:100,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:18,c:"777777",f:bf}),{al:"center",be:60,af:0});
        body+=p(r(String(meta.tahun),{sz:16,c:"999999"}),{al:"center",be:60,af:0});
        body+=p(r("",{sz:4}),{be:200,af:0,bF:true});
      },
      anak:()=>{
        body+=p(r(`★ ${meta.judul||"Judul Buku"} ★`,{b:true,sz:hSz+8,c:ph,f:hf}),{al:"center",be:720,af:0,shd:TH.bg.replace("#",""),kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:30,c:"438a47",f:hf}),{al:"center",be:80,af:0});
        body+=p(r("★  ◆  ★",{sz:32,c:ah}),{al:"center",be:160,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:28,c:ph,f:bf}),{al:"center",be:200,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:20,c:"777777"}),{al:"center",be:60,af:0});
      },
      akademik:()=>{
        body+=p(r("",{sz:4}),{bF:true,be:0,af:0});
        body+=p(r((meta.penerbit||"UNIVERSITAS / LEMBAGA").toUpperCase(),{sz:20,c:ph,f:hf}),{al:"center",be:480,af:0});
        body+=p(r("",{sz:4}),{bF:true,be:100,af:0});
        body+=p(r((meta.judul||"JUDUL PENELITIAN").toUpperCase(),{b:true,sz:hSz,c:ph,f:hf}),{al:"center",be:320,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:22,c:"444444",f:hf}),{al:"center",be:80,af:0});
        body+=p(r("",{sz:4}),{bF:true,be:320,af:0});
        body+=p(r("Oleh:",{sz:20,c:"555555",f:bf}),{al:"center",be:320,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:24,c:ph,f:bf}),{al:"center",be:80,af:0});
        body+=p(r(String(meta.tahun),{sz:18,c:"555555"}),{al:"center",be:120,af:0});
        body+=p(r("",{sz:4}),{bF:true,be:160,af:0});
      },
      memoir:()=>{
        body+=p(r(meta.judul||"Judul Buku",{sz:hSz,c:ph,f:hf}),{al:"center",be:1200,af:0,kn:true});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:22,c:ah,f:hf}),{al:"center",be:60,af:0});
        body+=p(r("",{sz:4}),{bF:true,be:160,af:0});
        body+=p(r("❧",{sz:48,c:ah,f:hf}),{al:"center",be:100,af:0});
        body+=p(r("",{sz:4}),{bF:true,be:0,af:0});
        body+=p(r(meta.penulis||"",{sz:22,c:ph,f:bf}),{al:"center",be:320,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:16,c:"888888",f:bf}),{al:"center",be:60,af:0});
        body+=p(r(String(meta.tahun),{sz:16,c:"aaaaaa"}),{al:"center",be:60,af:0});
      },
      bisnis:()=>{
        body+=p(r(meta.judul||"JUDUL BUKU",{b:true,sz:hSz+6,c:ph,f:hf}),{al:"left",be:720,af:0,kn:true,bL:true,bLsz:28});
        if(meta.subjudul) body+=p(r(meta.subjudul,{sz:22,c:ah,f:bf}),{al:"left",be:80,af:0,iL:160});
        body+=p(r("",{sz:4}),{bF:true,be:200,af:0});
        body+=p(r(meta.penulis||"",{b:true,sz:24,c:ph,f:bf}),{al:"left",be:200,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:18,c:"666666",f:bf}),{al:"left",be:60,af:0});
      },
      fiksi:()=>{
        body+=p(r(meta.judul||"Judul Buku",{i:true,sz:hSz+4,c:ph,f:hf}),{al:"center",be:960,af:0,kn:true});
        body+=p(r("✦",{sz:28,c:ah}),{al:"center",be:60,af:0,kn:true});
        body+=p(r("",{sz:4}),{bF:true,be:0,af:0});
        if(meta.subjudul) body+=p(r(meta.subjudul,{i:true,sz:20,c:ah,f:hf}),{al:"center",be:100,af:0});
        body+=p(r(meta.penulis||"",{i:true,sz:20,c:"555555",f:bf}),{al:"center",be:260,af:0});
        if(meta.penerbit) body+=p(r(meta.penerbit,{sz:16,c:"888888"}),{al:"center",be:60,af:0});
      },
    };
    covers[theme]();

    // ── CONTENT ──
    for(const sec of secs){
      if(sec.type==="h"){
        ({
          islami:()=>{body+=p(r("",{sz:4}),{bF:true,be:0,af:0});body+=p(r(sec.text,{b:true,sz:TH.hSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:isEbook?360:240,af:0,kn:true,shd:"F5F0E8"});body+=p(r(`── ${TH.orn} ──`,{sz:16,c:ah}),{al:"center",be:40,af:240,kn:true});},
          anak:()=>body+=p(r(`${TH.orn} ${sec.text} ${TH.orn}`,{b:true,sz:TH.hSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:240,af:200,kn:true,shd:TH.bg.replace("#","")}),
          akademik:()=>{body+=p(r(sec.text.toUpperCase(),{b:true,sz:TH.hSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:400,af:0,kn:true});body+=p(r("",{sz:4}),{bF:true,be:0,af:320,kn:true});},
          memoir:()=>{body+=p(r(sec.text,{sz:TH.hSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:800,af:0,kn:true});body+=p(r("❧",{sz:26,c:ah,f:hf}),{al:"center",be:40,af:320,kn:true});},
          bisnis:()=>{body+=p(r(sec.text,{b:true,sz:TH.hSz,c:ph,f:hf}),{al:"left",pb:!isEbook,be:280,af:0,kn:true,bL:true,bLsz:22});body+=p(r("",{sz:4}),{bT:true,be:0,af:180,kn:true});},
          fiksi:()=>{body+=p(r(sec.text,{sz:TH.hSz,c:ph,f:hf}),{al:"center",pb:!isEbook,be:800,af:0,kn:true});body+=p(r("✦  ✦  ✦",{sz:18,c:ah}),{al:"center",be:40,af:320,kn:true});},
        })[theme]?.();
      }
      for(const pp of sec.p||[]){
        if(pp.type==="p"){
          const runs=pp.hasFn?rWithFn(pp.text,{sz:aBSz,f:bf}):rMix(pp.text,{sz:aBSz,f:bf});
          body+=p(runs,{al:TH.bAl,ind:aBIn,ln:aBLn,af:aBAf,be:0,kl:true});
        } else if(pp.type==="q"){
          ({
            islami:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",iLR:720,be:180,af:180,kl:true,bL:true}),
            anak:()=>body+=p(r(`"${pp.text}"`,{b:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",be:140,af:140,kl:true,bF:true,shd:TH.bg.replace("#","")}),
            akademik:()=>body+=p(r(pp.text,{i:true,sz:TH.pqSz,c:"444444",f:bf}),{al:"both",iLR:1440,be:140,af:140,kl:true,bL:true,bLsz:6}),
            memoir:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ph,f:hf}),{al:"center",be:200,af:200,kl:true}),
            bisnis:()=>body+=p(r(`"${pp.text}"`,{b:true,sz:TH.pqSz,c:ph,f:bf}),{al:"left",iLR:720,be:140,af:140,kl:true,shd:"F5F5F5",bL:true,bLsz:20}),
            fiksi:()=>body+=p(r(`"${pp.text}"`,{i:true,sz:TH.pqSz,c:ah,f:hf}),{al:"center",be:200,af:200,kl:true}),
          })[theme]?.();
        } else if(pp.type==="a"){
          body+=p(r(pp.text,{sz:TH.arSz,f:"Amiri",rtl:true}),{al:"right",be:160,af:160,rtl:true,kl:true});
        } else if(pp.type==="f"){
          // [CATATAN] manual → treated as endnote-style paragraph with border
          body+=p([r("†",{sz:TH.fnSz,c:ph,sup:true,f:bf}),r(` ${pp.text}`,{sz:TH.fnSz,c:"444444",f:bf})].join(""),{be:80,af:0,bT:true,iL:160});
        }
      }
    }

    // ── FOOTNOTES PART — proper Word XML ──
    const fnEntries=Object.entries(fnMap).map(([key,gn])=>({id:gn,text:fnDefs[key]||""})).filter(e=>e.text);
    const hasFn=fnEntries.length>0;

    const fnPartXml=hasFn?`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:footnote w:type="separator" w:id="-1">
    <w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
      <w:r><w:separator/></w:r></w:p>
  </w:footnote>
  <w:footnote w:type="continuationSeparator" w:id="0">
    <w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
      <w:r><w:continuationSeparator/></w:r></w:p>
  </w:footnote>
  ${fnEntries.map(fn=>`
  <w:footnote w:id="${fn.id}">
    <w:p>
      <w:pPr>
        <w:pStyle w:val="FootnoteText"/>
        <w:jc w:val="both"/>
        <w:spacing w:before="0" w:after="60" w:line="240" w:lineRule="auto"/>
      </w:pPr>
      <w:r><w:rPr><w:rStyle w:val="FootnoteReference"/><w:sz w:val="${TH.fnSz}"/><w:color w:val="${ph}"/></w:rPr>
        <w:footnoteRef/></w:r>
      <w:r><w:rPr>
        <w:sz w:val="${TH.fnSz}"/><w:szCs w:val="${TH.fnSz}"/>
        <w:color w:val="444444"/>
        <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
      </w:rPr><w:t xml:space="preserve"> ${esc(fn.text)}</w:t></w:r>
    </w:p>
  </w:footnote>`).join("")}
</w:footnotes>`:null;

    // Section props
    const hRef=media==="cetak"?`<w:headerReference w:type="default" r:id="rId3"/>`:"";
    const fRef=media==="cetak"?`<w:footerReference w:type="default" r:id="rId4"/>`:"";
    const mxml=isEbook
      ?`<w:pgMar w:top="${mg.t}" w:right="${mg.o}" w:bottom="${mg.b}" w:left="${mg.i}" w:header="0" w:footer="0" w:gutter="0"/>`
      :`<w:pgMar w:top="${mg.t}" w:right="${mg.o}" w:bottom="${mg.b}" w:left="${mg.i}" w:header="568" w:footer="568" w:gutter="${mg.g}"/>`;
    body+=`<w:sectPr>${hRef}${fRef}<w:pgSz w:w="${fmt.w}" w:h="${fmt.h}"/>${mxml}</w:sectPr>`;

    // Styles with FootnoteReference & FootnoteText
    const stylesXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
          xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:docDefaults><w:rPrDefault><w:rPr>
    <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
    <w:sz w:val="${aBSz}"/><w:szCs w:val="${aBSz}"/>
  </w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="character" w:styleId="FootnoteReference">
    <w:name w:val="footnote reference"/>
    <w:rPr><w:vertAlign w:val="superscript"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="FootnoteText">
    <w:name w:val="footnote text"/>
    <w:pPr><w:spacing w:after="60" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:rPr>
      <w:sz w:val="${TH.fnSz}"/><w:szCs w:val="${TH.fnSz}"/>
      <w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/>
    </w:rPr>
  </w:style>
</w:styles>`;

    // Header/Footer builders
    const pgn=`<w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    const bBt=`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
    const bBtB=`<w:pBdr><w:bottom w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;
    const bTp=`<w:pBdr><w:top w:val="single" w:sz="6" w:space="4" w:color="${ah}"/></w:pBdr>`;
    const bTpB=`<w:pBdr><w:top w:val="thick" w:sz="8" w:space="4" w:color="${ph}"/></w:pBdr>`;
    const hdrs={
      ornamen:`<w:p><w:pPr><w:jc w:val="center"/>${bBt}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">${TH.orn}  </w:t></w:r><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">  ${TH.orn}</w:t></w:r></w:p>`,
      warna:`<w:p><w:pPr><w:jc w:val="left"/>${bBt}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="20"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
      "kiri-kanan":`<w:p><w:pPr><w:jc w:val="left"/>${bBt}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.i-mg.o}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="${ph}"/><w:sz w:val="16"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`,
      italic:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="${ph}"/><w:sz w:val="17"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
      bold:`<w:p><w:pPr><w:jc w:val="left"/>${bBtB}</w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="18"/><w:rFonts w:ascii="${hf}" w:hAnsi="${hf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:color w:val="AAAAAA"/><w:sz w:val="17"/></w:rPr><w:t xml:space="preserve">  |  ${esc(meta.judul||"Judul")}</w:t></w:r></w:p>`,
    };
    const ftrs={
      ornamen:`<w:p><w:pPr><w:jc w:val="center"/>${bTp}</w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">${TH.orn}  </w:t></w:r>${pgn}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="14"/></w:rPr><w:t xml:space="preserve">  ${TH.orn}</w:t></w:r></w:p>`,
      warna:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="${ph}"/><w:sz w:val="22"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`,
      angka:`<w:p><w:pPr><w:jc w:val="center"/>${bTp}</w:pPr>${pgn}</w:p>`,
      titik:`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">— </w:t></w:r>${pgn}<w:r><w:rPr><w:color w:val="${ah}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve"> —</w:t></w:r></w:p>`,
      kanan:`<w:p><w:pPr><w:jc w:val="left"/>${bTpB}<w:tabs><w:tab w:val="right" w:pos="${fmt.w-mg.i-mg.o}"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="17"/><w:rFonts w:ascii="${bf}" w:hAnsi="${bf}"/></w:rPr><w:t>${esc(meta.penulis||"")}</w:t></w:r><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:tab/></w:r>${pgn}</w:p>`,
    };
    const mkH=x=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${x}</w:hdr>`;
    const mkF=x=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${x}</w:ftr>`;

    // Content Types & Relationships
    const ov=[
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`,
      `<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>`,
      hasFn?`<Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>` :"",
      media==="cetak"?`<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>` :"",
      media==="cetak"?`<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>` :"",
    ].filter(Boolean).join("\n");

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
    zip.file("word/styles.xml",stylesXml);
    zip.file("word/settings.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
    zip.file("word/_rels/document.xml.rels",docRels);
    if(hasFn) zip.file("word/footnotes.xml",fnPartXml);
    if(media==="cetak"){
      zip.file("word/header1.xml",mkH(hdrs[TH.hSt]||hdrs.italic));
      zip.file("word/footer1.xml",mkF(ftrs[TH.fSt]||ftrs.titik));
    }
    const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download=`${(meta.judul||"buku").replace(/\s+/g,"_")}_${theme}_${media}.docx`;
    a.click();URL.revokeObjectURL(url);
  };

  const doDownload=async()=>{setGen(true);setStatus("Memproses...");try{await buildDocx();setStatus("✅ Berhasil diunduh!");}catch(e){console.error(e);setStatus("❌ "+e.message);}setGen(false);setTimeout(()=>setStatus(""),4000);};
  const doPreview=()=>{setGen(true);setTimeout(()=>{const d=parseCnt(content);setPreview(d);setGen(false);setStep(3);},400);};
  const fmtOpts=isEbook?EFORMATS:FORMATS;

  // ─── FONT PICKER MODAL ───
  const FontModal=()=>{
    const tabs=[{id:"rec",l:"⭐ Rekomendasi"},{id:"serif",l:"Serif"},{id:"sansserif",l:"Sans-Serif"},{id:"anak",l:"Anak-anak"},{id:"arab",l:"Arab / Islami"}];
    const recFonts=ALL_FONTS.filter(f=>TH.rec.includes(f.id));
    const listMap={rec:recFonts,serif:FONTS.serif,sansserif:FONTS.sansserif,anak:FONTS.anak,arab:FONTS.arab};
    const list=listMap[fontSection]||recFonts;
    const cur=pickTarget==="head"?headFont:bodyFont;
    const setCur=pickTarget==="head"?setHF:setBF;
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setSFP(false)}>
        <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:600,maxHeight:"88vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
          <div style={{background:`linear-gradient(135deg,${TH.p},${TH.a})`,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>Pilih Font — {pickTarget==="head"?"Judul":"Isi Buku"}</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10,marginTop:2}}>Klik untuk memilih · preview langsung</div></div>
            <button onClick={()=>setSFP(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:7,padding:"5px 11px",cursor:"pointer",fontSize:12,fontWeight:700}}>✕</button>
          </div>
          <div style={{display:"flex",borderBottom:"1px solid #f0f0f0"}}>
            {["head","body"].map(t=><button key={t} onClick={()=>setPT(t)} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:pickTarget===t?`${TH.p}10`:"#fff",color:pickTarget===t?TH.p:"#888",borderBottom:pickTarget===t?`2px solid ${TH.p}`:"2px solid transparent"}}>{t==="head"?"🔠 Font Judul":"📝 Font Isi"}</button>)}
          </div>
          <div style={{display:"flex",gap:4,padding:"8px 14px",overflowX:"auto",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
            {tabs.map(t=><button key={t.id} onClick={()=>setFS(t.id)} style={{padding:"4px 11px",borderRadius:20,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,whiteSpace:"nowrap",background:fontSection===t.id?TH.p:"#f1f5f9",color:fontSection===t.id?"#fff":"#666"}}>{t.l}</button>)}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {list.map(f=>{
              const sel=cur===f.id;
              const isArab=f.id==="Amiri"||f.id==="Traditional Arabic";
              return(
                <div key={f.id} onClick={()=>setCur(f.id)} style={{border:sel?`2px solid ${TH.p}`:"1px solid #e8e8e8",borderRadius:9,padding:"10px 12px",cursor:"pointer",background:sel?`${TH.p}0d`:"#fafafa",position:"relative"}}>
                  {sel&&<div style={{position:"absolute",top:5,right:7,fontSize:10,color:TH.p,fontWeight:700}}>✓</div>}
                  {TH.rec.includes(f.id)&&!sel&&<div style={{position:"absolute",top:5,right:7,fontSize:8,background:`${TH.a}44`,color:TH.a,borderRadius:3,padding:"1px 4px",fontWeight:700}}>★</div>}
                  <div style={{fontSize:9,fontWeight:700,color:sel?TH.p:"#555",marginBottom:5,fontFamily:"system-ui"}}>{f.id}</div>
                  <div style={{fontFamily:f.css,fontSize:isArab?14:12,color:sel?TH.p:"#222",lineHeight:1.55,direction:isArab?"rtl":"ltr"}}>{f.sample}</div>
                  <div style={{fontSize:8,color:"#bbb",marginTop:4,fontFamily:"system-ui"}}>{f.note}</div>
                </div>
              );
            })}
          </div>
          <div style={{borderTop:"1px solid #f0f0f0",padding:"10px 14px",background:`${TH.p}06`}}>
            <div style={{fontSize:9,color:TH.p,fontWeight:700,marginBottom:5}}>PREVIEW KOMBINASI</div>
            <div style={{fontFamily:getCSS(headFont),fontSize:14,color:TH.p,fontWeight:600,marginBottom:3}}>{meta.judul||"Judul Buku Contoh"}</div>
            <div style={{fontFamily:getCSS(bodyFont),fontSize:11,color:TH.text,lineHeight:1.75}}>Ini adalah contoh teks isi buku. <em>Foreign words in italic.</em> Font yang tepat membuat bacaan nyaman.</div>
            <div style={{marginTop:5,fontSize:9,color:"#999"}}>Heading: <strong style={{fontFamily:getCSS(headFont)}}>{headFont}</strong> · Body: <strong style={{fontFamily:getCSS(bodyFont)}}>{bodyFont}</strong></div>
          </div>
        </div>
      </div>
    );
  };

  // ─── COVER THUMB ───
  const CoverThumb=({size=160})=>{
    const h=size*1.414;
    const fs=n=>Math.round(n*(size/220));
    return(
      <div style={{width:size,height:h,borderRadius:6,overflow:"hidden",boxShadow:"3px 6px 20px rgba(0,0,0,0.2)",background:TH.bg,fontFamily:getCSS(headFont),flexShrink:0,position:"relative"}}>
        {theme==="islami"&&<><div style={{position:"absolute",top:0,left:0,right:0,height:fs(5),background:TH.a}}/><div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(5),background:TH.a}}/><div style={{padding:`${fs(16)}px ${fs(12)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(4)}}><div style={{fontSize:fs(9),color:TH.a,fontFamily:"Amiri,serif",direction:"rtl"}}>بِسْمِ اللهِ</div><div style={{width:"80%",height:0.5,background:TH.a}}/><div style={{fontSize:fs(13),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.25}}>{meta.judul||"Judul Buku"}</div>{meta.subjudul&&<div style={{fontSize:fs(7),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}<div style={{fontSize:fs(9),color:TH.a}}>── ✦ ──</div><div style={{fontSize:fs(8),color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Nama Penulis"}</div><div style={{width:"80%",height:0.5,background:TH.a}}/></div></>}
        {theme==="anak"&&<><div style={{height:fs(7),background:`linear-gradient(90deg,${TH.p},${TH.a},#43A047,#1E88E5)`}}/><div style={{padding:`${fs(10)}px`,display:"flex",flexDirection:"column",alignItems:"center",gap:fs(5)}}><div style={{fontSize:fs(20)}}>🌟</div><div style={{fontSize:fs(13),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.2}}>★ {meta.judul||"Judul"} ★</div><div style={{fontSize:fs(11),color:TH.a}}>★  ◆  ★</div><div style={{fontSize:fs(9),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Penulis"}</div></div><div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(7),background:`linear-gradient(90deg,#1E88E5,#43A047,${TH.a},${TH.p})`}}/></>}
        {theme==="akademik"&&<><div style={{height:fs(4),background:TH.p}}/><div style={{padding:`${fs(12)}px ${fs(10)}px`,display:"flex",flexDirection:"column",alignItems:"center",gap:fs(4)}}><div style={{fontSize:fs(6),color:TH.p,fontWeight:700,textTransform:"uppercase",textAlign:"center"}}>{meta.penerbit||"Universitas"}</div><div style={{width:"100%",height:0.5,background:TH.p}}/><div style={{fontSize:fs(11),fontWeight:700,color:TH.p,textAlign:"center",lineHeight:1.3,textTransform:"uppercase"}}>{meta.judul||"JUDUL"}</div><div style={{width:"100%",height:0.5,background:TH.p}}/><div style={{fontSize:fs(6),color:"#666"}}>Oleh:</div><div style={{fontSize:fs(8),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Penulis"}</div></div><div style={{position:"absolute",bottom:0,left:0,right:0,height:fs(4),background:TH.p}}/></>}
        {theme==="memoir"&&<><div style={{position:"absolute",inset:fs(5),border:`0.5px solid ${TH.a}`,borderRadius:3,pointerEvents:"none"}}/><div style={{padding:`${fs(18)}px ${fs(14)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(4)}}><div style={{fontSize:fs(16),color:TH.p,textAlign:"center",lineHeight:1.3}}>{meta.judul||"Judul Buku"}</div>{meta.subjudul&&<div style={{fontSize:fs(7),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}<div style={{width:"50%",height:0.5,background:TH.a}}/><div style={{fontSize:fs(15),color:TH.a}}>❧</div><div style={{width:"50%",height:0.5,background:TH.a}}/><div style={{fontSize:fs(8),color:TH.p,fontFamily:getCSS(bodyFont),marginTop:fs(3)}}>{meta.penulis||"Penulis"}</div></div></>}
        {theme==="bisnis"&&<><div style={{position:"absolute",top:0,left:0,right:0,height:"42%",background:TH.p}}/><div style={{position:"absolute",top:"41%",left:0,right:0,height:fs(3),background:TH.a}}/><div style={{padding:`${fs(10)}px ${fs(12)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative"}}><div><div style={{fontSize:fs(5),color:"rgba(255,255,255,0.65)",letterSpacing:2,textTransform:"uppercase",marginBottom:fs(5)}}>{meta.penerbit||"PENERBIT"}</div><div style={{fontSize:fs(13),fontWeight:700,color:"#fff",lineHeight:1.2}}>{meta.judul||"JUDUL"}</div>{meta.subjudul&&<div style={{fontSize:fs(6),color:TH.a,marginTop:fs(3)}}>{meta.subjudul}</div>}</div><div><div style={{fontSize:fs(8),fontWeight:700,color:TH.p,fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Penulis"}</div></div></div></>}
        {theme==="fiksi"&&<><div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 35%,${TH.a}28 0%,transparent 65%)`}}/><div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/><div style={{position:"absolute",bottom:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/><div style={{padding:`${fs(14)}px ${fs(12)}px`,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:fs(5),position:"relative"}}><div style={{fontSize:fs(15),fontStyle:"italic",color:TH.p,textAlign:"center",lineHeight:1.3}}>{meta.judul||"Judul Buku"}</div><div style={{fontSize:fs(12),color:TH.a}}>✦</div><div style={{width:"55%",height:0.5,background:`linear-gradient(90deg,transparent,${TH.a},transparent)`}}/>{meta.subjudul&&<div style={{fontSize:fs(6),color:TH.a,fontStyle:"italic",textAlign:"center"}}>{meta.subjudul}</div>}<div style={{marginTop:fs(6),fontSize:fs(7),color:"#888",fontStyle:"italic",fontFamily:getCSS(bodyFont)}}>{meta.penulis||"Penulis"}</div></div></>}
      </div>
    );
  };

  const STEPS=["Tema","Konten","Metadata","Preview & Font"];

  return(
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f4f6f8"}}>
      {showFP&&<FontModal/>}

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${TH.p} 0%,${TH.a} 100%)`,padding:"0.9rem 1.25rem"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{TH.icon}</div>
          <div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>Book Layout Studio Pro</div><div style={{color:"rgba(255,255,255,0.72)",fontSize:10}}>Cetak · Digital · Font Kustom · Cover Estetik · Footnote Proper</div></div>
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            {["cetak","ebook"].map(m=><button key={m} onClick={()=>setMedia(m)} style={{padding:"4px 11px",borderRadius:20,border:`1.5px solid ${media===m?"#fff":"rgba(255,255,255,0.4)"}`,background:media===m?"rgba(255,255,255,0.25)":"transparent",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>{m==="cetak"?"📗 Cetak":"📱 Ebook"}</button>)}
          </div>
        </div>
      </div>

      {/* STEP BAR */}
      <div style={{background:"#fff",borderBottom:"1px solid #e8e8e8",padding:"0 1.25rem"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex"}}>
          {STEPS.map((s,i)=>(
            <div key={i} onClick={()=>i<step&&setStep(i)} style={{flex:1,padding:"8px 4px",textAlign:"center",cursor:i<step?"pointer":"default",borderBottom:i===step?`3px solid ${TH.p}`:"3px solid transparent"}}>
              <div style={{fontSize:16,marginBottom:1}}>{i<step?"✅":["🎨","📄","📋","👁️"][i]}</div>
              <div style={{fontSize:9,fontWeight:700,color:i===step?TH.p:i<step?"#666":"#bbb"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"1rem 1.25rem"}}>

        {/* STEP 0 — Tema */}
        {step===0&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:10,marginBottom:18}}>
              {Object.entries(THEMES).map(([k,v])=>(
                <div key={k} onClick={()=>switchTheme(k)} style={{border:theme===k?`2.5px solid ${v.p}`:"1.5px solid #e0e0e0",borderRadius:12,padding:"13px 14px",cursor:"pointer",background:theme===k?v.bg:"#fff",boxShadow:theme===k?`0 4px 16px ${v.p}28`:"0 1px 4px rgba(0,0,0,0.05)",transition:"all 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                    <div style={{width:34,height:34,borderRadius:8,background:`linear-gradient(135deg,${v.p},${v.a})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{v.icon}</div>
                    <div><div style={{fontSize:11,fontWeight:700,color:theme===k?v.p:"#1a1a1a"}}>{v.label}</div><div style={{fontSize:9,color:"#999",marginTop:1}}>{v.desc}</div></div>
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:7}}>{v.palette.map((c,i)=><div key={i} style={{width:13,height:13,borderRadius:3,background:c}}/>)}</div>
                  {theme===k&&<div style={{fontSize:8,color:v.p,fontWeight:700,background:`${v.p}12`,borderRadius:5,padding:"3px 7px"}}>✓ {v.dHF} · {v.dBF}</div>}
                </div>
              ))}
            </div>
            <div style={{fontWeight:700,fontSize:12,color:"#333",marginBottom:8}}>Ukuran {isEbook?"Layar":"Halaman"}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
              {Object.entries(fmtOpts).map(([k,v])=>(
                <div key={k} onClick={()=>setFormat(k)} style={{border:format===k?`2px solid ${TH.p}`:"1.5px solid #e0e0e0",borderRadius:9,padding:"8px 12px",cursor:"pointer",background:format===k?`${TH.p}0f`:"#fff"}}>
                  <div style={{fontSize:11,fontWeight:700,color:format===k?TH.p:"#1a1a1a"}}>{k}</div>
                  <div style={{fontSize:9,color:"#999"}}>{v.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Konten */}
        {step===1&&(
          <div>
            <div style={{background:"#fff",borderRadius:12,padding:"14px",marginBottom:12,border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#333",marginBottom:8}}>Upload File</div>
              {/* Format badges */}
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {[{ext:".docx",col:"#1565C0",note:"Word — heading & footnote otomatis"},{ext:".txt",col:"#2E7D32",note:"Teks biasa"},{ext:".md",col:"#6A1B9A",note:"Markdown"}].map(f=>(
                  <div key={f.ext} style={{padding:"3px 9px",borderRadius:20,background:`${f.col}14`,border:`1px solid ${f.col}44`,fontSize:9,fontWeight:700,color:f.col}}>
                    {f.ext} <span style={{fontWeight:400,color:"#888"}}>{f.note}</span>
                  </div>
                ))}
              </div>
              <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>document.getElementById("fi").click()}
                style={{border:`2px dashed ${dragOver?TH.p:"#d0d0d0"}`,borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:dragOver?`${TH.p}08`:"#fafafa",transition:"all 0.15s"}}>
                <div style={{fontSize:30,marginBottom:5}}>{parsing?"⏳":"📂"}</div>
                <div style={{fontSize:12,fontWeight:600,color:TH.p}}>{parsing?"Membaca file .docx...":(fileName||"Klik atau seret file ke sini")}</div>
                <div style={{fontSize:9,color:"#bbb",marginTop:3}}>Mendukung .docx · .txt · .md</div>
                <input id="fi" type="file" accept=".txt,.md,.docx" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              </div>
              {status&&<div style={{marginTop:8,padding:"7px 12px",borderRadius:7,fontSize:11,background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#555"}}>{status}</div>}
            </div>

            <div style={{background:"#fff",borderRadius:12,padding:"14px",border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#333",marginBottom:6}}>Atau Tempel Teks Langsung</div>
              <div style={{fontSize:10,color:"#888",marginBottom:9,lineHeight:1.7}}>
                Tag: <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}># BAB I</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}>[KUTIPAN]</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}>[ARAB]</code> · <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}>[CATATAN]</code>
                <br/>Footnote: teks<code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}>[1]</code> di dalam paragraf, lalu di bawah: <code style={{background:"#f0f4ff",color:TH.p,padding:"1px 5px",borderRadius:3,fontSize:9}}>[1] Teks referensi lengkap.</code>
              </div>
              <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Tempelkan isi buku di sini..."
                style={{width:"100%",minHeight:180,borderRadius:8,padding:"9px 11px",fontFamily:"inherit",fontSize:11,lineHeight:1.75,resize:"vertical",border:"1.5px solid #e0e0e0",boxSizing:"border-box",outline:"none"}}/>
              <div style={{fontSize:9,color:"#bbb",marginTop:3}}>{content.length>0?`${content.length.toLocaleString()} karakter · ${content.split(/\s+/).filter(Boolean).length.toLocaleString()} kata`:"Belum ada konten"}</div>
            </div>
          </div>
        )}

        {/* STEP 2 — Metadata */}
        {step===2&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"start"}}>
            <div style={{background:"#fff",borderRadius:12,padding:"14px",border:"1.5px solid #e8e8e8"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#333",marginBottom:12}}>Informasi Buku</div>
              {[{k:"judul",l:"Judul Buku *",ph:"Masukkan judul buku"},{k:"subjudul",l:"Sub-judul",ph:"Opsional"},{k:"penulis",l:"Nama Penulis *",ph:"Nama lengkap"},{k:"penerbit",l:"Penerbit",ph:"Nama penerbit"},{k:"tahun",l:"Tahun Terbit",ph:"2026"}].map(({k,l,ph:pl})=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#555",display:"block",marginBottom:3}}>{l}</label>
                  <input value={meta[k]} onChange={e=>setMeta(m=>({...m,[k]:e.target.value}))} placeholder={pl}
                    style={{width:"100%",padding:"7px 10px",borderRadius:7,fontSize:12,border:"1.5px solid #e0e0e0",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.border=`1.5px solid ${TH.p}`} onBlur={e=>e.target.style.border="1.5px solid #e0e0e0"}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{fontSize:10,fontWeight:700,color:"#555"}}>Preview Cover</div>
              <CoverThumb size={145}/>
              <div style={{fontSize:8,color:"#bbb"}}>Diperbarui otomatis</div>
            </div>
          </div>
        )}

        {/* STEP 3 — Preview & Font */}
        {step===3&&(
          <div>
            {/* Font picker bar */}
            <div style={{background:"#fff",borderRadius:11,padding:"10px 13px",marginBottom:10,border:"1.5px solid #e8e8e8",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#333"}}>🔤 Font:</div>
              <button onClick={()=>{setPT("head");setFS("rec");setSFP(true);}} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:7,border:`1.5px solid ${TH.p}`,background:`${TH.p}0d`,cursor:"pointer"}}>
                <span style={{fontSize:9,color:TH.p,fontWeight:700}}>Judul</span>
                <span style={{fontFamily:getCSS(headFont),fontSize:12,color:TH.p,fontWeight:600}}>{headFont}</span>
                <span style={{fontSize:9,color:TH.a}}>▼</span>
              </button>
              <button onClick={()=>{setPT("body");setFS("rec");setSFP(true);}} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:7,border:`1.5px solid ${TH.a}`,background:`${TH.a}0d`,cursor:"pointer"}}>
                <span style={{fontSize:9,color:"#555",fontWeight:700}}>Isi</span>
                <span style={{fontFamily:getCSS(bodyFont),fontSize:12,color:"#444"}}>{bodyFont}</span>
                <span style={{fontSize:9,color:TH.a}}>▼</span>
              </button>
              <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
                <CoverThumb size={44}/>
              </div>
            </div>

            {/* Preview area */}
            <div style={{border:"1.5px solid #e0e0e0",borderRadius:11,background:TH.bg,padding:isEbook?"12px 14px":"18px 24px",maxHeight:420,overflowY:"auto",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",fontFamily:getCSS(bodyFont)}}>
              {/* Header mock */}
              {!isEbook&&(
                <div style={{borderBottom:`1.5px solid ${TH.a}`,marginBottom:11,paddingBottom:5,display:"flex",justifyContent:["kiri-kanan","bold"].includes(TH.hSt)?"space-between":"center",fontSize:8,color:TH.p,fontFamily:getCSS(headFont)}}>
                  {TH.hSt==="ornamen"&&<span style={{fontStyle:"italic"}}>{TH.orn} {meta.judul||"Judul Buku"} {TH.orn}</span>}
                  {TH.hSt==="warna"&&<span style={{fontWeight:700}}>{meta.judul||"Judul Buku"}</span>}
                  {TH.hSt==="kiri-kanan"&&<><span>{meta.judul||"Judul"}</span><span style={{color:"#aaa"}}>1</span></>}
                  {TH.hSt==="italic"&&<span style={{fontStyle:"italic"}}>{meta.judul||"Judul Buku"}</span>}
                  {TH.hSt==="bold"&&<><span style={{fontWeight:700}}>{meta.penulis||""}</span><span style={{color:"#aaa"}}> | {meta.judul||"Judul"}</span></>}
                </div>
              )}

              {/* Content */}
              {preview?preview.secs.slice(0,8).map((sec,i)=>(
                <div key={i}>
                  {sec.type==="h"&&(
                    <div style={{fontFamily:getCSS(headFont),fontSize:13,fontWeight:TH.hSz>=38?700:400,color:TH.p,margin:"11px 0 5px",
                      ...(theme==="islami"?{textAlign:"center",background:"#F5F0E8",padding:"3px 7px",borderTop:`1px solid ${TH.a}`,borderBottom:`1px solid ${TH.a}`}:{}),
                      ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"4px",borderRadius:5}:{}),
                      ...(theme==="akademik"?{textAlign:"center",textTransform:"uppercase",letterSpacing:0.8}:{}),
                      ...(theme==="memoir"?{textAlign:"center",fontWeight:400}:{}),
                      ...(theme==="bisnis"?{borderLeft:`3px solid ${TH.a}`,paddingLeft:7}:{}),
                      ...(theme==="fiksi"?{textAlign:"center",fontStyle:"italic"}:{}),
                    }}>{theme==="anak"?`★ ${sec.text} ★`:theme==="akademik"?sec.text.toUpperCase():sec.text}</div>
                  )}
                  {(sec.p||[]).slice(0,5).map((pp,j)=>(
                    <div key={j}>
                      {pp.type==="p"&&<p style={{fontSize:isEbook?12:11,lineHeight:aBLn/200,textAlign:TH.bAl,textIndent:aBIn>0?`${aBIn/1440}in`:"0",margin:`0 0 ${aBAf>0?8:2}px`,fontFamily:getCSS(bodyFont),color:TH.text,wordSpacing:"normal"}}
                        dangerouslySetInnerHTML={{__html:
                          (() => {
                            let t = pp.text;
                            // foreign italic
                            t = t.replace(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+){0,3})\b/g, m => isForeign(m)?`<em>${m}</em>`:m);
                            // footnote markers as superscript
                            t = t.replace(/\[(\d+)\]|\((\d+)\)|\^(\d+)/g, (m,a,b,c)=>{
                              const k=a||b||c;
                              const gn=preview.fnMap?.[k]||k;
                              return `<sup style="font-size:0.72em;color:${TH.p};font-weight:700;line-height:0">${gn}</sup>`;
                            });
                            return t;
                          })()
                        }}/>}
                      {pp.type==="q"&&<div style={{fontFamily:getCSS(headFont),fontSize:10,color:TH.p,fontStyle:"italic",margin:"6px 0",
                        ...(theme==="islami"?{textAlign:"center",borderLeft:`3px solid ${TH.a}`,paddingLeft:7}:{}),
                        ...(theme==="anak"?{textAlign:"center",background:TH.bg,padding:"4px",border:`1px solid ${TH.a}`}:{}),
                        ...(theme==="akademik"?{paddingLeft:18,borderLeft:`2px solid ${TH.a}`}:{}),
                        ...(theme==="bisnis"?{background:"#F5F5F5",padding:"4px 8px",borderLeft:`4px solid ${TH.p}`}:{}),
                      }}>{`"${pp.text}"`}</div>}
                      {pp.type==="a"&&<div style={{textAlign:"right",fontSize:13,fontFamily:"Amiri,serif",direction:"rtl",margin:"6px 0",color:TH.p}}>{pp.text}</div>}
                      {pp.type==="f"&&<div style={{fontSize:8,color:"#777",borderTop:`0.5px solid ${TH.a}44`,marginTop:8,paddingTop:3,paddingLeft:12,fontFamily:getCSS(bodyFont)}}>† {pp.text}</div>}
                    </div>
                  ))}
                </div>
              )):<div style={{textAlign:"center",padding:"36px 0",color:"#ccc",fontSize:12}}>Preview konten akan tampil di sini</div>}

              {/* Footnote section in preview */}
              {preview&&preview.fnDefs&&Object.keys(preview.fnDefs).length>0&&(
                <div style={{marginTop:14,paddingTop:10}}>
                  <div style={{width:"36%",height:0.5,background:"#999",marginBottom:7}}/>
                  {Object.entries(preview.fnDefs).sort((a,b)=>Number(a[0])-Number(b[0])).map(([k,txt])=>(
                    <div key={k} style={{display:"flex",gap:5,marginBottom:4,fontFamily:getCSS(bodyFont),fontSize:9,color:"#555",lineHeight:1.6}}>
                      <sup style={{color:TH.p,fontWeight:700,flexShrink:0,lineHeight:1.4}}>{preview.fnMap?.[k]||k}</sup>
                      <span>{txt}</span>
                    </div>
                  ))}
                  <div style={{marginTop:6,fontSize:8,color:"#bbb",fontStyle:"italic"}}>
                    ↑ Footnote di atas akan muncul di bagian bawah halaman masing-masing di Word
                  </div>
                </div>
              )}

              {/* Footer mock */}
              {!isEbook&&preview&&(
                <div style={{borderTop:`1.5px solid ${TH.a}`,marginTop:12,paddingTop:5,fontSize:8,color:TH.p,textAlign:"center"}}>
                  {TH.fSt==="ornamen"&&`${TH.orn} 1 ${TH.orn}`}
                  {TH.fSt==="warna"&&<span style={{fontWeight:700}}>1</span>}
                  {TH.fSt==="angka"&&"1"}
                  {TH.fSt==="titik"&&"— 1 —"}
                  {TH.fSt==="kanan"&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#aaa"}}>{meta.penulis||""}</span><span>1</span></div>}
                </div>
              )}
            </div>

            {/* Footnote info badge */}
            {preview&&preview.fnDefs&&Object.keys(preview.fnDefs).length>0&&(
              <div style={{marginTop:8,padding:"7px 12px",background:`${TH.p}0d`,borderRadius:8,fontSize:10,color:TH.p,border:`1px solid ${TH.p}22`}}>
                📌 Ditemukan <strong>{Object.keys(preview.fnDefs).length} footnote</strong> — akan ditempatkan proper di bagian bawah halaman masing-masing dalam file Word.
              </div>
            )}

            {status&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,fontSize:11,textAlign:"center",background:status.includes("✅")?"#f0fdf4":status.includes("❌")?"#fef2f2":"#fffbeb",color:status.includes("✅")?"#166534":status.includes("❌")?"#991b1b":"#555"}}>{status}</div>}

            <button onClick={doDownload} disabled={generating} style={{marginTop:10,width:"100%",padding:13,borderRadius:10,background:generating?"#ccc":`linear-gradient(135deg,${TH.p},${TH.a})`,color:"#fff",fontWeight:700,fontSize:13,border:"none",cursor:generating?"not-allowed":"pointer",boxShadow:generating?"none":`0 4px 16px ${TH.p}44`}}>
              {generating?(status||"Memproses..."):`⬇️ Unduh .docx — ${TH.label} · ${isEbook?"Ebook":"Cetak"}`}
            </button>
            <div style={{fontSize:9,color:"#bbb",textAlign:"center",marginTop:5}}>Microsoft Word · LibreOffice · Google Docs</div>
          </div>
        )}

        {/* NAV */}
        <div style={{display:"flex",gap:10,marginTop:14}}>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:9,borderRadius:9,background:"#fff",border:"1.5px solid #e0e0e0",cursor:"pointer",fontSize:12,fontWeight:600,color:"#555"}}>← Kembali</button>}
          {step<2&&<button onClick={()=>setStep(s=>s+1)} style={{flex:2,padding:9,borderRadius:9,background:`linear-gradient(135deg,${TH.p},${TH.a})`,color:"#fff",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,boxShadow:`0 3px 12px ${TH.p}40`}}>Lanjut →</button>}
          {step===2&&<button onClick={doPreview} disabled={!meta.judul||!meta.penulis||!content.trim()||generating} style={{flex:2,padding:9,borderRadius:9,background:meta.judul&&meta.penulis&&content.trim()?`linear-gradient(135deg,${TH.p},${TH.a})`:"#ccc",color:"#fff",border:"none",cursor:meta.judul&&meta.penulis&&content.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:700}}>{generating?"Memproses...":"Generate Preview →"}</button>}
        </div>
      </div>
    </div>
  );
}
