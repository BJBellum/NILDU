/* dune-init.js — Dune Rise font: strip accents from all rendered elements */
(function() {
  function deaccent(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function applyDeaccent() {
    const sel = [
      '.hero-title', '.hero-title-pharos', '.hero-title-sub',
      '.portal-card-title', '.entity-name', '.section-eyebrow',
      '.division-title', '.about-card-title', '.admin-badge',
      '.nav-brand', '.modal-title', '.dash-title', '.ess-class',
      '.ess-scale-letter', '.bilan-big', '.prod-val', '.stat-val',
      '.hstat-val', '.hstat-sm-val', '.cs-class', '.class-badge',
      '.class-dot', '.bourse-title', '.access-title', '.lock-title',
      '.spec-label', '.spec-val-title', '.year-label', '.division-eyebrow'
    ].join(',');
    document.querySelectorAll(sel).forEach(function(el) {
      el.childNodes.forEach(function(n) {
        if (n.nodeType === 3) n.textContent = deaccent(n.textContent);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDeaccent);
  } else {
    applyDeaccent();
  }
  // Re-run after dynamic content
  window._duneDeaccent = applyDeaccent;
})();
