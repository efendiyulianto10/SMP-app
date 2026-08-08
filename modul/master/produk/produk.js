async function tampilkanCabang(){

const {data,error}=await supabaseClient
.from("cabang")
.select("*");


let html="";


data.forEach(function(item){

html += `
<option value="${item.id}">
${item.nama_cabang}
</option>
`;

});


document.getElementById("cabang_id").innerHTML=html;

}



async function tampilkanSupplier(){

const {data,error}=await supabaseClient
.from("supplier")
.select("*");


let html="";


data.forEach(function(item){

html += `
<option value="${item.id}">
${item.nama}
</option>
`;

});


document.getElementById("supplier_id").innerHTML=html;

}




async function simpanProduk(){


const produk = {

nama:
document.getElementById("nama").value,


harga_modal:
document.getElementById("harga_modal").value,


harga:
document.getElementById("harga").value,


supplier_id:
document.getElementById("supplier_id").value,


cabang_id:
document.getElementById("cabang_id").value

};



const {error}=await supabaseClient
.from("produk")
.insert([produk]);



if(error){

console.log(error);

document.getElementById("hasil").innerHTML =
"Gagal menyimpan";


}else{


document.getElementById("hasil").innerHTML =
"Produk berhasil disimpan";


tampilkanProduk();


}


}




async function tampilkanProduk(){


const {data,error}=await supabaseClient
.from("produk")
.select("*");



let html="";


data.forEach(function(item){

html += `
<p>
${item.nama}
<br>
Harga: ${item.harga}
</p>
<hr>
`;

});


document.getElementById("daftarProduk").innerHTML=html;


}



tampilkanCabang();
tampilkanSupplier();
tampilkanProduk();
