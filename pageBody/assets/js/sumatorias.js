$(document).ready(function () {

    //SE AGREGA CONFIGURACION DE CONEXION A FIREBASE
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
    
    var db = firebase.database();
    var coleccionProductos = db.ref().child("proyectos");


    var cuentapep = 0;

    //Rellenar el arreglo de los nombres de cuenta------------- -------------------------------
    var cuenta = [
        'Instal provis',
        'Acero',
        'Concreto',
        'Malla Electrosoldada',
        'Mano de obra',
        'Encofrados',
        'Entrepiso Liviano',
        'Contr Cubierta He y Policarbonato',
        'Cúpulas, manto y otros',
        'Tejas',
        'Boceles y pulidos',
        'Enchapes',
        'Pared externa liviana',
        'Pared interna liviana',
        'Pintura Fachada',
        'Pintura Interna',
        'Repellos y pasta',
        'Contr vidri y alumin',
        'Llavines',
        'Marcos para puertas',
        'Puertas y portones',
        'Rodapie',
        'Cables conduc y acc',
        'Piezas eléc y acces',
        'Pzas sanit grif acc',
        'Sumin y coloc tuberi',
        'Closets',
        'Muebles de cocina y baño',
        'Sobres granito y marmol',
        'Arboriz ornat jardin',
        'Muebles externos concreto',
        'Canal Acc Vehic Serv',
        'Cerca, Tapia y o Muros',
        'Cuarto de basura',
        'Piscina',
        'Alquiler Maq y Equip',
        'Herram-equip menores',
        'Limpieza general',
        'Conf lastr pied tier',
        'Corte y acarreo',
        'Muro Gavion',
        'Relleno y compactación',
        'Sumid bocas visita',
        'Hidrantes y siamesas',
        'Cables, conduc y acc',
        'Contrato elec urbana',
        'Poste estruc y lumin',
        'Tanquillas',
        'Aceras y caminerias',
        'Brocales',
        'Adoquin',
        'Asfalto',
        'Lastre',
        'Planta de tratamiento',
        'Pozo',
        'Sis bom hidro caseta',
        'Tanque de agua',
        'Contr Replanteo',
        'Alineamiento INVU',
        'Andamiaje',
        'Bodeguero',
        'Cabañas Sanitarias',
        'Direccion Tecnica',
        'Electricidad y agua (servicios temporales)',
        'Equipo de seguridad ocupacional',
        'Estudio de suelos',
        'Gastos legales',
        'Ingeniero Residente',
        'Maestro de obras',
        'Multas',
        'Oficina temporal',
        'Permisos Municipales',
        'Planillero',
        'Planos arquitectonicos y mecanicos',
        'Planos electricos',
        'Planos estructurales',
        'Planos mecanicos',
        'Poliza Ins Riegos de construcción',
        'Pruebas de laboratorio',
        'Tasado CFIA',
        'Vigilancia',
        'Imprevistos',
        'Utilidad'
    ];
    //Función que rellena el arreglo con los nombres de los peps -------------------------------
    var pep = [];
    for (i = 0; i < 26; i++) {

        cuentapep = cuentapep + 1;

        if (cuentapep >= 10) {
            pep.push('Pep 21X-' + cuentapep + '-C');
        } else {
            pep.push('Pep 21X-0' + cuentapep + '-C');
        }

    }
   

    db.ref("proyectos").once("value", function (snap) {

        snap.forEach(function (childSnap) {
            var sumita = [];
            nombre = childSnap.val().nombre;
           
            sumita.length = 0;
            db.ref("proyectos").child(nombre).update({
                gastos: 0,

            });

            for (i = 0; i < pep.length; i++) {
                pepId = pep[i];

                for (e = 0; e < cuenta.length; e++) {
                    cuentaId = cuenta[e];

                    db.ref("proyectos").child(nombre).child(pepId).child(cuentaId).child("gasto").once("value", function (snap) {


                        snap.forEach(function (childSnap) {
                            
                            sumita.push(childSnap.val().cantidad);
                            
                            cuenta = childSnap.val().cuenta;
                            codigo = childSnap.val().codigo;
                            peps = childSnap.val().pep;

                            sumarArreglo(sumita);

                            suma = sumarArreglo(sumita);
                           
                            db.ref("proyectos").child(codigo).update({
                                gastos: suma,

                            });
                        });
                    });
                   
                };
            };
        });
    });


    db.ref("proyectos").once("value", function (snap) {

        snap.forEach(function (childSnap) {
            var sumita2 = [];
            nombre = childSnap.val().nombre;
            sumita2.length = 0;
            for (i = 0; i < pep.length; i++) {
                pepId = pep[i];


                db.ref("proyectos").child(nombre).child(pepId).once("value", function (snap) {

                    snap.forEach(function (childSnap) {

                        sumita2.push(parseFloat(childSnap.val().presupuesto));

                        codigo = childSnap.val().proyecto;

                        sumarArreglo(sumita2);

                       

                        suma2 = sumarArreglo(sumita2);

                        db.ref("proyectos").child(codigo).update({
                            presupuestos: suma2,

                        });
                    });
                });


            };
        });
    });


    db.ref("proyectos").once("value", function (snap) {

        snap.forEach(function (childSnap) {


            codigo = childSnap.val().nombre;

            resta = (childSnap.val().presupuestos - childSnap.val().gastos);

            db.ref("proyectos").child(codigo).update({
                disponible: resta,

            });
        });
    });

    db.ref("proyectos").once("value", function (snap) {

        snap.forEach(function (childSnap) {
            var pagos = [];
            nombre = childSnap.val().nombre;
            
            pagos.length = 0;

                    db.ref("proyectos").child(nombre).child("pagos").once("value", function (snap) {

                        snap.forEach(function (childSnap) {

                            pagos.push(childSnap.val().montoPago);
                       
                            codigo = childSnap.val().codigo;
                           
                            sumarArreglo(pagos);
                            
                            pago = sumarArreglo(pagos);

                            db.ref("proyectos").child(codigo).update({
                                pagado: pago,

                            });
                        });
                    });
        });
    });



    db.ref("proyectos").once("value", function (snap) {

        snap.forEach(function (childSnap) {


            codigo = childSnap.val().nombre;

            resta2 = (childSnap.val().presupuestos - childSnap.val().pagado);

            db.ref("proyectos").child(codigo).update({
                deuda: resta2,

            });
        });
    });


    function sumarArreglo(numeros) {


        if (numeros instanceof Array) {
            let suma = numeros.reduce((acumulador, numero) => acumulador + numero);

            return suma;
        } else {
            throw TypeError('El argumento debe ser un arreglo.');
        }
    }

});