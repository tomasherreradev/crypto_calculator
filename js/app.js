const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


//crear un promise
const obtenerCriptoMonedas = criptomonedas => new Promise ( resolve => {
    resolve(criptomonedas) //este promise, valida que SI se hayan obtenido las criptos
})


document.addEventListener('DOMContentLoaded', function() {
    consultarCripto();

    formulario.addEventListener('submit', submitFormulario);
    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})


function consultarCripto () {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptoMonedas(resultado.Data))
        .then(criptomonedas => selectCriptoMonedas(criptomonedas))
} 


function selectCriptoMonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptoSelect.appendChild(option);

    });
}


function submitFormulario(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //consultar la api para traer los resultados
    consultarApi();
}



function consultarApi() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(contizacion => mostrarCotizacion(contizacion.DISPLAY[criptomoneda][moneda]))

}



function mostrarCotizacion(cotizacion) {
    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, CONVERSIONTYPE} = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioMax = document.createElement('P');
    precioMax.innerHTML = `El precio máximo en el día fue: <span>${HIGHDAY}</span>`;

    const precioMin = document.createElement('P');
    precioMin.innerHTML = `El precio mínimo en el día fue: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `Variación en las últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

    const tipoConversion = document.createElement('P');
    tipoConversion.innerHTML = `Tipo de cotización: <span>${CONVERSIONTYPE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioMax);
    resultado.appendChild(precioMin);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(tipoConversion);
}



function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}


function mostrarAlerta(mensaje) {
    const alertaPrevia = document.querySelector('.error');
    if(!alertaPrevia) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
    
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;

    resultado.appendChild(spinner);
}