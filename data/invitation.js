/**
 * LAYER 1 — DATA UNDANGAN (Theme-agnostic)
 * Ubah isi objek window.INVITATION_DATA untuk mengganti konten pasangan.
 * Ganti `tema` (mis. "champagne-noir" | "merah-delima") tanpa mengubah struktur data maupun logika.
 */
window.INVITATION_DATA = {
  slug: "rizky-ayu",
  tema: "champagne-noir",

  mempelai: {
    pria: {
      nama_lengkap: "Rizky Pratama Wijaya, S.T.",
      nama_panggilan: "Rizky",
      ortu: "Putra pertama dari Bpk. Hendra Wijaya & Ibu Ratna Sari",
      foto: "",
      instagram: "rizkypratama"
    },
    wanita: {
      nama_lengkap: "Ayu Larasati Kusuma, S.Ars.",
      nama_panggilan: "Ayu",
      ortu: "Putri kedua dari Bpk. Bambang Kusuma & Ibu Sri Wahyuni",
      foto: "",
      instagram: "ayularasati"
    }
  },

  inisial: "RA",

  kutipan: {
    teks: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    sumber: "QS. Ar-Rum: 21"
  },

  acara: [
    {
      jenis: "akad",
      label: "Akad Nikah",
      mulai: "2027-02-14T08:00:00+07:00",
      selesai: "2027-02-14T10:00:00+07:00",
      venue: "Grand Ballroom Hotel Tentrem",
      alamat: "Jl. Gajahmada No. 123, Pekunden, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50134",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Hotel+Tentrem+Semarang"
    },
    {
      jenis: "resepsi",
      label: "Resepsi",
      mulai: "2027-02-14T11:00:00+07:00",
      selesai: "2027-02-14T14:00:00+07:00",
      venue: "Grand Ballroom Hotel Tentrem",
      alamat: "Jl. Gajahmada No. 123, Pekunden, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50134",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Hotel+Tentrem+Semarang"
    }
  ],

  dress_code: {
    aktif: true,
    keterangan: "Black Tie & Champagne Gold — busana formal bernuansa hitam, champagne gold, atau krem lembut.",
    warna: ["#0E0E0E", "#C9A96E", "#F3EDE2"]
  },

  cerita: [
    {
      judul: "Pertama Bertemu",
      tanggal: "Agustus 2019",
      kota: "Semarang",
      deskripsi: "Berawal dari sebuah proyek pameran arsitektur di Kota Lama, obrolan singkat tentang garis klasik dan cahaya senja menjadi awal cerita kami."
    },
    {
      judul: "Menemukan Arah",
      tanggal: "Mei 2023",
      kota: "Yogyakarta",
      deskripsi: "Setelah melewati jarak dan berbagai musim kehidupan, kami sepakat untuk melangkah dengan niat yang lebih tenang dan pasti."
    },
    {
      judul: "Lamaran",
      tanggal: "Oktober 2026",
      kota: "Semarang",
      deskripsi: "Di hadapan kedua keluarga besar, kami mengikat janji untuk membangun rumah yang penuh keteduhan dan doa."
    }
  ],

  // Ganti dengan foto WebP/AVIF/JPG pasangan (disarankan <= 200 KB per foto).
  // Kosongkan [] untuk menyembunyikan bagian Galeri secara otomatis.
  galeri: [
    { src: "assets/gallery/galeri-1.svg", alt: "Potret siluet Rizky & Ayu di ruang ballroom", caption: "Senja di Kota Lama" },
    { src: "assets/gallery/galeri-2.svg", alt: "Detail cincin pernikahan bernuansa emas champagne", caption: "Janji yang Terikat" },
    { src: "assets/gallery/galeri-3.svg", alt: "Komposisi arsitektur klasik bergaya art deco", caption: "Langkah Bersama" },
    { src: "assets/gallery/galeri-4.svg", alt: "Rangkaian bunga putih dan aksen emas", caption: "Tanda Kasih" },
    { src: "assets/gallery/galeri-5.svg", alt: "Suasana malam resepsi dengan cahaya hangat", caption: "Malam Penuh Syukur" },
    { src: "assets/gallery/galeri-6.svg", alt: "Monogram Rizky & Ayu pada kartu undangan", caption: "Babak Baru" }
  ],

  amplop: [
    {
      bank: "BCA",
      no_rekening: "0094 8210 55",
      atas_nama: "Rizky Pratama Wijaya"
    },
    {
      bank: "Mandiri",
      no_rekening: "135 00 1842 9901",
      atas_nama: "Ayu Larasati Kusuma"
    }
  ],

  alamat_kado: "Jl. Sisingamangaraja No. 48, Candi Baru, Kec. Candisari, Kota Semarang, Jawa Tengah 50257 (a.n. Ayu Larasati)",

  // Musik diunggah sendiri per undangan. Jika kosong, tombol musik tersembunyi tanpa error.
  musik: {
    url: "",
    judul: ""
  },

  tampilkan_foto_mempelai: true,

  // Opsional: URL Web App Google Apps Script (lihat apps-script.gs).
  // Jika kosong, RSVP & ucapan tersimpan sementara di localStorage browser (mode demo/offline).
  rsvp_endpoint: ""
};
