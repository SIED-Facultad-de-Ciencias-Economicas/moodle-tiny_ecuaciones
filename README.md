# Editor de ecuaciones para Moodle (`tiny_ecuaciones`)

Plugin para el editor TinyMCE de Moodle que permite armar fórmulas en forma gráfica, con botones como los de una calculadora
científica, sin saber LaTeX. Lo pueden usar los docentes en recursos y actividades, y los alumnos
en foros, tareas, wikis y preguntas de ensayo de los cuestionarios.

SIED · Facultad de Ciencias Económicas · Universidad Nacional de Cuyo.

![La ventana para escribir una fórmula](docs/ventana.png)

## Qué hace

- Suma un botón **Fórmula** (√x) a la barra del editor y al menú **Insertar**.
- La fórmula se arma **en forma gráfica**: se elige un botón (fracción, potencia, raíz…) y se
  completan los casilleros que aparecen, viendo en todo momento la fórmula como va a quedar. No
  hace falta conocer ningún atajo ni código. Los botones están en seis solapas: Básico,
  Funciones, Cálculo, Griegas, Conjuntos y matrices, y **Economía y finanzas** (interés compuesto,
  tasa efectiva, valor actual, VAN, TIR, elasticidad, costo marginal, promedio, desvío y regresión).
- Al pie, chico como una nota, se puede ver y editar el **código LaTeX**, para quien lo sepa usar.
- Las fórmulas se ven dibujadas **dentro del editor**, y con doble clic se vuelven a editar.
- En celulares y tabletas aparece un teclado matemático en pantalla.
- Si quedan casilleros sin completar, la ventana lo avisa y no inserta la fórmula.
- Toda la interfaz está en español y en inglés.

![Las fórmulas dibujadas dentro del editor](docs/editor.png)

## Cómo se guarda (y por qué)

La fórmula se guarda como **texto LaTeX** entre `\( … \)` (en línea) o `\[ … \]` (centrada). En la
página la dibuja el **filtro MathJax** que trae Moodle. El plugin no deja ningún rastro propio en el
contenido:

- **Sobrevive a la limpieza de HTML.** Moodle limpia con HTMLPurifier lo que escriben los alumnos, y
  ese filtro descarta SVG y MathML. El texto LaTeX pasa intacto.
- **No hay dependencia.** Si algún día se desinstala el plugin, las fórmulas se siguen viendo
  igual, y el editor de ecuaciones de Moodle las puede seguir editando.
- **Es el formato de Moodle.** Las fórmulas escritas antes con `\( \)`, `\[ \]` o `$$ $$` también se
  dibujan en el editor y se pueden editar con este plugin.

## Requisitos

- **Moodle 5.3** (TinyMCE 8). Es la versión en la que se probó. Probablemente ande en 5.0, 5.1 y
  5.2, que usan la misma interfaz de plugins del editor, pero no se probó. Para instalarlo en una
  de esas versiones hay que bajar `$plugin->requires` en `version.php`.
- El filtro **«MathJax»** activo (Administración del sitio → Extensiones → Filtros). Viene activo
  de fábrica. Si no lo está, la ventana avisa que las fórmulas se van a ver como código.
- Nada más: no lleva base de datos propia, ni tareas programadas, ni servicios externos. MathLive
  viene incluido en el plugin (`vendor/mathlive`) y se sirve desde el mismo Moodle, sin CDN.

## Instalación

El nombre de la carpeta tiene que ser **`ecuaciones`**.

**Opción A — desde la administración de Moodle.** Administración del sitio → Extensiones →
Instalar complementos → subir `tiny_ecuaciones-<versión>.zip` → seguir los pasos.

**Opción B — en el servidor.**

```bash
cd <raíz de Moodle>/public/lib/editor/tiny/plugins
```

```bash
git clone https://github.com/SIED-Facultad-de-Ciencias-Economicas/moodle-tiny_ecuaciones.git ecuaciones
```

```bash
php <raíz de Moodle>/admin/cli/upgrade.php
```

En Moodle 5.0 y anteriores la carpeta es `lib/editor/tiny/plugins` (sin `public/`).

### Después de instalar

- El botón aparece solo, para todos los usuarios (permiso `tiny/ecuaciones:use`, que por defecto
  tiene el rol «Usuario autenticado», igual que el editor de ecuaciones de Moodle).
- **Recomendado:** desactivar el «Editor de ecuaciones» de Moodle (`tiny_equation`) en la lista de
  complementos del editor TinyMCE (Administración del sitio → Extensiones → Editores de texto).
  Si se dejan los dos, docentes y alumnos ven dos botones de fórmula. Son compatibles: guardan en
  el mismo formato.
- **MathJax:** Moodle lo carga desde un CDN (`cdn.jsdelivr.net`). Si la red del campus lo bloquea,
  se puede alojar MathJax en el propio servidor y apuntar el ajuste `filter_mathjaxloader/httpsurl` a esa copia.

## Qué no hace

- **App Moodle:** la app no usa TinyMCE, así que el botón no aparece ahí. Las fórmulas sí se ven.
- **Preguntas de respuesta corta, numérica o calculada:** esas respuestas son campos de texto, no
  editores. El botón aparece en las de **ensayo**.
- **Corregir respuestas matemáticas:** no evalúa nada. Para eso está el tipo de pregunta STACK.
- No reconoce escritura a mano ni convierte fórmulas de MathType pegadas desde Word.

## Desarrollo

```
amd/src/        código fuente (módulos ES)        amd/build/   lo que carga Moodle
classes/        plugininfo (configuración) y privacidad
lang/en, es     textos                            templates/   ventana (Mustache)
vendor/mathlive copia de MathLive 0.111.4         styles.css   estilos de la ventana
```

- Los botones de la paleta están en `amd/src/paleta.js`. Cada uno lleva su nombre en
  `lang/*/tiny_ecuaciones.php` (cadena `b_<clave>`).
- **Después de tocar `amd/src` hay que compilar y commitear `amd/build`.** La forma oficial es
  `npx grunt amd` desde la raíz de un Moodle de desarrollo con sus dependencias de Node. Sin ese
  entorno, `tools/compilar.sh` hace lo mismo con el compilador de TypeScript (`tsc`), sin
  instalar nada; su salida no está minificada.
- Para actualizar MathLive: reemplazar `vendor/mathlive` por `mathlive.min.js`, `mathlive-static.css`,
  `mathlive-fonts.css`, `fonts/` y `LICENSE.txt` del paquete nuevo, y cambiar la versión en
  `thirdpartylibs.xml`.

## Cómo se probó

En un Moodle 5.3+ (build 20261030) con PostgreSQL y Chromium:

- Abrir un mensaje de foro con fórmulas `\( \)` y `$$ $$`: se dibujan en el editor y el texto no
  queda marcado como modificado.
- Insertar desde el teclado (`3/4`) y desde los botones; reeditar con doble clic; editar el código
  LaTeX; publicar. En la base queda LaTeX limpio y MathJax lo dibuja en la discusión.
- Lo mismo como **alumno** (rol estudiante), con la interfaz en español: el LaTeX pasa la limpieza
  de HTML intacto.
- Celular a 320, 360, 390 y 414 px: la ventana no se desplaza de costado y el teclado en pantalla
  queda encima.
- Fórmulas con código malicioso (`\text{<img onerror>}`, `\href{javascript:…}`, `\class`): no
  agregan HTML ni se ejecutan dentro del editor. La que MathLive rechaza queda como texto.

**Falta probar:** las pruebas automáticas de Moodle (PHPUnit, Behat), el control de estilo
(`moodle-plugin-ci`), la compilación con `grunt`, otras versiones de Moodle, y Safari en iPhone.
Para la prueba se instaló PostgreSQL 16, aunque Moodle 5.3 pide 17. MathJax se sirvió desde una copia
local sin sus fuentes, así que en la página se veía con letras de reemplazo. Antes de usarlo en
producción conviene probarlo en el Moodle de prueba de la facultad.

![En el celular, con el teclado matemático](docs/celular.png)

## Licencia

GNU GPL v3 o posterior (ver `LICENSE`). MathLive: licencia MIT (ver `vendor/mathlive/LICENSE.txt`).
