// Menú de juegos, en tres grupos.
(function () {
  function fila(destino, ficha, color, nombre, texto) {
    return '<a class="juego" href="#/' + destino + '"><span class="ficha" style="background:' + color + '" aria-hidden="true">' + ficha + '</span>' +
      '<span class="datos"><b>' + nombre + '</b><span>' + texto + '</span></span></a>';
  }

  function pintar(app) {
    var flecha = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 20V5M5 11l7-7 7 7" fill="none" stroke="#3B2A20" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var record = K.estado.recordSalto ? ' Tu récord: ' + K.estado.recordSalto + ' m.' : '';
    var h = '<section class="pantalla">' + K.cabecera('Juegos', 'casa');
    h += '<div class="seccion"><h2>Para divertirse</h2>' +
      fila('salto', flecha, '#FFC53D', 'Koala saltarín', 'Salta de rama en rama hasta lo más alto.' + record) + '</div>';
    h += '<div class="seccion"><h2>Mates</h2>' +
      fila('mates', '×', '#BFE6F2', 'Reto de mates', 'Cinco preguntas para ganar hojas y una estrella. Nivel ' + K.estado.nivelMates + '.') + '</div>';
    h += '<div class="seccion"><h2>Acertijos para pensar</h2>' +
      fila('rio', '?', '#BDE8C4', 'Cruzar el río', K.estado.rioResuelto ? 'Ya lo resolviste. ¿Lo repites en menos viajes?' : 'Lleva a todos al otro lado en la balsa.') + '</div>';
    h += '<p class="sub" style="text-align:center;margin-top:auto">Las estrellas hacen crecer a ' + K.h(K.estado.nombre) + '. Se ganan con las mates y los acertijos.</p>';
    h += '</section>';
    app.innerHTML = h;
  }

  K.pantallas = K.pantallas || {};
  K.pantallas.juegos = { pintar: pintar };
})();
