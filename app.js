async function tampilkanProduk(){

    const { data, error } = await supabaseClient
        .from("produk")
        .select("*");


    if(error){

        document.getElementById("produk").innerHTML =
        "Gagal mengambil data";

        console.log(error);

        return;
    }


    let html = "";


    data.forEach(function(item){

        html += `
        <div>
            <h3>${item.nama}</h3>
            <p>Harga: Rp ${item.harga}</p>
        </div>
        `;

    });


    document.getElementById("produk").innerHTML = html;

}


tampilkanProduk();
