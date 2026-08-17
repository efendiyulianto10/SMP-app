async function loadCabang(){
const {data,error}=await supabaseClient.from("cabang").select("*");
if(error){console.error("Gagal memuat cabang:",error);document.getElementById("cabang_id").innerHTML="<option value=\"\">Gagal memuat cabang</option>";return;}
document.getElementById("cabang_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama_cabang}</option>`).join("");
}
async function loadProduk(){
const {data,error}=await supabaseClient.from("produk").select("*");
if(error){console.error("Gagal memuat produk:",error);document.getElementById("produk_id").innerHTML="<option value=\"\">Gagal memuat produk</option>";return;}
document.getElementById("produk_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama}</option>`).join("");
}
async function simpanPenjualan(){
const jumlah=Number(document.getElementById("jumlah_terjual").value);const harga=Number(document.getElementById("harga_jual").value);const data={tanggal:document.getElementById("tanggal").value||new Date().toISOString().split("T")[0],cabang_id:document.getElementById("cabang_id").value,produk_id:document.getElementById("produk_id").value,jumlah_terjual:jumlah,harga_jual:harga};
if(!data.cabang_id||!data.produk_id||!Number.isInteger(jumlah)||jumlah<=0||!Number.isFinite(harga)||harga<0){document.getElementById("hasil").innerHTML="Lengkapi data penjualan dengan benar";return;}
const {error}=await supabaseClient.from("penjualan").insert([data]);
if(error){console.error("Gagal menyimpan penjualan:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML="Penjualan berhasil";await tampilkanPenjualan();
}
async function tampilkanPenjualan(){
const {data,error}=await supabaseClient.from("penjualan").select("*").order("tanggal",{ascending:false});
if(error){console.error("Gagal memuat penjualan:",error);document.getElementById("daftarPenjualan").innerHTML="Gagal memuat data penjualan";return;}
document.getElementById("daftarPenjualan").innerHTML=data.map(item=>`<p>Tanggal: ${item.tanggal}<br>Jumlah: ${item.jumlah_terjual}<br>Harga: ${item.harga_jual}</p><hr>`).join("");
}
loadCabang();loadProduk();tampilkanPenjualan();
