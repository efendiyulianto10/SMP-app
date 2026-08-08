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




async function simpanPenjualan(){


const data={

tanggal:
document.getElementById("tanggal").value ||
new Date().toISOString().split("T")[0],


cabang_id:
document.getElementById("cabang_id").value,


produk_id:
document.getElementById("produk_id").value,


jumlah_terjual:
document.getElementById("jumlah_terjual").value,


harga_jual:
document.getElementById("harga_jual").value

};



const {error}=await supabaseClient
.from("penjualan")
.insert([data]);



if(error){

console.log(error);

document.getElementById("hasil").innerHTML=
"Gagal menyimpan";


}else{

document.getElementById("hasil").innerHTML=
"Penjualan berhasil";


tampilkanPenjualan();

}

}



async function tampilkanPenjualan(){

const {data}=await supabaseClient
.from("penjualan")
.select("*");


let html="";


data.forEach(item=>{

html += `
<p>
Tanggal: ${item.tanggal}
<br>
Jumlah: ${item.jumlah_terjual}
<br>
Harga: ${item.harga_jual}
</p>
<hr>
`;

});


document.getElementById("daftarPenjualan").innerHTML=html;

}



loadCabang();
loadProduk();
tampilkanPenjualan();
