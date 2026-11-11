// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Fórmulas dibujadas dentro del editor.
 *
 * Lo que se guarda es siempre texto LaTeX: \( … \) en línea, \[ … \] o $$ … $$ centrada. Mientras
 * se edita, ese texto se muestra dibujado (un <span> no editable con el LaTeX en data-tex) y al
 * guardar, en el evento PreProcess, el <span> vuelve a ser el texto de antes. El HTML que llega a
 * Moodle no lleva nada del plugin: lo dibuja el filtro MathJax y lo limpia HTMLPurifier sin perder nada.
 *
 * @module      tiny_ecuaciones/formulas
 * @copyright   2026 Gerardo Martín Gil Carretero <gerardo.gil@fce.uncu.edu.ar>, Equipo SIED, FCE, UNCuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {CLASE} from 'tiny_ecuaciones/common';
import {cargarMathLive} from 'tiny_ecuaciones/mathlive';
import {getUrlMathLive} from 'tiny_ecuaciones/options';

/** Delimitadores de cada tipo, los mismos que reconoce el filtro MathJax de Moodle. */
export const DELIMITADORES = {
    linea: ['\\(', '\\)'],
    bloque: ['\\[', '\\]'],
    dolares: ['$$', '$$'],
};

const PATRON = /\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|\$\$([\s\S]+?)\$\$/g;

// Donde no se dibuja: código, y lo que Moodle marca para que no lo toquen los filtros.
const NO_DIBUJAR = `pre, code, textarea, script, style, .nolink, .${CLASE}`;

const ESTILO_EDITOR = `
.${CLASE} { cursor: pointer; border-radius: 3px; padding: 0 2px; }
.${CLASE}:hover { background: rgba(15, 108, 191, .08); }
.${CLASE}[data-mce-selected] { outline: 2px solid #0f6cbf; outline-offset: 1px; }
.${CLASE}-bloque { display: block; text-align: center; margin: .5em 0; }
`;

/**
 * La fórmula que contiene a un nodo, si hay una.
 *
 * @param {Node} nodo
 * @returns {HTMLElement|null}
 */
export const formulaDe = (nodo) => {
    const elemento = nodo && nodo.nodeType === 3 ? nodo.parentElement : nodo;
    return elemento && elemento.closest ? elemento.closest(`.${CLASE}`) : null;
};

/**
 * La fórmula seleccionada en el editor, si hay una.
 *
 * @param {TinyMCE} editor
 * @returns {HTMLElement|null}
 */
export const formulaSeleccionada = (editor) => formulaDe(editor.selection.getNode());

/**
 * El texto que se guarda para una fórmula.
 *
 * @param {string} tex
 * @param {string} tipo linea, bloque o dolares
 * @returns {string}
 */
export const textoDeFormula = (tex, tipo) => {
    const [abre, cierra] = DELIMITADORES[tipo] || DELIMITADORES.linea;
    return abre + tex + cierra;
};

/**
 * Arma el <span> con la fórmula dibujada.
 *
 * Si MathLive no puede dibujar el código (está mal escrito, o trae algo que rechaza, como un enlace
 * javascript:), devuelve null y la fórmula queda como texto: así se guarda igual y se puede corregir.
 *
 * @param {Document} doc
 * @param {object} ML MathLive
 * @param {string} tex
 * @param {string} tipo
 * @returns {HTMLElement|null}
 */
const crearFormula = (doc, ML, tex, tipo) => {
    let dibujo;
    try {
        dibujo = ML.convertLatexToMarkup(tex, {
            defaultMode: tipo === 'linea' ? 'inline-math' : 'math',
        });
    } catch (error) {
        return null;
    }
    const span = doc.createElement('span');
    span.className = tipo === 'linea' ? CLASE : `${CLASE} ${CLASE}-bloque`;
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', tex);
    span.dataset.tex = tex;
    span.dataset.tipo = tipo;
    span.innerHTML = dibujo;
    return span;
};

/**
 * Dibuja todas las fórmulas que estén como texto en el editor.
 *
 * @param {TinyMCE} editor
 * @param {object} ML MathLive
 * @returns {HTMLElement[]} Las fórmulas que dibujó, en orden.
 */
const dibujar = (editor, ML) => {
    const cuerpo = editor.getBody();
    if (!cuerpo) {
        return [];
    }
    const doc = editor.getDoc();
    const textos = [];
    const recorrido = doc.createTreeWalker(cuerpo, NodeFilter.SHOW_TEXT);
    while (recorrido.nextNode()) {
        const nodo = recorrido.currentNode;
        // Con lastIndex en 0: matchAll() copia el de PATRON y, si no, saltearía la primera fórmula.
        PATRON.lastIndex = 0;
        const tieneFormula = PATRON.test(nodo.data);
        PATRON.lastIndex = 0;
        if (tieneFormula && !nodo.parentElement.closest(NO_DIBUJAR)) {
            textos.push(nodo);
        }
    }

    const dibujadas = [];
    textos.forEach((nodo) => {
        const fragmento = doc.createDocumentFragment();
        let desde = 0;
        for (const m of nodo.data.matchAll(PATRON)) {
            const tipo = m[1] !== undefined ? 'linea' : (m[2] !== undefined ? 'bloque' : 'dolares');
            const tex = (m[1] ?? m[2] ?? m[3]).trim();
            if (!tex) {
                continue;
            }
            const formula = crearFormula(doc, ML, tex, tipo);
            if (!formula) {
                continue;
            }
            fragmento.append(doc.createTextNode(nodo.data.slice(desde, m.index)));
            fragmento.append(formula);
            dibujadas.push(formula);
            desde = m.index + m[0].length;
        }
        fragmento.append(doc.createTextNode(nodo.data.slice(desde)));
        nodo.replaceWith(fragmento);
    });
    return dibujadas;
};

/**
 * Pone una fórmula en el editor: reemplaza la seleccionada o la inserta donde está el cursor.
 *
 * @param {TinyMCE} editor
 * @param {string} tex
 * @param {string} tipo
 * @param {HTMLElement|null} existente La fórmula que se está editando, si hay una.
 */
export const ponerFormula = async(editor, tex, tipo, existente) => {
    const ML = await cargarMathLive(getUrlMathLive(editor));
    let formula;
    editor.undoManager.transact(() => {
        if (existente && existente.isConnected) {
            formula = crearFormula(editor.getDoc(), ML, tex, tipo);
            existente.replaceWith(formula || editor.getDoc().createTextNode(textoDeFormula(tex, tipo)));
        } else {
            // Entra como texto, igual que si se hubiera pegado, y se dibuja con el resto.
            const antes = new Set(editor.getBody().querySelectorAll(`.${CLASE}`));
            editor.insertContent(editor.dom.encode(textoDeFormula(tex, tipo)));
            dibujar(editor, ML);
            formula = [...editor.getBody().querySelectorAll(`.${CLASE}`)].find((f) => !antes.has(f));
        }
    });
    if (formula) {
        editor.selection.select(formula);
        editor.selection.collapse(false);
    }
    editor.nodeChanged();
    editor.focus();
};

/**
 * Engancha el dibujo y la vuelta a texto en el editor.
 *
 * @param {TinyMCE} editor
 */
export const setup = (editor) => {
    // Al guardar (y en «Código fuente»), cada fórmula vuelve a ser su texto LaTeX.
    editor.on('PreProcess', (e) => {
        e.node.querySelectorAll(`.${CLASE}`).forEach((span) => {
            const texto = textoDeFormula(span.dataset.tex || '', span.dataset.tipo || 'linea');
            span.replaceWith(e.node.ownerDocument.createTextNode(texto));
        });
    });

    editor.on('init', async() => {
        const url = getUrlMathLive(editor);
        const ML = await cargarMathLive(url);
        editor.dom.loadCSS(url + 'mathlive-fonts.css');
        editor.dom.loadCSS(url + 'mathlive-static.css');
        editor.dom.addStyle(ESTILO_EDITOR);

        // Dibujar no es un cambio del docente: no tiene que marcar el texto como modificado.
        const sinCambios = () => {
            const estabaModificado = editor.isDirty();
            dibujar(editor, ML);
            if (!estabaModificado) {
                editor.setDirty(false);
            }
        };
        sinCambios();
        // Cargar o restaurar contenido no lo modifica; insertar o pegar (e.selection) sí.
        editor.on('SetContent', (e) => (e.selection ? dibujar(editor, ML) : sinCambios()));
    });
};
