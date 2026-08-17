let hasil={};
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
async function hitungClosing(){
const produk_id=document.getElementById("produk_id").value;const cabang_id=document.getElementById("cabang_id").value;const supplier_id=document.getElementById("supplier_id").value;const tanggal=document.getElementById("tanggal")?.value||new Date().toISOString().split("T")[0];
if(!produk_id||!cabang_id||!supplier_id){document.getElementById("hasilClosing").innerHTML="Pilih cabang, supplier, dan produk";return;}
const masukQuery=await supabaseClient.from("barang_masuk").select("jumlah_masuk,harga_modal").eq("produk_id",produk_id).eq("cabang_id",cabang_id).eq("supplier_id",supplier_id).eq("tanggal",tanggal);
const jualQuery=await supabaseClient.from("penjualan").select("jumlah_terjual,harga_jual").eq("produk_id",produk_id).eq("cabang_id",cabang_id).eq("tanggal",tanggal);
if(masukQuery.error||jualQuery.error){const error=masukQuery.error||jualQuery.error;console.error("Gagal menghitung closing:",error);document.getElementById("hasilClosing").innerHTML="Gagal menghitung closing: "+error.message;return;}
let jumlah_masuk=0,harga_modal=0;masukQuery.data.forEach(item=>{jumlah_masuk+=Number(item.jumlah_masuk)||0;harga_modal=Number(item.harga_modal)||harga_modal;});
let jumlah_terjual=0,harga_jual=0;jualQuery.data.forEach(item=>{jumlah_terjual+=Number(item.jumlah_terjual)||0;harga_jual=Number(item.harga_jual)||harga_jual;});
const jumlah_kembali=Math.max(0,jumlah_masuk-jumlah_terjual);const total_penjualan=jumlah_terjual*harga_jual;const total_bayar_supplier=jumlah_terjual*harga_modal;const keuntungan=total_penjualan-total_bayar_supplier;
hasil={tanggal,cabang_id,supplier_id,produk_id,jumlah_masuk,jumlah_terjual,jumlah_kembali,total_penjualan,total_bayar_supplier,keuntungan};
document.getElementById("hasilClosing").innerHTML=`Masuk: ${jumlah_masuk}<br>Terjual: ${jumlah_terjual}<br>Kembali: ${jumlah_kembali}<br>Omzet: ${total_penjualan}<br>Bayar Supplier: ${total_bayar_supplier}<br>Laba: ${keuntungan}`;
}
async function simpanClosing(){
if(!hasil.produk_id){document.getElementById("pesan").innerHTML="Hitung closing terlebih dahulu";return;}
const {error}=await supabaseClient.from("closing").insert([hasil]);
if(error){console.error("Gagal menyimpan closing:",error);document.getElementById("pesan").innerHTML="Gagal simpan: "+error.message;return;}
document.getElementById("pesan").innerHTML="Closing berhasil";hasil={};
}
loadCabang();loadSupplier();loadProduk();
