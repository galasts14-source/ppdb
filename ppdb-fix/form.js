/* ============================================
   PPDB SMK Nusantara Mandiri - Formulir Pendaftaran
   Validasi, upload foto, penyimpanan data
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Mobile menu ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // --- Generate nomor pendaftaran ---
  const noDaftarInput = document.getElementById('noDaftar');
  if (noDaftarInput) {
    noDaftarInput.value = generateNoDaftar();
  }

  // --- Photo upload ---
  const photoUpload = document.getElementById('photoUpload');
  const photoInput = document.getElementById('photoInput');
  let photoBase64 = '';

  if (photoUpload && photoInput) {
    photoUpload.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validasi tipe & ukuran
      if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar (JPG/PNG)', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        photoBase64 = ev.target.result;
        // Tampilkan preview
        let img = photoUpload.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          photoUpload.appendChild(img);
        }
        img.src = photoBase64;
        photoUpload.classList.add('has-photo');
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Form submission ---
  const form = document.getElementById('formPendaftaran');
  const formContent = document.getElementById('formContent');
  const successContent = document.getElementById('successContent');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear semua error sebelumnya
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validasi
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const value = field.value.trim();
        if (!value) {
          field.classList.add('error');
          isValid = false;
        }
      });

      // Validasi NISN (10 digit)
      const nisn = document.getElementById('nisn');
      if (nisn && nisn.value.trim() && !/^\d{10}$/.test(nisn.value.trim())) {
        nisn.classList.add('error');
        isValid = false;
      }

      // Validasi No. HP
      const noHp = document.getElementById('noHp');
      if (noHp && noHp.value.trim() && !/^(\+62|62|0)8\d{8,11}$/.test(noHp.value.trim())) {
        noHp.classList.add('error');
        isValid = false;
      }

      // Validasi Email
      const email = document.getElementById('email');
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add('error');
        isValid = false;
      }

      // Validasi Nilai
      const nilai = document.getElementById('nilaiRaport');
      if (nilai && nilai.value.trim()) {
        const n = parseFloat(nilai.value);
        if (isNaN(n) || n < 0 || n > 100) {
          nilai.classList.add('error');
          isValid = false;
        }
      }

      // Validasi jurusan berbeda
      const jurusan1 = document.getElementById('jurusan1');
      const jurusan2 = document.getElementById('jurusan2');
      if (jurusan1 && jurusan2 && jurusan1.value && jurusan2.value && jurusan1.value === jurusan2.value) {
        jurusan2.classList.add('error');
        isValid = false;
        showToast('Pilihan jurusan 1 dan 2 tidak boleh sama', 'error');
      }

      // Validasi foto
      if (!photoBase64) {
        showToast('Foto wajib diupload', 'error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Mohon lengkapi semua data dengan benar', 'error');
        return;
      }

      // Kumpulkan data
      const dataPendaftar = {
        noDaftar: noDaftarInput.value,
        namaLengkap: document.getElementById('namaLengkap').value.trim(),
        nisn: document.getElementById('nisn').value.trim(),
        jenkel: document.getElementById('jenkel').value,
        tempatLahir: document.getElementById('tempatLahir').value.trim(),
        tanggalLahir: document.getElementById('tanggalLahir').value,
        agama: document.getElementById('agama').value,
        alamat: document.getElementById('alamat').value.trim(),
        noHp: document.getElementById('noHp').value.trim(),
        email: document.getElementById('email').value.trim(),
        asalSekolah: document.getElementById('asalSekolah').value.trim(),
        nilaiRaport: parseFloat(document.getElementById('nilaiRaport').value),
        tinggiBadan: document.getElementById('tinggiBadan').value.trim(),
        beratBadan: document.getElementById('beratBadan').value.trim(),
        jurusan1: document.getElementById('jurusan1').value,
        jurusan2: document.getElementById('jurusan2').value,
        foto: photoBase64,
        tanggalDaftar: new Date().toISOString(),
        status: 'pending' // pending | accepted | rejected
      };

      // Simpan ke localStorage
      const allData = getDataPendaftar();
      allData.push(dataPendaftar);
      saveDataPendaftar(allData);

      // Tampilkan halaman sukses
      formContent.style.display = 'none';
      successContent.style.display = 'block';
      document.getElementById('successNoDaftar').textContent = dataPendaftar.noDaftar;

      showToast('Pendaftaran berhasil disimpan!', 'success');
    });
  }

  // --- Hapus error saat user mengetik ---
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
    field.addEventListener('change', () => field.classList.remove('error'));
  });
});