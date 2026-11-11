# Ficha para moodle.org/plugins

Lo que va en el formulario del directorio de plugins de Moodle (https://moodle.org/plugins), campo
por campo. El texto de los bloques va en inglés, tal cual; lo de afuera son notas.

Mantenerla al día: si cambia lo que hace el plugin, las versiones de Moodle que soporta o lo que
pide el directorio, se corrige acá en el mismo cambio.

## Datos del plugin (se cargan una vez)

**Plugin name**

```
Visual equation editor
```

**Component (frankenstyle):** `tiny_ecuaciones`

**Category:** Text editors → TinyMCE editor plugins.

**Short description**

```
Build maths formulas visually in TinyMCE, with buttons and fill-in boxes, no LaTeX knowledge needed. For teachers and students alike; formulas are saved as plain LaTeX and rendered by MathJax.
```

**Description**

```
Visual equation editor adds a "Formula" button to the TinyMCE editor. It lets anyone, teacher or student, build mathematical formulas graphically, the way a scientific calculator works: pick a structure (fraction, power, root, sum, integral, matrix...) and fill in the boxes that appear. The formula is always shown as it will look; no LaTeX or shortcuts are needed.

FEATURES

- Graphical formula building with MathLive: click a button, fill in the boxes, move between them with the mouse or the arrow keys.
- Six palettes: Basic, Functions, Calculus, Greek letters, Sets and matrices, and Economics and finance (compound interest, effective rate, present value, NPV, IRR, price elasticity, marginal cost, mean, standard deviation and linear regression templates).
- Formulas are displayed rendered inside the editor and can be edited again with a double click.
- A formula cannot be inserted while any box is left empty: a clear warning asks to complete it, so no broken formulas are saved.
- An optional, collapsed LaTeX code view for advanced users, kept in sync with the visual field.
- On phones and tablets, an on-screen maths keyboard.
- Locale-aware: sine and tangent are written "sen" and "tg" in Spanish, "sin" and "tan" elsewhere.
- Accessible: keyboard-navigable palette tabs, labelled buttons and fields.
- Works wherever TinyMCE is used: pages, labels, forums, assignments (online text), wikis, glossaries and essay questions.

HOW FORMULAS ARE STORED

Formulas are saved as standard LaTeX between \( \) (inline) or \[ \] (display), and rendered on the page by Moodle's core MathJax filter. Nothing plugin-specific is stored in the content, which means:

- formulas written by students survive Moodle's HTML cleaning (HTMLPurifier), which strips SVG and MathML;
- content keeps working if the plugin is uninstalled, and remains editable with Moodle's core equation editor;
- existing formulas written as \( \), \[ \] or $$ $$ are rendered and editable too.

REQUIREMENTS

- Moodle 4.5 or later. Tested on every version from 4.5 to 5.3 (TinyMCE 7 and 8).
- The MathJax filter enabled (it is enabled by default).
- MathLive 0.111.4 (MIT licence) is bundled and served locally: no CDN or external service is used by the plugin.

PERMISSIONS

The capability tiny/ecuaciones:use is granted to the authenticated user archetype by default, like the core equation editor. It can be removed from any role.

PRIVACY

The plugin stores no personal data (null privacy provider).

NOT INCLUDED

- It does not grade mathematical answers (see the STACK question type for that).
- It does not appear in the Moodle app, which does not use TinyMCE; formulas are still displayed there.
- Short-answer, numerical and calculated question responses are plain text fields, not editors, so the button does not appear in them.

Developed by the SIED team, Faculty of Economics (Facultad de Ciencias Económicas), Universidad Nacional de Cuyo, Argentina.
```

**Source control URL**

```
https://github.com/SIED-Facultad-de-Ciencias-Economicas/moodle-tiny_ecuaciones
```

**Bug tracker URL** (las Issues tienen que estar activadas en el repositorio)

```
https://github.com/SIED-Facultad-de-Ciencias-Economicas/moodle-tiny_ecuaciones/issues
```

**Documentation URL**

```
https://github.com/SIED-Facultad-de-Ciencias-Economicas/moodle-tiny_ecuaciones#readme
```

El README está en español. Si los revisores piden documentación en inglés, se suma aparte.

**Screenshots:** `docs/ventana.png` (la ventana con una fórmula armada), `docs/editor.png`
(fórmulas dibujadas dentro del editor) y `docs/celular.png` (el teclado en pantalla). Están con la
interfaz en español; si conviene mostrarla en inglés, se sacan otras.

## Cada versión que se sube

- **ZIP:** el que termina en `-directorio.zip`, de la página de esa versión en
  [Releases](https://github.com/SIED-Facultad-de-Ciencias-Economicas/moodle-tiny_ecuaciones/releases).
  Trae sólo el inglés: el directorio carga las traducciones desde AMOS.
- **Version name:** el `$plugin->release` de `version.php` (por ejemplo `0.2.1`).
- **Maturity:** el `$plugin->maturity` de `version.php` (hoy, Beta).
- **Supported Moodle versions:** las de la matriz de `.github/workflows/ci.yml`, que son las que se
  prueban: hoy 4.5, 5.0, 5.1, 5.2 y 5.3.
- **Release notes:** la entrada de esa versión en `CHANGES.md`, en inglés.

Notas de la primera versión que se sube (0.2.1):

```
First public release.

- Graphical formula building with buttons and fill-in boxes (MathLive).
- Six palettes, including an Economics and finance one.
- Formulas rendered inside the editor; double click to edit.
- Saved as plain LaTeX, rendered by Moodle's MathJax filter.
- Warning when boxes are left empty.
- Optional LaTeX code view.
- Locale-aware sine and tangent (sen/tg in Spanish).
- Tested on Moodle 4.5, 5.0, 5.1, 5.2 and 5.3.
```

## Después de la aprobación

- Cargar el español en AMOS (https://lang.moodle.org) desde `lang/es/tiny_ecuaciones.php`.
- La firma del autor va al pie de la ventana del editor por decisión del autor. Si el revisor pide
  sacarla, se resuelve con un cambio chico en `templates/dialogo.mustache` y `styles.css`.
