<?php
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

namespace tiny_ecuaciones;

use context;
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;
use editor_tiny\plugin_with_menuitems;
use moodle_url;

/**
 * Editor de ecuaciones para TinyMCE.
 *
 * La fórmula se guarda como LaTeX entre \( \) o \[ \], y la dibuja el filtro MathJax de Moodle.
 * Así sobrevive a la limpieza de HTML que Moodle aplica a lo que escriben los alumnos, y el
 * contenido se sigue viendo aunque el plugin se desinstale.
 *
 * @package    tiny_ecuaciones
 * @copyright  2026 SIED, Facultad de Ciencias Económicas, Universidad Nacional de Cuyo
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements plugin_with_buttons, plugin_with_menuitems, plugin_with_configuration {
    /**
     * Botones que agrega.
     *
     * @return array
     */
    public static function get_available_buttons(): array {
        return ['tiny_ecuaciones/ecuaciones'];
    }

    /**
     * Ítems de menú que agrega.
     *
     * @return array
     */
    public static function get_available_menuitems(): array {
        return ['tiny_ecuaciones/ecuaciones'];
    }

    /**
     * Configuración que recibe el JavaScript del plugin.
     *
     * @param context $context
     * @param array $options
     * @param array $fpoptions
     * @param editor|null $editor
     * @return array
     */
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        // Si algún filtro cambia una fórmula de prueba, hay un filtro de matemática activo en este contexto.
        $prueba = '\\(\\pi\\)';
        $filtroactivo = format_text($prueba, FORMAT_HTML, ['context' => $context]) !== $prueba;

        return [
            'filtroactivo' => $filtroactivo,
            'urlmathlive' => (new moodle_url('/lib/editor/tiny/plugins/ecuaciones/vendor/mathlive/'))->out(false),
        ];
    }
}
