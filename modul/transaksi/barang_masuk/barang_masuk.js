async function loadCabang(){

const {data}=await supabaseClient
.from("cabang")
.select("*");


let html="";


data.forEach(item=>{

html += `
<option value="${item.id}">
${item.nama_cabang}
</option>
`;

});


document.getElementById("cabang_id").innerHTML=html;

}



async function loadSupplier(){

const {data}=await supabaseClient
.from("supplier")
.select("*");


let html="";


data.forEach(item=>{

html += `
<option value="${item.id}">
${item.nama}
</option>
`;

});


document.getElementById("supplier_id").innerHTML=html;

}



async function loadProduk(){

const {data}=await supabaseClient
.from("produk")
.select("*");


let html="";


data.forEach(item=>{

html += `
<option value="${item.id}">
${item.nama}
</option>
`;

});


document.getElementById("produk_id").innerHTML=html;

}




async function simpanBarangMasuk(){


const data = {

tanggal:
document.getElementById("tanggal").value,


cabang_id:
document.getElementById("cabang_id").value,


supplier_id:
document.getElementById("supplier_id").value,


produk_id:
document.getElementById("produk_id").value,


jumlah_masuk:
document.getElementById("jumlah_masuk").value,


harga_modal:
document.getElementById("harga_modal").value

};



const {error}=await supabaseClient
.from("barang_masuk")
.insert([data]);



if(error){

console.log(error);

document.getElementById("hasil").innerHTML=
"Gagal menyimpan";


}else{


document.getElementById("hasil").innerHTML=
"Barang masuk berhasil";


tampilkanBarangMasuk();

}


}




async function tampilkanBarangMasuk(){

const {data}=await supabaseClient
.from("barang_masuk")
.select("*");


let html="";


data.forEach(item=>{

html += `
<p>
Tanggal: ${item.tanggal}
<br>
Jumlah: ${item.jumlah_masuk}
</p>
<hr>
`;

});


document.getElementById("daftarBarangMasuk").innerHTML=html;

}




loadCabang();
loadSupplier();
loadProduk();
tampilkanBarangMasuk();
