// Minijuegos 11 a 20.
(function () {
  var W = 390, H = 560, T = '#3B2A20';
  function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }

  K.mini({
    id: 'punteria', nombre: 'Puntería', meta: 10,
    instr: 'La diana se mueve. Toca para lanzar la bellota cuando pase por encima del koala.',
    init: function (g) { g.s = { tx: 195, tv: 150, n: null }; },
    tap: function (g) { if (!g.s.n) g.s.n = { y: 450 }; },
    update: function (g, dt) {
      var s = g.s;
      s.tx += s.tv * dt;
      if (s.tx < 50 || s.tx > 340) { s.tv *= -1; s.tx = Math.max(50, Math.min(340, s.tx)); }
      if (!s.n) return;
      s.n.y -= 720 * dt;
      if (s.n.y <= 110) {
        var d = Math.abs(s.tx - 195);
        if (d < 38) { g.suma(d < 14 ? 2 : 1); s.tv = (s.tv > 0 ? -1 : 1) * (150 + g.puntos * 14); }
        s.n = null;
      }
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(520);
      g.circ(s.tx, 110, 38, '#F2664B'); g.circ(s.tx, 110, 25, '#FFFFFF'); g.circ(s.tx, 110, 12, '#F2664B');
      g.linea(195, 150, 195, 430, 2, 'rgba(59,42,32,0.25)');
      g.koala(195, 540, 86);
      if (s.n) g.circ(195, s.n.y, 10, '#8A5A3A');
    }
  });

  K.mini({
    id: 'cuenta', nombre: 'Cuenta rápida', meta: 6, dur: 40,
    instr: 'Las hojas aparecen un momento. Cuéntalas y toca cuántas había.',
    nueva: function (g) {
      var s = g.s, n = g.al(5, 13);
      var celdas = g.baraja([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]).slice(0, n);
      s.n = n;
      s.pos = celdas.map(function (c) { return { x: 55 + (c % 5) * 70 + g.r(-12, 12), y: 70 + Math.floor(c / 5) * 85 + g.r(-12, 12), g: g.r(-1.2, 0.4) }; });
      var a = n + g.elige([-1, 1]), b = n + g.elige([-2, 2]);
      s.ops = g.baraja([n, a, b]);
      s.modo = 'ver';
      s.tm = Math.max(1, 1.9 - g.puntos * 0.12);
    },
    init: function (g) { g.s = {}; this.nueva(g); },
    tap: function (g, x, y) {
      var s = g.s;
      if (s.modo !== 'elige' || y < 430 || y > 525) return;
      var i = x < 135 ? 0 : (x < 255 ? 1 : 2);
      if (s.ops[i] === s.n) g.suma(1); else g.aviso();
      this.nueva(g);
    },
    update: function (g, dt) { var s = g.s; if (s.modo === 'ver') { s.tm -= dt; if (s.tm <= 0) s.modo = 'elige'; } },
    draw: function (g) {
      var s = g.s;
      if (s.modo === 'ver') { s.pos.forEach(function (p) { g.hoja(p.x, p.y, 20, p.g); }); g.txt('¡Cuenta!', W / 2, 480, 28); return; }
      g.txt('¿Cuántas hojas había?', W / 2, 220, 28);
      s.ops.forEach(function (n, i) { g.rect(25 + i * 120, 435, 100, 86, 20, '#FFFFFF'); g.txt(n, 75 + i * 120, 480, 40); });
    }
  });

  K.mini({
    id: 'distinto', nombre: 'El distinto', meta: 8, dur: 35,
    instr: 'Todas las bolas son iguales menos una. Encuentra la que tiene otro tono y tócala.',
    nueva: function (g) {
      var s = g.s;
      s.n = g.puntos >= 4 ? 5 : 4;
      s.idx = g.al(0, s.n * s.n - 1);
      s.dif = Math.max(6, 20 - g.puntos * 2);
      s.tono = g.elige([137, 200, 28, 330]);
    },
    init: function (g) { g.s = {}; this.nueva(g); },
    tap: function (g, x, y) {
      var s = g.s, lado = 340 / s.n;
      var c = Math.floor((x - 25) / lado), f = Math.floor((y - 80) / lado);
      if (c < 0 || f < 0 || c >= s.n || f >= s.n) return;
      if (f * s.n + c === s.idx) { g.suma(1); this.nueva(g); } else g.aviso();
    },
    draw: function (g) {
      var s = g.s, lado = 340 / s.n;
      for (var i = 0; i < s.n * s.n; i++) {
        var luz = 52 + (i === s.idx ? s.dif : 0);
        g.circ(25 + (i % s.n + 0.5) * lado, 80 + (Math.floor(i / s.n) + 0.5) * lado, lado * 0.4, 'hsl(' + s.tono + ',45%,' + luz + '%)');
      }
      g.txt('Encuentra la distinta', W / 2, 40, 26);
    }
  });

  K.mini({
    id: 'tambores', nombre: 'Tambores', meta: 18,
    instr: 'Cuando una nota llegue a su tambor, toca ese tambor.',
    init: function (g) { g.s = { n: [], prox: 0.5 }; },
    tap: function (g, x) {
      var s = g.s, c = x < 140 ? 0 : (x < 250 ? 1 : 2), mejor = -1, cerca = 50;
      s.n.forEach(function (n, i) { var d = Math.abs(n.y - 450); if (n.c === c && d < cerca) { cerca = d; mejor = i; } });
      if (mejor >= 0) { s.n.splice(mejor, 1); g.suma(1); s.golpe = c; s.hasta = g.t + 0.12; }
    },
    update: function (g, dt) {
      var s = g.s;
      s.prox -= dt;
      if (s.prox <= 0) { s.prox = Math.max(0.42, 0.7 - g.t * 0.008); s.n.push({ c: g.al(0, 2), y: -25 }); }
      var v = 250 + g.t * 4;
      s.n = s.n.filter(function (n) { n.y += v * dt; return n.y < 520; });
    },
    draw: function (g) {
      var L = [85, 195, 305], c = ['#F2664B', '#FFC53D', '#7CC4D9'], s = g.s;
      L.forEach(function (x, i) {
        g.linea(x, 0, x, 450, 2, 'rgba(59,42,32,0.2)');
        g.circ(x, 450, s.golpe === i && g.t < s.hasta ? 44 : 38, '#FFFFFF');
      });
      s.n.forEach(function (n) { g.circ(L[n.c], n.y, 26, c[n.c]); });
    }
  });

  K.mini({
    id: 'bano', nombre: 'Baño de burbujas', meta: 18,
    instr: 'El koala se ha manchado de barro. Frota con el dedo cada mancha hasta que desaparezca.',
    nuevas: function (g) {
      g.s.m = [];
      for (var i = 0; i < 9; i++) g.s.m.push({ x: g.r(105, 285), y: g.r(215, 480), v: 1 });
    },
    init: function (g) { g.s = {}; this.nuevas(g); },
    update: function (g, dt) {
      var s = g.s;
      if (g.abajo) {
        s.m = s.m.filter(function (m) {
          if (dist(g.px, g.py, m.x, m.y) < 36) m.v -= dt * 3;
          if (m.v <= 0) { g.suma(1); return false; }
          return true;
        });
      }
      if (!s.m.length) this.nuevas(g);
    },
    draw: function (g) {
      g.koala(195, 530, 320);
      g.s.m.forEach(function (m) { g.circ(m.x, m.y, 22, 'rgba(122,85,52,' + (0.35 + 0.6 * m.v) + ')', false); });
      if (g.abajo) { g.circ(g.px, g.py, 24, 'rgba(255,255,255,0.75)'); g.circ(g.px + 20, g.py - 18, 11, 'rgba(255,255,255,0.75)'); }
    },
    fondo: '#CFEAF3'
  });

  K.mini({
    id: 'buho', nombre: 'El búho vigila', meta: 3, dur: 30,
    instr: 'Mantén pulsado para avanzar mientras el búho duerme. Si abre los ojos, ¡quieto!',
    init: function (g) { g.s = { x: 40, modo: 'duerme', tm: 2 }; },
    update: function (g, dt) {
      var s = g.s;
      s.tm -= dt;
      if (s.tm <= 0) {
        if (s.modo === 'duerme') { s.modo = 'alerta'; s.tm = 0.5; }
        else if (s.modo === 'alerta') { s.modo = 'mira'; s.tm = g.r(0.9, 1.5); }
        else { s.modo = 'duerme'; s.tm = g.r(1.3, 2.6); }
      }
      if (g.abajo || g.dir() !== 0) {
        if (s.modo === 'mira') { if (s.x > 40) { s.x = 40; g.aviso(); } }
        else { s.x += 120 * dt; if (s.x >= 340) { g.suma(1); s.x = 40; } }
      }
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(430);
      g.tri(150, 78, 165, 40, 180, 78, '#A9825F'); g.tri(210, 78, 225, 40, 240, 78, '#A9825F');
      g.circ(195, 125, 58, '#A9825F');
      if (s.modo === 'duerme') { g.linea(160, 115, 184, 115, 4); g.linea(206, 115, 230, 115, 4); g.txt('Zzz', 290, 70, 28); }
      else {
        var r = s.modo === 'mira' ? 17 : 9;
        g.circ(172, 115, r, '#FFFFFF'); g.circ(218, 115, r, '#FFFFFF');
        g.circ(172, 115, r * 0.45, T, false); g.circ(218, 115, r * 0.45, T, false);
        if (s.modo === 'mira') g.txt('¡Quieto!', 195, 230, 30, '#A8321A');
      }
      g.tri(187, 135, 203, 135, 195, 150, '#FFC53D');
      g.hoja(350, 410, 20, -0.4); g.hoja(362, 418, 20, 0.5); g.hoja(338, 420, 20, 0.1);
      g.koala(s.x, 433, 74);
    }
  });

  K.mini({
    id: 'trepa', nombre: 'Trepa rápido', meta: 60, dur: 15,
    instr: 'Toca la pantalla lo más rápido que puedas para trepar por el árbol.',
    init: function (g) { g.s = { n: 0 }; },
    tap: function (g) { g.s.n++; g.suma(1); },
    update: function () {},
    draw: function (g) {
      var s = g.s, d = (s.n * 22) % 90;
      g.rect(140, -10, 110, H + 20, 0, '#B5825A');
      for (var y = -90 + d; y < H; y += 90) { g.linea(160, y, 190, y + 14, 3); g.hoja(264, y + 40, 18, 0.5); g.hoja(126, y + 80, 18, 2.6); }
      g.koala(195, 400, 104, s.n % 2 === 1);
      g.txt(Math.floor(s.n / 4) + ' m', 60, 60, 34);
    }
  });

  K.mini({
    id: 'flecha', nombre: 'Para la flecha', meta: 10,
    instr: 'Toca la pantalla justo cuando la flecha esté sobre la zona verde.',
    init: function (g) { g.s = { x: 40, v: 260, z: 180, zw: 70 }; },
    tap: function (g) {
      var s = g.s;
      if (s.x >= s.z && s.x <= s.z + s.zw) {
        g.suma(1);
        s.zw = Math.max(34, 70 - g.puntos * 4);
        s.z = g.r(40, 350 - s.zw);
        s.v = (s.v > 0 ? 1 : -1) * (260 + g.puntos * 22);
      } else g.aviso();
    },
    update: function (g, dt) {
      var s = g.s;
      s.x += s.v * dt;
      if (s.x < 40 || s.x > 350) { s.v *= -1; s.x = Math.max(40, Math.min(350, s.x)); }
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(500);
      g.rect(40, 250, 310, 44, 14, '#FFFFFF');
      g.rect(s.z, 250, s.zw, 44, 0, '#5DB075');
      g.tri(s.x - 16, 212, s.x + 16, 212, s.x, 246, '#F2664B');
      g.linea(s.x, 250, s.x, 294, 4);
      g.koala(195, 520, 110);
    }
  });

  K.mini({
    id: 'orden', nombre: 'En orden', meta: 15, dur: 40,
    instr: 'Toca los números del 1 al 15 en orden, lo más rápido que puedas.',
    init: function (g) {
      var n = g.baraja([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
      g.s = { sig: 1, mal: -1, hasta: 0, c: n.map(function (v, i) { return { n: v, x: 23 + (i % 4) * 88, y: 90 + Math.floor(i / 4) * 108 }; }) };
    },
    tap: function (g, x, y) {
      var s = g.s;
      s.c.forEach(function (c, i) {
        if (!c.n || x < c.x || x > c.x + 80 || y < c.y || y > c.y + 96) return;
        if (c.n === s.sig) { s.sig++; g.suma(1); if (s.sig > 15) g.acabar(); }
        else if (c.n > s.sig) { s.mal = i; s.hasta = g.t + 0.3; }
      });
    },
    update: function () {},
    draw: function (g) {
      var s = g.s;
      g.txt(s.sig <= 15 ? 'Busca el ' + s.sig : '¡Todos!', W / 2, 45, 30);
      s.c.forEach(function (c, i) {
        if (!c.n) return;
        var color = c.n < s.sig ? '#BDE8C4' : (s.mal === i && g.t < s.hasta ? '#F7C3B5' : '#FFFFFF');
        g.rect(c.x, c.y, 80, 96, 18, color);
        g.txt(c.n, c.x + 40, c.y + 50, 38);
      });
    }
  });

  K.mini({
    id: 'gotas', nombre: 'Esquiva las gotas', meta: 22,
    instr: 'Empieza a llover. Arrastra al koala para que no le caiga ninguna gota.',
    init: function (g) { g.s = { x: 195, d: [], prox: 0.4, acc: 0 }; },
    update: function (g, dt) {
      var s = g.s;
      s.x = g.sigue(s.x, dt, 300);
      s.acc += dt;
      if (s.acc >= 1) { s.acc -= 1; g.suma(1); }
      s.prox -= dt;
      if (s.prox <= 0) { s.prox = Math.max(0.16, 0.5 - g.t * 0.012); s.d.push({ x: g.r(15, 375), y: -20, v: g.r(240, 340) }); }
      s.d = s.d.filter(function (d) {
        d.y += d.v * dt;
        if (d.y > 455 && d.y < 525 && Math.abs(d.x - s.x) < 30) { g.suma(-3); g.aviso(); return false; }
        return d.y < 525;
      });
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(520);
      g.koala(s.x, 532, 80);
      s.d.forEach(function (d) { g.elip(d.x, d.y, 8, 13, '#4FA3C4'); });
    },
    fondo: '#B7CDD8'
  });
})();
