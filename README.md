# Mi koala

Juego de mascota virtual para móvil: se cuida a un koala y se le ayuda a crecer resolviendo retos de mates y acertijos.

## Qué tiene

- **Casa**: cuatro necesidades (comer, dormir, divertirse y bañarse). El koala nunca enferma; si se le descuida, se pone triste.
- **Reto de mates**: cinco preguntas variadas con pista al fallar. La dificultad sube o baja sola (niveles 1 a 4).
- **Cruzar el río**: acertijo de lógica con la balsa.
- **Koala saltarín**: juego de saltos para divertirse.
- **Tienda**: ropa para el koala comprada con hojas.

Las hojas se ganan jugando. Las estrellas, que hacen crecer al koala, solo con mates y acertijos.

## Probarlo en el ordenador

```bash
npm start
```

Después se abre http://localhost:5173.

## Cómo está hecho

Web sin dependencias, en la carpeta `docs/`, que es la que publica GitHub Pages. La partida se guarda en el propio móvil.
Instalada desde el navegador funciona sin conexión y, cuando hay internet, se actualiza sola con lo último publicado.
