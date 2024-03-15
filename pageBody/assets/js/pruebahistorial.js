$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyAdWgtrT3KBrSchBwf106bzpyebWiRKoUY",
        authDomain: "construid-cr.firebaseapp.com",
        databaseURL: "https://construid-cr-default-rtdb.firebaseio.com",
        projectId: "construid-cr",
        storageBucket: "construid-cr.appspot.com",
        messagingSenderId: "126459000098",
        appId: "1:126459000098:web:b482ca1b8329961bb3217b",
        measurementId: "G-5BQ0JP8DSE"
    };
    firebase.initializeApp(config); //inicializamos firebase

    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar    

    var db = firebase.database();
    var coleccionProductos = db.ref().child("proyectos");

    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaProductos').DataTable({
        pageLength: 10,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        data: dataSet,
        columnDefs: [
            {
                targets: [0],
                visible: false, //ocultamos la columna de ID que es la [0]                        
            },

        ]
    });














    var coleccionProductos = db.ref().child("historial");

    coleccionProductos.on("child_added", datos => {
        dataSet = [datos.key, datos.child("fecha").val(), datos.child("email").val(), datos.child("descripcionCambio").val()];
        table.rows.add([dataSet]).draw();
    });





});