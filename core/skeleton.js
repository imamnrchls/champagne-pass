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
    event_passed: "Acara telah berlangsung",
    credit_line: "Dibuat dengan sepenuh hati oleh"
  };

  // Logo Lembar Kabar (mono, mengikuti `color` tema lewat currentColor)
  const LK_LOGO_SVG = '<svg class="lk-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 232 48" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24.7 23.6 L24.3 22.8 L23.8 21.9 L23.3 21.1 L22.8 20.3 L22.5 19.5 L22.2 18.6 L21.8 17.7 L21.5 16.8 L21.1 16 L20.7 15.2 L20.7 14.6 L20.7 13.9 L20.5 13.3 L20.7 12.7 L20.6 12.1 L20.7 11.5 L20.8 10.9 L21.3 10.5 L21.4 10 L21.7 9.5 L21.9 8.9 L22 8.4 L22.4 8 L22.8 7.6 L23 7.2 L23.5 7.2 L23.7 6.9 L23.8 6.6 L23.7 7 L24.1 7.2 L24.2 7.8 L24.7 8.1 L25 8.6 L25.5 8.9 L25.8 9.4 L26.2 9.7 L26.5 10.1 L26.5 10.6 L26.8 11.1 L26.8 11.6 L27.1 12.2 L27 12.8 L27.1 13.4 L27.2 14.1 L27.2 14.7 L27.3 15.2 L27 16 L26.7 16.9 L26.2 17.7 L25.7 18.5 L25.4 19.4 L24.9 20.2 L24.5 21.1 L25.4 21.5 L25.8 20.7 L26.2 19.8 L26.8 19.1 L27.2 18.2 L27.7 17.4 L28.2 16.6 L28.7 15.6 L28.8 14.8 L28.8 14 L28.9 13.3 L28.9 12.6 L28.6 12 L28.7 11.3 L28.4 10.6 L28.4 9.9 L27.9 9.3 L27.6 8.7 L27.3 8.2 L26.9 7.7 L26.6 7.2 L26.3 6.9 L26.1 6.4 L25.6 6.1 L25.4 5.4 L24.2 4.8 L22.9 5 L22.2 5.2 L21.8 5.8 L21.2 6.3 L20.8 6.8 L20.5 7.5 L20.1 8 L19.7 8.5 L19.5 9.1 L19.2 9.7 L19.2 10.5 L19 11.2 L18.9 11.9 L18.8 12.7 L19 13.4 L19 14.2 L19.2 14.8 L19.4 15.6 L19.8 16.5 L20.1 17.4 L20.5 18.3 L20.9 19.2 L21.3 20 L21.9 20.9 L22.3 21.7 L22.9 22.5 L23.4 23.3 L24 24.1Z"/><path d="M24.1 22.2 L24.3 21.4 L24.4 20.5 L24.5 19.7 L24.6 18.8 L24.7 18 L24.7 17.1 L24.7 16.3 L24.6 15.5 L24.6 14.6 L24.6 13.8 L24.6 12.9 L24.6 12.1 L24.5 11.2 L24.4 10.4 L23.9 10.4 L23.9 11.2 L23.9 12.1 L23.8 12.9 L23.8 13.8 L23.7 14.6 L23.7 15.5 L23.7 16.3 L23.7 17.1 L23.7 18 L23.7 18.8 L23.8 19.6 L23.8 20.5 L23.7 21.3 L23.8 22.2Z"/><path d="M24.7 24.7 L25.3 24 L26 23.3 L26.8 22.7 L27.4 22 L28 21.3 L28.8 20.7 L29.4 20 L30.2 19.4 L30.8 18.6 L31.4 18.1 L31.9 17.7 L32.5 17.4 L33.1 17.2 L33.6 17 L34.2 17 L34.7 16.9 L35.3 16.8 L35.8 17.2 L36.4 17.3 L37 17.4 L37.6 17.5 L38.1 17.9 L38.6 17.9 L39.1 18.2 L39.5 18.3 L39.9 18.5 L40.2 18.6 L40.4 18.6 L40.2 18.6 L40.1 19.1 L39.7 19.4 L39.6 20 L39.3 20.3 L39 20.7 L38.7 21.2 L38.5 21.6 L38 21.8 L37.6 22.1 L37.2 22.5 L36.7 22.8 L36 22.9 L35.5 23.3 L34.9 23.4 L34.3 23.8 L33.7 24.1 L33.3 24.4 L32.5 24.4 L31.6 24.3 L30.6 24.4 L29.7 24.3 L28.8 24.1 L27.8 24.1 L26.9 23.9 L26.8 24.8 L27.7 25 L28.6 25.2 L29.6 25.3 L30.5 25.5 L31.5 25.7 L32.5 25.8 L33.5 25.7 L34.3 25.5 L35 25.2 L35.6 25 L36.1 24.6 L36.7 24.5 L37.2 24.1 L37.9 24 L38.5 23.8 L39.2 23.5 L39.6 22.9 L40.2 22.6 L40.7 22.1 L41.1 21.5 L41.3 21 L41.8 20.6 L41.9 19.9 L42.2 19.4 L42.5 18.1 L41.6 17 L41.1 16.5 L40.5 16.2 L39.8 15.9 L39.2 15.9 L38.6 15.7 L38 15.7 L37.5 15.5 L36.9 15.3 L36.3 15.1 L35.5 15.2 L34.8 15 L34 15 L33.2 15.2 L32.4 15.4 L31.7 15.9 L31 16.4 L30.2 16.8 L29.7 17.7 L29 18.3 L28.5 19.1 L27.8 19.8 L27.2 20.5 L26.6 21.2 L25.9 21.9 L25.4 22.7 L24.7 23.4 L24 24Z"/><path d="M25.7 23.5 L26.6 23.4 L27.4 23.2 L28.2 23 L29 22.8 L29.9 22.6 L30.7 22.4 L31.5 22.1 L32.3 21.9 L33.1 21.7 L33.9 21.5 L34.7 21.2 L35.5 20.9 L36.3 20.6 L37.1 20.3 L37 19.9 L36.1 20.1 L35.3 20.3 L34.5 20.4 L33.6 20.5 L32.9 20.8 L32 21.1 L31.2 21.3 L30.4 21.6 L29.6 21.8 L28.8 22.1 L28 22.3 L27.2 22.5 L26.4 22.8 L25.6 23.1Z"/><path d="M24 24 L24.8 24.5 L25.6 25 L26.4 25.4 L27.2 26 L28 26.5 L28.8 27.1 L29.7 27.5 L30.5 27.9 L31.3 28.4 L32.1 28.8 L32.4 29.3 L32.8 29.8 L33.1 30.4 L33.2 31.1 L33.5 31.6 L33.7 32.2 L33.8 32.8 L34.1 33.3 L34.3 33.8 L34.2 34.3 L34.2 34.8 L34.1 35.2 L34 35.6 L33.8 36 L33.7 36.5 L33.4 37 L33.2 37.6 L33.4 37.3 L34 36.9 L33.4 37.1 L33 37.3 L32.5 37.2 L32.1 37.1 L31.6 37.1 L31.1 37 L30.7 36.8 L30.1 36.8 L29.6 36.5 L29 36.3 L28.6 35.9 L28 35.7 L27.5 35.4 L27 34.9 L26.6 34.5 L26.3 33.9 L26.1 33.2 L26 32.4 L25.8 31.4 L25.6 30.4 L25.4 29.5 L25.1 28.6 L24.9 27.6 L24.6 26.7 L23.7 27 L23.9 27.9 L24.2 28.8 L24.4 29.7 L24.5 30.6 L24.6 31.6 L24.6 32.5 L24.7 33.6 L25.1 34.5 L25.5 35.1 L26 35.8 L26.5 36.4 L27.1 37 L27.6 37.5 L28.2 37.8 L28.9 38 L29.4 38.3 L30 38.7 L30.6 38.9 L31.2 39.1 L31.9 39.2 L32.5 39.2 L33.1 39.1 L33.7 39.1 L34.1 39.1 L35 38.8 L35.2 38.1 L35.4 37.9 L35.5 37.4 L36 36.9 L36.1 36.3 L36.3 35.6 L36.3 34.9 L36.3 34.1 L36 33.5 L35.9 32.8 L35.8 32.1 L35.5 31.6 L35.2 30.9 L35 30.3 L34.5 29.7 L34.1 29.1 L33.7 28.4 L33 27.7 L32 27.1 L31.1 26.8 L30.2 26.4 L29.4 25.9 L28.6 25.5 L27.8 25 L27 24.6 L26.2 24 L25.4 23.5 L24.5 23.1Z"/><path d="M24.9 25.6 L25.3 26.3 L25.7 27 L26.2 27.8 L26.7 28.4 L27.2 29.1 L27.7 29.8 L28.2 30.5 L28.7 31.2 L29.1 31.9 L29.6 32.5 L30.1 33.2 L30.6 33.9 L31 34.6 L31.6 35.3 L32 35 L31.6 34.3 L31.1 33.6 L30.8 32.8 L30.3 32.1 L29.9 31.3 L29.4 30.6 L28.9 29.9 L28.4 29.3 L27.8 28.6 L27.3 28 L26.8 27.3 L26.2 26.7 L25.7 26 L25.2 25.4Z"/><path d="M24 24 L23.8 24.9 L23.7 25.9 L23.3 26.7 L23.1 27.6 L22.7 28.5 L22.5 29.4 L22 30.3 L21.9 31.3 L21.5 32.2 L21.3 33 L21.1 33.5 L20.8 34.1 L20.3 34.5 L19.9 34.9 L19.7 35.4 L19.2 35.6 L18.6 35.8 L18.2 36.1 L17.7 36.4 L17.2 36.6 L16.6 36.6 L16.2 37.1 L15.7 37 L15.3 37.1 L14.9 37.4 L14.4 37.3 L13.9 37.3 L14.2 37.5 L14.5 37.7 L14.4 37 L14.2 36.5 L13.8 36.1 L13.7 35.6 L13.3 35.2 L13.2 34.7 L13.3 34.2 L13.4 33.8 L13.5 33.2 L13.7 32.8 L13.9 32.2 L14.1 31.6 L14.5 31 L14.8 30.5 L15 29.8 L15.5 29.3 L15.8 28.8 L16.6 28.3 L17.5 28 L18.4 27.6 L19.2 27.2 L20 26.7 L20.9 26.3 L21.8 25.9 L21.3 24.9 L20.5 25.4 L19.6 25.9 L18.7 26.1 L17.9 26.5 L17 26.9 L16.1 27.3 L15.1 27.7 L14.4 28.4 L14 29 L13.3 29.5 L13 30.1 L12.7 30.8 L12.2 31.3 L11.8 31.9 L11.6 32.6 L11.3 33.4 L11.3 34.2 L11.5 34.9 L11.6 35.6 L11.6 36.4 L12 36.9 L12.1 37.5 L12.3 38 L12.6 38.3 L13 39.1 L13.9 39.3 L14.4 39.3 L15.1 39.2 L15.7 39.3 L16.3 39.2 L16.8 38.8 L17.5 38.8 L17.9 38.4 L18.5 38.2 L19.1 38 L19.7 37.7 L20.2 37.2 L20.8 36.7 L21.4 36.3 L21.9 35.6 L22.2 34.9 L22.6 34.3 L22.9 33.5 L23.1 32.5 L23.1 31.6 L23.4 30.7 L23.6 29.8 L24 28.9 L24.2 27.9 L24.5 27 L24.6 26.1 L24.9 25.1 L24.9 24.1Z"/><path d="M22.8 25.3 L22.2 26 L21.7 26.6 L21.1 27.2 L20.6 27.9 L20.1 28.6 L19.5 29.2 L18.9 29.8 L18.5 30.5 L18 31.2 L17.4 31.9 L16.9 32.5 L16.5 33.3 L16.1 34 L15.6 34.8 L16.1 35 L16.5 34.3 L17.1 33.7 L17.6 33 L18.1 32.4 L18.6 31.7 L19.1 31.1 L19.8 30.5 L20.3 29.8 L20.8 29.1 L21.3 28.4 L21.8 27.8 L22.2 27.1 L22.7 26.3 L23.2 25.6Z"/><path d="M23.9 23.2 L22.9 23.3 L22 23.4 L21.1 23.6 L20.1 23.6 L19.1 23.8 L18.2 24 L17.2 24.1 L16.3 24.5 L15.4 24.7 L14.5 24.9 L13.9 24.8 L13.2 24.8 L12.7 24.4 L12.2 24.1 L11.7 23.8 L11.3 23.3 L10.8 22.9 L10.4 22.4 L9.9 22.2 L9.5 21.7 L9.2 21.3 L8.8 20.9 L8.7 20.4 L8.4 20.1 L8.1 19.7 L8.1 19.2 L7.9 18.7 L7.7 18.8 L7.8 18.8 L8.3 18.6 L8.6 18.2 L9.1 18.2 L9.5 18 L9.8 17.7 L10.3 17.9 L10.8 17.6 L11.4 17.7 L11.9 17.9 L12.6 17.8 L13.2 17.8 L13.8 17.8 L14.4 17.8 L15 17.8 L15.7 17.8 L16.3 17.9 L16.9 18 L17.4 18.6 L18.2 19.1 L18.9 19.7 L19.6 20.4 L20.3 21.1 L21.1 21.6 L21.8 22.2 L22.4 21.5 L21.7 20.9 L21 20.2 L20.3 19.6 L19.6 19 L19 18.3 L18.4 17.5 L17.5 16.9 L16.6 16.5 L15.9 16.3 L15.2 16.2 L14.4 16.2 L13.8 16.1 L13.2 16.1 L12.7 16.1 L12.1 15.9 L11.5 16 L10.9 16 L10.2 15.7 L9.5 16 L8.8 16.1 L8.2 16.3 L7.7 16.7 L7.1 16.9 L6.7 17.3 L5.9 18.1 L5.9 19.2 L6 19.8 L6.3 20.3 L6.5 21 L6.7 21.6 L7.3 22.1 L7.7 22.6 L8.1 23.1 L8.6 23.4 L9 24 L9.5 24.4 L10 24.9 L10.6 25.3 L11.2 25.8 L12 26.1 L12.8 26.2 L13.7 26.5 L14.7 26.4 L15.8 26.1 L16.7 25.8 L17.6 25.6 L18.5 25.1 L19.4 25 L20.3 24.9 L21.2 24.6 L22.2 24.5 L23.1 24.3 L24 24.1Z"/><path d="M22.3 23.4 L21.5 23 L20.8 22.7 L20 22.4 L19.2 22 L18.5 21.7 L17.7 21.4 L16.9 21 L16.1 20.8 L15.3 20.6 L14.5 20.3 L13.7 20 L12.9 19.8 L12.1 19.5 L11.2 19.3 L11.1 19.7 L11.8 20.1 L12.6 20.4 L13.4 20.8 L14.2 21.1 L15 21.3 L15.8 21.6 L16.6 22 L17.4 22.2 L18.1 22.5 L18.9 22.8 L19.7 23.1 L20.5 23.3 L21.4 23.6 L22.2 23.8Z"/><path d="M22.9 24.3c.2-1 1.5-1.6 2.3-.8.8.9-.1 2.2-1.2 2-.6-.1-1.2-.6-1.1-1.2Z"/><path d="M51.3 35V33.9L55.1 33.5H55.5V35ZM54 35Q54 33.5 54 32Q54 30.4 54 28.8Q54 27.2 54 25.7V24.2Q54 22.6 54 21.1Q54 19.5 54 17.9Q54 16.3 54 14.9H56.8Q56.8 16.4 56.8 17.9Q56.8 19.5 56.8 21.1Q56.8 22.7 56.8 24.2V26.1Q56.8 27.5 56.8 29Q56.8 30.5 56.8 32Q56.8 33.5 56.8 35ZM55.4 35V33.6H64.5L63.4 34.4L64.6 29.4H66.2L65.9 35ZM51.3 16V14.9H59.5V16L55.7 16.4H55.1ZM74.8 35.4Q72.8 35.4 71.3 34.5Q69.8 33.6 68.9 32Q68.1 30.4 68.1 28.1Q68.1 25.9 69 24.1Q69.9 22.4 71.4 21.5Q73 20.5 74.8 20.5Q76.3 20.5 77.5 21.2Q78.8 21.9 79.5 23.1Q80.2 24.4 80.2 26.1Q80.2 26.6 80.2 27.1Q80.1 27.5 80 27.8H69.2V26.6H76Q77.2 26.6 77.5 26.2Q77.9 25.8 77.9 25.1Q77.9 24 77.5 23.3Q77.1 22.5 76.4 22.1Q75.7 21.7 74.8 21.7Q73.7 21.7 72.8 22.3Q71.8 22.9 71.2 24.2Q70.6 25.6 70.6 27.7Q70.6 29.6 71.2 30.9Q71.8 32.2 72.9 32.9Q74 33.5 75.5 33.5Q76.9 33.5 78 33Q79 32.5 79.9 31.6L80.5 32Q79.9 33 79.1 33.8Q78.4 34.6 77.3 35Q76.3 35.4 74.8 35.4ZM82.1 35V34L85.2 33.5H85.9L88.9 34V35ZM84.2 35Q84.3 34.3 84.3 33.2Q84.3 32.1 84.3 30.8Q84.3 29.6 84.3 28.7V27.3Q84.3 26.4 84.3 25.8Q84.3 25.2 84.3 24.6Q84.3 24.1 84.2 23.5L81.9 23.1V22.2L86.1 20.5L86.5 20.8L86.8 24.1V24.2V28.7Q86.8 29.6 86.8 30.8Q86.8 32.1 86.8 33.2Q86.8 34.3 86.9 35ZM91 35V34L94.2 33.5H94.8L97.8 34V35ZM93.1 35Q93.2 34.3 93.2 33.2Q93.2 32.1 93.2 30.9Q93.2 29.7 93.2 28.7V26.1Q93.2 24.1 92.7 23.3Q92.1 22.5 90.8 22.5Q90 22.5 89.4 22.7Q88.7 23 88 23.4Q87.3 23.9 86.5 24.6L86 23.7H86.3Q87 22.8 87.9 22.1Q88.8 21.4 89.8 20.9Q90.8 20.5 91.9 20.5Q93.8 20.5 94.7 21.8Q95.7 23 95.7 25.9V28.7Q95.7 29.7 95.7 30.9Q95.7 32.1 95.7 33.2Q95.7 34.3 95.7 35ZM99.8 35V34L103 33.5H103.7L106.7 34V35ZM102 35Q102 34.3 102.1 33.2Q102.1 32.1 102.1 30.9Q102.1 29.7 102.1 28.7V26Q102.1 24 101.5 23.2Q100.9 22.5 99.6 22.5Q99 22.5 98.3 22.7Q97.6 22.9 96.9 23.4Q96.2 23.9 95.4 24.6L94.8 23.8H95Q95.8 22.8 96.7 22Q97.7 21.3 98.7 20.9Q99.7 20.5 100.8 20.5Q102.6 20.5 103.6 21.7Q104.5 22.9 104.5 25.7V28.7Q104.5 29.7 104.5 30.9Q104.6 32.1 104.6 33.2Q104.6 34.3 104.6 35ZM107.7 35V34L109.9 33.7Q109.9 32.9 109.9 32Q109.9 31.1 109.9 30.2Q109.9 29.4 109.9 28.7V15.4L107.5 15V14.1L112 12.8L112.4 13L112.3 17.6V23.2L112.4 23.5V32.6V32.7L112.1 35.3ZM116.4 35.4Q115.6 35.4 114.7 35.1Q113.9 34.9 113.2 34.2Q112.4 33.5 111.7 32.3H111.2L111.5 31.1Q112.6 32.6 113.7 33.2Q114.9 33.8 115.9 33.8Q117.1 33.8 117.9 33.2Q118.8 32.5 119.4 31.2Q119.9 29.9 119.9 28Q119.9 25.1 118.8 23.6Q117.7 22.1 116.1 22.1Q115.5 22.1 114.8 22.3Q114.1 22.6 113.3 23.2Q112.5 23.8 111.5 24.8L111.2 23.6H111.7Q112.5 22.6 113.3 21.9Q114.1 21.2 115 20.9Q115.9 20.5 116.8 20.5Q118.4 20.5 119.7 21.4Q121 22.2 121.7 23.8Q122.5 25.5 122.5 27.8Q122.5 30.1 121.7 31.8Q120.9 33.5 119.5 34.5Q118.1 35.4 116.4 35.4ZM128.3 35.4Q126.7 35.4 125.5 34.5Q124.4 33.5 124.4 31.7Q124.4 30.9 124.7 30.1Q125.1 29.3 126.2 28.6Q127.2 27.9 129.2 27.3Q129.9 27.1 130.7 26.9Q131.4 26.7 132.2 26.4Q133 26.2 133.8 26V26.9Q132.7 27.3 131.7 27.6Q130.7 27.9 129.9 28.2Q128.6 28.7 127.9 29.2Q127.3 29.7 127.1 30.3Q126.9 30.8 126.9 31.3Q126.9 32.5 127.6 33Q128.3 33.5 129.3 33.5Q129.8 33.5 130.3 33.3Q130.8 33.2 131.5 32.7Q132.2 32.3 133.4 31.4L133.8 32.8H132.9Q132 33.7 131.3 34.2Q130.6 34.8 129.9 35.1Q129.2 35.4 128.3 35.4ZM135.3 35.3Q134 35.3 133.3 34.5Q132.6 33.7 132.6 32.4V32.2V25.5Q132.6 24 132.3 23.2Q132 22.4 131.4 22.1Q130.8 21.8 129.8 21.8Q129.3 21.8 128.6 21.9Q128 22 127.2 22.3L128.3 21.4L127.6 23.9Q127.4 24.6 127.1 25Q126.7 25.3 126.1 25.3Q125.5 25.3 125.2 25Q124.9 24.7 124.8 24.1Q125.2 22.5 126.7 21.5Q128.3 20.5 130.5 20.5Q132 20.5 133 21Q134 21.5 134.5 22.7Q135 23.8 135 25.6V32.1Q135 33 135.3 33.4Q135.6 33.8 136.1 33.8Q136.4 33.8 136.7 33.6Q137 33.5 137.2 33.1L137.8 33.7Q137.3 34.5 136.7 34.9Q136.1 35.3 135.3 35.3ZM138.3 35V34L141.5 33.5H142.2L145.4 34V35ZM140.4 35Q140.4 34.3 140.5 33.2Q140.5 32.1 140.5 30.8Q140.5 29.6 140.5 28.7V27.3Q140.5 26.4 140.5 25.8Q140.5 25.2 140.5 24.6Q140.4 24.1 140.4 23.5L138 23.1V22.2L142.2 20.5L142.6 20.8L142.9 24.7V24.8V28.7Q142.9 29.6 142.9 30.8Q143 32.1 143 33.2Q143 34.3 143 35ZM142.8 26.8 142.4 24.8H142.8Q143.2 23.5 144 22.5Q144.7 21.5 145.5 21Q146.4 20.5 147.2 20.5Q147.9 20.5 148.5 20.8Q149.1 21.1 149.3 21.6Q149.3 22.6 148.9 23.1Q148.4 23.7 147.6 23.7Q147.1 23.7 146.7 23.5Q146.2 23.3 145.8 22.9L145 22.2L146.4 22Q145.1 22.6 144.2 23.8Q143.4 25 142.8 26.8ZM158.7 35Q158.8 33.5 158.8 32Q158.8 30.4 158.8 28.8Q158.8 27.2 158.8 25.7V24.2Q158.8 22.7 158.8 21.1Q158.8 19.5 158.8 17.9Q158.8 16.4 158.7 14.9H161.5Q161.5 16.3 161.5 17.9Q161.4 19.5 161.4 21.1Q161.4 22.6 161.4 24.2V26.3Q161.4 27.5 161.4 29Q161.4 30.4 161.5 32Q161.5 33.5 161.5 35ZM156.1 35V33.9L159.8 33.5H160.5L164.2 33.9V35ZM156.1 16V14.9H164.2V16L160.5 16.4H159.8ZM166.8 35V33.9L170.3 33.5H170.8L174.2 33.9V35ZM167 16V14.9H173.9V16L170.7 16.4L170 16.5ZM160.1 29.7 160 27.8H160.2L160.9 26.9L170.6 14.9H172.2ZM169.9 35 164 23.9 165.6 22 172.8 35ZM178.6 35.4Q177 35.4 175.9 34.5Q174.7 33.5 174.7 31.7Q174.7 30.9 175.1 30.1Q175.4 29.3 176.5 28.6Q177.5 27.9 179.6 27.3Q180.2 27.1 181 26.9Q181.8 26.7 182.5 26.4Q183.3 26.2 184.2 26V26.9Q183 27.3 182 27.6Q181.1 27.9 180.2 28.2Q178.9 28.7 178.2 29.2Q177.6 29.7 177.4 30.3Q177.2 30.8 177.2 31.3Q177.2 32.5 177.9 33Q178.6 33.5 179.6 33.5Q180.2 33.5 180.7 33.3Q181.2 33.2 181.9 32.7Q182.6 32.3 183.7 31.4L184.1 32.8H183.2Q182.3 33.7 181.6 34.2Q180.9 34.8 180.2 35.1Q179.5 35.4 178.6 35.4ZM185.6 35.3Q184.3 35.3 183.6 34.5Q182.9 33.7 182.9 32.4V32.2V25.5Q182.9 24 182.6 23.2Q182.3 22.4 181.7 22.1Q181.1 21.8 180.1 21.8Q179.6 21.8 178.9 21.9Q178.3 22 177.5 22.3L178.7 21.4L177.9 23.9Q177.8 24.6 177.4 25Q177 25.3 176.4 25.3Q175.8 25.3 175.5 25Q175.2 24.7 175.1 24.1Q175.5 22.5 177.1 21.5Q178.6 20.5 180.8 20.5Q182.3 20.5 183.3 21Q184.3 21.5 184.8 22.7Q185.3 23.8 185.3 25.6V32.1Q185.3 33 185.6 33.4Q185.9 33.8 186.4 33.8Q186.8 33.8 187 33.6Q187.3 33.5 187.6 33.1L188.1 33.7Q187.6 34.5 187 34.9Q186.4 35.3 185.6 35.3ZM188.4 35V34L190.6 33.7Q190.7 32.9 190.7 32Q190.7 31.1 190.7 30.2Q190.7 29.4 190.7 28.7V15.4L188.3 15V14.1L192.8 12.8L193.2 13L193.1 17.6V23.2L193.1 23.5V32.6V32.7L192.9 35.3ZM197.2 35.4Q196.3 35.4 195.5 35.1Q194.7 34.9 193.9 34.2Q193.1 33.5 192.4 32.3H192L192.2 31.1Q193.4 32.6 194.5 33.2Q195.6 33.8 196.7 33.8Q197.8 33.8 198.7 33.2Q199.6 32.5 200.1 31.2Q200.7 29.9 200.7 28Q200.7 25.1 199.6 23.6Q198.5 22.1 196.8 22.1Q196.2 22.1 195.5 22.3Q194.8 22.6 194 23.2Q193.2 23.8 192.2 24.8L192 23.6H192.4Q193.2 22.6 194 21.9Q194.8 21.2 195.7 20.9Q196.6 20.5 197.6 20.5Q199.2 20.5 200.4 21.4Q201.7 22.2 202.5 23.8Q203.2 25.5 203.2 27.8Q203.2 30.1 202.4 31.8Q201.7 33.5 200.3 34.5Q198.9 35.4 197.2 35.4ZM209 35.4Q207.4 35.4 206.3 34.5Q205.1 33.5 205.1 31.7Q205.1 30.9 205.5 30.1Q205.9 29.3 206.9 28.6Q208 27.9 210 27.3Q210.7 27.1 211.4 26.9Q212.2 26.7 213 26.4Q213.8 26.2 214.6 26V26.9Q213.4 27.3 212.5 27.6Q211.5 27.9 210.6 28.2Q209.3 28.7 208.7 29.2Q208 29.7 207.9 30.3Q207.7 30.8 207.7 31.3Q207.7 32.5 208.4 33Q209.1 33.5 210.1 33.5Q210.6 33.5 211.1 33.3Q211.6 33.2 212.3 32.7Q213 32.3 214.1 31.4L214.5 32.8H213.6Q212.8 33.7 212.1 34.2Q211.4 34.8 210.7 35.1Q209.9 35.4 209 35.4ZM216 35.3Q214.8 35.3 214.1 34.5Q213.4 33.7 213.3 32.4V32.2V25.5Q213.3 24 213 23.2Q212.8 22.4 212.1 22.1Q211.5 21.8 210.5 21.8Q210 21.8 209.4 21.9Q208.7 22 207.9 22.3L209.1 21.4L208.4 23.9Q208.2 24.6 207.8 25Q207.5 25.3 206.9 25.3Q206.3 25.3 205.9 25Q205.6 24.7 205.6 24.1Q205.9 22.5 207.5 21.5Q209 20.5 211.2 20.5Q212.8 20.5 213.8 21Q214.8 21.5 215.3 22.7Q215.8 23.8 215.8 25.6V32.1Q215.8 33 216.1 33.4Q216.4 33.8 216.8 33.8Q217.2 33.8 217.5 33.6Q217.7 33.5 218 33.1L218.5 33.7Q218.1 34.5 217.4 34.9Q216.8 35.3 216 35.3ZM219 35V34L222.2 33.5H222.9L226.2 34V35ZM221.1 35Q221.2 34.3 221.2 33.2Q221.2 32.1 221.2 30.8Q221.3 29.6 221.3 28.7V27.3Q221.3 26.4 221.2 25.8Q221.2 25.2 221.2 24.6Q221.2 24.1 221.2 23.5L218.8 23.1V22.2L223 20.5L223.4 20.8L223.7 24.7V24.8V28.7Q223.7 29.6 223.7 30.8Q223.7 32.1 223.7 33.2Q223.8 34.3 223.8 35ZM223.6 26.8 223.2 24.8H223.5Q224 23.5 224.7 22.5Q225.4 21.5 226.3 21Q227.1 20.5 228 20.5Q228.7 20.5 229.3 20.8Q229.8 21.1 230.1 21.6Q230.1 22.6 229.6 23.1Q229.2 23.7 228.3 23.7Q227.9 23.7 227.4 23.5Q227 23.3 226.5 22.9L225.8 22.2L227.2 22Q225.8 22.6 225 23.8Q224.1 25 223.6 26.8Z"/></svg>';

  // Kredit Lembar Kabar: kalimat dari label tema, domain, lalu logo di bawahnya
  function buildStudioCredit(lineLabel) {
    const url = "https://lembarkabar.web.id/";
    const credit = el("p", "lk-footer-credit");
    credit.append(document.createTextNode(`${lineLabel} Lembar Kabar · `));
    const domain = el("a", "lk-domain", "lembarkabar.web.id");
    domain.href = url;
    domain.target = "_blank";
    domain.rel = "noopener noreferrer";
    credit.append(domain);
    const brand = el("a", "lk-brand");
    brand.href = url;
    brand.target = "_blank";
    brand.rel = "noopener noreferrer";
    brand.setAttribute("aria-label", "Lembar Kabar, lembarkabar.web.id");
    brand.innerHTML = LK_LOGO_SVG;
    return [credit, brand];
  }

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
      // Ringkasan terstruktur (tampil sebagai teks "1 Hadir · 1 Ragu · 1 Tidak Hadir" bila tema tak menata)
      wishesSummary.replaceChildren();
      [[hadirCount, "Hadir", "hadir"], [raguCount, "Ragu", "ragu"], [tidakCount, "Tidak Hadir", "tidak"]].forEach(([num, text, key], i) => {
        if (i) wishesSummary.append(el("span", "lk-wishes-stat-sep", " · "));
        const stat = el("span", `lk-wishes-stat lk-wishes-stat--${key}`);
        stat.append(el("span", "lk-wishes-stat-num", num), el("span", "lk-wishes-stat-sep", " "), el("span", "lk-wishes-stat-label", text));
        wishesSummary.append(stat);
      });

      wishesList.replaceChildren();
      items.slice(0, shownCount).forEach((w) => {
        const li = el("li", "lk-wish-card");
        const top = el("div", "lk-wish-top");
        const who = el("span", "lk-wish-name", w.name);
        const avatar = el("span", "lk-wish-avatar", (w.name.trim()[0] || "?").toUpperCase());
        avatar.setAttribute("aria-hidden", "true");

        const badges = el("div", "lk-wish-badges");
        const attBadge = el("span", `lk-wish-badge${w.att === "hadir" ? " lk-wish-badge--hadir" : ""}`, attLabelMap[w.att] || "Hadir");
        badges.append(attBadge);
        if (w.att !== "tidak" && w.guests >= 1) {
          badges.append(el("span", "lk-wish-badge", `${w.guests} Tamu`));
        }

        top.append(avatar, who, badges);
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

    // Judul & salam penutup opsional (didefinisikan oleh tema lewat labels)
    if (labels.closing_title) closing.append(el("h2", "lk-closing-title", labels.closing_title));
    closing.append(el("p", "lk-closing-text", labels.closing));
    if (labels.closing_signoff) closing.append(el("p", "lk-closing-signoff", labels.closing_signoff));

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
    footer.append(...buildStudioCredit(labels.credit_line));
    main.append(footer);

    // Opsional: tema dapat menyisipkan ornamen dekoratif (aria-hidden) tanpa mengubah struktur data
    if (typeof theme.decorate === "function") {
      theme.decorate(main, data);
    }

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
