"use client";

import { useMemo, useState } from "react";
import { BriefWorkflowPanel } from "../src/components/brief-workflow-panel";
import { OpportunityVerdictPanel } from "../src/components/opportunity-verdict-panel";
import { PeerLeadNetworkLink } from "../src/components/peer-lead-network-link";

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  summary: string;
  source: string;
  budget: string;
  mode: string;
  category: string;
  score: number;
  evidence: "Supported" | "Mixed" | "Limited";
  status: "Ready to review" | "Needs verification" | "Saved" | "Passed";
  skills: string[];
  reasons: string[];
  gaps: string[];
};

const demoOpportunities: Opportunity[] = [
  {
    id: "OP-1048",
    title: "Website redesign for a growing accounting firm",
    organization: "Northstar Accounting",
    summary: "Refresh a service-business website, improve lead capture, and make the core pages easier to navigate.",
    source: "Illustrative source",
    budget: "$1,500–$2,500",
    mode: "Remote",
    category: "Web design",
    score: 92,
    evidence: "Supported",
    status: "Ready to review",
    skills: ["Website design", "Conversion copy", "Small business"],
    reasons: ["Service request aligns with your selected offer", "Remote delivery is compatible", "Budget range is shown in the example brief"],
    gaps: ["Confirm the client's current website and decision timeline"],
  },
  {
    id: "OP-1049",
    title: "Landing page and email copy for a course launch",
    organization: "Brightpath Learning",
    summary: "Create a focused launch landing page and a short onboarding email sequence for a digital education offer.",
    source: "Illustrative source",
    budget: "Budget not stated",
    mode: "Remote",
    category: "Copywriting",
    score: 84,
    evidence: "Mixed",
    status: "Needs verification",
    skills: ["Landing pages", "Email copy", "Digital products"],
    reasons: ["Requested deliverables match the example service profile", "Remote collaboration is indicated in the example"],
    gaps: ["Budget is unknown", "Launch date and scope need confirmation"],
  },
  {
    id: "OP-1050",
    title: "Monthly social content support",
    organization: "Fieldnote Studio",
    summary: "Plan and produce a recurring set of social posts for a small creative business.",
    source: "Illustrative source",
    budget: "$800 / month",
    mode: "Hybrid",
    category: "Content",
    score: 68,
    evidence: "Limited",
    status: "Needs verification",
    skills: ["Content planning", "Social media"],
    reasons: ["Some service overlap is present"],
    gaps: ["Hybrid requirement may not fit", "Approval process and content volume are not specified"],
  },
];

const navItems = [
  { label: "Overview", icon: "◫" },
  { label: "Search results", icon: "⌕" },
  { label: "Saved", icon: "♡" },
  { label: "Decisions", icon: "✓" },
  { label: "Client profile", icon: "◎" },
  { label: "Opportunity Verdict", icon: "✳" },
];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Search results");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All opportunities");
  const [selectedId, setSelectedId] = useState("OP-1048");
  const [decisions, setDecisions] = useState<Record<string, "Saved" | "Passed" | "Applied">>({});
  const [showEvidence, setShowEvidence] = useState(true);
  const [notice, setNotice] = useState("You're viewing a clickable design preview. The records below are illustrative—not live leads.");

  const visible = useMemo(() => demoOpportunities.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [item.title, item.organization, item.category, ...item.skills].some((v) => v.toLowerCase().includes(q));
    const decision = decisions[item.id];
    const matchesFilter = filter === "All opportunities"
      || (filter === "Needs verification" && item.status === "Needs verification")
      || (filter === "Strong fit" && item.score >= 80)
      || (filter === "Saved" && decision === "Saved");
    return matchesQuery && matchesFilter && decision !== "Passed";
  }), [query, filter, decisions]);

  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  function decide(id: string, decision: "Saved" | "Passed" | "Applied") {
    setDecisions((current) => ({ ...current, [id]: decision }));
    setNotice(decision === "Applied"
      ? "Demo action recorded locally: marked as applied. No external application was submitted."
      : decision === "Saved"
        ? "Opportunity saved in this temporary preview state. It is not persisted to an account."
        : "Opportunity passed in this temporary preview state. It is not persisted to an account.");
  }

  return (
    <main className="app-frame">
      <aside className="sidebar">
        <a className="brand" href="#workspace" aria-label="T4L Growth home">
          <span className="brand-mark">T4</span>
          <span className="brand-copy"><strong>T4L GROWTH</strong><small>CLIENT OPPORTUNITY MATCHER</small></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={activeNav === item.label ? "nav-item active" : "nav-item"} onClick={() => {
              setActiveNav(item.label);
              if (item.label === "Saved") setFilter("Saved");
              else if (item.label === "Search results") setFilter("All opportunities");
              else if (item.label === "Client profile") setNotice("Your brief workspace is in preview mode.");
              else if (item.label === "Opportunity Verdict") setNotice("Verdict analysis requires a completed live search. This preview has no live search results.");
              else setNotice(`${item.label} view selected in preview.`);
            }}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
              {item.label === "Saved" && <span className="nav-count">{Object.values(decisions).filter((v) => v === "Saved").length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✳</span>
            <strong>Make better decisions.</strong>
            <p>Compare fit, evidence, constraints, and unknowns—not just a score.</p>
            <button onClick={() => setNotice("Decision guidance: confirm hard requirements first, inspect evidence, then use fit as an attention signal.")}>How matching works <span>↗</span></button>
          </div>
          <div className="profile-chip"><span className="avatar">D</span><span><strong>Demo workspace</strong><small>Preview mode</small></span><span className="dots">•••</span></div>
        </div>
      </aside>

      <section className="main-area" id="workspace">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div>
          <div className="top-actions"><span className="preview-pill"><i /> Preview environment</span><button className="icon-button" aria-label="Notifications" onClick={() => setNotice("No account notifications are connected in this preview.")}>♧</button><span className="avatar small">D</span></div>
        </header>

        <div className="page-content">
          <div className="preview-notice"><span className="notice-icon">ⓘ</span><p><strong>Interactive preview · sample records only</strong><br />These opportunities are illustrative UI data. No live source has been queried, and actions are temporary in this browser session.</p><button onClick={() => setNotice("Preview limitation: provider integrations, account persistence, and production access controls are not connected in this interface yet.")} aria-label="Preview details">Details ↗</button></div>
          {activeNav !== "Client profile" && activeNav !== "Opportunity Verdict" && <>
          <div className="page-heading">
            <div><div className="eyebrow">YOUR OPPORTUNITY PIPELINE</div><h1>Find work that <em>fits.</em></h1><p>Evaluate opportunities with evidence, clear constraints, and a reasoned fit—not guesswork.</p></div>
            <button className="primary-button" onClick={() => setActiveNav("Client profile")}>Edit brief</button>
          </div>

          <div className="metric-grid">
            <div className="metric-card"><div className="metric-top"><span>Opportunities in view</span><span className="metric-icon mint">⌕</span></div><div className="metric-value">{visible.length.toString().padStart(2, "0")}</div><div className="metric-foot"><span className="dot-green" /> Sample records loaded</div></div>
            <div className="metric-card"><div className="metric-top"><span>Strong fit signals</span><span className="metric-icon violet">✳</span></div><div className="metric-value">{visible.filter((item) => item.score >= 80).length.toString().padStart(2, "0")}</div><div className="metric-foot">80+ illustrative fit score</div></div>
            <div className="metric-card"><div className="metric-top"><span>Needs verification</span><span className="metric-icon amber">⌁</span></div><div className="metric-value">{visible.filter((item) => item.status === "Needs verification").length.toString().padStart(2, "0")}</div><div className="metric-foot">Unknowns remain visible</div></div>
            <div className="metric-card"><div className="metric-top"><span>Saved for review</span><span className="metric-icon rose">♡</span></div><div className="metric-value">{Object.values(decisions).filter((v) => v === "Saved").length.toString().padStart(2, "0")}</div><div className="metric-foot">Temporary preview state</div></div>
          </div>

          <div className="section-heading"><div><h2>Opportunity matches</h2><p>Rank is an attention aid. Check the evidence before you act.</p></div><button className="quiet-button" onClick={() => { setQuery(""); setFilter("All opportunities"); setActiveNav("Find opportunities"); }}>Reset view ↺</button></div>
          <div className="search-row">
            <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role, client, skill..." aria-label="Search opportunities" /><kbd>⌘ K</kbd></label>
            <label className="filter-select"><span>View</span><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter opportunities"><option>All opportunities</option><option>Strong fit</option><option>Needs verification</option><option>Saved</option></select><span>⌄</span></label>
            <button className="filter-button" onClick={() => setShowEvidence((value) => !value)}>{showEvidence ? "Evidence on" : "Evidence off"} <span>☷</span></button>
          </div>

          <div className="workspace-grid">
            <section className="opportunity-list" aria-label="Opportunity results">
              <div className="list-header"><span>{visible.length} illustrative matches</span><span>Sort: <strong>Fit signal ↓</strong></span></div>
              {visible.length === 0 ? <div className="empty-state"><span>⌕</span><h3>No opportunities in this view</h3><p>Try another search or reset the filters.</p><button className="quiet-button" onClick={() => { setQuery(""); setFilter("All opportunities"); }}>Clear filters</button></div> : visible.map((item, index) => {
                const decision = decisions[item.id];
                return <button key={item.id} className={selected?.id === item.id ? "opportunity-card selected" : "opportunity-card"} onClick={() => setSelectedId(item.id)} aria-pressed={selected?.id === item.id}>
                  <div className="card-topline"><span className="source-label"><span className="source-mark">{item.organization.slice(0, 1)}</span>{item.source}</span><span className={item.score >= 85 ? "score-chip high" : "score-chip"}><span>✳</span> {item.score} <small>fit</small></span></div>
                  <h3>{item.title}</h3><p className="organization">{item.organization} <span>·</span> {item.mode}</p><p className="summary">{item.summary}</p>
                  <div className="skill-row">{item.skills.slice(0, 3).map((skill) => <span key={skill} className="skill-tag">{skill}</span>)}</div>
                  <div className="card-bottom"><span className={item.evidence === "Supported" ? "evidence-state good" : item.evidence === "Mixed" ? "evidence-state mixed" : "evidence-state limited"}><i /> {item.evidence} evidence</span><span className="budget">{item.budget}</span></div>
                  {decision && <span className="decision-ribbon">{decision === "Applied" ? "Marked applied in preview" : decision}</span>}
                  {index === 0 && <span className="recommended-label">TOP FIT SIGNAL</span>}
                </button>;
              })}
              <p className="list-disclaimer">Scores are illustrative demo values, not calculated from live listings.</p>
            </section>

            {selected ? <aside className="detail-panel" aria-label="Selected opportunity details">
              <div className="detail-header"><span className="detail-label">OPPORTUNITY DETAIL</span><button className="icon-button" aria-label="Save opportunity" onClick={() => decide(selected.id, "Saved")}>{decisions[selected.id] === "Saved" ? "♥" : "♡"}</button></div>
              <div className="detail-org"><span className="org-avatar">{selected.organization.slice(0, 1)}</span><div><strong>{selected.organization}</strong><small>{selected.source} · {selected.id}</small></div></div>
              <h2>{selected.title}</h2><p className="detail-summary">{selected.summary}</p>
              <div className="detail-metrics"><div><span>Fit signal</span><strong>{selected.score}<small>/100</small></strong><div className="score-track"><i style={{ width: `${selected.score}%` }} /></div></div><div><span>Budget</span><strong className="budget-detail">{selected.budget}</strong><small>As represented in demo record</small></div></div>
              <div className="detail-section"><h3><span className="section-symbol">✳</span> Why it may fit <span className="count-badge">{selected.reasons.length}</span></h3><ul className="reason-list">{selected.reasons.map((reason) => <li key={reason}><span>✓</span>{reason}</li>)}</ul></div>
              <div className="detail-section gap-section"><h3><span className="section-symbol amber-text">⌁</span> What still needs checking <span className="count-badge amber-count">{selected.gaps.length}</span></h3><ul className="gap-list">{selected.gaps.map((gap) => <li key={gap}><span>!</span>{gap}</li>)}</ul></div>
              {showEvidence && <div className="evidence-box"><div className="evidence-box-heading"><span>▤</span><strong>Evidence & provenance</strong><span className={selected.evidence === "Supported" ? "evidence-tag supported" : "evidence-tag"}>{selected.evidence}</span></div><p>Source: {selected.source}</p><p>Evidence status: {selected.evidence === "Supported" ? "Example claims marked supported in the sample record." : "The example record contains unresolved information."}</p><p className="evidence-warning">Sample only. Independent verification has not been performed.</p></div>}
              <div className="detail-actions"><button className="primary-button full" onClick={() => decide(selected.id, "Applied")}>↗ Mark as applied</button><div><button className="secondary-button" onClick={() => decide(selected.id, "Saved")}>{decisions[selected.id] === "Saved" ? "♥ Saved" : "♡ Save"}</button><button className="secondary-button" onClick={() => decide(selected.id, "Passed")}>Pass opportunity</button></div></div>
              <p className="action-note" role="status">{notice}</p>
            </aside> : <aside className="detail-panel empty-detail"><span>◎</span><h3>Select an opportunity</h3><p>Choose a record to inspect its fit signal and open questions.</p></aside>}
          </div>
          <PeerLeadNetworkLink />
          <footer className="app-footer"><span>✳ T4L GROWTH™</span><span>Practical tools. Built for freelancer growth.</span><span>Preview build · Not production</span></footer>
          </>}
          {activeNav === "Client profile" && <BriefWorkflowPanel />}
          {activeNav === "Opportunity Verdict" && <OpportunityVerdictPanel />}
        </div>
      </section>
    </main>
  );
}
