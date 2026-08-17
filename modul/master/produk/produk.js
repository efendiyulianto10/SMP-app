async function tampilkanCabang(){
const {data,error}=await supabaseClient.from("cabang").select("*");
if(error){console.error("Gagal memuat cabang:",error);document.getElementById("cabang_id").innerHTML="<option value=\"\">Gagal memuat cabang</option>";return;}
document.getElementById("cabang_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama_cabang}</option>`).join("");
}
async function tampilkanSupplier(){
const {data,error}=await supabaseClient.from("supplier").select("*");
if(error){console.error("Gagal memuat supplier:",error);document.getElementById("supplier_id").innerHTML="<option value=\"\">Gagal memuat supplier</option>";return;}
document.getElementById("supplier_id").innerHTML=data.map(item=>`<option value="${item.id}">${item.nama}</option>`).join("");
}
async function simpanProduk(){
const produk={nama:document.getElementById("nama").value.trim(),harga_modal:Number(document.getElementById("harga_modal").value),harga:Number(document.getElementById("harga").value),supplier_id:document.getElementById("supplier_id").value,cabang_id:document.getElementById("cabang_id").value};
if(!produk.nama||!produk.supplier_id||!produk.cabang_id||!Number.isFinite(produk.harga_modal)||!Number.isFinite(produk.harga)||produk.harga_modal<0||produk.harga<0){document.getElementById("hasil").innerHTML="Lengkapi data produk dengan benar";return;}
const {error}=await supabaseClient.from("produk").insert([produk]);
if(error){console.error("Gagal menyimpan produk:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML="Produk berhasil disimpan";document.getElementById("nama").value="";document.getElementById("harga_modal").value="";document.getElementById("harga").value="";await tampilkanProduk();
}
async function tampilkanProduk(){
const {data,error}=await supabaseClient.from("produk").select("*");
if(error){console.error("Gagal memuat produk:",error);document.getElementById("daftarProduk").innerHTML="Gagal memuat data produk";return;}
document.getElementById("daftarProduk").innerHTML=data.map(item=>`<p>${item.nama}<br>Harga: ${item.harga}</p><hr>`).join("");
}
tampilkanCabang();tampilkanSupplier();tampilkanProduk();
