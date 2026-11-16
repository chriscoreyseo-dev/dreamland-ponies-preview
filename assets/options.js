// Dreamland Ponies — optional extras with on/off switches. All OFF by default.
// Add ?options=all to an address to open a page with everything switched on.
(function () {
  var doc = document, body = doc.body, KEY = 'dp-options';
  var SLOGAN = '“Making dreams come true is what we do”';
  var OPTS = [
    { id: 'callbar', label: 'Call and Contact bar', note: 'Made for phones; her number, one tap' },
    { id: 'footslogan', label: 'Slogan in the footer', note: 'Script sign-off on every page' },
    { id: 'reviews', label: 'Reviews strip', note: 'Her 15 reviews, moving, on the home page' }
  ];
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  var q = /[?&]options=([^&#]*)/.exec(location.search);
  if (q) {
    var want = decodeURIComponent(q[1]).split(',');
    OPTS.forEach(function (o) { state[o.id] = want.indexOf('all') > -1 || want.indexOf(o.id) > -1; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function apply() { OPTS.forEach(function (o) { body.classList.toggle('opt-' + o.id, !!state[o.id]); }); }

  // --- option 1: call and contact bar (her own number and her own Contact Us page)
  var bar = doc.createElement('div');
  bar.className = 'call-bar';
  bar.innerHTML =
    '<a class="cb-call" href="tel:+18889607669"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6.600 3.500h3l1.400 4-2 1.500a12 12 0 006 6l1.500-2 4 1.400v3c0 1-.800 1.800-1.800 1.800A15.200 15.200 0 014.800 5.300c0-1 .800-1.800 1.800-1.800z" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linejoin="round"/></svg>Call 888-960-PONY</a>' +
    '<a class="cb-contact" href="contact-us.html">Contact Us</a>';
  body.appendChild(bar);

  // --- option 2: slogan sign-off above the copyright line
  var foot = doc.querySelector('.site-footer .wrap');
  if (foot) {
    var sl = doc.createElement('p');
    sl.className = 'footer-slogan';
    sl.textContent = SLOGAN;
    var copy = null;
    foot.querySelectorAll('.prose').forEach(function (p) { if (/©|All rights reserved/i.test(p.textContent)) copy = p; });
    if (copy) copy.parentNode.insertBefore(sl, copy); else foot.appendChild(sl);
  }

  // --- option 3: reviews strip on the home page (text exactly as posted on her reviews page)
  var main = doc.querySelector('.page-index main');
  if (main) {
    var strip = doc.createElement('section');
    strip.className = 'reviews-strip';
    strip.innerHTML = '<div class="rs-head"><a class="btn" href="reviews.html">Reviews</a></div><div class="reviews-track"></div>';
    main.appendChild(strip);
    fetch('assets/reviews.json').then(function (r) { return r.json(); }).then(function (list) {
      var track = strip.querySelector('.reviews-track');
      function card(rv) {
        var c = doc.createElement('article');
        c.className = 'rs-card';
        var st = doc.createElement('div'); st.className = 'rs-stars'; st.setAttribute('aria-label', '5 out of 5'); st.textContent = '★★★★★';
        var t = doc.createElement('p'); t.className = 'rs-text'; t.textContent = rv.text;
        var w = doc.createElement('div'); w.className = 'rs-who'; w.textContent = rv.who[0] || '';
        var s = doc.createElement('span'); s.textContent = [rv.who[1], rv.date].filter(Boolean).join(' · ');
        w.appendChild(s);
        c.appendChild(st); c.appendChild(t); c.appendChild(w);
        return c;
      }
      list.forEach(function (rv) { track.appendChild(card(rv)); });
      list.forEach(function (rv) { var c = card(rv); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
      track.style.setProperty('--dur', list.length * 7 + 's');
    }).catch(function () { strip.remove(); });
  }

  // --- the Options panel
  var fab = doc.createElement('button');
  fab.className = 'opt-fab';
  fab.type = 'button';
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '<i></i>Options';
  var panel = doc.createElement('div');
  panel.className = 'opt-panel';
  var html = '<h2>Optional extras</h2><p>Not part of the redesign. Switch each one on to see it, off to remove it.</p>';
  OPTS.forEach(function (o) {
    html += '<label class="opt-row"><span>' + o.label + '<small>' + o.note + '</small></span><input type="checkbox" data-opt="' + o.id + '"' + (state[o.id] ? ' checked' : '') + '></label>';
  });
  html += '<div class="opt-row"><span>Sharing card<small>Picture shown when her link is texted or posted</small></span><a href="assets/share-card.jpg" target="_blank" rel="noopener">View</a></div>';
  panel.innerHTML = html;
  body.appendChild(panel);
  body.appendChild(fab);
  fab.addEventListener('click', function () {
    var open = panel.classList.toggle('is-open');
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  panel.addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-opt');
    if (!id) return;
    state[id] = e.target.checked;
    save(); apply();
    if (id === 'reviews' && e.target.checked && strip) strip.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (id === 'footslogan' && e.target.checked && foot) foot.querySelector('.footer-slogan').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { panel.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); } });
  if (q) save();
  apply();
})();
