// Tienda del bosque: comprar ropa con hojas y ponérsela al koala.
(function () {
  var raiz;
  var G = '<g stroke="#3B2A20" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  function panuelo(color) {
    return G + '<path d="M12 22Q32 36 52 22L54 32Q32 48 10 32Z" fill="' + color + '"/><path d="M40 36l10 16-14 0Z" fill="' + color + '"/></g>';
  }
  var DIBUJO = {
    'panuelo-amarillo': panuelo('#FFC53D'),
    'panuelo-rojo': panuelo('#E4573D'),
    flor: G + '<circle cx="32" cy="16" r="7" fill="#F7A8B8"/><circle cx="46" cy="27" r="7" fill="#F7A8B8"/><circle cx="41" cy="43" r="7" fill="#F7A8B8"/><circle cx="23" cy="43" r="7" fill="#F7A8B8"/><circle cx="18" cy="27" r="7" fill="#F7A8B8"/><circle cx="32" cy="31" r="8" fill="#FFC53D"/></g>',
    sombrero: G + '<path d="M16 42Q16 16 32 16Q48 16 48 42Z" fill="#F2D27A"/><ellipse cx="32" cy="43" rx="28" ry="8" fill="#F2D27A"/><path d="M17 35Q32 41 47 35" fill="none" stroke="#D9502F" stroke-width="5"/></g>',
    gafas: G + '<circle cx="20" cy="32" r="12" fill="#B9E3F2"/><circle cx="44" cy="32" r="12" fill="#B9E3F2"/><path d="M32 30v4M8 30 4 26M56 30l4-4" fill="none"/></g>',
    corona: G + '<path d="M12 44 8 20l14 10 10-16 10 16 14-10-4 24Z" fill="#FFD86B"/><path d="M12 44h40v8H12Z" fill="#FFC53D"/><circle cx="32" cy="36" r="3" fill="#F2664B"/></g>'
  };

  function lleva() {
    var nombres = K.ARTICULOS.filter(function (a) { return K.estado.puesto[a.hueco] === a.id; }).map(function (a) { return a.nombre.toLowerCase(); });
    return nombres.length ? nombres.join(', ') : 'nada, va al natural';
  }

  function pulsar(id) {
    var a = K.ARTICULOS.filter(function (x) { return x.id === id; })[0];
    var e = K.estado;
    if (e.comprados.indexOf(id) < 0) {
      if (e.hojas < a.precio) return;
      e.hojas -= a.precio;
      e.comprados.push(id);
      e.puesto[a.hueco] = id;
    } else {
      e.puesto[a.hueco] = e.puesto[a.hueco] === id ? null : id;
    }
    K.guardar();
    dibujar();
  }

  function dibujar() {
    var e = K.estado;
    var h = '<section class="pantalla">' + K.cabecera('Tienda', 'casa');
    h += '<div class="tarjeta probador">' + K.koalaSVG({ ancho: 110, puesto: e.puesto, trazo: 6, etiqueta: e.nombre + ' con su ropa' }) +
      '<div class="datos"><b>' + K.h(e.nombre) + ' lleva puesto</b><span>' + K.h(lleva()) + '</span></div></div>';
    h += '<div class="articulos">';
    K.ARTICULOS.forEach(function (a) {
      var tiene = e.comprados.indexOf(a.id) >= 0;
      var puesto = e.puesto[a.hueco] === a.id;
      var boton;
      if (puesto) boton = '<button class="boton puesto" data-a="' + a.id + '">Puesto · quitar</button>';
      else if (tiene) boton = '<button class="boton blanco" data-a="' + a.id + '">Ponérselo</button>';
      else if (e.hojas >= a.precio) boton = '<button class="boton" data-a="' + a.id + '">' + K.ico.hoja(16) + '<span>' + a.precio + ' hojas</span></button>';
      else boton = '<button class="boton" disabled>' + a.precio + ' · te faltan ' + Math.ceil(a.precio - e.hojas) + '</button>';
      h += '<div class="tarjeta articulo"><svg aria-hidden="true" width="60" height="60" viewBox="0 0 64 64">' + DIBUJO[a.id] + '</svg><span>' + a.nombre + '</span>' + boton + '</div>';
    });
    h += '</div></section>';
    raiz.innerHTML = h;
    raiz.querySelectorAll('[data-a]').forEach(function (b) {
      b.addEventListener('click', function () { pulsar(b.getAttribute('data-a')); });
    });
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.tienda = { pintar: function (app) { raiz = app; dibujar(); } };
})();
