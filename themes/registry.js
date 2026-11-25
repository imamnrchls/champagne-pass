/**
 * LAYER 3 REGISTRY — Kontrak pendaftaran tema Lembar Kabar.
 * Setiap tema menyediakan: { id, name, tokens, labels, opener, ornaments, section_order }
 */
(function () {
  const themes = Object.create(null);

  window.LKThemes = {
    register(id, definition) {
      if (!id || !definition) return;
      themes[id] = Object.assign({ id }, definition);
    },
    get(id) {
      return themes[id] || themes["champagne-noir"] || Object.values(themes)[0] || null;
    },
    has(id) {
      return Object.prototype.hasOwnProperty.call(themes, id);
    },
    list() {
      return Object.keys(themes);
    }
  };
})();
