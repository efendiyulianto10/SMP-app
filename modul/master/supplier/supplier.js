async function simpanSupplier(){

    const nama =
    document.getElementById("nama").value;

    const no_hp =
    document.getElementById("no_hp").value;

    const alamat =
    document.getElementById("alamat").value;


    const {data,error} =
    await supabaseClient
    .from("supplier")
    .insert([
        {
            nama:nama,
            no_hp:no_hp,
            alamat:alamat
        }
    ]);


    if(error){

    console.log("ERROR SUPABASE:", error);

    document.getElementById("hasil").innerHTML =
    error.message;

} else {

        document.getElementById("hasil").innerHTML =
        "Supplier berhasil disimpan";

    }

}


async function tampilkanSupplier(){

    const {data,error} =
    await supabaseClient
    .from("supplier")
    .select("*");


    if(error){

        console.log(error);
        return;

    }


    let html = "";


    data.forEach(function(item){

        html += `
        <div>
            <h3>${item.nama}</h3>
            <p>${item.no_hp}</p>
            <p>${item.alamat}</p>
        </div>
        <hr>
        `;

    });


    document.getElementById("daftarSupplier").innerHTML = html;

}


tampilkanSupplier();
