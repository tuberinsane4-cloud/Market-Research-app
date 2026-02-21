import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

const COLORS = ["#8545D3","#815CDE","#7C73E9","#778AF4","#72A1FF","#50DC8C","#FF6B8A","#FFB347"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --p1:#8545D3;--p2:#815CDE;--p3:#7C73E9;--p4:#778AF4;--p5:#72A1FF;
  --bg:#06030F;--surface:#0E0A1E;--card:#140F28;
  --border:rgba(120,90,244,.18);--border2:rgba(120,90,244,.35);
  --text:#F0ECFF;--muted:#8B80B0;
  --grad:linear-gradient(135deg,var(--p1),var(--p5));
  --fh:'Syne',sans-serif;--fb:'DM Sans',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--fb)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--surface)}::-webkit-scrollbar-thumb{background:var(--p2);border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(133,69,211,.3)}50%{box-shadow:0 0 40px rgba(114,161,255,.6)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
.fu{animation:fadeUp .45s ease both}
.btn{font-family:var(--fh);font-weight:700;font-size:13px;padding:10px 20px;border-radius:10px;border:none;cursor:pointer;transition:transform .15s,opacity .2s;letter-spacing:.03em;text-transform:uppercase;line-height:1.2}
.btn:hover:not(:disabled){transform:translateY(-1px);opacity:.9}.btn:active:not(:disabled){transform:none}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-primary{background:var(--grad);color:#fff;animation:glow 3s ease-in-out infinite}
.btn-ghost{background:rgba(120,90,244,.12);color:var(--p4);border:1px solid var(--border)}
.btn-ghost:hover:not(:disabled){background:rgba(120,90,244,.22)}
.btn-danger{background:rgba(220,50,80,.15);color:#ff6b8a;border:1px solid rgba(220,50,80,.25)}
.card{background:var(--card);border:1px solid var(--border);border-radius:24px;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 100% 0%,rgba(133,69,211,.07),transparent 60%)}
.inp{background:rgba(20,15,40,.8);border:1px solid var(--border);color:var(--text);font-family:var(--fb);font-size:14px;padding:10px 14px;border-radius:12px;outline:none;width:100%;transition:border-color .2s}
.inp:focus{border-color:var(--p3);box-shadow:0 0 0 3px rgba(124,115,233,.12)}
.inp::placeholder{color:var(--muted)}
select.inp option{background:#1a1030}
.lbl{font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.tpu{background:rgba(133,69,211,.2);color:var(--p4);border:1px solid rgba(133,69,211,.3)}
.tbl{background:rgba(114,161,255,.15);color:#72A1FF;border:1px solid rgba(114,161,255,.25)}
.tgn{background:rgba(80,220,140,.15);color:#50DC8C;border:1px solid rgba(80,220,140,.25)}
.trd{background:rgba(255,80,100,.15);color:#FF6B8A;border:1px solid rgba(255,80,100,.25)}
.sidebar{width:240px;min-height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100}
.main{margin-left:240px;min-height:100vh;padding:32px}
.scard{padding:24px;transition:transform .2s,border-color .2s}
.scard:hover{transform:translateY(-3px);border-color:var(--border2)}
.twrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14px}
th{font-family:var(--fh);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:12px 16px;text-align:left;border-bottom:1px solid var(--border)}
td{padding:13px 16px;border-bottom:1px solid rgba(120,90,244,.07);color:var(--text)}
tr:hover td{background:rgba(120,90,244,.04)}
tr:last-child td{border-bottom:none}
.sk{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px}
.toast{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.ti{padding:12px 18px;border-radius:12px;font-size:13px;font-weight:500;animation:toastIn .3s ease;border:1px solid}
.ts{background:rgba(80,220,140,.15);border-color:rgba(80,220,140,.3);color:#50DC8C}
.te{background:rgba(255,80,100,.15);border-color:rgba(255,80,100,.3);color:#FF6B8A}
.tn{background:rgba(114,161,255,.15);border-color:rgba(114,161,255,.3);color:#72A1FF}
.overlay{position:fixed;inset:0;background:rgba(6,3,15,.88);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
.modal{width:min(860px,100%);max-height:90vh;overflow-y:auto;animation:fadeUp .3s ease}
.pb{height:6px;border-radius:99px;background:rgba(120,90,244,.15);overflow:hidden}
.pf{height:100%;border-radius:99px;background:var(--grad);transition:width .6s ease}
`;


const COL_META = [
  {key:"name",    req:true, type:"text",  color:"#778AF4",ex:"Rahul Gupta",        bad:"123 / empty",         rule:"Full customer name"},
  {key:"age",     req:true, type:"number",color:"#72A1FF",ex:"25",                 bad:"twenty / 0 / 150",    rule:"Whole number 1–120"},
  {key:"gender",  req:true, type:"enum",  color:"#815CDE",ex:"Male",               bad:"M / F / man",         rule:"Male, Female, or Other"},
  {key:"product", req:true, type:"text",  color:"#8545D3",ex:"Laptop Pro X1",      bad:"empty",               rule:"Product or service name"},
  {key:"price",   req:true, type:"number",color:"#7C73E9",ex:"85000",              bad:"₹85,000 / 'eighty'",  rule:"Plain number — no ₹, commas"},
  {key:"qty",     req:false,type:"number",color:"#50DC8C",ex:"1",                  bad:"one / -1",            rule:"Whole number; defaults to 1"},
  {key:"wants",   req:false,type:"text",  color:"#50DC8C",ex:"Fast performance",   bad:"—",                   rule:"What the customer desires"},
  {key:"buys",    req:false,type:"text",  color:"#50DC8C",ex:"Premium electronics",bad:"—",                   rule:"Purchase category / behavior"},
  {key:"problems",req:false,type:"text",  color:"#50DC8C",ex:"Battery life, weight",bad:"—",                  rule:"Issues; separate with commas"},
  {key:"notes",   req:false,type:"text",  color:"#50DC8C",ex:"High value client",  bad:"—",                   rule:"Extra observations"},
  {key:"date",    req:false,type:"date",  color:"#50DC8C",ex:"2025-02-10",         bad:"10/02/2025",          rule:"YYYY-MM-DD; defaults to today"},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid  = () => Math.random().toString(36).slice(2,9);
const fmt  = n => n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;
const TT   = {contentStyle:{background:"#140F28",border:"1px solid rgba(120,90,244,.3)",borderRadius:10,fontSize:12}};

// ─── Storage helpers (window.storage — persists across refreshes) ────────────
const SK_CUSTOMERS = "mp_cust_v10";
const SK_SESSION   = "mp_sess_v10";

async function storageSave(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch(_) {}
}
async function storageLoad(key) {
  try { const r = await window.storage.get(key); if(r && r.value != null) return JSON.parse(r.value); } catch(_) {}
  return null;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [list,setList] = useState([]);
  const push = (msg,type="info") => {
    const id=uid();
    setList(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setList(p=>p.filter(t=>t.id!==id)),3200);
  };
  return {list,push};
}

// ─── CSV parser ───────────────────────────────────────────────────────────────
function parseCsv(raw) {
  const results=[],errors=[];
  const lines=raw.trim().split(/\r?\n/).filter(l=>l.trim());
  if(!lines.length) return {results,errors:["No data found"]};
  const start=lines[0].toLowerCase().includes("name")&&lines[0].toLowerCase().includes("age")?1:0;
  lines.slice(start).forEach((line,idx)=>{
    const ln=idx+start+1;
    const cols=[]; let cur="",inQ=false;
    for(let ch of line){if(ch==='"'){inQ=!inQ;}else if(ch===','&&!inQ){cols.push(cur.trim());cur="";}else cur+=ch;}
    cols.push(cur.trim());
    if(cols.length<5){errors.push(`Line ${ln}: only ${cols.length} column(s) — need at least 5`);return;}
    const [name,age,gender,product,price,qty,wants,buys,problems,notes,date]=cols;
    const ageN=parseInt(age),priceN=parseFloat((price||"").replace(/[,\s₹$]/g,"")),qtyN=parseInt(qty)||1;
    if(!name?.trim()){errors.push(`Line ${ln}: "name" is empty`);return;}
    if(isNaN(ageN)||ageN<1||ageN>120){errors.push(`Line ${ln}: "age" "${age}" must be 1–120`);return;}
    if(!["male","female","other"].includes((gender||"").toLowerCase())){errors.push(`Line ${ln}: "gender" "${gender}" — use Male/Female/Other`);return;}
    if(!product?.trim()){errors.push(`Line ${ln}: "product" is empty`);return;}
    if(isNaN(priceN)||priceN<0){errors.push(`Line ${ln}: "price" "${price}" must be a plain number`);return;}
    const g=gender.charAt(0).toUpperCase()+gender.slice(1).toLowerCase();
    const d=date&&/^\d{4}-\d{2}-\d{2}$/.test(date.trim())?date.trim():new Date().toISOString().slice(0,10);
    results.push({id:uid(),name:name.trim(),age:ageN,gender:g,product:product.trim(),price:priceN,qty:qtyN,wants:(wants||"").trim(),buys:(buys||"").trim(),problems:(problems||"").trim(),notes:(notes||"").trim(),date:d});
  });
  return {results,errors};
}



// ─── Login ────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [u,setU]=useState(""), [p,setP]=useState(""), [err,setErr]=useState(""), [loading,setLoading]=useState(false);
  const submit = async () => {
    if(!u.trim()||!p.trim()){setErr("Please enter username and password.");return;}
    if(u.trim()!=="ADMIN"||p!=="ADMIN"){setErr("Invalid credentials. Please try again.");return;}
    setErr("");setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setLoading(false);
    onLogin({username:"ADMIN",role:"admin"});
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"#8545D3",filter:"blur(100px)",opacity:.13,top:"-10%",left:"5%"}}/>
      <div style={{position:"absolute",width:350,height:350,borderRadius:"50%",background:"#72A1FF",filter:"blur(90px)",opacity:.13,top:"30%",left:"62%"}}/>
      <div className="card fu" style={{width:"min(420px,94vw)",padding:"40px 36px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:54,height:54,borderRadius:15,background:"var(--grad)",fontSize:24,marginBottom:16,boxShadow:"0 8px 28px rgba(133,69,211,.45)"}}>◈</div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:28,background:"var(--grad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MarketPulse</h1>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:5}}>Customer Research & Analytics</p>
        </div>
        <div style={{marginBottom:16}}><span className="lbl">Username</span><input className="inp" value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter username" autoFocus/></div>
        <div style={{marginBottom:20}}><span className="lbl">Password</span><input className="inp" type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter password"/></div>
        {err&&<div style={{fontSize:12,marginBottom:14,padding:"9px 12px",background:"rgba(255,80,100,.09)",borderRadius:8,border:"1px solid rgba(255,80,100,.22)",color:"#FF6B8A"}}>{err}</div>}
        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{width:"100%",padding:"13px",fontSize:14}}>
          {loading?<span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite"}}/>:"Sign In →"}
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",icon:"⬡",label:"Dashboard"},{id:"customers",icon:"◈",label:"Customers"},{id:"analytics",icon:"◉",label:"Analytics"},{id:"export",icon:"⊡",label:"Export"}];

function Sidebar({active,setActive,user,onLogout}) {
  return (
    <nav className="sidebar">
      <div style={{padding:"24px 20px",flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
          <div style={{width:36,height:36,borderRadius:10,background:"var(--grad)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>◈</div>
          <div>
            <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,background:"var(--grad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MarketPulse</div>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase"}}>Analytics Platform</div>
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10,paddingLeft:4}}>Navigation</div>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setActive(item.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"var(--fh)",fontWeight:600,fontSize:13,marginBottom:2,transition:"all .15s",background:active===item.id?"rgba(120,90,244,.18)":"transparent",color:active===item.id?"var(--p4)":"var(--muted)",borderLeft:active===item.id?"2px solid var(--p3)":"2px solid transparent"}}>
            <span style={{fontSize:15}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{padding:"20px",borderTop:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:32,height:32,borderRadius:8,background:"var(--grad)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontFamily:"var(--fh)",fontWeight:800,color:"#fff",flexShrink:0}}>A</div>
          <div><div style={{fontSize:13,fontWeight:600}}>{user?.username}</div><span className="badge tpu" style={{fontSize:10}}>{user?.role}</span></div>
        </div>
        <button className="btn btn-ghost" onClick={onLogout} style={{width:"100%",fontSize:12}}>← Logout</button>
      </div>
    </nav>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPage({customers}) {
  const rev=customers.reduce((s,c)=>s+c.price*c.qty,0);
  const avg=customers.length?Math.round(rev/customers.length):0;
  const pm={};customers.forEach(c=>{pm[c.product]=(pm[c.product]||0)+c.price*c.qty;});
  const pd=Object.entries(pm).map(([name,revenue])=>({name:name.length>13?name.slice(0,13)+"…":name,revenue})).sort((a,b)=>b.revenue-a.revenue);
  const best=pd[0]?.name||"—";
  const am={"18-25":0,"26-35":0,"36-45":0,"45+":0};
  customers.forEach(c=>{if(c.age<=25)am["18-25"]+=c.price*c.qty;else if(c.age<=35)am["26-35"]+=c.price*c.qty;else if(c.age<=45)am["36-45"]+=c.price*c.qty;else am["45+"]+=c.price*c.qty;});
  const ad=Object.entries(am).map(([name,value])=>({name,value}));
  const gd=["Male","Female","Other"].map(g=>({name:g,value:customers.filter(c=>c.gender===g).length})).filter(d=>d.value>0);
  const mm={};customers.forEach(c=>{const m=c.date.slice(0,7);mm[m]=(mm[m]||0)+c.price*c.qty;});
  const td=Object.entries(mm).sort().map(([m,revenue])=>({month:m.slice(5)+"/"+m.slice(2,4),revenue}));
  const pbm={};customers.forEach(c=>{if(c.problems)c.problems.split(",").forEach(p=>{const k=p.trim();pbm[k]=(pbm[k]||0)+1;});});
  const tp=Object.entries(pbm).sort((a,b)=>b[1]-a[1]).slice(0,4);
  return (
    <div>
      <div style={{marginBottom:28}}><h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22,marginBottom:4}}>Dashboard</h2><p style={{color:"var(--muted)",fontSize:13}}>Real-time market intelligence</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16,marginBottom:28}}>
        {[{l:"Total Revenue",v:fmt(rev),s:`${customers.length} customers`,c:"var(--p5)",i:"◎",d:0},{l:"Avg Order",v:fmt(avg),s:"Per transaction",c:"#50DC8C",i:"⟐",d:.05},{l:"Best Seller",v:best,s:"Top product",c:"var(--p3)",i:"★",d:.1},{l:"Customers",v:customers.length,s:"Total records",c:"#FFB347",i:"◈",d:.15}].map(s=>(
          <div key={s.l} className="card scard" style={{animation:`fadeUp .5s ${s.d}s ease both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><span className="lbl">{s.l}</span><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:6}}>{s.s}</div></div>
              <span style={{fontSize:22,opacity:.7}}>{s.i}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Revenue Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={td}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C73E9" stopOpacity={.3}/><stop offset="95%" stopColor="#7C73E9" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,244,.1)"/>
              <XAxis dataKey="month" tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip {...TT} formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]}/>
              <Area type="monotone" dataKey="revenue" stroke="#7C73E9" strokeWidth={2} fill="url(#rg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Product Revenue</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pd} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,244,.1)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#8B80B0",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip {...TT} formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]}/>
              <Bar dataKey="revenue" radius={[6,6,0,0]}>{pd.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Age Group Revenue</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ad} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,244,.1)" horizontal={false}/>
              <XAxis type="number" tick={{fill:"#8B80B0",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <YAxis type="category" dataKey="name" tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false} width={40}/>
              <Tooltip {...TT} formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]}/>
              <Bar dataKey="value" radius={[0,6,6,0]}>{ad.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Gender Split</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={gd} cx="50%" cy="50%" outerRadius={65} innerRadius={35} dataKey="value" paddingAngle={4}>{gd.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie>
              <Tooltip {...TT}/><Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:"var(--muted)",fontSize:11}}>{v}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Top Problems</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {tp.map(([prob,count],i)=>(
              <div key={i}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--muted)"}}>{prob}</span><span style={{color:COLORS[i]}}>{count}</span></div>
              <div className="pb"><div className="pf" style={{width:`${(count/tp[0][1])*100}%`,background:COLORS[i]}}/></div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Customer Form Modal ──────────────────────────────────────────────────────
function CustomerModal({customer,onSave,onClose}) {
  const blank={name:"",age:"",gender:"Male",product:"",price:"",qty:1,wants:"",buys:"",problems:"",notes:"",date:new Date().toISOString().slice(0,10)};
  const [f,setF]=useState(customer||blank);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const fields=[{k:"name",l:"Customer Name",t:"text",p:"Full name"},{k:"age",l:"Age",t:"number",p:"Age"},{k:"product",l:"Product",t:"text",p:"Product name"},{k:"price",l:"Price (₹)",t:"number",p:"0"},{k:"qty",l:"Quantity",t:"number",p:"1"},{k:"date",l:"Purchase Date",t:"date",p:""},{k:"wants",l:"Wants",t:"text",p:"Customer desires"},{k:"buys",l:"Buys",t:"text",p:"Purchase behavior"},{k:"problems",l:"Problems",t:"text",p:"Comma-separated"},{k:"notes",l:"Notes",t:"text",p:"Observations"}];
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card modal" style={{padding:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:18}}>{customer?"Edit Customer":"Add Customer"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:22,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {fields.map(fld=>(<div key={fld.k}><span className="lbl">{fld.l}</span><input className="inp" type={fld.t} value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} placeholder={fld.p}/></div>))}
          <div><span className="lbl">Gender</span><select className="inp" value={f.gender} onChange={e=>s("gender",e.target.value)}>{["Male","Female","Other"].map(g=><option key={g}>{g}</option>)}</select></div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:24,justifyContent:"flex-end"}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onSave({...f,age:+f.age,price:+f.price,qty:+f.qty,id:customer?.id||uid()})}>{customer?"Update":"Add Customer"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Import Modal ────────────────────────────────────────────────────────
function BulkModal({onImport,onClose}) {
  const [step,setStep]         = useState("guide");
  const [guideTab,setGuideTab] = useState("csv");
  const [inputTab,setInputTab] = useState("paste");
  const [csvText,setCsvText]   = useState("");
  const [parsed,setParsed]     = useState(null);
  const [activeCol,setActiveCol] = useState(null);

  const TMPL_INLINE="name,age,gender,product,price,qty,wants,buys,problems,notes,date\nRahul Gupta,25,Male,Laptop Pro X1,85000,1,Fast performance,Premium electronics,Battery life,High value client,2025-02-10\nMeera Singh,30,Female,Wireless Earbuds,8500,2,Clear audio,Accessories,Poor mic quality,Repeat buyer,2025-02-11";
  const doDownloadTemplate=()=>{const blob=new Blob([TMPL_INLINE],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="marketpulse_template.csv";a.click();};
  const doParse=()=>{if(!csvText.trim())return;setParsed(parseCsv(csvText));setStep("preview");};
  const doImport=()=>{if(!parsed||!parsed.results.length)return;onImport(parsed.results);onClose();};
  const onFileChange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setCsvText(ev.target.result);r.readAsText(file);};

  const steps=["Format Guide","Input Data","Preview & Import"];
  const stepIdx=step==="guide"?0:step==="input"?1:2;
  const typeColor=t=>t==="number"?"#50DC8C":t==="enum"?"var(--p4)":t==="date"?"#FFB347":"#72A1FF";
  const typeBg=t=>t==="number"?"rgba(80,220,140,.12)":t==="enum"?"rgba(119,138,244,.12)":t==="date"?"rgba(255,183,71,.12)":"rgba(114,161,255,.12)";

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card modal">
        <div style={{padding:"22px 28px 0",borderBottom:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:19}}>Bulk Import Customers</h3><p style={{color:"var(--muted)",fontSize:12,marginTop:2}}>Follow the guide then paste or upload your data</p></div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:22,lineHeight:1,padding:"4px 8px"}}>✕</button>
          </div>
          <div style={{display:"flex",gap:0,marginBottom:"-1px"}}>
            {steps.map((label,i)=>{
              const active=i===stepIdx;
              return (
                <button key={i} onClick={()=>{if(i===0)setStep("guide");else if(i===1&&step==="preview")setStep("input");}}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",border:"none",borderBottom:active?"2.5px solid var(--p3)":"2.5px solid transparent",background:"transparent",cursor:"pointer",fontFamily:"var(--fh)",fontWeight:700,fontSize:11,letterSpacing:".04em",textTransform:"uppercase",color:active?"var(--p4)":i<stepIdx?"var(--muted)":"rgba(139,128,176,.35)",transition:"color .15s"}}>
                  <span style={{width:17,height:17,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,background:active?"var(--grad)":i<stepIdx?"rgba(80,220,140,.25)":"rgba(120,90,244,.12)",color:active?"#fff":i<stepIdx?"#50DC8C":"var(--muted)"}}>{i<stepIdx?"✓":i+1}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{padding:"24px 28px"}}>
          {/* ── GUIDE ── */}
          {step==="guide" && (
            <div>
              <div style={{display:"flex",gap:6,marginBottom:22,padding:"4px",background:"rgba(120,90,244,.08)",borderRadius:12,width:"fit-content"}}>
                {[["csv","CSV / Spreadsheet"],["doc","Plain Text Document"],["rules","Column Rules"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setGuideTab(v)} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"var(--fh)",fontWeight:700,fontSize:11,letterSpacing:".04em",textTransform:"uppercase",background:guideTab===v?"var(--grad)":"transparent",color:guideTab===v?"#fff":"var(--muted)",transition:"all .15s"}}>{l}</button>
                ))}
              </div>

              {guideTab==="csv" && (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                    {[{i:"①",c:"#72A1FF",t:"One row = one customer",b:"Each line is a single customer."},{i:"②",c:"#7C73E9",t:"Comma-separated",b:"Separate values with commas."},{i:"③",c:"#8545D3",t:"Header optional",b:"Header row is auto-detected & skipped."}].map((tip,i)=>(
                      <div key={i} style={{padding:"13px 15px",background:"rgba(120,90,244,.07)",borderRadius:12,border:"1px solid var(--border)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:15,color:tip.c}}>{tip.i}</span><span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:tip.c}}>{tip.t}</span></div>
                        <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{tip.b}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--muted)",letterSpacing:".07em",textTransform:"uppercase"}}>◈ Your CSV must look like this</span>
                      <button className="btn btn-ghost" onClick={doDownloadTemplate} style={{padding:"6px 13px",fontSize:11}}>⬇ Download Template</button>
                    </div>
                    <div style={{background:"#08051A",border:"1px solid rgba(120,90,244,.28)",borderRadius:14,overflow:"hidden",fontFamily:"monospace",fontSize:12}}>
                      <div style={{background:"rgba(120,90,244,.1)",borderBottom:"1px solid rgba(120,90,244,.2)",padding:"7px 14px",display:"flex",alignItems:"center",gap:7}}>
                        {["rgba(255,80,100,.5)","rgba(255,183,71,.5)","rgba(80,220,140,.5)"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
                        <span style={{marginLeft:7,fontSize:11,color:"var(--muted)",fontFamily:"var(--fb)"}}>customers.csv</span>
                      </div>
                      <div style={{display:"flex"}}>
                        <div style={{background:"rgba(255,255,255,.02)",borderRight:"1px solid rgba(120,90,244,.08)",padding:"12px 0",minWidth:32,textAlign:"center",userSelect:"none"}}>
                          {[...Array(6)].map((_,n)=><div key={n} style={{fontSize:10,color:"rgba(139,128,176,.3)",lineHeight:"24px",padding:"0 8px"}}>{n+1}</div>)}
                        </div>
                        <div style={{padding:"12px 16px",overflowX:"auto",flex:1}}>
                          <div style={{lineHeight:"24px",marginBottom:4,whiteSpace:"nowrap"}}>
                            {"name,age,gender,product,price,qty,wants,buys,problems,notes,date".split(",").map((h,i)=>(
                              <span key={i}>{i>0&&<span style={{color:"rgba(255,255,255,.18)"}}>,</span>}
                                <span onMouseEnter={()=>setActiveCol(i)} onMouseLeave={()=>setActiveCol(null)} style={{color:activeCol===i?COL_META[i]?.color||"#fff":"#778AF4",background:activeCol===i?"rgba(119,138,244,.15)":"transparent",padding:"1px 3px",borderRadius:4,cursor:"default",transition:"all .12s",textDecoration:COL_META[i]?.req?"underline":"none",textDecorationColor:"rgba(255,107,138,.5)",textDecorationStyle:"dotted"}} title={COL_META[i]?.rule}>{h}</span>
                              </span>
                            ))}
                            <span style={{marginLeft:10,fontSize:10,color:"rgba(139,128,176,.45)",fontFamily:"var(--fb)"}}>← header (underline = required)</span>
                          </div>
                          {"Rahul Gupta,25,Male,Laptop Pro X1,85000,1,Fast performance,Premium electronics,Battery life,High value client,2025-02-10\nMeera Singh,30,Female,Wireless Earbuds,8500,2,Clear audio,Accessories,Poor mic quality,Repeat buyer,2025-02-11".split("\n").map((row,ri)=>(
                            <div key={ri} style={{lineHeight:"24px",whiteSpace:"nowrap"}}>
                              {row.split(",").map((cell,ci)=>(
                                <span key={ci}>{ci>0&&<span style={{color:"rgba(255,255,255,.18)"}}>,</span>}
                                  <span onMouseEnter={()=>setActiveCol(ci)} onMouseLeave={()=>setActiveCol(null)} style={{color:activeCol===ci?"#fff":ci<5?"#a0c4ff":"#8B80B0",background:activeCol===ci?`${COL_META[ci]?.color||"#778AF4"}22`:"transparent",padding:"1px 3px",borderRadius:4,cursor:"default",transition:"all .12s"}}>{cell}</span>
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid rgba(120,90,244,.12)",padding:"6px 14px",fontSize:11,color:"rgba(139,128,176,.45)",fontFamily:"var(--fb)"}}>Hover column names or values to highlight them</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn btn-primary" onClick={()=>setStep("input")}>Start Import →</button>
                    <button className="btn btn-ghost"   onClick={doDownloadTemplate}>⬇ Template</button>
                  </div>
                </div>
              )}

              {guideTab==="doc" && (
                <div>
                  <div style={{padding:"12px 16px",background:"rgba(114,161,255,.07)",border:"1px solid rgba(114,161,255,.2)",borderRadius:12,marginBottom:20,fontSize:13}}>
                    <strong style={{color:"var(--p5)"}}>Writing in Notepad, Word, or Google Docs?</strong>
                    <span style={{color:"var(--muted)",marginLeft:6}}>Use Pattern B below — it pastes directly into the importer.</span>
                  </div>
                  <div style={{marginBottom:22}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{padding:"3px 10px",borderRadius:6,background:"rgba(133,69,211,.2)",color:"var(--p4)",fontFamily:"var(--fh)",fontWeight:800,fontSize:11,textTransform:"uppercase",letterSpacing:".05em"}}>Pattern A</span>
                      <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14}}>Labelled Block — easiest to write by hand</span>
                    </div>
                    <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6}}>One field per line as <code style={{background:"rgba(120,90,244,.15)",padding:"1px 5px",borderRadius:4,color:"var(--p4)"}}>FieldName: Value</code>. Blank line between customers.</p>
                    <div style={{background:"#08051A",border:"1px solid rgba(120,90,244,.25)",borderRadius:14,overflow:"hidden"}}>
                      <div style={{background:"rgba(120,90,244,.08)",borderBottom:"1px solid rgba(120,90,244,.15)",padding:"7px 14px",display:"flex",alignItems:"center",gap:7}}>
                        {["rgba(255,80,100,.45)","rgba(255,183,71,.45)","rgba(80,220,140,.45)"].map((c,i)=><span key={i} style={{width:9,height:9,borderRadius:"50%",background:c,display:"inline-block"}}/>)}
                        <span style={{marginLeft:7,fontSize:11,color:"var(--muted)",fontFamily:"var(--fb)"}}>customers_labelled.txt — write this in any text editor</span>
                      </div>
                      <div style={{padding:"16px 20px",fontFamily:"monospace",fontSize:12,lineHeight:2}}>
                        {[
                          ["CUSTOMER 1","head"],["Name: Rahul Gupta","name"],["Age: 25","age"],["Gender: Male","gender"],["Product: Laptop Pro X1","product"],["Price: 85000","price"],["Quantity: 1","qty"],["Wants: Fast performance","wants"],["Problems: Battery life, too heavy","problems"],["Date: 2025-02-10","date"],
                          ["","blank"],
                          ["CUSTOMER 2","head"],["Name: Meera Singh","name"],["Age: 30","age"],["Gender: Female","gender"],["Product: Wireless Earbuds","product"],["Price: 8500","price"],["Quantity: 2","qty"],["Wants: Clear audio","wants"],["Problems: Poor mic quality","problems"],["Date: 2025-02-11","date"],
                        ].map(([t,k],i)=>{
                          if(k==="blank") return <div key={i} style={{height:10}}/>;
                          if(k==="head") return <div key={i} style={{color:"#FFB347",fontFamily:"var(--fh)",fontWeight:800,fontSize:11,letterSpacing:".1em",marginBottom:2}}>{t}</div>;
                          const isReq=["name","age","gender","product","price"].includes(k);
                          const [label,...rest]=t.split(": ");
                          return <div key={i}><span style={{color:isReq?"#ff9ab0":"#8B80B0",minWidth:90,display:"inline-block"}}>{label}:</span><span style={{color:"#fff",marginLeft:4}}>{rest.join(": ")}</span>{isReq&&<span style={{marginLeft:10,fontSize:10,color:"rgba(255,107,138,.55)",fontStyle:"italic"}}>required</span>}</div>;
                        })}
                      </div>
                      <div style={{borderTop:"1px solid rgba(120,90,244,.12)",padding:"7px 14px",fontSize:11,color:"rgba(139,128,176,.45)",fontFamily:"var(--fb)"}}><span style={{color:"#ff9ab0"}}>Pink</span> = required · <span style={{color:"#8B80B0"}}>Grey</span> = optional · Note: convert to CSV before importing</div>
                    </div>
                  </div>
                  <div style={{marginBottom:22}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{padding:"3px 10px",borderRadius:6,background:"rgba(80,220,140,.15)",color:"#50DC8C",fontFamily:"var(--fh)",fontWeight:800,fontSize:11,textTransform:"uppercase",letterSpacing:".05em"}}>Pattern B</span>
                      <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14}}>One line per customer — paste directly</span>
                      <span className="badge tbl" style={{marginLeft:"auto",fontSize:10}}>Recommended</span>
                    </div>
                    <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6}}>All fields on one line, comma-separated. <strong style={{color:"var(--text)"}}>Paste directly into Step 2.</strong></p>
                    <div style={{background:"#08051A",border:"1px solid rgba(80,220,140,.2)",borderRadius:14,overflow:"hidden",fontFamily:"monospace",fontSize:12}}>
                      <div style={{background:"rgba(80,220,140,.05)",borderBottom:"1px solid rgba(80,220,140,.12)",padding:"7px 14px",display:"flex",alignItems:"center",gap:7}}>
                        {["rgba(255,80,100,.45)","rgba(255,183,71,.45)","rgba(80,220,140,.45)"].map((c,i)=><span key={i} style={{width:9,height:9,borderRadius:"50%",background:c,display:"inline-block"}}/>)}
                        <span style={{marginLeft:7,fontSize:11,color:"var(--muted)",fontFamily:"var(--fb)"}}>customers.csv — type this in Notepad or any text editor</span>
                      </div>
                      <div style={{display:"flex"}}>
                        <div style={{background:"rgba(255,255,255,.02)",borderRight:"1px solid rgba(80,220,140,.08)",padding:"12px 0",minWidth:32,textAlign:"center",userSelect:"none"}}>
                          {[...Array(6)].map((_,n)=><div key={n} style={{fontSize:10,color:"rgba(139,128,176,.3)",lineHeight:"24px",padding:"0 8px"}}>{n+1}</div>)}
                        </div>
                        <div style={{padding:"12px 16px",overflowX:"auto",flex:1}}>
                          <div style={{lineHeight:"24px",marginBottom:4,whiteSpace:"nowrap"}}>
                            {COL_META.map((c,i)=><span key={i}>{i>0&&<span style={{color:"rgba(255,255,255,.18)"}}>,</span>}<span style={{color:c.req?"#ff9ab0":"#50DC8C",fontWeight:700}}>{c.key}</span></span>)}
                            <span style={{marginLeft:10,fontSize:10,color:"rgba(139,128,176,.45)",fontFamily:"var(--fb)"}}>← pink=required, green=optional</span>
                          </div>
                          {"Rahul Gupta,25,Male,Laptop Pro X1,85000,1,Fast performance,Premium electronics,Battery life,High value client,2025-02-10\nMeera Singh,30,Female,Wireless Earbuds,8500,2,Clear audio,Accessories,Poor mic quality,Repeat buyer,2025-02-11".split("\n").map((row,ri)=><div key={ri} style={{lineHeight:"24px",whiteSpace:"nowrap",color:"#a0c4ff"}}>{row}</div>)}
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid rgba(80,220,140,.1)",padding:"7px 14px",fontSize:11,color:"rgba(139,128,176,.45)",fontFamily:"var(--fb)"}}>Copy any rows above and paste straight into Step 2</div>
                    </div>
                  </div>
                  <div style={{marginBottom:20}}>
                    <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--muted)",letterSpacing:".07em",textTransform:"uppercase",marginBottom:10}}>✗ Common writing mistakes</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[{bad:"Price: ₹85,000",good:"Price: 85000",l:"No ₹ or commas in price"},{bad:"Age: twenty five",good:"Age: 25",l:"Age must be a number"},{bad:"Gender: M",good:"Gender: Male",l:"Use full word only"},{bad:"Date: 10/02/2025",good:"Date: 2025-02-10",l:"Date: YYYY-MM-DD only"}].map((m,i)=>(
                        <div key={i} style={{padding:"12px 14px",background:"rgba(20,12,36,.8)",border:"1px solid rgba(120,90,244,.15)",borderRadius:12}}>
                          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8,fontFamily:"var(--fh)",fontWeight:700}}>{m.l}</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                            <div style={{background:"rgba(255,80,100,.07)",border:"1px solid rgba(255,80,100,.18)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#ff9ab0",marginBottom:4,fontFamily:"var(--fh)",fontWeight:700,letterSpacing:".06em"}}>✗ WRONG</div><pre style={{fontSize:11,color:"#ff9ab0",margin:0,fontFamily:"monospace",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.bad}</pre></div>
                            <span style={{fontSize:16,color:"var(--muted)",textAlign:"center"}}>→</span>
                            <div style={{background:"rgba(80,220,140,.07)",border:"1px solid rgba(80,220,140,.18)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#50DC8C",marginBottom:4,fontFamily:"var(--fh)",fontWeight:700,letterSpacing:".06em"}}>✓ CORRECT</div><pre style={{fontSize:11,color:"#50DC8C",margin:0,fontFamily:"monospace",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.good}</pre></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10}}><button className="btn btn-primary" onClick={()=>setStep("input")}>Start Import →</button><button className="btn btn-ghost" onClick={doDownloadTemplate}>⬇ CSV Template</button></div>
                </div>
              )}

              {guideTab==="rules" && (
                <div>
                  <div style={{borderRadius:14,border:"1px solid var(--border)",overflow:"hidden",marginBottom:20}}>
                    <table style={{fontSize:12}}>
                      <thead><tr style={{background:"rgba(120,90,244,.06)"}}>{["#","Column","Status","Type","✓ Valid","✗ Invalid","Rule"].map(h=><th key={h} style={{padding:"10px 14px",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                      <tbody>{COL_META.map((c,i)=>(
                        <tr key={i} style={{background:activeCol===i?"rgba(120,90,244,.08)":"transparent",transition:"background .15s"}} onMouseEnter={()=>setActiveCol(i)} onMouseLeave={()=>setActiveCol(null)}>
                          <td style={{color:"rgba(139,128,176,.45)",fontWeight:700,textAlign:"center",width:24}}>{i+1}</td>
                          <td style={{fontFamily:"var(--fh)",fontWeight:700,color:c.color,whiteSpace:"nowrap"}}>{c.key}</td>
                          <td><span className={`badge ${c.req?"trd":"tgn"}`} style={{fontSize:10}}>{c.req?"Required":"Optional"}</span></td>
                          <td><span style={{display:"inline-block",padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,fontFamily:"var(--fh)",background:typeBg(c.type),color:typeColor(c.type),textTransform:"uppercase",letterSpacing:".04em"}}>{c.type}</span></td>
                          <td style={{color:"#a0c4ff",fontFamily:"monospace",fontSize:11,whiteSpace:"nowrap"}}>{c.ex}</td>
                          <td style={{color:"#ff9ab0",fontFamily:"monospace",fontSize:11,whiteSpace:"nowrap"}}>{c.bad}</td>
                          <td style={{color:"var(--muted)",maxWidth:180,lineHeight:1.5,fontSize:11}}>{c.rule}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  <div style={{display:"flex",gap:10}}><button className="btn btn-primary" onClick={()=>setStep("input")}>Start Import →</button><button className="btn btn-ghost" onClick={doDownloadTemplate}>⬇ Template</button></div>
                </div>
              )}
            </div>
          )}

          {/* ── INPUT ── */}
          {step==="input" && (
            <div>
              <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
                {[["paste","✎  Paste CSV"],["file","⊡  Upload File"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setInputTab(v)} className="btn" style={{background:inputTab===v?"var(--grad)":"rgba(120,90,244,.1)",color:inputTab===v?"#fff":"var(--muted)",border:inputTab===v?"none":"1px solid var(--border)",padding:"8px 18px"}}>{l}</button>
                ))}
                <button onClick={()=>setStep("guide")} className="btn btn-ghost" style={{marginLeft:"auto",padding:"8px 14px",fontSize:11}}>← Format Guide</button>
              </div>
              {inputTab==="paste" && (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span className="lbl">Paste CSV text below</span>
  
                  </div>
                  <div style={{padding:"8px 12px",background:"rgba(120,90,244,.06)",border:"1px solid var(--border)",borderRadius:10,marginBottom:10,fontFamily:"monospace",fontSize:11,overflowX:"auto",whiteSpace:"nowrap"}}>
                    {COL_META.map((c,i)=><span key={i}>{i>0&&<span style={{color:"rgba(255,255,255,.2)"}}>,</span>}<span style={{color:c.req?"#ff9ab0":"#50DC8C",fontWeight:700}}>{c.key}</span></span>)}
                    <span style={{marginLeft:12,color:"rgba(139,128,176,.4)"}}>← pink=required, green=optional</span>
                  </div>
                  <textarea className="inp" value={csvText} onChange={e=>setCsvText(e.target.value)}
                    placeholder={"Paste CSV here — one customer per line:\n\nRahul Gupta,25,Male,Laptop Pro X1,85000,1,Fast performance,Premium electronics,Battery life,High value,2025-02-10"}
                    style={{minHeight:200,resize:"vertical",fontFamily:"monospace",fontSize:12,lineHeight:1.7,paddingTop:12}}/>
                  {csvText&&<div style={{marginTop:8,fontSize:12,color:"var(--muted)"}}>{csvText.trim().split("\n").filter(l=>l.trim()).length} line(s) detected</div>}
                </div>
              )}
              {inputTab==="file" && (
                <div>
                  <span className="lbl">Upload a CSV file</span>
                  <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:"44px 24px",background:"rgba(120,90,244,.04)",border:"2px dashed rgba(120,90,244,.28)",borderRadius:16,cursor:"pointer",transition:"all .2s",minHeight:180,textAlign:"center"}}
                    onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="var(--p3)";}}
                    onDragLeave={e=>{e.currentTarget.style.borderColor="rgba(120,90,244,.28)";}}
                    onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const r=new FileReader();r.onload=ev=>setCsvText(ev.target.result);r.readAsText(f);}e.currentTarget.style.borderColor="rgba(120,90,244,.28)";}}>
                    <span style={{fontSize:38,opacity:.4}}>⊡</span>
                    <div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:15,color:"var(--p4)"}}>Drop .csv file here</div><div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>or click to browse</div></div>
                    <div style={{fontSize:11,color:"rgba(139,128,176,.5)",padding:"5px 12px",background:"rgba(120,90,244,.08)",borderRadius:8,border:"1px solid var(--border)"}}>Accepts .csv · .txt · UTF-8</div>
                    <input type="file" accept=".csv,.txt" style={{display:"none"}} onChange={onFileChange}/>
                  </label>
                  {csvText&&<div style={{marginTop:14,padding:"11px 14px",background:"rgba(80,220,140,.08)",border:"1px solid rgba(80,220,140,.22)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}><span style={{color:"#50DC8C",fontSize:16}}>✓</span><div><div style={{fontSize:12,color:"#50DC8C",fontWeight:600}}>File loaded</div><div style={{fontSize:11,color:"var(--muted)"}}>{csvText.trim().split("\n").length} lines detected</div></div></div>}
                </div>
              )}
              <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={doParse} disabled={!csvText.trim()}>Parse & Preview →</button>
              </div>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step==="preview" && parsed && (
            <div>
              <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:110,padding:"14px 18px",background:"rgba(80,220,140,.09)",border:"1px solid rgba(80,220,140,.22)",borderRadius:12,textAlign:"center"}}>
                  <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:28,color:"#50DC8C"}}>{parsed.results.length}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2,textTransform:"uppercase",letterSpacing:".05em"}}>Valid Rows</div>
                </div>
                <div style={{flex:1,minWidth:110,padding:"14px 18px",background:parsed.errors.length?"rgba(255,80,100,.09)":"rgba(120,90,244,.07)",border:`1px solid ${parsed.errors.length?"rgba(255,80,100,.25)":"var(--border)"}`,borderRadius:12,textAlign:"center"}}>
                  <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:28,color:parsed.errors.length?"#FF6B8A":"var(--muted)"}}>{parsed.errors.length}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2,textTransform:"uppercase",letterSpacing:".05em"}}>Errors</div>
                </div>
                <div style={{flex:2,minWidth:180,padding:"14px 18px",background:"rgba(120,90,244,.06)",border:"1px solid var(--border)",borderRadius:12,display:"flex",alignItems:"center"}}>
                  <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
                    {parsed.errors.length>0&&<span style={{color:"#FF6B8A"}}>⚠ {parsed.errors.length} row(s) will be skipped. </span>}
                    {parsed.results.length>0?<span style={{color:"var(--text)"}}>{parsed.results.length} customer(s) ready to import.</span>:<span style={{color:"#FF6B8A"}}>No valid rows — go back and fix errors.</span>}
                  </div>
                </div>
              </div>
              {parsed.errors.length>0&&<div style={{marginBottom:20,padding:"14px 16px",background:"rgba(255,80,100,.06)",border:"1px solid rgba(255,80,100,.18)",borderRadius:12}}><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:11,color:"#FF6B8A",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>⚠ Skipped rows</div>{parsed.errors.map((e,i)=><div key={i} style={{fontSize:12,color:"#ff9ab0",marginBottom:4,fontFamily:"monospace"}}>✗ {e}</div>)}</div>}
              {parsed.results.length>0&&(
                <div>
                  <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Preview — first {Math.min(5,parsed.results.length)} of {parsed.results.length} rows</div>
                  <div className="twrap" style={{borderRadius:12,border:"1px solid var(--border)",marginBottom:20}}>
                    <table>
                      <thead><tr>{["Name","Age","Gender","Product","Price","Qty","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                      <tbody>{parsed.results.slice(0,5).map((c,i)=>(
                        <tr key={i}>
                          <td style={{fontWeight:500}}>{c.name}</td><td>{c.age}</td>
                          <td><span className={`badge ${c.gender==="Male"?"tbl":c.gender==="Female"?"tpu":"tgn"}`}>{c.gender}</span></td>
                          <td style={{color:"var(--muted)",fontSize:12}}>{c.product}</td>
                          <td style={{color:"#50DC8C",fontFamily:"var(--fh)",fontWeight:700}}>₹{c.price.toLocaleString()}</td>
                          <td>{c.qty}</td><td style={{color:"var(--muted)",fontSize:12}}>{c.date}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    {parsed.results.length>5&&<div style={{padding:"9px 16px",fontSize:12,color:"var(--muted)",borderTop:"1px solid var(--border)"}}>+ {parsed.results.length-5} more rows will be imported</div>}
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setStep("input")}>← Edit Data</button>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={doImport} disabled={!parsed.results.length}>
                  Import {parsed.results.length} Customer{parsed.results.length!==1?"s":""} ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Customers Page ───────────────────────────────────────────────────────────
function CustomersPage({customers,setCustomers,toast}) {
  const [search,setSearch]     = useState("");
  const [sortKey,setSortKey]   = useState("date");
  const [sortDir,setSortDir]   = useState(-1);
  const [filter,setFilter]     = useState({gender:"All",product:"All"});
  const [page,setPage]         = useState(0);
  const [modal,setModal]       = useState(null);
  const [showBulk,setShowBulk] = useState(false);
  const PER=5;
  const products=["All",...new Set(customers.map(c=>c.product))];
  let data=[...customers];
  if(search) data=data.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.product.toLowerCase().includes(search.toLowerCase()));
  if(filter.gender!=="All") data=data.filter(c=>c.gender===filter.gender);
  if(filter.product!=="All") data=data.filter(c=>c.product===filter.product);
  data.sort((a,b)=>{const va=a[sortKey],vb=b[sortKey];return typeof va==="string"?va.localeCompare(vb)*sortDir:(va-vb)*sortDir;});
  const total=data.length,paged=data.slice(page*PER,(page+1)*PER);
  const sortBy=k=>{if(sortKey===k)setSortDir(d=>-d);else{setSortKey(k);setSortDir(-1);}};
  const handleSave=c=>{if(customers.find(x=>x.id===c.id))setCustomers(p=>p.map(x=>x.id===c.id?c:x));else setCustomers(p=>[c,...p]);toast(modal==="add"?"Customer added!":"Customer updated!","success");setModal(null);};
  const del=id=>{setCustomers(p=>p.filter(c=>c.id!==id));toast("Customer removed","error");};
  const handleBulkImport=rows=>{setCustomers(p=>[...rows,...p]);toast(`${rows.length} customers imported!`,"success");setShowBulk(false);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
        <div><h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22}}>Customers</h2><p style={{color:"var(--muted)",fontSize:13}}>{total} records</p></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-ghost" onClick={()=>setShowBulk(true)}>⊡ Bulk Import</button>
          <button className="btn btn-primary" onClick={()=>setModal("add")}>+ Add Customer</button>
        </div>
      </div>
      <div className="card" style={{padding:20,marginBottom:20}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <input className="inp" style={{flex:2,minWidth:180}} placeholder="Search name or product…" value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}/>
          <select className="inp" style={{flex:1,minWidth:130}} value={filter.gender} onChange={e=>setFilter(p=>({...p,gender:e.target.value}))}>{["All","Male","Female","Other"].map(g=><option key={g}>{g}</option>)}</select>
          <select className="inp" style={{flex:1,minWidth:150}} value={filter.product} onChange={e=>setFilter(p=>({...p,product:e.target.value}))}>{products.map(p=><option key={p}>{p}</option>)}</select>
          <select className="inp" style={{flex:1,minWidth:140}} value={sortKey} onChange={e=>setSortKey(e.target.value)}>{["date","price","age","name"].map(k=><option key={k} value={k}>Sort: {k}</option>)}</select>
        </div>
      </div>
      <div className="card twrap">
        <table>
          <thead><tr>{[["Name","name"],["Age","age"],["Gender",""],["Product","product"],["Revenue","price"],["Date","date"],["",""]].map(([l,k],i)=>(
            <th key={i} onClick={k?()=>sortBy(k):undefined} style={{cursor:k?"pointer":"default"}}>{l}{sortKey===k?(sortDir===-1?" ↓":" ↑"):""}</th>
          ))}</tr></thead>
          <tbody>{paged.map(c=>(
            <tr key={c.id}>
              <td style={{fontWeight:500}}>{c.name}</td><td>{c.age}</td>
              <td><span className={`badge ${c.gender==="Male"?"tbl":c.gender==="Female"?"tpu":"tgn"}`}>{c.gender}</span></td>
              <td style={{color:"var(--muted)",fontSize:13}}>{c.product}</td>
              <td style={{color:"#50DC8C",fontFamily:"var(--fh)",fontWeight:700}}>₹{(c.price*c.qty).toLocaleString()}</td>
              <td style={{color:"var(--muted)",fontSize:12}}>{c.date}</td>
              <td><div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost"  style={{padding:"5px 10px",fontSize:11}} onClick={()=>setModal(c)}>Edit</button>
                <button className="btn btn-danger" style={{padding:"5px 10px",fontSize:11}} onClick={()=>del(c.id)}>Del</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {total===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No customers found</div>}
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--muted)"}}>Showing {Math.min(page*PER+1,total)}–{Math.min((page+1)*PER,total)} of {total}</span>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:11}} disabled={page===0} onClick={()=>setPage(p=>p-1)}>← Prev</button>
            <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:11}} disabled={(page+1)*PER>=total} onClick={()=>setPage(p=>p+1)}>Next →</button>
          </div>
        </div>
      </div>
      {modal&&<CustomerModal customer={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
      {showBulk&&<BulkModal onImport={handleBulkImport} onClose={()=>setShowBulk(false)}/>}
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage({customers}) {
  const [ready,setReady]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setReady(true),700);return()=>clearTimeout(t);},[]);
  const priceR={"<5K":0,"5K-20K":0,"20K-50K":0,"50K+":0};
  customers.forEach(c=>{if(c.price<5000)priceR["<5K"]++;else if(c.price<20000)priceR["5K-20K"]++;else if(c.price<50000)priceR["20K-50K"]++;else priceR["50K+"]++;});
  const priceData=Object.entries(priceR).map(([name,value])=>({name,value}));
  const volMap={};customers.forEach(c=>{volMap[c.product]=(volMap[c.product]||0)+c.qty;});
  const volData=Object.entries(volMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name:name.length>14?name.slice(0,14)+"…":name,value}));
  const mMap={};customers.forEach(c=>{const m=c.date.slice(0,7);mMap[m]=(mMap[m]||0)+c.price*c.qty;});
  const lineData=Object.entries(mMap).sort().map(([m,v])=>({month:m.slice(5)+"/"+m.slice(2,4),revenue:v}));
  const cards=[{icon:"↗",color:"#50DC8C",title:"Revenue Growth",val:"+23%",note:"vs last month"},{icon:"★",color:"var(--p4)",title:"Top Segment",val:"26-35",note:"age group"},{icon:"⊡",color:"#FFB347",title:"Avg Basket",val:fmt(Math.round(customers.reduce((s,c)=>s+c.price*c.qty,0)/Math.max(customers.length,1))),note:"per customer"},{icon:"◎",color:"#FF6B8A",title:"Repeat Rate",val:"62%",note:"purchase overlap"}];
  if(!ready) return <div><div style={{marginBottom:28}}><div className="sk" style={{height:28,width:200,marginBottom:8}}/><div className="sk" style={{height:16,width:280}}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>{[0,1,2,3].map(i=><div key={i} className="card sk" style={{height:100}}/>)}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>{[0,1,2,3].map(i=><div key={i} className="card sk" style={{height:260}}/>)}</div></div>;
  return (
    <div>
      <div style={{marginBottom:28}}><h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22,marginBottom:4}}>Analytics</h2><p style={{color:"var(--muted)",fontSize:13}}>Deep-dive market intelligence</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:24}}>
        {cards.map((c,i)=>(<div key={i} className="card" style={{padding:18,animation:`fadeUp .4s ${i*.07}s ease both`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:18,color:c.color}}>{c.icon}</span><span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--fh)",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>{c.title}</span></div>
          <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:24,color:c.color}}>{c.val}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{c.note}</div>
        </div>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card" style={{padding:24}}><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Revenue Over Time</div>
          <ResponsiveContainer width="100%" height={220}><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,244,.1)"/><XAxis dataKey="month" tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip {...TT} formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]}/><Line type="monotone" dataKey="revenue" stroke="var(--p4)" strokeWidth={2.5} dot={{fill:"var(--p4)",r:4}} activeDot={{r:6,fill:"var(--p5)"}}/></LineChart></ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Price Range Distribution</div>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priceData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={5}>{priceData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip {...TT}/><Legend iconType="circle" iconSize={8} formatter={v=><span style={{color:"var(--muted)",fontSize:11}}>{v}</span>}/></PieChart></ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>Sales Volume by Product</div>
          <ResponsiveContainer width="100%" height={220}><BarChart data={volData} barSize={32}><CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,244,.1)" vertical={false}/><XAxis dataKey="name" tick={{fill:"#8B80B0",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#8B80B0",fontSize:11}} axisLine={false} tickLine={false}/><Tooltip {...TT} formatter={v=>[v,"Units"]}/><Bar dataKey="value" radius={[6,6,0,0]}>{volData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Bar></BarChart></ResponsiveContainer>
        </div>
        <div className="card" style={{padding:24}}><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,marginBottom:16}}>AI Insights</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[{icon:"◈",color:"var(--p4)",title:"Peak Buying Window",body:"Purchases spike mid-month (15–18), suggesting payday influence."},{icon:"↗",color:"#50DC8C",title:"Revenue Opportunity",body:"Laptop segment shows 2× higher AOV. Focus upsell on existing buyers."},{icon:"⚠",color:"#FFB347",title:"Churn Risk",body:"Customers citing 'Battery' & 'Sync issues' are 3× more likely to churn."}].map((item,i)=>(
              <div key={i} style={{padding:"12px 14px",background:"rgba(120,90,244,.06)",borderRadius:12,border:"1px solid var(--border)",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:18,color:item.color,marginTop:1}}>{item.icon}</span>
                <div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,marginBottom:3,color:item.color}}>{item.title}</div><div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{item.body}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export Page ──────────────────────────────────────────────────────────────
function ExportPage({customers,toast}) {
  const [type,setType]=useState("csv");
  const [scope,setScope]=useState("all");
  const [exporting,setExp]=useState(false);
  const doExport=async()=>{
    setExp(true);await new Promise(r=>setTimeout(r,900));
    const data=scope==="all"?customers:customers.slice(0,5);
    if(type==="csv"){const h=["Name","Age","Gender","Product","Price","Qty","Revenue","Date","Wants","Buys","Problems","Notes"];const rows=data.map(c=>[c.name,c.age,c.gender,c.product,c.price,c.qty,c.price*c.qty,c.date,c.wants,c.buys,c.problems,c.notes].map(v=>`"${v||""}"`).join(","));const blob=new Blob([h.join(",")+"\n"+rows.join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="customers.csv";a.click();toast("CSV downloaded!","success");}
    else if(type==="json"){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="customers.json";a.click();toast("JSON downloaded!","success");}
    else toast("PDF export: integrate jsPDF in your full build","info");
    setExp(false);
  };
  return (
    <div>
      <div style={{marginBottom:28}}><h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22,marginBottom:4}}>Export</h2><p style={{color:"var(--muted)",fontSize:13}}>Download your data in multiple formats</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:800}}>
        <div className="card" style={{padding:28}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16,marginBottom:20}}>Configuration</div>
          <div style={{marginBottom:16}}><span className="lbl">Format</span><div style={{display:"flex",gap:10}}>{[["csv","CSV"],["json","JSON"],["pdf","PDF"]].map(([v,l])=><button key={v} onClick={()=>setType(v)} className="btn" style={{background:type===v?"var(--grad)":"rgba(120,90,244,.1)",color:type===v?"#fff":"var(--muted)",border:type===v?"none":"1px solid var(--border)",padding:"8px 16px"}}>{l}</button>)}</div></div>
          <div style={{marginBottom:20}}><span className="lbl">Scope</span><div style={{display:"flex",gap:10}}>{[["all","All Records"],["top5","Top 5"]].map(([v,l])=><button key={v} onClick={()=>setScope(v)} className="btn" style={{background:scope===v?"var(--grad)":"rgba(120,90,244,.1)",color:scope===v?"#fff":"var(--muted)",border:scope===v?"none":"1px solid var(--border)",padding:"8px 16px"}}>{l}</button>)}</div></div>
          <div style={{padding:"12px 16px",background:"rgba(120,90,244,.06)",borderRadius:10,border:"1px solid var(--border)",marginBottom:20,fontSize:12,color:"var(--muted)"}}>Exporting <strong style={{color:"var(--text)"}}>{scope==="all"?customers.length:Math.min(5,customers.length)}</strong> records as <strong style={{color:"var(--p4)"}}>.{type}</strong></div>
          <button className="btn btn-primary" style={{width:"100%",padding:13}} onClick={doExport} disabled={exporting}>
            {exporting?<span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite",display:"inline-block"}}/> Preparing…</span>:"⬇ Download"}
          </button>
        </div>
        <div className="card" style={{padding:28}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16,marginBottom:20}}>Report Summary</div>
          {[["Total Customers",customers.length],["Total Revenue",`₹${customers.reduce((s,c)=>s+c.price*c.qty,0).toLocaleString()}`],["Products Tracked",new Set(customers.map(c=>c.product)).size],["Avg Price",`₹${Math.round(customers.reduce((s,c)=>s+c.price,0)/Math.max(customers.length,1)).toLocaleString()}`],["Records",`${customers.length} entries`]].map(([l,v],i,arr)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:i<arr.length-1?"1px solid var(--border)":undefined}}>
              <span style={{fontSize:13,color:"var(--muted)"}}>{l}</span><span style={{fontSize:13,fontFamily:"var(--fh)",fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Toasts ───────────────────────────────────────────────────────────────────
function Toasts({list}) {
  return <div className="toast">{list.map(t=><div key={t.id} className={`ti t${t.type[0]}`}>{t.msg}</div>)}</div>;
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]           = useState(null);
  const [page,setPage]           = useState("dashboard");
  const [customers,setCustomers] = useState([]);
  const [appReady,setAppReady]   = useState(false);
  const {list,push:toast}        = useToast();
  const saveTimer                = useRef(null);
  const custRef                  = useRef([]);
  custRef.current                = customers;

  // ── Inject CSS ──
  useEffect(()=>{
    const el=document.createElement("style");
    el.setAttribute("data-id","mp");
    el.textContent=CSS;
    document.head.appendChild(el);
    return()=>{try{document.head.removeChild(el);}catch(_){}};
  },[]);

  // ── On mount: restore session + customers from window.storage ──
  useEffect(()=>{
    (async()=>{
      // Restore session — stays logged in across refreshes
      try {
        const sr = await window.storage.get(SK_SESSION);
        if(sr && sr.value != null) {
          const sess = JSON.parse(sr.value);
          if(sess && sess.username) setUser(sess);
        }
      } catch(_){}
      // Restore customer data
      try {
        const cr = await window.storage.get(SK_CUSTOMERS);
        if(cr && cr.value != null) {
          const saved = JSON.parse(cr.value);
          if(Array.isArray(saved)) setCustomers(saved);
        }
      } catch(_){}
      setAppReady(true);
    })();
  },[]);

  // ── Auto-save customers whenever they change (debounced 400ms) ──
  useEffect(()=>{
    if(!appReady) return;
    if(saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async()=>{
      try { await window.storage.set(SK_CUSTOMERS, JSON.stringify(custRef.current)); } catch(_){}
    }, 400);
  },[customers, appReady]);

  // ── Login: save session so refresh keeps user logged in ──
  const handleLogin = async (userData) => {
    setUser(userData);
    try { await window.storage.set(SK_SESSION, JSON.stringify(userData)); } catch(_){}
  };

  // ── Logout: only clears session, customer data stays ──
  const handleLogout = async () => {
    setUser(null);
    setPage("dashboard");
    try { await window.storage.delete(SK_SESSION); } catch(_){}
  };

  if(!appReady) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid rgba(120,90,244,.25)",borderTopColor:"var(--p3)",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#8B80B0"}}>Loading your data…</div>
      </div>
    </div>
  );

  if(!user) return <Login onLogin={handleLogin}/>;

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <Sidebar active={page} setActive={setPage} user={user} onLogout={handleLogout}/>
      <main className="main">
        {page==="dashboard"&&<DashboardPage customers={customers}/>}
        {page==="customers"&&<CustomersPage customers={customers} setCustomers={setCustomers} toast={toast}/>}
        {page==="analytics"&&<AnalyticsPage customers={customers}/>}
        {page==="export"   &&<ExportPage    customers={customers} toast={toast}/>}
      </main>
      <Toasts list={list}/>
    </div>
  );
}
