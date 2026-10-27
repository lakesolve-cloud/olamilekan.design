// Scroll reveals and number count-ups. Progressive enhancement: does nothing for
// reduced-motion users or browsers without IntersectionObserver, so content stays visible.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var REVEAL = [
    // homepage
    '.sec-head', '.proj', '.case', '.about-copy', '.timeline', '.skill', '.fact',
    '.contact .wrap > *',
    // case studies
    '.card', '.stat', '.decision', '.phase', '.quad', '.flowset', '.persona-id', '.bars',
    '.table-wrap', '.showcase', '.sheet', '.logo-panel', '.numbered li', '.palette > div',
    '.browser', '.promise', '.type-card', '.todo', '.closing', '.stages', 'blockquote', '.flow-wrap'
  ].join(',');

  var root = document.documentElement;
  var hero = document.querySelector('.hero');
  var items = [].slice.call(document.querySelectorAll(REVEAL)).filter(function (el) {
    // the hero has its own entrance; don't nest reveals inside other reveals
    return !(hero && hero.contains(el)) && !el.parentElement.closest(REVEAL);
  });

  // Stagger siblings that reveal together, capped so long lists don't drag
  items.forEach(function (el) {
    el.setAttribute('data-reveal', '');
    var sibs = [].slice.call(el.parentElement.children).filter(function (s) { return items.indexOf(s) > -1; });
    var i = sibs.indexOf(el);
    el.style.setProperty('--reveal-delay', Math.min(i * 80, 400) + 'ms');
  });

  // Count-ups: "10,000+", "1,000+" anywhere in the content, and percentages in stat tiles
  var counts = [];
  var walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT);
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (node) {
    var parent = node.parentElement;
    if (!parent || parent.closest('.hero, script, style, h1, h2, .when')) return;
    var inStat = !!parent.closest('.stat');
    var re = inStat ? /(\d{1,3}(?:,\d{3})*)(\+|%)/g : /(\d{1,3}(?:,\d{3})+)(\+)/g;
    if (!re.test(node.nodeValue)) return;
    re.lastIndex = 0;
    var frag = document.createDocumentFragment(), last = 0, m, text = node.nodeValue;
    while ((m = re.exec(text))) {
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement('span');
      span.className = 'count';
      span.textContent = m[1] + m[2];
      span.dataset.target = m[1].replace(/,/g, '');
      span.dataset.suffix = m[2];
      span.style.display = 'inline-block';
      span.style.minWidth = (m[1].length + 1) + 'ch';
      frag.appendChild(span);
      counts.push(span);
      last = m.index + m[0].length;
    }
    frag.appendChild(document.createTextNode(text.slice(last)));
    parent.replaceChild(frag, node);
  });

  function runCount(span) {
    if (span.dataset.done) return;
    span.dataset.done = '1';
    var target = +span.dataset.target, suffix = span.dataset.suffix, start = null, dur = 1200;
    function tick(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      span.textContent = v.toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    span.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  }

  root.classList.add('js-motion');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.classList.contains('count')) runCount(el);
      else el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
  counts.forEach(function (el) { io.observe(el); });

  // Safety net: if anything is still hidden after load (print, odd viewport), show it
  window.addEventListener('beforeprint', function () { items.forEach(function (el) { el.classList.add('is-in'); }); });
})();
