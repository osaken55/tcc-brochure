import { useState, useCallback, useEffect } from "react";

// ─── Photo URLs (shown on deployed version, CSS fallback in sandbox) ───
const PHOTOS = {
  course1: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/IMG_0653.jpg?v=1658912672",
  lodge: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/190623-0001.jpg?v=1658907789",
  shrine: "https://tsu.co.jp/cdn/shop/t/20/assets/jinja_3000x.jpg",
  hole18: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/18_7472bd06-6a56-4245-baeb-2c33d5749bdc.jpg",
  hole6: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/6_97f4ede8-94fe-483b-b1db-b3d7e73f51e7.jpg",
  bunker: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/a3tsucc013_KEN5069w.jpg",
  scenery: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/tsucc009_KEN4743w.jpg",
  hole9: "https://cdn.shopify.com/s/files/1/0616/2949/7533/files/9.jpg",
};

// CSS gradients as atmospheric fallback
const ATMOSPHERE = {
  dawn:    "linear-gradient(170deg, #1a3c2a 0%, #2d5a3f 30%, #1B4332 70%, #0f2b1e 100%)",
  morning: "linear-gradient(165deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)",
  midday:  "linear-gradient(175deg, #2D6A4F 0%, #52B788 50%, #2D6A4F 100%)",
  golden:  "linear-gradient(160deg, #2D6A4F 0%, #52B788 30%, #C9A84C33 70%, #1B4332 100%)",
  dusk:    "linear-gradient(180deg, #0f2b1e 0%, #1B4332 40%, #2D6A4F 100%)",
  night:   "linear-gradient(170deg, #0a1f15 0%, #1B4332 50%, #0f2b1e 100%)",
  mist:    "linear-gradient(160deg, #1B4332 0%, #2D6A4F 30%, #74C69D22 60%, #1B4332 100%)",
  shrine:  "linear-gradient(170deg, #1B4332 0%, #3a2e1e 40%, #1B4332 80%, #2D6A4F 100%)",
};

const STEP_CONFIG = {
  start:   { photo: "course1", atm: ATMOSPHERE.dawn, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.88) 55%)" },
  y1:      { photo: "hole18",  atm: ATMOSPHERE.morning, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  y2:      { photo: "bunker",  atm: ATMOSPHERE.midday, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 45%)" },
  y3:      { photo: "hole9",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.88) 50%)" },
  y4:      { photo: "scenery", atm: ATMOSPHERE.morning, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  y5:      { photo: "hole6",   atm: ATMOSPHERE.midday, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  y6:      { photo: "lodge",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  bridge:  { photo: "shrine",  atm: ATMOSPHERE.shrine, overlay: "linear-gradient(180deg,rgba(27,67,50,0.2) 0%,rgba(15,43,30,0.9) 50%)" },
  voices:  { photo: null,      atm: ATMOSPHERE.night },
  lead_a:  { photo: "hole6",   atm: ATMOSPHERE.midday, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 45%)" },
  a_exp:   { photo: "hole18",  atm: ATMOSPHERE.morning, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 45%)" },
  a_beg:   { photo: "hole9",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.88) 50%)" },
  lead_b:  { photo: "bunker",  atm: ATMOSPHERE.dusk, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 45%)" },
  b_freq:  { photo: "scenery", atm: ATMOSPHERE.morning, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 45%)" },
  b_occ:   { photo: "lodge",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  lead_c:  { photo: null,      atm: ATMOSPHERE.night },
  c_four:  { photo: null,      atm: ATMOSPHERE.night },
  c_next:  { photo: null,      atm: ATMOSPHERE.night },
  lead_d:  { photo: "lodge",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.1) 0%,rgba(15,43,30,0.85) 50%)" },
  d_small: { photo: "lodge",   atm: ATMOSPHERE.golden, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.88) 50%)" },
  d_large: { photo: "course1", atm: ATMOSPHERE.dawn, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.88) 55%)" },
  lead_e:  { photo: "shrine",  atm: ATMOSPHERE.shrine, overlay: "linear-gradient(180deg,rgba(27,67,50,0.2) 0%,rgba(15,43,30,0.9) 50%)" },
  benefits:{ photo: "hole18",  atm: ATMOSPHERE.morning, overlay: "linear-gradient(180deg,rgba(27,67,50,0.15) 0%,rgba(15,43,30,0.9) 40%)" },
  plan_select: { photo: null,  atm: ATMOSPHERE.night },
  plan_four:   { photo: null,  atm: ATMOSPHERE.night },
  plan_next:   { photo: null,  atm: ATMOSPHERE.night },
  cta:     { photo: "course1", atm: ATMOSPHERE.dawn, overlay: "linear-gradient(180deg,rgba(27,67,50,0.2) 0%,rgba(15,43,30,0.88) 55%)" },
};

// ─── Steps data ───
const STEPS = {
  start: { phase:"opening", title:"津カントリー倶楽部", subtitle:"法人会員権のご案内", choices:[{label:"ご案内をはじめる",next:"y1"}] },
  y1: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"尾崎将司（ジャンボ尾崎）が設計した\n全18ホール、7,023ヤード。\n\n三重県屈指の戦略的コースです。", choices:[{label:"コースを見てみたい",next:"y2"}] },
  y2: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"会員数を限定しているので\n待ち時間も少なく、\nゆったりとプレーできます。\n\n158万㎡の広大な敷地に、\nわずか740名の正会員。", choices:[{label:"なるほど、それは快適ですね",next:"y3"}] },
  y3: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"お料理は冷凍食品を使わない\n手づくりにこだわっています。\n\nプレー後の食事も\n楽しみのひとつです。", choices:[{label:"それはいいですね",next:"y4"}] },
  y4: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"楽天GORAの口コミでも\n高い評価をいただいています。\n\n接客にも力を入れており、\nジャケット着用でお迎えするのが\n私たちのスタイルです。", choices:[{label:"評判がいいんですね",next:"y5"}] },
  y5: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"芝生は農薬を控えめに管理しています。\n\n裸足で歩けるほどの\n安心・安全なコース。\n\n自然と共にあるゴルフ場です。", choices:[{label:"こだわってますね",next:"y6"}] },
  y6: { phase:"yesset", pl:"津カントリー倶楽部のご紹介", body:"コース内にはKATADA Lodge & Villaがあり、\n宿泊も可能です。\n\nゴルフだけで終わらない\n特別な時間をお過ごしいただけます。", choices:[{label:"もっと知りたい",next:"bridge"}] },
  bridge: { phase:"bridge", body:"こんな場所を\n大切な方や社員の方と\n共有できたら——\n\nそう思われたことはありませんか？", choices:[{label:"実は、そう思っていました",next:"voices"}] },
  voices: { phase:"bridge", title:"法人会員をお持ちの\n企業様の声", body:"どれが気になりますか？", choices:[
    {label:"「社員が喜んでいる」",next:"lead_a",icon:"🫀"},
    {label:"「接待に重宝している」",next:"lead_b",icon:"🤝"},
    {label:"「経費で落とせて助かる」",next:"lead_c",icon:"💴"},
    {label:"「研修合宿に最高だった」",next:"lead_d",icon:"🏨"},
    {label:"「チャリティに参加できた」",next:"lead_e",icon:"🌏"},
  ]},
  lead_a: { phase:"leading", mod:"福利厚生・健康経営", title:"社員の心と体を整える\nゴルフ場という福利厚生", body:"無記名4名だから、特定の役員だけでなく\nどの社員でもメンバー料金でプレーできます。\n回数も無制限。家族・取引先も同伴OK。", choices:[{label:"ゴルフ経験者が多い",next:"a_exp"},{label:"初心者が多い",next:"a_beg"}] },
  a_exp: { phase:"leading", mod:"福利厚生・健康経営", title:"社内コンペに最適", body:"年何回でもプレー可能。\n部署対抗戦、新入社員歓迎コンペ、\n忘年コンペなど多彩に活用できます。\n\n1組4名までメンバー料金なので\n取引先を交えたコンペにも。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  a_beg: { phase:"leading", mod:"福利厚生・健康経営", title:"初心者でも安心", body:"「天空塾」でプロのレッスンを\n受けてからコースへ。\n\nエンジェルパークでは\nゴルフをしないご家族も楽しめます。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  lead_b: { phase:"leading", mod:"接待・ビジネス機会", title:"18ホールで築く\n信頼の関係", body:"無記名だから急な接待でも名義変更不要。\n4名枠をその場でアレンジできます。", choices:[{label:"月に1回以上",next:"b_freq"},{label:"年に数回",next:"b_occ"}] },
  b_freq: { phase:"leading", mod:"接待・ビジネス機会", title:"提携コース＆貸切", body:"沖縄・北海道・茨城の提携コースも\nメンバーフィーでプレー可能。\n\n200万円〜でコース貸切も。\n大型接待・取引先コンペに最適です。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  b_occ: { phase:"leading", mod:"接待・ビジネス機会", title:"特別感のあるおもてなし", body:"KATADA Lodge & Villaで\n1泊2日の接待ゴルフ。\n\n昼はラウンド、夜は宴会場で懇親会。\nすべて施設内で完結します。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  lead_c: { phase:"leading", mod:"経費処理メリット", title:"経理が喜ぶ\n明快な費用構造", body:"年会費・プレー代・飲食代は\nすべて交際費として損金算入可能。\n\n中小企業なら年間800万円枠の中で処理できます。", choices:[{label:"毎年経費にしたい",next:"c_four"},{label:"初期投資OK、ランニング重視",next:"c_next"}] },
  c_four: { phase:"leading", mod:"経費処理メリット", title:"年払いプラン", pn:"フォーリーブス", det:{initial:"80万円",note:"登録料40万＋年会費40万（税別）",annual:"40万円/年",tax:"全額 → 交際費（損金算入）",fit:"まず1年試したい・毎年経費にしたい企業様に"}, choices:[{label:"会員特典を見る",next:"benefits"}] },
  c_next: { phase:"leading", mod:"経費処理メリット", title:"一括プラン", pn:"次世代会員権", det:{initial:"312万円",note:"入会金300万＋年会費12万（税別）",annual:"12万円/年",tax:"入会金→資産計上 / 年会費→交際費",fit:"長期的に活用・ランニングを抑えたい企業様に"}, choices:[{label:"会員特典を見る",next:"benefits"}] },
  lead_d: { phase:"leading", mod:"リトリート・研修", title:"ゴルフ場は\n最高の「オフサイト」", body:"日常から離れた環境でチームの絆を深める。\nそんな使い方が増えています。", choices:[{label:"16名まで",next:"d_small"},{label:"16名以上",next:"d_large"}] },
  d_small: { phase:"leading", mod:"リトリート・研修", title:"少人数リトリート", body:"KATADA Lodge & Villaで1泊2日。\n\n午前：到着\n午後：ラウンド or 戦略会議\n夜 ：懇親ディナー\n翌朝：ラウンド＆解散\n\n送迎バスも手配可能（12名以上）。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  d_large: { phase:"leading", mod:"リトリート・研修", title:"大規模オフサイト", body:"宴会場3室・最大64名収容。\n200万円〜でコース貸切も可能。\n御社だけの特別な1日を。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  lead_e: { phase:"leading", mod:"地域連携・CSR", title:"ゴルフを通じた社会貢献", body:"🏅 チャレンジドゴルフ（毎年11月3日）\n　全国身体障がい者ゴルフ大会\n\n⚓ Marine Cup（毎年夏）\n　海難遺児チャリティコンペ\n\n🌺 三重・沖縄ファミリーゴルフ交流会\n\n御社のCSR報告書に記載できる実績が\n自然と生まれます。", choices:[{label:"会員特典を見る",next:"benefits"}] },
  benefits: { phase:"closing", title:"充実の会員特典", bl:["1組4名様までメンバー料金","プレー回数 無制限","乗用カート（GPSナビ付）","KATADA Lodge & Villa 宿泊","天空塾（レッスン）","コース貸切（200万円〜）","送迎バス（12名以上）","提携コース メンバーフィー"], choices:[{label:"料金プランを見る",next:"plan_select"}] },
  plan_select: { phase:"closing", title:"お支払い方法も\nお選びいただけます", plans:true, choices:[{label:"まず1年試してみたい",next:"plan_four"},{label:"長期で活用したい",next:"plan_next"},{label:"もう少し詳しく聞きたい",next:"cta"}] },
  plan_four: { phase:"closing", title:"年払いプラン", pn:"フォーリーブス", det:{initial:"80万円",note:"登録料40万＋年会費40万（税別）",annual:"40万円/年",tax:"全額 → 交際費（損金算入）",fit:"まず1年試したい・毎年経費にしたい企業様に"}, choices:[{label:"体験プレーを予約する",next:"cta"}] },
  plan_next: { phase:"closing", title:"一括プラン", pn:"次世代会員権", det:{initial:"312万円",note:"入会金300万＋年会費12万（税別）",annual:"12万円/年",tax:"入会金→資産計上 / 年会費→交際費",fit:"長期的に活用・ランニングを抑えたい企業様に"}, choices:[{label:"体験プレーを予約する",next:"cta"}] },
  cta: { phase:"cta", title:"まずは一度、\nプレーにいらしてください。", body:"コースを歩けば、\n数字では伝わらない価値を\n体感していただけます。", contact:true, choices:[{label:"最初からもう一度",next:"start"}] },
};

// ─── Components ───
function PlanCard({ d }) {
  return (
    <div style={{ background:"rgba(0,0,0,0.3)", backdropFilter:"blur(16px)", borderRadius:16, padding:"24px 28px", border:"1px solid rgba(255,255,255,0.1)", marginTop:16 }}>
      <div style={{ fontSize:48, fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, lineHeight:1 }}>{d.initial}</div>
      <div style={{ fontSize:12, opacity:0.5, marginTop:6 }}>{d.note}</div>
      <div style={{ marginTop:20, display:"grid", gap:10 }}>
        {[["翌年以降",d.annual],["税務処理",d.tax]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", gap:12, fontSize:13 }}>
            <span style={{ opacity:0.4, minWidth:64 }}>{k}</span>
            <span style={{ fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.06)", fontSize:12, opacity:0.7 }}>{d.fit}</div>
    </div>
  );
}

// Texture overlay for depth
function TextureOverlay() {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2, pointerEvents:"none", opacity:0.03,
      backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }} />
  );
}

export default function App() {
  const [cur, setCur] = useState("start");
  const [hist, setHist] = useState(["start"]);
  const [anim, setAnim] = useState(false);
  const [vis, setVis] = useState(true);
  const [photoAvailable, setPhotoAvailable] = useState({});

  const step = STEPS[cur];
  const cfg = STEP_CONFIG[cur] || { atm: ATMOSPHERE.night };

  // Try loading photo, fallback to CSS
  useEffect(() => {
    if (cfg.photo && !photoAvailable[cfg.photo]) {
      const img = new Image();
      img.onload = () => setPhotoAvailable(p => ({...p, [cfg.photo]: true}));
      img.onerror = () => setPhotoAvailable(p => ({...p, [cfg.photo]: false}));
      img.src = PHOTOS[cfg.photo];
    }
  }, [cur, cfg.photo]);

  const hasPhoto = cfg.photo && photoAvailable[cfg.photo];

  const go = useCallback((next) => {
    if (anim) return;
    setAnim(true); setVis(false);
    setTimeout(() => {
      setCur(next); next === "start" ? setHist(["start"]) : setHist(h => [...h, next]);
      setVis(true); setAnim(false);
    }, 450);
  }, [anim]);

  const back = useCallback(() => {
    if (hist.length <= 1 || anim) return;
    setAnim(true); setVis(false);
    setTimeout(() => {
      const nh = hist.slice(0, -1); setHist(nh); setCur(nh[nh.length - 1]);
      setVis(true); setAnim(false);
    }, 450);
  }, [hist, anim]);

  const progress = Math.min(hist.length / 16, 1);
  const isOpen = step.phase === "opening";
  const isCta = step.phase === "cta";

  return (
    <div style={{ minHeight:"100vh", color:"#fff", position:"relative", overflow:"hidden",
      fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", display:"flex", flexDirection:"column" }}>

      {/* BG: Photo or CSS gradient */}
      <div key={cur + "-bg"} style={{
        position:"fixed", inset:0, zIndex:0,
        background: hasPhoto ? `url(${PHOTOS[cfg.photo]}) center/cover no-repeat` : cfg.atm,
        transition: "opacity 0.8s ease",
        opacity: vis ? 1 : 0.7,
      }} />
      {/* Overlay */}
      {cfg.overlay && (
        <div style={{ position:"fixed", inset:0, zIndex:1, background: cfg.overlay }} />
      )}
      {/* Fallback overlay for non-photo */}
      {!hasPhoto && !cfg.overlay && (
        <div style={{ position:"fixed", inset:0, zIndex:1,
          background:"radial-gradient(ellipse at 30% 20%, rgba(82,183,136,0.08) 0%, transparent 60%)" }} />
      )}
      <TextureOverlay />

      {/* Header */}
      <div style={{ position:"relative", zIndex:10, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={back} disabled={hist.length<=1} style={{
          background:"none", border:"none", color:"#fff", fontSize:13, padding:"8px 4px",
          opacity:hist.length<=1?0.15:0.6, cursor:hist.length<=1?"default":"pointer",
          fontFamily:"inherit", transition:"opacity 0.3s",
        }}>← 戻る</button>
        <div style={{ fontSize:10, opacity:0.4, letterSpacing:3, fontWeight:500 }}>津カントリー倶楽部</div>
      </div>

      {/* Progress */}
      <div style={{ position:"relative", zIndex:10, padding:"0 20px", marginBottom:4 }}>
        <div style={{ height:2, background:"rgba(255,255,255,0.1)", borderRadius:1 }}>
          <div style={{ height:"100%", background:"#C9A84C", width:`${progress*100}%`, transition:"width 0.5s ease", borderRadius:1 }} />
        </div>
        {step.pl && <div style={{ fontSize:9, marginTop:5, opacity:0.3, letterSpacing:2 }}>{step.pl}</div>}
      </div>

      {/* Content */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end",
        padding: isOpen ? "0 24px 48px" : "0 24px 28px",
        maxWidth:540, width:"100%", margin:"0 auto",
        position:"relative", zIndex:10,
        opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)",
        transition:"opacity 0.45s ease, transform 0.45s ease",
      }}>
        {/* Module badge */}
        {step.mod && (
          <div style={{
            display:"inline-block", padding:"4px 14px", borderRadius:20,
            background:"rgba(82,183,136,0.45)", backdropFilter:"blur(8px)",
            fontSize:10, letterSpacing:1.5, marginBottom:12, alignSelf:"flex-start",
            border:"1px solid rgba(82,183,136,0.25)",
          }}>{step.mod}</div>
        )}

        {/* Plan name */}
        {step.pn && <div style={{ fontSize:12, opacity:0.5, letterSpacing:3, marginBottom:4 }}>{step.pn}</div>}

        {/* Title */}
        {step.title && (
          <h1 style={{
            fontFamily:"'Playfair Display',Georgia,'Noto Serif JP',serif",
            fontSize: isOpen ? 38 : 26, fontWeight:700, lineHeight:1.35,
            margin:"0 0 12px", whiteSpace:"pre-line",
            textShadow:"0 2px 24px rgba(0,0,0,0.3)",
          }}>{step.title}</h1>
        )}

        {/* Subtitle */}
        {step.subtitle && (
          <div style={{ fontSize:14, opacity:0.6, fontWeight:300, letterSpacing:3, marginBottom:24 }}>{step.subtitle}</div>
        )}

        {/* Body */}
        {step.body && (
          <p style={{
            fontSize:14, lineHeight:1.95, opacity:0.85, margin:"0 0 16px",
            whiteSpace:"pre-line", fontWeight:300,
            textShadow:"0 1px 8px rgba(0,0,0,0.15)",
          }}>{step.body}</p>
        )}

        {/* Plan detail */}
        {step.det && <PlanCard d={step.det} />}

        {/* Benefits */}
        {step.bl && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {step.bl.map((b,i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:8, padding:"11px 12px",
                borderRadius:10, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(12px)",
                fontSize:12, fontWeight:500, border:"1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ color:"#B7E4C7", flexShrink:0 }}>✓</span>{b}
              </div>
            ))}
          </div>
        )}

        {/* Plans comparison */}
        {step.plans && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              { name:"フォーリーブス", sub:"年払い", price:"80万円", n:"翌年40万/年\n全額損金算入" },
              { name:"次世代会員権", sub:"一括", price:"312万円", n:"翌年12万/年" },
            ].map(p => (
              <div key={p.name} style={{ padding:"18px 14px", borderRadius:14, textAlign:"center",
                background:"rgba(0,0,0,0.3)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:9, opacity:0.4, letterSpacing:1.5 }}>{p.sub}</div>
                <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>{p.name}</div>
                <div style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, marginTop:8 }}>{p.price}</div>
                <div style={{ fontSize:11, opacity:0.5, marginTop:6, whiteSpace:"pre-line", lineHeight:1.4 }}>{p.n}</div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        {step.contact && (
          <div style={{ padding:"20px 24px", borderRadius:14, marginBottom:16,
            background:"rgba(0,0,0,0.3)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>津カントリー倶楽部</div>
            <div style={{ fontSize:12, opacity:0.6, lineHeight:1.9 }}>
              〒514-0082 三重県津市片田田中町29<br/>TEL: 059-237-3131 / 予約: 0120-80-3700<br/>https://tsu.co.jp/
            </div>
          </div>
        )}

        {/* Choices */}
        <div style={{ display:"grid", gap:8, marginTop:8 }}>
          {step.choices.map((c,i) => {
            const single = step.choices.length === 1;
            const pri = single || isCta;
            return (
              <button key={i} onClick={()=>go(c.next)} style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                padding:"14px 20px", borderRadius:12, fontFamily:"inherit", fontSize:14, lineHeight:1.4,
                border: pri?"none":"1px solid rgba(255,255,255,0.2)",
                background: pri?"rgba(201,168,76,0.92)":"rgba(255,255,255,0.07)",
                color: pri?"#1B4332":"#fff", fontWeight: pri?700:400,
                cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease",
                textAlign: cur==="voices"?"left":"center",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.background=pri?"rgba(201,168,76,1)":"rgba(255,255,255,0.13)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background=pri?"rgba(201,168,76,0.92)":"rgba(255,255,255,0.07)";}}
              >
                {c.icon && <span style={{fontSize:18}}>{c.icon}</span>}
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ position:"relative", zIndex:10, padding:"10px 20px", textAlign:"center", fontSize:9, opacity:0.2, letterSpacing:1.5 }}>
        © 津カントリー倶楽部
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
    </div>
  );
}
