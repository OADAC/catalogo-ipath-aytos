(() => {
  'use strict';
  const cfg = window.IPATH_RELEASE || {};
  const attrNames = ['src', 'poster'];
  const processed = new WeakSet();

  function normalizeFileName(value = '') {
    const clean = String(value).split(/[?#]/, 1)[0].replace(/\\/g, '/');
    return clean.slice(clean.lastIndexOf('/') + 1).normalize('NFC');
  }

  function releaseFileName(value = '') {
    const name = normalizeFileName(value);
    if (/^ChatGPT Image /i.test(name) || /^22 jul 2026,/i.test(name)) {
      return name.replace(/,\s*/g, '.').replace(/\s+/g, '.');
    }
    return name.replace(/\s+\((\d+)\)(?=\.png$)/i, '.$1');
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
  const ready = () => Boolean(repo.owner && repo.repository && cfg.tag);

  function assetUrl(value = '') {
    const source = String(value || '');
    if (!source || /^(?:data:|blob:|https?:|#)/i.test(source)) return source;
    if (!source.startsWith('assets/')) return source;
    if (!ready()) return source;
    const fileName = releaseFileName(source);
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
    const xlink = element.getAttributeNS?.('http://www.w3.org/1999/xlink', 'href');
    if (xlink?.startsWith('assets/')) element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', assetUrl(xlink));
    rewriteFallbacks(element);
    processed.add(element);
  }

  function rewriteTree(root) {
    if (!(root instanceof Element) && root !== document) return;
    if (root instanceof Element) rewriteElement(root);
    root.querySelectorAll?.('[src],[poster],[href],[data-release-src],[data-release-href],[data-fallbacks],[data-fallback]').forEach(rewriteElement);
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => { if (node.nodeType === Node.ELEMENT_NODE) rewriteTree(node); });
      } else if (record.type === 'attributes') {
        const target = record.target;
        if (!processed.has(target) || target.getAttribute(record.attributeName)?.startsWith('assets/')) rewriteElement(target);
      }
    }
  });

  function addConnectionHint(rel, href) {
    if (document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = rel; link.href = href; link.crossOrigin = 'anonymous'; document.head.appendChild(link);
  }

  function preload(path, priority = 'high') {
    if (!ready()) return;
    const href = assetUrl(path);
    if (document.head.querySelector(`link[rel="preload"][href="${CSS.escape(href)}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'preload'; link.as = 'image'; link.href = href; link.fetchPriority = priority; document.head.appendChild(link);
  }

  observer.observe(document.documentElement, {subtree:true,childList:true,attributes:true,attributeFilter:['src','poster','href','xlink:href','data-fallbacks','data-fallback']});
  addConnectionHint('preconnect','https://github.com');
  addConnectionHint('preconnect','https://release-assets.githubusercontent.com');
  addConnectionHint('dns-prefetch','https://objects.githubusercontent.com');
  preload('assets/Portada/ChatGPT Image 23 jul 2026, 14_45_04.png');
  preload('assets/Aceras y recorridos/ChatGPT Image 22 jul 2026, 17_54_17.png','low');

  document.addEventListener('DOMContentLoaded', () => rewriteTree(document), { once:true });

  window.IPATH_RELEASE_ASSETS = Object.freeze({
    config:cfg,owner:repo.owner,repository:repo.repository,tag:cfg.tag,ready,
    normalizeFileName,releaseFileName,resolve:assetUrl,resolveList:(values=[])=>values.map(assetUrl),rewriteTree
  });
})();
