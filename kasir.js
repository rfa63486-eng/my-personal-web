// Render Feather Icons
feather.replace();

// Clock Realtime
setInterval(() => {
    const now = new Date();
    document.getElementById("liveClock").innerText = now.toLocaleTimeString('id-ID');
}, 1000);

// Database Produk Simulasi
const daftarProduk = [
    { id: 1, nama: "Beras 5kg", harga: 68000, kategori: "Sembako" },
    { id: 2, nama: "Minyak Goreng 1L", harga: 18000, kategori: "Sembako" },
    { id: 3, nama: "Gula Pasir 1kg", harga: 15500, kategori: "Sembako" },
    { id: 4, nama: "Apel Fuji /kg", harga: 35000, kategori: "Buah" },
    { id: 5, nama: "Jeruk Sunkist /kg", harga: 28000, kategori: "Buah" },
    { id: 6, nama: "Bayam Organik", harga: 4500, kategori: "Sayur" },
    { id: 7, nama: "Wortel Segar /kg", harga: 12000, kategori: "Sayur" },
    { id: 8, nama: "Susu Kotak 1L", harga: 18500, kategori: "Minuman" },
    { id: 9, nama: "Air Mineral 600ml", harga: 3500, kategori: "Minuman" }
];

let keranjang = [];

// Render Produk ke Grid
function renderProduk(produkList = daftarProduk) {
    const grid = document.getElementById("gridProduk");
    grid.innerHTML = "";
    
    produkList.forEach(p => {
        grid.innerHTML += `
            <div onclick="tambahKeKeranjang(${p.id})" class="border border-slate-100 rounded-xl p-3 bg-slate-50 hover:bg-emerald-50/60 cursor-pointer hover:border-emerald-300 transition flex flex-col justify-between group">
                <div>
                    <span class="text-[10px] bg-slate-200 group-hover:bg-emerald-200 text-slate-600 group-hover:text-emerald-800 px-2 py-0.5 rounded-md font-medium">${p.kategori}</span>
                    <h3 class="font-bold text-slate-800 text-xs mt-1.5">${p.nama}</h3>
                </div>
                <div class="text-emerald-600 font-black text-xs mt-3">Rp ${p.harga.toLocaleString('id-ID')}</div>
            </div>
        `;
    });
}

// Fitur Filter (Search & Kategori)
function filterProduk() {
    const keyword = document.getElementById("searchBox").value.toLowerCase();
    const kategori = document.getElementById("categoryFilter").value;

    const hasilFilter = daftarProduk.filter(p => {
        const cocokNama = p.nama.toLowerCase().includes(keyword);
        const cocokKategori = (kategori === "all") || (p.kategori === kategori);
        return cocokNama && cocokKategori;
    });

    renderProduk(hasilFilter);
}

// Tambah Item ke Keranjang
function tambahKeKeranjang(id) {
    const produk = daftarProduk.find(p => p.id === id);
    const itemKeranjang = keranjang.find(k => k.id === id);

    if (itemKeranjang) {
        itemKeranjang.qty += 1;
    } else {
        keranjang.push({ ...produk, qty: 1 });
    }

    updateKeranjang();
}

// Ubah Jumlah Item
function ubahQty(id, delta) {
    const item = keranjang.find(k => k.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            keranjang = keranjang.filter(k => k.id !== id);
        }
    }
    updateKeranjang();
}

// Hapus Item
function hapusItem(id) {
    keranjang = keranjang.filter(k => k.id !== id);
    updateKeranjang();
}

// Reset Keranjang
function resetKeranjang() {
    keranjang = [];
    document.getElementById("bayar").value = "";
    updateKeranjang();
}

// Hitung Total & Render Keranjang
function updateKeranjang() {
    const tbody = document.getElementById("tabelKeranjang");
    tbody.innerHTML = "";

    let total = 0;

    keranjang.forEach(item => {
        const subtotal = item.harga * item.qty;
        total += subtotal;

        tbody.innerHTML += `
            <tr class="border-b border-slate-100">
                <td class="py-2 px-1 font-semibold text-slate-700">${item.nama}</td>
                <td class="py-2 text-center">
                    <button onclick="ubahQty(${item.id}, -1)" class="px-1.5 py-0.5 bg-slate-200 rounded font-bold">-</button>
                    <span class="mx-1 font-bold text-slate-800">${item.qty}</span>
                    <button onclick="ubahQty(${item.id}, 1)" class="px-1.5 py-0.5 bg-slate-200 rounded font-bold">+</button>
                </td>
                <td class="py-2 text-right font-bold text-slate-800">Rp ${subtotal.toLocaleString('id-ID')}</td>
                <td class="py-2 text-center">
                    <button onclick="hapusItem(${item.id})" class="text-red-500 font-bold hover:text-red-700">✕</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("subtotalHarga").innerText = "Rp " + total.toLocaleString('id-ID');
    document.getElementById("totalHarga").innerText = "Rp " + total.toLocaleString('id-ID');
    hitungKembalian();
}

// Hitung Kembalian
function hitungKembalian() {
    const total = keranjang.reduce((sum, i) => sum + (i.harga * i.qty), 0);
    const bayar = parseFloat(document.getElementById("bayar").value) || 0;
    const kembalian = bayar - total;

    const elKembalian = document.getElementById("kembalian");
    if (bayar === 0) {
        elKembalian.innerText = "Rp 0";
        elKembalian.className = "text-slate-800";
    } else if (kembalian >= 0) {
        elKembalian.innerText = "Rp " + kembalian.toLocaleString('id-ID');
        elKembalian.className = "text-emerald-600 font-bold";
    } else {
        elKembalian.innerText = "Kurang Rp " + Math.abs(kembalian).toLocaleString('id-ID');
        elKembalian.className = "text-red-500 font-bold";
    }
}

// Proses Pembayaran & Struk Simulation
function prosesBayar() {
    const total = keranjang.reduce((sum, i) => sum + (i.harga * i.qty), 0);
    const bayar = parseFloat(document.getElementById("bayar").value) || 0;

    if (keranjang.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }

    if (bayar < total) {
        alert("Jumlah uang pembayaran masih kurang!");
        return;
    }

    alert(`✅ Transaksi Berhasil!\nTotal: Rp ${total.toLocaleString('id-ID')}\nBayar: Rp ${bayar.toLocaleString('id-ID')}\nKembalian: Rp ${(bayar - total).toLocaleString('id-ID')}`);
    resetKeranjang();
}

// Init Tampilan Awal
renderProduk();