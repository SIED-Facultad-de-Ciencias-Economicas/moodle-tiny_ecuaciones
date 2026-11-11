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
 * @copyright  2026 Gerardo Martín Gil Carretero <gerardo.gil@fce.uncu.edu.ar>, Equipo SIED, FCE, UNCuyo
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$plugin->component = 'tiny_ecuaciones';
$plugin->version   = 2026111100;
$plugin->release   = '0.1.0';
$plugin->maturity  = MATURITY_BETA;
// Moodle 4.5 (TinyMCE 7) en adelante; ver «Requisitos» en README.md.
$plugin->requires  = 2024100700;
