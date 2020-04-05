let baraja = [];

let puntosJugador   = 0,
    puntosOrdenador = 0;

const palosBaraja = ['O', 'C', 'E', 'B']; // Array con los palos de la baraja. O: Oro, C: Copas, E: Espadas, B: Bastos.



// Referencias al HTML

// Botones
const btnNuevaPartida = document.querySelector('#btnNuevaPartida');
const btnPedirCarta   = document.querySelector('#btnPedirCarta');
const btnDetener      = document.querySelector('#btnDetener');

// Puntos
const puntosJugadorHTML   = document.querySelectorAll('small')[0];
const puntosOrdenadorHTML = document.querySelectorAll('small')[1];

// Cartas
const divCartasJugador    = document.querySelector('#cartas-jugador');
const divCartasOrdenador  = document.querySelector('#cartas-ordenador');

// Pantalla Final
const puntuacionFinalHTML   = document.querySelector('#puntuacion-ganador');
const ganadorFinalHTML      = document.querySelector('#ganador');


// Función para crear la baraja
const crearBaraja = () => {
    for (let i = 1; i < 13; i++) {
        if (i > 7 && i < 10) {  // No tenemos en cuenta los 8 y los 9, ya que en este juego no se utilizan.
            continue;   
        }

        for (palo of palosBaraja) {
            baraja.push(i + palo);      
        }
    }

    baraja = _.shuffle(baraja); // Utilizo el método shuffle de la función externa underscore para desordenar aleatoriamente el array. 

    // console.log(baraja);
}

crearBaraja();

// Función para pedir carta
const pedirCarta = () => {

    // La primera vez que pido cartas habilito el botón de Pasar / Detener, por defecto está deshabilitado para impedir que pase sin pedir carta.
    if ( baraja.length === 40 ) {
        btnDetener.disabled     = false;
    }

    // Compruebo que la baraja tenga cartas.
    if (baraja.length === 0 ) {
        throw 'No hay cartas en la baraja';        
    }
    //Extraigo la última carta de la baraja y la asigna a una variable.
    let carta = baraja.pop();
    return carta;
}


// Función para dar valor a cada carta
const valorCarta = (carta) => {
    // Extraigo la parte númerica de la carta, quitando el último caracter que es el palo.
    const numCarta = carta.substring( 0, carta.length - 1 );
    // Con un operador ternario asigno el valor a la carta. Si es mayor de 7 es una figura y vale 0.5, si no es que es menor y asigno pasando a integer el numCarta.
    valor = ( numCarta <= 7) ? parseInt( numCarta ) : 0.5;
    // console.log({ valor, numCarta })
    return valor
}


// Función para simular el turno del ordenador
const turnoOrdenador = (puntosJugador) => {

    do {  
        const carta     = pedirCarta();
        const imgCarta  = document.createElement('img');
    
        puntosOrdenador += valorCarta( carta );
        puntosOrdenadorHTML.innerText = puntosOrdenador;
    
        // <img class="carta" src="./assets/img/cartas/11O.png"></img>
        imgCarta.classList.add('carta');
        imgCarta.src = `./assets/img/cartas/${ carta }.png`
    
        // Añado la carta al div de las cartas del jugador.
        divCartasOrdenador.append(imgCarta);

        // Compruebo si el jugador se paso de 7.5, si es así salgo del bucle después de la primera ejecución.
        if (puntosJugador > 7.5) {
            break;
        }

    
    } while (puntosOrdenador < puntosJugador);

    if ( puntosJugador === puntosOrdenador ) {
        // console.log('Empate: Gana el ordenador');
        puntuacionFinalHTML.innerText = puntosOrdenador;
        ganadorFinalHTML.innerText      = 'Ordenador';
    } else if ( puntosJugador > 7.5 ) {
        // console.log('Te has pasado, gana el ordenador');
        puntuacionFinalHTML.innerText = puntosOrdenador;
        ganadorFinalHTML.innerText      = 'Ordenador';
    } else if ( puntosOrdenador > 7.5 ) {
        // console.log('Enhorabuena, has ganado.')
        puntuacionFinalHTML.innerText = puntosJugador;
        ganadorFinalHTML.innerText      = 'Jugador';
    } else {
        // console.log('Gana el ordenador');
        puntuacionFinalHTML.innerText = puntosOrdenador;
        ganadorFinalHTML.innerText      = 'Ordenador';
    }

    $("#pantalla-final").modal();
    

}

// Eventos

btnPedirCarta.addEventListener('click', () => {

    const carta     = pedirCarta();
    const imgCarta  = document.createElement('img');

    puntosJugador += valorCarta( carta );
    //console.log(puntosJugador);
    puntosJugadorHTML.innerText = puntosJugador;

    // <img class="carta" src="./assets/img/cartas/11O.png"></img>
    imgCarta.classList.add('carta');
    imgCarta.src = `./assets/img/cartas/${ carta }.png`

    // Añado la carta al div de las cartas del jugador.
    divCartasJugador.append(imgCarta);

    // Comprobamos si nos hemos pasado de la puntuación pidiendo carta
    if ( puntosJugador > 7.5 ) {
        // console.log('Has perdido')
        // Desactivamos los botones
        btnPedirCarta.disabled  = true;
        btnDetener.disabled     = true;
        //Lanzamos la función del turno del ordenador
        turnoOrdenador(puntosJugador);
    }
});

btnDetener.addEventListener('click', () => {
    
    btnDetener.disabled     = true;
    btnPedirCarta.disabled  = true;
    
    turnoOrdenador(puntosJugador);

})

btnNuevaPartida.addEventListener('click', () => {
    // Borro la baraja y vuelvo a crearla.
    baraja = [];                        
    crearBaraja();                      

    // Restablezco las variables de puntuaciones.
    puntosJugador   = 0;
    puntosOrdenador = 0;

    // Activo los botones
    btnDetener.disabled     = true;    
    btnPedirCarta.disabled  = false;
    
    // Limpio las cartas de jugador, ordenador y las puntuaciones en HTML
    divCartasJugador.innerHTML      = '';
    divCartasOrdenador.innerHTML    = '';
    puntosOrdenadorHTML.innerText   = puntosOrdenador;
    puntosJugadorHTML.innerText     = puntosJugador;

    // Cierro la ventana modal
    $("#pantalla-final").modal('hide');
});