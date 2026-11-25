/**
 * LAYER 2 — SKELETON ENGINE (Data-driven & Theme-agnostic)
 * Mengatur urutan section 1–7, logika tamu (?to=), countdown WIB,
 * Add to Calendar (.ics + Google Calendar), Galeri + Lightbox,
 * RSVP & Ucapan (Google Sheets Apps Script + localStorage fallback),
 * audio manager (volume awal 60%, gesture-triggered), dan scroll reveal.
 */
(function () {
  "use strict";

  const DEFAULT_LABELS = {
    open_button: "Buka Undangan",
    skip_button: "Lewati",
    couple_title: "Mempelai",
    events_title: "Waktu & Tempat",
    dress_code_title: "Dress Code",
    story_title: "Kisah Kami",
    gallery_title: "Galeri",
    rsvp_title: "Konfirmasi Kehadiran",
    wishes_title: "Doa & Ucapan",
    gift_title: "Tanda Kasih",
    closing: "Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.",
    to_prefix: "Kepada Yth.",
    default_guest: "Tamu Undangan",
    location_shortcut: "Lokasi",
    view_location: "Lihat Lokasi",
    add_calendar: "Simpan ke Kalender",
    copy_account: "Salin",
    copied: "Tersalin",
    copy_address: "Salin Alamat",
    event_passed: "Acara telah berlangsung"
  };

  const DEFAULT_ORDER = ["pembuka", "acara", "cerita_galeri", "rsvp", "amplop"];
  const MAX_WISHES = 50;
  const WISHES_PAGE = 6;
  const RATE_LIMIT_MS = 15000;
  const AUDIO_TARGET_VOL = 0.6; // 60% sesuai spec §5.5

  const $ = (sel, root = document) => root.querySelector(sel);
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svgIcon(pathMarkup, viewBox = "0 0 24 24") {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", viewBox);
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.4");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = pathMarkup;
    return s;
  }

  const ICONS = {
    pin: () => svgIcon('<path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 1 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.2"/>'),
    calendar: () => svgIcon('<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    rings: () => svgIcon('<circle cx="9.5" cy="13.5" r="5.5"/><circle cx="15" cy="13.5" r="5.5"/><path d="M9.5 5.5l1.6 2-1.6 2-1.6-2z"/>'),
    champagne: () => svgIcon('<path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3Z"/><path d="M12 12v8M8.5 20h7"/>'),
    instagram: () => svgIcon('<rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.8" fill="currentColor"/>'),
    copy: () => svgIcon('<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
    check: () => svgIcon('<path d="M5 12.5l4.2 4.2L19 7"/>'),
    gift: () => svgIcon('<rect x="3" y="9" width="18" height="4"/><path d="M5 13v7h14v-7M12 9v11M12 9C12 6 9.5 4.5 8 5.5S9 9 12 9Zm0 0c0-3 2.5-4.5 4-3.5S15 9 12 9Z"/>'),
    musicOn: () => svgIcon('<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'),
    musicOff: () => svgIcon('<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M3 3l18 18"/>')
  };

  /* ---------- Date / Time Formatting (WIB) ---------- */
  function fmtDateID(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    });
  }

  // Tanggal terstruktur: tema bisa menata hari / tanggal / bulan-tahun terpisah
  function buildEventDate(iso) {
    const p = el("p", "lk-event-date");
    if (!iso) return p;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return p;
    const part = (opts) => d.toLocaleDateString("id-ID", Object.assign({ timeZone: "Asia/Jakarta" }, opts));
    p.append(
      el("span", "lk-event-date-wd", part({ weekday: "long" })),
      el("span", "lk-event-date-sep", ", "),
      el("span", "lk-event-date-day", part({ day: "numeric" })),
      el("span", "lk-event-date-sep", " "),
      el("span", "lk-event-date-my", part({ month: "long", year: "numeric" }))
    );
    return p;
  }

  function fmtTimeRangeWIB(startIso, endIso) {
    if (!startIso) return "";
    const fmt = (iso) =>
      new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta"
      }).replace(":", ".");
    const s = fmt(startIso);
    if (!endIso) return `${s} WIB – selesai`;
    return `${s} – ${fmt(endIso)} WIB`;
  }

  function toUtcStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  /* ---------- Calendar Helpers (.ics + Google Calendar) ---------- */
  function buildCalendarInfo(ev, data) {
    const coupleShort = `${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`;
    const coupleFull = `${data.mempelai.pria.nama_lengkap} & ${data.mempelai.wanita.nama_lengkap}`;
    const title = `${ev.label} ${coupleShort}`;
    const startDate = new Date(ev.mulai);
    const endIso = ev.selesai || new Date(startDate.getTime() + 2 * 3600 * 1000).toISOString();
    const location = [ev.venue, ev.alamat].filter(Boolean).join(", ");
    const details = `${ev.label} pernikahan ${coupleFull}. ${fmtTimeRangeWIB(ev.mulai, ev.selesai)}.` +
      (ev.maps_url ? ` Lokasi: ${ev.maps_url}` : "");
    return {
      title,
      start: toUtcStamp(ev.mulai),
      end: toUtcStamp(endIso),
      location,
      details
    };
  }

  function buildGoogleCalUrl(ev, data) {
    const info = buildCalendarInfo(ev, data);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: info.title,
      dates: `${info.start}/${info.end}`,
      details: info.details,
      location: info.location,
      ctz: "Asia/Jakarta"
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function buildIcsContent(ev, data) {
    const info = buildCalendarInfo(ev, data);
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const uid = `${info.start}-${(ev.jenis || ev.label || "acara").replace(/\s+/g, "")}@lembarkabar.web.id`;
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lembar Kabar//Undangan Digital//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
      `DTSTART:${info.start}`,
      `DTEND:${info.end}`,
      `SUMMARY:${esc(info.title)}`,
      `LOCATION:${esc(info.location)}`,
      `DESCRIPTION:${esc(info.details)}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Pengingat ${esc(info.title)} besok`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  /* ---------- Toast & Clipboard ---------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = $("#lk-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2000);
  }

  async function copyToClipboard(text, btn, copiedLabel) {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = el("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }

    if (ok) {
      showToast(`${copiedLabel}: ${text}`);
      if (btn) {
        const prev = btn.dataset.origLabel || btn.textContent;
        btn.dataset.origLabel = prev;
        btn.textContent = `${copiedLabel} ✓`;
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
          btn.textContent = prev;
        }, 1800);
      }
    } else {
      showToast("Gagal menyalin. Silakan salin manual.");
    }
  }

  /* ---------- Audio Manager (volume awal 60%, tersembunyi jika kosong) ---------- */
  function createAudioManager(musicConfig) {
    const btn = $("#lk-music-btn");
    const audio = $("#lk-audio");
    const url = musicConfig && typeof musicConfig.url === "string" ? musicConfig.url.trim() : "";
    let enabled = Boolean(url);
    let fadeTimer = null;

    if (!enabled || !audio || !btn) {
      if (btn) btn.hidden = true;
      return {
        isEnabled: () => false,
        startFromGesture: () => {},
        revealControlOnly: () => {}
      };
    }

    audio.src = url;
    audio.loop = true;
    audio.preload = "none";

    function updateButton(isPlaying) {
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      btn.setAttribute("aria-label", isPlaying ? "Jeda musik latar" : "Putar musik latar");
      btn.classList.toggle("is-playing", isPlaying);
      btn.replaceChildren(isPlaying ? ICONS.musicOn() : ICONS.musicOff());
    }

    function fadeVolume(target, ms) {
      clearInterval(fadeTimer);
      const startVol = audio.volume;
      const t0 = performance.now();
      return new Promise((resolve) => {
        fadeTimer = setInterval(() => {
          const k = Math.min(1, (performance.now() - t0) / ms);
          audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * k));
          if (k >= 1) {
            clearInterval(fadeTimer);
            resolve();
          }
        }, 40);
      });
    }

    audio.addEventListener("error", () => {
      enabled = false;
      btn.hidden = true;
      updateButton(false);
    });

    btn.addEventListener("click", () => {
      if (!enabled) return;
      if (audio.paused) {
        audio.volume = 0;
        audio.play()
          .then(() => {
            updateButton(true);
            fadeVolume(AUDIO_TARGET_VOL, 900);
          })
          .catch(() => updateButton(false));
      } else {
        updateButton(false);
        fadeVolume(0, 450).then(() => audio.pause());
      }
    });

    updateButton(false);

    return {
      isEnabled: () => enabled,
      startFromGesture() {
        if (!enabled) return;
        btn.hidden = false;
        audio.volume = 0;
        audio.play()
          .then(() => {
            updateButton(true);
            fadeVolume(AUDIO_TARGET_VOL, 1200);
            if (musicConfig.judul) showToast(`♪ ${musicConfig.judul}`);
          })
          .catch(() => {
            updateButton(false);
          });
      },
      revealControlOnly() {
        if (!enabled) return;
        btn.hidden = false;
      }
    };
  }

  /* ---------- Lightbox (swipe + keyboard) ---------- */
  function openLightbox(items, startIndex, triggerEl) {
    if (!items.length) return;
    let idx = startIndex;

    const overlay = el("div", "lk-lightbox");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Penampil foto galeri");

    const stage = el("div", "lk-lightbox-stage");
    const img = el("img", "lk-lightbox-img");
    const caption = el("p", "lk-lightbox-caption");
    const count = el("p", "lk-lightbox-count");
    stage.append(img, caption, count);

    const closeBtn = el("button", "lk-lightbox-close", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Tutup galeri");

    const prevBtn = el("button", "lk-lightbox-nav lk-lightbox-prev", "‹");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Foto sebelumnya");

    const nextBtn = el("button", "lk-lightbox-nav lk-lightbox-next", "›");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Foto berikutnya");

    function show(delta) {
      idx = (idx + delta + items.length) % items.length;
      const item = items[idx];
      img.src = item.src;
      img.alt = item.alt || `Foto galeri ${idx + 1}`;
      caption.textContent = item.caption || "";
      caption.hidden = !item.caption;
      count.textContent = `${idx + 1} / ${items.length}`;
    }

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      if (triggerEl && typeof triggerEl.focus === "function") triggerEl.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(1);
      else if (e.key === "ArrowLeft") show(-1);
    }

    prevBtn.addEventListener("click", () => show(-1));
    nextBtn.addEventListener("click", () => show(1));
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    let touchStartX = null;
    overlay.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) show(dx < 0 ? 1 : -1);
      touchStartX = null;
    });

    overlay.append(stage, closeBtn);
    if (items.length > 1) overlay.append(prevBtn, nextBtn);

    document.body.append(overlay);
    document.addEventListener("keydown", onKey);
    show(0);
    closeBtn.focus();
  }

  /* ---------- Relative Time (Indonesian) ---------- */
  function formatRelativeTime(ts) {
    if (!ts) return "";
    const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diffSec < 60) return "baru saja";
    const units = [
      ["tahun", 31536000],
      ["bulan", 2592000],
      ["minggu", 604800],
      ["hari", 86400],
      ["jam", 3600],
      ["menit", 60]
    ];
    for (const [label, sec] of units) {
      if (diffSec >= sec) {
        return `${Math.floor(diffSec / sec)} ${label} lalu`;
      }
    }
    return "baru saja";
  }

  /* ---------- Section 3: Pembuka & Mempelai ---------- */
  function renderPembuka(data, theme, labels) {
    const sec = el("section", "lk-section lk-hero-intro");
    sec.id = "pembuka";

    const ornaments = theme.ornaments || {};
    const initials = data.inisial ||
      `${(data.mempelai.pria.nama_panggilan || "P")[0]}${(data.mempelai.wanita.nama_panggilan || "W")[0]}`.toUpperCase();

    if (typeof ornaments.monogram === "function") {
      const monoWrap = el("div", "lk-reveal");
      monoWrap.append(ornaments.monogram(initials));
      sec.append(monoWrap);
    }

    const eyebrow = el("p", "lk-section-eyebrow lk-reveal", "The Wedding of");
    const headline = el("h1", "lk-couple-headline lk-reveal");
    headline.append(
      document.createTextNode(data.mempelai.pria.nama_panggilan),
      el("span", "lk-amp-inline", "&"),
      document.createTextNode(data.mempelai.wanita.nama_panggilan)
    );

    const firstEvent = Array.isArray(data.acara) && data.acara[0];
    const dateLine = el("p", "lk-hero-date lk-reveal", firstEvent ? fmtDateID(firstEvent.mulai) : "");

    // Tombol pintas "Lokasi" di section 3 → scroll cepat ke Detail Acara (hari-H UX <= 10 detik)
    const shortcutWrap = el("div", "lk-shortcut-wrap lk-reveal");
    const locBtn = el("a", "lk-btn");
    locBtn.href = "#acara";
    locBtn.append(ICONS.pin(), document.createTextNode(labels.location_shortcut));
    shortcutWrap.append(locBtn);

    sec.append(eyebrow, headline);
    if (dateLine.textContent) sec.append(dateLine);
    if (firstEvent) sec.append(shortcutWrap);

    if (data.kutipan && data.kutipan.teks) {
      const qBox = el("blockquote", "lk-quote-box lk-reveal");
      qBox.append(el("p", "lk-quote-text", `“${data.kutipan.teks}”`));
      if (data.kutipan.sumber) {
        qBox.append(el("footer", "lk-quote-source", data.kutipan.sumber));
      }
      sec.append(qBox);
    }

    if (typeof ornaments.divider === "function") {
      const divWrap = el("div", "lk-divider lk-reveal");
      divWrap.append(ornaments.divider());
      sec.append(divWrap);
    }

    sec.append(el("h2", "lk-section-title lk-reveal", labels.couple_title));

    const showPhoto = data.tampilkan_foto_mempelai !== false;
    const coupleGrid = el("div", `lk-couple-grid${showPhoto ? "" : " lk-couple-grid--no-photo"}`);

    // "Putra pertama dari Bpk. X & Ibu Y" -> baris relasi + baris nama orang tua
    function buildParents(text) {
      const p = el("p", "lk-person-parents");
      const m = String(text || "").match(/^(.*?\bdari)\s+(.+)$/i);
      if (!m) {
        p.textContent = text || "";
        return p;
      }
      p.append(
        el("span", "lk-person-parents-rel", m[1]),
        el("span", "lk-person-parents-names", m[2])
      );
      return p;
    }

    function buildPerson(person, roleLabel, fallbackInitial) {
      const card = el("article", "lk-person lk-reveal");

      if (showPhoto) {
        const photoWrap = el("div", "lk-person-photo-wrap");
        let inner;
        if (person.foto) {
          inner = el("img", "lk-person-photo");
          inner.src = person.foto;
          inner.alt = `Foto ${person.nama_lengkap}`;
          inner.loading = "lazy";
          inner.decoding = "async";
        } else {
          inner = el("div", "lk-person-placeholder");
          inner.setAttribute("aria-hidden", "true");
          if (typeof ornaments.portraitPlaceholder === "function") {
            inner.append(ornaments.portraitPlaceholder(fallbackInitial, person.nama_panggilan));
          } else {
            inner.textContent = fallbackInitial;
          }
        }
        photoWrap.append(
          typeof ornaments.photoFrame === "function" ? ornaments.photoFrame(inner) : inner
        );
        card.append(photoWrap);
      }

      card.append(
        el("p", "lk-person-role", roleLabel),
        el("h3", "lk-person-name", person.nama_lengkap),
        buildParents(person.ortu)
      );

      if (person.instagram) {
        const handle = person.instagram.replace(/^@/, "").trim();
        if (handle) {
          const ig = el("a", "lk-ig-link");
          ig.href = `https://instagram.com/${encodeURIComponent(handle)}`;
          ig.target = "_blank";
          ig.rel = "noopener noreferrer";
          ig.setAttribute("aria-label", `Instagram ${person.nama_panggilan}`);
          ig.append(ICONS.instagram(), document.createTextNode(`@${handle}`));
          card.append(ig);
        }
      }

      return card;
    }

    const priaInit = (data.mempelai.pria.nama_panggilan || "P")[0].toUpperCase();
    const wanitaInit = (data.mempelai.wanita.nama_panggilan || "W")[0].toUpperCase();

    coupleGrid.append(
      buildPerson(data.mempelai.pria, "Mempelai Pria", priaInit),
      el("div", "lk-couple-sep lk-reveal", "&"),
      buildPerson(data.mempelai.wanita, "Mempelai Wanita", wanitaInit)
    );

    sec.append(coupleGrid);
    return sec;
  }

  /* ---------- Section 4: Detail Acara + Countdown + 4b Dress Code ---------- */
  function renderAcara(data, theme, labels) {
    const events = Array.isArray(data.acara) ? data.acara : [];
    const hasDressCode = Boolean(data.dress_code && data.dress_code.aktif);
    if (!events.length && !hasDressCode) return null;

    const sec = el("section", "lk-section");
    sec.id = "acara";

    const ornaments = theme.ornaments || {};
    if (typeof ornaments.divider === "function") {
      const divWrap = el("div", "lk-divider lk-reveal");
      divWrap.append(ornaments.divider());
      sec.append(divWrap);
    }

    sec.append(
      el("p", "lk-section-eyebrow lk-reveal", "Save the Date"),
      el("h2", "lk-section-title lk-reveal", labels.events_title)
    );

    // Countdown ke acara pertama (WIB)
    if (events.length && events[0].mulai) {
      const targetMs = new Date(events[0].mulai).getTime();
      const cdHost = el("div", "lk-reveal");

      if (!Number.isNaN(targetMs)) {
        const grid = el("div", "lk-countdown");
        grid.setAttribute("aria-label", "Hitung mundur menuju acara");

        const units = [
          ["d", "Hari"],
          ["h", "Jam"],
          ["m", "Menit"],
          ["s", "Detik"]
        ];
        const refs = {};
        units.forEach(([key, label]) => {
          const box = el("div", "lk-countdown-unit");
          const num = el("span", "lk-countdown-num", "00");
          const lbl = el("span", "lk-countdown-label", label);
          refs[key] = num;
          box.append(num, lbl);
          grid.append(box);
        });

        const passed = el("p", "lk-countdown-passed", labels.event_passed);
        passed.hidden = true;
        cdHost.append(grid, passed);
        sec.append(cdHost);

        const pad2 = (n) => String(n).padStart(2, "0");
        let timerId = null;

        function tick() {
          const diff = targetMs - Date.now();
          if (diff <= 0) {
            grid.hidden = true;
            passed.hidden = false;
            if (timerId) clearInterval(timerId);
            return;
          }
          const totalSec = Math.floor(diff / 1000);
          refs.d.textContent = String(Math.floor(totalSec / 86400));
          refs.h.textContent = pad2(Math.floor((totalSec % 86400) / 3600));
          refs.m.textContent = pad2(Math.floor((totalSec % 3600) / 60));
          refs.s.textContent = pad2(totalSec % 60);
        }

        tick();
        if (targetMs > Date.now()) {
          timerId = setInterval(tick, 1000);
        }
      }
    }

    // Kartu per acara
    if (events.length) {
      const list = el("div", "lk-events-list");

      events.forEach((ev) => {
        const card = el("article", "lk-event-card lk-reveal");
        const iconWrap = el("div", "lk-event-icon");
        iconWrap.append(ev.jenis === "akad" ? ICONS.rings() : ICONS.champagne());

        card.append(
          iconWrap,
          el("h3", "lk-event-title", ev.label || "Acara"),
          buildEventDate(ev.mulai),
          el("p", "lk-event-time", fmtTimeRangeWIB(ev.mulai, ev.selesai)),
          el("hr", "lk-event-rule")
        );

        if (ev.venue) {
          const venue = el("p", "lk-event-venue");
          const venueIcon = ICONS.pin();
          venueIcon.classList.add("lk-event-venue-icon");
          venue.append(venueIcon, el("span", null, ev.venue));
          card.append(venue);
        }
        if (ev.alamat) card.append(el("p", "lk-event-address", ev.alamat));

        const actions = el("div", "lk-event-actions");
        if (ev.maps_url) {
          const mapBtn = el("a", "lk-btn");
          mapBtn.href = ev.maps_url;
          mapBtn.target = "_blank";
          mapBtn.rel = "noopener noreferrer";
          mapBtn.append(ICONS.pin(), document.createTextNode(labels.view_location));
          actions.append(mapBtn);
        }

        // Dropdown Simpan ke Kalender (.ics + Google Calendar)
        const cal = el("details", "lk-cal");
        const summary = el("summary", "lk-btn");
        summary.append(ICONS.calendar(), document.createTextNode(labels.add_calendar));

        const menu = el("div", "lk-cal-menu");
        const gcal = el("a", null, "Google Calendar");
        gcal.href = buildGoogleCalUrl(ev, data);
        gcal.target = "_blank";
        gcal.rel = "noopener noreferrer";

        const icsBtn = el("button", null, "Apple / Outlook (.ics)");
        icsBtn.type = "button";
        icsBtn.addEventListener("click", () => {
          const blob = new Blob([buildIcsContent(ev, data)], { type: "text/calendar;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = el("a");
          a.href = url;
          a.download = `${(ev.jenis || "acara")}-${data.slug || "undangan"}.ics`.toLowerCase();
          document.body.append(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          cal.open = false;
        });

        menu.append(gcal, icsBtn);
        cal.append(summary, menu);
        document.addEventListener("click", (e) => {
          if (!cal.contains(e.target)) cal.open = false;
        });

        actions.append(cal);
        card.append(actions);
        list.append(card);
      });

      sec.append(list);
    }

    // 4b. Dress Code (tampil hanya jika aktif)
    if (hasDressCode) {
      const dc = el("div", "lk-dresscode lk-reveal");
      dc.append(el("h3", "lk-dresscode-title", labels.dress_code_title));

      if (Array.isArray(data.dress_code.warna) && data.dress_code.warna.length) {
        const swatches = el("div", "lk-swatches");
        swatches.setAttribute("role", "list");
        swatches.setAttribute("aria-label", "Palet warna dress code");

        data.dress_code.warna.forEach((hex) => {
          const sw = el("span", "lk-swatch");
          sw.setAttribute("role", "listitem");
          sw.style.backgroundColor = hex;
          sw.title = hex;
          sw.setAttribute("aria-label", `Warna ${hex}`);
          swatches.append(sw);
        });
        dc.append(swatches);
      }

      if (data.dress_code.keterangan) {
        dc.append(el("p", "lk-dresscode-desc", data.dress_code.keterangan));
      }

      sec.append(dc);
    }

    return sec;
  }

  /* ---------- Section 5: Cerita & Galeri ---------- */
  function renderCeritaGaleri(data, theme, labels) {
    const stories = Array.isArray(data.cerita) ? data.cerita.filter((s) => s && (s.judul || s.deskripsi)) : [];
    const gallery = Array.isArray(data.galeri)
      ? data.galeri
          .map((item, idx) =>
            typeof item === "string"
              ? { src: item.trim(), alt: `Momen ${idx + 1}`, caption: "" }
              : {
                  src: item && item.src ? String(item.src).trim() : "",
                  srcset: item && item.srcset ? String(item.srcset).trim() : "",
                  sizes: item && item.sizes ? String(item.sizes).trim() : "",
                  alt: (item && item.alt) || `Momen ${idx + 1}`,
                  caption: (item && item.caption) || ""
                }
          )
          .filter((item) => item.src)
      : [];

    if (!stories.length && !gallery.length) return null;

    const sec = el("section", "lk-section");
    sec.id = "cerita-galeri";

    const ornaments = theme.ornaments || {};
    if (typeof ornaments.divider === "function") {
      const divWrap = el("div", "lk-divider lk-reveal");
      divWrap.append(ornaments.divider());
      sec.append(divWrap);
    }

    if (stories.length) {
      const storyBlock = el("div", "lk-story-block");
      storyBlock.append(
        el("p", "lk-section-eyebrow lk-reveal", "Our Journey"),
        el("h2", "lk-section-title lk-reveal", labels.story_title)
      );

      const timeline = el("div", "lk-timeline");
      stories.forEach((s) => {
        const item = el("article", "lk-timeline-item lk-reveal");
        item.append(el("span", "lk-timeline-dot"));
        const meta = [s.tanggal, s.kota].filter(Boolean).join(" · ");
        if (meta) item.append(el("p", "lk-timeline-meta", meta));
        if (s.judul) item.append(el("h3", "lk-timeline-title", s.judul));
        if (s.deskripsi) item.append(el("p", "lk-timeline-desc", s.deskripsi));
        timeline.append(item);
      });

      storyBlock.append(timeline);
      sec.append(storyBlock);
    }

    if (gallery.length) {
      const galBlock = el("div", "lk-gallery-block");
      galBlock.append(
        el("p", "lk-section-eyebrow lk-reveal", "Moments"),
        el("h2", "lk-section-title lk-reveal", labels.gallery_title)
      );

      const grid = el("div", "lk-gallery-grid");
      gallery.forEach((item, idx) => {
        const btn = el("button", "lk-gallery-item lk-reveal");
        btn.type = "button";
        btn.setAttribute("aria-label", `Perbesar ${item.alt}`);

        const img = el("img");
        img.src = item.src;
        if (item.srcset) img.srcset = item.srcset;
        if (item.sizes) img.sizes = item.sizes;
        img.alt = item.alt;
        img.loading = "lazy";
        img.decoding = "async";

        btn.append(img);
        if (item.caption) {
          const cap = el("span", "lk-gallery-cap", item.caption);
          cap.setAttribute("aria-hidden", "true");
          btn.append(cap);
        }
        btn.addEventListener("click", () => openLightbox(gallery, idx, btn));
        grid.append(btn);
      });

      galBlock.append(grid);
      sec.append(galBlock);
    }

    return sec;
  }

  /* ---------- Section 6: RSVP & Ucapan ---------- */
  function createRsvpStore(data) {
    const endpoint = data.rsvp_endpoint ? String(data.rsvp_endpoint).trim() : "";
    const localKey = `lk-rsvp-${data.slug || "default"}`;

    function normalizeItem(raw) {
      const attMap = { y: "hadir", hadir: "hadir", n: "tidak", tidak: "tidak", m: "ragu", ragu: "ragu" };
      const att = attMap[String(raw.att || "").toLowerCase()] || "hadir";
      const guests = Math.min(5, Math.max(1, parseInt(raw.guests, 10) || 1));
      const rawMsg = String(raw.msg || "").trim();
      const msg = /^'?-$/.test(rawMsg) ? "" : rawMsg;
      return {
        ts: Number(raw.ts) || Date.now(),
        name: String(raw.name || "").trim(),
        att,
        guests,
        msg
      };
    }

    return {
      async list() {
        if (endpoint) {
          const sep = endpoint.includes("?") ? "&" : "?";
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 12000);
          try {
            const res = await fetch(`${endpoint}${sep}limit=${MAX_WISHES}&t=${Date.now()}`, {
              cache: "no-store",
              signal: ctrl.signal
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (!Array.isArray(json)) throw new Error("Invalid response");
            return json.map(normalizeItem).filter((w) => w.name).slice(0, MAX_WISHES);
          } finally {
            clearTimeout(timer);
          }
        }
        try {
          const saved = JSON.parse(localStorage.getItem(localKey) || "[]");
          return Array.isArray(saved) ? saved.map(normalizeItem).slice(0, MAX_WISHES) : [];
        } catch {
          return [];
        }
      },

      async add(item) {
        // Hook uji simulasi gagal kirim via window.__LK_SIMULATE_RSVP_ERROR = true
        if (window.__LK_SIMULATE_RSVP_ERROR) {
          throw new Error("Simulated write failure");
        }
        if (endpoint) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 12000);
          try {
            await fetch(endpoint, {
              method: "POST",
              mode: "no-cors",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify(item),
              signal: ctrl.signal
            });
            return;
          } finally {
            clearTimeout(timer);
          }
        }
        const current = await this.list();
        current.unshift(normalizeItem(item));
        localStorage.setItem(localKey, JSON.stringify(current.slice(0, MAX_WISHES)));
      }
    };
  }

  function renderRsvp(data, theme, labels, guestName) {
    const sec = el("section", "lk-section");
    sec.id = "rsvp";

    const ornaments = theme.ornaments || {};
    if (typeof ornaments.divider === "function") {
      const divWrap = el("div", "lk-divider lk-reveal");
      divWrap.append(ornaments.divider());
      sec.append(divWrap);
    }

    sec.append(
      el("p", "lk-section-eyebrow lk-reveal", "RSVP"),
      el("h2", "lk-section-title lk-reveal", labels.rsvp_title),
      el("p", "lk-lead lk-reveal", "Kehadiran serta doa restu Anda sangat berarti bagi kami. Mohon konfirmasi kehadiran melalui formulir di bawah ini.")
    );

    const form = el("form", "lk-rsvp-form lk-reveal");
    form.noValidate = true;

    // Honeypot anti-spam
    const hp = el("input", "lk-honeypot");
    hp.type = "text";
    hp.name = "website";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    form.append(hp);

    // 1. Nama
    const nameField = el("div", "lk-field");
    const nameLbl = el("label", "lk-label", "Nama Lengkap");
    nameLbl.htmlFor = "lk-rsvp-name";
    const nameInput = el("input", "lk-input");
    nameInput.id = "lk-rsvp-name";
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.maxLength = 60;
    nameInput.required = true;
    nameInput.autocomplete = "name";
    nameInput.placeholder = "Tulis nama Anda";
    nameInput.setAttribute("aria-describedby", "lk-err-name");
    if (guestName) nameInput.value = guestName;

    const nameMeta = el("div", "lk-field-meta");
    const nameErr = el("span", "lk-error");
    nameErr.id = "lk-err-name";
    nameMeta.append(nameErr);
    nameField.append(nameLbl, nameInput, nameMeta);

    // 2. Kehadiran (Hadir / Tidak Hadir / Ragu)
    const attFieldset = el("fieldset", "lk-fieldset");
    const attLegend = el("legend", "lk-label", "Konfirmasi Kehadiran");
    const attGroup = el("div", "lk-pill-group");
    const attOptions = [
      ["hadir", "Hadir"],
      ["tidak", "Tidak Hadir"],
      ["ragu", "Masih Ragu"]
    ];
    attOptions.forEach(([val, text]) => {
      const wrap = el("label", "lk-pill-option");
      const radio = el("input");
      radio.type = "radio";
      radio.name = "att";
      radio.value = val;
      radio.id = `lk-att-${val}`;
      wrap.append(radio, el("span", "lk-pill-label", text));
      attGroup.append(wrap);
    });
    const attMeta = el("div", "lk-field-meta");
    const attErr = el("span", "lk-error");
    attErr.id = "lk-err-att";
    attMeta.append(attErr);
    attFieldset.append(attLegend, attGroup, attMeta);

    // 3. Jumlah Tamu (1–5)
    const guestsFieldset = el("fieldset", "lk-fieldset");
    const guestsLegend = el("legend", "lk-label", "Jumlah Tamu (1–5)");
    const guestsGroup = el("div", "lk-guest-counts");
    for (let i = 1; i <= 5; i++) {
      const wrap = el("label", "lk-pill-option");
      const radio = el("input");
      radio.type = "radio";
      radio.name = "guests";
      radio.value = String(i);
      radio.id = `lk-guests-${i}`;
      if (i === 1) radio.checked = true;
      wrap.append(radio, el("span", "lk-pill-label", `${i} Org`));
      guestsGroup.append(wrap);
    }
    const guestsMeta = el("div", "lk-field-meta");
    const guestsErr = el("span", "lk-error");
    guestsErr.id = "lk-err-guests";
    guestsMeta.append(guestsErr);
    guestsFieldset.append(guestsLegend, guestsGroup, guestsMeta);

    // 4. Ucapan & Doa
    const msgField = el("div", "lk-field");
    const msgLbl = el("label", "lk-label", "Doa & Ucapan (Opsional)");
    msgLbl.htmlFor = "lk-rsvp-msg";
    const msgInput = el("textarea", "lk-textarea");
    msgInput.id = "lk-rsvp-msg";
    msgInput.name = "msg";
    msgInput.maxLength = 500;
    msgInput.placeholder = `Tulis doa terbaik untuk ${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`;
    msgInput.setAttribute("aria-describedby", "lk-rsvp-counter");
    const msgMeta = el("div", "lk-field-meta");
    const msgCounter = el("span", "lk-counter", "0 / 500");
    msgCounter.id = "lk-rsvp-counter";
    msgMeta.append(msgCounter);
    msgField.append(msgLbl, msgInput, msgMeta);

    // Submit & status
    const submitBtn = el("button", "lk-btn lk-btn--solid", "Kirim Konfirmasi");
    submitBtn.type = "submit";
    const statusEl = el("p", "lk-form-status");
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");

    form.append(nameField, attFieldset, guestsFieldset, msgField, submitBtn, statusEl);
    sec.append(form);

    // Daftar Ucapan
    const wishesWrap = el("div", "lk-wishes-wrap lk-reveal");
    const wishesHead = el("div", "lk-wishes-head");
    const wishesTitle = el("h3", "lk-wishes-title", labels.wishes_title);
    const wishesSummary = el("p", "lk-wishes-summary");
    wishesHead.append(wishesTitle, wishesSummary);

    const wishesList = el("ul", "lk-wishes-list");
    const moreWrap = el("div", "lk-wishes-more-wrap");
    const moreBtn = el("button", "lk-btn", "Tampilkan Lebih Banyak");
    moreBtn.type = "button";
    moreBtn.hidden = true;
    moreWrap.append(moreBtn);

    wishesWrap.append(wishesHead, wishesList, moreWrap);
    sec.append(wishesWrap);

    // Logic
    const store = createRsvpStore(data);
    let shownCount = WISHES_PAGE;
    let isSubmitting = false;
    let lastSubmitTime = 0;
    let lastSignature = "";

    const attLabelMap = { hadir: "Hadir", tidak: "Tidak Hadir", ragu: "Ragu" };

    msgInput.addEventListener("input", () => {
      msgCounter.textContent = `${msgInput.value.length} / 500`;
    });

    nameInput.addEventListener("input", () => {
      nameErr.textContent = "";
      nameInput.setAttribute("aria-invalid", "false");
    });

    attFieldset.addEventListener("change", () => {
      attErr.textContent = "";
    });

    guestsFieldset.addEventListener("change", () => {
      guestsErr.textContent = "";
    });

    async function renderWishesList() {
      let items = [];
      try {
        items = await store.list();
      } catch {
        wishesList.replaceChildren(el("li", "lk-wishes-empty", "Ucapan belum dapat dimuat. Silakan muat ulang halaman."));
        moreBtn.hidden = true;
        return;
      }

      if (!items.length) {
        wishesSummary.textContent = "";
        wishesList.replaceChildren(el("li", "lk-wishes-empty", "Belum ada ucapan. Jadilah yang pertama mengirimkan doa restu."));
        moreBtn.hidden = true;
        return;
      }

      const hadirCount = items.filter((w) => w.att === "hadir").length;
      const raguCount = items.filter((w) => w.att === "ragu").length;
      const tidakCount = items.filter((w) => w.att === "tidak").length;
      wishesSummary.textContent = `${hadirCount} Hadir · ${raguCount} Ragu · ${tidakCount} Tidak Hadir`;

      wishesList.replaceChildren();
      items.slice(0, shownCount).forEach((w) => {
        const li = el("li", "lk-wish-card");
        const top = el("div", "lk-wish-top");
        const who = el("span", "lk-wish-name", w.name);

        const badges = el("div", "lk-wish-badges");
        const attBadge = el("span", `lk-wish-badge${w.att === "hadir" ? " lk-wish-badge--hadir" : ""}`, attLabelMap[w.att] || "Hadir");
        badges.append(attBadge);
        if (w.att !== "tidak" && w.guests >= 1) {
          badges.append(el("span", "lk-wish-badge", `${w.guests} Tamu`));
        }

        top.append(who, badges);
        li.append(top);

        if (w.msg) {
          li.append(el("p", "lk-wish-msg", w.msg));
        }

        const timeEl = el("time", "lk-wish-time", formatRelativeTime(w.ts));
        timeEl.dateTime = new Date(w.ts).toISOString();
        li.append(timeEl);

        wishesList.append(li);
      });

      const remaining = items.length - shownCount;
      moreBtn.hidden = remaining <= 0;
      if (remaining > 0) {
        moreBtn.textContent = `Tampilkan Lebih Banyak (${remaining})`;
      }
    }

    moreBtn.addEventListener("click", () => {
      shownCount += WISHES_PAGE;
      renderWishesList();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      // Honeypot check
      if (hp.value.trim()) {
        statusEl.className = "lk-form-status";
        statusEl.textContent = "Terima kasih atas konfirmasi Anda.";
        return;
      }

      const name = nameInput.value.trim();
      const attSelected = form.querySelector('input[name="att"]:checked');
      const att = attSelected ? attSelected.value : "";
      const guestsSelected = form.querySelector('input[name="guests"]:checked');
      const guests = guestsSelected ? parseInt(guestsSelected.value, 10) : 0;
      const msg = msgInput.value.trim();

      let firstInvalid = null;
      if (!name) {
        nameErr.textContent = "Nama wajib diisi.";
        nameInput.setAttribute("aria-invalid", "true");
        firstInvalid = firstInvalid || nameInput;
      } else {
        nameErr.textContent = "";
        nameInput.setAttribute("aria-invalid", "false");
      }

      if (!att) {
        attErr.textContent = "Silakan pilih status kehadiran.";
        firstInvalid = firstInvalid || form.querySelector('input[name="att"]');
      } else {
        attErr.textContent = "";
      }

      if (!Number.isInteger(guests) || guests < 1 || guests > 5) {
        guestsErr.textContent = "Pilih jumlah tamu antara 1 hingga 5.";
        firstInvalid = firstInvalid || form.querySelector('input[name="guests"]');
      } else {
        guestsErr.textContent = "";
      }

      if (firstInvalid) {
        statusEl.textContent = "";
        firstInvalid.focus();
        return;
      }

      // Anti-spam sederhana: cooldown + deteksi duplikat identik
      const now = Date.now();
      const sig = `${name.toLowerCase()}|${att}|${guests}|${msg}`;
      if (sig === lastSignature) {
        statusEl.className = "lk-form-status";
        statusEl.textContent = "Konfirmasi yang sama sudah terkirim. Terima kasih.";
        return;
      }
      if (now - lastSubmitTime < RATE_LIMIT_MS) {
        const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
        statusEl.className = "lk-form-status is-error";
        statusEl.textContent = `Mohon tunggu ${waitSec} detik sebelum mengirim kembali.`;
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.textContent = "Mengirim…";
      statusEl.className = "lk-form-status";
      statusEl.textContent = "";

      const payload = {
        ts: now,
        name: name.slice(0, 60),
        att,
        guests,
        msg: msg.slice(0, 500) || "-"
      };

      try {
        await store.add(payload);
        lastSubmitTime = Date.now();
        lastSignature = sig;
        msgInput.value = "";
        msgCounter.textContent = "0 / 500";
        statusEl.className = "lk-form-status";
        statusEl.textContent = "Terima kasih, konfirmasi & doa Anda telah tercatat.";
        await renderWishesList();
      } catch {
        // Kegagalan tulis: tampilkan pesan & jangan hapus isi form!
        statusEl.className = "lk-form-status is-error";
        statusEl.textContent = "Gagal mengirim, coba lagi";
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.textContent = "Kirim Konfirmasi";
      }
    });

    renderWishesList();
    return sec;
  }

  /* ---------- Section 7: Amplop & Penutup ---------- */
  function renderAmplopPenutup(data, theme, labels) {
    const sec = el("section", "lk-section");
    sec.id = "amplop";

    const ornaments = theme.ornaments || {};
    const accounts = Array.isArray(data.amplop) ? data.amplop.filter((a) => a && a.no_rekening) : [];
    const giftAddress = data.alamat_kado ? String(data.alamat_kado).trim() : "";

    if (accounts.length || giftAddress) {
      const giftBlock = el("div", "lk-gift-block");
      if (typeof ornaments.divider === "function") {
        const divWrap = el("div", "lk-divider lk-reveal");
        divWrap.append(ornaments.divider());
        giftBlock.append(divWrap);
      }

      giftBlock.append(
        el("p", "lk-section-eyebrow lk-reveal", "Wedding Gift"),
        el("h2", "lk-section-title lk-reveal", labels.gift_title),
        el("p", "lk-lead lk-reveal", "Doa restu Anda merupakan karunia terindah bagi kami. Apabila berkenan memberikan tanda kasih, dapat disalurkan melalui informasi berikut.")
      );

      const cards = el("div", "lk-gift-cards");

      accounts.forEach((acc) => {
        const card = el("div", "lk-bank-card lk-reveal");
        const top = el("div", "lk-bank-top");
        top.append(el("span", "lk-bank-chip"), el("span", "lk-bank-name", acc.bank || "Bank"));

        const num = el("p", "lk-bank-num", acc.no_rekening);

        const bottom = el("div", "lk-bank-bottom");
        bottom.append(el("p", "lk-bank-holder", `a.n. ${acc.atas_nama || ""}`));

        const copyBtn = el("button", "lk-btn lk-copy-btn", labels.copy_account);
        copyBtn.type = "button";
        const cleanDigits = String(acc.no_rekening).replace(/\s+/g, "");
        copyBtn.addEventListener("click", () => copyToClipboard(cleanDigits, copyBtn, labels.copied));

        bottom.append(copyBtn);
        card.append(top, num, bottom);
        cards.append(card);
      });

      if (giftAddress) {
        const addrCard = el("div", "lk-bank-card lk-address-card lk-reveal");
        const icoWrap = el("div", "lk-event-icon");
        icoWrap.style.marginBottom = "0";
        icoWrap.append(ICONS.gift());

        const copyAddrBtn = el("button", "lk-btn lk-copy-btn", labels.copy_address);
        copyAddrBtn.type = "button";
        copyAddrBtn.addEventListener("click", () => copyToClipboard(giftAddress, copyAddrBtn, labels.copied));

        addrCard.append(
          icoWrap,
          el("h3", "lk-address-title", "Kirim Kado"),
          el("p", "lk-address-text", giftAddress),
          copyAddrBtn
        );
        cards.append(addrCard);
      }

      giftBlock.append(cards);
      sec.append(giftBlock);
    }

    // Penutup
    const closing = el("div", "lk-closing lk-reveal");
    if (typeof ornaments.divider === "function") {
      const divWrap = el("div", "lk-divider");
      divWrap.append(ornaments.divider());
      closing.append(divWrap);
    }

    closing.append(el("p", "lk-closing-text", labels.closing));

    const initials = data.inisial ||
      `${(data.mempelai.pria.nama_panggilan || "P")[0]}${(data.mempelai.wanita.nama_panggilan || "W")[0]}`.toUpperCase();
    if (typeof ornaments.closingEmblem === "function") {
      const emblemWrap = el("div", "lk-closing-emblem");
      emblemWrap.append(ornaments.closingEmblem(initials));
      closing.append(emblemWrap);
    }

    closing.append(
      el("p", "lk-closing-names", `${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`)
    );

    const firstEvent = Array.isArray(data.acara) && data.acara[0];
    if (firstEvent && firstEvent.mulai) {
      closing.append(el("p", "lk-closing-date", fmtDateID(firstEvent.mulai)));
    }

    sec.append(closing);
    return sec;
  }

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".lk-reveal");
    if (!targets.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      targets.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    targets.forEach((n) => observer.observe(n));
  }

  /* ---------- Bootstrap ---------- */
  function init() {
    const data = window.INVITATION_DATA;
    if (!data || !window.LKThemes) return;

    const params = new URLSearchParams(window.location.search);

    // Allowlisted query override untuk preview/testing tema
    const queryTema = (params.get("tema") || "").trim();
    const themeId = queryTema && window.LKThemes.has(queryTema) ? queryTema : (data.tema || "champagne-noir");
    const theme = window.LKThemes.get(themeId);
    if (!theme) return;

    document.documentElement.dataset.theme = theme.id;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta && theme.tokens && theme.tokens.bg) {
      themeMeta.setAttribute("content", theme.tokens.bg);
    }

    const labels = Object.assign({}, DEFAULT_LABELS, theme.labels || {});

    // Nama tamu dari ?to= / ?kepada= (aman dari XSS karena selalu pakai textContent / .value)
    const rawGuest = (params.get("to") || params.get("kepada") || "").trim().slice(0, 80);
    const displayGuest = rawGuest || labels.default_guest;

    // Document title
    const coupleShort = `${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`;
    document.title = `Undangan Pernikahan ${coupleShort}`;

    const audioManager = createAudioManager(data.musik);

    // Render Main Sections (urutan configurable via data.section_order atau theme.section_order)
    const main = $("#lk-main");
    const sectionRenderers = {
      pembuka: () => renderPembuka(data, theme, labels),
      acara: () => renderAcara(data, theme, labels),
      cerita_galeri: () => renderCeritaGaleri(data, theme, labels),
      rsvp: () => renderRsvp(data, theme, labels, rawGuest),
      amplop: () => renderAmplopPenutup(data, theme, labels)
    };

    const order = Array.isArray(data.section_order) && data.section_order.length
      ? data.section_order
      : (Array.isArray(theme.section_order) && theme.section_order.length ? theme.section_order : DEFAULT_ORDER);

    main.replaceChildren();
    order.forEach((key) => {
      const renderFn = sectionRenderers[key];
      if (!renderFn) return;
      const secEl = renderFn();
      if (secEl) main.append(secEl);
    });

    // Footer Lembar Kabar
    const footer = el("footer", "lk-footer");
    footer.append(document.createTextNode("Dibuat dengan "));
    const lkLink = el("a", null, "Lembar Kabar");
    lkLink.href = "https://lembarkabar.web.id/";
    lkLink.target = "_blank";
    lkLink.rel = "noopener noreferrer";
    footer.append(lkLink);
    main.append(footer);

    // Render Cover & Gate Opener (Section 1 & 2)
    const coverHost = $("#lk-cover");
    let hasOpened = false;

    function finishOpen() {
      if (hasOpened) return;
      hasOpened = true;
      coverHost.classList.add("is-gone");
      coverHost.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lk-locked");
      document.body.classList.add("lk-opened");
      window.scrollTo(0, 0);
      initScrollReveal();
    }

    const hooks = {
      guestName: displayGuest,
      reducedMotion: prefersReducedMotion(),
      onOpen() {
        // Gesture tap inilah yang memulai musik (browser block autoplay tanpa interaksi)
        audioManager.startFromGesture();
        if (prefersReducedMotion() || !theme.opener || typeof theme.opener.open !== "function") {
          finishOpen();
          return;
        }
        theme.opener.open(coverHost, { onComplete: finishOpen });
      },
      onSkip() {
        audioManager.revealControlOnly();
        finishOpen();
      }
    };

    if (theme.opener && typeof theme.opener.render === "function") {
      theme.opener.render(coverHost, data, labels, hooks);
    } else {
      // Fallback opener generik bila tema tidak mendefinisikan opener kustom
      const wrap = el("div");
      wrap.append(
        el("p", "lk-section-eyebrow", "The Wedding of"),
        el("h1", "lk-couple-headline", coupleShort),
        el("p", null, `${labels.to_prefix} ${displayGuest}`)
      );
      const btn = el("button", "lk-btn", labels.open_button);
      btn.type = "button";
      btn.addEventListener("click", hooks.onOpen);
      wrap.append(btn);
      coverHost.replaceChildren(wrap);
    }
  }

  window.LKApp = { init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
