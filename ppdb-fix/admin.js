/* ============================================
   PPDB SMK Nusantara Mandiri - Admin Panel
   Login, kelola pendaftar, terima/tolak
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Elemen DOM ---
  const loginOverlay = document.getElementById('adminLogin');
  const adminLayout = document.getElementById('adminLayout');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const tableBody = document.getElementById('tableBody');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const detailModal = document.getElementById('detailModal');
  const confirmModal = document.getElementById('confirmModal');
  const toastContainer = document.getElementById('toastContainer');

  let currentFilter = 'semua';
  let currentSearch = '';
  let selectedId = null;
  let confirmAction = null;

  // --- Cek sudah login atau belum ---
  if (sessionStorage.getItem('ppdb_admin') === 'true') {
    showAdmin();
  }

  // --- Login ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value;

      if (user === 'admin' && pass === 'admin123') {
        sessionStorage.setItem('ppdb_admin', 'true');
        loginError.classList.remove('visible');
        showAdmin();
        showToast('Selamat datang, Admin!', 'success');
      } else {
        loginError.classList.add('visible');
      }
    });
  }

  // --- Logout ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ppdb_admin');
      loginOverlay.classList.remove('hidden');
      adminLayout.classList.remove('visible');
      // Reset form login
      if (loginForm) loginForm.reset();
    });
  }

  function showAdmin() {
    loginOverlay.classList.add('hidden');
    adminLayout.classList.add('visible');
    renderAll();
  }

  // --- Render semua data ---
  function renderAll() {
    renderStats();
    renderTable();
  }

  // --- Render statistik ---
  function renderStats() {
    const data = getDataPendaftar();
    const total = data.length;
    const pending = data.filter(d => d.status === 'pending').length;
    const accepted = data.filter(d => d.status === 'accepted').length;
    const rejected = data.filter(d => d.status === 'rejected').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statAccepted').textContent = accepted;
    document.getElementById('statRejected').textContent = rejected;
  }

  // --- Render tabel ---
  function renderTable() {
    let data = getDataPendaftar();

    // Filter berdasarkan status
    if (currentFilter !== 'semua') {
      data = data.filter(d => d.status === currentFilter);
    }

    // Filter berdasarkan pencarian
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      data = data.filter(d =>
        d.namaLengkap.toLowerCase().includes(q) ||
        d.noDaftar.toLowerCase().includes(q) ||
        d.asalSekolah.toLowerCase().includes(q) ||
        d.nisn.includes(q)
      );
    }

    // Urutkan terbaru dulu
    data.sort((a, b) => new Date(b.tanggalDaftar) - new Date(a.tanggalDaftar));

    if (!tableBody) return;

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="table-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p>Belum ada data pendaftar</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const statusLabels = {
      pending: '<span class="badge badge-pending">Menunggu</span>',
      accepted: '<span class="badge badge-accepted">Diterima</span>',
      rejected: '<span class="badge badge-rejected">Ditolak</span>'
    };

    tableBody.innerHTML = data.map((d, i) => `
      <tr>
        <td style="font-weight:700;color:var(--text-muted)">${i + 1}</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            ${d.foto ? `<img src="${d.foto}" class="table-photo" alt="Foto">` : '<div class="table-photo" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--text-muted)">?</div>'}
            <div>
              <div style="font-weight:700;color:var(--text)">${d.namaLengkap}</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">${d.noDaftar}</div>
            </div>
          </div>
        </td>
        <td>${d.asalSekolah}</td>
        <td>${d.jurusan1}</td>
        <td>${statusLabels[d.status]}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-ghost btn-sm" onclick="showDetail('${d.noDaftar}')" title="Detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            ${d.status === 'pending' ? `
              <button class="btn btn-success btn-sm" onclick="confirmAction_('${d.noDaftar}','accepted')" title="Terima">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </button>
              <button class="btn btn-danger btn-sm" onclick="confirmAction_('${d.noDaftar}','rejected')" title="Tolak">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- Filter buttons ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  // --- Search ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderTable();
    });
  }

  // --- Tampilkan detail pendaftar ---
  window.showDetail = function(noDaftar) {
    const data = getDataPendaftar();
    const d = data.find(p => p.noDaftar === noDaftar);
    if (!d) return;

    const statusLabels = {
      pending: '<span class="badge badge-pending">Menunggu</span>',
      accepted: '<span class="badge badge-accepted">Diterima</span>',
      rejected: '<span class="badge badge-rejected">Ditolak</span>'
    };

    document.getElementById('detailContent').innerHTML = `
      <div class="modal-detail-grid">
        <div class="modal-detail-item">
          <div class="modal-detail-label">No. Pendaftaran</div>
          <div class="modal-detail-value" style="color:var(--primary)">${d.noDaftar}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Status</div>
          <div class="modal-detail-value">${statusLabels[d.status]}</div>
        </div>
        <div class="modal-detail-item full">
          <div class="modal-detail-label">Nama Lengkap</div>
          <div class="modal-detail-value">${d.namaLengkap}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">NISN</div>
          <div class="modal-detail-value">${d.nisn}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Jenis Kelamin</div>
          <div class="modal-detail-value">${d.jenkel === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Tempat Lahir</div>
          <div class="modal-detail-value">${d.tempatLahir}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Tanggal Lahir</div>
          <div class="modal-detail-value">${formatTanggal(d.tanggalLahir)}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Agama</div>
          <div class="modal-detail-value">${d.agama}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">No. HP / WhatsApp</div>
          <div class="modal-detail-value">${d.noHp}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Email</div>
          <div class="modal-detail-value">${d.email || '-'}</div>
        </div>
        <div class="modal-detail-item full">
          <div class="modal-detail-label">Alamat Lengkap</div>
          <div class="modal-detail-value">${d.alamat}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Asal Sekolah</div>
          <div class="modal-detail-value">${d.asalSekolah}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Nilai Rata-rata Raport</div>
          <div class="modal-detail-value">${d.nilaiRaport}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Tinggi Badan</div>
          <div class="modal-detail-value">${d.tinggiBadan || '-'} cm</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Berat Badan</div>
          <div class="modal-detail-value">${d.beratBadan || '-'} kg</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Pilihan Jurusan 1</div>
          <div class="modal-detail-value">${d.jurusan1}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Pilihan Jurusan 2</div>
          <div class="modal-detail-value">${d.jurusan2}</div>
        </div>
        <div class="modal-detail-item">
          <div class="modal-detail-label">Tanggal Daftar</div>
          <div class="modal-detail-value">${formatTanggal(d.tanggalDaftar)}</div>
        </div>
        <div class="modal-detail-item" style="display:flex;align-items:flex-end">
          ${d.foto ? `<img src="${d.foto}" class="modal-photo" alt="Foto">` : ''}
        </div>
      </div>
      ${d.status === 'pending' ? `
        <div class="modal-actions">
          <button class="btn btn-danger btn-sm" onclick="closeModal('detailModal');confirmAction_('${d.noDaftar}','rejected')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Tolak
          </button>
          <button class="btn btn-success btn-sm" onclick="closeModal('detailModal');confirmAction_('${d.noDaftar}','accepted')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Terima
          </button>
        </div>
      ` : ''}
    `;

    openModal('detailModal');
  };

  // --- Konfirmasi aksi terima/tolak ---
  window.confirmAction_ = function(noDaftar, action) {
    selectedId = noDaftar;
    confirmAction = action;

    const data = getDataPendaftar();
    const d = data.find(p => p.noDaftar === noDaftar);
    if (!d) return;

    const isAccept = action === 'accepted';
    document.getElementById('confirmTitle').textContent = isAccept ? 'Terima Pendaftar' : 'Tolak Pendaftar';
    document.getElementById('confirmMessage').innerHTML = `
      Apakah Anda yakin ingin <strong>${isAccept ? 'menerima' : 'menolak'}</strong> pendaftaran:<br>
      <span style="color:var(--primary);font-weight:800">${d.namaLengkap}</span><br>
      <span style="font-size:0.85rem;color:var(--text-muted)">${d.noDaftar}</span>
    `;
    document.getElementById('confirmBtn').className = `btn ${isAccept ? 'btn-success' : 'btn-danger'} btn-sm`;
    document.getElementById('confirmBtn').innerHTML = isAccept
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Ya, Terima'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ya, Tolak';

    openModal('confirmModal');
  };

  // --- Eksekusi aksi ---
  document.getElementById('confirmBtn').addEventListener('click', () => {
    if (!selectedId || !confirmAction) return;

    let data = getDataPendaftar();
    const idx = data.findIndex(d => d.noDaftar === selectedId);
    if (idx === -1) return;

    data[idx].status = confirmAction;
    saveDataPendaftar(data);

    closeModal('confirmModal');
    renderAll();

    const isAccept = confirmAction === 'accepted';
    showToast(
      `${data[idx].namaLengkap} berhasil ${isAccept ? 'diterima' : 'ditolak'}`,
      isAccept ? 'success' : 'error'
    );

    selectedId = null;
    confirmAction = null;
  });

  // --- Modal helpers ---
  window.openModal = function(id) {
    document.getElementById(id).classList.add('visible');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function(id) {
    document.getElementById(id).classList.remove('visible');
    document.body.style.overflow = '';
  };

  // Tutup modal saat klik overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  });

  // Tutup modal dengan ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.visible').forEach(m => {
        m.classList.remove('visible');
      });
      document.body.style.overflow = '';
    }
  });
});