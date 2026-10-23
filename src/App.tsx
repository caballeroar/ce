import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Gauge,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import "./App.css";

type Page =
  | "dashboard"
  | "paths"
  | "path-detail"
  | "roadmap"
  | "assets"
  | "scenarios"
  | "indicators"
  | "measures"
  | "reports"
  | "settings";
type Phase = { id: string; name: string; period: string };
type Road = { id: string; name: string; color: string };
type Indicator = {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  weight: number;
  confidence: number;
  note: string;
};
type Path = {
  id: string;
  name: string;
  color: string;
  health: number;
  description: string;
  status: "Actief" | "Gepland";
};
type Rule = {
  road: string;
  indicator: string;
  operator: string;
  value: string;
  recommendation: string;
  active: boolean;
};

const phases: Phase[] = [
  { id: "fase1", name: "Optimalisatie & innovatie", period: "2027–2035" },
  { id: "fase2", name: "Opschaling & versnelling", period: "2035–2040" },
  { id: "fase3", name: "Institutionalisering & afbouw", period: "2040–2045" },
  { id: "fase4", name: "Stabilisatie & uitfasering", period: "2045–2050" },
];

const initialPaths: Path[] = [
  {
    id: "bouw",
    name: "Transitiepad 1",
    color: "#df4d20",
    health: 72,
    description:
      "Een circulaire gebouwde omgeving met slim materiaalgebruik en toekomstbestendige renovatie.",
    status: "Actief",
  },
  {
    id: "grondstoffen",
    name: "Transitiepad 2",
    color: "#16836d",
    health: 58,
    description:
      "Grondstoffen langer in de stad houden en waardeverlies in ketens voorkomen.",
    status: "Actief",
  },
  {
    id: "economie",
    name: "Transitiepad 3",
    color: "#2860a8",
    health: 83,
    description:
      "Lokale ondernemers en nieuwe circulaire verdienmodellen versterken.",
    status: "Actief",
  },
  {
    id: "gww",
    name: "Transitiepad 4",
    color: "#c48524",
    health: 65,
    description:
      "Publieke ruimte en infrastructuur toekomstbestendig en circulair inrichten.",
    status: "Gepland",
  },
];

const initialRoads: Road[] = [
  { id: "policy", name: "Beleid", color: "#df4d20" },
  { id: "budget", name: "Budget", color: "#16836d" },
  { id: "citizens", name: "Inwoners", color: "#2860a8" },
];

const initialIndicators: Record<string, Indicator[]> = {
  "policy-2027": [
    {
      id: "pol-1",
      name: "Politiek draagvlak",
      category: "Bestuur",
      current: 67,
      target: 75,
      unit: "%",
      weight: 3,
      confidence: 92,
      note: "Coalitieakkoord ondertekend.",
    },
  ],
  "budget-2027": [
    {
      id: "bud-1",
      name: "Beschikbaar budget",
      category: "Financiën",
      current: 12,
      target: 15,
      unit: "€ mln",
      weight: 3,
      confidence: 95,
      note: "Q1-toewijzing bevestigd.",
    },
  ],
  "citizens-2027": [
    {
      id: "cit-1",
      name: "Aangemelde woningen",
      category: "Adoptie",
      current: 3200,
      target: 5000,
      unit: "woningen",
      weight: 2,
      confidence: 87,
      note: "Campagne actief in wijken 4 en 7.",
    },
  ],
  "policy-2028": [
    {
      id: "pol-2",
      name: "Wettelijk kader",
      category: "Bestuur",
      current: 45,
      target: 80,
      unit: "%",
      weight: 3,
      confidence: 78,
      note: "Concept in commissie.",
    },
  ],
  "budget-2028": [
    {
      id: "bud-2",
      name: "Toegekend kapitaal",
      category: "Financiën",
      current: 8,
      target: 12,
      unit: "€ mln",
      weight: 3,
      confidence: 82,
      note: "Fase 2 vraagt om raadsbesluit.",
    },
  ],
  "citizens-2028": [
    {
      id: "cit-2",
      name: "Publieke tevredenheid",
      category: "Betrokkenheid",
      current: 72,
      target: 80,
      unit: "%",
      weight: 2,
      confidence: 89,
      note: "Enquête onder 1.200 huishoudens.",
    },
  ],
};

const initialRules: Rule[] = [
  {
    road: "Beleid",
    indicator: "Politiek draagvlak",
    operator: "daalt onder",
    value: "60%",
    recommendation:
      "Versterk de betrokkenheid van belanghebbenden voordat aanvullende financiering wordt goedgekeurd.",
    active: false,
  },
  {
    road: "Budget",
    indicator: "Beschikbaar budget",
    operator: "daalt onder",
    value: "80% van doel",
    recommendation:
      "Controleer de EU-subsidieaanvraag en versnel de Q2-toewijzing.",
    active: true,
  },
  {
    road: "Inwoners",
    indicator: "Aangemelde woningen",
    operator: "daalt onder",
    value: "4.000 woningen",
    recommendation:
      "Start een gerichte aanmeldcampagne in wijken die achterblijven.",
    active: true,
  },
];

const tabs = [
  "Gewenste verandering",
  "Outcomes & mijlpalen",
  "Barrières & lock-ins",
  "Rol van de gemeente",
  "Beleid & instrumenten",
  "Investering & businesscase",
  "Actoren & samenwerking",
  "Transitie-indicatoren",
];
const phaseQuestions = [
  [
    "Wat moet in deze fase anders worden? Wat moet worden opgebouwd, omgebouwd of afgebouwd?",
    "Nieuwe structuren, praktijken en spelers opbouwen",
    "Bestaande elementen omvormen naar de gewenste richting",
    "Wat moet worden afgebouwd of uitgefaseerd?",
  ],
  [
    "Wat moet er aan het einde van de fase aantoonbaar veranderd zijn?",
    "Concrete, meetbare uitkomsten voor het systeem",
    "Gedragsveranderingen bij betrokken partijen",
    "Nieuwe normen, standaarden of instituties",
  ],
  [
    "Wat belemmert de volgende stap of kan ons langdurig vastzetten?",
    "Technologische, infrastructurele of investerings-lock-ins",
    "Financiële of institutionele drempels",
    "Belangen die de transitie vertragen of blokkeren",
  ],
  [
    "Welke rol neemt de gemeente in deze fase?",
    "Voorwaarden scheppen en ondersteunen",
    "Actief stimuleren en enthousiasmeren",
    "Coördineren, normeren en via inkoop richting geven",
  ],
  [
    "Welke beleids- en instrumentenmix is nodig?",
    "Regelgeving en vergunningen",
    "Circulaire aanbesteding en inkoop",
    "Samenwerking, communicatie en ruimtelijke ordening",
  ],
  [
    "Waar is geld en capaciteit nodig?",
    "Publieke investeringen en subsidies",
    "Private investeringen en nieuwe businessmodellen",
    "Kostenreductie en opschaling richting kosteneffectiviteit",
  ],
  [
    "Wie moet meedoen of verantwoordelijkheid nemen?",
    "Overheid: gemeente, Rijk, provincie en waterschap",
    "Marktpartijen, bedrijven en investeerders",
    "Bewoners, maatschappelijke organisaties en kennisinstellingen",
  ],
  [
    "Waaraan zien we dat het systeem echt beweegt?",
    "Indicatoren voor structurele verandering",
    "Gedrags- en uitkomstindicatoren",
    "Vroegsignaleringsindicatoren voor bijsturing",
  ],
];

function saved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function healthOf(items: Indicator[]) {
  if (!items.length) return null;
  const totals = items.reduce(
    (sum, item) =>
      sum + Math.min(item.current / Math.max(item.target, 1), 1) * item.weight,
    0,
  );
  const weights = items.reduce((sum, item) => sum + item.weight, 0);
  return Math.round((totals / weights) * 100);
}

function tone(score: number | null) {
  if (score === null) return "neutral";
  if (score >= 80) return "good";
  if (score >= 60) return "watch";
  return "risk";
}

function formatValue(value: number, unit: string) {
  return unit === "€ mln"
    ? `€ ${value} mln`
    : `${value.toLocaleString("nl-NL")} ${unit}`;
}

function App() {
  const [page, setPage] = useState<Page>("paths");
  const [paths, setPaths] = useState<Path[]>(() =>
    saved("ce-paths", initialPaths),
  );
  const [selectedPathId, setSelectedPathId] = useState("bouw");
  const [selectedPhase, setSelectedPhase] = useState("fase1");
  const [activeTab, setActiveTab] = useState(0);
  const [pathMenuOpen, setPathMenuOpen] = useState(true);
  const [addPathOpen, setAddPathOpen] = useState(false);
  const [newPathName, setNewPathName] = useState("");
  const [selectedGate, setSelectedGate] = useState<{
    road: Road;
    year: number;
  } | null>(null);
  const [panelTab, setPanelTab] = useState<
    "indicatoren" | "regels" | "inzichten"
  >("indicatoren");
  const [indicators, setIndicators] = useState<Record<string, Indicator[]>>(
    () => saved("ce-indicators", initialIndicators),
  );
  const [rules] = useState<Rule[]>(() => saved("ce-rules", initialRules));
  const [roads, setRoads] = useState<Road[]>(initialRoads);
  const [years, setYears] = useState([2027, 2028, 2029]);
  const [newIndicatorOpen, setNewIndicatorOpen] = useState(false);
  const [indicatorName, setIndicatorName] = useState("");
  const [indicatorCurrent, setIndicatorCurrent] = useState("");
  const [indicatorTarget, setIndicatorTarget] = useState("");
  const [indicatorUnit, setIndicatorUnit] = useState("%");
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(0);
  const [toast, setToast] = useState("");

  const selectedPath =
    paths.find((path) => path.id === selectedPathId) ?? paths[0];
  const phase = phases.find((item) => item.id === selectedPhase) ?? phases[0];

  useEffect(() => {
    localStorage.setItem("ce-paths", JSON.stringify(paths));
  }, [paths]);
  useEffect(() => {
    localStorage.setItem("ce-indicators", JSON.stringify(indicators));
  }, [indicators]);
  useEffect(() => {
    localStorage.setItem("ce-rules", JSON.stringify(rules));
  }, [rules]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openPath(id: string) {
    setSelectedPathId(id);
    setSelectedPhase("fase1");
    setActiveTab(0);
    setPage("path-detail");
  }

  function addPath() {
    const name = newPathName.trim();
    if (!name) return;
    const id = `pad-${Date.now()}`;
    const path: Path = {
      id,
      name,
      color: "#df4d20",
      health: 0,
      description: "Een nieuw transitiepad voor de circulaire stad.",
      status: "Gepland",
    };
    setPaths((current) => [...current, path]);
    setNewPathName("");
    setAddPathOpen(false);
    openPath(id);
    setToast("Transitiepad toegevoegd");
  }

  function saveIndicator() {
    if (
      !selectedGate ||
      !indicatorName.trim() ||
      !indicatorCurrent ||
      !indicatorTarget
    )
      return;
    const key = `${selectedGate.road.id}-${selectedGate.year}`;
    const item: Indicator = {
      id: `indicator-${Date.now()}`,
      name: indicatorName.trim(),
      category: "Algemeen",
      current: Number(indicatorCurrent),
      target: Number(indicatorTarget),
      unit: indicatorUnit,
      weight: 2,
      confidence: 90,
      note: "Handmatig toegevoegd.",
    };
    setIndicators((current) => ({
      ...current,
      [key]: [...(current[key] ?? []), item],
    }));
    setIndicatorName("");
    setIndicatorCurrent("");
    setIndicatorTarget("");
    setNewIndicatorOpen(false);
    setToast("Indicator opgeslagen; gate health is bijgewerkt");
  }

  const goTo = (next: Page) => {
    setPage(next);
    setSelectedGate(null);
    if (next !== "path-detail") setSelectedPathId("bouw");
  };

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        goTo={goTo}
        paths={paths}
        selectedPathId={selectedPathId}
        openPath={openPath}
        pathMenuOpen={pathMenuOpen}
        setPathMenuOpen={setPathMenuOpen}
        onAddPath={() => setAddPathOpen(true)}
      />
      <main
        className={`workspace ${selectedGate && page === "roadmap" ? "workspace-panel-open" : ""}`}
      >
        {page === "paths" && (
          <PathsOverview
            paths={paths}
            onOpenPath={openPath}
            onOpenPhase={(id, phaseId) => {
              openPath(id);
              setSelectedPhase(phaseId);
            }}
          />
        )}
        {page === "path-detail" && (
          <PathDetail
            path={selectedPath}
            phase={phase}
            selectedPhase={selectedPhase}
            setSelectedPhase={setSelectedPhase}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBack={() => setPage("paths")}
          />
        )}
        {page === "dashboard" && (
          <Dashboard
            paths={paths}
            onOpenPath={openPath}
            onOpenRoadmap={() => setPage("roadmap")}
          />
        )}
        {page === "roadmap" && (
          <Roadmap
            roads={roads}
            years={years}
            indicators={indicators}
            onSelectGate={(road, year) => {
              setSelectedGate({ road, year });
              setPanelTab("indicatoren");
            }}
            onAddRoad={(name) =>
              setRoads((items) => [
                ...items,
                { id: `road-${Date.now()}`, name, color: "#2860a8" },
              ])
            }
            onAddYear={(year) => setYears((items) => [...items, year].sort())}
          />
        )}
        {page === "assets" && (
          <Assets
            search={search}
            setSearch={setSearch}
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
          />
        )}
        {page === "scenarios" && <Scenarios />}
        {page === "indicators" && (
          <IndicatorsOverview
            indicators={indicators}
            search={search}
            setSearch={setSearch}
          />
        )}
        {page === "measures" && <Measures />}
        {page === "reports" && <Reports paths={paths} />}
        {page === "settings" && <Settings />}
      </main>
      {selectedGate && page === "roadmap" && (
        <GatePanel
          road={selectedGate.road}
          year={selectedGate.year}
          indicators={
            indicators[`${selectedGate.road.id}-${selectedGate.year}`] ?? []
          }
          rules={rules.filter((rule) => rule.road === selectedGate.road.name)}
          tab={panelTab}
          setTab={setPanelTab}
          onClose={() => setSelectedGate(null)}
          onAdd={() => setNewIndicatorOpen(true)}
        />
      )}
      {newIndicatorOpen && selectedGate && (
        <IndicatorForm
          name={indicatorName}
          setName={setIndicatorName}
          current={indicatorCurrent}
          setCurrent={setIndicatorCurrent}
          target={indicatorTarget}
          setTarget={setIndicatorTarget}
          unit={indicatorUnit}
          setUnit={setIndicatorUnit}
          onClose={() => setNewIndicatorOpen(false)}
          onSave={saveIndicator}
        />
      )}
      {addPathOpen && (
        <Modal title="Nieuw transitiepad" onClose={() => setAddPathOpen(false)}>
          <p className="modal-copy">
            Voeg een sector of thema toe aan de Haagse circulaire routekaart.
          </p>
          <label className="field-label" htmlFor="path-name">
            Naam van het transitiepad
          </label>
          <input
            id="path-name"
            className="text-input"
            autoFocus
            placeholder="Bijv. Voedsel & landbouw"
            value={newPathName}
            onChange={(event) => setNewPathName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addPath();
            }}
          />
          <div className="modal-actions">
            <button
              className="button button-quiet"
              onClick={() => setAddPathOpen(false)}
            >
              Annuleren
            </button>
            <button
              className="button button-primary"
              onClick={addPath}
              disabled={!newPathName.trim()}
            >
              <Plus size={15} /> Pad toevoegen
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast">
          <Check size={15} /> {toast}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  page,
  goTo,
  paths,
  selectedPathId,
  openPath,
  pathMenuOpen,
  setPathMenuOpen,
  onAddPath,
}: {
  page: Page;
  goTo: (page: Page) => void;
  paths: Path[];
  selectedPathId: string;
  openPath: (id: string) => void;
  pathMenuOpen: boolean;
  setPathMenuOpen: (open: boolean) => void;
  onAddPath: () => void;
}) {
  const primary = [
    { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { id: "paths" as Page, label: "Transitiepaden", icon: Leaf },
    { id: "roadmap" as Page, label: "Programmaroutekaart", icon: Activity },
    { id: "assets" as Page, label: "Documenten & assets", icon: FileText },
  ];
  const modules = [
    { id: "scenarios" as Page, label: "Scenario's", icon: SlidersHorizontal },
    { id: "indicators" as Page, label: "Indicatoren", icon: Gauge },
    { id: "measures" as Page, label: "Maatregelen", icon: ClipboardList },
    { id: "reports" as Page, label: "Rapportages", icon: BookOpen },
  ];
  return (
    <aside className="sidebar">
      <button
        className="brand"
        onClick={() => goTo("paths")}
        aria-label="Ga naar startpagina"
      >
        <span className="brand-mark">
          <Building2 size={19} strokeWidth={2.1} />
        </span>
        <span className="brand-copy">
          <strong>Transitie Roadmap</strong>
          <small>Circulaire economie · Den Haag</small>
        </span>
      </button>
      <nav className="side-nav" aria-label="Hoofdnavigatie">
        <span className="nav-caption">Werkruimte</span>
        {primary.map(({ id, label, icon: Icon }) => (
          <NavItem
            key={id}
            icon={<Icon size={16} />}
            label={label}
            active={page === id || (id === "paths" && page === "path-detail")}
            onClick={() => goTo(id)}
          />
        ))}
        {page === "paths" || page === "path-detail" ? (
          <div className="path-nav">
            <button
              className="path-nav-heading"
              onClick={() => setPathMenuOpen(!pathMenuOpen)}
            >
              <span>Transitiepaden</span>
              <ChevronDown
                size={14}
                className={pathMenuOpen ? "" : "rotated"}
              />
            </button>
            {pathMenuOpen && (
              <div className="path-nav-list">
                {paths.map((path) => (
                  <button
                    key={path.id}
                    className={`path-nav-item ${page === "path-detail" && selectedPathId === path.id ? "selected" : ""}`}
                    onClick={() => openPath(path.id)}
                  >
                    <span
                      className="path-dot"
                      style={{ background: path.color }}
                    />
                    {path.name}
                  </button>
                ))}
                <button className="path-nav-add" onClick={onAddPath}>
                  <Plus size={14} /> Pad toevoegen
                </button>
              </div>
            )}
          </div>
        ) : null}
        <span className="nav-caption nav-caption-spaced">Inzicht</span>
        {modules.map(({ id, label, icon: Icon }) => (
          <NavItem
            key={id}
            icon={<Icon size={16} />}
            label={label}
            active={page === id}
            onClick={() => goTo(id)}
          />
        ))}
      </nav>
      <div className="sidebar-bottom">
        <NavItem
          icon={<Settings2 size={16} />}
          label="Instellingen"
          active={page === "settings"}
          onClick={() => goTo("settings")}
        />
        <div className="profile">
          <span className="avatar">DH</span>
          <span>
            <strong>Gemeente Den Haag</strong>
            <small>Beheerteam</small>
          </span>
          <MoreHorizontal size={16} />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {active && <span className="nav-active-mark" />}
    </button>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </header>
  );
}

function PathsOverview({
  paths,
  onOpenPath,
  onOpenPhase,
}: {
  paths: Path[];
  onOpenPath: (id: string) => void;
  onOpenPhase: (id: string, phase: string) => void;
}) {
  const shifts = [
    { label: "Product-as-a-Service", from: "Eigendom", to: "Gebruik" },
    { label: "Circulaire infrastructuur", from: "Afvalbak", to: "Inleverpunt" },
    {
      label: "Van afval naar grondstof",
      from: "Verbranding",
      to: "Hergebruik",
    },
    { label: "Regierol gemeente", from: "Uitvoerder", to: "Ketenregisseur" },
  ];
  return (
    <div className="page-content overview-page">
      <div className="overview-hero">
        <div className="hero-overline">
          <span className="hero-pulse" /> DEN HAAG · CIRCULAIRE ECONOMIE
        </div>
        <h1>
          Den Haag <span>Circulaire Stad 2050</span>
        </h1>
        <p>
          Een toekomstbestendige lokale economie waarin producten en materialen
          langer meegaan, lokale ondernemers kansen krijgen en de stad minder
          afhankelijk wordt van schaarse grondstoffen.
        </p>
        <button
          className="button button-light"
          onClick={() => onOpenPath(paths[0].id)}
        >
          Bekijk de routekaart <ArrowRight size={15} />
        </button>
        <div className="hero-index">
          01 <span>/</span> 04
        </div>
      </div>
      <div className="section-topline">
        <div>
          <span className="eyebrow">De route naar 2050</span>
          <h2>Vier transitiepaden</h2>
        </div>
        <button
          className="button button-quiet"
          onClick={() => onOpenPath(paths[0].id)}
        >
          Alle paden <ArrowRight size={15} />
        </button>
      </div>
      <div className="path-card-grid">
        {paths.map((path, index) => (
          <button
            className="path-card"
            key={path.id}
            onClick={() => onOpenPath(path.id)}
          >
            <div className="path-card-top">
              <span className="path-number">0{index + 1}</span>
              <span
                className={`status status-${path.status === "Actief" ? "active" : "planned"}`}
              >
                <i />
                {path.status}
              </span>
            </div>
            <span
              className="path-card-symbol"
              style={{ color: path.color, background: `${path.color}12` }}
            >
              <Leaf size={19} />
            </span>
            <h3>{path.name}</h3>
            <p>{path.description}</p>
            <span className="path-card-footer">
              Bekijk transitiepad <ArrowRight size={14} />
            </span>
          </button>
        ))}
      </div>
      <section className="timeline-section">
        <div className="section-topline">
          <div>
            <span className="eyebrow">2027 — 2050</span>
            <h2>Tijdlijn richting 2050</h2>
          </div>
          <span className="section-note">
            Selecteer een fase voor de uitwerking
          </span>
        </div>
        <div className="timeline-frame">
          <div className="timeline-scroll">
            <div className="timeline-grid timeline-header">
              <div className="timeline-label">TRANSITIEPAD</div>
              {phases.map((item, index) => (
                <div className="phase-head" key={item.id}>
                  <span>
                    FASE 0{index + 1} <i>·</i> {item.period}
                  </span>
                  <strong>{item.name}</strong>
                </div>
              ))}
              <div className="end-state-head">
                <span>EINDDOEL</span>
                <strong>Circulaire stad</strong>
              </div>
            </div>
            {paths.map((path, index) => (
              <div className="timeline-grid timeline-row" key={path.id}>
                <button
                  className="timeline-label path-label"
                  onClick={() => onOpenPath(path.id)}
                >
                  <span
                    className="path-dot"
                    style={{ background: path.color }}
                  />
                  {path.name}
                  <ChevronRight size={14} />
                </button>
                {phases.map((item, phaseIndex) => (
                  <button
                    className="phase-cell"
                    key={item.id}
                    onClick={() => onOpenPhase(path.id, item.id)}
                  >
                    <span className="phase-cell-label">
                      {
                        [
                          "Verkennen & organiseren",
                          "Versnellen & verbinden",
                          "Normeren & verankeren",
                          "Borgen & uitfaseren",
                        ][phaseIndex]
                      }
                    </span>
                    <span className="phase-cell-meta">
                      Open fase <ArrowRight size={12} />
                    </span>
                  </button>
                ))}
                <div className="end-state">
                  <span>2050 RESULTAAT</span>
                  <strong>
                    {
                      [
                        "Waardebehoud in de stad",
                        "Gesloten materiaalketens",
                        "Circulaire verdienmodellen",
                        "Toekomstbestendige ruimte",
                      ][index % 4]
                    }
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="shift-section">
        <div className="section-topline">
          <div>
            <span className="eyebrow">Een ander systeem</span>
            <h2>De verschuiving in beeld</h2>
          </div>
          <span className="section-note">
            Voorbeelden van mogelijke transitierichtingen
          </span>
        </div>
        <div className="shift-grid">
          {shifts.map((item, index) => (
            <div className="shift-item" key={item.label}>
              <span className="shift-index">0{index + 1} / VOORBEELD</span>
              <strong>{item.label}</strong>
              <div className="shift-flow">
                <span>
                  <small>VAN</small>
                  {item.from}
                </span>
                <ArrowRight size={15} />
                <span>
                  <small>NAAR</small>
                  {item.to}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PathDetail({
  path,
  phase,
  selectedPhase,
  setSelectedPhase,
  activeTab,
  setActiveTab,
  onBack,
}: {
  path: Path;
  phase: Phase;
  selectedPhase: string;
  setSelectedPhase: (id: string) => void;
  activeTab: number;
  setActiveTab: (index: number) => void;
  onBack: () => void;
}) {
  const [focusItems, setFocusItems] = useState([
    "Nieuwe structuren, praktijken en spelers die nodig zijn",
    "Bestaande elementen omvormen naar de gewenste richting",
    "Wat moet worden afgebouwd of uitgefaseerd?",
  ]);
  const [addingFocus, setAddingFocus] = useState(false);
  const [focusDraft, setFocusDraft] = useState("");
  const milestones =
    path.id === "bouw" && selectedPhase === "fase1"
      ? [
          ["12 proefwijken aardgasvrij aangewezen", "Gereed"],
          ["Subsidieregeling warmtepompen operationeel", "Gereed"],
          ["45.000 woningrenovaties voltooid", "Lopend"],
          ["Renovatiestandaard vastgesteld", "Gepland"],
        ]
      : [
          ["Sectorakkoord ondertekend", "Gereed"],
          [
            "Pilotprogramma gestart",
            selectedPhase === "fase1" ? "Lopend" : "Gepland",
          ],
          ["Eerste meetbare CO₂-reductie gerealiseerd", "Gepland"],
        ];
  const content =
    selectedPhase === "fase1" && path.id === "bouw"
      ? "De eerste fase richt zich op het optimaliseren van bestaande renovatieprocessen en het opschalen van warmtepomptechnologie. Gemeenten starten met proefwijken voor aardgasvrij wonen. Kennisuitwisseling en capaciteitsopbouw staan centraal."
      : `De fase ${phase.name.toLowerCase()} richt zich op het behalen van de transitiedoelen voor ${phase.period}. Maatregelen en samenwerkingen worden afgestemd met betrokken partijen uit de sector.`;
  const question = phaseQuestions[activeTab][0];
  const attentionItems =
    activeTab === 0 ? focusItems : phaseQuestions[activeTab].slice(1);
  return (
    <div className="detail-layout">
      <aside className="detail-nav">
        <button
          className="icon-button back-button"
          onClick={onBack}
          aria-label="Terug naar transitiepaden"
        >
          <ArrowLeft size={17} />
        </button>
        <span className="eyebrow">PADUITWERKING</span>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`detail-tab ${activeTab === index ? "selected" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </aside>
      <section className="detail-main">
        <div className="detail-title-row">
          <span
            className="path-card-symbol"
            style={{ color: path.color, background: `${path.color}12` }}
          >
            <Leaf size={20} />
          </span>
          <div>
            <span className="eyebrow">{path.name} · Den Haag 2050</span>
            <h1>{path.name}</h1>
            <p>{path.description}</p>
          </div>
          <button className="icon-button more-button" aria-label="Meer opties">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="phase-picker">
          {phases.map((item, index) => (
            <button
              key={item.id}
              className={`phase-option ${selectedPhase === item.id ? "selected" : ""}`}
              onClick={() => {
                setSelectedPhase(item.id);
                setActiveTab(0);
              }}
            >
              <span className="phase-option-top">
                <i>{index + 1}</i>
                {item.period}
              </span>
              <strong>{item.name}</strong>
              <small>
                {index === 0 ? "Fase van verandering" : "Fase verder uitwerken"}
              </small>
            </button>
          ))}
        </div>
        <div className="detail-body">
          <div className="detail-body-heading">
            <span className="eyebrow">
              {phase.period} · FASE{" "}
              {phases.findIndex((item) => item.id === selectedPhase) + 1}
            </span>
            <h2>
              {activeTab === 0 ? "Gewenste verandering" : tabs[activeTab]}
            </h2>
          </div>
          {activeTab === 0 ? (
            <>
              <div className="summary-panel">
                <span className="summary-icon">
                  <Lightbulb size={17} />
                </span>
                <div>
                  <span className="eyebrow">FASEROUTE</span>
                  <p>{content}</p>
                </div>
              </div>
              <div className="detail-columns">
                <section className="milestone-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">WAT IS NODIG</span>
                      <h3>Mijlpalen</h3>
                    </div>
                    <span className="count-badge">{milestones.length}</span>
                  </div>
                  {milestones.map(([label, status]) => (
                    <div className="milestone-row" key={label}>
                      <span
                        className={`milestone-state state-${status.toLowerCase()}`}
                      >
                        {status === "Gereed" ? <Check size={12} /> : null}
                      </span>
                      <span>{label}</span>
                      <span
                        className={`milestone-tag tag-${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </section>
                <section className="phase-note-panel">
                  <span className="eyebrow">RICHTING</span>
                  <h3>Van intentie naar uitvoering</h3>
                  <p>
                    Maak de stap naar de volgende fase concreet met heldere
                    afspraken, eigenaarschap en toetsbare resultaten.
                  </p>
                  <span className="phase-note-period">
                    <Activity size={14} /> {phase.period}
                  </span>
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="question-panel">
                <span className="question-icon">
                  <CircleHelp size={17} />
                </span>
                <div>
                  <span className="eyebrow">LEIDENDE VRAAG</span>
                  <p>{question}</p>
                </div>
              </div>
              <section className="focus-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">{phase.period}</span>
                    <h3>Aandachtspunten</h3>
                  </div>
                  <span className="count-badge">{attentionItems.length}</span>
                </div>
                {attentionItems.map((item, index) => (
                  <div className="focus-row" key={item}>
                    <span className="focus-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
                {activeTab === 0 &&
                  (addingFocus ? (
                    <div className="focus-add">
                      <input
                        className="text-input"
                        placeholder="Nieuw aandachtspunt"
                        value={focusDraft}
                        onChange={(event) => setFocusDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && focusDraft.trim()) {
                            setFocusItems([...focusItems, focusDraft.trim()]);
                            setFocusDraft("");
                            setAddingFocus(false);
                          }
                        }}
                      />
                      <button
                        className="icon-button"
                        onClick={() => setAddingFocus(false)}
                        aria-label="Annuleren"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-row"
                      onClick={() => setAddingFocus(true)}
                    >
                      <Plus size={15} /> Aandachtspunt toevoegen
                    </button>
                  ))}
              </section>
              <div className="empty-section">
                <Sparkles size={17} />
                <div>
                  <strong>Ruimte voor verdere uitwerking</strong>
                  <span>
                    De inhoud voor dit onderwerp kan samen met de betrokken
                    partijen worden aangevuld.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Dashboard({
  paths,
  onOpenPath,
  onOpenRoadmap,
}: {
  paths: Path[];
  onOpenPath: (id: string) => void;
  onOpenRoadmap: () => void;
}) {
  return (
    <div className="page-content dashboard-page">
      <PageHeading
        eyebrow="OVERZICHT · 2027–2050"
        title="Dashboard"
        description="Voortgang en aandachtspunten voor de circulaire transitie in Den Haag."
        actions={
          <button className="button button-primary" onClick={onOpenRoadmap}>
            <Activity size={15} /> Programmaroutekaart
          </button>
        }
      />
      <div className="metric-grid">
        <Metric
          label="Transitiepaden"
          value={`${paths.length}`}
          note="4 actief in de routekaart"
          icon={<Leaf size={17} />}
          tone="orange"
        />
        <Metric
          label="Gemiddelde voortgang"
          value="69%"
          note="+4% ten opzichte van Q1"
          icon={<ArrowUpRight size={17} />}
          tone="green"
        />
        <Metric
          label="Mijlpalen dit jaar"
          value="12 / 18"
          note="6 mijlpalen in uitvoering"
          icon={<Check size={17} />}
          tone="blue"
        />
        <Metric
          label="Aandacht nodig"
          value="3"
          note="Verspreid over 2 transitiepaden"
          icon={<ShieldAlert size={17} />}
          tone="red"
        />
      </div>
      <div className="dashboard-columns">
        <section className="content-panel path-progress-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">VOORTGANG PER PAD</span>
              <h3>Transitiepaden</h3>
            </div>
            <button
              className="text-action"
              onClick={() => onOpenPath(paths[0].id)}
            >
              Bekijk routekaart <ArrowRight size={14} />
            </button>
          </div>
          {paths.map((path) => (
            <button
              className="progress-row"
              key={path.id}
              onClick={() => onOpenPath(path.id)}
            >
              <span className="path-dot" style={{ background: path.color }} />
              <span className="progress-name">
                {path.name}
                <small>{path.status}</small>
              </span>
              <span className="progress-track">
                <i
                  style={{ width: `${path.health}%`, background: path.color }}
                />
              </span>
              <strong>{path.health}%</strong>
              <ChevronRight size={15} />
            </button>
          ))}
        </section>
        <section className="content-panel alert-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">VROEGSIGNALEN</span>
              <h3>Aandachtspunten</h3>
            </div>
            <span className="count-badge count-warn">3</span>
          </div>
          <div className="alert-row">
            <span className="alert-symbol warning">
              <ShieldAlert size={15} />
            </span>
            <div>
              <strong>Budget blijft achter op doel</strong>
              <p>Gate 2027 · Beschikbaar budget op 80% van doelwaarde.</p>
            </div>
            <ArrowRight size={14} />
          </div>
          <div className="alert-row">
            <span className="alert-symbol insight">
              <Lightbulb size={15} />
            </span>
            <div>
              <strong>Woningregistratie vraagt versnelling</strong>
              <p>Gerichte campagne aanbevolen voor wijken 4 en 7.</p>
            </div>
            <ArrowRight size={14} />
          </div>
          <div className="alert-row">
            <span className="alert-symbol progress">
              <Activity size={15} />
            </span>
            <div>
              <strong>Renovatieteams op schema</strong>
              <p>45.000 renovaties als tussenmijlpaal voor 2030.</p>
            </div>
            <ArrowRight size={14} />
          </div>
        </section>
      </div>
      <section className="content-panel activity-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">LAATSTE UPDATES</span>
            <h3>Recente activiteit</h3>
          </div>
          <button className="icon-button" aria-label="Meer activiteit">
            <MoreHorizontal size={18} />
          </button>
        </div>
        {[
          [
            "10:42",
            "Politiek draagvlak bijgewerkt",
            "Indicator · Beleid Gate 2027",
            "update",
          ],
          [
            "Gisteren",
            "Budget-road herberekend",
            "Automatische analyse · Gate 2027",
            "auto",
          ],
          [
            "21 okt",
            "Nieuwe aanbeveling gegenereerd",
            "Inwoners · Registratiecampagne",
            "insight",
          ],
        ].map(([time, title, detail, type]) => (
          <div className="activity-row" key={title}>
            <span className="activity-time">{time}</span>
            <span className={`activity-icon activity-${type}`}>
              {type === "insight" ? (
                <Sparkles size={14} />
              ) : type === "auto" ? (
                <Activity size={14} />
              ) : (
                <Check size={14} />
              )}
            </span>
            <span className="activity-copy">
              <strong>{title}</strong>
              <small>{detail}</small>
            </span>
            <span className="activity-user">DH</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon,
  tone: color,
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <div className="metric-card">
      <span className={`metric-icon metric-${color}`}>{icon}</span>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function Roadmap({
  roads,
  years,
  indicators,
  onSelectGate,
  onAddRoad,
  onAddYear,
}: {
  roads: Road[];
  years: number[];
  indicators: Record<string, Indicator[]>;
  onSelectGate: (road: Road, year: number) => void;
  onAddRoad: (name: string) => void;
  onAddYear: (year: number) => void;
}) {
  const [addingRoad, setAddingRoad] = useState(false);
  const [roadName, setRoadName] = useState("");
  const [addingYear, setAddingYear] = useState(false);
  const [year, setYear] = useState("");
  return (
    <div className="page-content roadmap-page">
      <PageHeading
        eyebrow="PROGRAMMA · ENERGIETRANSITIE"
        title="Van gas naar elektrisch verwarmen"
        description="Voltooi de transitie van 45.000 woningen vóór 2030."
        actions={
          <button className="button button-quiet">
            <Bell size={15} /> Updates{" "}
            <span className="notification-count">3</span>
          </button>
        }
      />
      <div className="roadmap-summary">
        <span>
          <i className="summary-dot" /> Programma loopt
        </span>
        <span>Laatste update: vandaag, 10:42</span>
        <button className="text-action">
          Doel bewerken <ChevronRight size={14} />
        </button>
      </div>
      <section className="roadmap-table-wrap">
        <div className="roadmap-table">
          <div
            className="roadmap-head roadmap-grid"
            style={{
              gridTemplateColumns: `minmax(175px, 1.1fr) repeat(${years.length}, minmax(145px, 1fr))`,
            }}
          >
            <span>WERKSTROOM</span>
            {years.map((item) => (
              <span className="gate-heading" key={item}>
                Gate {item}
                <small>Beslismoment</small>
              </span>
            ))}
          </div>
          {roads.map((road) => (
            <div
              className="roadmap-grid roadmap-row"
              key={road.id}
              style={{
                gridTemplateColumns: `minmax(175px, 1.1fr) repeat(${years.length}, minmax(145px, 1fr))`,
              }}
            >
              <div className="road-label">
                <span className="path-dot" style={{ background: road.color }} />
                <strong>{road.name}</strong>
                <small>
                  {Math.round(
                    years.reduce(
                      (sum, item) =>
                        sum +
                        (healthOf(indicators[`${road.id}-${item}`] ?? []) ?? 0),
                      0,
                    ) / years.length,
                  )}
                  % gemiddelde gezondheid
                </small>
              </div>
              {years.map((item) => {
                const score = healthOf(indicators[`${road.id}-${item}`] ?? []);
                return (
                  <button
                    className="gate-cell"
                    key={item}
                    onClick={() => onSelectGate(road, item)}
                  >
                    <span className={`health-ring ring-${tone(score)}`}>
                      {score === null ? <Plus size={17} /> : `${score}%`}
                    </span>
                    <span className="gate-cell-note">
                      {indicators[`${road.id}-${item}`]?.length ?? 0}{" "}
                      indicatoren
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>
      <div className="roadmap-actions">
        {addingRoad ? (
          <form
            className="inline-add"
            onSubmit={(event) => {
              event.preventDefault();
              if (roadName.trim()) onAddRoad(roadName.trim());
              setRoadName("");
              setAddingRoad(false);
            }}
          >
            <input
              className="text-input"
              autoFocus
              placeholder="Naam werkstroom"
              value={roadName}
              onChange={(event) => setRoadName(event.target.value)}
            />
            <button className="button button-primary" type="submit">
              Toevoegen
            </button>
            <button
              className="icon-button"
              onClick={() => setAddingRoad(false)}
              type="button"
              aria-label="Annuleren"
            >
              <X size={15} />
            </button>
          </form>
        ) : (
          <button
            className="button button-quiet"
            onClick={() => setAddingRoad(true)}
          >
            <Plus size={15} /> Werkstroom toevoegen
          </button>
        )}
        {addingYear ? (
          <form
            className="inline-add"
            onSubmit={(event) => {
              event.preventDefault();
              const value = Number(year);
              if (value > 2024 && value < 2051 && !years.includes(value))
                onAddYear(value);
              setYear("");
              setAddingYear(false);
            }}
          >
            <input
              className="text-input year-input"
              type="number"
              min="2025"
              max="2050"
              placeholder="Jaar"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
            <button className="button button-primary" type="submit">
              Toevoegen
            </button>
            <button
              className="icon-button"
              onClick={() => setAddingYear(false)}
              type="button"
              aria-label="Annuleren"
            >
              <X size={15} />
            </button>
          </form>
        ) : (
          <button
            className="button button-quiet"
            onClick={() => setAddingYear(true)}
          >
            <Plus size={15} /> Gate toevoegen
          </button>
        )}
      </div>
      <div className="roadmap-footnote">
        <CircleHelp size={14} /> Gate health wordt gewogen berekend op basis van
        de actuele indicatoren.
      </div>
    </div>
  );
}

function GatePanel({
  road,
  year,
  indicators,
  rules,
  tab,
  setTab,
  onClose,
  onAdd,
}: {
  road: Road;
  year: number;
  indicators: Indicator[];
  rules: Rule[];
  tab: "indicatoren" | "regels" | "inzichten";
  setTab: (tab: "indicatoren" | "regels" | "inzichten") => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  const score = healthOf(indicators);
  return (
    <aside className="gate-panel">
      <header className="gate-panel-head">
        <button
          className="icon-button close-panel"
          onClick={onClose}
          aria-label="Sluit gate details"
        >
          <X size={17} />
        </button>
        <span className="eyebrow">
          <i className="path-dot" style={{ background: road.color }} />
          {road.name} · GATE {year}
        </span>
        <h2>Beslismoment {year}</h2>
        <span className={`health-label health-${tone(score)}`}>
          {score === null
            ? "Nog geen data"
            : `${score}% · ${score >= 80 ? "Op koers" : score >= 60 ? "Aandacht nodig" : "Kritiek"}`}
        </span>
      </header>
      <div className="gate-tabs">
        {(["indicatoren", "regels", "inzichten"] as const).map((item) => (
          <button
            key={item}
            className={tab === item ? "selected" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="gate-panel-body">
        {tab === "indicatoren" && (
          <>
            <div className="gate-panel-intro">
              <div>
                <strong>
                  {indicators.length} indicator
                  {indicators.length === 1 ? "" : "en"}
                </strong>
                <small>De voortgang wordt hier bijgehouden.</small>
              </div>
              <button
                className="button button-primary button-small"
                onClick={onAdd}
              >
                <Plus size={14} /> Toevoegen
              </button>
            </div>
            {indicators.length ? (
              indicators.map((item) => {
                const ratio = Math.min(
                  item.current / Math.max(item.target, 1),
                  1,
                );
                const itemScore = Math.round(ratio * 100);
                return (
                  <article className="indicator-card" key={item.id}>
                    <div className="indicator-card-top">
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.category} · {item.confidence}% zekerheid
                        </small>
                      </div>
                      <span
                        className={`indicator-score score-${tone(itemScore)}`}
                      >
                        {itemScore}%
                      </span>
                    </div>
                    <div className="indicator-track">
                      <i style={{ width: `${ratio * 100}%` }} />
                    </div>
                    <div className="indicator-values">
                      <span>
                        {formatValue(item.current, item.unit)}{" "}
                        <small>huidig</small>
                      </span>
                      <span>
                        {formatValue(item.target, item.unit)}{" "}
                        <small>doel</small>
                      </span>
                    </div>
                    {item.note && <p>{item.note}</p>}
                  </article>
                );
              })
            ) : (
              <div className="panel-empty">
                <Gauge size={20} />
                <strong>Nog geen indicatoren</strong>
                <span>
                  Voeg een indicator toe om de voortgang van deze gate te
                  volgen.
                </span>
              </div>
            )}
          </>
        )}
        {tab === "regels" &&
          (rules.length ? (
            rules.map((rule) => (
              <article className="rule-card" key={rule.indicator}>
                <span className={`rule-status ${rule.active ? "on" : ""}`}>
                  <i />
                  {rule.active ? "Actief" : "Inactief"}
                </span>
                <div className="rule-condition">
                  <strong>{rule.indicator}</strong> {rule.operator}{" "}
                  <strong>{rule.value}</strong>
                </div>
                <p>{rule.recommendation}</p>
              </article>
            ))
          ) : (
            <div className="panel-empty">
              <ClipboardList size={20} />
              <strong>Geen regels voor deze werkstroom</strong>
            </div>
          ))}
        {tab === "inzichten" && (
          <div className="insight-card">
            <span className={`health-label health-${tone(score)}`}>
              {score === null
                ? "Geen data"
                : `${score}% · ${score >= 80 ? "Op koers" : score >= 60 ? "Aandacht nodig" : "Kritiek"}`}
            </span>
            <p>
              {score === null
                ? "Voeg indicatoren toe om een voortgangssignaal te ontvangen."
                : score >= 80
                  ? `De werkstroom ${road.name.toLowerCase()} ligt op koers voor Gate ${year}.`
                  : `De werkstroom ${road.name.toLowerCase()} vraagt aandacht vóór Gate ${year}.`}
            </p>
            {rules
              .filter((rule) => rule.active)
              .map((rule) => (
                <div className="recommendation" key={rule.indicator}>
                  <Sparkles size={14} />
                  {rule.recommendation}
                </div>
              ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function IndicatorForm({
  name,
  setName,
  current,
  setCurrent,
  target,
  setTarget,
  unit,
  setUnit,
  onClose,
  onSave,
}: {
  name: string;
  setName: (value: string) => void;
  current: string;
  setCurrent: (value: string) => void;
  target: string;
  setTarget: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Modal title="Nieuwe indicator" onClose={onClose}>
      <p className="modal-copy">
        Leg een meetpunt vast voor de geselecteerde gate.
      </p>
      <label className="field-label" htmlFor="indicator-name">
        Naam
      </label>
      <input
        id="indicator-name"
        className="text-input"
        autoFocus
        placeholder="Bijv. Energielabel woningen"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="form-row">
        <div>
          <label className="field-label" htmlFor="indicator-current">
            Huidige waarde
          </label>
          <input
            id="indicator-current"
            className="text-input"
            type="number"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="indicator-target">
            Doelwaarde
          </label>
          <input
            id="indicator-target"
            className="text-input"
            type="number"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="indicator-unit">
            Eenheid
          </label>
          <input
            id="indicator-unit"
            className="text-input"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          />
        </div>
      </div>
      <div className="modal-actions">
        <button className="button button-quiet" onClick={onClose}>
          Annuleren
        </button>
        <button
          className="button button-primary"
          disabled={!name.trim() || !current || !target}
          onClick={onSave}
        >
          Indicator opslaan
        </button>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Sluiten"
          >
            <X size={17} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

const documents = [
  {
    title: "Gemeentelijke energiestrategie 2024–2030",
    type: "Strategiedocument",
    date: "Maart 2024",
    owner: "Directie Infrastructuur & Duurzaamheid",
    tags: ["Energie", "Klimaat", "Beleid"],
    summary:
      "De gemeente zet zich in om 45.000 woningen vóór 2030 over te laten stappen van aardgas naar elektrische alternatieven.",
    sections: [
      [
        "Financiële toewijzing",
        "Totaal programmabudget: € 15.000.000 voor de fase 2025–2027.",
        "€ 12.000.000 bevestigd",
      ],
      [
        "Politiek draagvlak",
        "Het huidige draagvlak binnen de gemeenteraad is 67%. Het programma vraagt om een structurele meerderheid van 75%.",
        "67% huidig draagvlak",
      ],
    ],
  },
  {
    title: "Haalbaarheidsstudie zonne-energie",
    type: "Haalbaarheidsstudie",
    date: "Juni 2024",
    owner: "Dienst Stedelijke Ontwikkeling",
    tags: ["Zonne-energie", "Infrastructuur"],
    summary:
      "Deze studie onderzoekt twaalf locaties voor de ontwikkeling van zonne-energie op gemeentelijk vastgoed.",
    sections: [
      [
        "Onderzochte locaties",
        "Van de twaalf onderzochte locaties zijn er acht geschikt voor verdere ontwikkeling.",
        "4,2 MW doelcapaciteit",
      ],
    ],
  },
];

function Assets({
  search,
  setSearch,
  selectedDocument,
  setSelectedDocument,
}: {
  search: string;
  setSearch: (value: string) => void;
  selectedDocument: number;
  setSelectedDocument: (index: number) => void;
}) {
  const filtered = documents
    .map((document, index) => ({ document, index }))
    .filter(
      ({ document }) =>
        document.title.toLowerCase().includes(search.toLowerCase()) ||
        document.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  const doc = documents[selectedDocument];
  return (
    <div className="page-content assets-page">
      <PageHeading
        eyebrow="KENNISBANK"
        title="Documenten & assets"
        description="Bronnen en beleidsdocumenten gekoppeld aan de transitie."
        actions={
          <button
            className="button button-primary"
            onClick={() =>
              alert(
                "Bestanden toevoegen is beschikbaar zodra de documentopslag is gekoppeld.",
              )
            }
          >
            <Plus size={15} /> Document toevoegen
          </button>
        }
      />
      <div className="asset-layout">
        <aside className="asset-list">
          <label className="search-field">
            <Search size={15} />
            <input
              placeholder="Zoek documenten"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <span className="eyebrow asset-list-label">
            DOCUMENTEN · {filtered.length}
          </span>
          {filtered.map(({ document, index }) => (
            <button
              key={document.title}
              className={`asset-row ${index === selectedDocument ? "selected" : ""}`}
              onClick={() => setSelectedDocument(index)}
            >
              <span className="asset-file-icon">
                <FileText size={16} />
              </span>
              <span>
                <strong>{document.title}</strong>
                <small>{document.type}</small>
                <span className="asset-tags">
                  {document.tags.map((tag) => (
                    <i key={tag}>{tag}</i>
                  ))}
                </span>
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="empty-search">Geen documenten gevonden.</p>
          )}
        </aside>
        <article className="asset-document">
          <div className="document-meta">
            <span className="eyebrow">{doc.type}</span>
            <span>{doc.date}</span>
          </div>
          <div className="document-tags">
            {doc.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h2>{doc.title}</h2>
          <p className="document-author">{doc.owner}</p>
          <div className="document-summary">
            <span className="eyebrow">SAMENVATTING</span>
            <p>{doc.summary}</p>
          </div>
          {doc.sections.map(([title, text, metric]) => (
            <section className="document-section" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="document-metric">
                <span>{metric}</span>
                <ArrowUpRight size={15} />
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}

function IndicatorsOverview({
  indicators,
  search,
  setSearch,
}: {
  indicators: Record<string, Indicator[]>;
  search: string;
  setSearch: (value: string) => void;
}) {
  const items = Object.entries(indicators)
    .flatMap(([key, values]) => values.map((item) => ({ ...item, key })))
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="MONITORING"
        title="Indicatoren"
        description="Volg de meetbare voortgang van programma's en transitiepaden."
      />
      <section className="content-panel data-panel">
        <div className="data-toolbar">
          <label className="search-field">
            <Search size={15} />
            <input
              placeholder="Zoek indicator"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button className="button button-quiet">
            <ListFilter size={15} /> Filter
          </button>
        </div>
        <div className="data-table">
          <div className="data-row data-head">
            <span>INDICATOR</span>
            <span>WERKSTROOM · GATE</span>
            <span>HUIDIG / DOEL</span>
            <span>VOORTGANG</span>
          </div>
          {items.map((item) => {
            const score = Math.round(
              Math.min(item.current / item.target, 1) * 100,
            );
            return (
              <div className="data-row" key={item.id}>
                <strong>
                  {item.name}
                  <small>{item.category}</small>
                </strong>
                <span>{item.key.replace("-", " · ")}</span>
                <span>
                  {formatValue(item.current, item.unit)} /{" "}
                  {formatValue(item.target, item.unit)}
                </span>
                <span className="table-progress">
                  <i>
                    <b style={{ width: `${score}%` }} />
                  </i>
                  {score}%
                </span>
              </div>
            );
          })}
        </div>
        {items.length === 0 && (
          <div className="panel-empty">Geen indicatoren gevonden.</div>
        )}
      </section>
    </div>
  );
}

function Measures() {
  const items = [
    ["ISDE-subsidie warmtepompen", "Financieel", "Actief", "€ 180 mln", "2030"],
    ["Verplicht energielabel bij verkoop", "Regulerend", "Actief", "—", "2028"],
    [
      "Uitbreiding Nationaal Warmtefonds",
      "Financieel",
      "Lopend",
      "€ 400 mln",
      "2032",
    ],
    [
      "Renovatiesteams in kwetsbare wijken",
      "Uitvoering",
      "Lopend",
      "€ 65 mln",
      "2031",
    ],
    ["Aardgasaansluitverbod nieuwbouw", "Regulerend", "Actief", "—", "2025"],
  ];
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="UITVOERING"
        title="Maatregelen"
        description="Beleidsinstrumenten en interventies binnen de energietransitie."
        actions={
          <button className="button button-primary">
            <Plus size={15} /> Maatregel toevoegen
          </button>
        }
      />
      <section className="content-panel data-panel">
        <div className="data-toolbar">
          <span className="eyebrow">5 MAATREGELEN · 3 ACTIEF</span>
          <button className="button button-quiet">
            <ListFilter size={15} /> Filter
          </button>
        </div>
        <div className="data-table measure-table">
          <div className="data-row data-head">
            <span>MAATREGEL</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span>BUDGET</span>
            <span>DEADLINE</span>
          </div>
          {items.map(([name, type, status, budget, deadline]) => (
            <div className="data-row" key={name}>
              <strong>{name}</strong>
              <span>{type}</span>
              <span>
                <i className="status-dot" />
                {status}
              </span>
              <span>{budget}</span>
              <span>{deadline}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Scenarios() {
  const [horizon, setHorizon] = useState("2035");
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="VOORUITKIJKEN"
        title="Scenario's"
        description="Verken mogelijke uitkomsten en hun impact op de transitie."
      />
      <div className="scenario-controls">
        <div>
          <span className="eyebrow">TIJDSHORIZON</span>
          <div className="segmented">
            {["2030", "2035", "2050"].map((year) => (
              <button
                key={year}
                className={horizon === year ? "selected" : ""}
                onClick={() => setHorizon(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <button className="button button-primary">
          <Sparkles size={15} /> Scenario vergelijken
        </button>
      </div>
      <div className="scenario-grid">
        {[
          [
            "Huidig beleid",
            "Gebaseerd op vastgestelde maatregelen en huidige uitvoeringssnelheid.",
            "62%",
            "Basisscenario",
          ],
          [
            "Versnelde samenwerking",
            "Extra inzet op wijkgerichte aanpak en publiek-private samenwerking.",
            horizon === "2030" ? "74%" : horizon === "2035" ? "81%" : "94%",
            "Kansrijk",
          ],
          [
            "Vertraagde uitvoering",
            "Lagere uitvoeringscapaciteit en uitstel van belangrijke investeringen.",
            "41%",
            "Risicoscenario",
          ],
        ].map(([title, description, value, label], index) => (
          <article className={`scenario-card scenario-${index}`} key={title}>
            <span className="eyebrow">{label}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="scenario-result">
              <strong>{value}</strong>
              <span>doelbereik in {horizon}</span>
            </div>
            <div className="scenario-track">
              <i style={{ width: value }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Reports({ paths }: { paths: Path[] }) {
  const [reportReady, setReportReady] = useState(false);
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="VERANTWOORDING"
        title="Rapportages"
        description="Maak voortgang en resultaten inzichtelijk voor bestuur en partners."
      />
      <div className="report-layout">
        <section className="content-panel report-builder">
          <span className="eyebrow">NIEUWE RAPPORTAGE</span>
          <h3>Stel je voortgangsrapport samen</h3>
          <p>
            Kies een periode en onderwerpen voor een overzicht van de transitie.
          </p>
          <label className="field-label" htmlFor="report-period">
            Rapportageperiode
          </label>
          <select id="report-period" className="text-input">
            <option>Q4 2026</option>
            <option>Q3 2026</option>
            <option>Jaaroverzicht 2026</option>
          </select>
          <span className="field-label">Onderwerpen</span>
          {[
            "Voortgang transitiepaden",
            "Mijlpalen en indicatoren",
            "Aandachtspunten en aanbevelingen",
          ].map((item) => (
            <label className="checkbox-row" key={item}>
              <input type="checkbox" defaultChecked />
              {item}
            </label>
          ))}
          <button
            className="button button-primary"
            onClick={() => setReportReady(true)}
          >
            <FileText size={15} /> Genereer rapportage
          </button>
          {reportReady && (
            <p className="success-note">
              <Check size={15} /> Rapportage voor Q4 2026 is samengesteld.
            </p>
          )}
        </section>
        <section className="content-panel report-preview">
          <span className="eyebrow">VOORBEELD · LAATSTE OVERZICHT</span>
          <h3>Circulaire economie</h3>
          <span className="preview-period">Q3 2026 · Den Haag</span>
          {paths.map((path) => (
            <div className="preview-path" key={path.id}>
              <span className="path-dot" style={{ background: path.color }} />
              <span>{path.name}</span>
              <strong>{path.health}%</strong>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="VOORKEUREN"
        title="Instellingen"
        description="Beheer meldingen en de weergave van je werkruimte."
      />
      <div className="settings-list">
        <section className="settings-section">
          <div>
            <span className="eyebrow">MELDINGEN</span>
            <h3>Updates voor je programma</h3>
            <p>
              Ontvang een melding wanneer indicatoren veranderen of een gate
              aandacht vraagt.
            </p>
          </div>
          <button
            className={`switch ${notifications ? "on" : ""}`}
            onClick={() => setNotifications(!notifications)}
            aria-label="Meldingen in- of uitschakelen"
          >
            <span />
          </button>
        </section>
        <section className="settings-section">
          <div>
            <span className="eyebrow">RAPPORTAGE</span>
            <h3>Periodieke samenvatting</h3>
            <p>
              Een maandelijks overzicht van voortgang, mijlpalen en
              aandachtspunten.
            </p>
          </div>
          <button
            className={`switch ${digest ? "on" : ""}`}
            onClick={() => setDigest(!digest)}
            aria-label="Samenvatting in- of uitschakelen"
          >
            <span />
          </button>
        </section>
        <section className="settings-section">
          <div>
            <span className="eyebrow">WERKRUIMTE</span>
            <h3>Gemeente Den Haag</h3>
            <p>Circulaire economie · Beheerteam</p>
          </div>
          <button className="button button-quiet">
            Organisatiegegevens <ChevronRight size={14} />
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
