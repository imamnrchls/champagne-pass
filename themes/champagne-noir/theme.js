/**
 * LAYER 3 — TEMA: CHAMPAGNE NOIR
 * Kontrak tema sesuai SPEC §2.2 & §5:
 * tokens, labels (§5.3), opener (amplop + segel lilin <= 2s),
 * ornaments (monogram shimmer 1x, divider art deco, bingkai lengkung berfiligri),
 * decorate (ornamen arsitektural Art Deco di tiap section), section_order.
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svgEl(viewBox, markup, width, height, className) {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", viewBox);
    if (width) s.setAttribute("width", String(width));
    if (height) s.setAttribute("height", String(height));
    if (className) s.setAttribute("class", className);
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
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

  /* ---------- Pustaka Ornamen Art Deco (SVG ringan, stroke halus) ---------- */

  // Sudut kipas bertingkat Art Deco (untuk sampul & kartu utama)
  function artDecoCorner(pos, variant) {
    const size = variant === "cover" ? 56 : 32;
    const markup = variant === "cover"
      ? '<path d="M1 54 V1 H54" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.9"/>' +
        '<path d="M8 46 V8 H46" fill="none" stroke="currentColor" stroke-width="0.85" opacity="0.55"/>' +
        '<path d="M15 36 V15 H36" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.38"/>' +
        '<path d="M1 1 L18 18 M1 10 L12 10 L10 12 L10 1" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>' +
        '<path d="M16 16 L21 16 L21 21 L16 21 Z" transform="rotate(45 18.5 18.5)" fill="currentColor" opacity="0.75"/>' +
        '<circle cx="46" cy="8" r="1.4" fill="currentColor" opacity="0.7"/>' +
        '<circle cx="8" cy="46" r="1.4" fill="currentColor" opacity="0.7"/>'
      : '<path d="M1 30 V1 H30" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.95"/>' +
        '<path d="M6 22 V6 H22" fill="none" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>' +
        '<path d="M1 1 L11 11" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.45"/>' +
        '<polygon points="11,8 14,11 11,14 8,11" fill="currentColor" opacity="0.75"/>';

    const wrap = el("span", `cn-deco-corner cn-deco-corner--${pos}${variant === "cover" ? " cn-deco-corner--cover" : ""}`);
    wrap.setAttribute("aria-hidden", "true");
    wrap.append(svgEl(`0 0 ${size} ${size}`, markup, size, size));
    return wrap;
  }

  function addCardCorners(target) {
    if (!target || target.querySelector(":scope > .cn-deco-corner")) return;
    target.append(
      artDecoCorner("tl", "card"),
      artDecoCorner("tr", "card"),
      artDecoCorner("bl", "card"),
      artDecoCorner("br", "card")
    );
  }

  // Mahkota kipas sunburst Art Deco (untuk puncak lengkung / sampul / kartu)
  function artDecoFanCrest(className, width, height) {
    return svgEl(
      "0 0 180 42",
      '<g stroke="currentColor" fill="none">' +
      '<line x1="8" y1="36" x2="64" y2="36" stroke-width="0.8" opacity="0.45"/>' +
      '<line x1="116" y1="36" x2="172" y2="36" stroke-width="0.8" opacity="0.45"/>' +
      '<polygon points="8,36 12,33 16,36 12,39" fill="currentColor" stroke="none" opacity="0.65"/>' +
      '<polygon points="164,36 168,33 172,36 168,39" fill="currentColor" stroke="none" opacity="0.65"/>' +
      '<path d="M62 36 A28 28 0 0 1 118 36" stroke-width="0.9" opacity="0.65"/>' +
      '<path d="M71 36 A19 19 0 0 1 109 36" stroke-width="0.7" opacity="0.4"/>' +
      '<g stroke-width="0.75" opacity="0.55">' +
      '<line x1="90" y1="36" x2="90" y2="4"/>' +
      '<line x1="90" y1="36" x2="77" y2="8"/>' +
      '<line x1="90" y1="36" x2="103" y2="8"/>' +
      '<line x1="90" y1="36" x2="66" y2="16"/>' +
      '<line x1="90" y1="36" x2="114" y2="16"/>' +
      '<line x1="90" y1="36" x2="58" y2="26"/>' +
      '<line x1="90" y1="36" x2="122" y2="26"/>' +
      '</g>' +
      '<polygon points="90,26 98,34 90,41 82,34" fill="var(--bg)" stroke="currentColor" stroke-width="1"/>' +
      '<polygon points="90,30 94,34 90,38 86,34" fill="currentColor" stroke="none"/>' +
      '<polygon points="90,1 92.4,4.5 90,8 87.6,4.5" fill="currentColor" stroke="none" opacity="0.9"/>' +
      '</g>',
      width || 180,
      height || 42,
      className
    );
  }

  // Ornamen filigri kecil untuk kutipan, pediment form, & footer
  function artDecoFiligree(className, width, height) {
    return svgEl(
      "0 0 160 20",
      '<g stroke="currentColor" fill="none">' +
      '<line x1="4" y1="10" x2="58" y2="10" stroke-width="0.8" opacity="0.45"/>' +
      '<line x1="102" y1="10" x2="156" y2="10" stroke-width="0.8" opacity="0.45"/>' +
      '<path d="M58 10 L68 4 L78 10 L68 16 Z" stroke-width="0.8" opacity="0.55"/>' +
      '<path d="M82 10 L92 4 L102 10 L92 16 Z" stroke-width="0.8" opacity="0.55"/>' +
      '<polygon points="80,2 88,10 80,18 72,10" fill="var(--bg)" stroke="currentColor" stroke-width="1.1"/>' +
      '<polygon points="80,6 84,10 80,14 76,10" fill="currentColor" stroke="none"/>' +
      '<circle cx="4" cy="10" r="1.4" fill="currentColor" stroke="none" opacity="0.6"/>' +
      '<circle cx="156" cy="10" r="1.4" fill="currentColor" stroke="none" opacity="0.6"/>' +
      '</g>',
      width || 160,
      height || 20,
      className
    );
  }

  // Halo sinar matahari di belakang medali ikon acara / kado
  function medallionHalo() {
    return svgEl(
      "0 0 120 72",
      '<g stroke="currentColor" fill="none" stroke-width="0.7" opacity="0.48">' +
      '<line x1="60" y1="60" x2="60" y2="4"/>' +
      '<line x1="60" y1="60" x2="42" y2="8"/>' +
      '<line x1="60" y1="60" x2="78" y2="8"/>' +
      '<line x1="60" y1="60" x2="26" y2="18"/>' +
      '<line x1="60" y1="60" x2="94" y2="18"/>' +
      '<line x1="60" y1="60" x2="14" y2="34"/>' +
      '<line x1="60" y1="60" x2="106" y2="34"/>' +
      '<line x1="60" y1="60" x2="6" y2="52"/>' +
      '<line x1="60" y1="60" x2="114" y2="52"/>' +
      '<path d="M22 60 A38 38 0 0 1 98 60" stroke-width="0.8" opacity="0.55"/>' +
      '</g>',
      120,
      72,
      "cn-medallion-halo"
    );
  }

  // Watermark guilloché Art Deco untuk kartu rekening hitam-emas
  function cardGuilloche() {
    return svgEl(
      "0 0 220 220",
      '<g stroke="currentColor" fill="none">' +
      '<circle cx="220" cy="220" r="46" stroke-width="0.8" opacity="0.32"/>' +
      '<circle cx="220" cy="220" r="72" stroke-width="0.7" opacity="0.25"/>' +
      '<circle cx="220" cy="220" r="98" stroke-width="0.7" opacity="0.2"/>' +
      '<circle cx="220" cy="220" r="124" stroke-width="0.7" opacity="0.16"/>' +
      '<circle cx="220" cy="220" r="150" stroke-width="0.7" opacity="0.12"/>' +
      '<circle cx="220" cy="220" r="176" stroke-width="0.6" opacity="0.09"/>' +
      '<g stroke-width="0.6" opacity="0.18">' +
      '<line x1="220" y1="220" x2="60" y2="220"/>' +
      '<line x1="220" y1="220" x2="72" y2="160"/>' +
      '<line x1="220" y1="220" x2="96" y2="108"/>' +
      '<line x1="220" y1="220" x2="132" y2="70"/>' +
      '<line x1="220" y1="220" x2="174" y2="48"/>' +
      '<line x1="220" y1="220" x2="220" y2="40"/>' +
      '</g>' +
      '</g>',
      220,
      220,
      "cn-bank-guilloche"
    );
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
        const firstEvent = Array.isArray(data.acara) && data.acara[0] ? data.acara[0] : null;
        const firstDate = firstEvent ? fmtShortDate(firstEvent.mulai) : "";
        const longDate = firstEvent ? fmtLongDate(firstEvent.mulai) : "";

        // Bingkai Art Deco sepanjang layar + sudut filigri + mahkota bawah + debu emas
        const decor = el("div", "cn-cover-decor");
        decor.setAttribute("aria-hidden", "true");
        decor.append(
          el("span", "cn-cover-pattern"),
          el("span", "cn-cover-glow"),
          el("span", "cn-cover-frame"),
          artDecoCorner("tl", "cover"),
          artDecoCorner("tr", "cover"),
          artDecoCorner("bl", "cover"),
          artDecoCorner("br", "cover")
        );

        // Mahkota kipas bawah layar (tidak bertabrakan dengan pil preview di atas)
        const bottomCrest = el("span", "cn-cover-crest cn-cover-crest--bottom");
        bottomCrest.append(artDecoFanCrest("cn-cover-crest-svg", 160, 36));
        decor.append(bottomCrest);

        const dust = el("span", "cn-cover-dust");
        for (let i = 0; i < 16; i++) {
          const mote = el("i");
          mote.style.setProperty("--x", `${(i * 37 + 9) % 100}%`);
          mote.style.setProperty("--d", `${9 + (i * 7) % 8}s`);
          mote.style.setProperty("--delay", `${-((i * 13) % 11)}s`);
          mote.style.setProperty("--s", `${1.2 + (i % 3) * 0.9}px`);
          dust.append(mote);
        }
        decor.append(dust);

        // Kepala sampul: mahkota filigri kecil, eyebrow, nama pasangan, tanggal
        const head = el("header", "cn-cover-head");
        const crownWrap = el("div", "cn-cover-head-crest");
        crownWrap.setAttribute("aria-hidden", "true");
        crownWrap.append(artDecoFanCrest("cn-cover-head-crest-svg", 136, 32));

        const title = el("h1", "cn-cover-names");
        title.append(
          el("span", "cn-cover-name", data.mempelai.pria.nama_panggilan),
          el("span", "cn-cover-amp", "&"),
          el("span", "cn-cover-name", data.mempelai.wanita.nama_panggilan)
        );
        head.append(crownWrap, el("p", "cn-cover-eyebrow", "The Wedding of"), title);
        if (longDate) {
          const dateRow = el("p", "cn-cover-date");
          dateRow.append(
            el("span", "cn-cover-date-line"),
            el("span", "cn-cover-date-gem"),
            el("span", "cn-cover-date-text", longDate),
            el("span", "cn-cover-date-gem"),
            el("span", "cn-cover-date-line")
          );
          head.append(dateRow);
        }
        inner.append(head);

        // Amplop hitam matte + kartu dalam + flap berfiligri + segel lilin emboss
        const stage = el("div", "cn-envelope-stage");
        const env = el("div", "cn-envelope");

        const card = el("div", "cn-card");
        card.append(
          artDecoFiligree("cn-card-crest", 96, 12),
          el("p", "cn-card-names", coupleNames),
          el("p", "cn-card-date", firstDate)
        );

        const pocket = el("div", "cn-pocket");
        pocket.append(
          svgEl(
            "0 0 300 200",
            '<polygon points="0,0 150,110 0,200" fill="var(--surface)" stroke="rgba(201,169,110,0.32)" stroke-width="1"/>' +
            '<polygon points="300,0 150,110 300,200" fill="var(--surface)" stroke="rgba(201,169,110,0.32)" stroke-width="1"/>' +
            '<polygon points="0,200 150,96 300,200" fill="var(--bg)" stroke="rgba(201,169,110,0.42)" stroke-width="1"/>' +
            '<polyline points="20,192 150,108 280,192" fill="none" stroke="rgba(201,169,110,0.18)" stroke-width="0.8"/>' +
            '<path d="M12 184 L20 184 L20 192 M288 184 L280 184 L280 192" fill="none" stroke="rgba(201,169,110,0.42)" stroke-width="0.9"/>'
          )
        );

        const flap = el("div", "cn-flap");
        flap.append(
          svgEl(
            "0 0 300 120",
            '<polygon points="0,0 300,0 150,114" fill="var(--surface)" stroke="rgba(201,169,110,0.52)" stroke-width="1.2"/>' +
            '<polyline points="14,7 150,104 286,7" fill="none" stroke="rgba(201,169,110,0.26)" stroke-width="0.9"/>' +
            '<polyline points="32,7 150,92 268,7" fill="none" stroke="rgba(201,169,110,0.12)" stroke-width="0.7"/>' +
            '<polygon points="150,14 155,20 150,26 145,20" fill="none" stroke="rgba(201,169,110,0.45)" stroke-width="0.9"/>' +
            '<line x1="112" y1="20" x2="140" y2="20" stroke="rgba(201,169,110,0.28)" stroke-width="0.7"/>' +
            '<line x1="160" y1="20" x2="188" y2="20" stroke="rgba(201,169,110,0.28)" stroke-width="0.7"/>'
          )
        );

        const seal = el("button", "cn-seal");
        seal.type = "button";
        seal.setAttribute("aria-label", `${labels.open_button} (${initials})`);
        seal.append(
          svgEl(
            "0 0 72 72",
            '<circle cx="36" cy="36" r="32" fill="none" stroke="rgba(22,18,11,0.34)" stroke-width="0.9" stroke-dasharray="2.5 2.5"/>' +
            '<circle cx="36" cy="36" r="27" fill="none" stroke="rgba(22,18,11,0.28)" stroke-width="0.8"/>' +
            '<polygon points="36,3 38.5,6.5 36,10 33.5,6.5" fill="rgba(22,18,11,0.4)"/>' +
            '<polygon points="36,62 38.5,65.5 36,69 33.5,65.5" fill="rgba(22,18,11,0.4)"/>',
            72,
            72,
            "cn-seal-ring"
          ),
          el("span", "cn-seal-text", initials)
        );
        seal.addEventListener("click", hooks.onOpen);

        env.append(card, pocket, flap, seal);
        stage.append(env);
        inner.append(stage);

        // Kepada Yth. + Nama Tamu (serif italic) dalam plakat berfiligri
        const guest = el("div", "cn-guest");
        guest.append(
          artDecoFiligree("cn-guest-orn cn-guest-orn--top", 120, 14),
          el("p", "cn-to-label", labels.to_prefix),
          el("p", "cn-guest-name", hooks.guestName),
          artDecoFiligree("cn-guest-orn cn-guest-orn--bottom", 120, 14)
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

      // Sekuens pembuka amplop: segel 280ms -> flap 600ms -> kartu naik 550ms -> fade 450ms (Total ~1.8s <= 2s)
      open(container, { onComplete }) {
        if (container.dataset.opening === "1") return;
        container.dataset.opening = "1";

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
      // Monogram oktagonal Art Deco bermahkota sinar + shimmer 1x
      monogram(initials) {
        const box = el("div", "cn-monogram");
        box.setAttribute("aria-label", `Monogram ${initials}`);
        box.append(
          svgEl(
            "0 0 132 132",
            '<g stroke="currentColor" fill="none">' +
            // Sinar lembut belakang monogram
            '<g stroke-width="0.6" opacity="0.28">' +
            '<line x1="66" y1="66" x2="66" y2="4"/>' +
            '<line x1="66" y1="66" x2="66" y2="128"/>' +
            '<line x1="66" y1="66" x2="4" y2="66"/>' +
            '<line x1="66" y1="66" x2="128" y2="66"/>' +
            '<line x1="66" y1="66" x2="20" y2="20"/>' +
            '<line x1="66" y1="66" x2="112" y2="20"/>' +
            '<line x1="66" y1="66" x2="20" y2="112"/>' +
            '<line x1="66" y1="66" x2="112" y2="112"/>' +
            '</g>' +
            // Bingkai oktagon luar & dalam
            '<polygon points="34,12 98,12 120,34 120,98 98,120 34,120 12,98 12,34" fill="var(--bg)" fill-opacity="0.88" stroke-width="1.1" opacity="0.85"/>' +
            '<polygon points="38,18 94,18 114,38 114,94 94,114 38,114 18,94 18,38" stroke-width="0.75" opacity="0.45"/>' +
            // Belah ketupat di empat mata angin
            '<polygon points="66,5 70,12 66,19 62,12" fill="currentColor" stroke="none" opacity="0.9"/>' +
            '<polygon points="66,113 70,120 66,127 62,120" fill="currentColor" stroke="none" opacity="0.9"/>' +
            '<polygon points="5,66 12,62 19,66 12,70" fill="currentColor" stroke="none" opacity="0.75"/>' +
            '<polygon points="113,66 120,62 127,66 120,70" fill="currentColor" stroke="none" opacity="0.75"/>' +
            '</g>',
            132,
            132,
            "cn-monogram-frame"
          ),
          el("span", "cn-monogram-letters", initials)
        );
        return box;
      },

      // Pembatas kipas Art Deco + belah ketupat bertingkat
      divider() {
        return svgEl(
          "0 0 260 28",
          '<g stroke="currentColor" fill="none">' +
          '<line class="cn-div-line" x1="8" y1="14" x2="96" y2="14" stroke-width="0.85" opacity="0.48"/>' +
          '<line class="cn-div-line" x1="164" y1="14" x2="252" y2="14" stroke-width="0.85" opacity="0.48"/>' +
          '<line x1="36" y1="10.5" x2="88" y2="10.5" stroke-width="0.5" opacity="0.22"/>' +
          '<line x1="172" y1="10.5" x2="224" y2="10.5" stroke-width="0.5" opacity="0.22"/>' +
          '<line x1="36" y1="17.5" x2="88" y2="17.5" stroke-width="0.5" opacity="0.22"/>' +
          '<line x1="172" y1="17.5" x2="224" y2="17.5" stroke-width="0.5" opacity="0.22"/>' +
          '<polygon points="8,14 13,11 18,14 13,17" fill="currentColor" stroke="none" opacity="0.65"/>' +
          '<polygon points="242,14 247,11 252,14 247,17" fill="currentColor" stroke="none" opacity="0.65"/>' +
          // Sayap chevron kiri & kanan
          '<path d="M96 14 L108 6 L116 14 L108 22 Z" stroke-width="0.85" opacity="0.65"/>' +
          '<path d="M164 14 L152 6 L144 14 L152 22 Z" stroke-width="0.85" opacity="0.65"/>' +
          // Permata pusat
          '<polygon points="130,2 142,14 130,26 118,14" fill="var(--bg)" stroke="currentColor" stroke-width="1.15"/>' +
          '<polygon points="130,7 137,14 130,21 123,14" stroke-width="0.7" opacity="0.6"/>' +
          '<polygon points="130,10.5 133.5,14 130,17.5 126.5,14" fill="currentColor" stroke="none"/>' +
          '</g>',
          260,
          28,
          "cn-divider-svg"
        );
      },

      // Bingkai lengkung katedral Art Deco bermahkota kipas + alas bertingkat
      photoFrame(contentEl) {
        const frame = el("div", "cn-deco-frame");
        const crown = el("span", "cn-arch-crown");
        crown.setAttribute("aria-hidden", "true");
        crown.append(
          svgEl(
            "0 0 110 34",
            '<g stroke="currentColor" fill="none">' +
            '<g stroke-width="0.7" opacity="0.5">' +
            '<line x1="55" y1="26" x2="55" y2="3"/>' +
            '<line x1="55" y1="26" x2="42" y2="6"/>' +
            '<line x1="55" y1="26" x2="68" y2="6"/>' +
            '<line x1="55" y1="26" x2="31" y2="14"/>' +
            '<line x1="55" y1="26" x2="79" y2="14"/>' +
            '</g>' +
            '<path d="M33 26 A22 22 0 0 1 77 26" stroke-width="0.8" opacity="0.6"/>' +
            '<polygon points="55,16 63,24 55,32 47,24" fill="var(--bg)" stroke="currentColor" stroke-width="1.1"/>' +
            '<polygon points="55,20 59,24 55,28 51,24" fill="currentColor" stroke="none"/>' +
            '<circle cx="55" cy="3" r="1.5" fill="currentColor" stroke="none" opacity="0.85"/>' +
            '</g>',
            110,
            34
          )
        );

        const plinth = el("span", "cn-arch-plinth");
        plinth.setAttribute("aria-hidden", "true");
        plinth.append(
          svgEl(
            "0 0 240 16",
            '<g stroke="currentColor" fill="none">' +
            '<line x1="8" y1="6" x2="232" y2="6" stroke-width="0.9" opacity="0.65"/>' +
            '<line x1="30" y1="11" x2="210" y2="11" stroke-width="0.65" opacity="0.35"/>' +
            '<polygon points="8,6 12,3 16,6 12,9" fill="currentColor" stroke="none" opacity="0.75"/>' +
            '<polygon points="224,6 228,3 232,6 228,9" fill="currentColor" stroke="none" opacity="0.75"/>' +
            '<polygon points="120,1 125,6 120,11 115,6" fill="var(--bg)" stroke="currentColor" stroke-width="0.9"/>' +
            '</g>',
            240,
            16
          )
        );

        frame.append(
          crown,
          el("span", "cn-corner cn-corner--tl"),
          el("span", "cn-corner cn-corner--tr"),
          el("span", "cn-corner cn-corner--bl"),
          el("span", "cn-corner cn-corner--br"),
          contentEl,
          plinth
        );
        return frame;
      },

      portraitPlaceholder(initial, nickname) {
        const wrap = el("div", "cn-portrait-art");
        // Sunburst Art Deco berlapis + kisi geometris + bintang puncak
        wrap.append(
          svgEl(
            "0 0 200 268",
            '<g class="cn-sunburst" stroke="currentColor" stroke-width="0.65" fill="none">' +
            '<line x1="100" y1="258" x2="-60" y2="210"/>' +
            '<line x1="100" y1="258" x2="-44" y2="168"/>' +
            '<line x1="100" y1="258" x2="-18" y2="132"/>' +
            '<line x1="100" y1="258" x2="18" y2="104"/>' +
            '<line x1="100" y1="258" x2="58" y2="86"/>' +
            '<line x1="100" y1="258" x2="100" y2="76"/>' +
            '<line x1="100" y1="258" x2="142" y2="86"/>' +
            '<line x1="100" y1="258" x2="182" y2="104"/>' +
            '<line x1="100" y1="258" x2="218" y2="132"/>' +
            '<line x1="100" y1="258" x2="244" y2="168"/>' +
            '<line x1="100" y1="258" x2="260" y2="210"/>' +
            '</g>' +
            '<g stroke="currentColor" fill="none">' +
            '<path d="M18 258 A82 82 0 0 1 182 258" stroke-width="0.85" opacity="0.42"/>' +
            '<path d="M40 258 A60 60 0 0 1 160 258" stroke-width="0.8" opacity="0.34"/>' +
            '<path d="M62 258 A38 38 0 0 1 138 258" stroke-width="0.75" opacity="0.25"/>' +
            // Bintang 4 sudut & lengkung puncak halus
            '<path d="M22 108 A78 78 0 0 1 178 108" stroke-width="0.65" stroke-dasharray="2 4" opacity="0.3"/>' +
            '<path d="M100 30 L102.5 37.5 L110 40 L102.5 42.5 L100 50 L97.5 42.5 L90 40 L97.5 37.5 Z" fill="currentColor" stroke="none" opacity="0.65"/>' +
            '<circle cx="74" cy="48" r="1.4" fill="currentColor" stroke="none" opacity="0.45"/>' +
            '<circle cx="126" cy="48" r="1.4" fill="currentColor" stroke="none" opacity="0.45"/>' +
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

      // Emblem penutup: dua cincin bertaut + kipas sunburst + sayap filigri
      closingEmblem(initials) {
        const safe = String(initials).replace(/[<>&"']/g, "");
        return svgEl(
          "0 0 200 118",
          '<g stroke="currentColor" fill="none">' +
          '<g stroke-width="0.65" opacity="0.38">' +
          '<line x1="100" y1="68" x2="100" y2="8"/>' +
          '<line x1="100" y1="68" x2="84" y2="11"/>' +
          '<line x1="100" y1="68" x2="116" y2="11"/>' +
          '<line x1="100" y1="68" x2="68" y2="18"/>' +
          '<line x1="100" y1="68" x2="132" y2="18"/>' +
          '<line x1="100" y1="68" x2="54" y2="29"/>' +
          '<line x1="100" y1="68" x2="146" y2="29"/>' +
          '<line x1="100" y1="68" x2="42" y2="44"/>' +
          '<line x1="100" y1="68" x2="158" y2="44"/>' +
          '</g>' +
          '<path d="M46 68 A54 54 0 0 1 154 68" stroke-width="0.7" stroke-dasharray="2 3.5" opacity="0.38"/>' +
          // Sayap filigri kiri-kanan
          '<path d="M10 68 H62 M138 68 H190" stroke-width="0.85" opacity="0.65"/>' +
          '<path d="M22 64 H54 M146 64 H178 M22 72 H54 M146 72 H178" stroke-width="0.5" opacity="0.28"/>' +
          '<polygon points="6,68 11,64 16,68 11,72" fill="currentColor" stroke="none" opacity="0.85"/>' +
          '<polygon points="184,68 189,64 194,68 189,72" fill="currentColor" stroke="none" opacity="0.85"/>' +
          // Mask agar cincin tidak menimpa huruf inisial
          '<mask id="cn-emblem-mask"><rect width="200" height="118" fill="#fff"/><rect x="80" y="56" width="40" height="24" rx="4" fill="#000"/></mask>' +
          '<g mask="url(#cn-emblem-mask)">' +
          '<circle cx="85" cy="68" r="27" stroke-width="1.15"/>' +
          '<circle cx="115" cy="68" r="27" stroke-width="1.15"/>' +
          '<circle cx="85" cy="68" r="22" stroke-width="0.55" opacity="0.4"/>' +
          '<circle cx="115" cy="68" r="22" stroke-width="0.55" opacity="0.4"/>' +
          '</g>' +
          // Permata mahkota di atas tautan cincin
          '<polygon points="100,32 106,38 100,44 94,38" fill="var(--bg)" stroke="currentColor" stroke-width="1"/>' +
          '<polygon points="100,35.5 102.5,38 100,40.5 97.5,38" fill="currentColor" stroke="none"/>' +
          '<path d="M100 3 L101.6 7.4 L106 9 L101.6 10.6 L100 15 L98.4 10.6 L94 9 L98.4 7.4 Z" fill="currentColor" stroke="none" opacity="0.85"/>' +
          '</g>' +
          `<text x="100" y="74" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="19" font-weight="500" letter-spacing="2.5" fill="currentColor">${safe}</text>`,
          200,
          118
        );
      }
    },

    // Menyisipkan ornamen Art Deco yang seragam di seluruh section tanpa mengubah struktur data
    decorate(main) {
      if (!main) return;

      // 1. Mahkota arsitektural di puncak halaman pembuka
      const pembuka = main.querySelector("#pembuka");
      if (pembuka && !pembuka.querySelector(".cn-hero-pediment")) {
        const pediment = el("div", "cn-hero-pediment lk-reveal");
        pediment.setAttribute("aria-hidden", "true");
        pediment.append(artDecoFanCrest("cn-hero-pediment-svg", 220, 48));
        pembuka.prepend(pediment);
      }

      // 2. Ornamen filigri & sudut kipas pada kotak kutipan ayat / kata mutiara
      const quoteBox = main.querySelector(".lk-quote-box");
      if (quoteBox && !quoteBox.querySelector(".cn-quote-orn")) {
        addCardCorners(quoteBox);
        const topOrn = el("span", "cn-quote-orn cn-quote-orn--top");
        topOrn.setAttribute("aria-hidden", "true");
        topOrn.append(artDecoFiligree("cn-quote-orn-svg", 148, 18));

        const botOrn = el("span", "cn-quote-orn cn-quote-orn--bottom");
        botOrn.setAttribute("aria-hidden", "true");
        botOrn.append(artDecoFiligree("cn-quote-orn-svg", 148, 18));

        quoteBox.prepend(topOrn);
        quoteBox.append(botOrn);
      }

      // 3. Kartu Acara: sudut kipas Art Deco + halo sunburst di belakang medali ikon
      main.querySelectorAll(".lk-event-card").forEach((card) => {
        addCardCorners(card);
        if (!card.querySelector(".cn-medallion-halo")) {
          card.prepend(medallionHalo());
        }
      });

      // 4. Dress Code: mahkota kipas & sudut bertingkat
      const dresscode = main.querySelector(".lk-dresscode");
      if (dresscode) {
        addCardCorners(dresscode);
        if (!dresscode.querySelector(".cn-dresscode-crest")) {
          const crest = el("div", "cn-dresscode-crest");
          crest.setAttribute("aria-hidden", "true");
          crest.append(artDecoFiligree("cn-dresscode-crest-svg", 136, 16));
          dresscode.prepend(crest);
        }
      }

      // 5. Timeline Kisah Kami: sudut filigri tiap kartu + finial puncak & ujung garis
      const timeline = main.querySelector(".lk-timeline");
      if (timeline && !timeline.querySelector(".cn-tl-finial")) {
        const topFinial = el("span", "cn-tl-finial cn-tl-finial--top");
        const botFinial = el("span", "cn-tl-finial cn-tl-finial--bottom");
        topFinial.setAttribute("aria-hidden", "true");
        botFinial.setAttribute("aria-hidden", "true");
        timeline.prepend(topFinial);
        timeline.append(botFinial);
      }
      main.querySelectorAll(".lk-timeline-item").forEach((item) => {
        addCardCorners(item);
      });

      // 6. Formulir RSVP: pediment permata di puncak + sudut kipas Art Deco
      const rsvpForm = main.querySelector(".lk-rsvp-form");
      if (rsvpForm) {
        addCardCorners(rsvpForm);
        if (!rsvpForm.querySelector(".cn-rsvp-pediment")) {
          const ped = el("span", "cn-rsvp-pediment");
          ped.setAttribute("aria-hidden", "true");
          ped.append(artDecoFanCrest("cn-rsvp-pediment-svg", 148, 34));
          rsvpForm.prepend(ped);
        }
      }

      // 7. Kartu Bank: guilloché sunburst Art Deco + sudut tipis
      main.querySelectorAll(".lk-bank-card:not(.lk-address-card)").forEach((card) => {
        if (!card.querySelector(".cn-bank-guilloche")) {
          card.prepend(cardGuilloche());
        }
      });

      // 8. Kartu Kirim Kado: sudut kipas Art Deco + halo medali kado
      const addrCard = main.querySelector(".lk-address-card");
      if (addrCard) {
        addCardCorners(addrCard);
        if (!addrCard.querySelector(".cn-medallion-halo")) {
          addrCard.prepend(medallionHalo());
        }
      }

      // 9. Penutup: mahkota lengkung kipas + binar cahaya halus (bookend sampul)
      const closing = main.querySelector(".lk-closing");
      if (closing && !closing.querySelector(".cn-closing-crown")) {
        const crown = el("span", "cn-closing-crown");
        crown.setAttribute("aria-hidden", "true");
        crown.append(artDecoFanCrest("cn-closing-crown-svg", 156, 36));
        closing.prepend(crown);

        const stars = el("span", "cn-closing-stars");
        stars.setAttribute("aria-hidden", "true");
        const coords = [
          [16, 26, 0],
          [84, 24, 1.2],
          [11, 56, 2.4],
          [89, 54, 0.7],
          [22, 78, 1.8],
          [78, 80, 2.9]
        ];
        coords.forEach(([x, y, delay]) => {
          const s = el("i");
          s.style.setProperty("--sx", `${x}%`);
          s.style.setProperty("--sy", `${y}%`);
          s.style.setProperty("--sdelay", `${delay}s`);
          stars.append(s);
        });
        closing.prepend(stars);
      }

      // 10. Footer: filigri kecil di atas kredit
      const footer = main.querySelector(".lk-footer");
      if (footer && !footer.querySelector(".cn-footer-orn")) {
        const fOrn = el("div", "cn-footer-orn");
        fOrn.setAttribute("aria-hidden", "true");
        fOrn.append(artDecoFiligree("cn-footer-orn-svg", 112, 14));
        footer.prepend(fOrn);
      }
    }
  });
})();
