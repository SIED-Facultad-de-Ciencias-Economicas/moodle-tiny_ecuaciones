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
 * Opciones que llegan desde classes/plugininfo.php.
 *
 * @module      tiny_ecuaciones/options
 * @copyright   2026 SIED, Facultad de Ciencias Económicas, Universidad Nacional de Cuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from 'tiny_ecuaciones/common';

const filtroActivo = getPluginOptionName(pluginName, 'filtroactivo');
const urlMathLive = getPluginOptionName(pluginName, 'urlmathlive');

/**
 * Registra las opciones.
 *
 * @param {TinyMCE} editor
 */
export const register = (editor) => {
    editor.options.register(filtroActivo, {processor: 'boolean', 'default': false});
    editor.options.register(urlMathLive, {processor: 'string', 'default': ''});
};

/**
 * ¿Hay un filtro de matemática (MathJax) activo en este contexto?
 *
 * @param {TinyMCE} editor
 * @returns {boolean}
 */
export const isFiltroActivo = (editor) => editor.options.get(filtroActivo);

/**
 * URL de la carpeta de MathLive dentro del plugin, terminada en barra.
 *
 * @param {TinyMCE} editor
 * @returns {string}
 */
export const getUrlMathLive = (editor) => editor.options.get(urlMathLive);
