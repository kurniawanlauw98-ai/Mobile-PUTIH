@echo off
echo ===========================================
echo Menjalankan Frontend Universitas Terbuka
echo ===========================================
echo PASTIKAN NODE.JS SUDAH TERINSTALL DI KOMPUTER INI!
echo Jika tida, proses ini akan tertutup otomatis/gagal.
echo.
echo Sedang menginstal dependensi (Bisa memakan waktu beberapa menit)...
cd frontend
call npm install
echo.
echo Membuka browser dan menjalankan server Frontend...
call npm run dev
pause
