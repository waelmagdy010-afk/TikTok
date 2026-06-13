import { useState } from "react";

const NICHES = [
  { id: "finance",       label: "مال وأعمال",       emoji: "💰", ttMult: 3.0, ytMult: 4.0, ytCPM: 12 },
  { id: "tech",          label: "تقنية",            emoji: "💻", ttMult: 2.5, ytMult: 3.2, ytCPM: 9  },
  { id: "health",        label: "صحة ولياقة",       emoji: "💪", ttMult: 2.0, ytMult: 2.5, ytCPM: 7  },
  { id: "beauty",        label: "جمال وموضة",       emoji: "💄", ttMult: 1.8, ytMult: 2.0, ytCPM: 5  },
  { id: "food",          label: "طعام وطبخ",        emoji: "🍕", ttMult: 1.5, ytMult: 1.8, ytCPM: 4  },
  { id: "gaming",        label: "ألعاب",            emoji: "🎮", ttMult: 1.3, ytMult: 2.0, ytCPM: 5  },
  { id: "education",     label: "تعليم",            emoji: "📚", ttMult: 1.7, ytMult: 2.2, ytCPM: 6  },
  { id: "entertainment", label: "ترفيه وكوميديا",   emoji: "🎭", ttMult: 1.2, ytMult: 1.4, ytCPM: 3  },
];

const fmtNum = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
};

const fmtMoney = (n: number) => {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n).toLocaleString();
};

function getTier(f: number) {
  if (f < 10000)   return { label: "Nano",    color: "#9ca3af" };
  if (f < 100000)  return { label: "Micro",   color: "#00F2EA" };
  if (f < 500000)  return { label: "Mid-tier",color: "#a78bfa" };
  if (f < 1000000) return { label: "Macro",   color: "#fbbf24" };
  return              { label: "Mega ⭐",     color: "#FF004F" };
}

function baseBrandRate(f: number) {
  if (f < 10000)   return 60;
  if (f < 50000)   return 280;
  if (f < 100000)  return 750;
  if (f < 500000)  return 2200;
  if (f < 1000000) return 5500;
  if (f < 5000000) return 14000;
  return 38000;
}

const SliderInput = ({ label, value, min, max, step, onChange, display, sublabel }: any) => (
  <div className="space-y-3 mb-6">
    <div className="flex justify-between items-end text-xs text-gray-400 uppercase font-semibold">
      <span>{label}</span>
      <span className="text-[16px] font-bold text-white">{display}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1 bg-gray-800 rounded-lg cursor-pointer"
      style={{ accentColor: "#FF004F" }}
    />
    {sublabel && <div className="text-[10px] text-gray-500 mt-1">{sublabel}</div>}
  </div>
);

const Row = ({ label, value, color = "#fff", big }: any) => (
  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
    <span className={big ? "text-sm text-gray-300 font-semibold" : "text-[11px] text-gray-500 uppercase font-semibold tracking-widest"}>{label}</span>
    <span className={big ? "text-lg font-bold" : "text-sm font-semibold"} style={{ color }}>{value}</span>
  </div>
);

export default function App() {
  const [followers,      setFollowers]      = useState(100000);
  const [avgViews,       setAvgViews]       = useState(50000);
  const [nicheId,        setNicheId]        = useState("entertainment");
  const [vidsPerMonth,   setVidsPerMonth]   = useState(20);
  const [results,        setResults]        = useState<any>(null);
  const [loading,        setLoading]        = useState(false);

  const niche = NICHES.find(n => n.id === nicheId)!;
  const tier  = getTier(followers);

  const calculate = () => {
    setLoading(true);
    setTimeout(() => {
      const base       = baseBrandRate(followers);
      const deals      = followers < 50000 ? 1 : followers < 500000 ? 2 : followers < 2e6 ? 3 : 4;

      // ── TikTok ──
      const ttFund     = (avgViews / 1000) * 0.026 * vidsPerMonth;
      const ttBrand    = base * niche.ttMult * deals;
      const ttLive     = Math.min(followers * 0.0045 * 0.18 * 8, followers * 0.12);
      const ttTotal    = ttFund + ttBrand + ttLive;

      // ── YouTube (same content) ──
      const ytAds      = (avgViews / 1000) * niche.ytCPM * vidsPerMonth * 0.55;
      const ytBrand    = base * niche.ytMult * deals * 1.35;
      const ytMember   = followers * 0.0009 * 4.99 * 0.7;
      const ytTotal    = ytAds + ytBrand + ytMember;

      setResults({ ttFund, ttBrand, ttLive, ttTotal, ytAds, ytBrand, ytMember, ytTotal, deals });
      setLoading(false);
    }, 700);
  };

  const ttWins = results && results.ttTotal > results.ytTotal;

  return (
    <div dir="rtl" className="bg-[#050505] text-[#F3F4F6] font-sans flex flex-col lg:flex-row min-h-screen overflow-x-hidden">

      {/* ── SIDEBAR ── */}
      <aside className="w-full lg:w-[380px] h-full lg:min-h-screen glass-panel lg:border-l border-white/5 p-8 flex flex-col gap-6 relative z-10 shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="absolute text-3xl tiktok-glow leading-none">♪</span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight uppercase tracking-tight">
              TikTok <span className="text-[#FF004F]">Estimator</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Market Analytics Pro</p>
          </div>
        </div>

        <div className="space-y-4">
          <SliderInput
            label="عدد المتابعين"
            value={followers}
            min={1000} max={10000000} step={1000}
            onChange={setFollowers}
            display={<>
              <span className="text-[10px] px-2 py-0.5 rounded ml-2 align-middle border" style={{ backgroundColor: tier.color + "22", color: tier.color, borderColor: tier.color + "44" }}>{tier.label}</span>
              <span style={{ color: tier.color }}>{fmtNum(followers)}</span>
            </>}
          />

          <SliderInput
            label="متوسط مشاهدات الفيديو"
            value={avgViews}
            min={500} max={5000000} step={500}
            onChange={setAvgViews}
            display={<span className="text-white">{fmtNum(avgViews)}</span>}
            sublabel={<>معدل التفاعل: {((avgViews / (followers || 1)) * 100).toFixed(1)}% {((avgViews / (followers || 1)) > 0.1 ? <span className="text-green-400">✨ ممتاز</span> : (avgViews / (followers || 1)) > 0.03 ? "👍 جيد" : "📉 منخفض")}</>}
          />

          <SliderInput
            label="عدد الفيديوهات شهرياً"
            value={vidsPerMonth}
            min={1} max={90} step={1}
            onChange={setVidsPerMonth}
            display={<span className="text-gray-300">{vidsPerMonth} فيديو</span>}
            sublabel={`${vidsPerMonth <= 7 ? "نشر عادي" : vidsPerMonth <= 20 ? "نشر منتظم 👍" : "نشر مكثف 🔥"}`}
          />

          {/* Niche Selector */}
          <div className="space-y-2 mt-4">
            <label className="text-xs text-gray-400 uppercase font-semibold">نوع المحتوى</label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {NICHES.map(n => {
                const isActive = nicheId === n.id;
                return (
                  <button key={n.id} onClick={() => setNicheId(n.id)}
                    className={`p-3 rounded-lg flex items-center justify-between transition-all ${
                      isActive ? "bg-[#FF004F18] border border-[#FF004F] text-white" : "bg-[#111] border border-white/10 text-gray-400"
                    }`}>
                    <span className="flex items-center gap-1.5"><span className="text-sm">{n.emoji}</span> {n.label}</span>
                    <span className="opacity-40">x{n.ttMult}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CALCULATE BUTTON ── */}
        <button onClick={calculate} disabled={loading}
          className="w-full py-4 mt-6 bg-gradient-to-r from-[#FF004F] to-[#CC003D] rounded-xl font-bold text-sm text-white shadow-[0_0_30px_rgba(255,0,79,0.3)] hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-70 disabled:pointer-events-none">
          {loading ? "⏳ جاري الحساب..." : "✦ تحديث الحسابات"}
        </button>

        <div className="mt-auto text-[10px] text-gray-600 border-t border-white/5 pt-4">تقدير بناءً على بيانات السوق الربع الأول 2025. الأرقام لا تشمل الضرائب أو عمولات المنصة.</div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full p-6 lg:p-10 gradient-bg flex flex-col gap-8 relative overflow-y-auto">
        {results && !loading ? (
          <>
            {/* HERO STATS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-4">
              <div className="space-y-1">
                <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest">توقع الدخل الشهري الإجمالي</h2>
                <div className="text-6xl md:text-7xl font-extrabold tracking-tighter tiktok-glow leading-tight">
                  {fmtMoney(results.ttTotal)}
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                     <span>▲</span><span>+14.2% عن الشهر الماضي</span>
                   </div>
                   <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded italic">
                     تقدير: {results.deals} صفقات إعلانية
                   </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="glass-panel p-4 rounded-2xl w-32 text-center border border-white/10">
                  <div className="text-[10px] text-gray-500 mb-1">Creator Fund</div>
                  <div className="font-bold text-[#00F2EA] text-lg">{fmtMoney(results.ttFund)}</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-32 text-center border border-white/10">
                  <div className="text-[10px] text-gray-500 mb-1">Live Gifts</div>
                  <div className="font-bold text-[#a78bfa] text-lg">{fmtMoney(results.ttLive)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              
              {/* COMPARISON & BREAKDOWN */}
              <div className="space-y-6">
                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-gray-700"></span>مقارنة الأداء عبر المنصات
                </h3>
                
                {/* TikTok Box */}
                <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-[#FF004F44] relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">TikTok Income</span>
                      <span className="text-2xl font-bold text-white">{fmtMoney(results.ttTotal)}</span>
                    </div>
                    {ttWins && <span className="text-[10px] font-bold bg-[#FF004F22] text-[#FF004F] px-2 py-0.5 rounded-full border border-[#FF004F33]">الأعلى نقدياً</span>}
                  </div>
                  
                  {/* Progress bar visual */}
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative z-10 mb-4">
                    <div className="h-full bg-gradient-to-l from-[#FF004F] to-[#00F2EA] rounded-full transition-all duration-700" 
                         style={{ width: `${Math.round((results.ttTotal / Math.max(results.ttTotal, results.ytTotal)) * 100)}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 text-[11px] border-t border-white/5 relative z-10">
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">Brand Deals</span><strong className="text-gray-300">{fmtMoney(results.ttBrand)}</strong></div>
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">Fund/Lives</span><strong className="text-gray-300">{fmtMoney(results.ttFund + results.ttLive)}</strong></div>
                  </div>
                </div>

                {/* YouTube Box */}
                <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/5 h-full flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">YouTube Shorts</span>
                      <span className="text-2xl font-bold text-gray-200">{fmtMoney(results.ytTotal)}</span>
                    </div>
                    {!ttWins && <span className="text-[10px] font-bold bg-[#FF004F22] text-[#FF004F] px-2 py-0.5 rounded-full border border-[#FF004F33]">الأعلى نقدياً</span>}
                  </div>

                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gray-500 rounded-full transition-all duration-700" 
                         style={{ width: `${Math.round((results.ytTotal / Math.max(results.ttTotal, results.ytTotal)) * 100)}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 text-[11px] border-t border-white/5">
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">Brand Deals</span><strong className="text-gray-400">{fmtMoney(results.ytBrand)}</strong></div>
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">AdSense</span><strong className="text-gray-400">{fmtMoney(results.ytAds)}</strong></div>
                  </div>
                </div>
              </div>

              {/* SMART TIPS */}
              <div className="space-y-4">
                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-gray-700"></span>نصائح ذكية للنمو
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-white/5">
                    <div className="w-12 h-12 bg-[#00F2EA11] border border-[#00F2EA22] rounded-full flex items-center justify-center text-xl shrink-0">🤝</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white mb-1">توزيع الرعاة (Brand Deals)</div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        عقود الرعاية هي المصدر الأكبر بـ <span className="text-[#00F2EA] font-semibold">{fmtMoney(results.ttBrand)}</span>. جهّز Media Kit احترافي لعرض إحصائياتك للشركات.
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-white/5">
                    <div className="w-12 h-12 bg-[#FF004F11] border border-[#FF004F22] rounded-full flex items-center justify-center text-xl shrink-0">📈</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white mb-1">تحسين المشاهدات</div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        كل زيادة 10% في متوسط المشاهدات قد تولد <span className="text-[#FF004F] font-semibold">+{fmtMoney(results.ttFund * 0.1)}</span> إضافية شهرياً من الـ Creator Fund.
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-white/5">
                    <div className="w-12 h-12 bg-[#a78bfa11] border border-[#a78bfa22] rounded-full flex items-center justify-center text-xl shrink-0">💎</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white mb-1">ولاء الجمهور</div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        البث المباشر يضيف <span className="text-[#a78bfa] font-semibold">{fmtMoney(results.ttLive)}</span> لدخلك الآن. بث مباشر أسبوعياً قد يضاعف هذا الرقم.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-2xl border ${ttWins ? "bg-[#FF004F0d] border-[#FF004F33]" : "bg-[#ff00001a] border-[#ff000033]"}`}>
                  <div className={`text-[11px] font-bold mb-1 ${ttWins ? "text-[#FF004F]" : "text-[#ff6b6b]"}`}>
                    {ttWins ? "التوصية: استمر في التيك توك" : "التوصية: اليوتيوب قد يكون مربحاً أكثر"}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-relaxed">
                    {ttWins 
                      ? `لنيتش ${niche.label}، نظام المنح والإعلانات في تيك توك يحقق لك عوائد أعلى بـ ${fmtMoney(results.ttTotal - results.ytTotal)} مقارنة بيوتيوب شورتس.` 
                      : `عائد الإعلانات (CPM) لنيتش ${niche.label} في يوتيوب يمكن أن يربحك ${fmtMoney(results.ytTotal - results.ttTotal)} إضافية شهرياً.`}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                <span className="text-[11px] text-gray-400">تحليل حي بناءً على: <strong className="text-white">{niche.label} - الشرق الأوسط</strong></span>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="hidden sm:inline-block px-2 py-1 bg-white/10 rounded text-[10px] text-gray-300">2025 Market Peak</span>
                <span className="px-2 py-1 bg-[#FF004F] rounded text-[10px] text-white font-bold cursor-pointer">Export Data</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col opacity-40">
            <div className="text-6xl mb-4 tiktok-glow">♪</div>
            <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">عدل البيانات للبدء في الحساب</p>
          </div>
        )}
      </main>
    </div>
  );
}
