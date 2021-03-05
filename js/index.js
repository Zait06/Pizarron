var miCanvas = document.querySelector('#pizarron');
var btn_borrar = document.querySelector('#borrar');
var txt_tam = document.querySelector("#txt_tam");
var txt_tam_bor = document.querySelector("#txt_tam_bor");
var div_colores = document.querySelector("#colores");
var cuadros = document.getElementsByName("cuadro")

var lineas = [];    // Memoria 
var correccionX = 0;
var correccionY = 0;
var superIndex = 0;
var pintarLinea = false;

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
correccionX = posicion.x;
correccionY = posicion.y;

miCanvas.width = window.innerWidth;
miCanvas.height = window.innerHeight;


/**
 * Funcion que empieza a dibujar la linea
 */
function empezarDibujo() {
    pintarLinea = true;
    lineas.push([]);
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

/**
 * Funcion dibuja la linea
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
            nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
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

// Carga de la página
window.onload = cargar();

// Eventos de colores
btn_borrar.addEventListener('click', borrarPizarron);

cuadros.forEach((cuadro)=>{
    cuadro.addEventListener('click', (e)=>{
        e.preventDefault();
        // console.log(cuadro.value);
        grosor = cuadro.value == colores.length-1 ? txt_tam_bor.value : txt_tam.value;
        superIndex = cuadro.value;
        lineas = [];
        configuraciones();
    })
})

// Eventos de input
txt_tam.addEventListener('input', cambiarTam);
txt_tam_bor.addEventListener('input', cambiarBor)

// Eventos raton
miCanvas.addEventListener('mousedown', empezarDibujo, false);
miCanvas.addEventListener('mousemove', dibujarLinea, false);
miCanvas.addEventListener('mouseup', pararDibujar, false);

// Eventos pantallas táctiles
miCanvas.addEventListener('touchstart', empezarDibujo, false);
miCanvas.addEventListener('touchmove', dibujarLinea, false);