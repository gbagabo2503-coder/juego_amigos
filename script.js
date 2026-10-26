
const menu = document.getElementById("menu");
const partida = document.getElementById("partida");
const nombreJuego = document.getElementById("nombreJuego");
const pregunta = document.getElementById("pregunta");
const contador = document.getElementById("contador");
const estado = document.getElementById("estado");

let datos = null;
let cartasDisponibles = [];
let juegoActual = "";
let numeroPregunta = 0;

const nombres = {
  quien_es_mas_probable: "¿Quién es más probable?",
  yo_nunca_nunca: "Yo nunca nunca",
  verdad_o_reto: "Verdad o reto",
  simon_dice: "Simón dice",
  cartas_sorpresa: "Cartas sorpresa"
};

// Cargar las preguntas desde el archivo JSON.
async function cargarDatos() {
  try {
    const respuesta = await fetch("./datos/pack_juegos_fiesta_500.json");

    if (!respuesta.ok) {
      throw new Error("No se encontró el archivo JSON.");
    }

    datos = await respuesta.json();

    estado.textContent = "¡Contenido cargado correctamente!";
  } catch (error) {
    estado.textContent =
      "No se pudo cargar el contenido. Revisa la carpeta datos y usa Live Server.";
    console.error(error);
  }
}

// Mezclar las preguntas para que salgan aleatoriamente.
function mezclar(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

// Abrir el minijuego seleccionado.
function iniciarJuego(clave) {
  if (!datos) {
    estado.textContent = "Espera a que se carguen las preguntas.";
    return;
  }

  juegoActual = clave;
  cartasDisponibles = mezclar(datos.games[clave]);
  numeroPregunta = 0;

  nombreJuego.textContent = nombres[clave];
  menu.hidden = true;
  partida.hidden = false;
  estado.textContent = "";

  mostrarSiguiente();
}

// Mostrar una pregunta sin repetirla en esta partida.
function mostrarSiguiente() {
  if (cartasDisponibles.length === 0) {
    pregunta.textContent =
      "¡Has terminado todas las preguntas de este juego!";
    contador.textContent = "Partida completada";
    estado.textContent = "Vuelve al menú para jugar otra categoría.";
    return;
  }

  const elemento = cartasDisponibles.pop();
  numeroPregunta++;

  pregunta.textContent = elemento.text;
  contador.textContent =
    `Pregunta ${numeroPregunta} · Quedan ${cartasDisponibles.length}`;
}

// Botones de selección de minijuego.
menu.querySelectorAll("button[data-juego]").forEach(boton => {
  boton.addEventListener("click", () => {
    iniciarJuego(boton.dataset.juego);
  });
});

// Siguiente pregunta.
document.getElementById("siguiente").addEventListener("click", () => {
  mostrarSiguiente();
});

// Volver al menú.
document.getElementById("volver").addEventListener("click", () => {
  partida.hidden = true;
  menu.hidden = false;
  estado.textContent = "";
});

cargarDatos();
