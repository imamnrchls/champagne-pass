# Undangan Digital — Champagne Noir (Lembar Kabar)

Undangan pernikahan digital static HTML/CSS/Vanilla JS dengan **arsitektur 3 lapis** (Data · Skeleton · Theme), tanpa framework dan tanpa build step.

## Struktur Arsitektur 3 Lapis

```text
├── index.html                    # Shell utama (Open Graph, Google Fonts, loader)
├── kirim.html                    # Generator link ?to=Nama+Tamu & pesan WhatsApp massal
├── apps-script.gs                # Backend RSVP & ucapan via Google Sheets
├── data/
│   └── invitation.js             # Lapis 1 — DATA pasangan (tidak tahu tema apa)
├── core/
│   ├── skeleton.css              # Lapis 2 — SKELETON layout, aksesibilitas, responsif
│   └── skeleton.js               # Lapis 2 — SKELETON logika section 1–7, RSVP, kalender, audio
└── themes/
    ├── registry.js               # Kontrak pendaftaran tema (LKThemes)
    ├── champagne-noir/           # Lapis 3 — TEMA Champagne Noir
    │   ├── theme.css
    │   └── theme.js
    └── merah-delima/             # Lapis 3 — TEMA alternatif (verifikasi ganti kulit)
        ├── theme.css
        └── theme.js
```

## Cara Kustomisasi

1. **Ubah data pasangan**: buka `data/invitation.js` dan edit `window.INVITATION_DATA`.
2. **Ganti tema**: ubah `tema: "champagne-noir"` ke tema lain yang terdaftar (mis. `"merah-delima"`), atau pratinjau lewat URL `?tema=merah-delima`.
3. **Musik latar**: isi `musik.url` dan `musik.judul`. Jika dikosongkan, tombol musik tersembunyi otomatis tanpa error. Volume awal 60%.
4. **Section opsional**: kosongkan `galeri: []`, `cerita: []`, `amplop: []`, `alamat_kado: ""`, atau set `dress_code.aktif = false` untuk menyembunyikan section terkait tanpa meninggalkan ruang kosong. Set `tampilkan_foto_mempelai = false` untuk tampilan tipografi/monogram tanpa foto.
5. **RSVP Google Sheets**: pasang `apps-script.gs` di Google Sheet (instruksi ada di bagian atas file), lalu tempel URL Web App (`/exec`) ke `rsvp_endpoint` di `data/invitation.js`.

## Hosting

Siap deploy langsung ke Vercel (`vercel.json` sudah mengaktifkan `cleanUrls`) atau GitHub Pages tanpa proses build.
