import React, { useEffect, useState } from 'react';

const COLORS = {
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  ink: '#111827',
  muted: '#6B7280',
  subtle: '#9CA3AF',
  line: '#E5E7EB',
  delete: '#EF4444',
  favorite: '#F59E0B',
  skip: '#9CA3AF',
  undo: '#14B8A6',
  bg: '#F3F5F8',
  card: '#FFFFFF',
  stage: '#7C3AED',
  stageSoft: '#EDE9FE',
  success: '#16A34A',
};

const SHADOW = {
  card: '0 8px 24px rgba(15,23,42,0.08)',
  raised: '0 18px 44px rgba(15,23,42,0.18)',
  soft: '0 2px 10px rgba(15,23,42,0.06)',
};

type IconName = 'home' | 'star' | 'chart' | 'settings' | 'camera' | 'phone' | 'download' | 'trash' | 'skip' | 'undo' | 'pin' | 'tray' | 'plus' | 'plane' | 'users' | 'briefcase';

const iconPaths: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-3" /></>,
  settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.8 1.8 0 0 0-2.1.3 1.7 1.7 0 0 0-.5 1.4H9a1.7 1.7 0 0 0-.5-1.4 1.8 1.8 0 0 0-2.1-.3l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.2-1V10a1.7 1.7 0 0 0 1.2-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.8 1.8 0 0 0 2.1-.3A1.7 1.7 0 0 0 9 2h6a1.7 1.7 0 0 0 .5 1.4 1.8 1.8 0 0 0 2.1.3l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.2 1v4a1.7 1.7 0 0 0-1.2 1Z" /></>,
  camera: <><path d="M4 8h4l1.4-2h5.2L16 8h4v11H4z" /><circle cx="12" cy="13.5" r="3.2" /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.4" /><path d="M10.5 18.5h3" /></>,
  download: <><path d="M12 3v11" /><path d="m7.5 9.5 4.5 4.5 4.5-4.5" /><path d="M5 20h14" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M7 7l1 14h8l1-14" /><path d="M10.5 11v6" /><path d="M13.5 11v6" /></>,
  skip: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  undo: <><path d="M9 7H4v5" /><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.7" /></>,
  pin: <><path d="m14 3 7 7-3 1-4 4 .5 5.5L9 15l-4 4-1-1 4-4-5.5-5.5L8 9l4-4z" /></>,
  tray: <><path d="M4 14h4l2 3h4l2-3h4" /><path d="M4 14V5h16v9" /><path d="M4 14v5h16v-5" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  plane: <><path d="M21 3 10 14" /><path d="m21 3-7 18-4-7-7-4z" /></>,
  users: <><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0" /><path d="M17 11a3 3 0 1 0 0-6" /><path d="M16.5 15.5A5.5 5.5 0 0 1 21.5 21" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2" /><path d="M3 12h18" /></>,
};

const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 2 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {iconPaths[name]}
  </svg>
);

const photoPalettes = [
  ['#0F766E', '#5EEAD4', '#F0FDFA'],
  ['#1D4ED8', '#93C5FD', '#EFF6FF'],
  ['#7C2D12', '#FDBA74', '#FFF7ED'],
  ['#6D28D9', '#C4B5FD', '#F5F3FF'],
  ['#166534', '#86EFAC', '#F0FDF4'],
  ['#BE123C', '#FDA4AF', '#FFF1F2'],
  ['#334155', '#CBD5E1', '#F8FAFC'],
];

const PhotoThumb = ({ index, width = '100%', height = 80, radius = 12, children }: { index: number; width?: number | string; height?: number | string; radius?: number; children?: React.ReactNode }) => {
  const [a, b, c] = photoPalettes[index % photoPalettes.length];
  return (
    <div style={{ width, height, borderRadius: radius, background: `linear-gradient(145deg, ${a}, ${b} 56%, ${c})`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: '-10%', right: '-10%', bottom: '-22%', height: '58%', background: 'rgba(255,255,255,0.22)', borderRadius: '50% 50% 0 0' }} />
      <div style={{ position: 'absolute', left: 14, bottom: 12, width: '42%', height: '34%', background: 'rgba(15,23,42,0.18)', clipPath: 'polygon(0 100%, 45% 18%, 72% 58%, 100% 8%, 100% 100%)' }} />
      <div style={{ position: 'absolute', right: 16, top: 14, width: 18, height: 18, borderRadius: 999, background: 'rgba(255,255,255,0.58)' }} />
      {children}
    </div>
  );
};

const StyleTag = () => (
  <style>{`
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes cardOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.8) translateY(-100px); } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    .prototype-stage { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg,#DCE6F4,#F8FAFC); padding: 16px; }
    .phone-shell { width: 395px; height: 790px; background: #0B1220; border-radius: 42px; padding: 10px; box-shadow: 0 28px 80px rgba(15,23,42,0.34); position: relative; }
    .phone-screen { width: 100%; height: 100%; border-radius: 31px; overflow: hidden; background: ${COLORS.bg}; position: relative; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: ${COLORS.ink}; }
    @media (max-width: 520px) {
      .prototype-stage { display: block; min-height: 100vh; padding: 0; background: ${COLORS.bg}; }
      .phone-shell { width: 100vw; height: 100vh; padding: 0; border-radius: 0; box-shadow: none; background: ${COLORS.bg}; }
      .phone-screen { border-radius: 0; }
    }
  `}</style>
);

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="prototype-stage">
    <div className="phone-shell">
      <div className="phone-screen">
        {children}
      </div>
    </div>
  </div>
);

const StatusBar = () => (
  <div style={{ height: 30, background: 'rgba(255,255,255,0.92)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 18px', fontSize: 11, color: COLORS.ink, fontWeight: 700 }}>
    <span>9:41</span>
    <span style={{ width: 62, height: 16, background: '#0F172A', borderRadius: 12 }}></span>
    <span style={{ letterSpacing: 1 }}>5G 88%</span>
  </div>
);

const BottomNav = ({ active, onNav }: { active: string; onNav: (p: number) => void }) => (
  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'rgba(255,255,255,0.96)', display: 'flex', borderTop: `1px solid ${COLORS.line}`, boxShadow: '0 -10px 30px rgba(15,23,42,0.06)' }}>
    {[
      { icon: 'home' as IconName, label: '首页', page: 2 },
      { icon: 'star' as IconName, label: '精选集', page: 5 },
      { icon: 'chart' as IconName, label: '统计', page: 7 },
      { icon: 'settings' as IconName, label: '设置', page: 8 },
    ].map(item => (
      <div key={item.label} onClick={() => onNav(item.page)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: active === item.label ? COLORS.primary : COLORS.subtle, fontSize: 10, gap: 3 }}>
        <span style={{ width: 34, height: 28, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active === item.label ? COLORS.primarySoft : 'transparent' }}><Icon name={item.icon} size={19} /></span>
        <span style={{ fontWeight: active === item.label ? 700 : 500 }}>{item.label}</span>
      </div>
    ))}
  </div>
);

// Page 1: 启动扫描页
const ScanPage = ({ onNext }: { onNext: () => void }) => {
  useEffect(() => { const t = setTimeout(onNext, 5000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <div style={{ width: 118, height: 118, borderRadius: 34, background: `linear-gradient(145deg, ${COLORS.primary}, #60A5FA)`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 14, boxShadow: SHADOW.raised, marginBottom: 28 }}>
          {[0, 1, 2, 3].map(i => <PhotoThumb key={i} index={i} height="100%" radius={14} />)}
        </div>
        <h2 style={{ margin: 0, color: COLORS.ink, fontSize: 24, fontWeight: 800 }}>相册整理</h2>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: '8px 0 26px' }}>正在读取 2,847 个媒体文件</p>
        <div style={{ width: 220, height: 8, borderRadius: 8, background: '#E5E7EB', overflow: 'hidden' }}>
          <div style={{ width: '68%', height: '100%', borderRadius: 8, background: `linear-gradient(90deg, ${COLORS.primary}, #38BDF8)`, animation: 'pulse 1.4s ease-in-out infinite' }} />
        </div>
        <p style={{ color: COLORS.subtle, fontSize: 12, marginTop: 24, textAlign: 'center', lineHeight: 1.6 }}>正在进行基础分组<br />所有数据仅在本地处理</p>
        <button onClick={onNext} style={{ marginTop: 24, padding: '10px 28px', background: COLORS.card, color: COLORS.primary, border: `1px solid ${COLORS.line}`, borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: SHADOW.soft }}>跳过</button>
      </div>
    </div>
  );
};

// Page 2: 分组结果展示页
const HomePage = ({ onNav, onGroup }: { onNav: (p: number) => void; onGroup: () => void }) => {
  const [expanded, setExpanded] = useState<number | null>(0);
  const categories = [
    { icon: 'camera' as IconName, name: '相机拍摄', count: 1245, size: '620MB', color: '#2563EB', groups: [{ name: '2026-06-20 毕业典礼', count: 32 }, { name: '2026-06-18 周末聚餐', count: 18 }, { name: '2026-06-15 公园散步', count: 24 }] },
    { icon: 'phone' as IconName, name: '截图', count: 856, size: '430MB', color: '#7C3AED', groups: [{ name: '微信截图', count: 234 }, { name: '微博截图', count: 156 }, { name: '浏览器截图', count: 89 }] },
    { icon: 'download' as IconName, name: '下载图片', count: 746, size: '210MB', color: '#0F766E', groups: [{ name: '表情包/趣图', count: 312 }, { name: '风景/建筑', count: 178 }, { name: '文字/文档', count: 98 }] },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: '14px 18px 8px', background: 'rgba(255,255,255,0.92)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700 }}>今天</div>
            <div style={{ fontSize: 24, fontWeight: 850, color: COLORS.ink }}>相册整理</div>
          </div>
          <button onClick={() => onNav(8)} style={{ width: 38, height: 38, borderRadius: 19, border: `1px solid ${COLORS.line}`, background: COLORS.card, boxShadow: SHADOW.soft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="settings" size={18} color={COLORS.ink} /></button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 60 }}>
        <div style={{ margin: 16, padding: 18, background: 'linear-gradient(135deg,#1E3A8A,#2563EB 58%,#38BDF8)', borderRadius: 24, color: '#fff', boxShadow: SHADOW.raised }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.86, fontWeight: 700 }}>待整理</div>
              <div style={{ fontSize: 28, fontWeight: 850, marginTop: 4 }}>2,847 张</div>
            </div>
            <div style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontSize: 12, fontWeight: 800 }}>1.2GB</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {['照片 1,245', '截图 856', '下载 746'].map(item => <div key={item} style={{ flex: 1, padding: '8px 6px', borderRadius: 12, background: 'rgba(255,255,255,0.14)', fontSize: 11, textAlign: 'center', fontWeight: 700 }}>{item}</div>)}
          </div>
        </div>
        {categories.map((cat, i) => (
          <div key={i} style={{ margin: '0 16px 10px', background: COLORS.card, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
            <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ width: 40, height: 40, borderRadius: 14, background: `${cat.color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}><Icon name={cat.icon} size={20} color={cat.color} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.ink }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{cat.count} 张 · {cat.size}</div>
              </div>
              <span style={{ transform: expanded === i ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', color: COLORS.subtle }}>›</span>
            </div>
            {expanded === i && (
              <div style={{ borderTop: `1px solid ${COLORS.line}` }}>
                {cat.groups.map((g, j) => (
                  <div key={j} onClick={() => onGroup()} style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: j < cat.groups.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <PhotoThumb index={j + i * 3} width={38} height={38} radius={10} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.subtle, marginTop: 2 }}>{g.count} 张</div>
                    </div>
                    <span style={{ color: COLORS.subtle }}>›</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="首页" onNav={onNav} />
    </div>
  );
};

// Page 3: 卡片滑动决策页
type StagedPhoto = { id: number; hue: number };
type ActionRecord = { action: 'del' | 'skip' | 'fav' | 'stage'; photoIndex: number; stagedId?: number; collection?: string };
type DragState = { active: boolean; startX: number; startY: number; dx: number; dy: number };

const CardSwipePage = ({ onBack, stagedPhotos, onStage, onRemoveStaged, onNav, actionBarEnabled }: {
  onBack: () => void;
  stagedPhotos: StagedPhoto[];
  onStage: (photo: StagedPhoto) => void;
  onRemoveStaged: (id: number) => void;
  onNav: (p: number) => void;
  actionBarEnabled: boolean;
}) => {
  const [current, setCurrent] = useState(3);
  const [animating, setAnimating] = useState(false);
  const [exitTransform, setExitTransform] = useState('');
  const [stagingExpanded, setStagingExpanded] = useState(false);
  const [showDeleteTip, setShowDeleteTip] = useState(false);
  const [skipDeleteTip, setSkipDeleteTip] = useState(false);
  const [showFavTray, setShowFavTray] = useState(false);
  const [history, setHistory] = useState<ActionRecord[]>([]);
  const [drag, setDrag] = useState<DragState>({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [toast, setToast] = useState('');
  const total = 32;

  const getPhoto = (index = current): StagedPhoto => ({ id: index, hue: index * 30 });
  const currentPhoto = getPhoto();
  const isPinned = pinnedIds.includes(currentPhoto.id);

  const getDirection = (dx: number, dy: number) => {
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 60) return '';
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'undo' : 'skip') : (dy > 0 ? 'fav' : 'del');
  };

  const direction = getDirection(drag.dx, drag.dy);
  const actionLabels: Record<string, string> = { del: '删除', fav: '加入精选集', skip: '跳过', undo: '撤回' };
  const actionColors: Record<string, string> = { del: COLORS.delete, fav: COLORS.favorite, skip: COLORS.skip, undo: COLORS.undo };
  const actionNames: Record<ActionRecord['action'], string> = { del: '删除', fav: '加入精选集', skip: '跳过', stage: '暂存' };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 1400);
  };

  const advanceCard = (record?: ActionRecord, transform?: string) => {
    if (record) setHistory(prev => [...prev, record]);
    setExitTransform(transform || 'scale(0.88) translateY(-80px)');
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setExitTransform('');
      setCurrent(c => Math.min(c + 1, total));
    }, 280);
  };

  const confirmDelete = () => {
    setSkipDeleteTip(true);
    setShowDeleteTip(false);
    advanceCard({ action: 'del', photoIndex: current }, 'translateY(-140px) scale(0.9)');
  };

  const undoAction = () => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (!last) {
        showToast('没有可撤回的操作');
        return prev;
      }
      if (last.action === 'stage' && last.stagedId) {
        onRemoveStaged(last.stagedId);
        setPinnedIds(ids => ids.filter(id => id !== last.stagedId));
      }
      setCurrent(last.photoIndex);
      showToast(`已撤回${actionNames[last.action]}`);
      return prev.slice(0, -1);
    });
  };

  const doAction = (action: string) => {
    if (action === 'undo') { undoAction(); return; }
    if (action === 'del' && !skipDeleteTip) { setShowDeleteTip(true); return; }
    if (action === 'fav') { setShowFavTray(true); return; }
    if (action === 'stage') {
      togglePin();
      return;
    }
    if (action === 'skip') {
      advanceCard({ action: 'skip', photoIndex: current }, 'translateX(-160px) rotate(-8deg)');
      return;
    }
    if (action === 'del') {
      advanceCard({ action: 'del', photoIndex: current }, 'translateY(-140px) scale(0.9)');
    }
  };

  const togglePin = () => {
    if (isPinned) {
      setPinnedIds(prev => prev.filter(id => id !== currentPhoto.id));
      onRemoveStaged(currentPhoto.id);
      return;
    }
    setPinnedIds(prev => [...prev, currentPhoto.id]);
    onStage(currentPhoto);
    advanceCard({ action: 'stage', photoIndex: current, stagedId: currentPhoto.id }, 'scale(0.9) translateY(110px)');
  };

  const handleFavPick = (collection: string) => {
    setShowFavTray(false);
    advanceCard({ action: 'fav', photoIndex: current, collection }, 'translateY(140px) scale(0.9)');
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (animating || showDeleteTip || showFavTray) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ active: true, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    setDrag(d => ({ ...d, dx: e.clientX - d.startX, dy: e.clientY - d.startY }));
  };

  const onPointerUp = () => {
    if (!drag.active) return;
    const nextAction = getDirection(drag.dx, drag.dy);
    setDrag({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
    if (nextAction) doAction(nextAction);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(255,255,255,0.94)', borderBottom: `1px solid ${COLORS.line}` }}>
        <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 17, border: `1px solid ${COLORS.line}`, background: COLORS.card, cursor: 'pointer', marginRight: 10 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.ink }}>毕业典礼</div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 1 }}>2026-06-20 · {current}/{total}</div>
        </div>
        <div style={{ minWidth: 52, height: 28, borderRadius: 14, background: COLORS.primarySoft, color: COLORS.primary, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Math.round((current / total) * 100)}%</div>
      </div>
      {/* Thumbnail strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', gap: 6, background: 'rgba(255,255,255,0.94)', borderBottom: `1px solid ${COLORS.line}` }}>
        {Array.from({ length: 8 }, (_, i) => i).map((_, i) => (
          <div key={i} style={{ width: 30, height: 30, borderRadius: 5, background: `linear-gradient(135deg, hsl(${i * 40 + 100}, 50%, 65%), hsl(${i * 40 + 130}, 50%, 75%))`, border: i === 3 ? `2px solid ${COLORS.primary}` : '2px solid transparent', transition: 'border 0.2s' }}></div>
        ))}
      </div>
      {/* Main card area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
        <span style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', fontSize: 10, color: COLORS.subtle, fontWeight: 650, opacity: 0.72, writingMode: 'vertical-rl' }}>跳过</span>
        <span style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', fontSize: 10, color: COLORS.subtle, fontWeight: 650, opacity: 0.72, writingMode: 'vertical-rl' }}>撤回</span>
        <span style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: COLORS.subtle, fontWeight: 650, opacity: 0.72 }}>上划删除</span>
        <span style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: COLORS.subtle, fontWeight: 650, opacity: 0.72 }}>下划加入精选集</span>
        {direction && (
          <div style={{ position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', borderRadius: 18, background: actionColors[direction], color: '#fff', fontSize: 13, fontWeight: 700, zIndex: 2 }}>{actionLabels[direction]}</div>
        )}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ width: '82%', height: '70%', background: COLORS.card, borderRadius: 26, boxShadow: SHADOW.raised, display: 'flex', flexDirection: 'column', overflow: 'hidden', opacity: animating ? 0 : 1, transform: animating ? exitTransform : `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 18}deg)`, transition: drag.active ? 'none' : 'all 0.25s ease', touchAction: 'none', cursor: drag.active ? 'grabbing' : 'grab', border: '1px solid rgba(255,255,255,0.8)' }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <PhotoThumb index={current} height="100%" radius={0} />
            <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); togglePin(); }} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, border: `2px solid ${COLORS.stage}`, background: isPinned ? COLORS.stage : 'rgba(255,255,255,0.78)', color: isPinned ? '#fff' : COLORS.stage, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: SHADOW.soft, backdropFilter: 'blur(10px)' }}><Icon name="pin" size={17} color={isPinned ? '#fff' : COLORS.stage} /></button>
          </div>
          <div style={{ padding: '14px 16px', borderTop: `1px solid ${COLORS.line}`, background: COLORS.card }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink }}>IMG_20260620_{current}42.jpg</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>3.2MB · 2026-06-20 14:32</div>
          </div>
        </div>
      </div>
      {/* Staging bar */}
      <div style={{ margin: '0 14px 10px', background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: SHADOW.card, overflow: 'hidden', transition: 'all 0.3s ease', border: `1px solid ${COLORS.line}` }}>
        {/* Collapsed header */}
        <div onClick={() => setStagingExpanded(!stagingExpanded)} style={{ height: 46, display: 'flex', alignItems: 'center', padding: '0 14px', cursor: 'pointer' }}>
          <span style={{ color: COLORS.stage, display: 'flex' }}><Icon name="tray" size={18} /></span>
          <span style={{ fontSize: 13, fontWeight: 800, marginLeft: 6, color: COLORS.ink }}>暂存栏</span>
          {stagedPhotos.length > 0 && (
            <span style={{ marginLeft: 6, background: COLORS.stage, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, minWidth: 16, textAlign: 'center' }}>{stagedPhotos.length}</span>
          )}
          <span style={{ flex: 1 }}></span>
          {stagingExpanded && (
            <span onClick={(e) => { e.stopPropagation(); onNav(6); }} style={{ fontSize: 11, color: COLORS.primary, cursor: 'pointer', padding: '3px 8px', background: `${COLORS.primary}15`, borderRadius: 6 }}>进入筛选</span>
          )}
          <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{stagingExpanded ? '▼' : '▲'}</span>
        </div>
        {/* Expanded content */}
        {stagingExpanded && (
          <div style={{ padding: '0 14px 10px', borderTop: '1px solid #f0f0f0' }}>
            {stagedPhotos.length === 0 ? (
              <div style={{ padding: '12px 0', textAlign: 'center', fontSize: 12, color: '#aaa' }}>点击卡片右上角钉住图标将照片添加到暂存栏</div>
            ) : (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 0' }}>
                {stagedPhotos.map(photo => (
                  <div key={photo.id} style={{ position: 'relative', flexShrink: 0 }}>
                    <PhotoThumb index={photo.id} width={44} height={44} radius={8} />
                    <div onClick={(e) => { e.stopPropagation(); onRemoveStaged(photo.id); }} style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, background: COLORS.delete, color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {actionBarEnabled && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '2px 0 18px' }}>
          {[
            { icon: 'trash' as IconName, color: COLORS.delete, action: 'del' },
            { icon: 'skip' as IconName, color: COLORS.skip, action: 'skip' },
            { icon: 'star' as IconName, color: COLORS.favorite, action: 'fav' },
            { icon: 'undo' as IconName, color: COLORS.undo, action: 'undo' },
          ].map(btn => (
            <div key={btn.action} onClick={() => doAction(btn.action)} style={{ width: 44, height: 44, borderRadius: 22, background: COLORS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.soft, cursor: 'pointer', border: `2px solid ${btn.color}`, color: btn.color }}><Icon name={btn.icon} size={19} /></div>
          ))}
        </div>
      )}
      {showDeleteTip && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 80 }}>
          <div style={{ width: '100%', background: COLORS.card, borderRadius: 14, padding: 18, boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#333', marginBottom: 8 }}>删除会移入系统回收站</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#666' }}>照片不会立即永久消失。你可以右滑撤回本次操作，也可以在系统相册回收站中恢复。</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: '#666', cursor: 'pointer' }}>
              <input type="checkbox" checked={skipDeleteTip} onChange={(e) => setSkipDeleteTip(e.target.checked)} />
              不再提醒
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowDeleteTip(false)} style={{ padding: '9px 16px', background: '#f1f3f5', color: '#555', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>取消</button>
              <button onClick={confirmDelete} style={{ padding: '9px 16px', background: COLORS.delete, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>继续删除</button>
            </div>
          </div>
        </div>
      )}
      {showFavTray && <FavTray onClose={() => setShowFavTray(false)} onPick={handleFavPick} />}
      {toast && (
        <div style={{ position: 'absolute', left: '50%', bottom: actionBarEnabled ? 78 : 28, transform: 'translateX(-50%)', padding: '9px 16px', borderRadius: 999, background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 13, fontWeight: 800, boxShadow: SHADOW.raised, zIndex: 120, animation: 'fadeIn 0.18s ease' }}>{toast}</div>
      )}
    </div>
  );
};

// Page 4: 精选集托盘
const FavTray = ({ onClose, onPick }: { onClose: () => void; onPick: (name: string) => void }) => {
  const [toast, setToast] = useState('');
  const favs = [{ icon: 'star' as IconName, name: '精选', count: 23 }, { icon: 'plane' as IconName, name: '旅行', count: 15 }, { icon: 'users' as IconName, name: '家人', count: 45 }, { icon: 'briefcase' as IconName, name: '工作', count: 12 }, { icon: 'plus' as IconName, name: '新建', count: 0 }];
  const pick = (name: string) => { setToast(`已加入 ${name}`); setTimeout(() => onPick(name), 500); };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }}></div>
      <div style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(16px)', borderRadius: '24px 24px 0 0', padding: '18px 12px 26px', animation: 'slideUp 0.3s ease', boxShadow: '0 -18px 42px rgba(15,23,42,0.22)' }}>
        <div style={{ width: 42, height: 4, borderRadius: 999, background: COLORS.line, margin: '0 auto 14px' }} />
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 850, color: COLORS.ink }}>加入精选集</div>
        <div style={{ textAlign: 'center', fontSize: 11, color: COLORS.muted, margin: '4px 0 12px' }}>仅在本应用内整理</div>
        {toast && <div style={{ textAlign: 'center', color: COLORS.primary, fontSize: 13, marginBottom: 8 }}>{toast}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {favs.map(f => (
            <div key={f.name} onClick={() => f.name !== '新建' && pick(f.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: 8 }}>
              <div style={{ width: 50, height: 50, borderRadius: 18, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW.soft, color: COLORS.primary }}><Icon name={f.icon} size={22} /></div>
              <span style={{ fontSize: 11, marginTop: 6, fontWeight: 700, color: COLORS.ink }}>{f.name}</span>
              {f.count > 0 && <span style={{ fontSize: 10, color: COLORS.subtle }}>{f.count}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Page 5: 精选集管理页
const FavPage = ({ onNav }: { onNav: (p: number) => void }) => {
  const favs = [{ icon: 'star' as IconName, name: '精选', count: 23, color: '#F59E0B' }, { icon: 'plane' as IconName, name: '旅行', count: 15, color: '#2563EB' }, { icon: 'users' as IconName, name: '家人', count: 45, color: '#EF4444' }, { icon: 'briefcase' as IconName, name: '工作', count: 12, color: '#14B8A6' }];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: '14px 18px 10px', background: 'rgba(255,255,255,0.92)', borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ fontSize: 24, fontWeight: 850, color: COLORS.ink }}>我的精选集</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>仅在本应用内整理</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, paddingBottom: 70 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {favs.map(f => (
            <div key={f.name} style={{ background: COLORS.card, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
              <div style={{ height: 94, background: `linear-gradient(135deg, ${f.color}, ${f.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name={f.icon} size={34} strokeWidth={1.8} /></div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink }}>{f.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{f.count} 张</div>
              </div>
            </div>
          ))}
          <div style={{ background: COLORS.card, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: 136, border: `2px dashed ${COLORS.line}`, cursor: 'pointer' }}>
            <Icon name="plus" size={28} color={COLORS.subtle} />
            <span style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, fontWeight: 700 }}>新建精选集</span>
          </div>
        </div>
      </div>
      <BottomNav active="精选集" onNav={onNav} />
    </div>
  );
};

// Page 6: 暂存分组页 (StagingPage)
const StagingPage = ({ onBack, stagedPhotos, onRemoveStaged, onClearStaged }: {
  onBack: () => void;
  stagedPhotos: StagedPhoto[];
  onRemoveStaged: (id: number) => void;
  onClearStaged: () => void;
}) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      {/* Header */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(255,255,255,0.94)', borderBottom: `1px solid ${COLORS.line}` }}>
        <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 17, border: `1px solid ${COLORS.line}`, background: COLORS.card, cursor: 'pointer', marginRight: 10 }}>←</button>
        <span style={{ flex: 1, fontSize: 17, fontWeight: 850, color: COLORS.ink }}>暂存筛选</span>
        <span onClick={onClearStaged} style={{ fontSize: 13, color: COLORS.delete, cursor: 'pointer', fontWeight: 800 }}>清空</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 12 }}>
          {stagedPhotos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>暂存栏为空，请先添加照片</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {stagedPhotos.map(photo => (
                <div key={photo.id} style={{ background: COLORS.card, borderRadius: 14, overflow: 'hidden', border: selected.includes(photo.id) ? `2px solid ${COLORS.primary}` : `2px solid ${COLORS.line}`, transition: 'border 0.2s', boxShadow: SHADOW.soft }}>
                  <div onClick={() => toggleSelect(photo.id)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <PhotoThumb index={photo.id} height={80} radius={0} />
                    {selected.includes(photo.id) && (
                      <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 11 }}>✓</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '6px 4px' }}>
                    <span style={{ fontSize: 11, cursor: 'pointer', padding: '2px 8px', background: '#e8f5e9', borderRadius: 4, color: '#4caf50' }}>保留</span>
                    <span onClick={() => onRemoveStaged(photo.id)} style={{ fontSize: 11, cursor: 'pointer', padding: '2px 8px', background: '#ffebee', borderRadius: 4, color: COLORS.delete }}>删除</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Bottom action bar for filter mode */}
      {stagedPhotos.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: COLORS.card, borderTop: `1px solid ${COLORS.line}`, gap: 8 }}>
          <span style={{ fontSize: 13, color: COLORS.muted, flex: 1, fontWeight: 700 }}>已选 {selected.length} 张</span>
          <button style={{ padding: '9px 14px', background: COLORS.delete, color: '#fff', border: 'none', borderRadius: 999, fontSize: 12, cursor: 'pointer', fontWeight: 800 }}>批量删除</button>
          <button style={{ padding: '9px 14px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 999, fontSize: 12, cursor: 'pointer', fontWeight: 800 }}>加入精选集</button>
        </div>
      )}
    </div>
  );
};

// Page 7: 统计面板页
const StatsPage = ({ onNav }: { onNav: (p: number) => void }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
    <StatusBar />
    <div style={{ padding: '14px 18px 10px', background: 'rgba(255,255,255,0.92)', borderBottom: `1px solid ${COLORS.line}` }}>
      <div style={{ fontSize: 24, fontWeight: 850, color: COLORS.ink }}>清理成果</div>
      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>空间变化一眼看清</div>
    </div>
    <div style={{ flex: 1, padding: 16, paddingBottom: 70 }}>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#2563EB)', borderRadius: 24, padding: 20, marginBottom: 14, boxShadow: SHADOW.raised, color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 800, marginBottom: 12 }}>本次清理</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, opacity: 0.76 }}>已删除</div>
            <div style={{ fontSize: 34, fontWeight: 900 }}>47</div>
            <div style={{ fontSize: 11, opacity: 0.76 }}>张</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, opacity: 0.76 }}>释放空间</div>
            <div style={{ fontSize: 34, fontWeight: 900 }}>328</div>
            <div style={{ fontSize: 11, opacity: 0.76 }}>MB</div>
          </div>
        </div>
      </div>
      <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
        <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 12, fontWeight: 800 }}>累计清理</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: COLORS.subtle }}>总计删除</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.delete }}>1,234</div>
            <div style={{ fontSize: 11, color: COLORS.subtle }}>张</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: COLORS.subtle }}>总计释放</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.primary }}>4.7</div>
            <div style={{ fontSize: 11, color: COLORS.subtle }}>GB</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 15, color: COLORS.muted, fontWeight: 700 }}>你的手机感觉轻松多了</div>
    </div>
    <BottomNav active="统计" onNav={onNav} />
  </div>
);

// Page 8: 设置与主题页
const SettingsPage = ({ onNav, actionBarEnabled, onToggleActionBar }: { onNav: (p: number) => void; actionBarEnabled: boolean; onToggleActionBar: () => void }) => {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [toggles, setToggles] = useState([true, true, false]);
  const themes = [{ name: '浅色', color: '#FFFFFF', border: '#ddd' }, { name: '深色', color: '#1A1A2E' }];
  const Toggle = ({ on, onTap }: { on: boolean; onTap: () => void }) => (
    <div onClick={onTap} style={{ width: 40, height: 22, borderRadius: 11, background: on ? COLORS.primary : '#ddd', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 2, left: on ? 20 : 2, transition: 'left 0.2s' }}></div>
    </div>
  );
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: '14px 18px 10px', background: 'rgba(255,255,255,0.92)', borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ fontSize: 24, fontWeight: 850, color: COLORS.ink }}>设置</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>偏好与辅助操作</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 70 }}>
        <div style={{ background: COLORS.card, margin: 16, borderRadius: 18, padding: 16, boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
          <div style={{ fontSize: 14, fontWeight: 850, marginBottom: 12, color: COLORS.ink }}>主题颜色</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {themes.map((t, i) => (
              <div key={i} onClick={() => setSelectedTheme(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: t.color, border: selectedTheme === i ? `3px solid ${COLORS.primary}` : `2px solid ${t.border || '#eee'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: 10, color: COLORS.muted, marginTop: 5, fontWeight: 700 }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: COLORS.card, margin: '0 16px 16px', borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${COLORS.line}` }}>
            <span style={{ fontSize: 14, fontWeight: 750, color: COLORS.ink }}>显示辅助操作栏</span>
            <Toggle on={actionBarEnabled} onTap={onToggleActionBar} />
          </div>
          {['跟随系统深色模式', '声音反馈', '触觉反馈'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < 2 ? `1px solid ${COLORS.line}` : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 650, color: COLORS.ink }}>{item}</span>
              <Toggle on={toggles[i]} onTap={() => setToggles(t => t.map((v, j) => j === i ? !v : v))} />
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, margin: '0 16px', borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW.card, border: `1px solid ${COLORS.line}` }}>
          {['清除缓存', '关于我们', '隐私政策', '版本 V1.0.0'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < 3 ? `1px solid ${COLORS.line}` : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 650, color: i === 3 ? COLORS.subtle : COLORS.ink }}>{item}</span>
              {i < 3 && <span style={{ color: COLORS.subtle }}>›</span>}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="设置" onNav={onNav} />
    </div>
  );
};

// Page 9: 新用户引导页
const GuidePage = ({ onDone }: { onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: 'trash' as IconName, arrow: '↑', title: '上划 = 删除', desc: '不需要的照片，一划就走', color: COLORS.delete },
    { icon: 'star' as IconName, arrow: '↓', title: '下划 = 加入精选集', desc: '值得保留的，在应用内整理', color: COLORS.favorite },
    { icon: 'skip' as IconName, arrow: '←', title: '左滑 = 跳过', desc: '拿不准的，先放一放', color: COLORS.skip },
    { icon: 'undo' as IconName, arrow: '→', title: '右滑 = 撤回', desc: '误操作？右滑恢复', color: COLORS.undo },
  ];
  const s = steps[step];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, padding: 32 }}>
      <div style={{ width: 112, height: 112, borderRadius: 34, background: `${s.color}14`, color: s.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: SHADOW.card }}>
        <Icon name={s.icon} size={30} />
        <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, marginTop: 8 }}>{s.arrow}</div>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: '0 0 12px' }}>{s.title}</h2>
      <p style={{ fontSize: 15, color: '#666', margin: 0 }}>{s.desc}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 40 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4, background: i === step ? COLORS.primary : '#ddd', transition: 'all 0.3s' }}></div>
        ))}
      </div>
      <button onClick={() => step < 3 ? setStep(step + 1) : onDone()} style={{ marginTop: 32, padding: '12px 40px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}>
        {step < 3 ? '下一步' : '开始使用'}
      </button>
      {step < 3 && <span onClick={onDone} style={{ marginTop: 12, fontSize: 13, color: '#999', cursor: 'pointer' }}>跳过引导</span>}
    </div>
  );
};

// Main App Component
const AlbumCleanerPrototype = () => {
  const [page, setPage] = useState(9); // Start with guide
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [actionBarEnabled, setActionBarEnabled] = useState(false);

  const navTo = (p: number) => { setPage(p); };

  const handleStage = (photo: StagedPhoto) => {
    setStagedPhotos(prev => [...prev, photo]);
  };

  const handleRemoveStaged = (id: number) => {
    setStagedPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleClearStaged = () => {
    setStagedPhotos([]);
  };

  const renderPage = () => {
    switch (page) {
      case 1: return <ScanPage onNext={() => navTo(2)} />;
      case 2: return <HomePage onNav={navTo} onGroup={() => navTo(3)} />;
      case 3: return <CardSwipePage onBack={() => navTo(2)} stagedPhotos={stagedPhotos} onStage={handleStage} onRemoveStaged={handleRemoveStaged} onNav={navTo} actionBarEnabled={actionBarEnabled} />;
      case 5: return <FavPage onNav={navTo} />;
      case 6: return <StagingPage onBack={() => navTo(3)} stagedPhotos={stagedPhotos} onRemoveStaged={handleRemoveStaged} onClearStaged={handleClearStaged} />;
      case 7: return <StatsPage onNav={navTo} />;
      case 8: return <SettingsPage onNav={navTo} actionBarEnabled={actionBarEnabled} onToggleActionBar={() => setActionBarEnabled(v => !v)} />;
      case 9: return <GuidePage onDone={() => navTo(1)} />;
      default: return <HomePage onNav={navTo} onGroup={() => navTo(3)} />;
    }
  };

  return (
    <PhoneFrame>
      <StyleTag />
      {renderPage()}
    </PhoneFrame>
  );
};

export default AlbumCleanerPrototype;
