class Proyecto{

      constructor(nombre, prioridad=false, hecho=false) {
            this.nombre = nombre;
            this.fecha = Date.now();
            this.prioridad = prioridad;
            this.hecho = hecho;
      }

      getNombre(){
            return this.nombre;
      }

      getFecha(){
            return this.fecha;
      }

      getPrioridad(){
            return this.prioridad;
      }

}

export {Proyecto}