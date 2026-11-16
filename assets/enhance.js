// Dreamland Ponies — enhancements, round 2. Presentation only.
(function () {
  var doc = document, body = doc.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.documentElement.classList.add('js');

  // reading progress + back to top
  var bar = doc.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  body.appendChild(bar);
  var up = doc.createElement('button');
  up.className = 'to-top';
  up.type = 'button';
  up.setAttribute('aria-label', 'Back to top');
  up.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  body.appendChild(up);
  up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  function progress() {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    up.classList.toggle('is-on', window.scrollY > 700);
  }
  progress();
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);

  // dividers draw in
  var rules = doc.querySelectorAll('.rule');
  if ('IntersectionObserver' in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    rules.forEach(function (r) { rio.observe(r); });
  } else {
    rules.forEach(function (r) { r.classList.add('is-in'); });
  }

  // tilt toward the pointer (mouse only)
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    doc.querySelectorAll('.card, .hero-film').forEach(function (el) {
      var max = el.classList.contains('hero-film') ? 3 : 6;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - 0.5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        el.classList.add('is-tilt');
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-tilt'); });
    });
  }

  // a few stars around the welcome on the home page
  var first = doc.querySelector('.page-index main > .band:first-child');
  if (first && !reduce) {
    [[6, 60, 16, '0s'], [14, 190, 11, '1.2s'], [22, 40, 9, '2.1s'], [80, 70, 14, '.6s'], [90, 170, 18, '1.8s'], [94, 30, 10, '2.9s'], [3, 330, 10, '3.4s'], [97, 320, 12, '.3s']].forEach(function (s) {
      var st = doc.createElement('i');
      st.className = 'star';
      st.setAttribute('aria-hidden', 'true');
      st.textContent = '✦';
      st.style.left = s[0] + '%';
      st.style.top = s[1] + 'px';
      st.style.setProperty('--s', s[2] + 'px');
      st.style.setProperty('--t', s[3]);
      first.appendChild(st);
    });
  }

  // pictures fade in as they load
  doc.querySelectorAll('main img[loading="lazy"]').forEach(function (im) {
    if (im.complete) return;
    im.classList.add('fade');
    function done() { im.classList.add('is-loaded'); }
    im.addEventListener('load', done);
    im.addEventListener('error', done);
  });
})();
