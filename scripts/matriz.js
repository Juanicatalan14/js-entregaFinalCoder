// Abrir y cerrar el modal
const modal = document.getElementById("modal");
const btnAbrirModal = document.getElementById("abrirModal");
const spanCerrar = document.getElementsByClassName("close")[0];


btnAbrirModal.onclick = function() {
    modal.style.display = "block";
}

spanCerrar.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Almacenar la fila actual en edición
let filaActual = null;

// Guardar datos y agregar fila a la tabla
document.getElementById("modalForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario del modal
    
    const planta = document.getElementById("planta").value;
    const sector = document.getElementById("sector").value;
    const proceso = document.getElementById("proceso").value;
    const tarea = document.getElementById("tarea").value;
    const tipoRiesgo = document.getElementById("tipoRiesgo").value;
    const peligro = document.getElementById("peligro").value;
    const aspectoAmbiental = document.getElementById("aspectoAmbiental").value;
    const riesgoImpacto = document.getElementById("riesgoImpacto").value;
    const tipoActividad = document.getElementById("tipoActividad").value;
    const probabilidad = parseInt(document.getElementById("probabilidad").value);
    const gravedad = parseInt(document.getElementById("gravedad").value);
    const riesgoPuro = calcularRiesgopuro(probabilidad, gravedad);
    const evaluacionCuantitativa = document.getElementById("evaluacionCuantitativa").value;
    const eliminacionSustitucion = parseInt(document.getElementById("eliminacionSustitucion").value);
    const controlIngenieria = parseInt(document.getElementById("controlIngenieria").value);
    const controlesAdministrativos = parseInt(document.getElementById("controlesAdministrativos").value);
    const epp = parseInt(document.getElementById("epp").value);
    const controlesEspecificados = document.getElementById("controlesEspecificados").value;
    const efectividadControles = calcularEfectividadControles(eliminacionSustitucion, controlIngenieria, controlesAdministrativos, epp);
    const columnaIdentificada = identificarColumna(efectividadControles);
    const riesgoResidual =calcularRiesgoResidual(probabilidad, gravedad, epp, controlesAdministrativos, efectividadControles);
    const significanciaResidual = calcularSignificanciaResidual(riesgoResidual);
    const responsable = document.getElementById("responsable").value;
    const fechaElaboracion = document.getElementById("fechaElaboracion").value;


    const datosFila = {planta, sector, proceso, tarea, tipoRiesgo, peligro, aspectoAmbiental, riesgoImpacto, tipoActividad, probabilidad, gravedad, riesgoPuro, evaluacionCuantitativa, eliminacionSustitucion, controlIngenieria, controlesAdministrativos, epp, controlesEspecificados, efectividadControles, columnaIdentificada, riesgoResidual, significanciaResidual, responsable, fechaElaboracion}
    // Si hay una fila en edición, actualizarla
    if (filaActual) {
        actualizarFila(filaActual, datosFila);
    } else {
        agregarFila(riesgoPuro, datosFila);
    }

    
guardarenLocalStorage(datosFila) 

    modal.style.display = "none";
    document.getElementById("modalForm").reset();
    filaActual = null;

// SweetAlert de guardado correctamente
Swal.fire({
    position: "center",
    icon: "success",
    title: "El riesgo a sido guardado correctamente",
    showConfirmButton: false,
    timer: 1500
});
});

// Fucion guardado en LocalStorage
function guardarenLocalStorage(datos) {
    const datosGuardados = JSON.parse(localStorage.getItem('datosFilas')) || [];
    datosGuardados.push(datos);
    localStorage.setItem('datosFilas', JSON.stringify(datosGuardados));
}
// Función para filtrar la tabla
function filtrarTabla() {
    const inputPlanta = document.getElementById("buscarPlanta").value.toLowerCase();
    const inputSector = document.getElementById("buscarSector").value.toLowerCase();
    const inputProceso = document.getElementById("buscarProceso").value.toLowerCase();
    
    const tabla = document.getElementById("riesgoTable").getElementsByTagName('tbody')[0];
    const filas = tabla.getElementsByTagName("tr");

    for (let i = 0; i < filas.length; i++) {
        const celdaPlanta = filas[i].getElementsByTagName("td")[1].textContent.toLowerCase();
        const celdaSector = filas[i].getElementsByTagName("td")[2].textContent.toLowerCase();
        const celdaProceso = filas[i].getElementsByTagName("td")[3].textContent.toLowerCase();

        const mostrarFila = 
            (celdaPlanta.includes(inputPlanta) || inputPlanta === "") &&
            (celdaSector.includes(inputSector) || inputSector === "") &&
            (celdaProceso.includes(inputProceso) || inputProceso === "");

        filas[i].style.display = mostrarFila ? "" : "none";
    }
}

// Agregar eventos de entrada para cada campo de búsqueda
document.getElementById("buscarPlanta").addEventListener("keyup", filtrarTabla);
document.getElementById("buscarSector").addEventListener("keyup", filtrarTabla);
document.getElementById("buscarProceso").addEventListener("keyup", filtrarTabla);


// Funcion para cargar desde el LocalStorage
function cargarDesdeLocalStorage() {
    const datosGuardados = JSON.parse(localStorage.getItem('datosFilas')) || [];
    datosGuardados.forEach(dato => agregarFila(dato.riesgoPuro, dato));
}

// Evento para manejar el cambio en probabilidad
document.getElementById("probabilidad").addEventListener("change", actualizarRiesgoYEfectividad);
document.getElementById("gravedad").addEventListener("change", actualizarRiesgoYEfectividad);
document.getElementById("eliminacionSustitucion").addEventListener("change", actualizarEfectividadYColumna);
document.getElementById("controlIngenieria").addEventListener("change", actualizarEfectividadYColumna);
document.getElementById("controlesAdministrativos").addEventListener("change", actualizarEfectividadYColumna);
document.getElementById("epp").addEventListener("change", actualizarEfectividadYColumna);

// Función para actualizar riesgo puro
function actualizarRiesgoYEfectividad() {
    const probabilidad = parseInt(document.getElementById("probabilidad").value);
    const gravedad = parseInt(document.getElementById("gravedad").value);
    const riesgoPuro = calcularRiesgopuro(probabilidad, gravedad);
    document.getElementById("riesgoPuro").value = riesgoPuro;
      // Obtener valores de los controles
    const eliminacionSustitucion = parseInt(document.getElementById("eliminacionSustitucion").value);
    const controlIngenieria = parseInt(document.getElementById("controlIngenieria").value);
    const controlesAdministrativos = parseInt(document.getElementById("controlesAdministrativos").value);
    const epp = parseInt(document.getElementById("epp").value);

      // Calcular la efectividad de los controles
    const efectividadControles = calcularEfectividadControles(eliminacionSustitucion, controlIngenieria, controlesAdministrativos, epp);
      // Calcular el riesgo residual
    const riesgoResidual = calcularRiesgoResidual(probabilidad, gravedad, epp, controlesAdministrativos, efectividadControles);
    document.getElementById("riesgoResidual").value = riesgoResidual;
      // Calcular la significancia residual
    const significanciaResidual = calcularSignificanciaResidual(riesgoResidual);
    document.getElementById("significanciaResidual").value = significanciaResidual;
}


// Función para actualizar efectividad de controles y identificación de columna
function actualizarEfectividadYColumna() {
    const eliminacionSustitucion = parseInt(document.getElementById("eliminacionSustitucion").value);
    const controlIngenieria = parseInt(document.getElementById("controlIngenieria").value);
    const controlesAdministrativos = parseInt(document.getElementById("controlesAdministrativos").value);
    const epp = parseInt(document.getElementById("epp").value);
    
    const efectividadControles = calcularEfectividadControles(eliminacionSustitucion, controlIngenieria, controlesAdministrativos, epp);
    document.getElementById("efectividadControles").value = efectividadControles; 
    const columnaIdentificada = identificarColumna(efectividadControles);
    document.getElementById("columnaIdentificada").value = columnaIdentificada;
}


// Evento para manejar el cambio en el tipo de riesgo
document.getElementById("tipoRiesgo").addEventListener("change", function() {
        const aspectoAmbientalInput = document.getElementById("aspectoAmbiental");
    if (this.value === "Laboral") {
        aspectoAmbientalInput.value = ""; // Limpiar el valor si se selecciona "Laboral"
        aspectoAmbientalInput.readOnly = true; // Bloquear el campo
    } else {
        aspectoAmbientalInput.readOnly = false; // Desbloquear el campo si se selecciona "Ambiental"
    }
});

//Carga dataBase de planta/sector/proceso/riesgos
fetch('../json/riesgos.json')
    .then(response => response.json())
    .then(data => {
        // Cargar opciones para "Riesgo/Impacto"
        const riesgoImpacto = data.riesgos;
        const selectRiesgoImpacto = document.getElementById("riesgoImpacto");
        riesgoImpacto.forEach(riesgo => {
            const option = document.createElement("option");
            option.value = riesgo;
            option.textContent = riesgo;
            selectRiesgoImpacto.appendChild(option);
        });

        // Cargar opciones para "Planta"
        const planta = data.planta;
        const selectPlanta = document.getElementById("planta");
        planta.forEach(planta => {
            const option = document.createElement("option");
            option.value = planta;
            option.textContent = planta;
            selectPlanta.appendChild(option);
        });

        // Cargar opciones para "Sector"
        const sector = data.sector;
        const selectSector = document.getElementById("sector");
        sector.forEach(sector => {
            const option = document.createElement("option");
            option.value = sector;
            option.textContent = sector;
            selectSector.appendChild(option);
        });

        // Cargar opciones para "Proceso"
        const proceso = data.proceso;
        const selectProceso = document.getElementById("proceso");
        proceso.forEach(proceso => {
            const option = document.createElement("option");
            option.value = proceso;
            option.textContent = proceso;
            selectProceso.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar el JSON:", error);
    })

// Función para calcular riesgo puro
function calcularRiesgopuro(probabilidad, gravedad) {
    return probabilidad * gravedad;
}

// Función para calcular la efectividad de controles
function calcularEfectividadControles(eliminacionSustitucion, controlIngenieria, controlesAdministrativos, epp) {
    const aj = 0.5;  // Aj
    const ak = 0.25; // Ak
    const al = 0.1;  // Al
    const am = 0;    // Am

    if (eliminacionSustitucion === 1) {
        return 100; // Si W es 1, efectividad máxima
    } else {
        const sumaControles = (controlIngenieria * aj) + (controlesAdministrativos * ak) + (epp * al) + (1 * am); // Suma de los controles
        if (sumaControles < 0.1) return 0;  // Si el resultado es menor que 10%, lo consideramos 0%
        return Math.min(sumaControles * 100, 100); // Asegurar que el máximo sea 100%
    }
}


// Función para identificar columna
function identificarColumna(efectividad) {
    switch(true) {
        case efectividad === 100:
            return "2";
        case efectividad >= 85:
            return "3";
        case efectividad >= 75:
            return "4";
        case efectividad >= 60:
            return "5";
        case efectividad >= 50:
            return "6";
        case efectividad >= 35:
            return "7";
        case efectividad >= 25:
            return "8";
        case efectividad >= 10:
            return "9";
        default:
            return "EVALUAR"; // En caso de que el valor no esté contemplado
    }
}

//Calcular riesgo residual
function calcularRiesgoResidual(probabilidad, gravedad, epp, controlesAdministrativos, efectividad) {
    const riesgoPuro = calcularRiesgopuro(probabilidad, gravedad);
    const porcentajeReduccion = efectividad / 100; // Convertir a decimal
    const riesgoResidual = riesgoPuro * (1 - porcentajeReduccion);
    return riesgoResidual;
}

//Calcular la significancia residual
function calcularSignificanciaResidual(riesgoResidual) {
    // Definir una lógica simple para la significancia residual
    if (riesgoResidual < 10) {
        return "Bajo";
    } else if (riesgoResidual < 20) {
        return "Moderado";
    } else {
        return "Alto";
    }
}

// Función para agregar fila
function agregarFila(riesgoPuro, otrosDatos) {
    const table = document.getElementById("riesgoTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${table.rows.length + 0}</td>
        <td>${otrosDatos.planta}</td>
        <td>${otrosDatos.sector}</td>
        <td>${otrosDatos.proceso}</td>
        <td>${otrosDatos.tarea}</td>
        <td>${otrosDatos.tipoRiesgo}</td>
        <td>${otrosDatos.peligro}</td>
        <td>${otrosDatos.aspectoAmbiental}</td>
        <td>${otrosDatos.riesgoImpacto}</td>
        <td>${otrosDatos.tipoActividad}</td>
        <td>${otrosDatos.probabilidad}</td>
        <td>${otrosDatos.gravedad}</td>
        <td>${riesgoPuro}</td>
        <td>${otrosDatos.evaluacionCuantitativa}</td>
        <td>${otrosDatos.eliminacionSustitucion}</td>
        <td>${otrosDatos.controlIngenieria}</td>
        <td>${otrosDatos.controlesAdministrativos}</td>
        <td>${otrosDatos.epp}</td>
        <td>${otrosDatos.controlesEspecificados}</td>
        <td>${otrosDatos.efectividadControles}</td>
        <td>${otrosDatos.columnaIdentificada}</td>
        <td>${otrosDatos.riesgoResidual}</td>
        <td>${otrosDatos.significanciaResidual}</td>
        <td>${otrosDatos.responsable}</td>
        <td>${otrosDatos.fechaElaboracion}</td>
        <td>
            <button class="editar-btn">Editar</button>
            <button class="eliminar-btn">Eliminar</button>
        </td>    `;

    newRow.querySelector(".editar-btn").addEventListener("click", () => editarFila(newRow));
    newRow.querySelector(".eliminar-btn").addEventListener("click", () => eliminarFila(newRow));
}

// Función para editar fila
function editarFila(row) {
    filaActual = row; // Guardar la fila actual en edición
    const valores = row.querySelectorAll('td');
    
    // Llenar el modal con los valores actuales de la fila
    
    document.getElementById("planta").value = valores[1].innerText;
    document.getElementById("sector").value = valores[2].innerText;
    document.getElementById("proceso").value = valores[3].innerText;
    document.getElementById("tarea").value = valores[4].innerText;
    document.getElementById("tipoRiesgo").value = valores[5].innerText;
    document.getElementById("peligro").value = valores[6].innerText;
    document.getElementById("aspectoAmbiental").value = valores[7].innerText;
    document.getElementById("riesgoImpacto").value = valores[8].innerText;
    document.getElementById("tipoActividad").value = valores[9].innerText;
    document.getElementById("probabilidad").value = valores[10].innerText;
    document.getElementById("gravedad").value = valores[11].innerText;
    document.getElementById("riesgoPuro").value = valores[12].innerText;
    document.getElementById("evaluacionCuantitativa").value = valores[13].innerText;
    document.getElementById("eliminacionSustitucion").value = valores[14].innerText;
    document.getElementById("controlIngenieria").value = valores[15].innerText;
    document.getElementById("controlesAdministrativos").value = valores[16].innerText;
    document.getElementById("epp").value = valores[17].innerText;
    document.getElementById("controlesEspecificados").value = valores[18].innerText;
    document.getElementById("efectividadControles").value = valores[19].innerText;
    document.getElementById("columnaIdentificada").value = valores[20].innerText;
    document.getElementById("riesgoResidual").value = valores[21].innerText;
    document.getElementById("significanciaResidual").value = valores[22].innerText;
    document.getElementById("responsable").value = valores[23].innerText;
    document.getElementById("fechaElaboracion").value = valores[24].innerText;

    modal.style.display = "block";
}

// Actualizar fila
function actualizarFila(row, datos) {
    const valores = row.querySelectorAll('td');


    valores[1].innerText = datos.planta;
    valores[2].innerText = datos.sector;
    valores[3].innerText = datos.proceso;
    valores[4].innerText = datos.tarea;
    valores[5].innerText = datos.tipoRiesgo;
    valores[6].innerText = datos.peligro;
    valores[7].innerText = datos.aspectoAmbiental;
    valores[8].innerText = datos.riesgoImpacto;
    valores[9].innerText = datos.tipoActividad;
    valores[10].innerText = datos.probabilidad;
    valores[11].innerText = datos.gravedad;
    valores[12].innerText = calcularRiesgopuro(datos.probabilidad, datos.gravedad);
    valores[13].innerText = datos.evaluacionCuantitativa;
    valores[14].innerText = datos.eliminacionSustitucion;
    valores[15].innerText = datos.controlIngenieria;
    valores[16].innerText = datos.controlesAdministrativos;
    valores[17].innerText = datos.epp;
    valores[18].innerText = datos.controlesEspecificados;
    valores[19].innerText = calcularEfectividadControles(datos.eliminacionSustitucion, datos.controlIngenieria, datos.controlesAdministrativos, datos.epp);
    valores[20].innerText = identificarColumna(valores[19].innerText);
    valores[21].innerText = calcularRiesgoResidual(columnaIdentificada);
    valores[22].innerText = calcularSignificanciaResidual(riesgoResidual);;
    valores[23].innerText = datos.responsable;
    valores[24].innerText = datos.fechaElaboracion;
}

function actualizarFila(row, nuevosDatos) {
    const datosGuardados = JSON.parse(localStorage.getItem('datosFilas')) || [];
    const index = Array.from(row.parentElement.children).indexOf(row);
    datosGuardados[index] = nuevosDatos;
    localStorage.setItem('datosFilas', JSON.stringify(datosGuardados));
    actualizarFilaEnTabla(row, nuevosDatos); // Actualizar la fila en la tabla
}

//Eliminar fila
function eliminarFila(row) {
    // Obtener los datos guardados en el localStorage
    let datosGuardados = JSON.parse(localStorage.getItem('datosFilas')) || [];
    
    // Obtener el índice de la fila a eliminar
    const index = Array.from(row.parentElement.children).indexOf(row);
    
    // Eliminar el elemento del array de datos
    datosGuardados.splice(index, 1);
    
    // Actualizar el localStorage con el nuevo array
    localStorage.setItem('datosFilas', JSON.stringify(datosGuardados));
    
    // Eliminar la fila de la tabla
    row.remove();
    
    // Mostrar SweetAlert para confirmar la eliminación
    Swal.fire({
        position: "center",
        icon: "success",
        title: "El riesgo ha sido eliminado correctamente",
        showConfirmButton: false,
        timer: 1500
    });
}

function actualizarFilaEnTabla(row, datos) {
    const celdas = row.children;
    celdas[1].textContent = datos.planta;
    celdas[2].textContent = datos.sector;
    celdas[3].textContent = datos.proceso;
    celdas[4].textContent = datos.tarea;
    celdas[5].textContent = datos.tipoRiesgo;
    celdas[6].textContent = datos.peligro;
    celdas[7].textContent = datos.aspectoAmbiental;
    celdas[8].textContent = datos.riesgoImpacto;
    celdas[9].textContent = datos.tipoActividad;
    celdas[10].textContent = datos.probabilidad;
    celdas[11].textContent = datos.gravedad;
    celdas[12].textContent = datos.riesgoPuro;
    celdas[13].textContent = datos.evaluacionCuantitativa;
    celdas[14].textContent = datos.eliminacionSustitucion;
    celdas[15].textContent = datos.controlIngenieria;
    celdas[16].textContent = datos.controlesAdministrativos;
    celdas[17].textContent = datos.epp;
    celdas[18].textContent = datos.controlesEspecificados;
    celdas[19].textContent = datos.efectividadControles;
    celdas[20].textContent = datos.columnaIdentificada;
    celdas[21].textContent = datos.riesgoResidual;
    celdas[22].textContent = datos.significanciaResidual;
    celdas[23].textContent = datos.responsable;
    celdas[24].textContent = datos.fechaElaboracion;
}


// Llamar a cargarDesdeLocalStorage al cargar la página
window.addEventListener("load", cargarDesdeLocalStorage);
