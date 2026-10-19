"use client";

import { useState } from "react";

type Brief = {
  service: string;
  targetClients: string;
  market: string;
  requirements: string;
  preferences: string;
  dealBreakers: string;
};

const startingBrief: Brief = {
  service: "Freelance client acquisition strategy",
  targetClients: "Small and growing service businesses",
  market: "United States, United Kingdom, and Canada",
  requirements: "Evidence of a current need for client acquisition support",
  preferences: "Remote engagements and clear business context",
  dealBreakers: "No original source link or unsupported claims",
};

export function BriefWorkflowPanel() {
  const [brief, setBrief] = useState<Brief>(startingBrief);
  const [draft, setDraft] = useState<Brief>(startingBrief);
  const [editing, setEditing] = useState(false);
  const [version, setVersion] = useState(1);
  const [notice, setNotice] = useState("This is a preview brief. Changes stay in this browser session only.");

  function update<K extends keyof Brief>(key: K, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="workflow-page" aria-labelledby="client-profile-heading">
      <div className="page-heading">
        <div><div className="eyebrow">CLIENT PROFILE</div><h1 id="client-profile-heading">Your brief comes first.</h1><p>Search intent belongs to your brief, not a generic keyword search.</p></div>
      </div>
      {editing ? (
        <form className="brief-panel" onSubmit={(event) => {
          event.preventDefault();
          setBrief(draft);
          setVersion((current) => current + 1);
          setEditing(false);
          setNotice("Brief updated in this preview session only. No live search was run and sample results have not changed.");
        }}>
          <div className="brief-panel__heading"><div><h2>Edit brief</h2><p>Update your requirements without starting over.</p></div><span className="brief-version">Preview version {version}</span></div>
          <div className="brief-form-grid">
            <label className="brief-field"><span>Service you provide</span><input required value={draft.service} onChange={(event) => update("service", event.target.value)} /></label>
            <label className="brief-field"><span>Ideal client type</span><input required value={draft.targetClients} onChange={(event) => update("targetClients", event.target.value)} /></label>
            <label className="brief-field"><span>Target market or location</span><input value={draft.market} onChange={(event) => update("market", event.target.value)} /></label>
            <label className="brief-field"><span>Requirements</span><textarea rows={3} value={draft.requirements} onChange={(event) => update("requirements", event.target.value)} /></label>
            <label className="brief-field"><span>Preferences</span><textarea rows={3} value={draft.preferences} onChange={(event) => update("preferences", event.target.value)} /></label>
            <label className="brief-field"><span>Deal breakers</span><textarea rows={3} value={draft.dealBreakers} onChange={(event) => update("dealBreakers", event.target.value)} /></label>
          </div>
          <div className="brief-actions"><button type="button" className="secondary-button" onClick={() => { setDraft(brief); setEditing(false); }}>Cancel</button><button type="submit" className="primary-button">Save brief</button></div>
        </form>
      ) : (
        <div className="brief-panel">
          <div className="brief-panel__heading"><div><h2>Current brief</h2><p>This is the brief a future live search must use.</p></div><span className="brief-version">Preview version {version}</span></div>
          <dl className="brief-summary-grid">
            <div><dt>Service</dt><dd>{brief.service || "Not specified"}</dd></div>
            <div><dt>Ideal clients</dt><dd>{brief.targetClients || "Not specified"}</dd></div>
            <div><dt>Target market</dt><dd>{brief.market || "Not specified"}</dd></div>
            <div><dt>Requirements</dt><dd>{brief.requirements || "Not specified"}</dd></div>
            <div><dt>Preferences</dt><dd>{brief.preferences || "Not specified"}</dd></div>
            <div><dt>Deal breakers</dt><dd>{brief.dealBreakers || "Not specified"}</dd></div>
          </dl>
          <div className="brief-actions">
            <button className="secondary-button" onClick={() => { setDraft(brief); setEditing(true); }}>Edit brief</button>
            <button className="primary-button" onClick={() => setNotice("Live internet search is not connected in this preview. No search was executed and no sample record was treated as a real prospect.")}>Search based on my brief</button>
          </div>
          <p className="action-note" role="status">{notice}</p>
        </div>
      )}
    </section>
  );
}
