// دراجتك - Landing Page Interactions

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Navbar Scroll Effect ----------
var navbar = document.getElementById('navbar');
function onScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile Menu Toggle ----------
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
}
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('show');
  });
});

// ---------- Scroll Reveal (Intersection Observer) ----------
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

// ---------- Counter Animation ----------
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(function(counter) {
    var target = parseInt(counter.getAttribute('data-count'), 10);
    if (reduceMotion) { counter.textContent = '+' + target.toLocaleString('en-US'); return; }
    var start = null;
    var duration = 1600;
    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var value = Math.floor(eased * target);
      counter.textContent = '+' + value.toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
var statsObserved = false;
var statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !statsObserved) {
      statsObserved = true;
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
var firstStat = document.querySelector('.stat-card');
if (firstStat) statsObserver.observe(firstStat);

// ---------- FAQ Accordion ----------
function toggleFaq(btn) {
  var item = btn.parentElement;
  var answer = item.querySelector('.faq-a');
  var isOpen = item.classList.contains('open');
  // close others
  document.querySelectorAll('.faq-item.open').forEach(function(other) {
    if (other !== item) {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    }
  });
  if (isOpen) {
    item.classList.remove('open');
    answer.style.maxHeight = null;
  } else {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ---------- Smooth Scroll for Anchor Links ----------
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      var offset = 80;
      var position = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
});

// ---------- Subtle Hero Phone Parallax (pointer) ----------
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  var phone = document.querySelector('.phone-float');
  var hero = document.querySelector('.hero');
  if (phone && hero) {
    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      phone.style.transform = 'translate3d(' + (x * -16) + 'px,' + (y * -16) + 'px,0) rotateY(' + (x * 5) + 'deg) rotateX(' + (y * -5) + 'deg)';
    });
    hero.addEventListener('mouseleave', function() {
      phone.style.transform = '';
    });
  }
}
