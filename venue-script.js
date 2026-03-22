// ============================================================
// Configuration
// ============================================================
// Replace YOUR_VENUE_FORM_ID with a second Formspree form ID.
// Create it at https://formspree.io — keep it separate from the
// player waitlist so submissions don't mix.
// ============================================================
const VENUE_FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_VENUE_FORM_ID';

// ============================================================
// Venue Registration Form Submission
// ============================================================
const form      = document.getElementById('venue-registration-form');
const errorEl   = document.getElementById('venue-form-error');
const successEl = document.getElementById('venue-success-message');
const btnText   = form.querySelector('.btn-text');
const btnLoad   = form.querySelector('.btn-loading');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.querySelector('#contact-email').value.trim();
  const venueName = form.querySelector('#venue-name').value.trim();

  if (!venueName) { showError('Please enter your venue name.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('Please enter a valid contact email.');
    return;
  }

  setLoading(true);
  hideError();

  try {
    const response = await fetch(VENUE_FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });

    if (response.ok) {
      form.hidden = true;
      successEl.hidden = false;
    } else {
      const data = await response.json().catch(() => ({}));
      const msg = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
      showError(msg);
      setLoading(false);
    }
  } catch {
    showError('Network error. Please check your connection and try again.');
    setLoading(false);
  }
});

function setLoading(loading) {
  btnText.hidden  = loading;
  btnLoad.hidden  = !loading;
  submitBtn.disabled = loading;
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
}

// ============================================================
// Smooth Scroll
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// Scroll Reveal
// ============================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
