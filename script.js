/* BetterSpend Marketing Site — script.js */

(function () {
  'use strict';

  /* ===========================
     NAVBAR: scroll behavior + hamburger
     =========================== */

  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile-menu');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 48) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===========================
     SMOOTH SCROLL
     =========================== */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var offset = 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===========================
     FADE-UP ANIMATIONS
     Hero: handled entirely by CSS @keyframes — no JS needed.
     All other sections: IntersectionObserver adds .animate-in on scroll.
     =========================== */

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -32px 0px'
  });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    if (!el.closest('.hero')) {
      fadeObserver.observe(el);
    }
  });

  /* ===========================
     ANIMATED COUNTERS in stats bar
     =========================== */

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, duration) {
    var start = null;
    var numTarget = parseInt(target, 10);
    if (isNaN(numTarget)) return;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOutCubic(progress) * numTarget);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = numTarget;
      }
    }

    requestAnimationFrame(step);
  }

  var statsBar = document.querySelector('.stats-bar');
  var statNums = statsBar ? statsBar.querySelectorAll('.stat-num') : [];
  var countersStarted = false;

  if (statsBar && statNums.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      if (countersStarted) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countersStarted = true;
          counterObserver.disconnect();
          statNums.forEach(function (el, i) {
            var numeric = parseInt(el.textContent.trim(), 10);
            if (isNaN(numeric) || numeric < 2) return;
            setTimeout(function () {
              animateCounter(el, numeric, 1200);
            }, i * 80);
          });
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(statsBar);
  }

  /* ===========================
     FEATURE CARDS: staggered delay
     =========================== */

  document.querySelectorAll('.feature-card').forEach(function (card, i) {
    card.style.setProperty('--delay', (i % 4 * 60) + 'ms');
  });

  /* ===========================
     TERMINAL: typing effect for the success line
     Uses safe DOM text manipulation only — no innerHTML
     =========================== */

  var ctaTerminal = document.querySelector('.cta-terminal');
  var successLine = document.querySelector('.t-output');
  var typingStarted = false;

  if (ctaTerminal && successLine) {
    var terminalObserver = new IntersectionObserver(function (entries) {
      if (typingStarted) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          typingStarted = true;
          terminalObserver.disconnect();

          // Grab the existing icon element and text to retype
          var iconEl = successLine.querySelector('.t-success');
          var fullText = ' BetterSpend running at http://localhost:3100';

          // Clear all children using safe DOM removal
          while (successLine.lastChild) {
            successLine.removeChild(successLine.lastChild);
          }

          // Re-append the icon (it's our own trusted DOM node)
          if (iconEl) {
            successLine.appendChild(iconEl);
          }

          // Append an empty text node and fill it character by character
          var textNode = document.createTextNode('');
          successLine.appendChild(textNode);

          var charIndex = 0;
          var typeInterval = setInterval(function () {
            if (charIndex < fullText.length) {
              textNode.nodeValue += fullText.charAt(charIndex);
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 22);
        }
      });
    }, { threshold: 0.6 });

    terminalObserver.observe(ctaTerminal);
  }

  /* ===========================
     HERO MOCKUP: subtle parallax on scroll
     =========================== */

  var mockupWrap = document.querySelector('.hero-mockup-wrap');

  if (mockupWrap && window.innerWidth > 768) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var shift = Math.min(window.scrollY * 0.12, 40);
          mockupWrap.style.transform = 'translateY(-' + shift + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
