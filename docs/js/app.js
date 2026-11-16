// Arranque y navegación. Cada pantalla es una dirección (#/casa, #/juegos...) para que funcione el botón Atrás del móvil.
(function () {
  var app = document.getElementById('app');
  var actual = null;

  K.pantallas.bienvenida = {
    pintar: function (raiz) {
      raiz.innerHTML = '<section class="pantalla bienvenida centro">' +
        K.koalaSVG({ ancho: 190, puesto: K.estado.puesto, etiqueta: 'Un koala bebé' }) +
        '<h1 class="titulo-grande">¡Hola!</h1>' +
        '<p style="font-size:16px;line-height:23px">Este koala acaba de llegar al bosque y necesita a alguien que lo cuide.</p>' +
        '<form class="columna" style="width:100%"><label for="nombre">¿Qué nombre le pones?</label>' +
        '<input id="nombre" maxlength="12" autocomplete="off" autocapitalize="words">' +
        '<button class="boton" type="submit">Empezar</button></form></section>';
      raiz.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = raiz.querySelector('#nombre').value.trim();
        if (!nombre) { raiz.querySelector('#nombre').focus(); return; }
        K.estado.nombre = nombre;
        K.estado.visto = Date.now();
        K.guardar();
        ir();
      });
    }
  };

  function ir() {
    var ruta = location.hash.replace('#/', '') || 'casa';
    if (!K.estado.nombre) ruta = 'bienvenida';
    if (actual && actual.salir) actual.salir();
    actual = K.pantallas[ruta] || K.pantallas.casa;
    actual.pintar(app);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', ir);
  ir();

  // Modo sin conexión y actualización automática (ver sw.js).
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sin servicio: el juego sigue funcionando con conexión */ });
    });
  }
})();
