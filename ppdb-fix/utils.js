/* ============================================
   PPDB SMK Nusantara Mandiri - Utilities
   Fungsi bersama: Toast, dll.
   ============================================ */

// Menampilkan notifikasi toast
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);

  // Hapus toast setelah 3.5 detik
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Ambil data pendaftar dari localStorage
function getDataPendaftar() {
  const data = localStorage.getItem('ppdb_pendaftar');
  return data ? JSON.parse(data) : [];
}

// Simpan data pendaftar ke localStorage
function saveDataPendaftar(data) {
  localStorage.setItem('ppdb_pendaftar', JSON.stringify(data));
}

// Generate nomor pendaftaran unik
function generateNoDaftar() {
  const data = getDataPendaftar();
  const tahun = new Date().getFullYear();
  const nomor = String(data.length + 1).padStart(3, '0');
  return `PPDB-${tahun}-${nomor}`;
}

// Format tanggal ke Bahasa Indonesia
function formatTanggal(dateStr) {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}