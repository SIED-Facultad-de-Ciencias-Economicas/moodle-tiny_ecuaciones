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

/**
 * Pruebas de la configuración que el plugin le pasa al editor.
 *
 * @package    tiny_ecuaciones
 * @copyright  2026 Gerardo Martín Gil Carretero <gerardo.gil@fce.uncu.edu.ar>, Equipo SIED, FCE, UNCuyo
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \tiny_ecuaciones\plugininfo
 */
final class plugininfo_test extends \advanced_testcase {
    /**
     * Con el filtro MathJax activo o apagado, la configuración lo informa y da la carpeta de MathLive.
     *
     * @param bool $activo Si el filtro MathJax está activo.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('filtro_provider')]
    public function test_configuracion(bool $activo): void {
        $this->resetAfterTest();
        $filtros = \core_plugin_manager::resolve_plugininfo_class('filter');
        $filtros::enable_plugin('mathjaxloader', $activo ? TEXTFILTER_ON : TEXTFILTER_OFF);
        $this->setUser($this->getDataGenerator()->create_user());

        $config = plugininfo::get_plugin_configuration_for_context(\context_system::instance(), [], []);

        $this->assertSame($activo, $config['filtroactivo']);
        $this->assertStringEndsWith('/lib/editor/tiny/plugins/ecuaciones/vendor/mathlive/', $config['urlmathlive']);
    }

    /**
     * Filtro activo y apagado.
     *
     * @return array
     */
    public static function filtro_provider(): array {
        return [
            'filtro activo' => [true],
            'filtro apagado' => [false],
        ];
    }

    /**
     * El plugin ofrece su botón y su ítem de menú.
     */
    public function test_botones_y_menu(): void {
        $this->assertSame(['tiny_ecuaciones/ecuaciones'], plugininfo::get_available_buttons());
        $this->assertSame(['tiny_ecuaciones/ecuaciones'], plugininfo::get_available_menuitems());
    }
}
