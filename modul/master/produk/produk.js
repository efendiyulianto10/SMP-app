async function tampilkanCabang(){
const {data,error}=await supabaseClient.from("cabang").select("*");
if(error){console.error("Gagal memuat cabang:",error);document.getElementById("cabang_id").innerHTML="<option value=\"\">Gagal memuat cabang</option>";return;}
document.getElementById("cabang_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama_cabang}</option>`).join("");
}
async function tampilkanSupplier(){
const {data,error}=await supabaseClient.from("supplier").select("id,kode_supplier,nama").order("kode_supplier",{ascending:true});
if(error){console.error("Gagal memuat supplier:",error);document.getElementById("supplier_id").innerHTML="<option value=\"\">Gagal memuat supplier</option>";return;}
document.getElementById("supplier_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.kode_supplier} — ${item.nama}</option>`).join("");
}
async function simpanProduk(){
const produk={nama:document.getElementById("nama").value.trim(),harga_modal:Number(document.getElementById("harga_modal").value),harga:Number(document.getElementById("harga").value),supplier_id:document.getElementById("supplier_id").value,cabang_id:document.getElementById("cabang_id").value};
if(!produk.nama||!produk.supplier_id||!produk.cabang_id||!Number.isFinite(produk.harga_modal)||!Number.isFinite(produk.harga)||produk.harga_modal<0||produk.harga<0){document.getElementById("hasil").innerHTML="Lengkapi data produk dengan benar";return;}
const {data,error}=await supabaseClient.from("produk").insert([produk]).select("id,kode_produk,nama,harga_modal,harga,supplier_id,cabang_id").single();
if(error){console.error("Gagal menyimpan produk:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML=`Produk berhasil disimpan: <b>${data.kode_produk}</b> — ${data.nama}`;document.getElementById("nama").value="";document.getElementById("harga_modal").value="9000";document.getElementById("harga").value="10000";await tampilkanProduk();
}
async function tampilkanProduk(){
const {data,error}=await supabaseClient.from("produk").select("id,kode_produk,nama,harga_modal,harga,supplier_id").order("kode_produk",{ascending:true});
if(error){console.error("Gagal memuat produk:",error);document.getElementById("daftarProduk").innerHTML="Gagal memuat data produk: "+error.message;return;}
document.getElementById("daftarProduk").innerHTML=data.map(item=>`<p><b>${item.kode_produk}</b> — ${item.nama}<br>Harga supplier: ${item.harga_modal}<br>Harga jual: ${item.harga}</p><hr>`).join("")||"Belum ada produk";
}
document.getElementById("harga_modal").value="9000";document.getElementById("harga").value="10000";tampilkanCabang();tampilkanSupplier();tampilkanProduk();
