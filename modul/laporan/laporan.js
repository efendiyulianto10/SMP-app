const tanggalInput=document.getElementById("tanggal");tanggalInput.value=new Date().toISOString().split("T")[0];
function rupiah(value){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value||0);}
async function muatLaporan(){
const tanggal=tanggalInput.value;if(!tanggal){document.getElementById("ringkasan").innerHTML="Pilih tanggal terlebih dahulu";return;}
const [jual,masuk]=await Promise.all([supabaseClient.from("penjualan").select("jumlah_terjual,harga_jual,cabang_id,produk_id").eq("tanggal",tanggal),supabaseClient.from("barang_masuk").select("jumlah_masuk,harga_modal,cabang_id,produk_id,supplier_id").eq("tanggal",tanggal)]);
if(jual.error||masuk.error){const error=jual.error||masuk.error;console.error("Gagal memuat laporan:",error);document.getElementById("ringkasan").innerHTML="Gagal memuat laporan: "+error.message;return;}
const totalUnitTerjual=jual.data.reduce((sum,item)=>sum+(Number(item.jumlah_terjual)||0),0);const omzet=jual.data.reduce((sum,item)=>sum+(Number(item.jumlah_terjual)||0)*(Number(item.harga_jual)||0),0);const totalUnitMasuk=masuk.data.reduce((sum,item)=>sum+(Number(item.jumlah_masuk)||0),0);const nilaiModalMasuk=masuk.data.reduce((sum,item)=>sum+(Number(item.jumlah_masuk)||0)*(Number(item.harga_modal)||0),0);
document.getElementById("ringkasan").innerHTML=`<h2>Ringkasan ${tanggal}</h2><p>Unit masuk: ${totalUnitMasuk}</p><p>Unit terjual: ${totalUnitTerjual}</p><p>Omzet: ${rupiah(omzet)}</p><p>Nilai barang masuk: ${rupiah(nilaiModalMasuk)}</p>`;
document.getElementById("daftarPenjualan").innerHTML=jual.data.length?jual.data.map(item=>`<p>Produk ID: ${item.produk_id}<br>Terjual: ${item.jumlah_terjual}<br>Omzet: ${rupiah((Number(item.jumlah_terjual)||0)*(Number(item.harga_jual)||0))}</p><hr>`).join(""):"Tidak ada penjualan pada tanggal ini.";
document.getElementById("daftarBarangMasuk").innerHTML=masuk.data.length?masuk.data.map(item=>`<p>Produk ID: ${item.produk_id}<br>Masuk: ${item.jumlah_masuk}<br>Nilai modal: ${rupiah((Number(item.jumlah_masuk)||0)*(Number(item.harga_modal)||0))}</p><hr>`).join(""):"Tidak ada barang masuk pada tanggal ini.";
}
muatLaporan();
