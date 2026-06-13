import { useState, useEffect } from "react";
import { Moon, Sun, Languages, Settings, CheckCircle, XCircle, X } from "lucide-react";

type Lang = "ar" | "en" | "es" | "fr";
type Theme = "dark" | "light";

interface AdConfig {
  enabled: boolean;
  networkName: string;
  scriptUrl: string;
  zoneId: string;
}

const NICHES = {
  ar: [
    { id: "finance",       label: "مال وأعمال",       emoji: "💰", ttMult: 3.0, ytMult: 4.0, ytCPM: 12 },
    { id: "tech",          label: "تقنية",            emoji: "💻", ttMult: 2.5, ytMult: 3.2, ytCPM: 9  },
    { id: "health",        label: "صحة ولياقة",       emoji: "💪", ttMult: 2.0, ytMult: 2.5, ytCPM: 7  },
    { id: "beauty",        label: "جمال وموضة",       emoji: "💄", ttMult: 1.8, ytMult: 2.0, ytCPM: 5  },
    { id: "food",          label: "طعام وطبخ",        emoji: "🍕", ttMult: 1.5, ytMult: 1.8, ytCPM: 4  },
    { id: "gaming",        label: "ألعاب",            emoji: "🎮", ttMult: 1.3, ytMult: 2.0, ytCPM: 5  },
    { id: "education",     label: "تعليم",            emoji: "📚", ttMult: 1.7, ytMult: 2.2, ytCPM: 6  },
    { id: "entertainment", label: "ترفيه وكوميديا",   emoji: "🎭", ttMult: 1.2, ytMult: 1.4, ytCPM: 3  },
  ],
  en: [
    { id: "finance",       label: "Finance & Biz",    emoji: "💰", ttMult: 3.0, ytMult: 4.0, ytCPM: 12 },
    { id: "tech",          label: "Technology",       emoji: "💻", ttMult: 2.5, ytMult: 3.2, ytCPM: 9  },
    { id: "health",        label: "Health & Fit",     emoji: "💪", ttMult: 2.0, ytMult: 2.5, ytCPM: 7  },
    { id: "beauty",        label: "Beauty",           emoji: "💄", ttMult: 1.8, ytMult: 2.0, ytCPM: 5  },
    { id: "food",          label: "Food",             emoji: "🍕", ttMult: 1.5, ytMult: 1.8, ytCPM: 4  },
    { id: "gaming",        label: "Gaming",           emoji: "🎮", ttMult: 1.3, ytMult: 2.0, ytCPM: 5  },
    { id: "education",     label: "Education",        emoji: "📚", ttMult: 1.7, ytMult: 2.2, ytCPM: 6  },
    { id: "entertainment", label: "Entertainment",    emoji: "🎭", ttMult: 1.2, ytMult: 1.4, ytCPM: 3  },
  ],
  es: [
    { id: "finance",       label: "Finanzas y Negocios", emoji: "💰", ttMult: 3.0, ytMult: 4.0, ytCPM: 12 },
    { id: "tech",          label: "Tecnología",       emoji: "💻", ttMult: 2.5, ytMult: 3.2, ytCPM: 9  },
    { id: "health",        label: "Salud y Fitness",  emoji: "💪", ttMult: 2.0, ytMult: 2.5, ytCPM: 7  },
    { id: "beauty",        label: "Belleza y Moda",   emoji: "💄", ttMult: 1.8, ytMult: 2.0, ytCPM: 5  },
    { id: "food",          label: "Comida",           emoji: "🍕", ttMult: 1.5, ytMult: 1.8, ytCPM: 4  },
    { id: "gaming",        label: "Juegos",           emoji: "🎮", ttMult: 1.3, ytMult: 2.0, ytCPM: 5  },
    { id: "education",     label: "Educación",        emoji: "📚", ttMult: 1.7, ytMult: 2.2, ytCPM: 6  },
    { id: "entertainment", label: "Entretenimiento",  emoji: "🎭", ttMult: 1.2, ytMult: 1.4, ytCPM: 3  },
  ],
  fr: [
    { id: "finance",       label: "Finance et Affaires", emoji: "💰", ttMult: 3.0, ytMult: 4.0, ytCPM: 12 },
    { id: "tech",          label: "Technologie",      emoji: "💻", ttMult: 2.5, ytMult: 3.2, ytCPM: 9  },
    { id: "health",        label: "Santé et Forme",   emoji: "💪", ttMult: 2.0, ytMult: 2.5, ytCPM: 7  },
    { id: "beauty",        label: "Beauté",           emoji: "💄", ttMult: 1.8, ytMult: 2.0, ytCPM: 5  },
    { id: "food",          label: "Nourriture",       emoji: "🍕", ttMult: 1.5, ytMult: 1.8, ytCPM: 4  },
    { id: "gaming",        label: "Jeux Vidéo",       emoji: "🎮", ttMult: 1.3, ytMult: 2.0, ytCPM: 5  },
    { id: "education",     label: "Éducation",        emoji: "📚", ttMult: 1.7, ytMult: 2.2, ytCPM: 6  },
    { id: "entertainment", label: "Divertissement",   emoji: "🎭", ttMult: 1.2, ytMult: 1.4, ytCPM: 3  },
  ]
};

const TRANSLATIONS = {
  ar: {
    appTitle: "Estimator",
    subtitle: "Market Analytics Pro",
    yourData: "بياناتك",
    followers: "عدد المتابعين",
    avgViews: "متوسط مشاهدات الفيديو",
    vidsPerMonth: "عدد الفيديوهات شهرياً",
    niche: "نوع المحتوى",
    calculate: "✦ تحديث الحسابات",
    calculating: "⏳ جاري الحساب...",
    note: "تقدير بناءً على بيانات السوق الربع الأول 2025. الأرقام لا تشمل الضرائب أو عمولات المنصة.",
    expectedIncome: "توقع الدخل الشهري الإجمالي",
    comparedLastMonth: "عن الشهر الماضي",
    brandDealsEst: "تقدير:",
    adDeals: "صفقات إعلانية",
    crossPlatform: "مقارنة الأداء عبر المنصات",
    highestCash: "الأعلى نقدياً",
    brandDealsLabel: "Brand Deals",
    fundLivesLabel: "Fund/Lives",
    adsenseLabel: "AdSense",
    smartTips: "نصائح ذكية للنمو",
    tip1Title: "توزيع الرعاة (Brand Deals)",
    tip1Desc: (total: string) => `عقود الرعاية هي المصدر الأكبر بـ ${total}. جهّز Media Kit احترافي لعرض إحصائياتك للشركات.`,
    tip2Title: "تحسين المشاهدات",
    tip2Desc: (total: string) => `كل زيادة 10% في متوسط المشاهدات قد تولد +${total} إضافية شهرياً من الـ Creator Fund.`,
    tip3Title: "ولاء الجمهور",
    tip3Desc: (total: string) => `البث المباشر يضيف ${total} لدخلك الآن. بث مباشر أسبوعياً قد يضاعف هذا الرقم.`,
    recommendationTiktok: "التوصية: استمر في التيك توك",
    recommendationYoutube: "التوصية: اليوتيوب قد يكون مربحاً أكثر",
    recTiktokDesc: (niche: string, diff: string) => `لنيتش ${niche}، نظام المنح والإعلانات في تيك توك يحقق لك عوائد أعلى بـ ${diff} مقارنة بيوتيوب شورتس.`,
    recYoutubeDesc: (niche: string, diff: string) => `عائد الإعلانات (CPM) لنيتش ${niche} في يوتيوب يمكن أن يربحك ${diff} إضافية شهرياً.`,
    liveAnalysis: "تحليل حي بناءً على:",
    middleEast: "الشرق الأوسط",
    exportData: "Export Data",
    marketPeak: "2025 Market Peak",
    adjustStart: "عدل البيانات للبدء في الحساب",
    video: "فيديو",
    excellent: "✨ ممتاز",
    good: "👍 جيد",
    low: "📉 منخفض",
    engagementRate: "معدل التفاعل:",
    normalPosting: "نشر عادي",
    regularPosting: "نشر منتظم 👍",
    intensePosting: "نشر مكثف 🔥",
    themeAria: "تبديل المظهر",
    langAria: "تبديل اللغة"
  },
  en: {
    appTitle: "Estimator",
    subtitle: "Market Analytics Pro",
    yourData: "Your Data",
    followers: "Followers",
    avgViews: "Avg Video Views",
    vidsPerMonth: "Videos Per Month",
    niche: "Content Niche",
    calculate: "✦ Update Calculations",
    calculating: "⏳ Calculating...",
    note: "Estimate based on market data Q1 2025. Figures do not include taxes or platform fees.",
    expectedIncome: "Expected Total Monthly Income",
    comparedLastMonth: "vs Last Month",
    brandDealsEst: "Estimate:",
    adDeals: "Ad Deals",
    crossPlatform: "Cross-Platform Comparison",
    highestCash: "Highest Return",
    brandDealsLabel: "Brand Deals",
    fundLivesLabel: "Fund/Lives",
    adsenseLabel: "AdSense",
    smartTips: "Smart Growth Tips",
    tip1Title: "Brand Deals Distribution",
    tip1Desc: (total: string) => `Sponsorships are the largest source at ${total}. Prepare a professional Media Kit to show your stats to companies.`,
    tip2Title: "Improve Views",
    tip2Desc: (total: string) => `A 10% increase in views could generate an extra +${total} monthly from the Creator Fund.`,
    tip3Title: "Audience Loyalty",
    tip3Desc: (total: string) => `Live streaming adds ${total} to your income now. A weekly live stream could double this.`,
    recommendationTiktok: "Recommendation: Stick with TikTok",
    recommendationYoutube: "Recommendation: YouTube might be more profitable",
    recTiktokDesc: (niche: string, diff: string) => `For the ${niche} niche, TikTok's fund and ad system gives you ${diff} more returns compared to YouTube Shorts.`,
    recYoutubeDesc: (niche: string, diff: string) => `YouTube's AdSense (CPM) for the ${niche} niche could earn you an extra ${diff} monthly.`,
    liveAnalysis: "Live analysis based on:",
    middleEast: "Middle East",
    exportData: "Export Data",
    marketPeak: "2025 Market Peak",
    adjustStart: "Adjust data to start calculating",
    video: "Videos",
    excellent: "✨ Excellent",
    good: "👍 Good",
    low: "📉 Low",
    engagementRate: "Engagement rate:",
    normalPosting: "Normal posting",
    regularPosting: "Regular posting 👍",
    intensePosting: "Intense posting 🔥",
    themeAria: "Toggle Theme",
    langAria: "Toggle Language",
    tiktokIncome: "TikTok Income",
    youtubeShorts: "YouTube Shorts"
  },
  es: {
    appTitle: "Estimador",
    subtitle: "Analítica de Mercado Pro",
    yourData: "Tus Datos",
    followers: "Seguidores",
    avgViews: "Vistas Promedio",
    vidsPerMonth: "Videos/Mes",
    niche: "Nicho de Contenido",
    calculate: "✦ Actualizar Cálculos",
    calculating: "⏳ Calculando...",
    note: "Estimación por mercado Q1 2025. Sin incluir impuestos ni comisiones.",
    expectedIncome: "Ingreso Mensual Esperado",
    comparedLastMonth: "vs Mes Pasado",
    brandDealsEst: "Estimación:",
    adDeals: "Anuncios",
    crossPlatform: "Comparación Multiplataforma",
    highestCash: "Mayor Retorno",
    brandDealsLabel: "Marcas",
    fundLivesLabel: "Fondo/Lives",
    adsenseLabel: "AdSense",
    smartTips: "Consejos Inteligentes",
    tip1Title: "Distribución de Patrocinios",
    tip1Desc: (total: string) => `Los patrocinios son tu principal fuente aportando ${total}. Crea tu Media Kit.`,
    tip2Title: "Mejorar Vistas",
    tip2Desc: (total: string) => `Un +10% en vistas te podría sumar ${total} extra/mes de fondos.`,
    tip3Title: "Lealtad de Audiencia",
    tip3Desc: (total: string) => `Los directos suman ${total} mensual. Haz al menos un stream por semana.`,
    recommendationTiktok: "Recomendación: Quédate en TikTok",
    recommendationYoutube: "Recomendación: YouTube te daría más",
    recTiktokDesc: (niche: string, diff: string) => `Para contenido de ${niche}, TikTok genera ${diff} adicionales en comparación con Shorts.`,
    recYoutubeDesc: (niche: string, diff: string) => `AdSense en YouTube para la temática de ${niche} te podría generar ${diff} extra.`,
    liveAnalysis: "Análisis basado en:",
    middleEast: "Medio Oriente / LatAm",
    exportData: "Exportar Datos",
    marketPeak: "Estimación 2025",
    adjustStart: "Ajusta datos para empezar",
    video: "Videos",
    excellent: "✨ Excelente",
    good: "👍 Bueno",
    low: "📉 Bajo",
    engagementRate: "Tasa de interacción:",
    normalPosting: "Frecuencia normal",
    regularPosting: "Frecuencia regular 👍",
    intensePosting: "Frecuencia intensa 🔥",
    themeAria: "Cambiar Tema",
    langAria: "Cambiar Idioma",
    tiktokIncome: "Ingresos TikTok",
    youtubeShorts: "YouTube Shorts"
  },
  fr: {
    appTitle: "Estimateur",
    subtitle: "Analyses de Marché Pro",
    yourData: "Vos Données",
    followers: "Abonnés",
    avgViews: "Vues Moyennes",
    vidsPerMonth: "Vidéos/Mois",
    niche: "Niche du Contenu",
    calculate: "✦ Mise à jour",
    calculating: "⏳ Calcul...",
    note: "Estimation T1 2025. Taxes et frais de plateforme non inclus.",
    expectedIncome: "Revenu Mensuel Estimé",
    comparedLastMonth: "vs Mois Dernier",
    brandDealsEst: "Estimation:",
    adDeals: "Sponsors",
    crossPlatform: "Comparaison des Plateformes",
    highestCash: "Revenu le Plus Élevé",
    brandDealsLabel: "Sponsors",
    fundLivesLabel: "Fonds/Directs",
    adsenseLabel: "AdSense",
    smartTips: "Conseils Stratégiques",
    tip1Title: "Campagnes de Marque",
    tip1Desc: (total: string) => `Les sponsors apportent env. ${total}. Préparez votre dossier de presse (Media Kit).`,
    tip2Title: "Améliorer l'Audience",
    tip2Desc: (total: string) => `Augmenter vos vues de +10% peut ajouter ${total}/mois au Creator Fund.`,
    tip3Title: "Fidélité de l'Audience",
    tip3Desc: (total: string) => `Vos Lives génèrent ${total}. Faire un direct en plus peut doubler cela.`,
    recommendationTiktok: "Recommandation : Prioriser TikTok",
    recommendationYoutube: "Recommandation : YouTube plus rentable",
    recTiktokDesc: (niche: string, diff: string) => `Pour la niche ${niche}, le TikTok Fund + Lives rapporte ${diff} de plus que YouTube.`,
    recYoutubeDesc: (niche: string, diff: string) => `Les revenus CPM de YouTube pour la niche ${niche} rapportent ${diff} supplémentaires.`,
    liveAnalysis: "Données en direct :",
    middleEast: "Europe / MENA",
    exportData: "Exporter",
    marketPeak: "Pic 2025 Estimé",
    adjustStart: "Paramétrez pour commencer",
    video: "Vidéos",
    excellent: "✨ Excellent",
    good: "👍 Bon",
    low: "📉 Faible",
    engagementRate: "Taux d'engagement:",
    normalPosting: "Rythme classique",
    regularPosting: "Rythme régulier 👍",
    intensePosting: "Rythme intense 🔥",
    themeAria: "Changer le Thème",
    langAria: "Changer de Langue",
    tiktokIncome: "Revenus TikTok",
    youtubeShorts: "YouTube Shorts"
  }
};

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
    <div className="flex justify-between items-end text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
      <span>{label}</span>
      <span className="text-[16px] font-bold text-gray-900 dark:text-white">{display}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
      style={{ accentColor: "#FF004F" }}
    />
    {sublabel && <div className="text-[10px] text-gray-500 mt-1">{sublabel}</div>}
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [theme, setTheme] = useState<Theme>("dark");
  const [adConfig, setAdConfig] = useState<AdConfig>(() => {
    const saved = localStorage.getItem("siteAdConfig");
    return saved ? JSON.parse(saved) : { enabled: true, networkName: "Monetag (Quges)", scriptUrl: "https://quge5.com/88/tag.min.js", zoneId: "249378" };
  });
  const [showAdmin, setShowAdmin] = useState(false);

  const [followers, setFollowers] = useState(100000);
  const [avgViews, setAvgViews] = useState(50000);
  const [nicheId, setNicheId] = useState("entertainment");
  const [vidsPerMonth, setVidsPerMonth] = useState(20);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const getSeoDetails = () => {
      switch(lang) {
        case "ar": return {
          title: "حاسبة أرباح تيك توك | TikTok Earnings Estimator",
          desc: "احسب أرباحك المتوقعة من تيك توك ويوتيوب بناءً على المتابعين والمشاهدات والمجال."
        };
        case "es": return {
          title: "Calculador de Ingresos de TikTok e YouTube",
          desc: "Calcula tus ganancias potenciales de TikTok y YouTube basándote en la base de seguidores, vistas y nicho."
        };
        case "fr": return {
          title: "Estimateur de Revenus TikTok | Simulateur de Gains",
          desc: "Calculez vos revenus potentiels sur TikTok et YouTube en fonction de vos abonnés, vues et thématique."
        };
        case "en":
        default: return {
          title: "TikTok Earnings Estimator & Calculator",
          desc: "Calculate your potential TikTok and YouTube earnings based on your followers, views, and niche."
        };
      }
    };
    
    const seo = getSeoDetails();
    document.title = seo.title;
    
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", seo.desc);
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("siteAdConfig", JSON.stringify(adConfig));

    const scriptId = "dynamic-ad-script";
    const existingScript = document.getElementById(scriptId);

    if (adConfig.enabled) {
      if (!existingScript || existingScript.getAttribute("src") !== adConfig.scriptUrl || existingScript.getAttribute("data-zone") !== adConfig.zoneId) {
        if (existingScript) existingScript.remove();
        
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = adConfig.scriptUrl;
        script.setAttribute("data-zone", adConfig.zoneId);
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        document.head.appendChild(script);
      }
    } else {
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [adConfig]);

  useEffect(() => {
    const checkAdminHash = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true);
        // Remove the hash from URL after checking so it remains hidden
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, []);

  const text = TRANSLATIONS[lang];
  const currentNiches = NICHES[lang];
  const niche = currentNiches.find(n => n.id === nicheId) || currentNiches[0];
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
    <div className="font-sans flex flex-col min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-[#F3F4F6] transition-colors duration-300">
      {/* ── TOP HEADER ── */}
      <header className="w-full glass-panel border-b border-black/5 dark:border-white/5 py-4 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute text-2xl tiktok-glow leading-none">♪</span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight uppercase tracking-tight text-gray-900 dark:text-white">
              TikTok <span className="text-[#FF004F]">{text.appTitle}</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{text.subtitle}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            aria-label={text.themeAria}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button 
            onClick={() => {
              const langs: Lang[] = ["ar", "en", "es", "fr"];
              setLang(langs[(langs.indexOf(lang) + 1) % langs.length]);
            }}
            className="w-10 h-8 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors font-bold text-xs flex items-center justify-center uppercase"
            aria-label={text.langAria}
          >
            {lang}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-73px)]">
        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-[380px] h-full overflow-y-auto glass-panel lg:border-x border-black/5 dark:border-white/5 p-6 lg:p-8 flex flex-col gap-6 relative z-10 shrink-0">
          <div className="space-y-4">
          <SliderInput
            label={text.followers}
            value={followers}
            min={1000} max={10000000} step={1000}
            onChange={setFollowers}
            display={<>
              <span className={`text-[10px] px-2 py-0.5 rounded align-middle border ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} style={{ backgroundColor: tier.color + "22", color: tier.color, borderColor: tier.color + "44" }}>{tier.label}</span>
              <span style={{ color: tier.color }}>{fmtNum(followers)}</span>
            </>}
          />

          <SliderInput
            label={text.avgViews}
            value={avgViews}
            min={500} max={5000000} step={500}
            onChange={setAvgViews}
            display={<span className="text-gray-900 dark:text-white">{fmtNum(avgViews)}</span>}
            sublabel={<>{text.engagementRate} {((avgViews / (followers || 1)) * 100).toFixed(1)}% {((avgViews / (followers || 1)) > 0.1 ? <span className="text-green-500 dark:text-green-400">{text.excellent}</span> : (avgViews / (followers || 1)) > 0.03 ? text.good : text.low)}</>}
          />

          <SliderInput
            label={text.vidsPerMonth}
            value={vidsPerMonth}
            min={1} max={90} step={1}
            onChange={setVidsPerMonth}
            display={<span className="text-gray-700 dark:text-gray-300">{vidsPerMonth} {text.video}</span>}
            sublabel={`${vidsPerMonth <= 7 ? text.normalPosting : vidsPerMonth <= 20 ? text.regularPosting : text.intensePosting}`}
          />

          {/* Niche Selector */}
          <div className="space-y-2 mt-4">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{text.niche}</label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {currentNiches.map(n => {
                const isActive = nicheId === n.id;
                return (
                  <button key={n.id} onClick={() => setNicheId(n.id)}
                    className={`p-3 rounded-lg flex items-center justify-between transition-all ${
                      isActive ? "bg-[#FF004F22] dark:bg-[#FF004F18] border border-[#FF004F] text-[#FF004F] dark:text-white" : "bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-400"
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
          {loading ? text.calculating : text.calculate}
        </button>

        <div className="mt-auto text-[10px] text-gray-500 dark:text-gray-600 border-t border-black/5 dark:border-white/5 pt-4">
          {text.note}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full p-6 lg:p-10 gradient-bg flex flex-col gap-8 relative overflow-y-auto">
        {results && !loading ? (
          <>
            {/* HERO STATS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-4">
              <div className="space-y-1">
                <h2 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-widest">{text.expectedIncome}</h2>
                <div className="text-6xl md:text-7xl font-extrabold tracking-tighter tiktok-glow leading-tight text-gray-900 dark:text-white">
                  {fmtMoney(results.ttTotal)}
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded">
                     <span>▲</span><span>+14.2% {text.comparedLastMonth}</span>
                   </div>
                   <div className="text-xs text-gray-600 dark:text-gray-500 bg-black/5 dark:bg-white/5 px-2 py-1 rounded italic">
                     {text.brandDealsEst} {results.deals} {text.adDeals}
                   </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="glass-panel p-4 rounded-2xl w-32 text-center border border-black/5 dark:border-white/10">
                  <div className="text-[10px] text-gray-500 mb-1">Creator Fund</div>
                  <div className="font-bold text-[#00c5c0] dark:text-[#00F2EA] text-lg">{fmtMoney(results.ttFund)}</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-32 text-center border border-black/5 dark:border-white/10">
                  <div className="text-[10px] text-gray-500 mb-1">Live Gifts</div>
                  <div className="font-bold text-[#8b5cf6] dark:text-[#a78bfa] text-lg">{fmtMoney(results.ttLive)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              
              {/* COMPARISON & BREAKDOWN */}
              <div className="space-y-6">
                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-gray-300 dark:bg-gray-700"></span>{text.crossPlatform}
                </h3>
                
                {/* TikTok Box */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F0F] border border-[#FF004F] dark:border-[#FF004F44] relative overflow-hidden h-full flex flex-col justify-center shadow-sm">
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{text.tiktokIncome}</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{fmtMoney(results.ttTotal)}</span>
                    </div>
                    {ttWins && <span className="text-[10px] font-bold bg-[#FF004F22] text-[#e00045] dark:text-[#FF004F] px-2 py-0.5 rounded-full border border-[#FF004F33]">{text.highestCash}</span>}
                  </div>
                  
                  {/* Progress bar visual */}
                  <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative z-10 mb-4">
                    <div className="h-full bg-gradient-to-l from-[#FF004F] to-[#00F2EA] rounded-full transition-all duration-700" 
                         style={{ width: `${Math.round((results.ttTotal / Math.max(results.ttTotal, results.ytTotal)) * 100)}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 text-[11px] border-t border-black/5 dark:border-white/5 relative z-10">
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">{text.brandDealsLabel}</span><strong className="text-gray-800 dark:text-gray-300">{fmtMoney(results.ttBrand)}</strong></div>
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">{text.fundLivesLabel}</span><strong className="text-gray-800 dark:text-gray-300">{fmtMoney(results.ttFund + results.ttLive)}</strong></div>
                  </div>
                </div>

                {/* YouTube Box */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0F0F0F] border border-black/5 dark:border-white/5 h-full flex flex-col justify-center shadow-sm">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{text.youtubeShorts}</span>
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{fmtMoney(results.ytTotal)}</span>
                    </div>
                    {!ttWins && <span className="text-[10px] font-bold bg-[#FF004F22] text-[#e00045] dark:text-[#FF004F] px-2 py-0.5 rounded-full border border-[#FF004F33]">{text.highestCash}</span>}
                  </div>

                  <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-700" 
                         style={{ width: `${Math.round((results.ytTotal / Math.max(results.ttTotal, results.ytTotal)) * 100)}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 text-[11px] border-t border-black/5 dark:border-white/5">
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">{text.brandDealsLabel}</span><strong className="text-gray-700 dark:text-gray-400">{fmtMoney(results.ytBrand)}</strong></div>
                    <div className="flex flex-col"><span className="text-gray-500 mb-0.5 uppercase tracking-wider">{text.adsenseLabel}</span><strong className="text-gray-700 dark:text-gray-400">{fmtMoney(results.ytAds)}</strong></div>
                  </div>
                </div>
              </div>

              {/* SMART TIPS */}
              <div className="space-y-4">
                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-gray-300 dark:bg-gray-700"></span>{text.smartTips}
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-black/5 dark:border-white/5">
                    <div className="w-12 h-12 bg-[#00c5c015] dark:bg-[#00F2EA11] border border-[#00c5c030] dark:border-[#00F2EA22] rounded-full flex items-center justify-center text-xl shrink-0">🤝</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">{text.tip1Title}</div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {text.tip1Desc(fmtMoney(results.ttBrand))}
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-black/5 dark:border-white/5">
                    <div className="w-12 h-12 bg-[#FF004F11] border border-[#FF004F22] rounded-full flex items-center justify-center text-xl shrink-0">📈</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">{text.tip2Title}</div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {text.tip2Desc(fmtMoney(results.ttFund * 0.1))}
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl flex gap-4 items-center border border-black/5 dark:border-white/5">
                    <div className="w-12 h-12 bg-[#8b5cf615] dark:bg-[#a78bfa11] border border-[#8b5cf630] dark:border-[#a78bfa22] rounded-full flex items-center justify-center text-xl shrink-0">💎</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">{text.tip3Title}</div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {text.tip3Desc(fmtMoney(results.ttLive))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-2xl border ${ttWins ? "bg-[#FF004F0d] border-[#FF004F33]" : "bg-[#ff00000a] dark:bg-[#ff00001a] border-[#ff000033]"}`}>
                  <div className={`text-[11px] font-bold mb-1 ${ttWins ? "text-[#e00045] dark:text-[#FF004F]" : "text-[#d32f2f] dark:text-[#ff6b6b]"}`}>
                    {ttWins ? text.recommendationTiktok : text.recommendationYoutube}
                  </div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {ttWins 
                      ? text.recTiktokDesc(niche.label, fmtMoney(results.ttTotal - results.ytTotal))
                      : text.recYoutubeDesc(niche.label, fmtMoney(results.ytTotal - results.ttTotal))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-black/5 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{text.liveAnalysis} <strong className="text-gray-900 dark:text-white">{niche.label} - {text.middleEast}</strong></span>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="hidden sm:inline-block px-2 py-1 bg-black/5 dark:bg-white/10 rounded text-[10px] text-gray-600 dark:text-gray-300">{text.marketPeak}</span>
                <span className="px-2 py-1 bg-[#FF004F] rounded text-[10px] text-white font-bold cursor-pointer">{text.exportData}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col opacity-40">
            <div className="text-6xl mb-4 tiktok-glow">♪</div>
            <p className="text-sm font-semibold tracking-widest uppercase text-gray-500">{text.adjustStart}</p>
          </div>
        )}
      </main>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-8 w-full max-w-md relative rounded-3xl shadow-2xl">
            <button 
              onClick={() => setShowAdmin(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Settings size={22} className="text-[#FF004F]"/>
              Ads Management
            </h2>
            
            <div className="space-y-6">
              {/* Status Card */}
              <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Ad Network</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{adConfig.networkName || "Unnamed Network"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Status</div>
                  {adConfig.enabled ? (
                    <span className="flex items-center justify-end gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold uppercase"><CheckCircle size={14}/> Active</span>
                  ) : (
                    <span className="flex items-center justify-end gap-1.5 text-red-600 dark:text-red-400 text-xs font-bold uppercase"><XCircle size={14}/> Paused</span>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-2">Network Name</label>
                  <input 
                    type="text" 
                    value={adConfig.networkName}
                    onChange={(e) => setAdConfig({...adConfig, networkName: e.target.value})}
                    placeholder="e.g. Monetag Popunder"
                    className="w-full text-sm p-3 bg-gray-50 dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl focus:border-[#FF004F] outline-none transition-colors dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Ad Script URL</label>
                  <input 
                    type="text" 
                    value={adConfig.scriptUrl}
                    onChange={(e) => setAdConfig({...adConfig, scriptUrl: e.target.value})}
                    placeholder="https://quge5.com/88/tag.min.js"
                    className="w-full text-sm p-3 bg-gray-50 dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl focus:border-[#FF004F] outline-none transition-colors dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Zone ID</label>
                  <input 
                    type="text" 
                    value={adConfig.zoneId}
                    onChange={(e) => setAdConfig({...adConfig, zoneId: e.target.value})}
                    placeholder="249378"
                    className="w-full text-sm p-3 bg-gray-50 dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl focus:border-[#FF004F] outline-none transition-colors dark:text-white"
                  />
                </div>
              </div>

              <button 
                onClick={() => setAdConfig({...adConfig, enabled: !adConfig.enabled})}
                className={`w-full py-4 mt-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md outline-none ${
                  adConfig.enabled 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/30' 
                    : 'bg-gradient-to-r from-[#FF004F] to-[#CC003D] text-white hover:scale-[1.02] active:scale-95'
                }`}
              >
                {adConfig.enabled ? 'Pause Ads' : 'Activate Ads'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
