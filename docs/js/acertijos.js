// 50 acertijos para pensar. Cada uno: [pregunta, opciones, posición de la correcta, pista, explicación].
(function () {
  var LISTA = [
    ['Un granjero tiene 5 gallinas y 3 conejos. ¿Cuántas patas hay en total?', ['16', '22', '26', '32'], 1, 'Las gallinas tienen 2 patas y los conejos, 4.', '5 gallinas son 10 patas y 3 conejos son 12. En total, 22.'],
    ['Tengo agujas pero no coso, tengo números pero no soy un cuaderno. ¿Qué soy?', ['Un reloj', 'Un erizo', 'Una regla', 'Un pino'], 0, 'Me miras para no llegar tarde.', 'El reloj tiene agujas y números.'],
    ['Si hoy es miércoles, ¿qué día será dentro de 10 días?', ['Viernes', 'Sábado', 'Domingo', 'Lunes'], 1, 'Dentro de 7 días vuelve a ser miércoles.', '7 días después es miércoles otra vez, y 3 días más es sábado.'],
    ['El padre de Ana tiene 4 hijas: Lala, Lele, Lili y... ¿cómo se llama la cuarta?', ['Lolo', 'Lulu', 'Ana', 'Lola'], 2, 'Lee otra vez el principio de la pregunta.', 'Es el padre de Ana, así que la cuarta hija es Ana.'],
    ['¿Qué pesa más: un kilo de plumas o un kilo de piedras?', ['Las plumas', 'Las piedras', 'Pesan lo mismo', 'Depende del tamaño'], 2, 'Fíjate en la cantidad, no en el material.', 'Un kilo es un kilo, sea de lo que sea.'],
    ['En una carrera adelantas al que va segundo. ¿En qué puesto vas ahora?', ['Primero', 'Segundo', 'Tercero', 'Último'], 1, 'Ocupas el sitio del corredor al que adelantas.', 'Te pones en su lugar: vas segundo. El primero sigue delante.'],
    ['Un caracol sube por un pozo de 5 metros. Cada día sube 3 metros y cada noche resbala 2. ¿Qué día llega arriba?', ['El segundo día', 'El tercer día', 'El cuarto día', 'El quinto día'], 1, 'El último día llega arriba antes de que llegue la noche.', 'Tras dos días está a 2 metros. El tercer día sube 3 y llega a los 5.'],
    ['¿Cuántos meses del año tienen 28 días?', ['Solo 1', '2', '6', 'Los 12'], 3, 'La pregunta no dice «solo 28 días».', 'Todos los meses tienen al menos 28 días.'],
    ['Hay 3 manzanas en la mesa y tú coges 2. ¿Cuántas manzanas tienes tú?', ['1', '2', '3', '5'], 1, 'No preguntan cuántas quedan en la mesa.', 'Tú tienes las 2 que has cogido.'],
    ['Cuanto más le quitas, más grande se hace. ¿Qué es?', ['Un agujero', 'Una montaña', 'Un pastel', 'Una sombra'], 0, 'Piensa en una pala y un montón de tierra.', 'Un agujero crece cuanta más tierra le quitas.'],
    ['Dos padres y dos hijos van a pescar. Cada uno pesca un pez, pero en total hay 3 peces. ¿Cómo es posible?', ['Uno no pescó nada', 'Son abuelo, padre e hijo', 'Un pez se escapó', 'Contaron mal'], 1, 'Una misma persona puede ser padre e hijo a la vez.', 'Son tres personas: el abuelo, el padre y el hijo.'],
    ['¿Qué número sigue? 1, 1, 2, 3, 5, 8, ...', ['10', '11', '13', '16'], 2, 'Suma los dos números anteriores.', '5 + 8 = 13. Cada número es la suma de los dos anteriores.'],
    ['En un cajón hay 6 calcetines rojos y 6 azules mezclados. A oscuras, ¿cuántos tienes que sacar para estar seguro de tener dos del mismo color?', ['2', '3', '7', '12'], 1, 'Solo hay dos colores.', 'Con 3 calcetines y solo 2 colores, al menos dos coinciden.'],
    ['Tengo ciudades pero no casas, ríos pero no agua y montañas pero no piedras. ¿Qué soy?', ['Un mapa', 'Un sueño', 'Un cuento', 'Un país'], 0, 'Me usas para no perderte.', 'En un mapa todo está dibujado.'],
    ['Si 3 koalas se comen 3 hojas en 3 minutos, ¿cuánto tardan 6 koalas en comerse 6 hojas?', ['2 minutos', '3 minutos', '6 minutos', '9 minutos'], 1, 'Cada koala tarda 3 minutos en comerse su hoja.', 'Cada koala tarda 3 minutos con su hoja, sean 3 koalas o 6.'],
    ['Un ladrillo pesa 1 kilo más medio ladrillo. ¿Cuánto pesa el ladrillo?', ['1 kilo', '1 kilo y medio', '2 kilos', '3 kilos'], 2, 'Si medio ladrillo más 1 kilo es el ladrillo entero, ese kilo es la otra mitad.', 'Medio ladrillo pesa 1 kilo, así que el ladrillo entero pesa 2.'],
    ['¿Qué sube y baja sin moverse del sitio?', ['La escalera', 'El ascensor', 'La pelota', 'El pájaro'], 0, 'La usas para cambiar de piso, pero ella se queda donde está.', 'La escalera sube y baja, pero nunca se mueve.'],
    ['Tengo 6 caras pero no me maquillo, y 21 puntos sin estar enfermo. ¿Qué soy?', ['Un dado', 'Una mariquita', 'Un cubo de hielo', 'Un dominó'], 0, 'Me lanzas en los juegos de mesa.', '1 + 2 + 3 + 4 + 5 + 6 = 21 puntos en las seis caras del dado.'],
    ['¿Qué número vale 3 más si lo pones boca abajo?', ['3', '6', '8', '9'], 1, 'Dale la vuelta a cada número en tu cabeza.', 'El 6 boca abajo es un 9.'],
    ['Un tren eléctrico va hacia el norte y el viento sopla hacia el sur. ¿Hacia dónde va el humo?', ['Hacia el norte', 'Hacia el sur', 'Hacia arriba', 'No echa humo'], 3, 'Fíjate en qué tipo de tren es.', 'Los trenes eléctricos no echan humo.'],
    ['Pedro es más alto que Luis. Luis es más alto que Marta. ¿Quién es el más bajo?', ['Pedro', 'Luis', 'Marta', 'No se puede saber'], 2, 'Ponlos en fila, de mayor a menor.', 'El orden es Pedro, Luis y Marta. Marta es la más baja.'],
    ['Tienes una jarra de 5 litros y otra de 3. ¿Cómo mides justo 2 litros?', ['Llenando la de 3 dos veces', 'Llenando la de 5 y pasando agua a la de 3', 'Llenando las dos a la vez', 'No se puede'], 1, '¿Cuánto es 5 menos 3?', 'Llenas la de 5 y viertes en la de 3 hasta llenarla: en la grande quedan 2.'],
    ['Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera. ¿Qué fruta es?', ['La pera', 'El kiwi', 'La uva', 'El limón'], 0, 'La respuesta está escondida en la última palabra.', '«Es-pera»: la pera.'],
    ['Oro parece, plata no es. ¿Qué fruta es?', ['La naranja', 'El plátano', 'El melón', 'La piña'], 1, 'Lee despacio: «plata-no-es».', '«Plata no es»: el plátano.'],
    ['Un pastor tiene 17 ovejas. Se le escapan todas menos 9. ¿Cuántas le quedan?', ['8', '9', '17', '26'], 1, 'Lee con calma: «todas menos 9».', 'Si se escapan todas menos 9, le quedan 9.'],
    ['Si me nombras, desaparezco. ¿Qué soy?', ['El silencio', 'La sombra', 'El eco', 'El viento'], 0, 'En cuanto hablas, ya no estoy.', 'Al decir cualquier palabra, el silencio se rompe.'],
    ['¿Cuántos cuadrados hay en total en un tablero de 2 por 2 casillas?', ['4', '5', '6', '8'], 1, 'No cuentes solo los pequeños.', 'Hay 4 pequeños y 1 grande que los contiene a todos: 5.'],
    ['Dos números suman 10 y, si los restas, da 2. ¿Cuáles son?', ['5 y 5', '6 y 4', '7 y 3', '8 y 2'], 1, 'Prueba cada pareja: tiene que cumplir las dos cosas.', '6 + 4 = 10 y 6 − 4 = 2.'],
    ['Pienso un número, le sumo 4 y multiplico el resultado por 2. Me sale 18. ¿Qué número pensé?', ['5', '7', '9', '11'], 0, 'Hazlo al revés: divide entre 2 y luego resta 4.', '18 entre 2 es 9, y 9 menos 4 es 5.'],
    ['Una rana está en el escalón 1 y salta de 3 en 3. ¿En qué escalón estará después de 3 saltos?', ['7', '9', '10', '12'], 2, 'Empieza en el 1, no en el 0.', '1, 4, 7 y 10. Después de tres saltos está en el 10.'],
    ['¿Qué se moja mientras seca?', ['La toalla', 'El sol', 'El secador', 'La esponja'], 0, 'La usas al salir de la ducha.', 'La toalla te seca a ti y ella se queda mojada.'],
    ['Vuelo sin alas y lloro sin ojos. ¿Qué soy?', ['La nube', 'El avión', 'La cometa', 'El murciélago'], 0, 'Cuando «lloro», sacas el paraguas.', 'La nube va por el cielo y, cuando llueve, parece que llora.'],
    ['Tiene dientes y no come, tiene cabeza y no es persona. ¿Qué es?', ['El ajo', 'El peine', 'El tornillo', 'El clavo'], 0, 'Se usa para cocinar.', 'El ajo tiene cabeza y dientes.'],
    ['Cuatro amigos se dan la mano, todos con todos, una sola vez. ¿Cuántos apretones de manos hay?', ['4', '6', '8', '12'], 1, 'El primero saluda a 3, el segundo a 2 nuevos...', '3 + 2 + 1 = 6 apretones.'],
    ['El doble de un número más 1 es 15. ¿Cuál es el número?', ['6', '7', '8', '14'], 1, 'Quita primero el 1 y luego busca la mitad.', '15 − 1 = 14, y la mitad de 14 es 7.'],
    ['Un nenúfar se hace el doble de grande cada día y tarda 10 días en cubrir todo el estanque. ¿Qué día cubría la mitad?', ['El día 5', 'El día 8', 'El día 9', 'El día 10'], 2, 'Si hoy cubre todo, ¿cuánto cubría ayer?', 'El día 9 cubría la mitad; al doblarse, el día 10 lo cubre todo.'],
    ['Tienes una vela, una chimenea y una lámpara de aceite, y solo una cerilla. ¿Qué enciendes primero?', ['La vela', 'La chimenea', 'La lámpara', 'La cerilla'], 3, '¿Con qué vas a encender todo lo demás?', 'Antes que nada hay que encender la cerilla.'],
    ['Un gallo pone un huevo en lo más alto de un tejado. ¿Hacia qué lado cae el huevo?', ['Hacia la izquierda', 'Hacia la derecha', 'No cae', 'Los gallos no ponen huevos'], 3, 'Piensa en quién pone los huevos.', 'Los huevos los ponen las gallinas, no los gallos.'],
    ['¿Qué número falta? 2, 4, 8, 16, __, 64', ['20', '24', '32', '48'], 2, 'Cada número es el doble del anterior.', '16 × 2 = 32, y 32 × 2 = 64.'],
    ['Salen de noche sin que nadie las llame y se pierden de día sin que nadie las robe. ¿Qué son?', ['Las estrellas', 'Los búhos', 'Los sueños', 'Los murciélagos'], 0, 'Mira al cielo cuando no hay nubes.', 'Las estrellas se ven de noche y de día dejan de verse.'],
    ['Tres amigos cruzan un puente de noche con un solo farol. Caben dos a la vez, van al paso del más lento y alguien tiene que volver con el farol. El koala tarda 1 minuto, el canguro 2 y la tortuga 5. ¿Cuál es el menor tiempo para que crucen los tres?', ['7 minutos', '8 minutos', '9 minutos', '12 minutos'], 1, 'Que el farol lo lleve de vuelta siempre el más rápido.', 'Koala y canguro cruzan (2), vuelve el koala (1) y cruza con la tortuga (5): 8 minutos.'],
    ['Una balanza está equilibrada: en un lado hay 3 manzanas y en el otro 1 manzana y una pesa de 200 gramos. ¿Cuánto pesa una manzana?', ['50 gramos', '100 gramos', '150 gramos', '200 gramos'], 1, 'Quita una manzana de cada lado: la balanza sigue equilibrada.', 'Quedan 2 manzanas frente a 200 gramos: cada una pesa 100.'],
    ['Luma tiene 9 años y su hermano 3. ¿Cuántos años tendrá Luma cuando su hermano tenga justo la mitad que ella?', ['10', '12', '15', '18'], 1, 'Siempre se llevan 6 años.', 'Cuando el hermano tenga 6, Luma tendrá 12.'],
    ['Con 3 cortes rectos, ¿cuál es el máximo de trozos que puedes sacar de una pizza?', ['6', '7', '8', '9'], 1, 'Los cortes no tienen por qué pasar por el centro.', 'Si los tres cortes se cruzan en puntos distintos salen 7 trozos.'],
    ['¿Qué tiene un ojo y no puede ver?', ['La aguja', 'El pirata', 'La patata', 'La cerradura'], 0, 'Por ese ojo pasa un hilo.', 'El agujero de la aguja se llama ojo.'],
    ['Cuentas de 5 en 5 empezando por el 5. ¿Qué número dices en décimo lugar?', ['45', '50', '55', '100'], 1, 'Es como la tabla del 5.', '5 × 10 = 50.'],
    ['En una mano hay 5 dedos. ¿Cuántos dedos hay en 10 manos?', ['10', '50', '55', '100'], 1, 'No vayas deprisa: son manos, no personas.', '10 manos por 5 dedos son 50 dedos.'],
    ['¿Qué hay entre la playa y el mar?', ['La arena', 'Las olas', 'La letra «y»', 'Las conchas'], 2, 'Mira bien las palabras de la pregunta.', 'Entre las palabras «playa» y «mar» está la letra «y».'],
    ['Un koala duerme 20 horas al día. ¿Cuántas horas pasa despierto en una semana?', ['24', '28', '40', '140'], 1, 'Primero calcula cuántas horas está despierto cada día.', 'Está despierto 4 horas al día, y 4 × 7 = 28.'],
    ['Luma mira un reloj de agujas en el espejo y ve las 3 en punto. ¿Qué hora es de verdad?', ['Las 3 en punto', 'Las 6 en punto', 'Las 9 en punto', 'Las 12 en punto'], 2, 'El espejo cambia la izquierda por la derecha.', 'En el espejo el 3 y el 9 se intercambian: son las 9.']
  ];

  var POR_SESION = 3;
  var raiz, s;

  function pendientes() {
    var lista = [];
    for (var i = 0; i < LISTA.length; i++) if (!K.estado.acertijos[i]) lista.push(i);
    return lista;
  }

  function empezar() {
    var p = pendientes();
    var repaso = p.length === 0;
    var ids = repaso ? K.baraja(LISTA.map(function (_, i) { return i; })).slice(0, POR_SESION) : p.slice(0, POR_SESION);
    s = { ids: ids, i: 0, repaso: repaso, estrellas: 0, hojas: 0, fin: false };
    cargar();
  }

  // Los acertijos hablan de «Luma»; se cambia por el nombre que le haya puesto la niña.
  function conNombre(texto) { return texto.replace(/Luma/g, K.estado.nombre); }

  function cargar() {
    var a = LISTA[s.ids[s.i]];
    s.ops = K.baraja(a[1].map(function (texto, k) { return { texto: texto, bien: k === a[2] }; }));
    s.mal = {}; s.ok = false; s.premio = '';
  }

  function elegir(k) {
    if (s.ok) return;
    if (!s.ops[k].bien) { s.mal[k] = true; dibujar(); return; }
    var id = s.ids[s.i];
    var limpio = Object.keys(s.mal).length === 0;
    s.ok = true;
    if (s.repaso) { K.sumarHojas(2); s.hojas += 2; s.premio = '+2 hojas'; }
    else if (limpio) { K.estado.acertijos[id] = true; K.sumarHojas(5); K.sumarEstrellas(1); s.hojas += 5; s.estrellas++; s.premio = '+1 estrella y +5 hojas'; }
    else { K.estado.acertijos[id] = true; K.sumarHojas(3); s.hojas += 3; s.premio = '+3 hojas'; }
    K.guardar();
    dibujar();
  }

  function siguiente() {
    if (s.i < s.ids.length - 1) { s.i++; cargar(); } else s.fin = true;
    dibujar();
  }

  function dibujar() {
    var resueltos = LISTA.length - pendientes().length;
    var h = '<section class="pantalla">' + K.cabecera('Acertijos', 'juegos', '<div class="pastilla" style="font-size:15px">' + resueltos + ' de ' + LISTA.length + '</div>');
    if (s.fin) {
      h += '<div class="tarjeta columna centro" style="padding:24px 18px;border-radius:24px">' + K.ico.estrella(64) +
        '<h2 class="titulo-grande">¡Bien pensado!</h2>' +
        '<p>Has ganado ' + s.hojas + ' hojas' + (s.estrellas ? ' y ' + s.estrellas + (s.estrellas === 1 ? ' estrella' : ' estrellas') + ' de sabiduría' : '') + '.</p>' +
        (resueltos === LISTA.length ? '<p>¡Has resuelto los 50 acertijos! Puedes repasarlos para ganar más hojas.</p>' : '<p>Te quedan ' + (LISTA.length - resueltos) + ' acertijos por descubrir.</p>') +
        '<button class="boton" style="width:100%" data-mas>Más acertijos</button>' +
        '<a class="boton blanco" style="width:100%" href="#/casa">Volver con ' + K.h(K.estado.nombre) + '</a></div>';
    } else {
      var a = LISTA[s.ids[s.i]];
      var fallos = Object.keys(s.mal).length > 0;
      h += '<p class="sub" style="font-size:14px;font-weight:800">Acertijo ' + (s.i + 1) + ' de ' + s.ids.length + (s.repaso ? ' · repaso' : '') + '</p>';
      h += '<div class="tarjeta acertijo">' + K.h(conNombre(a[0])) + '</div>';
      h += '<div class="columna" style="gap:10px">';
      s.ops.forEach(function (o, k) {
        var ok = s.ok && o.bien, mal = !!s.mal[k];
        h += '<button class="respuesta-a' + (ok ? ' ok' : '') + (mal ? ' mal' : '') + '" data-k="' + k + '"><span>' + K.h(o.texto) + '</span>' + (ok ? K.ico.bien : '') + (mal ? K.ico.mal : '') + '</button>';
      });
      h += '</div><div aria-live="polite" class="columna">';
      if (s.ok) h += '<div class="tarjeta mensaje bien">' + K.h(conNombre(a[4])) + ' ' + s.premio + '.</div><button class="boton" data-sig>' + (s.i < s.ids.length - 1 ? 'Siguiente acertijo' : 'Terminar') + '</button>';
      else if (fallos) h += '<div class="tarjeta mensaje aviso">Pista: ' + K.h(a[3]) + '</div>';
      else h += '<p class="sub" style="text-align:center;font-size:14px">Piénsalo con calma. Si aciertas a la primera, ganas una estrella.</p>';
      h += '</div>';
    }
    h += '</section>';
    raiz.innerHTML = h;
    raiz.querySelectorAll('[data-k]').forEach(function (b) {
      b.addEventListener('click', function () { elegir(Number(b.getAttribute('data-k'))); });
    });
    var sig = raiz.querySelector('[data-sig]');
    if (sig) sig.addEventListener('click', siguiente);
    var mas = raiz.querySelector('[data-mas]');
    if (mas) mas.addEventListener('click', function () { empezar(); dibujar(); });
  }

  K.ACERTIJOS = LISTA;
  K.pantallas = K.pantallas || {};
  K.pantallas.acertijos = { pintar: function (app) { raiz = app; empezar(); dibujar(); } };
})();
