let hasil=[];
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
async function hitungClosing(){
const tanggal=document.getElementById("tanggal").value||new Date().toISOString().split("T")[0];const cabang_id=document.getElementById("cabang_id").value;const supplier_id=document.getElementById("supplier_id").value;
if(!cabang_id||!supplier_id){document.getElementById("ringkasanClosing").innerHTML="Pilih cabang dan supplier";return;}
const masukQuery=await supabaseClient.from("barang_masuk").select("produk_id,jumlah_masuk,harga_modal").eq("cabang_id",cabang_id).eq("supplier_id",supplier_id).eq("tanggal",tanggal);const jualQuery=await supabaseClient.from("penjualan").select("produk_id,jumlah_terjual,harga_jual").eq("cabang_id",cabang_id).eq("tanggal",tanggal);
if(masukQuery.error||jualQuery.error){const error=masukQuery.error||jualQuery.error;console.error("Gagal menghitung closing:",error);document.getElementById("ringkasanClosing").innerHTML="Gagal menghitung: "+error.message;return;}
const produkIds=[...new Set(masukQuery.data.map(x=>x.produk_id))];if(!produkIds.length){document.getElementById("ringkasanClosing").innerHTML="Tidak ada barang masuk untuk supplier ini pada tanggal tersebut";document.getElementById("daftarClosing").innerHTML="";document.getElementById("btnSimpan").disabled=true;hasil=[];return;}
const {data:produk,error:produkError}=await supabaseClient.from("produk").select("id,nama").in("id",produkIds);if(produkError){document.getElementById("ringkasanClosing").innerHTML="Gagal memuat nama produk: "+produkError.message;return;}
const rows=produk.map(p=>{const masuk=masukQuery.data.filter(x=>x.produk_id===p.id);const jual=jualQuery.data.filter(x=>x.produk_id===p.id);const jumlah_masuk=masuk.reduce((s,x)=>s+(Number(x.jumlah_masuk)||0),0);const jumlah_terjual=jual.reduce((s,x)=>s+(Number(x.jumlah_terjual)||0),0);const harga_modal=Number(masuk[0]?.harga_modal)||0;const harga_jual=Number(jual[0]?.harga_jual)||0;return{tanggal,cabang_id,supplier_id,produk_id:p.id,nama:p.nama,jumlah_masuk,jumlah_terjual,jumlah_kembali:Math.max(0,jumlah_masuk-jumlah_terjual),harga_modal,harga_jual,total_penjualan:jumlah_terjual*harga_jual,total_bayar_supplier:jumlah_terjual*harga_modal,keuntungan:jumlah_terjual*(harga_jual-harga_modal)};});
hasil=rows;const masuk=rows.reduce((s,x)=>s+x.jumlah_masuk,0),terjual=rows.reduce((s,x)=>s+x.jumlah_terjual,0),kembali=rows.reduce((s,x)=>s+x.jumlah_kembali,0),omzet=rows.reduce((s,x)=>s+x.total_penjualan,0),bayar=rows.reduce((s,x)=>s+x.total_bayar_supplier,0),laba=rows.reduce((s,x)=>s+x.keuntungan,0);
document.getElementById("ringkasanClosing").innerHTML=`<h2>Rekap Supplier</h2><p>Masuk: <b>${masuk}</b> | Terjual: <b>${terjual}</b> | Kembali: <b>${kembali}</b></p><p>Omzet: <b>Rp ${omzet.toLocaleString("id-ID")}</b> | Bayar Supplier: <b>Rp ${bayar.toLocaleString("id-ID")}</b> | Laba: <b>Rp ${laba.toLocaleString("id-ID")}</b></p>`;
document.getElementById("daftarClosing").innerHTML=`<table border="1" cellpadding="8"><thead><tr><th>Produk</th><th>Masuk</th><th>Terjual</th><th>Kembali</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${x.nama}</td><td>${x.jumlah_masuk}</td><td>${x.jumlah_terjual}</td><td><b>${x.jumlah_kembali}</b></td></tr>`).join("")}</tbody></table>`;document.getElementById("btnSimpan").disabled=false;
}
async function simpanClosing(){
if(!hasil.length){document.getElementById("pesan").innerHTML="Tampilkan rekap terlebih dahulu";return;}
const payload=hasil.map(({nama,harga_modal,harga_jual,...row})=>row);const {error}=await supabaseClient.from("closing").insert(payload);if(error){console.error("Gagal menyimpan closing:",error);document.getElementById("pesan").innerHTML="Gagal simpan: "+error.message;return;}
document.getElementById("pesan").innerHTML="✅ Closing supplier selesai. Barang kembali tercatat otomatis.";document.getElementById("btnSimpan").disabled=true;hasil=[];
}
document.getElementById("tanggal").value=new Date().toISOString().split("T")[0];loadCabang();loadSupplier();
