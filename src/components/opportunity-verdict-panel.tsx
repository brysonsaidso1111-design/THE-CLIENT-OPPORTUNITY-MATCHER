export function OpportunityVerdictPanel() {
  return (
    <section className="workflow-page" aria-labelledby="verdict-heading">
      <div className="page-heading">
        <div><div className="eyebrow">SEPARATE ANALYSIS WORKSPACE</div><h1 id="verdict-heading">Opportunity Verdict</h1><p>Evaluate the actual latest search results against the exact brief that produced them.</p></div>
      </div>
      <div className="verdict-empty">
        <span className="verdict-empty__icon" aria-hidden="true">✳</span>
        <h2>No completed live search to analyse</h2>
        <p>The current workspace contains illustrative sample records only. They cannot be used to produce a real verdict.</p>
        <button className="primary-button" disabled>Analyse my latest search</button>
        <p className="action-note">Complete a live search based on your brief first. This preview does not run searches or generate verdicts.</p>
      </div>
    </section>
  );
}
