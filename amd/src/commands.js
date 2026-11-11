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
 * Botón, ítem de menú y doble clic sobre una fórmula.
 *
 * @module      tiny_ecuaciones/commands
 * @copyright   2026 Gerardo Martín Gil Carretero <gerardo.gil@fce.uncu.edu.ar>, Equipo SIED, FCE, UNCuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {getString} from 'core/str';
import {component, buttonName, icon} from 'tiny_ecuaciones/common';
import {formulaDe, formulaSeleccionada} from 'tiny_ecuaciones/formulas';
import {abrirDialogo} from 'tiny_ecuaciones/dialogo';

export const getSetup = async() => {
    const [texto, imagen] = await Promise.all([
        getString('buttontitle', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        editor.ui.registry.addIcon(icon, imagen.html);

        // Queda marcado cuando el cursor está sobre una fórmula: así se ve que el botón la edita.
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: texto,
            onAction: () => abrirDialogo(editor),
            onSetup: (api) => {
                const marcar = () => api.setActive(!!formulaSeleccionada(editor));
                editor.on('NodeChange', marcar);
                return () => editor.off('NodeChange', marcar);
            },
        });

        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: texto,
            onAction: () => abrirDialogo(editor),
        });

        editor.on('dblclick', (e) => {
            const formula = formulaDe(e.target);
            if (formula) {
                editor.selection.select(formula);
                abrirDialogo(editor);
            }
        });
    };
};
