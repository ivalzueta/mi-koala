// Estado de la partida: se guarda en el propio móvil, sin internet.
var K = window.K || {};
window.K = K;

(function () {
  var CLAVE = 'mi-koala-v1';

  K.ETAPAS = [
    { min: 0, nombre: 'Cría', escala: 0.72 },
    { min: 10, nombre: 'Koala bebé', escala: 0.82 },
    { min: 25, nombre: 'Koala joven', escala: 0.9 },
    { min: 50, nombre: 'Koala adulto', escala: 1 },
    { min: 90, nombre: 'Guardián del bosque', escala: 1 }
  ];

  K.ARTICULOS = [
    { id: 'panuelo-amarillo', nombre: 'Pañuelo amarillo', hueco: 'cuello', precio: 0 },
    { id: 'panuelo-rojo', nombre: 'Pañuelo rojo', hueco: 'cuello', precio: 25 },
    { id: 'flor', nombre: 'Flor para la oreja', hueco: 'cabeza', precio: 15 },
    { id: 'sombrero', nombre: 'Sombrero de paja', hueco: 'cabeza', precio: 40 },
    { id: 'gafas', nombre: 'Gafas redondas', hueco: 'cara', precio: 60 },
    { id: 'corona', nombre: 'Corona dorada', hueco: 'cabeza', precio: 150 }
  ];

  // Puntos que baja cada necesidad por hora. Nunca baja de 10: el koala se pone triste, nada más.
  var DESGASTE = { hambre: 5, sueno: 3, diversion: 4, limpieza: 2.5 };
  var MINIMO = 10;

  function nuevo() {
    return {
      nombre: '',
      hojas: 30,
      estrellas: 0,
      nec: { hambre: 55, sueno: 80, diversion: 60, limpieza: 75 },
      visto: Date.now(),
      comprados: ['panuelo-amarillo'],
      puesto: { cuello: 'panuelo-amarillo', cabeza: null, cara: null },
      nivelMates: 1,
      recordSalto: 0,
      rioResuelto: false,
      celebrar: null
    };
  }

  function cargar() {
    var base = nuevo();
    try {
      var guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (guardado && typeof guardado === 'object') {
        for (var k in guardado) base[k] = guardado[k];
        var limpio = nuevo();
        base.nec = Object.assign(limpio.nec, guardado.nec || {});
        base.puesto = Object.assign(limpio.puesto, guardado.puesto || {});
      }
    } catch (e) { /* partida nueva si el guardado no se puede leer */ }
    return base;
  }

  K.estado = cargar();

  K.guardar = function () {
    try { localStorage.setItem(CLAVE, JSON.stringify(K.estado)); } catch (e) { /* sin almacenamiento */ }
  };

  K.desgaste = function () {
    var ahora = Date.now();
    var horas = Math.min(72, Math.max(0, (ahora - K.estado.visto) / 3600000));
    for (var k in DESGASTE) {
      K.estado.nec[k] = Math.max(MINIMO, K.estado.nec[k] - DESGASTE[k] * horas);
    }
    K.estado.visto = ahora;
    K.guardar();
  };

  K.etapa = function () {
    var i = 0;
    for (var n = 0; n < K.ETAPAS.length; n++) if (K.estado.estrellas >= K.ETAPAS[n].min) i = n;
    return { indice: i, actual: K.ETAPAS[i], siguiente: K.ETAPAS[i + 1] || null };
  };

  K.sumarHojas = function (n) {
    K.estado.hojas = Math.max(0, K.estado.hojas + n);
    K.guardar();
  };

  // Suma estrellas de sabiduría. Si el koala cambia de etapa, lo deja apuntado para celebrarlo en casa.
  K.sumarEstrellas = function (n) {
    var antes = K.etapa().indice;
    K.estado.estrellas += n;
    var despues = K.etapa();
    if (despues.indice > antes) K.estado.celebrar = despues.actual.nombre;
    K.guardar();
    return despues.indice > antes;
  };

  K.subirNecesidad = function (clave, cuanto) {
    K.estado.nec[clave] = Math.min(100, K.estado.nec[clave] + cuanto);
    K.guardar();
  };

  K.animo = function () {
    var n = K.estado.nec;
    var minimo = Math.min(n.hambre, n.sueno, n.diversion, n.limpieza);
    var media = (n.hambre + n.sueno + n.diversion + n.limpieza) / 4;
    if (minimo < 30) return 'triste';
    return media >= 65 ? 'feliz' : 'normal';
  };

  // Utilidades compartidas
  K.h = function (texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  K.al = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  K.elige = function (lista) { return lista[Math.floor(Math.random() * lista.length)]; };
  K.baraja = function (lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
})();
