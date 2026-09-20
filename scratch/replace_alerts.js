const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalHTML = `
    <!-- Global Custom Modal -->
    <div id="customModalOverlay" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] hidden items-center justify-center p-4">
        <div id="customModalCard" class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-95 opacity-0 duration-200">
            <div class="flex items-center gap-3 mb-4" id="customModalHeader">
            </div>
            <p id="customModalMessage" class="text-slate-600 mb-6 text-sm"></p>
            <div class="flex justify-end gap-3" id="customModalActions">
            </div>
        </div>
    </div>
`;

const modalJS = `
        // --- CUSTOM MODAL ---
        function showCustomAlert(title, message, type = 'info') {
            return new Promise((resolve) => {
                const overlay = document.getElementById('customModalOverlay');
                const card = document.getElementById('customModalCard');
                
                document.getElementById('customModalMessage').innerText = message;
                
                let iconHtml = '';
                if(type === 'success') iconHtml = '<div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>';
                else if(type === 'error') iconHtml = '<div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>';
                else if(type === 'warning') iconHtml = '<div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>';
                else iconHtml = '<div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
                
                document.getElementById('customModalHeader').innerHTML = iconHtml + '<h3 class="text-lg font-bold text-slate-800">' + title + '</h3>';
                
                const btnOk = document.createElement('button');
                btnOk.className = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors w-full sm:w-auto";
                btnOk.innerText = "OK";
                btnOk.onclick = () => { closeCustomModal(); resolve(true); };
                
                const actions = document.getElementById('customModalActions');
                actions.innerHTML = '';
                actions.appendChild(btnOk);
                
                openCustomModal();
            });
        }

        function showCustomConfirm(title, message, type = 'warning') {
            return new Promise((resolve) => {
                const overlay = document.getElementById('customModalOverlay');
                const card = document.getElementById('customModalCard');
                
                document.getElementById('customModalMessage').innerText = message;
                
                let iconHtml = '';
                if(type === 'error') iconHtml = '<div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>';
                else iconHtml = '<div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>';
                
                document.getElementById('customModalHeader').innerHTML = iconHtml + '<h3 class="text-lg font-bold text-slate-800">' + title + '</h3>';
                
                const btnCancel = document.createElement('button');
                btnCancel.className = "px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-lg transition-colors";
                btnCancel.innerText = "Batal";
                btnCancel.onclick = () => { closeCustomModal(); resolve(false); };
                
                const btnOk = document.createElement('button');
                btnOk.className = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors";
                btnOk.innerText = "Ya, Lanjutkan";
                if(type === 'error' || type === 'warning') btnOk.className = "px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors";
                btnOk.onclick = () => { closeCustomModal(); resolve(true); };
                
                const actions = document.getElementById('customModalActions');
                actions.innerHTML = '';
                actions.appendChild(btnCancel);
                actions.appendChild(btnOk);
                
                openCustomModal();
            });
        }
        
        function openCustomModal() {
            const overlay = document.getElementById('customModalOverlay');
            const card = document.getElementById('customModalCard');
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); }, 10);
        }
        
        function closeCustomModal() {
            const overlay = document.getElementById('customModalOverlay');
            const card = document.getElementById('customModalCard');
            card.classList.remove('scale-100', 'opacity-100');
            card.classList.add('scale-95', 'opacity-0');
            setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }, 200);
        }
`;

if (!html.includes('customModalOverlay')) {
    html = html.replace('</body>', modalHTML + '\n</body>');
    html = html.replace('<script>', '<script>\n' + modalJS);
    
    // Now replace alert() and confirm()
    // Helper to find and replace safely
    
    // 1. replace confirms that are simple 'if(confirm(...))' to 'if(await showCustomConfirm("Konfirmasi", ...))'
    // This requires adding 'async' to the function
    
    // Add async to onclick inline handlers if they have confirm
    html = html.replace(/onclick="setVerifikasiStatus\(/g, 'onclick="setVerifikasiStatus('); 
    // Wait, inline handlers in HTML don't need 'async' to use promises if we just call the function, but if we use await inside the function, the function definition needs 'async'.
    
    html = html.replace(/function setVerifikasiStatus/g, 'async function setVerifikasiStatus');
    html = html.replace(/function simpanDataPegawai/g, 'async function simpanDataPegawai');
    html = html.replace(/function deleteDataRow/g, 'async function deleteDataRow');
    
    html = html.replace(/confirm\('Apakah anda yakin akan mengirim data\? Data yang sudah dikirim tidak dapat diubah\.'\)/g, "await showCustomConfirm('Konfirmasi Pengiriman', 'Apakah anda yakin akan mengirim data? Data yang sudah dikirim tidak dapat diubah.', 'warning')");
    html = html.replace(/confirm\(\`Anda yakin ingin memberikan status "\$\{status\}" untuk NIP \$\{selectedVerifikasiNip\}\?\`\)/g, "await showCustomConfirm('Konfirmasi Status', `Anda yakin ingin memberikan status \"${status}\" untuk NIP ${selectedVerifikasiNip}?`, 'warning')");
    html = html.replace(/confirm\('Data ini akan dihapus secara permanen\. Lanjutkan\?'\)/g, "await showCustomConfirm('Konfirmasi Hapus', 'Data ini akan dihapus secara permanen. Lanjutkan?', 'error')");
    
    // Replaces for alerts:
    // Some are: return alert(...)
    html = html.replace(/alert\('Gagal mengambil data: ' \+ res\.message\)/g, "showCustomAlert('Gagal', 'Gagal mengambil data: ' + res.message, 'error')");
    html = html.replace(/alert\('Gagal memuat daftar verifikasi: ' \+ res\.message\)/g, "showCustomAlert('Gagal', 'Gagal memuat daftar verifikasi: ' + res.message, 'error')");
    html = html.replace(/alert\('Mohon masukkan alasan penolakan\.'\)/g, "showCustomAlert('Peringatan', 'Mohon masukkan alasan penolakan.', 'warning')");
    html = html.replace(/alert\('Gagal: ' \+ res\.message\)/g, "showCustomAlert('Gagal', 'Gagal: ' + res.message, 'error')");
    html = html.replace(/alert\('Error in dataRes handler: ' \+ e\.message \+ '\\nStack: ' \+ e\.stack\)/g, "showCustomAlert('Error', 'Error in dataRes handler: ' + e.message, 'error')");
    html = html.replace(/alert\('Server error fetching Pegawai Data: ' \+ err\.message\)/g, "showCustomAlert('Server Error', 'Server error fetching Pegawai Data: ' + err.message, 'error')");
    html = html.replace(/alert\('Gagal memuat opsi form: ' \+ res\.message\)/g, "showCustomAlert('Gagal', 'Gagal memuat opsi form: ' + res.message, 'error')");
    html = html.replace(/alert\('Error in res handler: ' \+ e\.message \+ '\\nStack: ' \+ e\.stack\)/g, "showCustomAlert('Error', 'Error in res handler: ' + e.message, 'error')");
    html = html.replace(/alert\('Server error fetching form options: ' \+ err\.message\)/g, "showCustomAlert('Server Error', 'Server error fetching form options: ' + err.message, 'error')");
    html = html.replace(/alert\('Error in populatePegawaiDropdowns: ' \+ e\.message \+ '\\nStack: ' \+ e\.stack\)/g, "showCustomAlert('Error', 'Error in populatePegawaiDropdowns: ' + e.message, 'error')");
    html = html.replace(/alert\('File harus berformat PDF\.'\)/g, "showCustomAlert('Peringatan', 'File harus berformat PDF.', 'warning')");
    html = html.replace(/alert\('Ukuran file maksimal 2 MB\.'\)/g, "showCustomAlert('Peringatan', 'Ukuran file maksimal 2 MB.', 'warning')");
    html = html.replace(/return alert\('Pilih status Pegawai!'\)/g, "return showCustomAlert('Peringatan', 'Pilih status Pegawai!', 'warning')");
    html = html.replace(/alert\('Gagal upload file: ' \+ res\.message\)/g, "showCustomAlert('Gagal', 'Gagal upload file: ' + res.message, 'error')");
    html = html.replace(/alert\(isFinal \? 'Data berhasil dikirim!' : 'Draf berhasil disimpan!'\)/g, "showCustomAlert('Sukses', isFinal ? 'Data berhasil dikirim!' : 'Draf berhasil disimpan!', 'success')");
    html = html.replace(/else alert\(res\.message\)/g, "else showCustomAlert('Informasi', res.message, 'info')");
    html = html.replace(/alert\(res\.error\)/g, "showCustomAlert('Error', res.error, 'error')");
    html = html.replace(/alert\(\`Kolom \$\{currentHeaders\[i\]\} wajib diisi\.\`\)/g, "showCustomAlert('Peringatan', `Kolom ${currentHeaders[i]} wajib diisi.`, 'warning')");
    html = html.replace(/alert\('Pengaturan periode berhasil disimpan!'\)/g, "showCustomAlert('Sukses', 'Pengaturan periode berhasil disimpan!', 'success')");
    html = html.replace(/return alert\('Pilih Penilai terlebih dahulu!'\)/g, "return showCustomAlert('Peringatan', 'Pilih Penilai terlebih dahulu!', 'warning')");
    html = html.replace(/return alert\('Pilih Pegawai Yang Dinilai!'\)/g, "return showCustomAlert('Peringatan', 'Pilih Pegawai Yang Dinilai!', 'warning')");
    html = html.replace(/return alert\('Pilih Jabatan Yang Dinilai!'\)/g, "return showCustomAlert('Peringatan', 'Pilih Jabatan Yang Dinilai!', 'warning')");
    html = html.replace(/return alert\('Penilai tidak dapat menilai dirinya sendiri!'\)/g, "return showCustomAlert('Peringatan', 'Penilai tidak dapat menilai dirinya sendiri!', 'warning')");
    html = html.replace(/alert\('Mapping berhasil disimpan!'\)/g, "showCustomAlert('Sukses', 'Mapping berhasil disimpan!', 'success')");
    html = html.replace(/return alert\('Harap isi semua 8 poin penilaian!'\)/g, "return showCustomAlert('Peringatan', 'Harap isi semua 8 poin penilaian!', 'warning')");
    html = html.replace(/return alert\('Harap isi nilai IKU!'\)/g, "return showCustomAlert('Peringatan', 'Harap isi nilai IKU!', 'warning')");
    html = html.replace(/alert\('Penilaian berhasil disimpan!'\)/g, "showCustomAlert('Sukses', 'Penilaian berhasil disimpan!', 'success')");
    
    fs.writeFileSync('index.html', html);
    console.log('Modal HTML and JS injected, alerts replaced.');
} else {
    console.log('Modal already exists.');
}
