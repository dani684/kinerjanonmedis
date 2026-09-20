const SPREADSHEET_ID = '1bu-JF4g5hhvrSSGHIlp8KJtenHMjgx03ouCaFMqYnEY';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('PENILAIAN INDIKATOR KINERJA NON MEDIS RSUD AWS')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ==========================================
// SETUP DATABASE
// ==========================================
function setupSpreadsheet() {
  const ss = getSpreadsheet();
  
  const initialData = {
    'user': {
      headers: ['Nama', 'NIP', 'Status', 'Password', 'Akses Menu', 'Status Akun'],
      rows: [
        ['Admin Sistem', '12345', 'Admin', 'admin123', 'Semua', 'Aktif'],
        ['Pegawai Satu', '11111', 'Pegawai', 'pass111', 'basic,relevancy', 'Aktif'],
        ['Penilai Satu', '22222', 'Penilai', 'pass222', 'risk,competency,jabatan,ruangan', 'Aktif']
      ]
    },
    'risk': {
      headers: ['Grade', 'Index', 'Kelompok'],
      rows: [
        ['Grade I', 2, 'resiko kerja yang bersifat fisik walaupun pegawai...'],
        ['Grade II', 3, 'resiko kerja yang bersifat kimiawi apabila pegawai...']
      ]
    },
    'competency': {
      headers: ['Pendidikan', 'Index'],
      rows: [
        ['SD', 1],
        ['SMP', 2],
        ['SMA', 3],
        ['SMU', 3],
        ['SMK', 3],
        ['MAN', 3],
        ['D1', 4],
        ['D2', 4],
        ['D3', 5],
        ['D4', 6],
        ['S1', 6],
        ['DOKTER UMUM', 7],
        ['DOKTER GIGI', 7],
        ['APOTEKER', 7],
        ['NERS', 7],
        ['S2', 8],
        ['DOKTER SPESIALIS', 9],
        ['S3', 10]
      ]
    },
    'position': {
      headers: ['Grade', 'Index', 'Kelompok'],
      rows: [
        ['Grade I', 1, 'Administrasi Perkantoran'],
        ['Grade II', 2, 'Administrasi Keuangan, Perencanaan, Akuntansi']
      ]
    },
    'emergency': {
      headers: ['Grade', 'Index', 'Kelompok'],
      rows: [
        ['Grade I', 1, 'Administrasi perkantoran'],
        ['Grade II', 2, 'Administrasi keuangan, Akuntansi dan Perencanaan, Gizi...']
      ]
    },
    'basic': {
      headers: ['Masa Kerja', 'Index'],
      rows: [
        ['0 - 1 Tahun', 0],
        ['1 - 2 Tahun', 1],
        ['3 - 5 Tahun', 2],
        ['6 - 10 Tahun', 4],
        ['11 - 20 Tahun', 6],
        ['21 - 30 Tahun', 8],
        ['>30 Tahun', 10]
      ]
    },
    'jabatan': {
      headers: ['Jabatan'],
      rows: [
        ['Pengadministrasi'],
        ['Ketua Tim'],
        ['Anggota Tim'],
        ['Kepala Bagian'],
        ['Pelaksana Harian (Plh)'],
        ['Pelaksana Tugas (Plt)']
      ]
    },
    'ruangan': {
      headers: ['Nama Ruangan', 'Bagian/Bidang', 'Direktorat'],
      rows: [
        ['Akuntansi', 'Akuntansi', 'Umum dan Keuangan'],
        ['Keuangan dan Penganggaran', 'Keuangan dan Penganggaran', 'Umum dan Keuangan'],
        ['Perencanaan', 'Perencanaan', 'Umum dan Keuangan'],
        ['SDM', 'SDM', 'SDM dan Diklatlit'],
        ['Umum', 'Umum, Hukum dan Humas', 'Umum dan Keuangan'],
        ['Hukum', 'Penunjang Non Medik', 'Penunjang'],
        ['Humas', 'Penunjang Medik', 'Penunjang'],
        ['Kemiteraan', 'Diklatlit', 'SDM dan Diklatlit'],
        ['Pelayanan Medik', 'Pelayanan Medik', 'Medik dan Keperawatan'],
        ['Laboratorium PK', 'Penunjang Medik', 'Penunjang']
      ]
    },
    'relevancy': {
      headers: ['Nama Ruangan', 'Pendidikan', 'Jurusan', 'Faktor Relevansi', 'Persen'],
      rows: [
        ['Akuntansi', 'S1', 'Akuntansi', 'Pendidikan langsung sesuai dengan pekerjaan', '100%'],
        ['Akuntansi', 'S1', 'Keuangan', 'Pendidikan langsung sesuai dengan pekerjaan', '100%'],
        ['Akuntansi', 'S1', 'Ekonomi', 'Pendidikan masih berkaitan erat dengan pekerjaan', '75%']
      ]
    },
    'data_pegawai': {
      headers: [
        'NIP', 'Nama Pegawai', 'Status', 'Pendidikan', 'Jurusan', 
        'Masa Kerja TKWT', 'TKWT Mulai', 'TKWT Selesai',
        'Masa Kerja ASN', 'ASN Mulai', 'ASN Selesai',
        'Total Masa Kerja',
        'JU - Nama Jabatan', 'JU - Ruangan', 'JU - Bagian/Bidang', 'JU - Direktorat',
        'JT1 - Nama Jabatan', 'JT1 - Ruangan', 'JT1 - Bagian/Bidang', 'JT1 - Direktorat', 'JT1 - File URL',
        'JT2 - Nama Jabatan', 'JT2 - Ruangan', 'JT2 - Bagian/Bidang', 'JT2 - Direktorat', 'JT2 - File URL',
        'Status Form', 'Status Verifikasi', 'Keterangan Verifikasi'
      ],
      rows: []
    },
    'penilai_mapping': {
      headers: ['NIP Penilai', 'Nama Penilai', 'Jabatan Penilai', 'NIP Yang Dinilai', 'Nama Yang Dinilai', 'Nama Ruangan', 'Jabatan Yang Dinilai'],
      rows: []
    },
    'pengaturan_penilaian': {
      headers: ['Bulan Penilaian', 'Status'],
      rows: [['September 2026', 'Tutup']]
    },
    'penilaian_kinerja': {
      headers: [
        'ID Penilaian', 'Tanggal Input', 'Bulan Penilaian', 'Tahun Penilaian',
        'NIP Penilai', 'Nama Penilai', 'Jabatan Penilai', 
        'NIP Yang Dinilai', 'Nama Yang Dinilai', 'Jabatan Yang Dinilai',
        'Kehadiran/Keberadaan', 'Perilaku kerja', 'Tanggung jawab peran', 
        'Ketepatan waktu', 'Kualitas pekerjaan', 'Inisiatif dan inovasi', 
        'Kerja sama tim', 'Pengisian Ekinerja dan Esakip',
        'Indikator Kinerja Individu (IKI)', 'Kategori IKI',
        'Indikator Kinerja Unit (IKU)', 'Kategori IKU'
      ],
      rows: []
    }
  };

  for (const sheetName in initialData) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clear(); // Bersihkan sheet jika sudah ada
    }
    
    // Set headers
    sheet.appendRow(initialData[sheetName].headers);
    // Format headers menjadi tebal
    sheet.getRange(1, 1, 1, initialData[sheetName].headers.length).setFontWeight('bold').setBackground('#e0e0e0');
    
    // Insert initial data
    if (initialData[sheetName].rows.length > 0) {
      sheet.getRange(2, 1, initialData[sheetName].rows.length, initialData[sheetName].headers.length).setValues(initialData[sheetName].rows);
    }
  }
  
  Logger.log('Setup Spreadsheet Selesai!');
}

// ==========================================
// AUTHENTICATION
// ==========================================
function loginUser(status, nip, password) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('user');
  
  if (!sheet) {
    return { success: false, message: 'Sheet user tidak ditemukan.' };
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Mencari index kolom (asumsi kolom bernama Status, NIP, Password, Akses Menu)
  const statusIdx = headers.indexOf('Status');
  const nipIdx = headers.indexOf('NIP');
  const passIdx = headers.indexOf('Password');
  const aksesIdx = headers.indexOf('Akses Menu'); // Bisa -1 jika belum disetup
  
  if (statusIdx === -1 || nipIdx === -1 || passIdx === -1) {
    return { success: false, message: 'Kolom Status, NIP, atau Password tidak ditemukan di sheet user.' };
  }
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let statusMatch = (row[statusIdx] == status);
    if (status === 'Penilai') {
      statusMatch = true; // Bypass strict status check for Penilai, validate mapping later
    }

    if (statusMatch && row[nipIdx] == nip && row[passIdx] == password) {
      const statusAkunIdx = headers.indexOf('Status Akun');
      if (statusAkunIdx !== -1 && row[statusAkunIdx] === 'Tidak Aktif') {
        return { success: false, message: 'Akun Anda Tidak Aktif. Hubungi Administrator.' };
      }
      
      let userAkses = (row[statusIdx] === 'Admin') ? 'Semua' : (aksesIdx !== -1 ? row[aksesIdx] : '');
      let finalRole = status === 'Penilai' ? 'Penilai' : row[statusIdx];
      
      if (status === 'Penilai') {
        const pSheet = ss.getSheetByName('penilai_mapping');
        if(!pSheet) return { success: false, message: 'Tabel penilai belum disetup.' };
        const pData = pSheet.getDataRange().getValues();
        let isPenilai = false;
        const pNipIdx = pData[0].indexOf('NIP Penilai');
        if (pNipIdx !== -1) {
          for(let p = 1; p < pData.length; p++) {
            if(pData[p][pNipIdx] == nip) {
              isPenilai = true; break;
            }
          }
        }
        if(!isPenilai) {
          return { success: false, message: 'Anda tidak terdaftar sebagai Penilai untuk pegawai manapun.' };
        }
      }
      
      return { 
        success: true, 
        user: {
          status: finalRole,
          nip: row[nipIdx],
          name: row[headers.indexOf('Nama')] || 'User',
          akses: userAkses
        }
      };
    }
  }
  
  return { success: false, message: 'Kredensial tidak valid.' };
}

function ubahPassword(nip, oldPassword, newPassword) {
  try {
    if (!nip) return { success: false, message: 'NIP tidak tersedia (silakan login ulang).' };
    if (!oldPassword) return { success: false, message: 'Password Lama wajib diisi.' };
    if (!newPassword) return { success: false, message: 'Password Baru wajib diisi.' };
    const sNew = String(newPassword);
    if (sNew.length < 6) return { success: false, message: 'Password Baru minimal 6 karakter.' };
    if (sNew.length > 8) return { success: false, message: 'Password Baru maksimal 8 karakter.' };

    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('user');
    if (!sheet) return { success: false, message: 'Sheet user tidak ditemukan.' };
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const nipIdx = headers.indexOf('NIP');
    const passIdx = headers.indexOf('Password');
    if (nipIdx === -1 || passIdx === -1) return { success: false, message: 'Kolom NIP / Password tidak ditemukan di sheet user.' };

    const sNip = String(nip).trim();
    const sOld = String(oldPassword);

    let rowIdx = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][nipIdx] || '').trim() === sNip) {
        rowIdx = i;
        break;
      }
    }

    if (rowIdx === -1) return { success: false, message: 'Akun dengan NIP tersebut tidak ditemukan.' };

    const currentPass = data[rowIdx][passIdx] !== undefined && data[rowIdx][passIdx] !== null ? String(data[rowIdx][passIdx]) : '';
    if (currentPass !== sOld) return { success: false, message: 'Password Lama tidak sesuai.' };
    if (currentPass === sNew) return { success: false, message: 'Password Baru tidak boleh sama dengan Password Lama.' };

    sheet.getRange(rowIdx + 1, passIdx + 1).setValue(sNew);
    return { success: true, message: 'Password berhasil diubah.' };
  } catch (e) {
    return { success: false, message: 'Server error: ' + e.message };
  }
}

// ==========================================
// CRUD OPERATIONS
// ==========================================

function getTableData(tableName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(tableName);
  
  if (!sheet) {
    return { error: 'Sheet ' + tableName + ' tidak ditemukan.' };
  }
  
  let data = sheet.getDataRange().getValues();
  let headers = data[0];
  
  // Migration logic: add Status Akun if missing in user table
  if(tableName === 'user' && headers.indexOf('Status Akun') === -1) {
      const newColIdx = headers.length + 1;
      sheet.getRange(1, newColIdx).setValue('Status Akun');
      headers.push('Status Akun');
      if(data.length > 1) {
          const activeData = Array(data.length - 1).fill(['Aktif']);
          sheet.getRange(2, newColIdx, activeData.length, 1).setValues(activeData);
          for(let i=1; i<data.length; i++) data[i].push('Aktif');
      }
  }
  
  let rows = data.slice(1);
  
  let extraOptions = {};
  if (tableName === 'relevancy') {
    const ruanganSheet = ss.getSheetByName('ruangan');
    if (ruanganSheet) {
      const rData = ruanganSheet.getDataRange().getValues();
      const rIdx = rData[0].indexOf('Nama Ruangan');
      if(rIdx !== -1) {
        let rList = [];
        for(let i=1; i<rData.length; i++) if(rData[i][rIdx]) rList.push(rData[i][rIdx]);
        // Remove duplicates
        extraOptions.ruangan = [...new Set(rList)];
      }
    }
    const compSheet = ss.getSheetByName('competency');
    if (compSheet) {
      const cData = compSheet.getDataRange().getValues();
      const cIdx = cData[0].indexOf('Pendidikan');
      if(cIdx !== -1) {
        let cList = [];
        for(let i=1; i<cData.length; i++) if(cData[i][cIdx]) cList.push(cData[i][cIdx]);
        // Remove duplicates
        extraOptions.pendidikan = [...new Set(cList)];
      }
    }
  }
  
  return {
    headers: headers,
    data: rows,
    extraOptions: extraOptions
  };
}

// --- NEW FUNCTIONS FOR PEGAWAI FORM ---

function getFormOptions() {
  const ss = getSpreadsheet();
  let options = {
    pendidikan: [],
    jurusan: [],
    jabatan: [],
    ruangan: []
  };

  try {
    const compSheet = ss.getSheetByName('competency');
    if (compSheet) {
      const cData = compSheet.getDataRange().getValues();
      const cIdx = cData[0].indexOf('Pendidikan');
      if (cIdx !== -1) {
        options.pendidikan = [...new Set(cData.slice(1).map(r => r[cIdx]).filter(Boolean))];
      }
    }

    const relSheet = ss.getSheetByName('relevancy');
    if (relSheet) {
      const rData = relSheet.getDataRange().getValues();
      const jIdx = rData[0].indexOf('Jurusan');
      if (jIdx !== -1) {
        options.jurusan = [...new Set(rData.slice(1).map(r => r[jIdx]).filter(Boolean))];
      }
    }

    const jabSheet = ss.getSheetByName('jabatan');
    if (jabSheet) {
      const jData = jabSheet.getDataRange().getValues();
      const jIdx = jData[0].indexOf('Jabatan');
      if (jIdx !== -1) {
        options.jabatan = [...new Set(jData.slice(1).map(r => r[jIdx]).filter(Boolean))];
      }
    }

    const ruangSheet = ss.getSheetByName('ruangan');
    if (ruangSheet) {
      const rData = ruangSheet.getDataRange().getValues();
      const namaIdx = rData[0].indexOf('Nama Ruangan');
      const bidIdx = rData[0].indexOf('Bagian/Bidang');
      const dirIdx = rData[0].indexOf('Direktorat');
      
      if (namaIdx !== -1 && bidIdx !== -1 && dirIdx !== -1) {
        options.ruangan = rData.slice(1).map(r => ({
          nama: r[namaIdx],
          bidang: r[bidIdx],
          direktorat: r[dirIdx]
        })).filter(r => r.nama);
      }
    }
    
    return { success: true, options: options };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function uploadFileToDrive(base64Data, filename) {
  try {
    const folderName = "Berkas Remun Non Medik";
    const folders = DriveApp.getFoldersByName(folderName);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // Create blob from base64
    const dataParts = base64Data.split(',');
    let base64 = dataParts[1] ? dataParts[1] : dataParts[0];
    let contentType = dataParts[0].split(';')[0].split(':')[1] || "application/pdf";
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64), contentType, filename);
    const file = folder.createFile(blob);
    // Important: Anyone with link can view (or just within domain depending on requirement)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return { success: true, url: file.getUrl() };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function savePegawaiForm(formData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('data_pegawai');
    if (!sheet) return { success: false, message: 'Sheet data_pegawai tidak ditemukan.' };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Cek jika NIP sudah ada, maka update baris tersebut, jika tidak tambahkan baris baru
    let rowIndex = -1;
    const nipIdx = headers.indexOf('NIP');
    if (nipIdx !== -1) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][nipIdx] == formData.nip) {
          rowIndex = i + 1; // Apps Script is 1-indexed
          break;
        }
      }
    }
    
    let rowValues = [];
    headers.forEach(h => {
      let val = '';
      if(h === 'NIP') val = formData.nip;
      else if(h === 'Nama Pegawai') val = formData.nama;
      else if(h === 'Status') val = formData.statusPegawai;
      else if(h === 'Pendidikan') val = formData.pendidikan;
      else if(h === 'Jurusan') val = formData.jurusan;
      else if(h === 'Masa Kerja TKWT') val = formData.mkTkwtText;
      else if(h === 'TKWT Mulai') val = formData.tkwtMulai;
      else if(h === 'TKWT Selesai') val = formData.tkwtSelesai;
      else if(h === 'Masa Kerja ASN') val = formData.mkAsnText;
      else if(h === 'ASN Mulai') val = formData.asnMulai;
      else if(h === 'ASN Selesai') val = formData.asnSelesai;
      else if(h === 'Total Masa Kerja') val = formData.mkTotalText;
      
      else if(h === 'JU - Nama Jabatan') val = formData.juJabatan;
      else if(h === 'JU - Ruangan') val = formData.juRuangan;
      else if(h === 'JU - Bagian/Bidang') val = formData.juBidang;
      else if(h === 'JU - Direktorat') val = formData.juDirektorat;
      
      else if(h === 'JT1 - Nama Jabatan') val = formData.jt1Jabatan;
      else if(h === 'JT1 - Ruangan') val = formData.jt1Ruangan;
      else if(h === 'JT1 - Bagian/Bidang') val = formData.jt1Bidang;
      else if(h === 'JT1 - Direktorat') val = formData.jt1Direktorat;
      else if(h === 'JT1 - File URL') val = formData.jt1FileUrl;
      
      else if(h === 'JT2 - Nama Jabatan') val = formData.jt2Jabatan;
      else if(h === 'JT2 - Ruangan') val = formData.jt2Ruangan;
      else if(h === 'JT2 - Bagian/Bidang') val = formData.jt2Bidang;
      else if(h === 'JT2 - Direktorat') val = formData.jt2Direktorat;
      else if(h === 'JT2 - File URL') val = formData.jt2FileUrl;
      
      else if(h === 'Status Form') val = formData.statusForm;
      else if(h === 'Status Verifikasi') {
        if (formData.statusForm === 'Dikirim') {
           val = 'Menunggu';
        } else {
           val = (rowIndex !== -1) ? data[rowIndex - 1][headers.indexOf('Status Verifikasi')] : 'Menunggu';
        }
      }
      else if(h === 'Keterangan Verifikasi') {
        if (formData.statusForm === 'Dikirim') {
           val = ''; // Clear reason on resubmit
        } else {
           val = (rowIndex !== -1 && headers.indexOf('Keterangan Verifikasi') !== -1) ? data[rowIndex - 1][headers.indexOf('Keterangan Verifikasi')] : '';
        }
      }
      
      rowValues.push(val);
    });
    
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }
    
    return { success: true };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function getPegawaiDataByNIP(nip) {
  try {
    const sheet = getSpreadsheet().getSheetByName('data_pegawai');
    if (!sheet) return { success: false, message: 'Sheet data_pegawai tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return { success: true, data: null };
    
    const headers = data[0];
    const nipIdx = headers.indexOf('NIP');
    if (nipIdx === -1) return { success: false, message: 'Kolom NIP tidak ditemukan' };
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][nipIdx] == nip) {
        let rowData = {};
        headers.forEach((h, idx) => {
          let val = data[i][idx];
          if (val instanceof Date) {
            val = val.toISOString().split('T')[0];
          }
          rowData[h] = val;
        });
        return { success: true, data: rowData };
      }
    }
    return { success: true, data: null };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function getVerifikasiList() {
  try {
    const sheet = getSpreadsheet().getSheetByName('data_pegawai');
    if (!sheet) return { success: false, message: 'Sheet data_pegawai tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return { success: true, data: [] };
    
    const headers = data[0];
    const statusFormIdx = headers.indexOf('Status Form');
    const nipIdx = headers.indexOf('NIP');
    const namaIdx = headers.indexOf('Nama Pegawai');
    const statusPegawaiIdx = headers.indexOf('Status');
    const statusVerifIdx = headers.indexOf('Status Verifikasi');
    
    let result = [];
    for (let i = 1; i < data.length; i++) {
      if (statusFormIdx !== -1 && data[i][statusFormIdx] === 'Dikirim') {
        let rowData = {};
        headers.forEach((h, idx) => {
          let val = data[i][idx];
          if (val instanceof Date) {
            val = val.toISOString().split('T')[0];
          }
          rowData[h] = val;
        });
        result.push(rowData);
      }
    }
    return { success: true, data: result };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function updateStatusVerifikasi(nip, statusVerifikasi, keteranganVerif = "") {
  try {
    const sheet = getSpreadsheet().getSheetByName('data_pegawai');
    if (!sheet) return { success: false, message: 'Sheet data_pegawai tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const nipIdx = headers.indexOf('NIP');
    let verifIdx = headers.indexOf('Status Verifikasi');
    let ketIdx = headers.indexOf('Keterangan Verifikasi');
    
    if (verifIdx === -1) {
      sheet.getRange(1, headers.length + 1).setValue('Status Verifikasi');
      verifIdx = headers.length;
      headers.push('Status Verifikasi');
    }
    if (ketIdx === -1) {
      sheet.getRange(1, headers.length + 1).setValue('Keterangan Verifikasi');
      ketIdx = headers.length;
      headers.push('Keterangan Verifikasi');
    }
    
    if (nipIdx !== -1) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][nipIdx] == nip) {
          sheet.getRange(i + 1, verifIdx + 1).setValue(statusVerifikasi);
          sheet.getRange(i + 1, ketIdx + 1).setValue(keteranganVerif);
          return { success: true };
        }
      }
    }
    return { success: false, message: 'NIP tidak ditemukan' };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

// END PEGAWAI FORM FUNCTIONS

// ==========================================
// REMUNERASI POINT CALCULATION
// ==========================================
function getRemunerasiPointData(bulan, tahun, simpanDetail = true) {
  try {
    const ss = getSpreadsheet();
    
    if (!bulan || !tahun) {
      const pengSheet = ss.getSheetByName('pengaturan_penilaian');
      if (pengSheet) {
        const pengData = pengSheet.getDataRange().getValues();
        if (pengData.length > 1) {
          let rawBulan = pengData[1][0];
          let periodeStr = '';
          if (rawBulan instanceof Date) {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            periodeStr = monthNames[rawBulan.getMonth()] + ' ' + rawBulan.getFullYear();
          } else {
            periodeStr = String(rawBulan || '').trim();
            if (periodeStr.startsWith("'")) periodeStr = periodeStr.substring(1);
          }
          if (periodeStr) {
            const parts = periodeStr.split(/\s+/);
            if (parts.length >= 2) {
              const t = parts[parts.length - 1];
              const b = parts.slice(0, -1).join(' ').trim();
              if (b && t) {
                if (!bulan) bulan = b;
                if (!tahun) tahun = t;
              }
            }
          }
        }
      }
      if (!bulan || !tahun) {
        const pkSheetDefault = ss.getSheetByName('penilaian_kinerja');
        if (pkSheetDefault) {
          const pkData = pkSheetDefault.getDataRange().getValues();
          if (pkData.length > 1) {
            const hPk = pkData[0];
            const bulanIdxDef = hPk.indexOf('Bulan Penilaian');
            const tahunIdxDef = hPk.indexOf('Tahun Penilaian');
            const idIdxDef = hPk.indexOf('ID Penilaian');
            for (let i = pkData.length - 1; i >= 1; i--) {
              let pkBulanDef = (bulanIdxDef !== -1) ? String(pkData[i][bulanIdxDef] || '').trim() : '';
              let pkTahunDef = (tahunIdxDef !== -1) ? String(pkData[i][tahunIdxDef] || '').trim() : '';
              if (!pkBulanDef || !pkTahunDef) {
                let idVal = String(pkData[i][idIdxDef] || '');
                let idParts = idVal.split('_');
                if (idParts.length === 4) {
                  pkBulanDef = idParts[2].trim();
                  pkTahunDef = idParts[3].trim();
                }
              }
              if (pkBulanDef && pkTahunDef) {
                if (!bulan) bulan = pkBulanDef;
                if (!tahun) tahun = pkTahunDef;
                break;
              }
            }
          }
        }
      }
    }
    
    // Load reference tables
    const basicSheet = ss.getSheetByName('basic');         // Masa Kerja: [Masa Kerja, Index] max=10
    const competencySheet = ss.getSheetByName('competency'); // Pendidikan: [Pendidikan, Index] max=10
    const riskSheet = ss.getSheetByName('risk');             // Resiko: [Grade, Index, Kelompok] max=5
    const emergencySheet = ss.getSheetByName('emergency');   // Kegawatdaruratan: [Grade, Index, Kelompok] max=6
    const positionSheet = ss.getSheetByName('position');     // Posisi: [Grade, Index, Kelompok] max=6
    const relevancySheet = ss.getSheetByName('relevancy');   // Relevansi: [Nama Ruangan, Pendidikan, Jurusan, Faktor, Persen]
    const pegSheet = ss.getSheetByName('data_pegawai');
    
    if (!pegSheet) return { success: false, message: 'Sheet data_pegawai tidak ditemukan' };
    
    // Build lookup maps
    function buildIndexMap(sheet) {
      if(!sheet) return {};
      const d = sheet.getDataRange().getValues();
      const map = {};
      for(let i=1; i<d.length; i++) {
        if(d[i][0]) map[String(d[i][0]).trim().toLowerCase()] = { grade: d[i][0], index: parseFloat(d[i][1]) || 0 };
      }
      return map;
    }
    
    const basicMap = buildIndexMap(basicSheet);     // key=masa kerja label, val={grade, index}
    const competencyMap = buildIndexMap(competencySheet); // key=pendidikan
    const riskMap = buildIndexMap(riskSheet);
    const emergencyMap = buildIndexMap(emergencySheet);
    const positionMap = buildIndexMap(positionSheet);
    
    // Relevancy map: key = ruangan+':'+pendidikan+':'+jurusan
    const relevancyMap = {};
    if(relevancySheet) {
      const rv = relevancySheet.getDataRange().getValues();
      for(let i=1; i<rv.length; i++) {
        const k = String(rv[i][0]).trim().toLowerCase() + ':' + String(rv[i][1]).trim().toLowerCase() + ':' + String(rv[i][2]).trim().toLowerCase();
        let val = rv[i][4];
        let factor = 1;
        if (typeof val === 'number') {
          factor = val > 1 ? val / 100 : val;
        } else {
          let pctStr = String(val || '1').replace('%', '').trim();
          let parsed = parseFloat(pctStr);
          if (!isNaN(parsed)) {
            factor = parsed > 1 ? parsed / 100 : parsed;
          }
        }
        relevancyMap[k] = factor;
      }
    }
    
    const DATA_MAX = { masaKerja: 10, pendidikan: 10, risk: 5, emergency: 6, position: 6 };
    const RATE = { masaKerja: 3, pendidikan: 3, risk: 3, emergency: 3, position: 3 };
    
    // Helper: resolve masa kerja bracket
    function getMasaKerjaGrade(totalTahun) {
      const n = parseFloat(totalTahun) || 0;
      if(n <= 1) return '0 - 1 Tahun';
      if(n <= 2) return '1 - 2 Tahun';
      if(n <= 5) return '3 - 5 Tahun';
      if(n <= 10) return '6 - 10 Tahun';
      if(n <= 20) return '11 - 20 Tahun';
      if(n <= 30) return '21 - 30 Tahun';
      return '>30 Tahun';
    }
    
    // Helper: get point item
    function pointItem(objek, uraian, point, max, rate) {
      const poinPctRaw = (max > 0) ? (point / max) : 0;
      const hasil = poinPctRaw * rate;
      return {
        objek: objek,
        uraian: uraian,
        point: point,
        max: max,
        poinPct: (poinPctRaw * 100).toFixed(1) + '%',
        rate: rate,
        hasil: parseFloat(hasil.toFixed(2))
      };
    }
    
    const pegData = pegSheet.getDataRange().getValues();
    const h = pegData[0];
    const nipIdx = h.indexOf('NIP');
    const namaIdx = h.indexOf('Nama Pegawai');
    const statusIdx = h.indexOf('Status');
    const pendidikanIdx = h.indexOf('Pendidikan');
    const jurusanIdx = h.indexOf('Jurusan');
    const masaKerjaIdx = h.indexOf('Total Masa Kerja');
    const statusVerifIdx = h.indexOf('Status Verifikasi');
    const juJabIdx = h.indexOf('JU - Nama Jabatan');
    const juRuangIdx = h.indexOf('JU - Ruangan');
    const jt1JabIdx = h.indexOf('JT1 - Nama Jabatan');
    const jt1RuangIdx = h.indexOf('JT1 - Ruangan');
    const jt2JabIdx = h.indexOf('JT2 - Nama Jabatan');
    const jt2RuangIdx = h.indexOf('JT2 - Ruangan');
    
    const pkSheet = ss.getSheetByName('penilaian_kinerja');
    const pkData = pkSheet ? pkSheet.getDataRange().getValues() : [];
    
    // Helper: SUPER normalisasi string jabatan agar tahan terhadap perbedaan
    // spasi ganda, non-breaking space, karakter tersembunyi, dll
    function normalizeJabatan(s) {
      let t = String(s || '').toLowerCase();
      t = t.replace(/\u00A0/g, ' ');        // non-breaking space → spasi
      t = t.replace(/\s+/g, ' ');           // spasi berlebih → 1 spasi
      t = t.trim();
      // Versi tanpa spasi & tanpa karakter non alphanumerik
      let plain = t.replace(/[^a-z0-9]/g, '');
      // Kata kunci (token) diurutkan, tahan urutan kata terbalik
      let tokens = t.split(' ').filter(x => x.length > 2).sort();
      return { asli: t, plain: plain, tokens: tokens };
    }
    
    // Struktur: pkAssessments[nip] = [{ jabatan, jabPlain, jabTokens, iki, iku, used }]
    const pkAssessments = {};
    if(pkData.length > 1) {
      const hPk = pkData[0];
      const nipDinilaiIdx = hPk.indexOf('NIP Yang Dinilai');
      const jabDinilaiIdx = hPk.indexOf('Jabatan Yang Dinilai');
      const ikiIdx = hPk.indexOf('Indikator Kinerja Individu (IKI)');
      const ikuIdx = hPk.indexOf('Indikator Kinerja Unit (IKU)');
      const statusKirimIdx = hPk.indexOf('Status Pengiriman');
      const idIdx = hPk.indexOf('ID Penilaian');
      const bulanIdx = hPk.indexOf('Bulan Penilaian');
      const tahunIdx = hPk.indexOf('Tahun Penilaian');
      
      for(let i=1; i<pkData.length; i++) {
        // Filter status: semua status NON-KOSONG dianggap terkirim (Dikirim / Sudah Dikirim, dll)
        if(statusKirimIdx !== -1) {
          const s = String(pkData[i][statusKirimIdx] || '').trim();
          if(!s) continue;
        }
        
        // Filter per periode - gunakan kolom langsung, fallback ke ID
        let pkBulan = (bulanIdx !== -1) ? String(pkData[i][bulanIdx] || '').trim() : '';
        let pkTahun = (tahunIdx !== -1) ? String(pkData[i][tahunIdx] || '').trim() : '';
        if(!pkBulan || !pkTahun) {
          let idVal = String(pkData[i][idIdx] || '');
          let parts = idVal.split('_');
          if(parts.length === 4) {
            pkBulan = parts[2].trim();
            pkTahun = parts[3].trim();
          }
        }
        if(bulan && pkBulan && String(bulan).trim() !== pkBulan) continue;
        if(tahun && pkTahun && String(tahun).trim() !== pkTahun) continue;
        
        let n = String(pkData[i][nipDinilaiIdx] || '').trim();
        let jRaw = String(pkData[i][jabDinilaiIdx] || '').trim();
        let iki = pkData[i][ikiIdx] || '';
        let iku = pkData[i][ikuIdx] || '';
        let nj = normalizeJabatan(jRaw);
        
        if(!pkAssessments[n]) pkAssessments[n] = [];
        pkAssessments[n].push({
          jabatan: nj.asli,
          jabPlain: nj.plain,
          jabTokens: nj.tokens,
          iki: iki, iku: iku, used: false
        });
      }
    }
    
    let result = [];
    
    for(let i=1; i<pegData.length; i++) {
      const row = pegData[i];
      if(!row[nipIdx]) continue;
      
      const nip = String(row[nipIdx]).trim();
      const nama = String(row[namaIdx] || '').trim();
      const status = String(row[statusIdx] || '').trim();
      const pendidikan = String(row[pendidikanIdx] || '').trim();
      const jurusan = String(row[jurusanIdx] || '').trim();
      const masaKerjaTotal = parseFloat(row[masaKerjaIdx]) || 0;
      const statusVerif = String(row[statusVerifIdx] || '').trim();
      const juJabatan = String(row[juJabIdx] || '-').trim();
      const juRuangan = String(row[juRuangIdx] || '').trim();
      const jt1Jabatan = String(row[jt1JabIdx] || '-').trim();
      const jt1Ruangan = String(row[jt1RuangIdx] || '').trim();
      const jt2Jabatan = String(row[jt2JabIdx] || '-').trim();
      const jt2Ruangan = String(row[jt2RuangIdx] || '').trim();
      
      // Helper: hitung poin jabatan tambahan (Risk + Emergency + Position)
      // Dikembalikan sebagai { items: [rItem, eItem, pItem], total: sumHasil } agar detailnya bisa ditampilkan
      const calcTambahanPointDetail = (ruangan, jabatan) => {
        if(!ruangan && (!jabatan || jabatan === '-')) return { items: [], total: 0 };

        // Gabungkan haystack pencarian: ruangan + " " + jabatan, agar pencarian match
        // terhadap salah satu keduanya (bisa Kelompok berisi "Anggota Tim" (nama jabatan),
        // atau "Keuangan" (bagian dari ruangan/jabatan))
        const hay = (ruangan || '') + ' ' + (jabatan || '') + ' ' + ((ruangan || '') + ' ' + (jabatan || '')).replace(/\s+/g, '').toLowerCase();
        const hayLow = hay.toLowerCase();

        let rGrade = { grade: 'Grade I', index: 0 };
        if(riskSheet) {
          const rd = riskSheet.getDataRange().getValues();
          // Default fallback dari BARIS PERTAMA sheet risk agar index sesuai (Grade I = 2)
          if(rd.length > 1) rGrade = { grade: String(rd[1][0] || 'Grade I'), index: parseFloat(rd[1][1]) || 0 };
          for(let r=1; r<rd.length; r++) {
            const kel = String(rd[r][2] || '').toLowerCase();
            if(kel) {
              // Keyword bisa berupa: "Pengadministrasi Keuangan", "Anggota Tim", dll. Jadi jika SEMUA kata kunci
              // ada di haystack (ruangan+jabatan) → cocok. ATAU haystack mengandung salah satu kata.
              const kws = kel.split(',').map(w=>w.trim()).filter(w=>w);
              let match = kws.some(kw => kw && (hayLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayLow.includes(k))));
              if(match) {
                rGrade = { grade: rd[r][0], index: parseFloat(rd[r][1]) || 0 }; break;
              }
            }
          }
        }
        
        let eGrade = { grade: 'Grade I', index: 0 };
        if(emergencySheet) {
          const ed = emergencySheet.getDataRange().getValues();
          if(ed.length > 1) eGrade = { grade: String(ed[1][0] || 'Grade I'), index: parseFloat(ed[1][1]) || 0 };
          for(let e=1; e<ed.length; e++) {
            const kel = String(ed[e][2] || '').toLowerCase();
            if(kel) {
              const kws = kel.split(',').map(w=>w.trim()).filter(w=>w);
              let match = kws.some(kw => kw && (hayLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayLow.includes(k))));
              if(match) {
                eGrade = { grade: ed[e][0], index: parseFloat(ed[e][1]) || 0 }; break;
              }
            }
          }
        }
        
        let pGrade = { grade: 'Grade I', index: 0 };
        if(positionSheet) {
          const pd = positionSheet.getDataRange().getValues();
          if(pd.length > 1) pGrade = { grade: String(pd[1][0] || 'Grade I'), index: parseFloat(pd[1][1]) || 0 };
          for(let p=1; p<pd.length; p++) {
            const kel = String(pd[p][2] || '').toLowerCase();
            if(kel) {
              const kws = kel.split(',').map(w=>w.trim()).filter(w=>w);
              let match = kws.some(kw => kw && (hayLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayLow.includes(k))));
              if(match) {
                pGrade = { grade: pd[p][0], index: parseFloat(pd[p][1]) || 0 }; break;
              }
            }
          }
          if(pGrade.index === 0) {
            for(let p=1; p<pd.length; p++) {
              const kel = String(pd[p][2] || '').toLowerCase();
              for(const kw of kel.split(',').map(w=>w.trim())) {
                if(kw && (ruangan.toLowerCase().includes(kw) || jabatan.toLowerCase().includes(kw))) {
                  pGrade = { grade: pd[p][0], index: parseFloat(pd[p][1]) || 0 }; break;
                }
              }
              if(pGrade.index > 0) break;
            }
          }
        }
        
        const rItem = pointItem('Resiko Kerja', String(rGrade.grade), rGrade.index, DATA_MAX.risk, RATE.risk);
        const eItem = pointItem('Kegawatdaruratan', String(eGrade.grade), eGrade.index, DATA_MAX.emergency, RATE.emergency);
        const pItem = pointItem('Posisi', ruangan || jabatan, pGrade.index, DATA_MAX.position, RATE.position);
        const items = [rItem, eItem, pItem];
        return {
          items: items,
          total: parseFloat(items.reduce((s, d) => s + d.hasil, 0).toFixed(2))
        };
      };
      
      // Wrapper backward-compatible: cukup ambil total saja jika hanya butuh angka
      const calcTambahanPoint = (ruangan, jabatan) => calcTambahanPointDetail(ruangan, jabatan).total;
      
      // 1. Masa Kerja
      const mkGrade = getMasaKerjaGrade(masaKerjaTotal);
      const mkData = basicMap[mkGrade.toLowerCase()] || { index: 0 };
      const mkItem = pointItem('Masa Kerja', masaKerjaTotal > 0 ? masaKerjaTotal + ' Tahun' : mkGrade, mkData.index, DATA_MAX.masaKerja, RATE.masaKerja);
      
      // 2. Pendidikan dan Relevansi
      const compData = competencyMap[pendidikan.toLowerCase()] || { index: 0 };
      let penPoint = compData.index;
      // Apply relevansi factor based on JU Ruangan
      const relKey = juRuangan.toLowerCase() + ':' + pendidikan.toLowerCase() + ':' + jurusan.toLowerCase();
      const relFactor = relevancyMap[relKey] !== undefined ? relevancyMap[relKey] : 1;
      penPoint = parseFloat((penPoint * relFactor).toFixed(2));
      const penItem = pointItem('Pendidikan dan Relevansi', pendidikan + (jurusan ? '-' + jurusan : ''), penPoint, DATA_MAX.pendidikan, RATE.pendidikan);
      
      // Haystack untuk pencarian Jabatan UTAMA (ruangan + jabatan) - SAMA dengan logika Tambahan
      const hayUtama = (juRuangan || '') + ' ' + (juJabatan || '');
      const hayUtamaLow = hayUtama.toLowerCase();

      // 3. Resiko Kerja (based on JU Ruangan/Jabatan -> look up risk table kelompok)
      let riskGradeFound = { grade: 'Grade I', index: 0 };
      if(riskSheet) {
        const rd = riskSheet.getDataRange().getValues();
        // Default fallback DARI BARIS PERTAMA sheet risk agar index sesuai (Grade I = 2)
        if(rd.length > 1) riskGradeFound = { grade: String(rd[1][0] || 'Grade I'), index: parseFloat(rd[1][1]) || 0 };
        for(let r=1; r<rd.length; r++) {
          const kelompok = String(rd[r][2] || '').toLowerCase();
          if(kelompok) {
            const kws = kelompok.split(',').map(w=>w.trim()).filter(w=>w);
            let match = kws.some(kw => kw && (hayUtamaLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayUtamaLow.includes(k))));
            if(match) {
              riskGradeFound = { grade: rd[r][0], index: parseFloat(rd[r][1]) || 0 }; break;
            }
          }
        }
      }
      const riskItem = pointItem('Resiko Kerja', String(riskGradeFound.grade), riskGradeFound.index, DATA_MAX.risk, RATE.risk);
      
      // 4. Kegawatdaruratan
      let emergGradeFound = { grade: 'Grade I', index: 0 };
      if(emergencySheet) {
        const ed = emergencySheet.getDataRange().getValues();
        if(ed.length > 1) emergGradeFound = { grade: String(ed[1][0] || 'Grade I'), index: parseFloat(ed[1][1]) || 0 };
        for(let e=1; e<ed.length; e++) {
          const kelompok = String(ed[e][2] || '').toLowerCase();
          if(kelompok) {
            const kws = kelompok.split(',').map(w=>w.trim()).filter(w=>w);
            let match = kws.some(kw => kw && (hayUtamaLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayUtamaLow.includes(k))));
            if(match) {
              emergGradeFound = { grade: ed[e][0], index: parseFloat(ed[e][1]) || 0 }; break;
            }
          }
        }
      }
      const emergItem = pointItem('Kegawatdaruratan', String(emergGradeFound.grade), emergGradeFound.index, DATA_MAX.emergency, RATE.emergency);
      
      // 5. Posisi
      let posGradeFound = { grade: 'Grade I', index: 0 };
      if(positionSheet) {
        const pd = positionSheet.getDataRange().getValues();
        if(pd.length > 1) posGradeFound = { grade: String(pd[1][0] || 'Grade I'), index: parseFloat(pd[1][1]) || 0 };
        for(let p=1; p<pd.length; p++) {
          const kelompok = String(pd[p][2] || '').toLowerCase();
          if(kelompok) {
            const kws = kelompok.split(',').map(w=>w.trim()).filter(w=>w);
            let match = kws.some(kw => kw && (hayUtamaLow.includes(kw) || kw.split(/\s+/).every(k=>k && hayUtamaLow.includes(k))));
            if(match) {
              posGradeFound = { grade: pd[p][0], index: parseFloat(pd[p][1]) || 0 }; break;
            }
          }
        }
        // Secondary try: pecah kata, cocok per kata
        if(posGradeFound.index === 0) {
          for(let p=1; p<pd.length; p++) {
            const kelompok = String(pd[p][2] || '').toLowerCase();
            const kelWords = kelompok.split(',').map(w=>w.trim());
            for(const kw of kelWords) {
              if(kw && (juRuangan.toLowerCase().includes(kw) || juJabatan.toLowerCase().includes(kw))) {
                posGradeFound = { grade: pd[p][0], index: parseFloat(pd[p][1]) || 0 };
                break;
              }
            }
            if(posGradeFound.index > 0) break;
          }
        }
      }
      const posItem = pointItem('Posisi', juRuangan || juJabatan, posGradeFound.index, DATA_MAX.position, RATE.position);
      
      const detailItems = [mkItem, penItem, riskItem, emergItem, posItem];
      const pointIndividu = parseFloat(detailItems.reduce((sum, d) => sum + d.hasil, 0).toFixed(2));
      
      const t1DetailCalc = (jt1Jabatan !== '-' || jt1Ruangan) ? calcTambahanPointDetail(jt1Ruangan, jt1Jabatan) : { items: [], total: 0 };
      const t2DetailCalc = (jt2Jabatan !== '-' || jt2Ruangan) ? calcTambahanPointDetail(jt2Ruangan, jt2Jabatan) : { items: [], total: 0 };
      const pointIndividuT1 = t1DetailCalc.total;
      const pointIndividuT2 = t2DetailCalc.total;
      const detailT1 = t1DetailCalc.items;
      const detailT2 = t2DetailCalc.items;
      
      // Reset tanda used untuk NIP ini di awal iterasi (agar fresh per pegawai)
      const listPenilaianPegawaiIni = pkAssessments[nip] ? pkAssessments[nip].map(e => ({ ...e, jabTokens: [...(e.jabTokens || [])] })) : [];
      const getNilai = (nipDummy, targetJabatan) => {
        if (!targetJabatan || targetJabatan === '-') return { iki: '', iku: '' };
        const nTarget = normalizeJabatan(targetJabatan);
        
        // LVL 1: Exact match versi normalisasi standar
        for (let k = 0; k < listPenilaianPegawaiIni.length; k++) {
          if (!listPenilaianPegawaiIni[k].used && listPenilaianPegawaiIni[k].jabatan === nTarget.asli) {
            listPenilaianPegawaiIni[k].used = true;
            return { iki: listPenilaianPegawaiIni[k].iki, iku: listPenilaianPegawaiIni[k].iku };
          }
        }
        // LVL 2: SUPER-PLAIN MATCH (tanpa spasi & tanpa karakter non-alfanumerik)
        // Ini menangani: spasi ganda, karakter tersembunyi, tanda baca beda, dll
        if (nTarget.plain) {
          for (let k = 0; k < listPenilaianPegawaiIni.length; k++) {
            if (!listPenilaianPegawaiIni[k].used && listPenilaianPegawaiIni[k].jabPlain === nTarget.plain) {
              listPenilaianPegawaiIni[k].used = true;
              return { iki: listPenilaianPegawaiIni[k].iki, iku: listPenilaianPegawaiIni[k].iku };
            }
          }
        }
        // LVL 3: Fuzzy includes plain (salah satu mengandung yang lain)
        if (nTarget.plain) {
          for (let k = 0; k < listPenilaianPegawaiIni.length; k++) {
            if (!listPenilaianPegawaiIni[k].used) {
              const p2 = listPenilaianPegawaiIni[k].jabPlain || '';
              if (p2 && (p2.includes(nTarget.plain) || nTarget.plain.includes(p2))) {
                listPenilaianPegawaiIni[k].used = true;
                return { iki: listPenilaianPegawaiIni[k].iki, iku: listPenilaianPegawaiIni[k].iku };
              }
            }
          }
        }
        // LVL 4: Token overlap (>50% kata kunci cocok)
        if (nTarget.tokens.length > 0) {
          for (let k = 0; k < listPenilaianPegawaiIni.length; k++) {
            if (!listPenilaianPegawaiIni[k].used && listPenilaianPegawaiIni[k].jabTokens) {
              const tok2 = listPenilaianPegawaiIni[k].jabTokens;
              if (tok2.length === 0) continue;
              let same = 0;
              nTarget.tokens.forEach(t => { if (tok2.indexOf(t) !== -1) same++; });
              const minLen = Math.min(nTarget.tokens.length, tok2.length);
              if (minLen > 0 && (same / minLen) >= 0.5) {
                listPenilaianPegawaiIni[k].used = true;
                return { iki: listPenilaianPegawaiIni[k].iki, iku: listPenilaianPegawaiIni[k].iku };
              }
            }
          }
        }
        // LVL 5: Fallback by-order. Jika jumlah penilaian BELUM TERPAKAI == jumlah slot JABATAN yang
        // MASIH AKAN dicari (JU, JT1, JT2), maka ambil SESUAI URUTAN.
        // Kasus klasik Pegawai B: 2 penilaian utk 2 slot (JU + JT1) tapi nama jabatan encoding beda.
        const sisaBelumTerpakai = listPenilaianPegawaiIni.filter(e => !e.used);
        if (sisaBelumTerpakai.length > 0 && sisaBelumTerpakai.length <= 3) {
          // Ambil pertama dari daftar sisa
          const pilih = sisaBelumTerpakai[0];
          // Tandai yang di-listPenilaianPegawaiIni asli sebagai used
          for (let k = 0; k < listPenilaianPegawaiIni.length; k++) {
            if (listPenilaianPegawaiIni[k] === pilih ||
                (!listPenilaianPegawaiIni[k].used &&
                 listPenilaianPegawaiIni[k].iki === pilih.iki &&
                 listPenilaianPegawaiIni[k].iku === pilih.iku)) {
              listPenilaianPegawaiIni[k].used = true; break;
            }
          }
          return { iki: pilih.iki, iku: pilih.iku };
        }
        // LVL 6: Final fallback - sisa 1 penilaian terpakai atau tidak, ambil itu
        if (sisaBelumTerpakai.length === 1) {
          sisaBelumTerpakai[0].used = true;
          return { iki: sisaBelumTerpakai[0].iki, iku: sisaBelumTerpakai[0].iku };
        }
        return { iki: '', iku: '' };
      };
      
      result.push({
        nip: nip,
        nama: nama,
        status: status,
        statusVerif: statusVerif,
        jabatanUtama: juJabatan,
        jabatanTambahan1: jt1Jabatan,
        jabatanTambahan2: jt2Jabatan,
        ruanganUtama: juRuangan,
        ruanganT1: jt1Ruangan,
        ruanganT2: jt2Ruangan,
        pointIndividu: pointIndividu,
        pointIndividuT1: pointIndividuT1,
        pointIndividuT2: pointIndividuT2,
        detail: detailItems,
        detailT1: detailT1,
        detailT2: detailT2,
        nilaiUtama: getNilai(nip, juJabatan),
        nilaiT1: getNilai(nip, jt1Jabatan),
        nilaiT2: getNilai(nip, jt2Jabatan)
      });
    }
    
    const hasil = { success: true, data: result, periodeBulan: bulan || '', periodeTahun: tahun || '' };
    
    if (simpanDetail && result.length > 0) {
      simpanDetailPerhitungan(hasil);
    }
    
    return hasil;
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function createRecord(tableName, rowData) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(tableName);
  
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan.' };
  
  sheet.appendRow(rowData);
  return { success: true, message: 'Data berhasil ditambahkan.' };
}

function updateRecord(tableName, rowIndex, rowData) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(tableName);
  
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan.' };
  
  // rowIndex + 2 karena array dari 0, data sheet mulai baris 2 (baris 1 header)
  sheet.getRange(rowIndex + 2, 1, 1, rowData.length).setValues([rowData]);
  return { success: true, message: 'Data berhasil diupdate.' };
}

function deleteRecord(tableName, rowIndex) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(tableName);
  
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan.' };
  
  sheet.deleteRow(rowIndex + 2);
  return { success: true, message: 'Data berhasil dihapus.' };
}

// ==========================================
// PENILAIAN KINERJA (ADMIN & PENILAI)
// ==========================================

function getFormMappingOptions() {
  try {
    const ss = getSpreadsheet();
    
    // Get Penilai list from user table
    const userSheet = ss.getSheetByName('user');
    let penilaiList = [];
    if (userSheet) {
      const userData = userSheet.getDataRange().getValues();
      const statusIdx = userData[0].indexOf('Status');
      const nipIdx = userData[0].indexOf('NIP');
      const namaIdx = userData[0].indexOf('Nama');
      
      if (statusIdx !== -1 && nipIdx !== -1 && namaIdx !== -1) {
        for(let i = 1; i < userData.length; i++) {
          if(userData[i][statusIdx] === 'Penilai') {
            penilaiList.push({
              nip: userData[i][nipIdx],
              nama: userData[i][namaIdx]
            });
          }
        }
      }
    }
    
    // Get Pegawai list (only 'Disetujui') from data_pegawai
    const pegSheet = ss.getSheetByName('data_pegawai');
    let pegawaiList = [];
    if (pegSheet) {
      const data = pegSheet.getDataRange().getValues();
      const headers = data[0];
      const nipIdx = headers.indexOf('NIP');
      const namaIdx = headers.indexOf('Nama Pegawai');
      const statusVerifIdx = headers.indexOf('Status Verifikasi');
      
      const juJabIdx = headers.indexOf('JU - Nama Jabatan');
      const juRuangIdx = headers.indexOf('JU - Ruangan');
      const jt1JabIdx = headers.indexOf('JT1 - Nama Jabatan');
      const jt1RuangIdx = headers.indexOf('JT1 - Ruangan');
      const jt2JabIdx = headers.indexOf('JT2 - Nama Jabatan');
      const jt2RuangIdx = headers.indexOf('JT2 - Ruangan');
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][statusVerifIdx] === 'Disetujui') {
          let jabatanOptions = [];
          if(juJabIdx !== -1 && data[i][juJabIdx]) jabatanOptions.push({jabatan: data[i][juJabIdx], tipe: 'Utama', ruangan: data[i][juRuangIdx] || ''});
          if(jt1JabIdx !== -1 && data[i][jt1JabIdx]) jabatanOptions.push({jabatan: data[i][jt1JabIdx], tipe: 'Tambahan 1', ruangan: data[i][jt1RuangIdx] || ''});
          if(jt2JabIdx !== -1 && data[i][jt2JabIdx]) jabatanOptions.push({jabatan: data[i][jt2JabIdx], tipe: 'Tambahan 2', ruangan: data[i][jt2RuangIdx] || ''});
          
          pegawaiList.push({
            nip: data[i][nipIdx],
            nama: data[i][namaIdx],
            jabatans: jabatanOptions
          });
        }
      }
    }
    
    return { success: true, data: { penilai: penilaiList, pegawai: pegawaiList } };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function savePenilaiMapping(mappingData) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('penilai_mapping');
    const EXPECTED_HEADERS = ['NIP Penilai', 'Nama Penilai', 'Jabatan Penilai', 'NIP Yang Dinilai', 'Nama Yang Dinilai', 'Nama Ruangan', 'Jabatan Yang Dinilai'];
    if (!sheet) {
      sheet = ss.insertSheet('penilai_mapping');
      sheet.appendRow(EXPECTED_HEADERS);
      sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setFontWeight('bold').setBackground('#f1f5f9');
      sheet.setFrozenRows(1);
    } else {
      const raw = sheet.getDataRange().getValues();
      const existingHeaders = raw[0] || [];
      const hasJabPenilai = existingHeaders.some(h => String(h || '').trim() === 'Jabatan Penilai');
      if (!hasJabPenilai) {
        const newHeaders = EXPECTED_HEADERS.slice();
        const backup = raw.slice(1);
        sheet.clear();
        sheet.appendRow(newHeaders);
        sheet.getRange(1, 1, 1, newHeaders.length).setFontWeight('bold').setBackground('#f1f5f9');
        sheet.setFrozenRows(1);
        for (let r = 0; r < backup.length; r++) {
          const old = backup[r];
          const nP = old[0] || '';
          const naP = old[1] || '';
          const nD = old[2] || '';
          const naD = old[3] || '';
          const ru = old[4] || '';
          const jbD = old[5] || '';
          sheet.appendRow([nP, naP, '', nD, naD, ru, jbD]);
        }
      }
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    let row = [];
    headers.forEach(h => {
      const t = String(h || '').trim();
      if(t === 'NIP Penilai') row.push(mappingData.nipPenilai);
      else if(t === 'Nama Penilai') row.push(mappingData.namaPenilai);
      else if(t === 'Jabatan Penilai') row.push(mappingData.jabatanPenilai || '');
      else if(t === 'NIP Yang Dinilai') row.push(mappingData.nipDinilai);
      else if(t === 'Nama Yang Dinilai') row.push(mappingData.namaDinilai);
      else if(t === 'Nama Ruangan') row.push(mappingData.namaRuangan);
      else if(t === 'Jabatan Yang Dinilai') row.push(mappingData.jabatanDinilai);
      else row.push('');
    });

    // Jika rowId disertakan → mode update, jika tidak → append baru
    if (mappingData.rowId) {
      const sheetRow = mappingData.rowId + 1; // rowId 1-based + 1 untuk header
      sheet.getRange(sheetRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function getMappingList() {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('penilai_mapping');
    const EXPECTED_HEADERS = ['NIP Penilai', 'Nama Penilai', 'Jabatan Penilai', 'NIP Yang Dinilai', 'Nama Yang Dinilai', 'Nama Ruangan', 'Jabatan Yang Dinilai'];
    if (!sheet) {
      sheet = ss.insertSheet('penilai_mapping');
      sheet.appendRow(EXPECTED_HEADERS);
      sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setFontWeight('bold').setBackground('#f1f5f9');
      sheet.setFrozenRows(1);
    } else {
      const raw = sheet.getDataRange().getValues();
      const existingHeaders = raw[0] || [];
      const hasJabPenilai = existingHeaders.some(h => String(h || '').trim() === 'Jabatan Penilai');
      if (!hasJabPenilai) {
        const backup = raw.slice(1);
        sheet.clear();
        sheet.appendRow(EXPECTED_HEADERS);
        sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setFontWeight('bold').setBackground('#f1f5f9');
        sheet.setFrozenRows(1);
        for (let r = 0; r < backup.length; r++) {
          const old = backup[r];
          const nP = old[0] || '';
          const naP = old[1] || '';
          const nD = old[2] || '';
          const naD = old[3] || '';
          const ru = old[4] || '';
          const jbD = old[5] || '';
          sheet.appendRow([nP, naP, '', nD, naD, ru, jbD]);
        }
      }
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let result = [];
    for(let i = 1; i < data.length; i++) {
      let rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = data[i][idx];
      });
      rowObj.id = i; 
      result.push(rowObj);
    }
    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function getPengaturanPeriode() {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('pengaturan_penilaian');
    if (!sheet) {
      sheet = ss.insertSheet('pengaturan_penilaian');
      sheet.appendRow(['Bulan Penilaian', 'Tanggal Mulai', 'Tanggal Selesai', 'Status']);
      sheet.appendRow(['September 2026', '2026-09-01', '2026-09-30', 'Buka']);
    }
    const data = sheet.getDataRange().getValues();
    if(data[0].length === 3 || data[0][3] !== 'Status') {
       // Migrate header
       sheet.getRange(1, 1, 1, 4).setValues([['Bulan Penilaian', 'Tanggal Mulai', 'Tanggal Selesai', 'Status']]);
    }
    
    if(data.length > 1) {
      let rawBulan = data[1][0];
      let bulan = '';
      if (rawBulan instanceof Date) {
         const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
         bulan = monthNames[rawBulan.getMonth()] + ' ' + rawBulan.getFullYear();
      } else {
         bulan = String(rawBulan || '').trim();
         // Hilangkan apostrophe di awal jika terbawa
         if (bulan.startsWith("'")) bulan = bulan.substring(1);
      }
      
      const mulai = data[1][1];
      const selesai = data[1][2];
      const statusAdmin = String(data[1][3] || 'Tutup').trim();
      
      let status = 'Tutup';
      if(statusAdmin === 'Buka' && mulai && selesai) {
          const today = new Date();
          const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
          
          let mDate = (mulai instanceof Date) ? mulai : new Date(mulai);
          let sDate = (selesai instanceof Date) ? selesai : new Date(selesai);
          
          let mTime = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate()).getTime();
          let sTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime();
          
          if(t >= mTime && t <= sTime) {
              status = 'Buka';
          }
      }
      
      // Convert dates to string so they don't break JSON
      const mulaiStr = mulai instanceof Date ? Utilities.formatDate(mulai, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(mulai);
      const selesaiStr = selesai instanceof Date ? Utilities.formatDate(selesai, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(selesai);
      
      return { success: true, data: { bulan: bulan, status: status, statusAdmin: statusAdmin, mulaiTanggal: mulaiStr, sampaiTanggal: selesaiStr } };
    }
    return { success: true, data: { bulan: '', status: 'Tutup', statusAdmin: 'Tutup', mulaiTanggal: '', sampaiTanggal: '' } };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function savePengaturanPeriode(bulan, mulaiTanggal, sampaiTanggal, status) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('pengaturan_penilaian');
    if (!sheet) {
      sheet = ss.insertSheet('pengaturan_penilaian');
      sheet.appendRow(['Bulan Penilaian', 'Tanggal Mulai', 'Tanggal Selesai', 'Status']);
      sheet.appendRow(['September 2026', '2026-09-01', '2026-09-30', 'Buka']);
    }
    
    // Gunakan apostrophe (') di awal agar Google Sheets tidak mengubah "Agustus 2026" menjadi objek Date
    sheet.getRange(2, 1, 1, 4).setValues([["'" + bulan, mulaiTanggal, sampaiTanggal, status]]);
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function getDaftarDinilai(nipPenilai, bulan, tahun) {
  try {
    const pengaturan = getPengaturanPeriode();
    if(!pengaturan.success) throw new Error(pengaturan.message);
    
    // Kita tetap mengirim info apakah periode aktif sama dengan yang diminta
    const bulanReq = String(bulan || '').trim() + ' ' + String(tahun || '').trim();
    const isPeriodeAktif = (pengaturan.data.bulan === bulanReq && pengaturan.data.status === 'Buka');
    
    // Kirim infoRentang selalu agar UI bisa memberikan pesan error yang lebih jelas
    const infoRentang = {
        mulai: pengaturan.data.mulaiTanggal,
        sampai: pengaturan.data.sampaiTanggal,
        statusAdmin: pengaturan.data.statusAdmin,
        adminBulan: pengaturan.data.bulan,
        reqBulan: bulanReq,
        isBulanCocok: (pengaturan.data.bulan === bulanReq)
    };
  
    const ss = getSpreadsheet();
    
    const pkSheet = ss.getSheetByName('penilaian_kinerja');
    const pkData = pkSheet ? pkSheet.getDataRange().getValues() : [];
    let isDikirimAll = false;
    if(pkData.length > 1) {
      const hPk = pkData[0];
      const statusKirimIdx = hPk.indexOf('Status Pengiriman');
      const nipPenIdx = hPk.indexOf('NIP Penilai');
      const bIdx = hPk.indexOf('Bulan Penilaian');
      const tIdx = hPk.indexOf('Tahun Penilaian');
      
      for(let i=1; i<pkData.length; i++) {
        if (statusKirimIdx !== -1 && nipPenIdx !== -1) {
            if (String(pkData[i][nipPenIdx]).trim() === String(nipPenilai).trim() &&
                String(pkData[i][bIdx]).trim() === String(bulan || '').trim() &&
                String(pkData[i][tIdx]).trim() === String(tahun || '').trim() &&
                pkData[i][statusKirimIdx] === 'Dikirim') {
                isDikirimAll = true;
            }
        }
      }
    }

    let sheet = ss.getSheetByName('penilai_mapping');
    const EXPECTED_HEADERS_PM = ['NIP Penilai', 'Nama Penilai', 'Jabatan Penilai', 'NIP Yang Dinilai', 'Nama Yang Dinilai', 'Nama Ruangan', 'Jabatan Yang Dinilai'];
    if (!sheet) {
      sheet = ss.insertSheet('penilai_mapping');
      sheet.appendRow(EXPECTED_HEADERS_PM);
      sheet.getRange(1, 1, 1, EXPECTED_HEADERS_PM.length).setFontWeight('bold').setBackground('#f1f5f9');
      sheet.setFrozenRows(1);
    } else {
      const raw = sheet.getDataRange().getValues();
      const existingHeaders = raw[0] || [];
      const hasJabPenilai = existingHeaders.some(h => String(h || '').trim() === 'Jabatan Penilai');
      if (!hasJabPenilai) {
        const backup = raw.slice(1);
        sheet.clear();
        sheet.appendRow(EXPECTED_HEADERS_PM);
        sheet.getRange(1, 1, 1, EXPECTED_HEADERS_PM.length).setFontWeight('bold').setBackground('#f1f5f9');
        sheet.setFrozenRows(1);
        for (let r = 0; r < backup.length; r++) {
          const old = backup[r];
          const nP = old[0] || '';
          const naP = old[1] || '';
          const nD = old[2] || '';
          const naD = old[3] || '';
          const ru = old[4] || '';
          const jbD = old[5] || '';
          sheet.appendRow([nP, naP, '', nD, naD, ru, jbD]);
        }
      }
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const nipIdx = headers.indexOf('NIP Penilai');
    
    let result = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][nipIdx] == nipPenilai) {
        let rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = data[i][idx];
        });
        
        if(rowObj['Jabatan Penilai'] === undefined || rowObj['Jabatan Penilai'] === null) rowObj['Jabatan Penilai'] = '';

        // Cek apakah sudah dinilai pada bulan dan tahun tersebut
        const nilaiData = checkSudahDinilai(ss, nipPenilai, rowObj['NIP Yang Dinilai'], bulan, tahun, rowObj['Jabatan Yang Dinilai']);
        if(nilaiData) {
          rowObj.sudahDinilai = true;
          rowObj.tanggalPenilaian = nilaiData.tanggal;
          rowObj.iki = nilaiData.iki;
          rowObj.iku = nilaiData.iku;
          rowObj.sudahDikirim = nilaiData.sudahDikirim || false;
          rowObj.detailIsian = nilaiData.detailIsian || {};
          if(nilaiData.jabatanDinilai) {
            rowObj['Jabatan Yang Dinilai'] = nilaiData.jabatanDinilai;
          }
          if(nilaiData.jabatanPenilai && (!rowObj['Jabatan Penilai'] || String(rowObj['Jabatan Penilai']).trim() === '')) {
            rowObj['Jabatan Penilai'] = nilaiData.jabatanPenilai;
          }
        } else {
          rowObj.sudahDinilai = false;
          rowObj.tanggalPenilaian = '-';
          rowObj.iki = '-';
          rowObj.iku = '-';
          rowObj.sudahDikirim = false;
          rowObj.detailIsian = {};
        }
        
        result.push(rowObj);
      }
    }
    
    return { 
      success: true, 
      data: result, 
      isPeriodeAktif: isPeriodeAktif, 
      infoRentang: infoRentang,
      isDikirim: isDikirimAll
    };
  } catch(e) {
    return { success: false, message: e.message };
  }
}

function checkSudahDinilai(ss, nipPenilai, nipDinilai, bulan, tahun, jabatanDinilai = null) {
  const pkSheet = ss.getSheetByName('penilaian_kinerja');
  if(!pkSheet) return null;
  const pkData = pkSheet.getDataRange().getValues();
  const idIdx = pkData[0].indexOf('ID Penilaian');
  const tglInputIdx = pkData[0].indexOf('Tanggal Input');
  const ikiIdx = pkData[0].indexOf('Indikator Kinerja Individu (IKI)');
  const ikuIdx = pkData[0].indexOf('Indikator Kinerja Unit (IKU)');
  const statusKirimIdx = pkData[0].indexOf('Status Pengiriman');
  const nipDinilaiIdx = pkData[0].indexOf('NIP Yang Dinilai');
  const jabatanDinilaiIdx = pkData[0].indexOf('Jabatan Yang Dinilai');
  const bulanIdx = pkData[0].indexOf('Bulan Penilaian');
  const tahunIdx = pkData[0].indexOf('Tahun Penilaian');
  const nipPenilaiIdx = pkData[0].indexOf('NIP Penilai');
  const jabatanPenilaiIdx = pkData[0].indexOf('Jabatan Penilai');

  const kehIdx = pkData[0].indexOf('Kehadiran/Keberadaan');
  const perIdx = pkData[0].indexOf('Perilaku kerja');
  const tjIdx = pkData[0].indexOf('Tanggung jawab peran');
  const kwIdx = pkData[0].indexOf('Ketepatan waktu');
  const kuIdx = pkData[0].indexOf('Kualitas pekerjaan');
  const inIdx = pkData[0].indexOf('Inisiatif dan inovasi');
  const ksIdx = pkData[0].indexOf('Kerja sama tim');
  const ekIdx = pkData[0].indexOf('Pengisian Ekinerja dan Esakip');
  const ikiKatIdx = pkData[0].indexOf('Kategori IKI');
  const ikuKatIdx = pkData[0].indexOf('Kategori IKU');
  
  if(idIdx === -1) return null;
  
  const targetId = nipPenilai + '_' + nipDinilai + '_' + bulan + '_' + tahun;
  
  const sNipPenilai = String(nipPenilai || '').trim();
  const sNipDinilai = String(nipDinilai || '').trim();
  const sBulan = String(bulan || '').trim();
  const sTahun = String(tahun || '').trim();
  const sJabatanDinilai = jabatanDinilai ? String(jabatanDinilai || '').trim() : null;

  for (let i = 1; i < pkData.length; i++) {
    let match = false;
    if (pkData[i][idIdx] && String(pkData[i][idIdx]).trim() === targetId) match = true;
    
    if (!match) {
      let matchNipPenilai = (nipPenilaiIdx === -1) ? false : (String(pkData[i][nipPenilaiIdx] || '').trim() === sNipPenilai);
      let matchNipDinilai = (nipDinilaiIdx === -1) ? false : (String(pkData[i][nipDinilaiIdx] || '').trim() === sNipDinilai);
      let matchBulan = (bulanIdx === -1) ? false : (String(pkData[i][bulanIdx] || '').trim() === sBulan);
      let matchTahun = (tahunIdx === -1) ? false : (String(pkData[i][tahunIdx] || '').trim() === sTahun);
      let matchJabatan = true;
      if (sJabatanDinilai && jabatanDinilaiIdx !== -1) {
        let rowJab = String(pkData[i][jabatanDinilaiIdx] || '').trim();
        matchJabatan = (rowJab === sJabatanDinilai);
      }
      if (matchNipPenilai && matchNipDinilai && matchBulan && matchTahun && matchJabatan) match = true;
    }

    if (match) {
      const detailIsian = {};
      if(kehIdx !== -1) detailIsian.kehadiran = pkData[i][kehIdx];
      if(perIdx !== -1) detailIsian.perilaku = pkData[i][perIdx];
      if(tjIdx !== -1) detailIsian.tanggungJawab = pkData[i][tjIdx];
      if(kwIdx !== -1) detailIsian.ketepatanWaktu = pkData[i][kwIdx];
      if(kuIdx !== -1) detailIsian.kualitas = pkData[i][kuIdx];
      if(inIdx !== -1) detailIsian.inisiatif = pkData[i][inIdx];
      if(ksIdx !== -1) detailIsian.kerjaSama = pkData[i][ksIdx];
      if(ekIdx !== -1) detailIsian.ekinerja = pkData[i][ekIdx];
      if(ikiKatIdx !== -1) detailIsian.ikiKategori = pkData[i][ikiKatIdx] || '';
      if(ikuKatIdx !== -1) detailIsian.ikuKategori = pkData[i][ikuKatIdx] || '';

      return {
        tanggal: pkData[i][tglInputIdx] instanceof Date ? pkData[i][tglInputIdx].toLocaleDateString('id-ID') : pkData[i][tglInputIdx],
        iki: pkData[i][ikiIdx] || '-',
        iku: pkData[i][ikuIdx] || '-',
        sudahDikirim: statusKirimIdx !== -1 && pkData[i][statusKirimIdx] === 'Dikirim',
        detailIsian: detailIsian,
        jabatanDinilai: (jabatanDinilaiIdx !== -1) ? (pkData[i][jabatanDinilaiIdx] || '') : (sJabatanDinilai || ''),
        jabatanPenilai: (jabatanPenilaiIdx !== -1) ? (pkData[i][jabatanPenilaiIdx] || '') : ''
      };
    }
  }
  return null;
}

function savePenilaianKinerja(payload) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('penilaian_kinerja');
    if (!sheet) return { success: false, message: 'Tabel penilaian_kinerja tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Check if exists to update, else append
    let rowIndex = -1;
    const idIdx = headers.indexOf('ID Penilaian');
    const nipDinilaiIdx = headers.indexOf('NIP Yang Dinilai');
    const jabatanDinilaiIdx = headers.indexOf('Jabatan Yang Dinilai');
    const nipPenilaiIdx = headers.indexOf('NIP Penilai');
    const bulanIdx = headers.indexOf('Bulan Penilaian');
    const tahunIdx = headers.indexOf('Tahun Penilaian');

    const sNipPenilai = String(payload.nipPenilai || '').trim();
    const sNipDinilai = String(payload.nipDinilai || '').trim();
    const sBulan = String(payload.bulan || '').trim();
    const sTahun = String(payload.tahun || '').trim();
    const sJabatanDinilai = String(payload.jabatanDinilai || '').trim();

    if(idIdx !== -1) {
      for (let i = 1; i < data.length; i++) {
        let idRow = String(data[i][idIdx] || '').trim();
        let hasJabInId = idRow.split('_').length === 5;
        let match = false;
        if (hasJabInId) {
          // New format ID: penilai_dinilai_jabatan_bulan_tahun
          const p = idRow.split('_');
          if (p[0] === sNipPenilai && p[1] === sNipDinilai && p[2] === sBulan && p[3] === sTahun) {
            // Cocokkan jabatan dinilai juga
            let jab = String(data[i][jabatanDinilaiIdx] || '').trim();
            if (!jab || !sJabatanDinilai || jab === sJabatanDinilai) match = true;
          }
        } else {
          // Old format ID: penilai_dinilai_bulan_tahun
          if (idRow === (sNipPenilai + '_' + sNipDinilai + '_' + sBulan + '_' + sTahun)) {
            let jab = String(data[i][jabatanDinilaiIdx] || '').trim();
            if (!jab || !sJabatanDinilai || jab === sJabatanDinilai) match = true;
          }
        }
        // Fallback match kolom langsung (lebih aman)
        if (!match) {
          let m1 = (nipPenilaiIdx === -1) ? false : (String(data[i][nipPenilaiIdx] || '').trim() === sNipPenilai);
          let m2 = (nipDinilaiIdx === -1) ? false : (String(data[i][nipDinilaiIdx] || '').trim() === sNipDinilai);
          let m3 = (bulanIdx === -1) ? false : (String(data[i][bulanIdx] || '').trim() === sBulan);
          let m4 = (tahunIdx === -1) ? false : (String(data[i][tahunIdx] || '').trim() === sTahun);
          let m5 = true;
          if (jabatanDinilaiIdx !== -1 && sJabatanDinilai) {
            let jabRow = String(data[i][jabatanDinilaiIdx] || '').trim();
            if (jabRow && jabRow !== sJabatanDinilai) m5 = false;
          }
          if (m1 && m2 && m3 && m4 && m5) match = true;
        }
        if (match) { rowIndex = i + 1; break; }
      }
    }
    
    let rowValues = [];
    headers.forEach(h => {
      let val = '';
      if(h === 'ID Penilaian') {
        // ID Barengin jabatan dinilai biar unik per slot jabatan
        if (sJabatanDinilai) {
          val = sNipPenilai + '_' + sNipDinilai + '_' + sJabatanDinilai + '_' + sBulan + '_' + sTahun;
        } else {
          val = sNipPenilai + '_' + sNipDinilai + '_' + sBulan + '_' + sTahun;
        }
      }
      else if(h === 'Tanggal Input') val = new Date();
      else if(h === 'Bulan Penilaian') val = payload.bulan;
      else if(h === 'Tahun Penilaian') val = payload.tahun;
      else if(h === 'NIP Penilai') val = payload.nipPenilai;
      else if(h === 'Nama Penilai') val = payload.namaPenilai;
      else if(h === 'Jabatan Penilai') val = payload.jabatanPenilai;
      else if(h === 'NIP Yang Dinilai') val = payload.nipDinilai;
      else if(h === 'Nama Yang Dinilai') val = payload.namaDinilai;
      else if(h === 'Jabatan Yang Dinilai') val = payload.jabatanDinilai;
      else if(h === 'Kehadiran/Keberadaan') val = payload.kehadiran;
      else if(h === 'Perilaku kerja') val = payload.perilaku;
      else if(h === 'Tanggung jawab peran') val = payload.tanggungJawab;
      else if(h === 'Ketepatan waktu') val = payload.ketepatanWaktu;
      else if(h === 'Kualitas pekerjaan') val = payload.kualitas;
      else if(h === 'Inisiatif dan inovasi') val = payload.inisiatif;
      else if(h === 'Kerja sama tim') val = payload.kerjaSama;
      else if(h === 'Pengisian Ekinerja dan Esakip') val = payload.ekinerja;
      else if(h === 'Indikator Kinerja Individu (IKI)') val = payload.ikiTotal;
      else if(h === 'Kategori IKI') val = payload.ikiKategori;
      else if(h === 'Indikator Kinerja Unit (IKU)') val = payload.ikuTotal;
      else if(h === 'Kategori IKU') val = payload.ikuKategori;
      else if(h === 'Status Pengiriman') {
        val = (rowIndex !== -1) ? data[rowIndex - 1][headers.indexOf(h)] : '';
      }
      
      rowValues.push(val);
    });
    
    if (rowIndex !== -1) {
      // Overwrite existing (re-evaluated)
      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }
    
    return { success: true };
  } catch(e) {
    return { success: false, message: e.message };
  }
}
function kirimDataPenilai(nipPenilai, bulan, tahun) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('penilaian_kinerja');
    if (!sheet) return { success: false, message: 'Sheet penilaian_kinerja tidak ditemukan' };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    let statusKirimIdx = headers.indexOf('Status Pengiriman');
    if (statusKirimIdx === -1) {
        statusKirimIdx = headers.length;
        sheet.getRange(1, headers.length + 1).setValue('Status Pengiriman');
        sheet.getRange(1, headers.length + 1).setFontWeight('bold').setBackground('#e0e0e0');
    }
    
    const idIdx = headers.indexOf('ID Penilaian');
    const nipPenilaiIdx = headers.indexOf('NIP Penilai');
    const bulanIdx = headers.indexOf('Bulan Penilaian');
    const tahunIdx = headers.indexOf('Tahun Penilaian');
    
    const sNipPenilai = String(nipPenilai || '').trim();
    const sBulan = String(bulan || '').trim();
    const sTahun = String(tahun || '').trim();

    let updated = 0;
    for (let i = 1; i < data.length; i++) {
        let match = false;
        // Cara 1: ID match, suport 4-part atau 5-part (yg mengandung jabatan)
        if (idIdx !== -1) {
            const idVal = String(data[i][idIdx] || '');
            const parts = idVal.split('_');
            if (parts.length >= 4) {
                let pBulan = parts[parts.length - 2];
                let pTahun = parts[parts.length - 1];
                let pPenilai = parts[0];
                if (pPenilai === sNipPenilai && pBulan === sBulan && pTahun === sTahun) match = true;
            }
        }
        // Cara 2: match via kolom langsung (lebih aman)
        if (!match) {
            let m1 = (nipPenilaiIdx === -1) ? false : (String(data[i][nipPenilaiIdx] || '').trim() === sNipPenilai);
            let m2 = (bulanIdx === -1) ? false : (String(data[i][bulanIdx] || '').trim() === sBulan);
            let m3 = (tahunIdx === -1) ? false : (String(data[i][tahunIdx] || '').trim() === sTahun);
            if (m1 && m2 && m3) match = true;
        }
        if (match) {
            sheet.getRange(i + 1, statusKirimIdx + 1).setValue('Dikirim');
            updated++;
        }
    }
    
    return { success: true, updated: updated };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

// ==========================================
// PEGAWAI - LIhat Detail Penilaian Kinerja
// ==========================================
function getPenilaianKinerjaPegawai(nipDinilai, bulan, tahun) {
  try {
    const ss = getSpreadsheet();
    const pkSheet = ss.getSheetByName('penilaian_kinerja');
    if (!pkSheet) return { success: true, data: [] };
    const pkData = pkSheet.getDataRange().getValues();
    if (pkData.length <= 1) return { success: true, data: [] };

    const h = pkData[0];
    const idIdx = h.indexOf('ID Penilaian');
    const tglInputIdx = h.indexOf('Tanggal Input');
    const nipPenilaiIdx = h.indexOf('NIP Penilai');
    const namaPenilaiIdx = h.indexOf('Nama Penilai');
    const jabatanPenilaiIdx = h.indexOf('Jabatan Penilai');
    const nipDinilaiIdx = h.indexOf('NIP Yang Dinilai');
    const namaDinilaiIdx = h.indexOf('Nama Yang Dinilai');
    const jabatanDinilaiIdx = h.indexOf('Jabatan Yang Dinilai');
    const bulanIdx = h.indexOf('Bulan Penilaian');
    const tahunIdx = h.indexOf('Tahun Penilaian');

    const kehIdx = h.indexOf('Kehadiran/Keberadaan');
    const perIdx = h.indexOf('Perilaku kerja');
    const tjIdx = h.indexOf('Tanggung jawab peran');
    const kwIdx = h.indexOf('Ketepatan waktu');
    const kuIdx = h.indexOf('Kualitas pekerjaan');
    const inIdx = h.indexOf('Inisiatif dan inovasi');
    const ksIdx = h.indexOf('Kerja sama tim');
    const ekIdx = h.indexOf('Pengisian Ekinerja dan Esakip');
    const ikiIdx = h.indexOf('Indikator Kinerja Individu (IKI)');
    const ikuIdx = h.indexOf('Indikator Kinerja Unit (IKU)');
    const ikiKatIdx = h.indexOf('Kategori IKI');
    const ikuKatIdx = h.indexOf('Kategori IKU');
    const statusKirimIdx = h.indexOf('Status Pengiriman');

    const sNip = String(nipDinilai || '').trim();
    const sBulan = bulan ? String(bulan).trim() : '';
    const sTahun = tahun ? String(tahun).trim() : '';

    const result = [];
    for (let i = 1; i < pkData.length; i++) {
      let rowNip = (nipDinilaiIdx === -1) ? '' : String(pkData[i][nipDinilaiIdx] || '').trim();
      if (rowNip !== sNip) continue;

      // Try fallback dari ID (jika NIP Yang Dinilai blank)
      if (!rowNip && idIdx !== -1) {
        const idVal = String(pkData[i][idIdx] || '');
        const parts = idVal.split('_');
        if (parts.length >= 4) {
          rowNip = parts[1];
        }
      }
      if (rowNip !== sNip) continue;

      let rowBulan = (bulanIdx === -1) ? '' : String(pkData[i][bulanIdx] || '').trim();
      let rowTahun = (tahunIdx === -1) ? '' : String(pkData[i][tahunIdx] || '').trim();
      if (!rowBulan && idIdx !== -1) {
        const parts = String(pkData[i][idIdx] || '').split('_');
        if (parts.length >= 4) {
          rowBulan = parts[parts.length - 2];
          rowTahun = parts[parts.length - 1];
        }
      }

      if (sBulan && rowBulan !== sBulan) continue;
      if (sTahun && rowTahun !== sTahun) continue;

      const item = {
        idPenilaian: (idIdx !== -1) ? (pkData[i][idIdx] || '') : '',
        tanggalInput: (tglInputIdx !== -1) ? 
          (pkData[i][tglInputIdx] instanceof Date ? pkData[i][tglInputIdx].toLocaleDateString('id-ID') : pkData[i][tglInputIdx]) : '',
        nipPenilai: (nipPenilaiIdx !== -1) ? (pkData[i][nipPenilaiIdx] || '') : '',
        namaPenilai: (namaPenilaiIdx !== -1) ? (pkData[i][namaPenilaiIdx] || '') : '',
        jabatanPenilai: (jabatanPenilaiIdx !== -1) ? (pkData[i][jabatanPenilaiIdx] || '') : '',
        nipDinilai: rowNip,
        namaDinilai: (namaDinilaiIdx !== -1) ? (pkData[i][namaDinilaiIdx] || '') : '',
        jabatanDinilai: (jabatanDinilaiIdx !== -1) ? (pkData[i][jabatanDinilaiIdx] || '') : '',
        bulanPenilaian: rowBulan,
        tahunPenilaian: rowTahun,
        isian: {
          kehadiran: (kehIdx !== -1) ? (pkData[i][kehIdx] !== undefined && pkData[i][kehIdx] !== '') : false ? pkData[i][kehIdx] : null,
          perilaku: (perIdx !== -1) ? (pkData[i][perIdx] !== undefined && pkData[i][perIdx] !== '') : false ? pkData[i][perIdx] : null,
          tanggungJawab: (tjIdx !== -1) ? (pkData[i][tjIdx] !== undefined && pkData[i][tjIdx] !== '') : false ? pkData[i][tjIdx] : null,
          ketepatanWaktu: (kwIdx !== -1) ? (pkData[i][kwIdx] !== undefined && pkData[i][kwIdx] !== '') : false ? pkData[i][kwIdx] : null,
          kualitas: (kuIdx !== -1) ? (pkData[i][kuIdx] !== undefined && pkData[i][kuIdx] !== '') : false ? pkData[i][kuIdx] : null,
          inisiatif: (inIdx !== -1) ? (pkData[i][inIdx] !== undefined && pkData[i][inIdx] !== '') : false ? pkData[i][inIdx] : null,
          kerjaSama: (ksIdx !== -1) ? (pkData[i][ksIdx] !== undefined && pkData[i][ksIdx] !== '') : false ? pkData[i][ksIdx] : null,
          ekinerja: (ekIdx !== -1) ? (pkData[i][ekIdx] !== undefined && pkData[i][ekIdx] !== '') : false ? pkData[i][ekIdx] : null,
        },
        iki: (ikiIdx !== -1) ? (pkData[i][ikiIdx] || '') : '',
        iku: (ikuIdx !== -1) ? (pkData[i][ikuIdx] || '') : '',
        kategoriIki: (ikiKatIdx !== -1) ? (pkData[i][ikiKatIdx] || '') : '',
        kategoriIku: (ikuKatIdx !== -1) ? (pkData[i][ikuKatIdx] || '') : '',
        statusPengiriman: (statusKirimIdx !== -1) ? (pkData[i][statusKirimIdx] || 'Belum Dikirim') : 'Belum Dikirim'
      };

      // pastikan isian punya value (bukan null)
      const isianMap = [
        ['kehadiran', kehIdx],
        ['perilaku', perIdx],
        ['tanggungJawab', tjIdx],
        ['ketepatanWaktu', kwIdx],
        ['kualitas', kuIdx],
        ['inisiatif', inIdx],
        ['kerjaSama', ksIdx],
        ['ekinerja', ekIdx]
      ];
      isianMap.forEach(([k, idx]) => {
        if (idx !== -1) {
          const v = pkData[i][idx];
          item.isian[k] = (v === undefined || v === null || v === '') ? null : v;
        } else {
          item.isian[k] = null;
        }
      });

      result.push(item);
    }

    result.sort((a, b) => {
      const ja = String(a.jabatanDinilai || '');
      const jb = String(b.jabatanDinilai || '');
      return ja.localeCompare(jb, 'id');
    });

    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: e.message, data: [] };
  }
}

// ==========================================
// DETAIL PERHITUNGAN POINT - SHEET BARU (WIDE FORMAT)
// ==========================================
// WIDE FORMAT: 1 pegawai = 1 baris (per tipe jabatan )
// Layout per tipe jabatan ada 6 objek: Masa Kerja, Pendidikan&Relevansi, Resiko Kerja, Kegawatdaruratan, Posisi
// Setiap objek memiliki 4 sub-kolom: Uraian, Point, Maks, Hasil
function getDetailPerhitunganSheet() {
  const ss = getSpreadsheet();
  const OBJEK_LIST = [
    'Masa Kerja',
    'Pendidikan & Relevansi',
    'Resiko Kerja',
    'Kegawatdaruratan',
    'Posisi'
  ];
  const SUB_COL = ['Uraian', 'Point', 'Maks Point', 'Hasil'];
  const TIPE_JABATAN = ['Utama', 'Tambahan 1', 'Tambahan 2'];
  const staticHeaders = [
    'Periode Bulan',
    'Periode Tahun',
    'Waktu Generate',
    'NIP',
    'Nama Pegawai',
    'Status Pegawai',
    'Status Verifikasi'
  ];
  let headers = staticHeaders.slice();
  for (const tipe of TIPE_JABATAN) {
    headers.push(
      '[' + tipe + '] Nama Jabatan',
      '[' + tipe + '] Ruangan',
      '[' + tipe + '] Total Point',
      '[' + tipe + '] IKI',
      '[' + tipe + '] IKU'
    );
    for (const obj of OBJEK_LIST) {
      for (const sub of SUB_COL) {
        headers.push('[' + tipe + '] ' + obj + ' - ' + sub);
      }
    }
  }
  const WIDE_MARKER = '[Utama] Nama Jabatan';
  const LONG_MARKERS = ['Objek Penilaian', 'Uraian Point', 'Poin/Maks', '% Rate/Bobot'];

  function applyWideFormat(sheet) {
    sheet.clear();
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(7);
    sheet.autoResizeColumns(1, Math.min(headers.length, 20));
  }

  let sheet = ss.getSheetByName('detail_perhitungan_point');
  if (!sheet) {
    sheet = ss.insertSheet('detail_perhitungan_point');
    applyWideFormat(sheet);
    return sheet;
  }

  const existingHeader = sheet.getLastColumn() > 0 && sheet.getLastRow() >= 1
    ? sheet.getRange(1, 1, 1, Math.min(sheet.getLastColumn(), 50)).getValues()[0].map(String)
    : [];

  const hasWide = existingHeader.some(h => h && h.includes(WIDE_MARKER));
  if (hasWide) {
    return sheet;
  }

  const isLongFormat = existingHeader.some(h => {
    const t = String(h || '').trim();
    return LONG_MARKERS.some(m => t.includes(m));
  });

  if (isLongFormat || existingHeader.length < 3 || (existingHeader.length > 0 && existingHeader.length < headers.length / 2)) {
    applyWideFormat(sheet);
  } else if (existingHeader.length === 0) {
    applyWideFormat(sheet);
  }

  return sheet;
}

function simpanDetailPerhitungan(perhitunganData) {
  try {
    const sheet = getDetailPerhitunganSheet();
    const periodeBulan = perhitunganData.periodeBulan || '';
    const periodeTahun = perhitunganData.periodeTahun || '';
    const waktuGenerate = new Date();
    const data = perhitunganData.data || [];

    const OBJEK_URUTAN = [
      'Masa Kerja',
      'Pendidikan dan Relevansi',
      'Resiko Kerja',
      'Kegawatdaruratan',
      'Posisi'
    ];

    if (periodeBulan && periodeTahun) {
      const existingData = sheet.getDataRange().getValues();
      const bulanIdx = 0;
      const tahunIdx = 1;
      const rowsToDelete = [];
      for (let i = 1; i < existingData.length; i++) {
        if (String(existingData[i][bulanIdx]).trim() === String(periodeBulan).trim() &&
            String(existingData[i][tahunIdx]).trim() === String(periodeTahun).trim()) {
          rowsToDelete.push(i + 1);
        }
      }
      for (let i = rowsToDelete.length - 1; i >= 0; i--) {
        sheet.deleteRow(rowsToDelete[i]);
      }
    }

    const allRows = [];

    const buildObjekMap = (detailArr) => {
      const map = {};
      for (const item of (detailArr || [])) {
        if (!item || !item.objek) continue;
        map[String(item.objek).trim()] = item;
      }
      return map;
    };

    const tipeConfigs = [
      {
        tipe: 'Utama',
        namaJabatan: (peg) => peg.jabatanUtama || '',
        ruangan: (peg) => peg.ruanganUtama || '',
        detail: (peg) => peg.detail || [],
        totalPoint: (peg) => peg.pointIndividu || 0,
        nilai: (peg) => peg.nilaiUtama || { iki: '', iku: '' }
      },
      {
        tipe: 'Tambahan 1',
        namaJabatan: (peg) => peg.jabatanTambahan1 || '',
        ruangan: (peg) => peg.ruanganT1 || '',
        detail: (peg) => peg.detailT1 || [],
        totalPoint: (peg) => peg.pointIndividuT1 || 0,
        nilai: (peg) => peg.nilaiT1 || { iki: '', iku: '' }
      },
      {
        tipe: 'Tambahan 2',
        namaJabatan: (peg) => peg.jabatanTambahan2 || '',
        ruangan: (peg) => peg.ruanganT2 || '',
        detail: (peg) => peg.detailT2 || [],
        totalPoint: (peg) => peg.pointIndividuT2 || 0,
        nilai: (peg) => peg.nilaiT2 || { iki: '', iku: '' }
      }
    ];

    for (const peg of data) {
      const row = [
        periodeBulan,
        periodeTahun,
        waktuGenerate,
        peg.nip || '',
        peg.nama || '',
        peg.status || '',
        peg.statusVerif || ''
      ];

      for (const cfg of tipeConfigs) {
        const nmJab = cfg.namaJabatan(peg);
        const rng = cfg.ruangan(peg);
        const det = cfg.detail(peg);
        const tot = cfg.totalPoint(peg);
        const nl = cfg.nilai(peg);
        const objMap = buildObjekMap(det);
        const adaJabatan = nmJab && nmJab !== '-';

        row.push(
          adaJabatan ? nmJab : '',
          adaJabatan ? rng : '',
          adaJabatan ? tot : '',
          adaJabatan ? (nl.iki || '') : '',
          adaJabatan ? (nl.iku || '') : ''
        );

        for (const objKey of OBJEK_URUTAN) {
          const item = objMap[objKey];
          if (item) {
            row.push(
              item.uraian || '',
              item.point || 0,
              item.max || 0,
              item.hasil || 0
            );
          } else {
            row.push('', '', '', '');
          }
        }
      }

      allRows.push(row);
    }

    if (allRows.length > 0) {
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, allRows.length, allRows[0].length).setValues(allRows);
    }

    return { success: true, totalRows: allRows.length, message: 'Data detail perhitungan berhasil disimpan (wide format)' };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ==========================================
// MAPPING PENILAI — UPDATE & DELETE
// ==========================================

/**
 * Update satu baris di sheet penilai_mapping.
 * rowId = nilai rowObj.id yang dikembalikan getMappingList() (1-based index ke data, bukan baris sheet).
 * Baris sheet = rowId + 1 karena baris 1 adalah header.
 */
function updateMappingRecord(rowId, updatedData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('penilai_mapping');
    if (!sheet) return { success: false, message: 'Sheet penilai_mapping tidak ditemukan.' };

    const sheetRowNumber = rowId + 1; // rowId adalah index data (1-based), +1 untuk header
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    const rowValues = headers.map(h => {
      const t = String(h || '').trim();
      if (t === 'NIP Penilai')        return updatedData.nipPenilai        || '';
      if (t === 'Nama Penilai')       return updatedData.namaPenilai       || '';
      if (t === 'Jabatan Penilai')    return updatedData.jabatanPenilai    || '';
      if (t === 'NIP Yang Dinilai')   return updatedData.nipDinilai        || '';
      if (t === 'Nama Yang Dinilai')  return updatedData.namaDinilai       || '';
      if (t === 'Nama Ruangan')       return updatedData.namaRuangan       || '';
      if (t === 'Jabatan Yang Dinilai') return updatedData.jabatanDinilai  || '';
      return '';
    });

    sheet.getRange(sheetRowNumber, 1, 1, rowValues.length).setValues([rowValues]);
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

/**
 * Hapus satu baris di sheet penilai_mapping.
 * rowId = nilai rowObj.id (1-based index ke data array, bukan baris sheet).
 */
function deleteMappingRecord(rowId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('penilai_mapping');
    if (!sheet) return { success: false, message: 'Sheet penilai_mapping tidak ditemukan.' };

    const sheetRowNumber = rowId + 1; // +1 untuk header
    sheet.deleteRow(sheetRowNumber);
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
