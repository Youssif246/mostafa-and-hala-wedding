/**
 * MOSTAFA & HALA — LUXURY ARABIC WEDDING INVITATION
 * Interactive Logic: Envelope Opening, Dynamic Countdown, Scroll Reveal
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. ENVELOPE OPENING EXPERIENCE
     ========================================================================== */
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelope = document.getElementById('weddingEnvelope');
  const envelopeHint = document.getElementById('envelopeHint');
  const invitationContent = document.getElementById('invitationContent');
  const weddingAudio = document.getElementById('weddingAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIconPlaying = document.getElementById('musicIconPlaying');
  const musicIconMuted = document.getElementById('musicIconMuted');

  let isEnvelopeOpened = false;

  function playWeddingAudio() {
    if (weddingAudio) {
      weddingAudio.loop = true;
      weddingAudio.play().then(function () {
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('is-playing', 'is-active');
          if (musicIconPlaying) musicIconPlaying.style.display = 'block';
          if (musicIconMuted) musicIconMuted.style.display = 'none';
        }
      }).catch(function (error) {
        // Fallback if browser requires an additional gesture
        console.log('Audio play triggered on user interaction:', error);
      });
    }
  }

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Start repeating background wedding audio immediately upon opening gesture
    playWeddingAudio();

    // Check if reduced motion is requested
    if (prefersReducedMotion) {
      if (envelopeScreen) {
        envelopeScreen.classList.add('opened');
      }
      if (invitationContent) {
        invitationContent.setAttribute('aria-hidden', 'false');
      }
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('is-active');
      }
      triggerInitialHeroReveal();
      return;
    }

    // Step 1: Flap unfolds, seal releases, card emerges
    if (envelope) {
      envelope.classList.add('opening');
    }

    // Step 2: Smooth crossfade to main invitation
    setTimeout(function () {
      if (envelopeScreen) {
        envelopeScreen.classList.add('opened');
        // Detach envelope overlay from render tree to free GPU memory for smooth scrolling
        setTimeout(function () {
          envelopeScreen.style.display = 'none';
        }, 1000);
      }
      if (invitationContent) {
        invitationContent.setAttribute('aria-hidden', 'false');
      }
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('is-active');
      }
      // Trigger Hero reveal
      triggerInitialHeroReveal();
    }, 2000);
  }

  // Music toggle button interaction (pause / play)
  if (musicToggleBtn && weddingAudio) {
    musicToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (weddingAudio.paused) {
        weddingAudio.play().then(function () {
          musicToggleBtn.classList.add('is-playing');
          if (musicIconPlaying) musicIconPlaying.style.display = 'block';
          if (musicIconMuted) musicIconMuted.style.display = 'none';
        }).catch(function (err) {
          console.log('Playback error:', err);
        });
      } else {
        weddingAudio.pause();
        musicToggleBtn.classList.remove('is-playing');
        if (musicIconPlaying) musicIconPlaying.style.display = 'none';
        if (musicIconMuted) musicIconMuted.style.display = 'block';
      }
    });
  }

  // Bind clicks and taps to envelope and hint
  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (envelopeHint) {
    envelopeHint.addEventListener('click', openEnvelope);
  }

  /* ==========================================================================
     2. DYNAMIC LIVE COUNTDOWN (Cairo Time UTC+2)
     Target: 11 December 2026 at 6:00 PM (18:00:00 Cairo time)
     ========================================================================== */
  // 2026-12-11T18:00:00+02:00
  const TARGET_DATE = new Date('2026-12-11T18:00:00+02:00').getTime();

  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');
  const cdContainer = document.getElementById('weddingCountdown');
  const cdCompleteMsg = document.getElementById('countdownCompleteMsg');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance <= 0) {
      // Countdown completed state
      if (cdContainer) cdContainer.style.display = 'none';
      if (cdCompleteMsg) cdCompleteMsg.style.display = 'block';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format with English numerals and clean padding
    if (elDays) elDays.innerHTML = `<bdi dir="ltr">${days < 10 ? '0' + days : days}</bdi>`;
    if (elHours) elHours.innerHTML = `<bdi dir="ltr">${hours < 10 ? '0' + hours : hours}</bdi>`;
    if (elMinutes) elMinutes.innerHTML = `<bdi dir="ltr">${minutes < 10 ? '0' + minutes : minutes}</bdi>`;
    if (elSeconds) elSeconds.innerHTML = `<bdi dir="ltr">${seconds < 10 ? '0' + seconds : seconds}</bdi>`;
  }

  // Initial call and 1-second interval
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  /* ==========================================================================
     3. INTERSECTION OBSERVER SCROLL REVEALS
     ========================================================================== */
  function triggerInitialHeroReveal() {
    const heroItems = document.querySelectorAll('#hero .reveal-item');
    heroItems.forEach(function (item, index) {
      setTimeout(function () {
        item.classList.add('is-visible');
      }, index * 140);
    });
  }

  if (prefersReducedMotion) {
    // Immediately reveal all elements without motion
    document.querySelectorAll('.reveal-item').forEach(function (item) {
      item.classList.add('is-visible');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '80px 0px 80px 0px',
        threshold: 0.02
      }
    );

    document.querySelectorAll('.reveal-item').forEach(function (item) {
      // Skip hero elements if envelope is not yet opened
      if (!item.closest('#hero')) {
        revealObserver.observe(item);
      }
    });
  }

  /* ==========================================================================
     4. RSVP WEB3FORMS INTEGRATION
     ========================================================================== */
  /**
   * YOUR WEB3FORMS ACCESS KEY:
   * Put your Web3Forms Access Key here or in the hidden input in index.html!
   * You can get a free access key from: https://web3forms.com
   */
  const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
  const rsvpFeedback = document.getElementById('rsvpFeedback');
  const guestCountGroup = document.getElementById('guestCountGroup');
  const accessKeyInput = document.getElementById('web3formsAccessKey');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  // Sync access key if set in JS constant
  if (accessKeyInput && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
    accessKeyInput.value = WEB3FORMS_ACCESS_KEY;
  }

  // Toggle guest count dropdown when user is attending vs apologizing
  attendanceRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (guestCountGroup) {
        if (this.value === 'أعتذر عن الحضور') {
          guestCountGroup.style.display = 'none';
        } else {
          guestCountGroup.style.display = 'block';
        }
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const guestNameInput = document.getElementById('guestName');
      const guestName = guestNameInput ? guestNameInput.value.trim() : '';
      const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
      const attendance = selectedAttendance ? selectedAttendance.value : 'سأكون في الحضور';
      const guestCountSelect = document.getElementById('guestCount');
      const guestCount = guestCountSelect ? guestCountSelect.value : '1';
      const currentKey = (accessKeyInput && accessKeyInput.value.trim()) || WEB3FORMS_ACCESS_KEY;

      if (!guestName) {
        showFeedback('يرجى كتابة الاسم الكريم قبل الإرسال.', 'error');
        if (guestNameInput) guestNameInput.focus();
        return;
      }

      // Check if user has replaced the placeholder key
      if (!currentKey || currentKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        showSuccess(guestName);
        return;
      }

      // Prepare payload
      const payload = {
        access_key: currentKey,
        subject: `تأكيد حضور زفاف Mostafa & Hala — ${guestName}`,
        from_name: 'دعوة زفاف Mostafa & Hala',
        'الاسم الكريم': guestName,
        'حالة الحضور': attendance,
        'عدد الحاضرين': attendance === 'سأكون في الحضور' ? guestCount : '0 (اعتذار)'
      };

      // Set loading state
      if (rsvpSubmitBtn) {
        rsvpSubmitBtn.classList.add('is-loading');
        rsvpSubmitBtn.disabled = true;
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (rsvpSubmitBtn) {
          rsvpSubmitBtn.classList.remove('is-loading');
          rsvpSubmitBtn.disabled = false;
        }

        if (data.success) {
          showSuccess(guestName);
        } else {
          showFeedback(data.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.', 'error');
        }
      })
      .catch(function () {
        if (rsvpSubmitBtn) {
          rsvpSubmitBtn.classList.remove('is-loading');
          rsvpSubmitBtn.disabled = false;
        }
        showFeedback('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة ثانية.', 'error');
      });
    });
  }

  /* Hide the form and reveal the success card */
  function showSuccess(guestName) {
    // Find the whole RSVP content wrapper
    var rsvpWrap = document.querySelector('.rsvp-content-wrap');
    if (!rsvpWrap) return;

    // Expand the typography layer to full width
    var rsvpTypography = document.querySelector('.rsvp-typography');
    if (rsvpTypography) rsvpTypography.classList.add('success-mode');

    // Fade the wrapper out via JS
    rsvpWrap.style.transition = 'opacity 0.45s ease';
    rsvpWrap.style.opacity = '0';

    setTimeout(function () {
      // Replace the entire wrapper content with the success card
      rsvpWrap.innerHTML =
        '<div class="rsvp-success-card">' +
          '<span class="rsvp-success-icon" aria-hidden="true">❦</span>' +
          '<p class="rsvp-success-title">شكراً لك، ' + (guestName || 'عزيزنا') + '</p>' +
          '<p class="rsvp-success-body">تم تسجيل ردك بنجاح</p>' +
          '<p class="rsvp-success-sub">نسعد برؤيتكم في يوم فرحتنا ✦</p>' +
        '</div>';

      // Fade the wrapper back in
      rsvpWrap.style.transition = 'opacity 0.6s ease';
      rsvpWrap.style.opacity = '1';
    }, 480);
  }

  /* Show an inline error without hiding the form */
  function showFeedback(message, type) {
    if (!rsvpFeedback) return;
    rsvpFeedback.style.display = 'block';
    rsvpFeedback.className = 'rsvp-feedback ' + (type === 'success' ? 'is-success' : 'is-error');
    rsvpFeedback.textContent = message;
  }

})();
