async function simpanCabang(){

    const nama_cabang =
    document.getElementById("nama_cabang").value;


    const alamat =
    document.getElementById("alamat").value;


    const {error} =
    await supabaseClient
    .from("cabang")
    .insert([
        {
            nama_cabang:nama_cabang,
            alamat:alamat
        }
    ]);


    if(error){

        console.log(error);

        document.getElementById("hasil").innerHTML =
        "Gagal menyimpan";

    } else {

        document.getElementById("hasil").innerHTML =
        "Cabang berhasil disimpan";

        tampilkanCabang();

    }

}



async function tampilkanCabang(){

    const {data,error} =
    await supabaseClient
    .from("cabang")
    .select("*");


    if(error){

        console.log(error);
        return;

    }


    let html="";


    data.forEach(function(item){

        html += `
        <p>
        ${item.nama_cabang}
        <br>
        ${item.alamat}
        </p>
        <hr>
        `;

    });


    document.getElementById("daftarCabang").innerHTML = html;

}


tampilkanCabang();
