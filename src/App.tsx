import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Plus,
  Route,
  Sparkles,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import "./ReferenceApp.css";

type AppRoute = {
  view: "dashboard" | "trajectory";
  trajectory: number;
  phase: number;
  topic: number;
};

const trajectories = [
  { name: "Transitiepad 1", color: "#ff3794", shape: "circle" },
  { name: "Transitiepad 2", color: "#04c689", shape: "square" },
  { name: "Transitiepad 3", color: "#8a29f3", shape: "triangle" },
  { name: "Transitiepad 4", color: "#ff8900", shape: "diamond" },
];

const phases = [
  { years: "2027–2035", title: "Optimalisatie & Innovatie" },
  { years: "2035–2040", title: "Opschaling & Versnelling" },
  { years: "2040–2045", title: "Institutionalisering & Afbouw" },
  { years: "2045–2050", title: "Stabilisatie & Uitfasering" },
];

const topics = [
  "Gewenste verandering",
  "Outcomes & mijlpalen",
  "Barrières & lock-ins",
  "Rol van de gemeente",
  "Beleid & instrumenten",
  "Investering & business case",
  "Actoren & samenwerking",
  "Transitie-indicatoren",
];

const topicContent = [
  {
    question:
      "Wat moet in deze fase anders worden? Wat moet worden opgebouwd, omgebouwd of afgebouwd?",
    points: [
      "Opbouwen: nieuwe structuren, praktijken, spelers die nodig zijn",
      "Ombouwen: bestaande elementen omvormen naar de gewenste richting",
      "Afbouwen: wat moet worden afgebouwd of uitgefaseerd?",
    ],
  },
  {
    question:
      "Wat moet er aan het einde van de fase aantoonbaar veranderd zijn?",
    points: [
      "Concrete, meetbare uitkomsten voor het systeem",
      "Gedragsveranderingen bij actoren",
      "Nieuwe normen, standaarden of instituties",
    ],
  },
  {
    question: "Wat belemmert de volgende stap of kan ons langdurig vastzetten?",
    points: [
      "Technologische, infrastructurele of investerings-lock-ins",
      "Financiële of institutionele drempels",
      "Belangen die de transitie vertragen of blokkeren",
    ],
  },
  {
    question: "Welke rol neemt de gemeente in deze fase?",
    points: [
      "Faciliteren: voorwaarden scheppen en ondersteunen",
      "Aanjagen: actief stimuleren en enthousiasmeren",
      "Regisseren: coördineren tussen partijen",
      "Normeren: regels en standaarden stellen",
      "Inkopen: via inkoopkracht richting geven",
    ],
  },
  {
    question: "Welke beleids- en instrumentenmix is nodig in deze fase?",
    points: [
      "Regelgeving: wetten, verordeningen, vergunningen",
      "Inkoop: circulaire aanbestedingscriteria",
      "Ruimte: ruimtelijke ordening en vergunningverlening",
      "Communicatie: bewustwording en gedragsverandering",
      "Samenwerking: convenanten en samenwerkingsverbanden",
    ],
  },
  {
    question:
      "Waar is geld en capaciteit nodig? Wat moet economisch haalbaar worden?",
    points: [
      "Publieke investeringen en subsidies",
      "Private investeringen en businessmodellen",
      "Capaciteit bij gemeente en uitvoeringsorganisaties",
      "Kostenreductie en opschaling richting kosteneffectiviteit",
    ],
  },
  {
    question: "Wie moet in deze fase meedoen of verantwoordelijkheid nemen?",
    points: [
      "Overheidspartijen (gemeente, Rijk, provincie, waterschap)",
      "Marktpartijen (bedrijven en investeerders)",
      "Overige partijen (bewoners, NGOs, kennisinstellingen)",
      "Nieuwe coalities die in deze fase nodig zijn",
    ],
  },
  {
    question: "Waaraan zien we dat het systeem echt beweegt?",
    points: [
      "Systeemindicatoren die structurele verandering meten",
      "Gedragsindicatoren bij actoren",
      "Uitkomstindicatoren aan het einde van de fase",
      "Vroegsignaleringsindicatoren voor bijsturing",
    ],
  },
];

function parseRoute(hash: string): AppRoute {
  const match = hash.match(
    /^#\/transitiepad\/(\d+)\/fase\/(\d+)(?:\/onderwerp\/(\d+))?$/,
  );
  if (!match) {
    return { view: "dashboard", trajectory: 0, phase: 0, topic: 0 };
  }
  return {
    view: "trajectory",
    trajectory: Math.min(3, Math.max(0, Number(match[1]) - 1)),
    phase: Math.min(3, Math.max(0, Number(match[2]) - 1)),
    topic: Math.min(7, Math.max(0, Number(match[3] ?? 1) - 1)),
  };
}

function Mark({ index }: { index: number }) {
  const item = trajectories[index];
  return (
    <span
      className={`mark mark-${item.shape}`}
      style={{ "--mark-color": item.color } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function TrajectoryLogo({
  index,
  variant,
}: {
  index: number;
  variant: "card" | "heading";
}) {
  return (
    <span className={`trajectory-logo trajectory-logo-${index + 1} ${variant}`}>
      <Mark index={index} />
    </span>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="brand-icon" aria-hidden="true">
        <Sparkles size={20} strokeWidth={1.7} />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>Transitie Roadmap</strong>
          <small>Circulaire Economie Den Haag</small>
        </span>
      )}
    </div>
  );
}

function SideNav({
  route,
  collapsed,
  onToggle,
  navigate,
  mobileOpen,
  closeMobile,
  onLogout,
}: {
  route: AppRoute;
  collapsed: boolean;
  onToggle: () => void;
  navigate: (route: AppRoute) => void;
  mobileOpen: boolean;
  closeMobile: () => void;
  onLogout: () => Promise<void>;
}) {
  const isCompact =
    !mobileOpen && (route.view === "trajectory" || collapsed);

  function goTo(next: AppRoute) {
    navigate(next);
    closeMobile();
  }

  return (
    <>
      <button
        className={`mobile-scrim ${mobileOpen ? "visible" : ""}`}
        onClick={closeMobile}
        aria-label="Menu sluiten"
        tabIndex={mobileOpen ? 0 : -1}
      />
      <aside
        className={`primary-nav ${isCompact ? "compact" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="nav-brand-row">
          <Logo compact={isCompact} />
          <button
            className="nav-close"
            onClick={closeMobile}
            aria-label="Menu sluiten"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Hoofdnavigatie">
          <button
            className={`nav-item ${route.view === "dashboard" ? "active" : ""}`}
            onClick={() =>
              goTo({ view: "dashboard", trajectory: 0, phase: 0, topic: 0 })
            }
            title="Dashboard"
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            {!isCompact && <span>Dashboard</span>}
          </button>
          <div className="nav-group">
            <div className="nav-item nav-label" title="Transitiepaden">
              <Route size={16} aria-hidden="true" />
              {!isCompact && (
                <>
                  <span>Transitiepaden</span>
                  <span className="chevron" aria-hidden="true">
                    ⌄
                  </span>
                </>
              )}
            </div>
            {trajectories.map((item, index) => (
              <button
                key={item.name}
                className={`nav-item trajectory-link ${
                  route.view === "trajectory" && route.trajectory === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goTo({
                    view: "trajectory",
                    trajectory: index,
                    phase: 0,
                    topic: 0,
                  })
                }
                title={item.name}
              >
                <Mark index={index} />
                {!isCompact && <span>{item.name}</span>}
              </button>
            ))}
            <button className="nav-item muted" type="button" title="Pad toevoegen">
              <Plus size={16} aria-hidden="true" />
              {!isCompact && <span>Pad toevoegen</span>}
            </button>
          </div>
        </nav>
        <div className="nav-footer">
          <button
            className="collapse-control"
            onClick={onToggle}
            aria-label={collapsed ? "Menu uitklappen" : "Menu inklappen"}
          >
            <span>{collapsed ? "→" : "←"}</span>
            {!collapsed && "Menu inklappen"}
          </button>
          <button
            className="logout-control"
            type="button"
            onClick={() => void onLogout()}
            aria-label="Uitloggen"
            title="Uitloggen"
          >
            <LogOut size={15} aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}

function TopicsNav({
  selected,
  selectTopic,
  goDashboard,
}: {
  selected: number;
  selectTopic: (topic: number) => void;
  goDashboard: () => void;
}) {
  return (
    <aside className="topics-nav">
      <button
        className="topics-collapse"
        aria-label="Terug naar dashboard"
        title="Terug naar dashboard"
        onClick={goDashboard}
      >
        <ArrowLeft size={16} aria-hidden="true" />
      </button>
      <p className="eyebrow">Onderwerpen</p>
      <nav aria-label="Onderwerpen">
        {topics.map((topic, index) => (
          <button
            key={topic}
            className={selected === index ? "active" : ""}
            aria-current={selected === index ? "page" : undefined}
            onClick={() => selectTopic(index)}
          >
            {topic}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function AppShell({
  route,
  navigate,
  onLogout,
  children,
}: {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  onLogout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menu openen"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <div
        className={`sidebar-cluster ${
          route.view === "trajectory" ? "has-topics" : ""
        }`}
      >
        <SideNav
          route={route}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          navigate={navigate}
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
          onLogout={onLogout}
        />
        {route.view === "trajectory" && (
          <TopicsNav
            selected={route.topic}
            selectTopic={(topic) => navigate({ ...route, topic })}
            goDashboard={() =>
              navigate({
                view: "dashboard",
                trajectory: 0,
                phase: 0,
                topic: 0,
              })
            }
          />
        )}
      </div>
      <main className="main-panel">{children}</main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

function Dashboard({
  openTrajectory,
}: {
  openTrajectory: (trajectory: number, phase?: number) => void;
}) {
  return (
    <div className="dashboard">
      <section className="hero">
        <h1>
          Den Haag Circulaire Stad <span>2050</span>
        </h1>
        <p>
          Den Haag werkt aan een toekomstbestendige lokale economie waarin
          minder grondstoffen nodig zijn, producten en materialen slimmer en
          langer worden gebruikt, lokale ondernemers meer kansen krijgen en de
          stad minder afhankelijk wordt van schaarse materialen en kwetsbare
          ketens.
        </p>
      </section>

      <section>
        <SectionTitle>Transitiepaden</SectionTitle>
        <div className="trajectory-grid">
          {trajectories.map((item, index) => (
            <button
              className="trajectory-card"
              key={item.name}
              onClick={() => openTrajectory(index)}
            >
              <span className="trajectory-heading">
                <TrajectoryLogo index={index} variant="card" />
                <strong>{item.name}</strong>
              </span>
              <span className="card-description">
                Omschrijving van transitiepad en de visie voor 2035 en 2050.
              </span>
              <span className="card-link">Bekijk transitiepad →</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Tijdlijn richting 2050</SectionTitle>
        <div className="timeline-wrap">
          <div className="timeline" role="table" aria-label="Tijdlijn richting 2050">
            <div className="timeline-head label-cell">Transitiepad</div>
            {phases.map((phase, index) => (
              <div className="timeline-head" key={phase.years}>
                <small>
                  Fase {index + 1} · {phase.years}
                </small>
                <strong>{phase.title}</strong>
              </div>
            ))}
            <div className="timeline-head result-head">
              <small>2050</small>
              <strong>Circulaire Stad</strong>
            </div>

            {trajectories.map((trajectory, trajectoryIndex) => (
              <div className="timeline-row" key={trajectory.name}>
                <button
                  className="timeline-name"
                  onClick={() => openTrajectory(trajectoryIndex)}
                >
                  {trajectory.name} <ArrowRight size={14} aria-hidden="true" />
                </button>
                {phases.map((phase, phaseIndex) => (
                  <div className="phase-cell" key={phase.years}>
                    <button
                      onClick={() =>
                        openTrajectory(trajectoryIndex, phaseIndex)
                      }
                    >
                      <strong>Titel van de fase in dit pad</strong>
                      <span>→ open fase</span>
                    </button>
                  </div>
                ))}
                <div className="result-cell">
                  <span>
                    <small>Resultaat</small>
                    <em>Einddoel voor dit pad</em>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SystemShifts />
    </div>
  );
}

function SystemShifts() {
  const shifts = [
    ["Product-als-a-Service", "Eigendom", "Gebruik"],
    ["Circulaire infrastructuur", "Afvalbak", "Inlever- & afhaalpunt"],
    ["Van afval naar grondstof", "Verbranding", "Hub & hergebruik"],
    ["Rol gemeente", "Uitvoerder", "Regisseur ketens"],
  ];

  return (
    <section className="shifts-section">
      <SectionTitle>Systemische verschuivingen</SectionTitle>
      <p className="section-note">
        onderstaande zijn voorbeelden van mogelijke transitieverschuivingen
      </p>
      <div className="shift-grid">
        {shifts.map(([title, from, to]) => (
          <article className="shift-card" key={title}>
            <span className="example-label">Voorbeeld</span>
            <h3>{title}</h3>
            <div>
              <span className="shift-from">
                <small>Van</small>
                {from}
              </span>
              <b aria-hidden="true">→</b>
              <span className="shift-to">
                <small>Naar</small>
                {to}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrajectoryPage({
  trajectory,
  activePhase,
  activeTopic,
  setPhase,
  setTopic,
}: {
  trajectory: number;
  activePhase: number;
  activeTopic: number;
  setPhase: (phase: number) => void;
  setTopic: (topic: number) => void;
}) {
  const item = trajectories[trajectory];
  const content = topicContent[activeTopic];

  return (
    <div className="trajectory-page">
      <header className="trajectory-header">
        <TrajectoryLogo index={trajectory} variant="heading" />
        <div>
          <h1>{item.name}</h1>
          <p>Omschrijving van transitiepad en de visie voor 2035 en 2050.</p>
        </div>
      </header>

      <label className="mobile-topic-select">
        <span>Onderwerp</span>
        <select
          value={activeTopic}
          onChange={(event) => setTopic(Number(event.target.value))}
        >
          {topics.map((topic, index) => (
            <option value={index} key={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <div className="phase-tabs" role="tablist" aria-label="Fases">
        {phases.map((phase, index) => (
          <button
            key={phase.years}
            role="tab"
            aria-selected={activePhase === index}
            className={activePhase === index ? "active" : ""}
            onClick={() => setPhase(index)}
          >
            <span className="tab-meta">
              <b>{index + 1}</b>
              <small>{phase.years}</small>
            </span>
            <strong>{phase.title}</strong>
            <span>Titel van de fase in dit pad</span>
          </button>
        ))}
      </div>

      <div className="phase-body" role="tabpanel">
        <section className="guiding-question">
          <span className="question-icon" aria-hidden="true">
            <Lightbulb size={15} />
          </span>
          <div>
            <h2>Leidende vraag</h2>
            <p>{content.question}</p>
          </div>
        </section>

        <section className="attention-card">
          <h2>Aandachtspunten</h2>
          <ol>
            {content.points.map((point, index) => (
              <li key={point}>
                <span>{index + 1}</span>
                {point}
              </li>
            ))}
          </ol>
        </section>

        <section className="empty-card">
          <span aria-hidden="true">
            <Plus size={17} />
          </span>
          <div>
            <strong>Inhoud nog niet gedefinieerd</strong>
            <p>Voeg inhoud toe door dit transitiepad verder uit te werken.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App({
  onLogout,
}: {
  userEmail: string;
  onLogout: () => Promise<void>;
}) {
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next: AppRoute) => {
    const hash =
      next.view === "dashboard"
        ? "#/dashboard"
        : `#/transitiepad/${next.trajectory + 1}/fase/${next.phase + 1}/onderwerp/${next.topic + 1}`;
    if (window.location.hash === hash) setRoute(next);
    else window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell route={route} navigate={navigate} onLogout={onLogout}>
      {route.view === "dashboard" ? (
        <Dashboard
          openTrajectory={(trajectory, phase = 0) =>
            navigate({
              view: "trajectory",
              trajectory,
              phase,
              topic: 0,
            })
          }
        />
      ) : (
        <TrajectoryPage
          trajectory={route.trajectory}
          activePhase={route.phase}
          activeTopic={route.topic}
          setPhase={(phase) => navigate({ ...route, phase })}
          setTopic={(topic) => navigate({ ...route, topic })}
        />
      )}
    </AppShell>
  );
}
