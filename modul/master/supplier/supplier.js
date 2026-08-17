let daftarSupplier=[];
function kodeTampilan(item,index){return item.kode_supplier||`S${String(index+1).padStart(3,"0")}`;}
async function simpanSupplier(){
const nama=document.getElementById("nama").value.trim(),no_hp=document.getElementById("no_hp").value.trim(),alamat=document.getElementById("alamat").value.trim();
if(!nama){document.getElementById("hasil").innerHTML="Nama supplier wajib diisi";return;}
const kode=`S${String(daftarSupplier.length+1).padStart(3,"0")}`;const payload={nama,no_hp,alamat,kode_supplier:kode};let {error}=await supabaseClient.from("supplier").insert([payload]);
if(error&&/kode_supplier|column/i.test(error.message)){const fallback=await supabaseClient.from("supplier").insert([{nama,no_hp,alamat}]);error=fallback.error;}
if(error){console.error("Gagal menyimpan supplier:",error);document.getElementById("hasil").innerHTML="Gagal menyimpan: "+error.message;return;}
document.getElementById("hasil").innerHTML=`Supplier berhasil disimpan dengan ID <b>${kode}</b>`;document.getElementById("nama").value="";document.getElementById("no_hp").value="";document.getElementById("alamat").value="";await tampilkanSupplier();
}
async function tampilkanSupplier(){
let {data,error}=await supabaseClient.from("supplier").select("*").order("nama",{ascending:true});
if(error){console.error("Gagal memuat supplier:",error);document.getElementById("daftarSupplier").innerHTML="Gagal memuat supplier";return;}
daftarSupplier=data||[];document.getElementById("daftarSupplier").innerHTML=daftarSupplier.map((item,index)=>`<div><h3>${kodeTampilan(item,index)} — ${item.nama}</h3><p>${item.no_hp||"-"}</p><p>${item.alamat||"-"}</p></div><hr>`).join("")||"Belum ada supplier";
}
tampilkanSupplier();
