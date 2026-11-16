// Dreamland Ponies — interactions. No libraries.
(function () {
  var doc = document, body = doc.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header
  var header = doc.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  var toggle = doc.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) toggle.click();
    });
    doc.addEventListener('click', function (e) {
      if (body.classList.contains('nav-open') && !e.target.closest('.site-nav') && !e.target.closest('.nav-toggle')) toggle.click();
    });
  }
  doc.querySelectorAll('.sub-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var sub = b.nextElementSibling;
      var open = sub.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // slogan: split into words so it can write itself in (the words themselves are unchanged)
  doc.querySelectorAll('.slogan').forEach(function (el) {
    if (reduce) return;
    var text = el.textContent.trim(), words = text.split(/\s+/);
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.classList.add('fx');
    el.style.setProperty('--n', words.length);
    words.forEach(function (w, i) {
      var s = doc.createElement('span');
      s.className = 'w' + (/dreams/i.test(w) ? ' key' : '');
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(' '));
    });
    [[8, -10, '0s'], [30, 92, '.9s'], [52, -18, '1.7s'], [71, 96, '.4s'], [92, -6, '2.3s']].forEach(function (p) {
      var t = doc.createElement('i');
      t.className = 'twinkle';
      t.setAttribute('aria-hidden', 'true');
      t.textContent = '✦';
      t.style.left = p[0] + '%';
      t.style.top = p[1] + '%';
      t.style.setProperty('--t', p[2]);
      el.appendChild(t);
    });
  });

  // reveal on scroll, staggered inside a row
  var items = [].slice.call(doc.querySelectorAll('.reveal'));
  items.forEach(function (el) {
    var p = el.parentElement;
    if (p && (p.classList.contains('cols') || p.classList.contains('gallery'))) {
      var i = [].indexOf.call(p.children, el);
      el.style.setProperty('--d', Math.min(i % 6, 5) * 90 + 'ms');
    }
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // button ripple
  doc.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.btn');
    if (!b || reduce) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    var dot = doc.createElement('span');
    dot.className = 'ripple';
    dot.style.width = dot.style.height = s + 'px';
    dot.style.left = e.clientX - r.left - s / 2 + 'px';
    dot.style.top = e.clientY - r.top - s / 2 + 'px';
    b.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 750);
  });

  // a little fairy dust on every click
  doc.addEventListener('click', function (e) {
    if (reduce || e.target.closest('.lightbox')) return;
    for (var i = 0; i < 7; i++) {
      var sp = doc.createElement('i');
      var a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6, d = 26 + Math.random() * 34;
      sp.className = 'spark' + (i % 3 === 0 ? ' star' : '');
      sp.style.left = e.clientX - 5 + 'px';
      sp.style.top = e.clientY - 5 + 'px';
      sp.style.setProperty('--dx', Math.cos(a) * d + 'px');
      sp.style.setProperty('--dy', Math.sin(a) * d + 'px');
      body.appendChild(sp);
      (function (n) { setTimeout(function () { n.remove(); }, 800); })(sp);
    }
  });

  // hero film music
  var film = doc.querySelector('.hero-video'), snd = doc.querySelector('.sound-toggle');
  if (film && snd) {
    film.muted = true;
    var p = film.play();
    if (p && p.catch) p.catch(function () {});
    snd.addEventListener('click', function () {
      film.muted = !film.muted;
      if (!film.muted) { film.volume = 0.8; film.play(); }
      snd.setAttribute('aria-pressed', film.muted ? 'false' : 'true');
      snd.setAttribute('aria-label', film.muted ? 'Turn music on' : 'Turn music off');
    });
  }

  // slideshows
  doc.querySelectorAll('[data-slider]').forEach(function (sl) {
    var slides = sl.querySelectorAll('.slide'), n = 0;
    if (slides.length < 2) return;
    setInterval(function () {
      slides[n].classList.remove('is-on');
      n = (n + 1) % slides.length;
      slides[n].classList.add('is-on');
    }, 5000);
  });

  // contact form: fields are checked here; sending is connected when the site goes live
  doc.querySelectorAll('[data-preview-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      f.querySelectorAll('[required]').forEach(function (el) {
        var bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        el.classList.remove('is-bad');
        if (bad) { void el.offsetWidth; el.classList.add('is-bad'); first = first || el; }
      });
      if (first) first.focus();
    });
    f.addEventListener('input', function (e) { e.target.classList.remove('is-bad'); });
  });

  // lightbox
  var lb = doc.querySelector('.lightbox');
  if (lb) {
    var img = lb.querySelector('img'), set = [], at = 0;
    function show(i) { at = (i + set.length) % set.length; img.src = set[at].getAttribute('href'); }
    function close() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); setTimeout(function () { lb.hidden = true; img.removeAttribute('src'); }, 350); body.style.overflow = ''; }
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      var scope = a.closest('.gallery') || a.closest('.band') || doc;
      set = [].slice.call(scope.querySelectorAll('a[data-lightbox]'));
      lb.hidden = false; lb.setAttribute('aria-hidden', 'false');
      var many = set.length > 1;
      lb.querySelector('.lb-prev').style.display = lb.querySelector('.lb-next').style.display = many ? '' : 'none';
      show(set.indexOf(a));
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      body.style.overflow = 'hidden';
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('.lb-prev')) show(at - 1);
      else if (e.target.closest('.lb-next')) show(at + 1);
      else if (e.target !== img) close();
    });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(at - 1);
      if (e.key === 'ArrowRight') show(at + 1);
    });
  }
})();
