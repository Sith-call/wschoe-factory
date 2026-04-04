import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, ArrowRight, Network, List, FlaskConical } from 'lucide-react';
import { AppState, Term, Category, Screen, CategoryId } from '../types';
import { getProgress, getMastery, catProgress } from '../store';
import { CategoryIcon } from './CategoryIcon';

interface MindMapScreenProps {
  state: AppState;
  terms: Term[];
  categories: Category[];
  navigate: (s: Screen) => void;
}

const CAT_COLORS: Record<CategoryId, string> = {
  'fundamentals': '#0D9488',
  'market-price': '#D97706',
  'consumer-producer': '#7C3AED',
  'market-failure': '#DC2626',
  'national-economy': '#2563EB',
  'growth-productivity': '#059669',
  'money-finance': '#CA8A04',
  'macro-fluctuation': '#E11D48',
  'macro-policy': '#4F46E5',
  'international': '#0891B2',
};

type ViewMode = 'list' | 'graph';

/* ------------------------------------------------------------------ */
/*  MASTERY HELPERS                                                    */
/* ------------------------------------------------------------------ */

function masteryBg(level: number, color: string): string {
  if (level === 0) return 'transparent';
  if (level === 1) return color + '1A'; // ~10%
  if (level === 2) return color + '40'; // ~25%
  return color + '80'; // ~50%
}

function masteryBorder(level: number, color: string): string {
  if (level === 0) return '#D1D5DB';
  return color;
}

function masteryTextColor(level: number): string {
  if (level === 0) return '#9CA3AF';
  if (level <= 2) return '#374151';
  return '#1F2937';
}

/* ------------------------------------------------------------------ */
/*  CATEGORY CARD (List View)                                          */
/* ------------------------------------------------------------------ */

function CategoryCard({
  cat, terms, state, expanded, onToggle, onTermClick,
}: {
  cat: Category;
  terms: Term[];
  state: AppState;
  expanded: boolean;
  onToggle: () => void;
  onTermClick: (id: string) => void;
}) {
  const color = CAT_COLORS[cat.id];
  const catTerms = useMemo(() => terms.filter(t => t.category === cat.id), [terms, cat.id]);
  const progress = useMemo(() => catProgress(state, catTerms.map(t => t.id)), [state, catTerms]);
  const pct = progress.total > 0 ? Math.round((progress.master / progress.total) * 100) : 0;

  // Cross-category connections for each term
  const crossLinks = useMemo(() => {
    const map: Record<string, { catId: CategoryId; catName: string }[]> = {};
    for (const t of catTerms) {
      const links: { catId: CategoryId; catName: string }[] = [];
      // Prerequisites from other categories
      for (const preId of t.prerequisites) {
        const preTerm = terms.find(tt => tt.id === preId);
        if (preTerm && preTerm.category !== cat.id) {
          const preCat = preTerm.category;
          if (!links.some(l => l.catId === preCat)) {
            links.push({ catId: preCat, catName: terms.find(tt => tt.category === preCat)?.category === preCat ? '' : '' });
          }
        }
      }
      // Terms that depend on this one from other categories
      for (const other of terms) {
        if (other.category !== cat.id && other.prerequisites.includes(t.id)) {
          if (!links.some(l => l.catId === other.category)) {
            links.push({ catId: other.category, catName: '' });
          }
        }
      }
      map[t.id] = links;
    }
    return map;
  }, [catTerms, terms, cat.id]);

  return (
    <div
      className="rounded-lg border border-border bg-white overflow-hidden transition-all duration-200"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-stone-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '14' }}
        >
          <CategoryIcon name={cat.icon} size={20} className="text-current" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-semibold text-ink truncate">{cat.name}</span>
            <span className="text-[11px] text-ink-muted font-medium">{progress.master}/{progress.total}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-1.5 h-1.5 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
        </div>
        <div className="shrink-0 text-ink-secondary">
          {expanded
            ? <ChevronDown size={18} />
            : <ChevronRight size={18} />
          }
        </div>
      </button>

      {/* Expanded term list */}
      {expanded && (
        <div className="border-t border-border">
          {catTerms.map((term, idx) => {
            const p = getProgress(state, term.id);
            const mastery = getMastery(p, term.hasLab);
            const links = crossLinks[term.id] || [];
            // Highlight "ready to learn" terms (prerequisites met, not started)
            const isReady = mastery === 0 && term.prerequisites.every(pid => getProgress(state, pid).readAt !== null);

            return (
              <button
                key={term.id}
                onClick={() => onTermClick(term.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-stone-50 transition-colors ${isReady ? 'bg-primary/5' : ''}`}
                style={idx < catTerms.length - 1 ? { borderBottom: '1px solid #F5F5F4' } : {}}
              >
                {/* Mastery indicator */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[1.5px]"
                  style={{
                    backgroundColor: masteryBg(mastery, color),
                    borderColor: masteryBorder(mastery, color),
                  }}
                >
                  {mastery === 3 && <Check size={14} strokeWidth={2.5} style={{ color: '#fff' }} />}
                  {mastery > 0 && mastery < 3 && (
                    <span className="text-[10px] font-bold" style={{ color }}>{mastery}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: masteryTextColor(mastery) }}
                    >
                      {term.korean}
                    </span>
                    {isReady && (
                      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">추천</span>
                    )}
                    {term.hasLab && (
                      <FlaskConical size={12} className="shrink-0" style={{ color: '#D97706' }} />
                    )}
                  </div>
                  {/* Cross-category links */}
                  {links.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowRight size={10} className="text-ink-muted shrink-0" />
                      {links.slice(0, 3).map(l => (
                        <span
                          key={l.catId}
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CAT_COLORS[l.catId] }}
                          title={l.catId}
                        />
                      ))}
                      {links.length > 3 && (
                        <span className="text-[10px] text-ink-muted">+{links.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight size={16} className="text-ink-muted shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GRAPH VIEW (force-directed, SVG)                                   */
/* ------------------------------------------------------------------ */

interface GNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  category: CategoryId;
  mastery: number;
  label: string;
  hasLab: boolean;
}

interface GEdge {
  source: string;
  target: string;
}

function buildGraphData(terms: Term[], state: AppState): { nodes: GNode[]; edges: GEdge[] } {
  const edges: GEdge[] = [];
  for (const t of terms) {
    for (const pre of t.prerequisites) {
      if (terms.some(tt => tt.id === pre)) {
        edges.push({ source: pre, target: t.id });
      }
    }
  }

  // Arrange nodes by category in a grid layout
  const catOrder: CategoryId[] = [
    'fundamentals', 'market-price', 'consumer-producer', 'market-failure', 'national-economy',
    'growth-productivity', 'money-finance', 'macro-fluctuation', 'macro-policy', 'international',
  ];
  const catPositions: Record<string, { cx: number; cy: number }> = {};
  catOrder.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    catPositions[c] = { cx: col * 600 - 600, cy: row * 600 - 600 };
  });

  const catCounters: Record<string, number> = {};
  const nodes: GNode[] = terms.map(t => {
    const idx = catCounters[t.category] ?? 0;
    catCounters[t.category] = idx + 1;
    const center = catPositions[t.category] || { cx: 0, cy: 0 };
    const angle = (idx / 10) * Math.PI * 2;
    const r = 80 + (idx % 3) * 60;
    const p = getProgress(state, t.id);
    return {
      id: t.id,
      x: center.cx + Math.cos(angle) * r,
      y: center.cy + Math.sin(angle) * r,
      vx: 0, vy: 0,
      category: t.category,
      mastery: getMastery(p, t.hasLab),
      label: t.korean,
      hasLab: t.hasLab,
    };
  });

  // Simple force simulation (fewer iterations for perf)
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  for (let iter = 0; iter < 120; iter++) {
    const alpha = 1 - iter / 120;
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 200) {
          const f = (4000 * alpha) / (dist * dist);
          const fx = (dx / dist) * f, fy = (dy / dist) * f;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }
    }
    // Edge attraction
    for (const e of edges) {
      const s = nodeMap.get(e.source), t = nodeMap.get(e.target);
      if (!s || !t) continue;
      const dx = t.x - s.x, dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist > 80) {
        const f = (dist - 80) * 0.002 * alpha;
        s.vx += (dx / dist) * f; s.vy += (dy / dist) * f;
        t.vx -= (dx / dist) * f; t.vy -= (dy / dist) * f;
      }
    }
    // Cluster gravity
    for (const n of nodes) {
      const c = catPositions[n.category];
      if (c) {
        n.vx += (c.cx - n.x) * 0.03 * alpha;
        n.vy += (c.cy - n.y) * 0.03 * alpha;
      }
    }
    // Apply
    for (const n of nodes) {
      n.vx *= 0.8; n.vy *= 0.8;
      n.x += n.vx; n.y += n.vy;
    }
  }

  return { nodes, edges };
}

function GraphView({
  terms, state, categories, navigate,
}: {
  terms: Term[];
  state: AppState;
  categories: Category[];
  navigate: (s: Screen) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const [filterCat, setFilterCat] = useState<CategoryId | null>('fundamentals');

  const { nodes: allNodes, edges: allEdges } = useMemo(() => buildGraphData(terms, state), [terms, state]);

  // Filter nodes/edges by selected category — only show that category's nodes
  const nodes = useMemo(() => {
    if (!filterCat) return allNodes;
    return allNodes.filter(n => n.category === filterCat);
  }, [allNodes, filterCat]);

  const edges = useMemo(() => {
    const nodeIds = new Set(nodes.map(n => n.id));
    return allEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [allEdges, nodes]);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Fit to filtered nodes
  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x - 40);
      minY = Math.min(minY, n.y - 40);
      maxX = Math.max(maxX, n.x + 40);
      maxY = Math.max(maxY, n.y + 40);
    }
    const gw = maxX - minX + 100, gh = maxY - minY + 100;
    const scale = Math.min(rect.width / gw, rect.height / gh, 2);
    setTransform({
      x: rect.width / 2 - ((minX + maxX) / 2) * scale,
      y: rect.height / 2 - ((minY + maxY) / 2) * scale,
      scale,
    });
  }, [nodes]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => {
      const ns = Math.max(0.1, Math.min(4, prev.scale * delta));
      const r = ns / prev.scale;
      return { scale: ns, x: mx - (mx - prev.x) * r, y: my - (my - prev.y) * r };
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setTransform(p => ({ ...p, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  }, [dragging, dragStart]);

  const handlePointerUp = useCallback(() => setDragging(false), []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist.current !== null) {
        const delta = dist / lastTouchDist.current;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        setTransform(prev => {
          const ns = Math.max(0.1, Math.min(4, prev.scale * delta));
          const r = ns / prev.scale;
          return { scale: ns, x: mx - (mx - prev.x) * r, y: my - (my - prev.y) * r };
        });
      }
      lastTouchDist.current = dist;
    }
  }, []);

  const handleTouchEnd = useCallback(() => { lastTouchDist.current = null; }, []);

  // Category cluster info
  const clusters = useMemo(() => {
    return categories.map(cat => {
      const cn = nodes.filter(n => n.category === cat.id);
      if (cn.length === 0) return null;
      let cx = 0, cy = 0;
      for (const n of cn) { cx += n.x; cy += n.y; }
      cx /= cn.length; cy /= cn.length;
      let maxR = 0;
      for (const n of cn) {
        const d = Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2) + 30;
        if (d > maxR) maxR = d;
      }
      return { cx, cy, radius: maxR + 30, catId: cat.id, catName: cat.name };
    }).filter(Boolean) as { cx: number; cy: number; radius: number; catId: CategoryId; catName: string }[];
  }, [nodes, categories]);

  const NODE_R = filterCat ? 24 : 18;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Category filter chips — scrollable with fade hint */}
      <div className="relative flex-shrink-0">
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilterCat(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${!filterCat ? 'bg-ink text-white' : 'bg-stone-100 text-ink-secondary'}`}
        >전체</button>
        {categories.sort((a, b) => a.order - b.order).map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCat(filterCat === cat.id ? null : cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${filterCat === cat.id ? 'text-white' : 'bg-stone-100 text-ink-secondary'}`}
            style={filterCat === cat.id ? { backgroundColor: CAT_COLORS[cat.id] } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[cat.id] }} />
            {cat.name.replace(/경제학 |와 |과 /g, '').slice(0, 4)}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
      </div>
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Cluster backgrounds — hide circle when single category (wastes space) */}
          {clusters.map(cl => (
            <g key={`cl-${cl.catId}`}>
              {!filterCat && (
                <circle
                  cx={cl.cx} cy={cl.cy} r={cl.radius}
                  fill={CAT_COLORS[cl.catId]} fillOpacity={0.06}
                  stroke={CAT_COLORS[cl.catId]} strokeOpacity={0.15} strokeWidth={1.5} strokeDasharray="6 4"
                />
              )}
              <text
                x={cl.cx} y={cl.cy - cl.radius - 8}
                textAnchor="middle" fontSize={filterCat ? 14 : 11} fontWeight={600}
                fontFamily="'Space Grotesk', sans-serif"
                fill={CAT_COLORS[cl.catId]}
              >
                {cl.catName}
              </text>
            </g>
          ))}

          {/* Edges */}
          {edges.map((e, i) => {
            const s = nodeMap.get(e.source), t = nodeMap.get(e.target);
            if (!s || !t) return null;
            const dx = t.x - s.x, dy = t.y - s.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const sx = s.x + (dx / dist) * (NODE_R + 2);
            const sy = s.y + (dy / dist) * (NODE_R + 2);
            const tx = t.x - (dx / dist) * (NODE_R + 6);
            const ty = t.y - (dy / dist) * (NODE_R + 6);
            return (
              <line
                key={`e-${i}`}
                x1={sx} y1={sy} x2={tx} y2={ty}
                stroke="#94A3B8" strokeWidth={filterCat ? 1.5 : 1} strokeOpacity={filterCat ? 0.7 : 0.5} markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const color = CAT_COLORS[n.category];
            return (
              <g
                key={n.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate({ type: 'termCard', termId: n.id })}
              >
                {/* Mastery glow */}
                {n.mastery === 3 && (
                  <circle cx={n.x} cy={n.y} r={NODE_R + 6} fill={color} fillOpacity={0.15} />
                )}
                {/* Main circle */}
                <circle
                  cx={n.x} cy={n.y} r={NODE_R}
                  fill={n.mastery === 0 ? '#F9FAFB' : color}
                  fillOpacity={n.mastery === 0 ? 1 : [0, 0.15, 0.35, 0.7][n.mastery]}
                  stroke={n.mastery === 0 ? '#D1D5DB' : color}
                  strokeWidth={n.mastery === 3 ? 2.5 : 1.5}
                />
                {/* Mastery check */}
                {n.mastery === 3 && (
                  <text
                    x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
                    fontSize={14} fill="#fff" fontWeight={700}
                  >
                    {'✓'}
                  </text>
                )}
                {/* Label below node — truncate long labels */}
                <text
                  x={n.x} y={n.y + NODE_R + 13}
                  textAnchor="middle" fontSize={filterCat ? 11 : 9}
                  fontFamily="'Pretendard', sans-serif" fontWeight={500}
                  fill={n.mastery === 0 ? '#9CA3AF' : '#374151'}
                >
                  {filterCat ? n.label : (n.label.length > 5 ? n.label.slice(0, 4) + '..' : n.label)}
                </text>
                {/* Lab indicator */}
                {n.hasLab && (
                  <circle
                    cx={n.x + NODE_R - 4} cy={n.y - NODE_R + 4} r={4}
                    fill="#D97706" stroke="#fff" strokeWidth={1}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-ink-secondary text-[10px] px-2 py-1 rounded-md border border-border">
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function MindMapScreen({ state, terms, categories, navigate }: MindMapScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedCat, setExpandedCat] = useState<CategoryId | null>(null);

  // Sort categories by order
  const sortedCats = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories],
  );

  // Overall stats
  const overallStats = useMemo(() => {
    const ids = terms.map(t => t.id);
    return catProgress(state, ids);
  }, [state, terms]);

  const overallPct = overallStats.total > 0
    ? Math.round((overallStats.master / overallStats.total) * 100)
    : 0;

  const handleToggleCat = useCallback((catId: CategoryId) => {
    setExpandedCat(prev => prev === catId ? null : catId);
  }, []);

  const handleTermClick = useCallback((termId: string) => {
    navigate({ type: 'termCard', termId });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface pb-20 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-display font-semibold text-ink">
            용어 관계 맵
          </h1>
          {/* View toggle */}
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <List size={14} />
              목록
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'graph'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <Network size={14} />
              그래프
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-screen-md mx-auto px-4 py-4">
            {/* Overall progress summary */}
            <div className="mb-4 p-3.5 rounded-lg bg-white border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink-secondary">전체 진행률</span>
                <span className="text-xs font-semibold text-ink">{overallStats.master}/{overallStats.total} 마스터</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              {/* Mastery legend */}
              <div className="flex gap-4 mt-2.5 text-[11px] text-ink-muted">
                {[
                  { level: 0, label: '미학습', color: '#D1D5DB' },
                  { level: 1, label: '읽음', color: '#0D9488' },
                  { level: 2, label: '퀴즈', color: '#0D9488' },
                  { level: 3, label: '마스터', color: '#0D9488' },
                ].map(({ level, label, color }) => (
                  <span key={level} className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border"
                      style={{
                        backgroundColor: level === 0 ? 'transparent' : color,
                        opacity: level === 0 ? 1 : [0, 0.3, 0.6, 1][level],
                        borderColor: level === 0 ? '#D1D5DB' : color,
                      }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Category cards */}
            <div className="space-y-2.5">
              {sortedCats.map(cat => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  terms={terms}
                  state={state}
                  expanded={expandedCat === cat.id}
                  onToggle={() => handleToggleCat(cat.id)}
                  onTermClick={handleTermClick}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <GraphView
          terms={terms}
          state={state}
          categories={categories}
          navigate={navigate}
        />
      )}
    </div>
  );
}
