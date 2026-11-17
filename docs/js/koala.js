// Dibujo del koala y de los iconos. Todo es SVG generado aquí, sin imágenes externas.
(function () {
  var T = '#3B2A20';

  K.ico = {
    hoja: function (t) {
      t = t || 20;
      return '<svg aria-hidden="true" width="' + t + '" height="' + t + '" viewBox="0 0 24 24"><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" fill="#5DB075" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/><path d="M4 20 14 10" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/></svg>';
    },
    estrella: function (t) {
      t = t || 20;
      return '<svg aria-hidden="true" width="' + t + '" height="' + t + '" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z" fill="#FFC53D" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/></svg>';
    },
    atras: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><path d="M14 5 7 12l7 7" fill="none" stroke="' + T + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    luna: '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="#B9C6F2" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/></svg>',
    pelota: '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#F2664B" stroke="' + T + '" stroke-width="2"/><path d="M4.5 8.5c5 2 10 2 15 0M4.5 15.5c5-2 10-2 15 0" fill="none" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/></svg>',
    gota: '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24"><path d="M12 3c4 5 6.5 8 6.5 11.500a6.500 6.500 0 0 1-13 0C5.500 11 8 8 12 3Z" fill="#7CC4D9" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/></svg>',
    bien: '<svg role="img" aria-label="Correcto" width="28" height="28" viewBox="0 0 24 24"><path d="M4 12.500 10 18 20 6" fill="none" stroke="#1F6B3A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    corazon: '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24"><path d="M12 20.5S3 15 3 9a4.500 4.500 0 0 1 9-1.500A4.500 4.500 0 0 1 21 9c0 6-9 11.500-9 11.500Z" fill="#F2664B" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/></svg>',
    burbuja: '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#DFF3F9" stroke="' + T + '" stroke-width="2"/><circle cx="9" cy="9" r="2.500" fill="#FFFFFF"/></svg>',
    regalo: '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="#F2664B" stroke="' + T + '" stroke-width="2"/><rect x="2" y="6" width="20" height="4" rx="1.500" fill="#FFC53D" stroke="' + T + '" stroke-width="2"/><path d="M12 6v15M12 6C10 2 6 3 8 6M12 6c2-4 6-3 4 0" fill="none" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/></svg>',
    altavoz: function (on) {
      return '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="#FFC53D" stroke="' + T + '" stroke-width="2" stroke-linejoin="round"/>' +
        (on ? '<path d="M16 9c1.500 1.500 1.500 4.500 0 6M18.500 6.500c3 3 3 8 0 11" fill="none" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/>' : '<path d="M16 9l5 6M21 9l-5 6" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/>') + '</svg>';
    },
    mal: '<svg role="img" aria-label="No es esta" width="26" height="26" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="#A8321A" stroke-width="4" stroke-linecap="round"/></svg>'
  };

  var PANUELOS = { 'panuelo-amarillo': '#FFC53D', 'panuelo-rojo': '#E4573D' };

  // Interior del dibujo (sin la etiqueta <svg>), en un lienzo de 240 x 250.
  // opciones: animo ('feliz' | 'normal' | 'triste'), puesto ({cuello, cabeza, cara}), salto (true = brazos arriba)
  K.koalaInterior = function (o) {
    o = o || {};
    var p = o.puesto || {};
    var animo = o.animo || 'feliz';
    var s = '<g stroke="' + T + '" stroke-width="' + (o.trazo || 5) + '" stroke-linejoin="round" stroke-linecap="round">';

    s += '<g class="oreja oi"><circle cx="58" cy="66" r="40" fill="#9FB0BF"/><circle cx="58" cy="68" r="22" fill="#F6D5C9" stroke="none"/></g>';
    s += '<g class="oreja od"><circle cx="182" cy="66" r="40" fill="#9FB0BF"/><circle cx="182" cy="68" r="22" fill="#F6D5C9" stroke="none"/></g>';

    if (o.salto) {
      s += '<ellipse cx="44" cy="150" rx="15" ry="30" fill="#9FB0BF" transform="rotate(-38 44 150)"/>';
      s += '<ellipse cx="196" cy="150" rx="15" ry="30" fill="#9FB0BF" transform="rotate(38 196 150)"/>';
    }
    s += '<ellipse cx="120" cy="184" rx="60" ry="54" fill="#9FB0BF"/>';
    s += '<ellipse cx="120" cy="194" rx="36" ry="36" fill="#F4EBDD" stroke="none"/>';
    if (o.salto) {
      s += '<ellipse cx="80" cy="234" rx="22" ry="14" fill="#8496A6" transform="rotate(-20 80 234)"/>';
      s += '<ellipse cx="160" cy="234" rx="22" ry="14" fill="#8496A6" transform="rotate(20 160 234)"/>';
    } else {
      s += '<ellipse cx="84" cy="232" rx="24" ry="14" fill="#8496A6"/><ellipse cx="156" cy="232" rx="24" ry="14" fill="#8496A6"/>';
      s += '<ellipse cx="62" cy="190" rx="15" ry="28" fill="#9FB0BF" transform="rotate(14 62 190)"/>';
      s += '<ellipse cx="178" cy="190" rx="15" ry="28" fill="#9FB0BF" transform="rotate(-14 178 190)"/>';
    }

    if (PANUELOS[p.cuello]) {
      var c = PANUELOS[p.cuello];
      s += '<path d="M72 146Q120 176 168 146L172 164Q120 196 68 164Z" fill="' + c + '"/>';
      s += '<path d="M150 168l18 26-22 2Z" fill="' + c + '"/>';
    }

    s += '<ellipse cx="120" cy="98" rx="74" ry="62" fill="#9FB0BF"/>';
    s += '<path d="M106 40Q112 22 120 38Q128 20 134 40" fill="#9FB0BF"/>';

    if (animo === 'triste') {
      s += '<path d="M80 86l20 6M160 86l-20 6" fill="none"/>';
    }
    if (o.dormido) {
      s += '<path d="M79 98Q90 106 101 98M139 98Q150 106 161 98" fill="none"/>';
    } else {
      s += '<g class="ojos">';
      s += '<circle cx="90" cy="96" r="11" fill="' + T + '" stroke="none"/><circle cx="150" cy="96" r="11" fill="' + T + '" stroke="none"/>';
      s += '<circle cx="94" cy="92" r="4" fill="#FFFFFF" stroke="none"/><circle cx="154" cy="92" r="4" fill="#FFFFFF" stroke="none"/>';
      s += '</g>';
    }
    s += '<ellipse cx="120" cy="112" rx="15" ry="20" fill="' + T + '" stroke="none"/>';
    s += '<ellipse cx="115" cy="102" rx="4" ry="6" fill="#6B5547" stroke="none"/>';
    s += '<ellipse cx="70" cy="124" rx="11" ry="7" fill="#F29C9C" stroke="none"/><ellipse cx="170" cy="124" rx="11" ry="7" fill="#F29C9C" stroke="none"/>';

    if (o.dormido) s += '<ellipse cx="120" cy="144" rx="6" ry="7" fill="#7A2E2E"/>';
    else if (o.salto || o.risa) s += '<path d="M104 136Q120 160 136 136Z" fill="#7A2E2E"/>';
    else if (animo === 'triste') s += '<path d="M107 148Q120 138 133 148" fill="none"/>';
    else if (animo === 'normal') s += '<path d="M109 142Q120 147 131 142" fill="none"/>';
    else s += '<path d="M106 139Q120 152 134 139" fill="none"/>';

    if (p.cara === 'gafas') {
      s += '<circle cx="90" cy="96" r="21" fill="#B9E3F2" fill-opacity="0.45"/><circle cx="150" cy="96" r="21" fill="#B9E3F2" fill-opacity="0.45"/>';
      s += '<path d="M111 96h18" fill="none"/>';
    }
    if (p.cabeza === 'sombrero') {
      s += '<ellipse cx="120" cy="48" rx="80" ry="14" fill="#F2D27A"/>';
      s += '<path d="M74 46Q74 4 120 4Q166 4 166 46Z" fill="#F2D27A"/>';
      s += '<path d="M76 36Q120 48 164 36" fill="none" stroke="#D9502F" stroke-width="9"/>';
    } else if (p.cabeza === 'corona') {
      s += '<path d="M82 46 76 8l22 16 22-22 22 22 22-16-6 38Z" fill="#FFD86B"/>';
      s += '<circle cx="120" cy="32" r="5" fill="#F2664B"/>';
    } else if (p.cabeza === 'flor') {
      s += '<circle cx="178" cy="22" r="10" fill="#F7A8B8"/><circle cx="194" cy="34" r="10" fill="#F7A8B8"/><circle cx="188" cy="52" r="10" fill="#F7A8B8"/><circle cx="168" cy="52" r="10" fill="#F7A8B8"/><circle cx="162" cy="34" r="10" fill="#F7A8B8"/>';
      s += '<circle cx="178" cy="38" r="9" fill="#FFC53D"/>';
    }
    return s + '</g>';
  };

  K.koalaSVG = function (o) {
    o = o || {};
    var ancho = o.ancho || 120;
    var alto = Math.round(ancho * 250 / 240);
    var etiqueta = o.etiqueta ? ' role="img" aria-label="' + K.h(o.etiqueta) + '"' : ' aria-hidden="true"';
    return '<svg xmlns="http://www.w3.org/2000/svg"' + etiqueta + ' viewBox="0 0 240 250" width="' + ancho + '" height="' + alto + '"' + (o.clase ? ' class="' + o.clase + '"' : '') + '>' + K.koalaInterior(o) + '</svg>';
  };

  // Piezas de pantalla que se repiten
  K.pastillaHojas = function (texto) {
    return '<div class="pastilla">' + K.ico.hoja() + '<span data-hojas>' + (texto === undefined ? Math.floor(K.estado.hojas) : texto) + '</span></div>';
  };
  K.cabecera = function (titulo, destino, derecha) {
    return '<header class="cab"><a class="circulo" href="#/' + destino + '" aria-label="Volver">' + K.ico.atras + '</a><h1>' + titulo + '</h1>' + (derecha || K.pastillaHojas()) + '</header>';
  };
})();
