import {Proyecto} from "./proyecto.js"

var lista = [];

$(document).ready(function() {
    if (localStorage.datos){
        lista = new Array;
        lista = JSON.parse(localStorage.datos);
        recogerDatos(lista);
    }else{
        lista = [];
    }
    datosEnviados(lista);
});

function crearProyecto(proyecto){
    var div_proyecto = $("<div class='contenedor-tareas'> <section class='contenedor-info'><div class='parte1'><img class='hecho' src='https://cdn-icons-png.flaticon.com/512/64/64571.png'><span>"+proyecto.getNombre()+"</span></div><div class='parte2'><span>Prioridad:</span><button class='prioridad low'>Low</button><button class='prioridad normal'>Normal</button><button class='prioridad high'>High</button><span>añadido hace "+  obetenerFecha(proyecto) +" minutos</span></div></section><img class='eliminar' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfiMi9XJEDu2zLYRJfLgMj_6pcmaHbRDv-Yw&usqp=CAU'></div>");
    $('#tareas').append(div_proyecto);
    crearTransicion(div_proyecto);
    cargarHecho(div_proyecto,proyecto);
    cargarPrioridad(div_proyecto,proyecto);
    finalizarProyecto(div_proyecto,proyecto);
    cambiarPrioridad(div_proyecto,proyecto);
    eliminarProyecto(div_proyecto,proyecto);
    cargarPendientes();
    cargarTotales();
    borrarCompletas();
}

function obetenerFecha(proyecto){
    lista = JSON.parse(localStorage.datos);
    for (let element of lista){
        if(proyecto.nombre == element.nombre){
            return(Math.floor(((Date.now() - element.fecha)/1000)/60));
        }
    }
}

function crearTransicion(div_proyecto){
    $(div_proyecto).animate({left: '250px'},"slow")
}

function cargarHecho(div_proyecto,proyecto){
    if(proyecto.hecho){
        $(div_proyecto).find('.parte1').find('img').attr("src","https://cdn.pixabay.com/photo/2016/03/31/19/14/check-box-1294836_960_720.png");
        $(div_proyecto).find('.parte1').find('img').siblings().css({"color":"#00BC8C","text-decoration":"line-through"});
    }
}

function cargarPrioridad(div_proyecto,proyecto){
    if(proyecto.prioridad == "low"){
        $(div_proyecto).find(".low").css("background-color","#3394D5");
    }else if(proyecto.prioridad == "normal"){
        $(div_proyecto).find(".normal").css("background-color","#375A7F");
    }else if(proyecto.prioridad == "high"){
        $(div_proyecto).find(".high").css("background-color","#E74C3C");
    }
}

function enviarLocalStorage(nombre){
    let proyecto = new Proyecto(nombre);
    lista.push(proyecto);
    localStorage.datos = JSON.stringify(lista);
    crearProyecto(proyecto);
}

function datosEnviados(){
    $('input').keyup(function(e) {
        if (e.which == 13)
        {
            enviarLocalStorage(this.value);
            $('input').val("");
        }
    });
}

function recogerDatos(){
    lista = JSON.parse(localStorage.datos);
    for(let element of lista){
        let proyecto = new Proyecto(element.nombre,element.prioridad,element.hecho)
        crearProyecto(proyecto);
    }
}

function finalizarProyecto(div_proyecto,proyecto){
    $(div_proyecto).find('img').click(function(){
        let hecho = true;
        if(proyecto.hecho){
            $(this).attr("src","https://cdn-icons-png.flaticon.com/512/64/64571.png");
            $(this).siblings().css({"color":"white","text-decoration":"none"});
            actualizarLocalStorageHecho(proyecto,hecho);
        }else{
            $(this).attr("src","https://cdn.pixabay.com/photo/2016/03/31/19/14/check-box-1294836_960_720.png");
            $(this).siblings().css({"color":"#00BC8C","text-decoration":"line-through"});
            hecho = false
            actualizarLocalStorageHecho(proyecto,hecho);
        }
        cargarPendientes();
    });
    
}

function cambiarPrioridad(div_proyecto,proyecto){
        $(div_proyecto).find(".low").click(function(){
            $(div_proyecto).find(".prioridad").css("background-color","#525252");
            $(this).css("background-color","#3394D5");
            proyecto.prioridad = "low";
            actualizarLocalStoragePrioridad(proyecto);
        })
        $(div_proyecto).find(".normal").click(function(){
            $(div_proyecto).find(".prioridad").css("background-color","#525252");
            $(this).css("background-color","#375A7F");
            proyecto.prioridad = "normal";
            actualizarLocalStoragePrioridad(proyecto);
        })
        $(div_proyecto).find(".high").click(function(){
            $(div_proyecto).find(".prioridad").css("background-color","#525252");
            $(this).css("background-color","#E74C3C");
            proyecto.prioridad = "high";
            actualizarLocalStoragePrioridad(proyecto);
        })
}

function eliminarProyecto(div_proyecto,proyecto){
    $(div_proyecto).find(".eliminar").click(function(){
        $(div_proyecto).remove();
        actualizarLocalStorageProyecto(proyecto);
        cargarTotales();
        cargarPendientes();
    })
}

function eliminarProyectoHecho(proyecto){
    for (let element of $(".contenedor-tareas")){  
        if(proyecto.nombre == element.children[0].children[0].children[1].innerHTML){
            element.remove();
        }
        // }if(proyecto.nombre == element.find('span').html()){
        //     element.remove();
        // }
    }
}

function actualizarLocalStorageHecho(proyecto,hecho){
    lista = JSON.parse(localStorage.datos);
    for (let element of lista){
        if(proyecto.nombre == element.nombre){
            if(hecho){
                element.hecho = false;
                proyecto.hecho = false;
            }else{
                element.hecho = true;
                proyecto.hecho = true;
            }
            localStorage.datos = JSON.stringify(lista);
        }
    }
}

function actualizarLocalStoragePrioridad(proyecto){
    lista = JSON.parse(localStorage.datos);
    for (let element of lista){
        if(proyecto.nombre == element.nombre){
            if(proyecto.prioridad == "low"){
                element.prioridad = "low";
            }else if(proyecto.prioridad == "normal"){
                element.prioridad = "normal";
            }else if(proyecto.prioridad == "high"){
                element.prioridad = "high";
            }
        }
    }
    localStorage.datos = JSON.stringify(ordenarPrioridad(lista));
    $('#tareas').html("");
    recogerDatos();
}

function actualizarLocalStorageProyecto(proyecto){
    lista = JSON.parse(localStorage.datos);
    let lista_final = lista;
    let indice = 0;
    for (let element of lista){
        if(proyecto.nombre == element.nombre){
            lista_final.splice(indice,1);
            localStorage.datos = JSON.stringify(lista_final);
        }
        indice++;
    }
}

function cargarPendientes(){
    let pendientes = 0;
    let lista_tareas = JSON.parse(localStorage.datos);
    for (let element of lista_tareas){
        if(!element.hecho){
            pendientes++;
        }
    }
    $("#pendientes").html(pendientes);
}

function cargarTotales(){
    let tareas = $(".contenedor-tareas").length;
    $("#totales").html(tareas)
}

function borrarCompletas(){
    $('#borrar').find('img').click(function(){
        lista = JSON.parse(localStorage.datos);
        let lista_final = lista;
        let indice = 0;
        for (let element of lista){
            if(element.hecho){
                lista_final.splice(indice,1);
                eliminarProyectoHecho(element);
                localStorage.datos = JSON.stringify(lista_final);
            }
            indice++;
        }
        cargarPendientes();
        cargarTotales();
    })
}

function ordenarPrioridad(lista){
    let lista_final = [];
    for(let element of lista){
        if(element.prioridad == "high"){
            lista_final.push(element);
        }
    }
    for(let element of lista){
        if(element.prioridad == "normal"){
            lista_final.push(element);
        }
    }
    for(let element of lista){
        if(element.prioridad == "low"){
            lista_final.push(element);
        }
    }
    for(let element of lista){
        if(element.prioridad == false){
            lista_final.push(element);
        }
    }
    return lista_final;
}