// Minijuegos 1 a 10. Cada uno: init (preparar), update (lógica por fotograma), draw (dibujar) y tap (toque) si lo usa.
// "meta" es la puntuación que da el máximo de hojas.
(function () {
  var W = 390, H = 560, T = '#3B2A20';
  function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }
  function pinchos(g, x, y, r) {
    for (var a = 0; a < 8; a++) g.linea(x + Math.cos(a * 0.785) * r, y + Math.sin(a * 0.785) * r, x + Math.cos(a * 0.785) * (r + 9), y + Math.sin(a * 0.785) * (r + 9), 3);
  }

  K.mini({
    id: 'lluvia', nombre: 'Lluvia de hojas', meta: 15,
    instr: 'Arrastra al koala para atrapar hojas con la cesta. ¡Las piñas restan!',
    init: function (g) { g.s = { x: 195, c: [], prox: 0 }; },
    update: function (g, dt) {
      var s = g.s;
      s.x = g.sigue(s.x, dt, 300);
      s.prox -= dt;
      if (s.prox <= 0) { s.prox = g.r(0.35, 0.7); s.c.push({ x: g.r(30, 360), y: -20, v: g.r(150, 230) + g.t * 4, mala: Math.random() < 0.25 }); }
      s.c = s.c.filter(function (o) {
        o.y += o.v * dt;
        if (o.y > 425 && o.y < 470 && Math.abs(o.x - s.x) < 44) {
          if (o.mala) { g.suma(-2); g.aviso(); } else g.suma(1);
          return false;
        }
        return o.y < H + 20;
      });
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(520);
      g.koala(s.x, 532, 84);
      g.rect(s.x - 42, 432, 84, 30, 8, '#D9A45B');
      s.c.forEach(function (o) { if (o.mala) g.elip(o.x, o.y, 13, 17, '#8A5A3A'); else g.hoja(o.x, o.y, 15); });
    }
  });

  K.mini({
    id: 'mariposas', nombre: 'Caza mariposas', meta: 22,
    instr: 'Toca las mariposas antes de que se escapen. Cada vez vuelan más rápido.',
    init: function (g) {
      g.s = { m: [] };
      var colores = ['#F7A8B8', '#FFC53D', '#B9C6F2', '#F2664B', '#7CC4D9'];
      for (var i = 0; i < 5; i++) g.s.m.push({ x: g.r(40, 350), y: g.r(60, 500), vx: g.r(-90, 90), vy: g.r(-90, 90), c: colores[i], f: i });
    },
    tap: function (g, x, y) {
      g.s.m.forEach(function (m) {
        if (dist(x, y, m.x, m.y) < 38) { g.suma(1); m.x = g.r(40, 350); m.y = g.r(60, 500); m.vx *= 1.1; m.vy *= 1.1; }
      });
    },
    update: function (g, dt) {
      g.s.m.forEach(function (m) {
        m.x += m.vx * dt; m.y += m.vy * dt;
        if (m.x < 24 || m.x > W - 24) m.vx *= -1;
        if (m.y < 24 || m.y > H - 24) m.vy *= -1;
        m.x = Math.max(24, Math.min(W - 24, m.x)); m.y = Math.max(24, Math.min(H - 24, m.y));
      });
    },
    draw: function (g) {
      g.suelo(500);
      g.s.m.forEach(function (m) {
        var a = 0.35 + 0.65 * Math.abs(Math.sin(g.t * 9 + m.f));
        g.elip(m.x - 12 * a, m.y, 12 * a + 2, 17, m.c);
        g.elip(m.x + 12 * a, m.y, 12 * a + 2, 17, m.c);
        g.elip(m.x, m.y, 3.5, 13, T);
      });
    }
  });

  K.mini({
    id: 'wombat', nombre: 'Toca al wombat', meta: 22,
    instr: 'Toca a los wombats que asoman. ¡A los erizos con pinchos no!',
    init: function (g) {
      g.s = { h: [], prox: 0.5 };
      [170, 320, 470].forEach(function (y) { [105, 285].forEach(function (x) { g.s.h.push({ x: x, y: y, hasta: 0, tipo: '' }); }); });
    },
    tap: function (g, x, y) {
      g.s.h.forEach(function (h) {
        if (g.t < h.hasta && dist(x, y, h.x, h.y - 8) < 54) {
          if (h.tipo === 'erizo') { g.suma(-2); g.aviso(); } else g.suma(1);
          h.hasta = 0;
        }
      });
    },
    update: function (g, dt) {
      var s = g.s;
      s.prox -= dt;
      if (s.prox <= 0) {
        s.prox = g.r(0.4, 0.8);
        var libres = s.h.filter(function (h) { return g.t >= h.hasta; });
        if (libres.length) { var h = g.elige(libres); h.hasta = g.t + Math.max(0.6, 1.15 - g.t * 0.015); h.tipo = Math.random() < 0.22 ? 'erizo' : 'wombat'; }
      }
    },
    draw: function (g) {
      g.s.h.forEach(function (h) {
        if (g.t < h.hasta) {
          if (h.tipo === 'erizo') {
            pinchos(g, h.x, h.y - 8, 32);
            g.circ(h.x, h.y - 8, 32, '#6B5547');
          } else {
            g.circ(h.x - 26, h.y - 36, 11, '#A9825F'); g.circ(h.x + 26, h.y - 36, 11, '#A9825F');
            g.circ(h.x, h.y - 8, 36, '#A9825F');
            g.elip(h.x, h.y, 9, 6, T);
          }
          g.circ(h.x - 12, h.y - 16, 4, '#FFFFFF', false); g.circ(h.x + 12, h.y - 16, 4, '#FFFFFF', false);
          g.circ(h.x - 12, h.y - 16, 2, T, false); g.circ(h.x + 12, h.y - 16, 2, T, false);
        }
        g.elip(h.x, h.y + 26, 60, 18, '#5A4636');
      });
    },
    fondo: '#8CCB8A'
  });

  K.mini({
    id: 'caminos', nombre: 'Tres caminos', meta: 20,
    instr: 'Toca a la izquierda o a la derecha para cambiar de camino y esquivar las rocas.',
    init: function (g) { g.s = { c: 1, o: [], prox: 0.8 }; },
    tap: function (g, x) { g.s.c = Math.max(0, Math.min(2, g.s.c + (x < W / 2 ? -1 : 1))); },
    update: function (g, dt) {
      var s = g.s;
      s.prox -= dt;
      if (s.prox <= 0) { s.prox = Math.max(0.45, 0.85 - g.t * 0.012); s.o.push({ c: g.al(0, 2), y: -30 }); }
      var v = 240 + g.t * 7;
      s.o = s.o.filter(function (o) {
        o.y += v * dt;
        if (o.y > 430 && o.y < 500 && o.c === s.c) { g.suma(-2); g.aviso(); return false; }
        if (o.y > H + 30) { g.suma(1); return false; }
        return true;
      });
    },
    draw: function (g) {
      var L = [85, 195, 305], s = g.s;
      g.rect(30, -10, 330, H + 20, 0, '#E9D7AE');
      g.linea(140, 0, 140, H, 3); g.linea(250, 0, 250, H, 3);
      s.o.forEach(function (o) { g.circ(L[o.c], o.y, 25, '#9A9A9A'); });
      g.koala(L[s.c], 505, 76);
    },
    fondo: '#8CCB8A'
  });

  K.mini({
    id: 'globos', nombre: 'Explota globos', meta: 28,
    instr: 'Toca los globos para explotarlos. ¡Las castañas con pinchos restan!',
    init: function (g) { g.s = { b: [], prox: 0 }; },
    tap: function (g, x, y) {
      var s = g.s;
      for (var i = s.b.length - 1; i >= 0; i--) {
        if (dist(x, y, s.b[i].x, s.b[i].y) < 36) {
          if (s.b[i].mala) { g.suma(-2); g.aviso(); } else g.suma(1);
          s.b.splice(i, 1);
          return;
        }
      }
    },
    update: function (g, dt) {
      var s = g.s;
      s.prox -= dt;
      if (s.prox <= 0) {
        s.prox = g.r(0.35, 0.6);
        s.b.push({ x: g.r(40, 350), y: H + 34, v: g.r(110, 190) + g.t * 3, mala: Math.random() < 0.2, c: g.elige(['#F2664B', '#FFC53D', '#7CC4D9', '#F7A8B8', '#5DB075']) });
      }
      s.b = s.b.filter(function (b) { b.y -= b.v * dt; return b.y > -50; });
    },
    draw: function (g) {
      g.s.b.forEach(function (b) {
        if (b.mala) { pinchos(g, b.x, b.y, 22); g.circ(b.x, b.y, 22, '#8A5A3A'); }
        else { g.linea(b.x, b.y + 30, b.x, b.y + 62, 2); g.elip(b.x, b.y, 24, 30, b.c); }
      });
    }
  });

  K.mini({
    id: 'eco', nombre: 'Eco del bosque', meta: 5, dur: 45,
    instr: 'Mira qué colores se encienden y repítelos en el mismo orden.',
    init: function (g) { g.s = { seq: [g.al(0, 3), g.al(0, 3)], modo: 'ver', i: 0, tm: 0.8, luz: -1, hasta: 0 }; },
    tap: function (g, x, y) {
      var s = g.s;
      if (s.modo !== 'tocar') return;
      var k = (x < W / 2 ? 0 : 1) + (y < 270 ? 0 : 2);
      if (y < 85 || y > 455) return;
      s.luz = k; s.hasta = g.t + 0.2;
      if (k === s.seq[s.i]) {
        s.i++;
        if (s.i === s.seq.length) { g.suma(1); s.seq.push(g.al(0, 3)); s.modo = 'ver'; s.i = 0; s.tm = 0.9; }
      } else { g.aviso(); s.modo = 'ver'; s.i = 0; s.tm = 0.9; }
    },
    update: function (g, dt) {
      var s = g.s;
      if (s.modo !== 'ver') return;
      s.tm -= dt;
      if (s.tm <= 0) {
        if (s.i < s.seq.length) { s.luz = s.seq[s.i]; s.hasta = g.t + 0.45; s.i++; s.tm = 0.7; }
        else { s.modo = 'tocar'; s.i = 0; }
      }
    },
    draw: function (g) {
      var s = g.s, c = ['#F2664B', '#FFC53D', '#5DB075', '#7CC4D9'], apagado = ['#F3C4B8', '#F6E3B0', '#C4DFCB', '#CFE6EE'];
      for (var k = 0; k < 4; k++) {
        var on = s.luz === k && g.t < s.hasta;
        g.rect(40 + (k % 2) * 160, 95 + Math.floor(k / 2) * 180, 150, 170, 26, on ? c[k] : apagado[k]);
        if (on) g.circ(115 + (k % 2) * 160, 180 + Math.floor(k / 2) * 180, 22, '#FFFFFF');
      }
      g.txt(s.modo === 'ver' ? 'Mira con atención...' : '¡Tu turno!', W / 2, 50, 26);
      g.txt('Colores seguidos: ' + s.seq.length, W / 2, 500, 20);
    }
  });

  K.mini({
    id: 'parejas', nombre: 'Parejas del bosque', meta: 6, dur: 45,
    instr: 'Toca dos cartas para darles la vuelta. Encuentra todas las parejas.',
    init: function (g) {
      var cartas = g.baraja([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
      g.s = { c: cartas.map(function (k, i) { return { k: k, x: 20 + (i % 3) * 122, y: 22 + Math.floor(i / 3) * 132, vista: false, hecha: false }; }), sel: [], espera: 0, fin: 0 };
    },
    tap: function (g, x, y) {
      var s = g.s;
      if (s.espera > 0) return;
      s.c.forEach(function (c) {
        if (s.sel.length < 2 && !c.vista && !c.hecha && x > c.x && x < c.x + 106 && y > c.y && y < c.y + 116) { c.vista = true; s.sel.push(c); }
      });
      if (s.sel.length === 2) {
        if (s.sel[0].k === s.sel[1].k) {
          s.sel[0].hecha = s.sel[1].hecha = true; s.sel = []; g.suma(1);
          if (s.c.every(function (c) { return c.hecha; })) s.fin = g.t + 0.6;
        } else s.espera = 0.7;
      }
    },
    update: function (g, dt) {
      var s = g.s;
      if (s.espera > 0) { s.espera -= dt; if (s.espera <= 0) { s.sel.forEach(function (c) { c.vista = false; }); s.sel = []; } }
      if (s.fin && g.t > s.fin) g.acabar();
    },
    draw: function (g) {
      g.s.c.forEach(function (c) {
        var cx = c.x + 53, cy = c.y + 58;
        if (!c.vista && !c.hecha) { g.rect(c.x, c.y, 106, 116, 16, '#FFC53D'); g.hoja(cx, cy, 20); return; }
        g.rect(c.x, c.y, 106, 116, 16, c.hecha ? '#BDE8C4' : '#FFFFFF');
        if (c.k === 0) g.circ(cx, cy, 26, '#F2664B');
        else if (c.k === 1) g.hoja(cx, cy, 30);
        else if (c.k === 2) g.tri(cx, cy - 30, cx + 30, cy + 24, cx - 30, cy + 24, '#FFC53D');
        else if (c.k === 3) g.elip(cx, cy, 16, 30, '#7CC4D9');
        else if (c.k === 4) g.rect(cx - 26, cy - 26, 52, 52, 8, '#F7A8B8');
        else { g.circ(cx, cy, 28, '#B9C6F2'); g.circ(cx, cy, 11, '#FFFFFF'); }
      });
    }
  });

  K.mini({
    id: 'troncos', nombre: 'Salta los troncos', meta: 12,
    instr: 'Toca la pantalla para saltar por encima de los troncos.',
    init: function (g) { g.s = { y: 0, vy: 0, o: [], prox: 1 }; },
    tap: function (g) { if (g.s.y === 0) g.s.vy = -640; },
    update: function (g, dt) {
      var s = g.s;
      s.vy += 1700 * dt; s.y += s.vy * dt;
      if (s.y > 0) { s.y = 0; s.vy = 0; }
      s.prox -= dt;
      if (s.prox <= 0) { s.prox = g.r(0.9, 1.6); s.o.push({ x: W + 30 }); }
      var v = 230 + g.t * 5;
      s.o = s.o.filter(function (o) {
        o.x -= v * dt;
        if (Math.abs(o.x - 90) < 36 && s.y > -34) { g.suma(-1); g.aviso(); return false; }
        if (o.x < 50 && !o.contado) { o.contado = true; g.suma(1); }
        return o.x > -40;
      });
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(440);
      s.o.forEach(function (o) { g.rect(o.x - 19, 404, 38, 36, 9, '#B5825A'); });
      g.koala(90, 443 + s.y, 78, s.y < 0);
    }
  });

  K.mini({
    id: 'pesca', nombre: 'Día de pesca', meta: 14,
    instr: 'La barca se mueve sola. Toca para soltar el anzuelo justo encima de un pez.',
    init: function (g) {
      g.s = { bx: 195, d: 1, a: null, f: [] };
      for (var i = 0; i < 5; i++) g.s.f.push(this.pez(g));
    },
    pez: function (g) { var d = Math.random() < 0.5 ? -1 : 1; return { x: g.r(0, W), y: g.r(230, 510), v: d * g.r(50, 120) }; },
    tap: function (g) { if (!g.s.a) g.s.a = { x: g.s.bx, y: 125, v: 460, pez: false }; },
    update: function (g, dt) {
      var s = g.s, yo = this;
      s.f.forEach(function (f) { f.x += f.v * dt; if (f.x < -30) f.x = W + 30; if (f.x > W + 30) f.x = -30; });
      if (!s.a) { s.bx += s.d * 120 * dt; if (s.bx < 55 || s.bx > 335) s.d *= -1; return; }
      var a = s.a;
      a.y += a.v * dt;
      if (!a.pez) {
        for (var i = 0; i < s.f.length; i++) {
          if (dist(a.x, a.y, s.f[i].x, s.f[i].y) < 27) { a.pez = true; a.v = -500; s.f[i] = yo.pez(g); break; }
        }
      }
      if (a.y > 535) a.v = -500;
      if (a.y <= 125 && a.v < 0) { if (a.pez) g.suma(1); s.a = null; }
    },
    draw: function (g) {
      var s = g.s;
      g.rect(-5, 135, W + 10, H, 0, '#7CC4D9');
      s.f.forEach(function (f) {
        var c = f.v > 0 ? -1 : 1;
        g.tri(f.x + c * 16, f.y, f.x + c * 32, f.y - 11, f.x + c * 32, f.y + 11, '#F2A65A');
        g.elip(f.x, f.y, 20, 11, '#F2A65A');
      });
      if (s.a) { g.linea(s.a.x, 120, s.a.x, s.a.y, 2); if (s.a.pez) g.elip(s.a.x, s.a.y + 8, 11, 20, '#F2A65A'); else g.circ(s.a.x, s.a.y, 6, '#FFFFFF'); }
      g.koala(s.bx, 118, 62);
      g.rect(s.bx - 48, 108, 96, 30, 12, '#B5825A');
    }
  });

  K.mini({
    id: 'equilibrio', nombre: 'Equilibrio en el tronco', meta: 25, dur: 30,
    instr: 'Mantén pulsado un lado de la pantalla para que el koala no se caiga del tronco.',
    init: function (g) { g.s = { a: 0, w: 0, viento: 0, cambio: 0, caido: 0, acc: 0 }; },
    update: function (g, dt) {
      var s = g.s;
      if (s.caido > 0) { s.caido -= dt; if (s.caido <= 0) { s.a = 0; s.w = 0; } return; }
      s.cambio -= dt;
      if (s.cambio <= 0) { s.viento = g.r(-1.6, 1.6) * (1 + g.t * 0.03); s.cambio = g.r(0.6, 1.3); }
      s.w += (3.2 * s.a + s.viento + 7 * g.dir()) * dt;
      s.a += s.w * dt;
      if (Math.abs(s.a) > 1.05) { s.caido = 1; g.suma(-3); g.aviso(); return; }
      s.acc += dt;
      if (s.acc >= 1) { s.acc -= 1; g.suma(1); }
    },
    draw: function (g) {
      var s = g.s;
      g.suelo(480);
      g.circ(195, 446, 36, '#B5825A');
      g.koala(195, 414, 120, false, s.a);
      if (s.caido > 0) g.txt('¡Ups! Otra vez arriba', W / 2, 120, 26);
      g.txt('◀', 40, 300, 34); g.txt('▶', 350, 300, 34);
    }
  });
})();
