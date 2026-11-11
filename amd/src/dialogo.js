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
 * La ventana para escribir una fórmula: un campo visual de MathLive, los botones de la paleta y,
 * para quien lo prefiera, el código LaTeX sincronizado con el campo.
 *
 * @module      tiny_ecuaciones/dialogo
 * @copyright   2026 SIED, Facultad de Ciencias Económicas, Universidad Nacional de Cuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalSaveCancel from 'core/modal_save_cancel';
import ModalEvents from 'core/modal_events';
import Templates from 'core/templates';
import {getString, getStrings} from 'core/str';
import {exception as mostrarError} from 'core/notification';
import {component} from 'tiny_ecuaciones/common';
import {cargarMathLive} from 'tiny_ecuaciones/mathlive';
import {getUrlMathLive, isFiltroActivo} from 'tiny_ecuaciones/options';
import {formulaSeleccionada, ponerFormula} from 'tiny_ecuaciones/formulas';
import {GRUPOS, vistaDeBoton} from 'tiny_ecuaciones/paleta';

/**
 * Arma los datos de la plantilla: grupos y botones con su nombre y su dibujo.
 *
 * @param {object} ML MathLive
 * @returns {Promise<object[]>}
 */
const armarGrupos = async(ML) => {
    const pedidos = [];
    GRUPOS.forEach((grupo) => {
        pedidos.push({key: `g_${grupo.id}`, component});
        grupo.botones.forEach(([clave]) => pedidos.push({key: `b_${clave}`, component}));
    });
    const textos = await getStrings(pedidos);
    let i = 0;
    return GRUPOS.map((grupo, n) => ({
        id: grupo.id,
        nombre: textos[i++],
        activo: n === 0,
        ancho: !!grupo.ancho,
        botones: grupo.botones.map(([, tex]) => ({
            tex,
            nombre: textos[i++],
            vista: ML.convertLatexToMarkup(vistaDeBoton(tex)),
        })),
    }));
};

/**
 * Cambia de solapa (con clic o con las flechas, como pide el patrón de solapas de ARIA).
 *
 * @param {HTMLElement} raiz
 * @param {HTMLElement} solapa
 */
const elegirSolapa = (raiz, solapa) => {
    raiz.querySelectorAll('[role="tab"]').forEach((s) => {
        const elegida = s === solapa;
        s.setAttribute('aria-selected', elegida ? 'true' : 'false');
        s.classList.toggle('active', elegida);
        s.tabIndex = elegida ? 0 : -1;
        raiz.querySelector(`#${s.getAttribute('aria-controls')}`).hidden = !elegida;
    });
};

/**
 * Abre la ventana. Si el cursor está sobre una fórmula, la edita; si no, inserta una nueva.
 *
 * @param {TinyMCE} editor
 */
export const abrirDialogo = async(editor) => {
    try {
        const ML = await cargarMathLive(getUrlMathLive(editor));
        const existente = formulaSeleccionada(editor);
        const tex = existente ? existente.dataset.tex : '';
        const tipo = existente ? existente.dataset.tipo : 'linea';

        const [titulo, textoBoton, grupos] = await Promise.all([
            getString('dialogtitle', component),
            getString(existente ? 'actualizar' : 'insertar', component),
            armarGrupos(ML),
        ]);

        const modal = await ModalSaveCancel.create({
            title: titulo,
            body: Templates.render('tiny_ecuaciones/dialogo', {
                uid: editor.id.replace(/[^\w-]/g, ''),
                grupos,
                bloque: tipo !== 'linea',
                sinfiltro: !isFiltroActivo(editor),
            }),
            buttons: {save: textoBoton},
            large: true,
            removeOnClose: true,
            show: true,
        });

        const raiz = modal.getRoot()[0];
        await modal.getBodyPromise();
        const campo = raiz.querySelector('math-field');
        const codigo = raiz.querySelector('[data-region="codigo"]');
        const bloque = raiz.querySelector('[data-region="bloque"]');

        campo.mathVirtualKeyboardPolicy = 'auto';
        campo.smartFence = true;
        campo.popoverPolicy = 'off';
        campo.value = tex;
        codigo.value = tex;

        campo.addEventListener('input', () => {
            codigo.value = campo.value;
        });
        codigo.addEventListener('input', () => {
            campo.setValue(codigo.value, {silenceNotifications: true});
        });

        raiz.addEventListener('click', (e) => {
            const boton = e.target.closest('[data-tex]');
            if (boton) {
                e.preventDefault();
                campo.executeCommand(['insert', boton.dataset.tex, {selectionMode: 'placeholder'}]);
                codigo.value = campo.value;
                campo.focus();
                return;
            }
            const solapa = e.target.closest('[role="tab"]');
            if (solapa) {
                elegirSolapa(raiz, solapa);
                return;
            }
            if (e.target.closest('[data-action="borrar"]')) {
                campo.value = '';
                codigo.value = '';
                campo.focus();
            }
        });

        raiz.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
                return;
            }
            const solapas = [...raiz.querySelectorAll('[role="tab"]')];
            const actual = solapas.indexOf(e.target.closest('[role="tab"]'));
            const otra = solapas[(actual + (e.key === 'ArrowRight' ? 1 : -1) + solapas.length) % solapas.length];
            elegirSolapa(raiz, otra);
            otra.focus();
            e.preventDefault();
        });

        modal.getRoot().on(ModalEvents.shown, () => campo.focus());
        campo.focus();

        // El teclado en pantalla de MathLive se cierra junto con la ventana.
        modal.getRoot().on(ModalEvents.hidden, () => window.mathVirtualKeyboard?.hide());

        modal.getRoot().on(ModalEvents.save, () => {
            const nuevo = campo.value.trim();
            if (!nuevo) {
                return;
            }
            let nuevoTipo = 'linea';
            if (bloque.checked) {
                nuevoTipo = tipo === 'dolares' ? 'dolares' : 'bloque';
            }
            ponerFormula(editor, nuevo, nuevoTipo, existente).catch(mostrarError);
        });
    } catch (error) {
        mostrarError(error);
    }
};
