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

/**
 * Datos de versión de tiny_ecuaciones.
 *
 * @package    tiny_ecuaciones
 * @copyright  2026 SIED, Facultad de Ciencias Económicas, Universidad Nacional de Cuyo
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$plugin->component = 'tiny_ecuaciones';
$plugin->version   = 2026111100;
$plugin->release   = '0.1.0';
$plugin->maturity  = MATURITY_BETA;
// Moodle 5.3. Es la única versión en la que se probó; ver README.md.
$plugin->requires  = 2026100500;
