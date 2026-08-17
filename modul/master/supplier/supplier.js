let daftarSupplier=[];
async function simpanSupplier(){
const nama=document.getElementById("nama").value.trim(),no_hp=document.getElementById("no_hp").value.trim(),alamat=document.getElementById("alamat").value.trim();
if(!nama){document.getElementById("hasil").innerHTML="Nama supplier wajib diisi";return;}
const {data,error}=await supabaseClient.from("supplier").insert([{nama,no_hp,alamat}]).select("id,kode_supplier,nama,no_hp,alamat").single();
if(error){console.error("Gagal menyimpan supplier:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML=`Supplier berhasil disimpan: <b>${data.kode_supplier}</b> — ${data.nama}`;document.getElementById("nama").value="";document.getElementById("no_hp").value="";document.getElementById("alamat").value="";await tampilkanSupplier();
}
async function tampilkanSupplier(){
const {data,error}=await supabaseClient.from("supplier").select("id,kode_supplier,nama,no_hp,alamat").order("kode_supplier",{ascending:true});
if(error){console.error("Gagal memuat supplier:",error);document.getElementById("daftarSupplier").innerHTML="Gagal memuat supplier: "+error.message;return;}
daftarSupplier=data||[];document.getElementById("daftarSupplier").innerHTML=daftarSupplier.map(item=>`<div><h3>${item.kode_supplier} — ${item.nama}</h3><p>${item.no_hp||"-"}</p><p>${item.alamat||"-"}</p></div><hr>`).join("")||"Belum ada supplier";
}
tampilkanSupplier();
