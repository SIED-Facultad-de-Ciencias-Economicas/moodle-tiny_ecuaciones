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
 * Ubica el botón en la barra y en el menú «Insertar».
 *
 * @module      tiny_ecuaciones/configuration
 * @copyright   2026 SIED, Facultad de Ciencias Económicas, Universidad Nacional de Cuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {buttonName} from 'tiny_ecuaciones/common';
import {addMenubarItem, addToolbarButton, addToolbarSection} from 'editor_tiny/utils';

const configurarBarra = (toolbar) => {
    addToolbarSection(toolbar, 'advanced', 'lists', true);
    return addToolbarButton(toolbar, 'advanced', buttonName);
};

export const configure = (instanceConfig) => ({
    menu: addMenubarItem(instanceConfig.menu, 'insert', buttonName),
    toolbar: configurarBarra(instanceConfig.toolbar),
});
