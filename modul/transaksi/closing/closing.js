let hasil = {};



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




async function hitungClosing(){


let produk_id =
document.getElementById("produk_id").value;


let cabang_id =
document.getElementById("cabang_id").value;


let supplier_id =
document.getElementById("supplier_id").value;



// jumlah masuk

let masuk = await supabaseClient
.from("barang_masuk")
.select("jumlah_masuk,harga_modal")
.eq("produk_id",produk_id)
.eq("cabang_id",cabang_id);



// jumlah terjual

let jual = await supabaseClient
.from("penjualan")
.select("jumlah_terjual,harga_jual")
.eq("produk_id",produk_id)
.eq("cabang_id",cabang_id);



let jumlah_masuk=0;
let harga_modal=0;


masuk.data.forEach(item=>{

jumlah_masuk += item.jumlah_masuk;
harga_modal=item.harga_modal;

});



let jumlah_terjual=0;
let harga_jual=0;


jual.data.forEach(item=>{

jumlah_terjual += item.jumlah_terjual;
harga_jual=item.harga_jual;

});



let jumlah_kembali =
jumlah_masuk - jumlah_terjual;


let total_penjualan =
jumlah_terjual * harga_jual;


let total_bayar_supplier =
jumlah_terjual * harga_modal;


let keuntungan =
total_penjualan - total_bayar_supplier;



hasil={

cabang_id,
supplier_id,
produk_id,

jumlah_masuk,
jumlah_terjual,
jumlah_kembali,

total_penjualan,
total_bayar_supplier,

keuntungan

};



document.getElementById("hasilClosing").innerHTML=

`
Masuk: ${jumlah_masuk}<br>
Terjual: ${jumlah_terjual}<br>
Kembali: ${jumlah_kembali}<br>
Omzet: ${total_penjualan}<br>
Bayar Supplier: ${total_bayar_supplier}<br>
Laba: ${keuntungan}
`;

}





async function simpanClosing(){


const {error}=await supabaseClient
.from("closing")
.insert([{

tanggal:
new Date().toISOString().split("T")[0],

...hasil

}]);



if(error){

console.log(error);

document.getElementById("pesan").innerHTML=
"Gagal simpan";

}else{

document.getElementById("pesan").innerHTML=
"Closing berhasil";

}

}




loadCabang();
loadSupplier();
loadProduk();

