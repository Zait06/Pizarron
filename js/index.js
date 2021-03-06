var miCanvas = document.querySelector('#pizarron');
var btn_borrar = document.querySelector('#borrar');
var txt_tam = document.querySelector("#txt_tam");
var txt_tam_bor = document.querySelector("#txt_tam_bor");
var div_colores = document.querySelector("#colores");
var cuadros = document.getElementsByName("cuadro");
var open_modal_text = document.getElementById("open_modal_text");
var insertar = document.getElementById("insertar_elem");

var lineas = [];    // Memoria 
var correccionX = 0;
var correccionY = 0;
var superIndex = 0;
var pintarLinea = false;
var enPizarron = false;
var bool_insertar = false;
var elemento_insertar = null;
var tipo_elemento = 0;
var config_elemento = {};

// Colores
var colores = [
    '#000',
    '#f00',
    '#090',
    '#639',
    '#06f',
    '#963',
    '#fff'
];

// Grosor del trazo
var grosor = 5;

// Marca el nuevo punto
var nuevaPosicionX = 0;
var nuevaPosicionY = 0;

var posicion = miCanvas.getBoundingClientRect()
console.log(posicion);
correccionX = posicion.x;
correccionY = posicion.y;

miCanvas.width = window.innerWidth;
miCanvas.height = window.innerHeight;


/**
 * Funcion que empieza a dibujar la linea
 */
function empezarDibujo() {
    if(!bool_insertar){
        pintarLinea = true;
        lineas.push([]);
    }
};

/**
 * Funcion que guarda la posicion de la nueva línea
 */
function guardarLinea() {
    lineas[lineas.length - 1].push({
        x: nuevaPosicionX,
        y: nuevaPosicionY
    });
}

function insertarTexto(e) {
    let ctx = miCanvas.getContext('2d');
    ctx.font = `${config_elemento.estilo} ${config_elemento.tam}px ${config_elemento.familia}`;
    ctx.fillStyle = `${config_elemento.color}`;
    // Marca el nuevo punto
    if (e.changedTouches == undefined) {
        // Versión ratón
        nuevaPosicionX = e.layerX;
        nuevaPosicionY = e.layerY;
    } else {
        // Versión touch, pantalla tactil
        nuevaPosicionX = e.changedTouches[0].pageX - correccionX;
        nuevaPosicionY = e.changedTouches[0].pageY - correccionY - 100;
    }
    ctx.fillText(elemento_insertar,nuevaPosicionX,nuevaPosicionY);
}

/**
 * Inserta un elemento al area de trabajo
 */
function insertarElementoCanvas(e){
    if(bool_insertar){
        switch (tipo_elemento) {
            case 1:
                insertarTexto(e);
            break;
            default:
            break;
        }
    }
    bool_insertar = false;
}

/**
 * Funcion que dibuja lineas
 */
function dibujarLinea(event) {
    event.preventDefault();
    if (pintarLinea) {
        let ctx = miCanvas.getContext('2d');
        // Estilos de linea
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = grosor;
        // Color de la linea
        ctx.strokeStyle = colores[superIndex];
        // Marca el nuevo punto
        if (event.changedTouches == undefined) {
            // Versión ratón
            nuevaPosicionX = event.layerX;
            nuevaPosicionY = event.layerY;
        } else {
            // Versión touch, pantalla tactil
            nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
            nuevaPosicionY = event.changedTouches[0].pageY - correccionY - 100;
        }
        // Guarda la linea
        guardarLinea();
        
        // Redibuja todas las lineas guardadas
        ctx.beginPath();
        lineas.forEach(function (segmento) {
            ctx.moveTo(segmento[0].x, segmento[0].y);
            segmento.forEach(function (punto, index) {
                ctx.lineTo(punto.x, punto.y);
            });
        });
        ctx.stroke();
    }
}

/**
 * Funcion que deja de dibujar la linea
 */
function pararDibujar () {
    pintarLinea = false;
    guardarLinea();
}

/**
 * Funcion para borrar el pizarron
 */
function borrarPizarron(){
    lineas = [];
    let ctx = miCanvas.getContext('2d');
    ctx.clearRect(0, 0, miCanvas.width, miCanvas.height);
}

/**
 * Funcion para cambiar el grosor de la linea
 */
function cambiarTam(){
    lineas = [];
    let t = document.getElementById("txt_tam");
    let gr = t.value;
    grosor = gr;
    configuraciones();
}

/**
 * Funcion para cambiar el grosor del borrador
 */
function cambiarBor(){
    lineas = [];
    grosor = txt_tam_bor.value;
    configuraciones();
}

/**
 * Colores
 */
function selecColores(){
    let divColor = ``;
    colores.forEach((color,index)=>{
        divColor += `<button class="cuadro" style="background-color: ${color};" name="cuadro" value=${index}></button>&nbsp;`;
    });
    document.getElementById("colores").innerHTML = divColor;
}

/**
 * Funcion para ver las configuraciones
 */
function configuraciones(){
    let tipo = superIndex == colores.length-1 ? "Borrador" : "Color del trazo";
    let config = `${tipo}: <div class="cuadro" style="background-color:${colores[superIndex]}"></div>`
    config += `Tamaño: ${grosor}`;
    document.getElementById("config_actual").innerHTML = config;
}

function cargar(){
    selecColores();
    configuraciones();
}

function puntero(e){
    enPizarron = !enPizarron;
    if(enPizarron)
        document.documentElement.style.cursor = "crosshair";
    else
    document.documentElement.style.cursor = "default";
}

function modalTexto(){
    let cuerpo = `<div class="input-group">
            <span class="input-group-text">Estilo</span>
            <select id="estilo" class="form-select form-select-sm" aria-label="estilo">
                <option selected>Estilo de letra</option>
                <option value="">Normal</option>
                <option value="bold"><b>Negritas</b></option>
                <option value="italic"><i>Italica</i></option>
            </select>
            <span class="input-group-text">Tamaño</span>
            <input type="number" class="form-control" id="text_size" value="20">
            <span class="input-group-text">px</span>
        </div>
        <div class="input-group">
            <span class="input-group-text">Familia</span>
            <select id="familia" class="form-select form-select-sm" aria-label="familia">
                <option selected>Familia de la letra</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="times">Times</option>
                <option value="courier">Courier</option>
            </select>
            <span class="input-group-text">Color</span>
            <input type="color" class="form-control form-control-color" id="color_text" value="#000000" title="Elige el color del texto">
        </div>
        <br>
        <div class="input-group">
            <span class="input-group-text">Texto</span>
            <input type="text" class="form-control" id="text_insertar">
        </div>`;
    cuerpo += `<p>Una vez dado click en insertar, diríjace al espacio de trabajo y click donde se insertará el texto</p>`;
    return cuerpo;
}

/**
 * Insertar texto en canvas
 */
function abrirModal(tipo){
    tipo_elemento = tipo;
    var contenido;
    switch (tipo) {
        case 1:
            document.getElementById("my-modal-title").innerHTML = `Ingrese el texto a insertar`
            contenido = modalTexto();
        break;
    
        default:
            document.getElementById("my-modal-title").innerHTML = `Puede haber un error`;
            contenido = `...`
        break;
    }
    document.getElementById("modal-body").innerHTML = contenido;
}

/**
 * Inserta un elemento
 */
function insertarElemento(){
    config_elemento = {};
    switch (tipo_elemento) {
        case 1:
            elemento_insertar = document.getElementById("text_insertar").value
            config_elemento = {
                estilo: document.getElementById("estilo").value,
                tam: document.getElementById("text_size").value,
                familia: document.getElementById("familia").value,
                color: document.getElementById("color_text").value
            }
            bool_insertar = true;
        break;
        default:
            bool_insertar = false;
        break;
    }
}

// Carga de la página
window.onload = cargar();

// Eventos de botones
btn_borrar.addEventListener('click', borrarPizarron);
cuadros.forEach((cuadro)=>{
    cuadro.addEventListener('click', (e)=>{
        e.preventDefault();
        grosor = cuadro.value == colores.length-1 ? txt_tam_bor.value : txt_tam.value;
        superIndex = cuadro.value;
        lineas = [];
        configuraciones();
    })
});
open_modal_text.addEventListener('click', () => {abrirModal(1);});
insertar.addEventListener('click', insertarElemento)

// Eventos de input
txt_tam.addEventListener('input', cambiarTam);
txt_tam_bor.addEventListener('input', cambiarBor)

// Eventos raton
miCanvas.addEventListener('mousedown', empezarDibujo, false);
miCanvas.addEventListener('mousemove', dibujarLinea, false);
miCanvas.addEventListener('mouseup', pararDibujar, false);
miCanvas.addEventListener('mouseover', puntero, false);
miCanvas.addEventListener('mouseout', puntero, false);
miCanvas.addEventListener('click', insertarElementoCanvas);

// Eventos pantallas táctiles
miCanvas.addEventListener('touchstart', empezarDibujo, false);
miCanvas.addEventListener('touchmove', dibujarLinea, false);
miCanvas.addEventListener('touchend', pararDibujar, false)