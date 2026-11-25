/**
 * LAYER 3 — TEMA: CHAMPAGNE NOIR
 * Kontrak tema sesuai SPEC §2.2 & §5:
 * tokens, labels (§5.3), opener (amplop + segel lilin <= 2s),
 * ornaments (monogram shimmer 1x, divider art deco, bingkai sudut bertingkat), section_order.
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svgEl(viewBox, markup, width, height) {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", viewBox);
    if (width) s.setAttribute("width", String(width));
    if (height) s.setAttribute("height", String(height));
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = markup;
    return s;
  }

  function fmtShortDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    });
  }

  function fmtLongDate(iso) {
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

  window.LKThemes.register("champagne-noir", {
    name: "Champagne Noir",

    tokens: {
      bg: "#0E0E0E",
      surface: "#171717",
      gold: "#C9A96E",
      text: "#F3EDE2",
      textMuted: "#B8B0A2",
      line: "rgba(201,169,110,.35)",
      fontDisplay: '"Cormorant Garamond", serif',
      fontBody: '"Montserrat", sans-serif',
      radius: "2px",
      durSlow: "900ms"
    },

    // Kamus label sesuai SPEC §5.3
    labels: {
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
      closing: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      closing_title: "Terima Kasih",
      closing_signoff: "Kami yang berbahagia,"
    },

    section_order: ["pembuka", "acara", "cerita_galeri", "rsvp", "amplop"],

    opener: {
      render(container, data, labels, hooks) {
        const inner = el("div", "cn-cover-inner");
        const initials = data.inisial ||
          `${(data.mempelai.pria.nama_panggilan || "P")[0]}${(data.mempelai.wanita.nama_panggilan || "W")[0]}`.toUpperCase();
        const coupleNames = `${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`;
        const firstDate = Array.isArray(data.acara) && data.acara[0] ? fmtShortDate(data.acara[0].mulai) : "";

        const firstEvent = Array.isArray(data.acara) && data.acara[0] ? data.acara[0] : null;
        const longDate = firstEvent ? fmtLongDate(firstEvent.mulai) : "";

        // Bingkai Art Deco sepanjang layar + cahaya ambient (dekoratif)
        const decor = el("div", "cn-cover-decor");
        decor.setAttribute("aria-hidden", "true");
        decor.append(
          el("span", "cn-cover-glow"),
          el("span", "cn-cover-frame"),
          el("span", "cn-cover-corner cn-cover-corner--tl"),
          el("span", "cn-cover-corner cn-cover-corner--tr"),
          el("span", "cn-cover-corner cn-cover-corner--bl"),
          el("span", "cn-cover-corner cn-cover-corner--br")
        );
        const dust = el("span", "cn-cover-dust");
        for (let i = 0; i < 14; i++) {
          const mote = el("i");
          mote.style.setProperty("--x", `${(i * 37 + 11) % 100}%`);
          mote.style.setProperty("--d", `${9 + (i * 7) % 8}s`);
          mote.style.setProperty("--delay", `${-((i * 13) % 11)}s`);
          mote.style.setProperty("--s", `${1 + (i % 3)}px`);
          dust.append(mote);
        }
        decor.append(dust);

        // Kepala sampul: eyebrow, nama pasangan, tanggal
        const head = el("header", "cn-cover-head");
        const title = el("h1", "cn-cover-names");
        title.append(
          el("span", "cn-cover-name", data.mempelai.pria.nama_panggilan),
          el("span", "cn-cover-amp", "&"),
          el("span", "cn-cover-name", data.mempelai.wanita.nama_panggilan)
        );
        head.append(el("p", "cn-cover-eyebrow", "The Wedding of"), title);
        if (longDate) {
          const dateRow = el("p", "cn-cover-date");
          dateRow.append(
            el("span", "cn-cover-date-line"),
            el("span", "cn-cover-date-text", longDate),
            el("span", "cn-cover-date-line")
          );
          head.append(dateRow);
        }
        inner.append(head);

        // Amplop hitam + kartu dalam + flap + segel lilin
        const stage = el("div", "cn-envelope-stage");
        const env = el("div", "cn-envelope");

        const card = el("div", "cn-card");
        card.append(
          el("p", "cn-card-names", coupleNames),
          el("p", "cn-card-date", firstDate)
        );

        const pocket = el("div", "cn-pocket");
        pocket.append(
          svgEl(
            "0 0 300 200",
            '<polygon points="0,0 150,110 0,200" fill="var(--surface)" stroke="rgba(201,169,110,0.28)" stroke-width="1"/>' +
            '<polygon points="300,0 150,110 300,200" fill="var(--surface)" stroke="rgba(201,169,110,0.28)" stroke-width="1"/>' +
            '<polygon points="0,200 150,96 300,200" fill="var(--bg)" stroke="rgba(201,169,110,0.34)" stroke-width="1"/>'
          )
        );

        const flap = el("div", "cn-flap");
        flap.append(
          svgEl(
            "0 0 300 120",
            '<polygon points="0,0 300,0 150,114" fill="var(--surface)" stroke="rgba(201,169,110,0.45)" stroke-width="1.2"/>' +
            '<polyline points="16,8 150,104 284,8" fill="none" stroke="rgba(201,169,110,0.2)" stroke-width="0.9"/>'
          )
        );

        const seal = el("button", "cn-seal");
        seal.type = "button";
        seal.setAttribute("aria-label", `${labels.open_button} (${initials})`);
        seal.append(el("span", "cn-seal-text", initials));
        seal.addEventListener("click", hooks.onOpen);

        env.append(card, pocket, flap, seal);
        stage.append(env);
        inner.append(stage);

        // Kepada Yth. + Nama Tamu (serif italic) dalam plakat tipis
        const guest = el("div", "cn-guest");
        guest.append(
          el("p", "cn-to-label", labels.to_prefix),
          el("p", "cn-guest-name", hooks.guestName)
        );
        inner.append(guest);

        // Tombol buka (outline emas) + tombol Lewati
        const actions = el("div", "cn-cover-actions");
        const openBtn = el("button", "lk-btn cn-open-btn", labels.open_button);
        openBtn.type = "button";
        openBtn.addEventListener("click", hooks.onOpen);

        const skipBtn = el("button", "lk-btn lk-btn--ghost", labels.skip_button);
        skipBtn.type = "button";
        skipBtn.addEventListener("click", hooks.onSkip);

        actions.append(openBtn, skipBtn);
        inner.append(actions);

        container.replaceChildren(decor, inner);
      },

      // Sekuens pembuka amplop: segel 300ms -> flap 600ms -> kartu naik 550ms -> fade 450ms (Total ~1.8s <= 2s)
      open(container, { onComplete }) {
        if (container.dataset.opening === "1") return;
        container.dataset.opening = "1";

        // Disable interaksi ganda pada tombol cover
        container.querySelectorAll("button").forEach((b) => {
          b.disabled = true;
        });

        container.classList.add("cn-sealing");

        setTimeout(() => {
          container.classList.add("cn-unfolding");
        }, 280);

        setTimeout(() => {
          container.classList.add("cn-rising");
        }, 760);

        setTimeout(() => {
          container.classList.add("cn-fading");
        }, 1340);

        setTimeout(() => {
          onComplete();
        }, 1800);
      }
    },

    ornaments: {
      monogram(initials) {
        const box = el("div", "cn-monogram");
        box.setAttribute("aria-label", `Monogram ${initials}`);
        box.append(el("span", "cn-monogram-letters", initials));
        return box;
      },

      divider() {
        return svgEl(
          "0 0 180 18",
          '<line x1="0" y1="9" x2="72" y2="9" stroke="currentColor" stroke-width="0.9" opacity="0.45"/>' +
          '<polygon points="90,2 97,9 90,16 83,9" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
          '<circle cx="90" cy="9" r="1.8" fill="currentColor"/>' +
          '<line x1="108" y1="9" x2="180" y2="9" stroke="currentColor" stroke-width="0.9" opacity="0.45"/>',
          180,
          18
        );
      },

      photoFrame(contentEl) {
        const frame = el("div", "cn-deco-frame");
        frame.append(
          el("span", "cn-corner cn-corner--tl"),
          el("span", "cn-corner cn-corner--tr"),
          el("span", "cn-corner cn-corner--bl"),
          el("span", "cn-corner cn-corner--br"),
          contentEl
        );
        return frame;
      },

      portraitPlaceholder(initial, nickname) {
        const wrap = el("div", "cn-portrait-art");
        // Sunburst Art Deco dari dasar lengkung + inisial serif besar
        wrap.append(
          svgEl(
            "0 0 200 260",
            '<g class="cn-sunburst" stroke="currentColor" stroke-width="0.6" fill="none"><line x1="100" y1="250" x2="-64.2" y2="206.0" /><line x1="100" y1="250" x2="-47.2" y2="165.0" /><line x1="100" y1="250" x2="-20.2" y2="129.8" /><line x1="100" y1="250" x2="15.0" y2="102.8" /><line x1="100" y1="250" x2="56.0" y2="85.8" /><line x1="100" y1="250" x2="100.0" y2="80.0" /><line x1="100" y1="250" x2="144.0" y2="85.8" /><line x1="100" y1="250" x2="185.0" y2="102.8" /><line x1="100" y1="250" x2="220.2" y2="129.8" /><line x1="100" y1="250" x2="247.2" y2="165.0" /><line x1="100" y1="250" x2="264.2" y2="206.0" /></g>' +
            '<g stroke="currentColor" fill="none">' +
            '<path d="M30 250 A70 70 0 0 1 170 250" stroke-width="0.8" opacity="0.5"/>' +
            '<path d="M55 250 A45 45 0 0 1 145 250" stroke-width="0.8" opacity="0.35"/>' +
            '</g>'
          )
        );
        wrap.firstChild.classList.add("cn-portrait-bg");
        wrap.firstChild.setAttribute("preserveAspectRatio", "xMidYMax slice");
        wrap.append(
          el("span", "cn-portrait-letter", initial),
          el("span", "cn-portrait-initial", nickname || initial)
        );
        return wrap;
      },

      closingEmblem(initials) {
        const safe = String(initials).replace(/[<>&"']/g, "");
        return svgEl(
          "0 0 160 104",
          '<g stroke="currentColor" stroke-width="0.6" opacity="0.3"><line x1="111.9" y1="48.4" x2="134.5" y2="40.2"/><line x1="108.2" y1="41.0" x2="128.1" y2="27.6"/><line x1="102.8" y1="34.7" x2="118.8" y2="16.9"/><line x1="96.0" y1="30.0" x2="107.2" y2="8.8"/><line x1="88.2" y1="27.0" x2="94.0" y2="3.7"/><line x1="80.0" y1="26.0" x2="80.0" y2="2.0"/><line x1="71.8" y1="27.0" x2="66.0" y2="3.7"/><line x1="64.0" y1="30.0" x2="52.8" y2="8.8"/><line x1="57.2" y1="34.7" x2="41.2" y2="16.9"/><line x1="51.8" y1="41.0" x2="31.9" y2="27.6"/><line x1="48.1" y1="48.4" x2="25.5" y2="40.2"/></g>' +
          '<path d="M14 60 H48 M112 60 H146" stroke="currentColor" stroke-width="0.8" opacity="0.6"/>' +
          '<path d="M10 60 l4 -4 4 4 -4 4z M142 60 l4 -4 4 4 -4 4z" fill="currentColor" opacity="0.8"/>' +
          '<mask id="cn-emblem-mask"><rect width="160" height="104" fill="#fff"/><rect x="62" y="49" width="36" height="22" rx="3" fill="#000"/></mask>' +
          '<g mask="url(#cn-emblem-mask)">' +
          '<circle cx="67" cy="60" r="24" fill="none" stroke="currentColor" stroke-width="1"/>' +
          '<circle cx="93" cy="60" r="24" fill="none" stroke="currentColor" stroke-width="1"/>' +
          '</g>' +
          '<path d="M80 30 l4 4 -4 4 -4 -4z" fill="currentColor"/>' +
          `<text x="80" y="66" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="17" font-weight="500" letter-spacing="2" fill="currentColor">${safe}</text>`,
          160,
          104
        );
      }
    }
  });
})();
