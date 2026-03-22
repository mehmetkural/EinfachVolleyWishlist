// ============================================================
// Configuration
// ============================================================
// Replace YOUR_FORM_ID with the ID from your Formspree dashboard.
// Sign up free at https://formspree.io — create a form, copy the ID.
// ============================================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgpydan';

// ============================================================
// Waitlist Form Submission
// ============================================================
const form       = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email-input');
const errorEl    = document.getElementById('form-error');
const successEl  = document.getElementById('success-message');
const btnText    = form.querySelector('.btn-text');
const btnLoading = form.querySelector('.btn-loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic client-side validation
  const email = emailInput.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('Please enter a valid email address.');
    return;
  }

  // Loading state
  setLoading(true);
  hideError();

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });

    if (response.ok) {
      // Success
      form.hidden = true;
      successEl.hidden = false;
      successEl.style.animation = 'fadeIn .4s ease forwards';
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
  btnText.hidden   = loading;
  btnLoading.hidden = !loading;
  form.querySelector('button').disabled = loading;
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
}

// ============================================================
// Smooth Scroll for anchor links
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
// Scroll Reveal Animation (IntersectionObserver)
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// ============================================================
// Stagger feature cards
// ============================================================
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
