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
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const añoActual = fecha.getFullYear();


    
    var db = firebase.database();
    var coleccionProductos = db.ref().child("proyectos");

    var scores = [];
    var $select = $('#codigo');
    db.ref("proyectos").once("value", function (snap) {
        snap.forEach(function (childSnap) {
            scores.push(childSnap.val());
            $select.append('<option>' + childSnap.val().nombre + '</option>');

        });
    });

    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaProductos').DataTable({
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        data: dataSet,
        columnDefs: [
            {
                targets: [0],
                visible: false, //ocultamos la columna de ID que es la [0]                        
            },
            {
                targets: -1,
                defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>" + iconoBorrar + "</button></div></div>"
            }
        ]
    });



    db.ref("moneda").once("value", function (snap) {

        actual = snap.val().actual;


        db.ref("moneda").child(actual).once("value", function (snap) {


            cambio = snap.val().cambio;
            simbolo = snap.val().simbolo;


        });

    db.ref("proyectos").once("value", function (snap) {
        snap.forEach(function (childSnap) {
            nombre = childSnap.val().nombre;
            var coleccionProductos = db.ref().child("proyectos").child(nombre).child("pagos");

    coleccionProductos.on("child_added", datos => {
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("fechaPago").val(), datos.child("nTransaccion").val(), datos.child("nombrePersona").val(), simbolo + (new Intl.NumberFormat('ru-RU').format(datos.child("montoPago").val() / cambio))];
        table.rows.add([dataSet]).draw();
    });
    coleccionProductos.on('child_changed', datos => {
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("fechaPago").val(), datos.child("nTransaccion").val(), datos.child("nombrePersona").val(), simbolo + (new Intl.NumberFormat('ru-RU').format(datos.child("montoPago").val() / cambio))];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccionProductos.on("child_removed", function () {
        table.row(filaEliminada.parents('tr')).remove().draw();
    });

        });
    });

    });
    $('form').submit(function (e) {
        e.preventDefault();
        let id = $.trim($('#id').val());
        let codigo = $.trim($('#codigo').val());
        let dia = $.trim($('#fechaDia').val());
        let mes = $.trim($('#fechaMes').val());
        let ano = $.trim($('#fechaAno').val());

        let fechaPago = dia + "/" + mes + "/" + ano;
        let nTransaccion = $.trim($('#nTransaccion').val());
        let nombrePersona = $.trim($('#nombrePersona').val());
        let montoPago = parseFloat($.trim($('#montoPago').val()));

        var coleccionProductos = db.ref().child("proyectos").child(codigo).child("pagos");

        let idFirebase = id;
        if (idFirebase == '') {
            idFirebase = coleccionProductos.push().key;
        };
        data = { codigo: codigo, fechaPago: fechaPago, nTransaccion: nTransaccion, nombrePersona: nombrePersona, montoPago: montoPago };
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccionProductos.update(actualizacionData);
        id = '';
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');

        var descripcionCambio = "Se creó el pago: " + codigo;
        var fecha = hoy + "/" + mesActual + "/" + añoActual;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var user = firebase.auth().currentUser;

                if (user != null) {

                    var direccion = "CreaProveedor " + codigo;
                    var email = user.email;
                    console.log(email);
                    db.ref().child("historial").child(direccion).set({
                        email: email,
                        nombre: codigo,
                        fecha: fecha,
                        descripcionCambio: descripcionCambio


                    });
                }

            }
        });
    });

    //Botones
    $('#btnNuevo').click(function () {
        $('#id').val('');
        $('#codigo').val('');
        $('#fechaDia').val('');
        $('#fechaMes').val('');
        $('#fechaAno').val('');
        $('#nTransaccion').val('');
        $('#nombrePersona').val('');
        $('#montoPago').val('');
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });

    $("#tablaProductos").on("click", ".btnEditar", function () {
        filaEditada = table.row($(this).parents('tr'));
        let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));
        let id = fila[0];
        console.log(id);
        let codigo = $(this).closest('tr').find('td:eq(0)').text();
        let fechaPago = $(this).closest('tr').find('td:eq(1)').text();
        let nTransaccion = $(this).closest('tr').find('td:eq(2)').text();
        let nombrePersona = $(this).closest('tr').find('td:eq(3)').text();
        let montoPago = $(this).closest('tr').find('td:eq(4)').text();
        $('#id').val(id);
        $('#codigo').val(codigo);
        $('#fechaPago').val(fechaPago);
        $('#nTransaccion').val(nTransaccion);
        $('#nombrePersona').val(nombrePersona);
        $('#montoPago').val(montoPago);
        $('#modalAltaEdicion').modal('show');

        var descripcionCambio = "Se editó el proveedor: " + codigo;
        var fecha = hoy + "/" + mesActual + "/" + añoActual;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var user = firebase.auth().currentUser;

                if (user != null) {

                    var direccion = "EditaProveedor " + codigo;
                    var email = user.email;
                    console.log(email);
                    db.ref().child("historial").child(direccion).set({
                        email: email,
                        nombre: codigo,
                        fecha: fecha,
                        descripcionCambio: descripcionCambio


                    });
                }

            }
        });
    });

    $("#tablaProductos").on("click", ".btnBorrar", function () {
        filaEliminada = $(this);
        Swal.fire({
            title: '¿Está seguro de eliminar este pago?',
            text: "¡Está operación no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Borrar'
        }).then((result) => {
            if (result.value) {
                let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));
                let id = fila[0];
                let nombre = fila[1];

                var descripcionCambio = "Se eliminó el pago: " + nombre;
                var fecha = hoy + "/" + mesActual + "/" + añoActual;
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        // User is signed in.
                        var user = firebase.auth().currentUser;

                        if (user != null) {

                            var dirección = "Eliminapago " + nombre;
                            var email = user.email;
                            console.log(email);
                            db.ref().child("historial").child(dirección).set({
                                email: email,
                                nombre: nombre,
                                fecha: fecha,
                                descripcionCambio: descripcionCambio


                            });
                        }

                    }
                });
                db.ref(`proyectos/${nombre}/pagos`).remove()
                db.ref("proyectos").child(nombre).update({
                    pagado: 0,

                });
                Swal.fire('¡Eliminado!', 'El pago ha sido eliminado.', 'success')
            }
        })
    });

});