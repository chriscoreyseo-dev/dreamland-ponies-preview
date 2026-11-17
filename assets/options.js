// Dreamland Ponies — call bar, footer slogan and home-page reviews strip. Always on.
(function () {
  var doc = document, body = doc.body;
  var SLOGAN = '“Making dreams come true is what we do”';

  // --- call and contact bar (her own number and her own Contact Us page)
  var bar = doc.createElement('div');
  bar.className = 'call-bar';
  bar.innerHTML =
    '<a class="cb-call" href="tel:+18889607669"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6.600 3.500h3l1.400 4-2 1.500a12 12 0 006 6l1.500-2 4 1.400v3c0 1-.800 1.800-1.800 1.800A15.200 15.200 0 014.800 5.300c0-1 .800-1.800 1.800-1.800z" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linejoin="round"/></svg>Call 888-960-PONY</a>' +
    '<a class="cb-contact" href="contact-us.html">Contact Us</a>';
  body.appendChild(bar);

  // --- slogan sign-off above the copyright line
  var foot = doc.querySelector('.site-footer .wrap');
  if (foot) {
    var sl = doc.createElement('p');
    sl.className = 'footer-slogan';
    sl.textContent = SLOGAN;
    var copy = null;
    foot.querySelectorAll('.prose').forEach(function (p) { if (/©|All rights reserved/i.test(p.textContent)) copy = p; });
    if (copy) copy.parentNode.insertBefore(sl, copy); else foot.appendChild(sl);
  }

  // --- reviews strip on the home page (text exactly as posted on her reviews page)
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

  // switch all three on (next frame, so the call bar slides in)
  requestAnimationFrame(function () {
    body.classList.add('opt-callbar', 'opt-footslogan', 'opt-reviews');
  });
  try { localStorage.removeItem('dp-options'); } catch (e) {}
})();
