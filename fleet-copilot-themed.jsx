import { useState, useEffect, useRef } from "react";

// ─── Theme Tokens ─────────────────────────────────────────────
const THEMES = {
  light: {
    // Backgrounds
    bgApp:       "#F4F6F8",
    bgSidebar:   "#FFFFFF",
    bgMain:      "#F4F6F8",
    bgPanel:     "#FFFFFF",
    bgCard:      "#F8FAFC",
    bgInput:     "#F1F5F9",
    bgBubbleOp:  "#1E293B",
    bgBubbleRn:  "#FFFFFF",
    bgHover:     "#F1F5F9",
    bgActive:    "#EEF4FF",
    bgSystem:    "#FEF9EC",
    bgStats:     "#F8FAFC",

    // Borders
    border:      "#E2E8F0",
    borderActive:"#3B82F6",

    // Text
    textPrimary: "#0F172A",
    textSecond:  "#64748B",
    textMuted:   "#94A3B8",
    textInverse: "#F8FAFC",
    textBubbleOp:"#F8FAFC",
    textBubbleRn:"#0F172A",

    // Accent
    accent:      "#3B82F6",
    accentBg:    "#EFF6FF",
    accentText:  "#1D4ED8",
    gold:        "#F59E0B",
    goldBg:      "#FFFBEB",
    goldText:    "#92400E",

    // Shadows
    shadow:      "0 1px 4px rgba(0,0,0,0.08)",
    shadowMd:    "0 4px 16px rgba(0,0,0,0.10)",

    // Toggle
    toggleBg:    "#E2E8F0",
    toggleKnob:  "#FFFFFF",
    toggleIcon:  "☀️",
    toggleLabel: "Light",
  },
  dark: {
    bgApp:       "#0B0F14",
    bgSidebar:   "#111720",
    bgMain:      "#0D1117",
    bgPanel:     "#111720",
    bgCard:      "#161D27",
    bgInput:     "#1A2231",
    bgBubbleOp:  "#1E4D8C",
    bgBubbleRn:  "#1A2231",
    bgHover:     "#1A2231",
    bgActive:    "#162340",
    bgSystem:    "#2A2310",
    bgStats:     "#161D27",

    border:      "#1E2D3D",
    borderActive:"#3B82F6",

    textPrimary: "#E8EFF8",
    textSecond:  "#7A93B4",
    textMuted:   "#445566",
    textInverse: "#0F172A",
    textBubbleOp:"#E8EFF8",
    textBubbleRn:"#D4E0EE",

    accent:      "#3B82F6",
    accentBg:    "#0F2444",
    accentText:  "#93C5FD",
    gold:        "#F59E0B",
    goldBg:      "#1C1400",
    goldText:    "#FCD34D",

    shadow:      "0 1px 6px rgba(0,0,0,0.4)",
    shadowMd:    "0 4px 20px rgba(0,0,0,0.5)",

    toggleBg:    "#1E2D3D",
    toggleKnob:  "#3B82F6",
    toggleIcon:  "🌙",
    toggleLabel: "Dark",
  },
};

// ─── Mock Data ────────────────────────────────────────────────
const RENTER_THREADS = [
  { id:1, name:"Ahmed Malik",    car:"Toyota Corolla · PKR-449", avatar:"AM", avatarColor:"#FF6B35", time:"2m ago",  lastMsg:"Where exactly should I pick up the car?",    unread:3, urgency:"high",     tag:"Pickup",      rentalEnd:"Today 6PM",   isLate:false,
    messages:[{from:"renter",text:"Hi! I'm coming to pick up the car in 30 mins.",time:"11:02 AM"},{from:"renter",text:"Where exactly should I pick up the car?",time:"11:04 AM"},{from:"renter",text:"Also, is parking free there?",time:"11:05 AM"}]},
  { id:2, name:"Sara Qureshi",   car:"Honda Civic · LHR-221",   avatar:"SQ", avatarColor:"#7C3AED", time:"14m ago", lastMsg:"I've sent photos of the scratch. Please check.", unread:1, urgency:"critical", tag:"Damage",      rentalEnd:"Yesterday",   isLate:true,
    messages:[{from:"renter",text:"Hi, there was a minor scratch when I returned the car.",time:"10:30 AM"},{from:"operator",text:"Hi Sara, please send clear photos of the damage.",time:"10:45 AM",aiGenerated:true},{from:"renter",text:"I've sent photos of the scratch. Please check.",time:"10:58 AM"},{from:"renter",img:true,text:"[Damage photo attached]",time:"10:58 AM"}]},
  { id:3, name:"Bilal Chaudhry", car:"Suzuki Swift · ISB-887",  avatar:"BC", avatarColor:"#0EA5E9", time:"1h ago",  lastMsg:"Can I extend for 2 more days?",                unread:0, urgency:"medium",   tag:"Extension",   rentalEnd:"Today 8PM",   isLate:false,
    messages:[{from:"renter",text:"Can I extend for 2 more days?",time:"10:00 AM"}]},
  { id:4, name:"Nadia Farooq",   car:"KIA Sportage · LHR-103",  avatar:"NF", avatarColor:"#10B981", time:"2h ago",  lastMsg:"Still waiting on my refund from last week?",   unread:2, urgency:"medium",   tag:"Refund",      rentalEnd:"3 days ago",  isLate:false,
    messages:[{from:"renter",text:"Hi, I returned the car 3 days ago.",time:"Yesterday"},{from:"renter",text:"Still waiting on my refund from last week?",time:"9:00 AM"}]},
  { id:5, name:"Omar Siddiqui",  car:"Honda BRV · LHR-558",     avatar:"OS", avatarColor:"#F59E0B", time:"3h ago",  lastMsg:"Car hasn't been returned yet.",                unread:0, urgency:"critical", tag:"Late Return",  rentalEnd:"3h overdue",  isLate:true,
    messages:[{from:"system",text:"🚨 Auto-flagged: Rental overdue by 3 hours. No response from renter.",time:"9:00 AM"},{from:"operator",text:"Hi Omar, your rental period ended 3 hours ago. Please confirm return time or extension. Additional charges may apply.",time:"9:01 AM",aiGenerated:true},{from:"renter",text:"Car hasn't been returned yet.",time:"9:45 AM"}]},
];

const AI_SUGGESTIONS = {
  1:{draft:"Hi Ahmed! 📍 Pickup location: DHA Phase 5, Main Boulevard near Packages Mall. Look for the silver gate — our coordinator Asif will be there. Parking is free. See you soon!",tag:"Pickup",confidence:96,extraActions:["Share Location Pin","Confirm Booking"]},
  2:{draft:"Hi Sara, thank you for sending the photos. I've logged a damage report. Our team will review within 24 hours and send you a formal assessment. Reference: DMG-2024-1203.",tag:"Damage",confidence:89,structuredClaim:{type:"Surface Scratch",location:"Front bumper",severity:"Minor",status:"Under Review"},extraActions:["Escalate Claim","Request More Photos"]},
  3:{draft:"Hi Bilal! ✅ Extension approved for 2 days. New return date: Friday 8PM. Revised total: PKR 6,400. A payment link has been sent to your WhatsApp. Please confirm.",tag:"Extension",confidence:92,extraActions:["Send Payment Link","Decline Extension"]},
  4:{draft:"Hi Nadia, apologies for the delay! Your security deposit of PKR 5,000 has been processed and will reflect in 2–3 business days. Reference: REF-20241130.",tag:"Refund",confidence:87,extraActions:["Check Payment Status","Escalate to Finance"]},
  5:{draft:"Hi Omar, this is an urgent notice. Your rental is now 3 hours overdue. Please return the vehicle immediately or contact us to arrange an extension. Late fees of PKR 500/hr are being applied.",tag:"Late Return",confidence:98,extraActions:["Call Renter","Flag for Recovery"]},
};

const urgencyConfig = {
  critical:{ color:"#EF4444", bgLight:"#FEF2F2", bgDark:"#2D0A0A", label:"URGENT" },
  high:    { color:"#F97316", bgLight:"#FFF7ED", bgDark:"#2D1500", label:"HIGH" },
  medium:  { color:"#EAB308", bgLight:"#FEFCE8", bgDark:"#1C1A00", label:"MEDIUM" },
  low:     { color:"#22C55E", bgLight:"#F0FDF4", bgDark:"#001A0A", label:"LOW" },
};

const tagColors = {
  Pickup:      { bgLight:"#DBEAFE", bgDark:"#0F2444", textLight:"#1D4ED8", textDark:"#93C5FD" },
  Damage:      { bgLight:"#FEE2E2", bgDark:"#2D0A0A", textLight:"#B91C1C", textDark:"#FCA5A5" },
  Extension:   { bgLight:"#D1FAE5", bgDark:"#002A14", textLight:"#065F46", textDark:"#6EE7B7" },
  Refund:      { bgLight:"#EDE9FE", bgDark:"#1A0A3D", textLight:"#6D28D9", textDark:"#C4B5FD" },
  "Late Return":{ bgLight:"#FEF3C7", bgDark:"#2A1A00", textLight:"#92400E", textDark:"#FCD34D" },
};

export default function FleetCopilot() {
  const [theme, setTheme] = useState("light");
  const [selected, setSelected] = useState(1);
  const [threads, setThreads] = useState(RENTER_THREADS);
  const [inputVal, setInputVal] = useState("");
  const [sentMessages, setSentMessages] = useState({});
  const [activeTab, setActiveTab] = useState("inbox");
  const [aiTyping, setAiTyping] = useState(false);
  const [claimCreated, setClaimCreated] = useState({});
  const [showSuggestion, setShowSuggestion] = useState(true);
  const messagesEndRef = useRef(null);
  const T = THEMES[theme];

  const thread = threads.find(t => t.id === selected);
  const suggestion = AI_SUGGESTIONS[selected];
  const allMessages = [...(thread?.messages || []), ...(sentMessages[selected] || [])];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [selected, sentMessages]);
  useEffect(() => { setShowSuggestion(true); setInputVal(""); }, [selected]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  const handleSend = (text) => {
    const msg = text || inputVal;
    if (!msg.trim()) return;
    setSentMessages(prev => ({ ...prev, [selected]: [...(prev[selected]||[]), {from:"operator",text:msg,time:"Now",aiGenerated:!!text}] }));
    setInputVal(""); setShowSuggestion(false);
    setThreads(prev => prev.map(t => t.id===selected ? {...t,unread:0,lastMsg:msg,time:"Just now"} : t));
    if (selected===1 && text) {
      setAiTyping(true);
      setTimeout(() => { setSentMessages(prev => ({...prev,[selected]:[...(prev[selected]||[]),{from:"renter",text:"Great, I'm on my way! Thanks 🙏",time:"Now"}]})); setAiTyping(false); }, 2000);
    }
  };

  const handleAiDraft = () => { setInputVal(suggestion.draft); };
  const sortedThreads = [...threads].sort((a,b) => ({critical:0,high:1,medium:2,low:3}[a.urgency]-({critical:0,high:1,medium:2,low:3}[b.urgency])));

  // ── Derived style helpers ──────────────────────────────────
  const tagStyle = (tag) => ({
    fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, letterSpacing:0.4,
    background: theme==="light" ? tagColors[tag]?.bgLight : tagColors[tag]?.bgDark,
    color: theme==="light" ? tagColors[tag]?.textLight : tagColors[tag]?.textDark,
  });
  const urgStyle = (urg) => ({
    fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, letterSpacing:0.4,
    background: theme==="light" ? urgencyConfig[urg]?.bgLight : urgencyConfig[urg]?.bgDark,
    color: urgencyConfig[urg]?.color,
  });

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bgApp, fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif", overflow:"hidden", fontSize:13, transition:"background 0.25s, color 0.25s" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:290, background:T.bgSidebar, display:"flex", flexDirection:"column", borderRight:`1px solid ${T.border}`, flexShrink:0, transition:"background 0.25s, border-color 0.25s" }}>

        {/* Logo + Theme Toggle */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 14px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#FBBF24,#F59E0B)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>⚡</div>
          <div style={{ flex:1 }}>
            <div style={{ color:T.textPrimary, fontWeight:700, fontSize:13, lineHeight:1.2 }}>1Now Fleet</div>
            <div style={{ color:T.gold, fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>Co-Pilot</div>
          </div>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} title={`Switch to ${theme==="light"?"dark":"light"} mode`}
            style={{ background:T.toggleBg, border:`1px solid ${T.border}`, borderRadius:20, padding:"5px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s", flexShrink:0 }}>
            <span style={{ fontSize:13 }}>{T.toggleIcon}</span>
            <div style={{ width:28, height:14, background:T.border, borderRadius:99, position:"relative", transition:"background 0.2s" }}>
              <div style={{ position:"absolute", top:2, left: theme==="dark" ? 14 : 2, width:10, height:10, borderRadius:"50%", background:T.toggleKnob, transition:"left 0.2s, background 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", padding:"10px 12px", gap:7, borderBottom:`1px solid ${T.border}` }}>
          {[{n:2,l:"Urgent",c:"#EF4444"},{n:1,l:"Late",c:"#F97316"},{n:7,l:"Active",c:"#22C55E"}].map(s=>(
            <div key={s.l} style={{ flex:1, background:T.bgCard, borderRadius:9, padding:"8px 6px", textAlign:"center", border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:19, fontWeight:800, color:s.c, lineHeight:1 }}>{s.n}</div>
              <div style={{ color:T.textMuted, fontSize:10, marginTop:2, fontWeight:500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", padding:"8px 10px 0", gap:5 }}>
          {["inbox","flagged"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{ flex:1, background: activeTab===tab ? T.accentBg : "transparent", border:`1px solid ${activeTab===tab ? T.borderActive : T.border}`, borderRadius:8, color: activeTab===tab ? T.accent : T.textMuted, fontSize:11, fontWeight:600, padding:"6px 4px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"all 0.15s" }}>
              {tab==="inbox" ? "All Inbox" : "🚨 Flagged"}
              {tab==="inbox" && threads.reduce((a,t)=>a+t.unread,0)>0 && (
                <span style={{ background:T.gold, color:"#000", borderRadius:20, padding:"1px 5px", fontSize:9, fontWeight:800 }}>
                  {threads.reduce((a,t)=>a+t.unread,0)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Thread List */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 8px", display:"flex", flexDirection:"column", gap:4 }}>
          {sortedThreads.filter(t=>activeTab==="inbox"||t.urgency==="critical").map(t=>(
            <div key={t.id} onClick={()=>setSelected(t.id)}
              style={{ background: selected===t.id ? T.bgActive : T.bgCard, borderRadius:11, padding:"10px 11px", cursor:"pointer", border:`1px solid ${selected===t.id ? T.borderActive : T.border}`, transition:"all 0.15s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:t.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0, position:"relative" }}>
                  {t.avatar}
                  {t.isLate && <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10, background:"#EF4444", borderRadius:"50%", border:`2px solid ${T.bgSidebar}` }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:T.textPrimary, fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:5 }}>
                    {t.name}
                    {t.unread>0 && <span style={{ background:T.gold, color:"#000", borderRadius:20, padding:"1px 6px", fontSize:9, fontWeight:800 }}>{t.unread}</span>}
                  </div>
                  <div style={{ color:T.textMuted, fontSize:10, marginTop:1 }}>{t.car}</div>
                </div>
                <div style={{ color:T.textMuted, fontSize:10, flexShrink:0 }}>{t.time}</div>
              </div>
              <div style={{ color:T.textSecond, fontSize:11, marginTop:5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.lastMsg}</div>
              <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                <span style={tagStyle(t.tag)}>{t.tag}</span>
                <span style={urgStyle(t.urgency)}>{urgencyConfig[t.urgency].label}</span>
                {t.isLate && <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20, background: theme==="light"?"#FEF3C7":"#2A1A00", color:"#92400E" }}>⏰ OVERDUE</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CHAT ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, background:T.bgMain, transition:"background 0.25s" }}>

        {/* Chat Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 20px", background:T.bgPanel, borderBottom:`1px solid ${T.border}`, flexShrink:0, transition:"background 0.25s" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:thread?.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{thread?.avatar}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:T.textPrimary }}>{thread?.name}</div>
              <div style={{ color:T.textSecond, fontSize:12, marginTop:1 }}>{thread?.car}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:20, background: thread?.isLate ? (theme==="light"?"#FEF2F2":"#2D0A0A") : (theme==="light"?"#F0FDF4":"#002A14"), color: thread?.isLate ? "#EF4444" : "#22C55E", border:`1px solid ${thread?.isLate?"#FCA5A5":"#86EFAC"}` }}>
              {thread?.isLate?"⚠️ ":"🟢 "}Return: {thread?.rentalEnd}
            </div>
            {["📞 Call","📋 Details"].map(btn=>(
              <button key={btn} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, cursor:"pointer", color:T.textSecond, transition:"all 0.15s" }}>{btn}</button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
          {allMessages.map((msg,i)=>{
            if (msg.from==="system") return (
              <div key={i} style={{ background:T.bgSystem, border:`1px solid ${theme==="light"?"#FDE68A":"#3D2E00"}`, borderRadius:8, padding:"8px 14px", color:theme==="light"?"#92400E":"#FCD34D", fontSize:11, fontWeight:500, textAlign:"center", margin:"0 40px" }}>{msg.text}</div>
            );
            const isOp = msg.from==="operator";
            return (
              <div key={i} style={{ display:"flex", alignItems:"flex-end", gap:8, justifyContent:isOp?"flex-end":"flex-start" }}>
                {!isOp && <div style={{ width:28, height:28, borderRadius:"50%", background:thread?.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{thread?.avatar}</div>}
                <div style={{ maxWidth:"68%" }}>
                  <div style={{ padding:"10px 14px", borderRadius:14, fontSize:13, lineHeight:1.55, background: isOp ? T.bgBubbleOp : T.bgBubbleRn, color: isOp ? T.textBubbleOp : T.textBubbleRn, border: isOp ? "none" : `1px solid ${T.border}`, borderBottomRightRadius: isOp ? 4 : 14, borderBottomLeftRadius: isOp ? 14 : 4, boxShadow:T.shadow, transition:"background 0.25s" }}>
                    {msg.img && <div style={{ background: theme==="light"?"#F1F5F9":"#0D1117", border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 12px", color:T.textMuted, fontSize:11, marginBottom:6 }}>📸 damage_photo_front_bumper.jpg</div>}
                    {msg.text}
                    {msg.aiGenerated && <div style={{ display:"inline-block", background:T.gold, color:"#000", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, marginTop:6, marginLeft:4 }}>⚡ AI Draft</div>}
                  </div>
                  <div style={{ color:T.textMuted, fontSize:10, marginTop:3, textAlign:isOp?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            );
          })}
          {aiTyping && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, justifyContent:"flex-start" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:thread?.avatarColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff" }}>{thread?.avatar}</div>
              <div style={{ padding:"12px 16px", borderRadius:14, borderBottomLeftRadius:4, background:T.bgBubbleRn, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  {[0,200,400].map(d=>(
                    <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:T.textMuted, animation:"bounce 1.2s infinite", animationDelay:`${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestion Panel */}
        {showSuggestion && suggestion && (
          <div style={{ background:T.bgPanel, borderTop:`2px solid ${T.gold}`, padding:"14px 20px", flexShrink:0, transition:"background 0.25s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, fontWeight:700, fontSize:12, color:T.textPrimary }}>
                <span style={{ fontSize:14 }}>⚡</span>
                AI Co-Pilot Suggestion
                <span style={{ background: theme==="light"?"#D1FAE5":"#002A14", color: theme==="light"?"#065F46":"#6EE7B7", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{suggestion.confidence}% confident</span>
              </div>
              <button onClick={()=>setShowSuggestion(false)} style={{ background:"transparent", border:"none", fontSize:18, color:T.textMuted, cursor:"pointer", lineHeight:1 }}>×</button>
            </div>

            {suggestion.structuredClaim && (
              <div style={{ background: theme==="light"?"#FEF2F2":"#2D0A0A", border:`1px solid ${theme==="light"?"#FCA5A5":"#5A1A1A"}`, borderRadius:10, padding:"10px 14px", marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:11, color:"#EF4444", marginBottom:8 }}>📋 Auto-structured Damage Report</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 16px", marginBottom:10 }}>
                  {Object.entries(suggestion.structuredClaim).map(([k,v])=>(
                    <div key={k} style={{ display:"flex", gap:5, fontSize:11 }}>
                      <span style={{ color:T.textMuted, fontWeight:500 }}>{k}</span>
                      <span style={{ color:T.textPrimary, fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {!claimCreated[selected]
                  ? <button style={{ background:"#B91C1C", color:"#fff", border:"none", borderRadius:7, padding:"5px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }} onClick={()=>setClaimCreated(p=>({...p,[selected]:true}))}>Create Formal Claim →</button>
                  : <div style={{ color:"#22C55E", fontWeight:600, fontSize:11 }}>✅ Claim DMG-2024-1203 created</div>
                }
              </div>
            )}

            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.textSecond, lineHeight:1.6, marginBottom:10, transition:"background 0.25s" }}>{suggestion.draft}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <button onClick={()=>handleSend(suggestion.draft)} style={{ background:T.textPrimary, color: theme==="light"?"#FFFFFF":T.bgApp, border:"none", borderRadius:8, padding:"7px 16px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>✉️ Send Reply</button>
              <button onClick={handleAiDraft} style={{ background:T.bgCard, color:T.textPrimary, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 14px", fontSize:11, fontWeight:600, cursor:"pointer" }}>✏️ Edit First</button>
              {suggestion.extraActions.map(a=>(
                <button key={a} style={{ background:"transparent", color:T.textSecond, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 12px", fontSize:11, cursor:"pointer" }}>{a}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div style={{ display:"flex", alignItems:"center", gap:9, padding:"12px 18px", background:T.bgPanel, borderTop:`1px solid ${T.border}`, flexShrink:0, transition:"background 0.25s" }}>
          <button onClick={handleAiDraft} style={{ background:`linear-gradient(135deg,#FBBF24,#F59E0B)`, color:"#000", border:"none", borderRadius:9, padding:"10px 13px", fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>⚡ AI Draft</button>
          <textarea
            style={{ flex:1, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 13px", fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", color:T.textPrimary, background:T.bgInput, lineHeight:1.5, transition:"background 0.25s, border-color 0.25s, color 0.25s" }}
            placeholder="Type a reply or use AI Draft…" value={inputVal} rows={2}
            onChange={e=>setInputVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} }}
          />
          <button onClick={()=>handleSend()} disabled={!inputVal.trim()}
            style={{ width:40, height:40, background: inputVal.trim() ? T.textPrimary : T.border, color: inputVal.trim() ? (theme==="light"?"#FFF":"#E8EFF8") : T.textMuted, border:"none", borderRadius:"50%", fontSize:16, cursor: inputVal.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>➤</button>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ width:220, background:T.bgPanel, borderLeft:`1px solid ${T.border}`, padding:"16px 14px", overflowY:"auto", flexShrink:0, display:"flex", flexDirection:"column", gap:14, transition:"background 0.25s, border-color 0.25s" }}>
        <div style={{ fontWeight:700, fontSize:13, color:T.textPrimary, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>🚗 Fleet Summary</div>

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px" }}>
          <div style={{ color:T.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Today's Revenue</div>
          <div style={{ fontSize:20, fontWeight:800, color:T.textPrimary }}>PKR 84,200</div>
          <div style={{ color:"#22C55E", fontSize:11, fontWeight:600, marginTop:3 }}>+12% vs yesterday</div>
        </div>

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px" }}>
          <div style={{ color:T.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>Active Rentals</div>
          {threads.map(t=>(
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:7, paddingBottom:7, marginBottom:7, borderBottom:`1px solid ${T.border}` }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: t.isLate?"#EF4444":"#22C55E", flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:T.textPrimary, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
                <div style={{ fontSize:10, color:T.textMuted }}>{t.car.split("·")[0].trim()}</div>
              </div>
              <div style={{ fontSize:10, fontWeight:600, flexShrink:0, color: t.isLate?"#EF4444":T.textMuted }}>{t.isLate?"⚠️ Late":t.rentalEnd}</div>
            </div>
          ))}
        </div>

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px" }}>
          <div style={{ color:T.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>AI Actions Today</div>
          {[{l:"Drafts sent",v:"14",c:T.textPrimary},{l:"Auto-flagged",v:"3",c:"#EF4444"},{l:"Claims created",v:"2",c:T.textPrimary},{l:"Time saved",v:"2.4h",c:"#22C55E"}].map(s=>(
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.textSecond, paddingBottom:5, marginBottom:5, borderBottom:`1px solid ${T.border}` }}>
              <span>{s.l}</span><span style={{ fontWeight:700, color:s.c }}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
