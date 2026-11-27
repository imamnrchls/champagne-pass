/**
 * LAYER 3 — TEMA ALTERNATIF: MERAH DELIMA
 * Kulit alternatif ringan yang memakai kontrak tema yang sama persis.
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  window.LKThemes.register("merah-delima", {
    name: "Merah Delima",

    tokens: {
      bg: "#4A0F1C",
      surface: "#360A15"
    },

    labels: {
      open_button: "Buka Undangan",
      skip_button: "Lewati",
      couple_title: "Mempelai",
      events_title: "Rangkaian Acara",
      dress_code_title: "Busana",
      story_title: "Kisah Cinta",
      gallery_title: "Galeri",
      rsvp_title: "Konfirmasi & Ucapan",
      wishes_title: "Ucapan Tamu",
      gift_title: "Wedding Gift",
      closing: "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      credit_line: "Dirangkai dengan cinta oleh"
    },

    section_order: ["pembuka", "acara", "cerita_galeri", "rsvp", "amplop"],

    opener: {
      render(container, data, labels, hooks) {
        const inner = el("div", "md-cover-inner");
        const initials = data.inisial || "RA";
        inner.append(
          el("p", "lk-section-eyebrow", "The Wedding of"),
          el("p", "md-mono-cover", initials.split("").join(" | ")),
          el("p", "lk-hero-date", `${data.mempelai.pria.nama_panggilan} & ${data.mempelai.wanita.nama_panggilan}`),
          el("p", "lk-section-eyebrow", labels.to_prefix),
          el("p", "md-guest", hooks.guestName)
        );
        const btn = el("button", "lk-btn lk-btn--solid", labels.open_button);
        btn.type = "button";
        btn.addEventListener("click", hooks.onOpen);
        const skip = el("button", "lk-btn lk-btn--ghost", labels.skip_button);
        skip.type = "button";
        skip.addEventListener("click", hooks.onSkip);
        inner.append(btn, skip);
        container.replaceChildren(inner);
      },
      open(container, { onComplete }) {
        container.classList.add("md-sliding");
        setTimeout(onComplete, 700);
      }
    },

    ornaments: {
      monogram(initials) {
        const p = el("p", "md-mono-cover", initials.split("").join(" · "));
        p.style.fontSize = "38px";
        return p;
      },
      divider() {
        const d = el("div");
        d.style.width = "64px";
        d.style.height = "1px";
        d.style.background = "var(--line)";
        return d;
      }
    }
  });
})();
