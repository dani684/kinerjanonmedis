# Sistem Penilaian Kinerja Non Medis — RSUD AWS Samarinda

Aplikasi web berbasis **Google Apps Script** untuk penilaian indikator kinerja non medis, dengan source code dikelola di GitHub dan di-deploy otomatis menggunakan **clasp** + **GitHub Actions**.

---

## Arsitektur

```
GitHub Repo  ──(push ke main)──►  GitHub Actions  ──(clasp push)──►  Google Apps Script
                                                                              │
                                                                              ▼
                                                                    Google Spreadsheet
                                                               (ID: 1bu-JF4g5hhvrSSGHIlp8...)
```

| File | Keterangan |
|------|-----------|
| `Code.js` | Backend — semua fungsi server-side GAS |
| `index.html` | Frontend — UI lengkap (HTML + Tailwind + JS) |
| `appsscript.json` | Manifest proyek GAS |
| `.clasp.json` | Koneksi local ↔ GAS project (berisi Script ID) |

---

## Setup Pertama Kali (Lokal)

### 1. Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [Git](https://git-scm.com/)

### 2. Clone repo & install dependencies

```bash
git clone https://github.com/NAMA_USER/NAMA_REPO.git
cd NAMA_REPO
npm install
```

### 3. Login ke clasp

```bash
npx clasp login
```

Browser akan terbuka → login dengan akun Google yang memiliki akses ke GAS project → izinkan clasp.

Setelah login, file `~/.clasprc.json` otomatis dibuat (berisi token — **jangan di-commit**).

### 4. Dapatkan Script ID

1. Buka [Google Apps Script](https://script.google.com)
2. Buka project **RemunerasiNonMedik**
3. Klik ikon ⚙️ **Project Settings** (kiri bawah)
4. Salin **Script ID**

### 5. Set Script ID di `.clasp.json`

Edit file `.clasp.json`:

```json
{
  "scriptId": "PASTE_SCRIPT_ID_ANDA_DI_SINI",
  "rootDir": "."
}
```

### 6. Verifikasi koneksi

```bash
npm run status
```

Output harus menampilkan daftar file di GAS project.

### 7. Push kode ke GAS

```bash
npm run push
```

---

## Workflow Harian (Development)

```bash
# Edit Code.js atau index.html di editor lokal

# Push ke GAS untuk test langsung
npm run push

# Atau: push + buat deployment baru
npm run deploy

# Buka GAS editor di browser
npm run open

# Lihat logs eksekusi
npm run logs
```

---

## Setup GitHub Actions (Auto-Deploy)

Setiap kali ada **push ke branch `main`** yang mengubah `Code.js`, `index.html`, atau `appsscript.json`, GitHub Actions akan otomatis push ke GAS.

### 1. Dapatkan isi `~/.clasprc.json`

Setelah login clasp di lokal, jalankan:

**Windows (PowerShell):**
```powershell
Get-Content "$env:USERPROFILE\.clasprc.json"
```

**Linux/Mac:**
```bash
cat ~/.clasprc.json
```

Salin seluruh isi JSON-nya.

### 2. Dapatkan isi `.clasp.json`

```json
{
  "scriptId": "SCRIPT_ID_ANDA",
  "rootDir": "."
}
```

### 3. Tambahkan GitHub Secrets

Di repository GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name | Nilai |
|-------------|-------|
| `CLASPRC_JSON` | Isi lengkap file `~/.clasprc.json` |
| `CLASP_JSON` | `{"scriptId":"SCRIPT_ID_ANDA","rootDir":"."}` |

### 4. Push ke main → deploy otomatis

```bash
git add Code.js index.html
git commit -m "feat: update fitur penilaian"
git push origin main
```

GitHub Actions akan berjalan otomatis. Pantau di tab **Actions** di repository GitHub.

---

## Mengelola Spreadsheet

Spreadsheet ID saat ini: `1bu-JF4g5hhvrSSGHIlp8KJtenHMjgx03ouCaFMqYnEY`

Untuk ganti spreadsheet (misal: dev vs production):

1. Buka `Code.js`
2. Ubah baris pertama:
   ```js
   const SPREADSHEET_ID = 'ID_SPREADSHEET_BARU';
   ```
3. Push ke GAS: `npm run push`

> **Tips:** Untuk environment berbeda (dev/prod), bisa gunakan [Properties Service](https://developers.google.com/apps-script/guides/properties) GAS sebagai ganti konstanta hardcoded.

---

## Struktur Sheet Spreadsheet

| Sheet | Keterangan |
|-------|-----------|
| `user` | Data akun pengguna (Admin, Penilai, Pegawai, Verifikasi) |
| `data_pegawai` | Data pegawai yang mengisi form |
| `penilai_mapping` | Pemetaan penilai ↔ pegawai yang dinilai |
| `penilaian_kinerja` | Hasil penilaian IKI & IKU |
| `pengaturan_penilaian` | Periode & status penilaian |
| `jabatan` | Master data jabatan |
| `ruangan` | Master data ruangan |
| `risk` | Master data grade risiko kerja |
| `competency` | Master data tingkat pendidikan |
| `relevancy` | Master data relevansi jabatan-pendidikan |

---

## Troubleshooting

### `clasp push` gagal: "Script ID not found"
→ Pastikan `.clasp.json` berisi Script ID yang benar.

### GitHub Actions gagal: "Error: Unable to read credentials"
→ Pastikan secret `CLASPRC_JSON` berisi JSON yang valid (bukan kosong atau terpotong).

### Perubahan di GAS tidak terlihat setelah push
→ Buka GAS web app dengan **?dev=true** di URL, atau buka URL deployment baru.

### `clasp login` tidak bisa di server / CI
→ Gunakan service account + `GOOGLE_APPLICATION_CREDENTIALS`, atau gunakan token OAuth yang disimpan sebagai secret.

---

## Kontributor

RSUD AWS Samarinda — Bagian Keuangan
