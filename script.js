let numeros = [];
let anguloActual = 0;
let historial = [];
let girandoContinuo = false;
let velocidadGiro = 20; // grados por frame aprox
let rafId = null;

function iniciar() {
  const inputLimite = document.getElementById("limite");
  const botonGirar = document.getElementById("botonGirar");
  const ruleta = document.getElementById("ruleta");
  const resultado = document.getElementById("resultado");
  const listaHistorial = document.getElementById("listaHistorial");

  const limite = parseInt(inputLimite.value, 10);

  if (isNaN(limite) || limite < 1 || limite > 50) {
    alert("Por favor, elige un número entre 1 y 50.");
    return;
  }

  numeros = Array.from({ length: limite }, (_, i) => i + 1);
  historial = [];
  listaHistorial.innerHTML = "";
  botonGirar.disabled = false;

  ruleta.innerHTML = "";
  const gradosPorNumero = 360 / numeros.length;

  numeros.forEach((num, i) => {
    const segmento = document.createElement("div");
    segmento.className = "segmento";
    segmento.style.transform = `rotate(${i * gradosPorNumero}deg)`;

    const span = document.createElement("span");
    span.innerText = num;
    span.style.transform = `rotate(${-i * gradosPorNumero}deg)`;

    segmento.appendChild(span);
    ruleta.appendChild(segmento);
  });

  resultado.innerText = "Esperando número...";
  ruleta.style.transition = "none";
  ruleta.style.transform = "rotate(0deg)";
  anguloActual = 0;
}

function animarGiro() {
  if (!girandoContinuo) return;

  anguloActual = (anguloActual + velocidadGiro) % 360;
  const ruleta = document.getElementById("ruleta");
  ruleta.style.transition = "none";
  ruleta.style.transform = `rotate(${anguloActual}deg)`;

  rafId = requestAnimationFrame(animarGiro);
}

function girarRuleta() {
  if (numeros.length === 0) return;

  girandoContinuo = true;
  animarGiro();

  const botonGirar = document.getElementById("botonGirar");
  botonGirar.disabled = false; // dejamos activo para poder soltar

  // Cuando se suelte el botón, llamamos a pararGiro para elegir número
  botonGirar.addEventListener("mouseup", pararGiro, { once: true });
  botonGirar.addEventListener("mouseleave", pararGiro, { once: true }); // para caso que salga del botón
}

function pararGiro() {
  girandoContinuo = false;
  cancelAnimationFrame(rafId);

  const ruleta = document.getElementById("ruleta");
  const resultado = document.getElementById("resultado");
  const listaHistorial = document.getElementById("listaHistorial");
  const botonGirar = document.getElementById("botonGirar");

  botonGirar.disabled = true;

  // Calcular la selección basada en anguloActual
  const gradosPorNumero = 360 / numeros.length;
  // Ajustamos el angulo para que 0 esté en la posición superior (puntero)
  let anguloNormalized = (360 - (anguloActual % 360) + gradosPorNumero / 2) % 360;

  // Número seleccionado por la posición
  let seleccion = Math.floor(anguloNormalized / gradosPorNumero);
  if (seleccion >= numeros.length) seleccion = numeros.length -1;
  const numeroSeleccionado = numeros[seleccion];

  // Animación suave para alinear ruleta en ángulo exacto
  const anguloFinal = 360 * 5 + (360 - seleccion * gradosPorNumero - gradosPorNumero / 2);

  ruleta.style.transition = "transform 3s cubic-bezier(0.33, 1, 0.68, 1)";
  ruleta.style.transform = `rotate(${anguloFinal}deg)`;
  anguloActual = anguloFinal % 360;

  setTimeout(() => {
    resultado.innerText = `🎯 Número seleccionado: ${numeroSeleccionado}`;

    // Añadir a historial
    historial.push(numeroSeleccionado);
    const li = document.createElement("li");
    li.innerText = numeroSeleccionado;
    listaHistorial.appendChild(li);

    // Quitar número ya usado
    numeros.splice(seleccion, 1);

    // Revisar si quedan números
    if (numeros.length === 0) {
      resultado.innerText += " (Todos los números ya salieron)";
      botonGirar.disabled = true;
    } else {
      botonGirar.disabled = false;  // Volver a activar
    }
  }, 3000);
}
