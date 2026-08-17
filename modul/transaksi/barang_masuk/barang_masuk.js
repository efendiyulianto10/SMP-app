async function loadCabang(){
const {data,error}=await supabaseClient.from("cabang").select("*");
if(error){console.error("Gagal memuat cabang:",error);document.getElementById("cabang_id").innerHTML="<option value=\"\">Gagal memuat cabang</option>";return;}
document.getElementById("cabang_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama_cabang}</option>`).join("");
}
async function loadSupplier(){
const {data,error}=await supabaseClient.from("supplier").select("*");
if(error){console.error("Gagal memuat supplier:",error);document.getElementById("supplier_id").innerHTML="<option value=\"\">Gagal memuat supplier</option>";return;}
document.getElementById("supplier_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama}</option>`).join("");
}
async function loadProduk(){
const {data,error}=await supabaseClient.from("produk").select("*");
if(error){console.error("Gagal memuat produk:",error);document.getElementById("produk_id").innerHTML="<option value=\"\">Gagal memuat produk</option>";return;}
document.getElementById("produk_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama}</option>`).join("");
}
async function simpanBarangMasuk(){
const jumlah=Number(document.getElementById("jumlah_masuk").value);const harga=Number(document.getElementById("harga_modal").value);const data={tanggal:document.getElementById("tanggal").value||new Date().toISOString().split("T")[0],cabang_id:document.getElementById("cabang_id").value,supplier_id:document.getElementById("supplier_id").value,produk_id:document.getElementById("produk_id").value,jumlah_masuk:jumlah,harga_modal:harga};
if(!data.cabang_id||!data.supplier_id||!data.produk_id||!Number.isInteger(jumlah)||jumlah<=0||!Number.isFinite(harga)||harga<0){document.getElementById("hasil").innerHTML="Lengkapi data barang masuk dengan benar";return;}
const {error}=await supabaseClient.from("barang_masuk").insert([data]);
if(error){console.error("Gagal menyimpan barang masuk:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML="Barang masuk berhasil";await tampilkanBarangMasuk();
}
async function tampilkanBarangMasuk(){
const {data,error}=await supabaseClient.from("barang_masuk").select("*").order("tanggal",{ascending:false});
if(error){console.error("Gagal memuat barang masuk:",error);document.getElementById("daftarBarangMasuk").innerHTML="Gagal memuat data barang masuk";return;}
document.getElementById("daftarBarangMasuk").innerHTML=data.map(item=>`<p>Tanggal: ${item.tanggal}<br>Jumlah: ${item.jumlah_masuk}</p><hr>`).join("");
}
loadCabang();loadSupplier();loadProduk();tampilkanBarangMasuk();
