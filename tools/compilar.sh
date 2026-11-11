#!/usr/bin/env bash
# Compila amd/src → amd/build sin instalar nada: usa el compilador de TypeScript (tsc) para pasar
# los módulos ES a AMD con el nombre que espera Moodle (tiny_ecuaciones/<archivo>).
#
# La forma oficial de Moodle es `npx grunt amd` desde la raíz de un Moodle con sus dependencias de
# Node instaladas; da el mismo resultado, minificado y con mapas de código. Usar ésta sólo cuando no
# se tiene ese entorno. Hay que correr una de las dos después de tocar amd/src y commitear amd/build.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
tsc --allowJs --checkJs false --module amd --target es2020 \
    --noEmitOnError false --skipLibCheck --removeComments false \
    --outDir "$tmp" amd/src/*.js > "$tmp/tsc.log" || true
rm -f amd/build/*.min.js amd/build/*.min.js.map
# Le pone a cada módulo el nombre que espera Moodle y mete adentro del define los ayudantes que tsc
# deja sueltos arriba (si no, quedarían como variables globales de la página).
node - "$tmp" <<'JS'
const fs = require('fs');
const tmp = process.argv[2];
for (const f of fs.readdirSync('amd/src')) {
    const n = f.replace(/\.js$/, '');
    let js = fs.readFileSync(`${tmp}/${f}`, 'utf8');
    const d = js.search(/^define\(\[/m);
    const fin = (js.match(/^(\/\/.*\n)+/) || [''])[0].length;
    const cabecera = js.slice(0, fin);
    const ayudantes = js.slice(fin, d).trim();
    let cuerpo = js.slice(d).replace(/^define\(\[/, `define("tiny_ecuaciones/${n}", [`);
    if (ayudantes) {
        cuerpo = cuerpo.replace(/^( *"use strict";\n)/m, `$1${ayudantes}\n`);
    }
    // Como hace Babel en Moodle: un módulo que sólo exporta «default» vale eso mismo. editor_tiny
    // espera que tiny_ecuaciones/plugin sea directamente la promesa, no un objeto que la contenga.
    const fuente = fs.readFileSync(`amd/src/${f}`, 'utf8');
    if (/^export default /m.test(fuente) && !/^export (const|function|class|let|async|\{)/m.test(fuente)) {
        cuerpo = cuerpo.replace(/\n\}\);\s*$/, '\n    return exports.default;\n});\n');
    }
    if (!cuerpo.startsWith(`define("tiny_ecuaciones/${n}"`)) {
        throw new Error(`No se pudo nombrar ${n}`);
    }
    fs.writeFileSync(`amd/build/${n}.min.js`, cabecera + cuerpo);
}
JS
echo "Compilados: $(ls amd/build | wc -l) módulos en amd/build/"
