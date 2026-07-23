(() => {
  'use strict';

  const cfg = window.IPATH_RELEASE || {};
  const attrNames = ['src', 'poster'];
  const processed = new WeakSet();

  function normalizeFileName(value = '') {
    const clean = String(value).split(/[?#]/, 1)[0].replace(/\\/g, '/');
    return clean.slice(clean.lastIndexOf('/') + 1).normalize('NFC');
  }

  function inferRepository() {
    let owner = String(cfg.owner || '').trim();
    let repository = String(cfg.repository || '').trim();

    if ((!owner || !repository) && /\.github\.io$/i.test(location.hostname)) {
      owner = owner || location.hostname.split('.')[0];
      const parts = location.pathname.split('/').filter(Boolean);
      repository = repository || (parts[0] || `${owner}.github.io`);
    }

    return { owner, repository };
  }

  const repo = inferRepository();

  function ready() {
    return Boolean(repo.owner && repo.repository && cfg.tag);
  }

  function assetUrl(value = '') {
    const source = String(value || '');
    if (!source || /^(?:data:|blob:|https?:|#)/i.test(source)) return source;
    if (!source.startsWith('assets/')) return source;
    if (!ready()) return source;

    const fileName = normalizeFileName(source);
    return `https://github.com/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repository)}/releases/download/${encodeURIComponent(cfg.tag)}/${encodeURIComponent(fileName)}`;
  }

  function rewriteFallbacks(element) {
    const raw = element.dataset?.fallbacks || element.dataset?.fallback || '';
    if (!raw) return;
    const rewritten = raw.split('|').filter(Boolean).map(assetUrl).join('|');
    if (element.dataset.fallbacks !== undefined) element.dataset.fallbacks = rewritten;
    if (element.dataset.fallback !== undefined) element.dataset.fallback = rewritten;
  }

  function rewriteElement(element) {
    if (!(element instanceof Element)) return;

    if (element.dataset?.releaseSrc) {
      element.setAttribute('src', assetUrl(element.dataset.releaseSrc));
      delete element.dataset.releaseSrc;
    }
    if (element.dataset?.releaseHref) {
      element.setAttribute('href', assetUrl(element.dataset.releaseHref));
      delete element.dataset.releaseHref;
    }

    for (const attr of attrNames) {
      const current = element.getAttribute?.(attr);
      if (current?.startsWith('assets/')) element.setAttribute(attr, assetUrl(current));
    }

    const href = element.getAttribute?.('href');
    if (href?.startsWith('assets/')) element.setAttribute('href', assetUrl(href));

    // SVG <image> puede utilizar href o xlink:href.
    const xlink = element.getAttributeNS?.('http://www.w3.org/1999/xlink', 'href');
    if (xlink?.startsWith('assets/')) {
      element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', assetUrl(xlink));
    }

    rewriteFallbacks(element);
    processed.add(element);
  }

  function rewriteTree(root) {
    if (!(root instanceof Element) && root !== document) return;
    if (root instanceof Element) rewriteElement(root);
    root.querySelectorAll?.('[src],[poster],[href],[data-release-src],[data-release-href],[data-fallbacks],[data-fallback]')
      .forEach(rewriteElement);
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) rewriteTree(node);
        });
      } else if (record.type === 'attributes') {
        const target = record.target;
        if (!processed.has(target) || target.getAttribute(record.attributeName)?.startsWith('assets/')) {
          rewriteElement(target);
        }
      }
    }
  });

  function showConfigurationError() {
    if (ready() || !/\.github\.io$/i.test(location.hostname)) return;
    console.error('iPath: no se pudo determinar el repositorio del Release. Revisa release-config.js.');
  }

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src', 'poster', 'href', 'xlink:href', 'data-fallbacks', 'data-fallback']
  });

  document.addEventListener('DOMContentLoaded', () => {
    rewriteTree(document);
    showConfigurationError();
  }, { once: true });

  if (ready()) {
    document.documentElement.style.setProperty(
      '--ipath-texture-image',
      `url("${assetUrl('assets/texturas/texturas-cueva-board.webp')}")`
    );
  }

  window.IPATH_RELEASE_ASSETS = Object.freeze({
    config: cfg,
    owner: repo.owner,
    repository: repo.repository,
    tag: cfg.tag,
    ready,
    normalizeFileName,
    resolve: assetUrl,
    resolveList: (values = []) => values.map(assetUrl),
    rewriteTree
  });
})();
