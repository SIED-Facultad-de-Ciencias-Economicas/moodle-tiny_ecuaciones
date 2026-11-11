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
 * Los botones del editor, agrupados en solapas como las teclas de una calculadora científica.
 *
 * Cada botón es [clave, LaTeX]. La clave da el nombre que se lee y se muestra al pasar el mouse
 * (cadena «b_<clave>» de lang/). En el LaTeX, como en MathLive:
 *   #@  lo que está seleccionado o lo último que se escribió (x → x² con el botón de potencia),
 *   #0  lo seleccionado, o un casillero vacío donde queda el cursor,
 *   #?  un casillero vacío para completar (se pasa al siguiente con Tab o con las flechas).
 *
 * @module      tiny_ecuaciones/paleta
 * @copyright   2026 Gerardo Martín Gil Carretero <gerardo.gil@fce.uncu.edu.ar>, Equipo SIED, FCE, UNCuyo
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const GRUPOS = [
    {id: 'basico', botones: [
        ['fraccion', '\\frac{#@}{#?}'],
        ['potencia', '#@^{#?}'],
        ['cuadrado', '#@^2'],
        ['subindice', '#@_{#?}'],
        ['raiz', '\\sqrt{#0}'],
        ['raizn', '\\sqrt[#?]{#0}'],
        ['parentesis', '\\left(#0\\right)'],
        ['corchetes', '\\left[#0\\right]'],
        ['modulo', '\\left|#0\\right|'],
        ['por', '\\times'],
        ['punto', '\\cdot'],
        ['dividido', '\\div'],
        ['masmenos', '\\pm'],
        ['distinto', '\\neq'],
        ['menorigual', '\\leq'],
        ['mayorigual', '\\geq'],
        ['aprox', '\\approx'],
        ['pi', '\\pi'],
        ['infinito', '\\infty'],
        ['porciento', '\\%'],
    ]},
    {id: 'funciones', botones: [
        ['sen', '\\operatorname{sen}\\left(#0\\right)'],
        ['cos', '\\cos\\left(#0\\right)'],
        ['tg', '\\operatorname{tg}\\left(#0\\right)'],
        ['log', '\\log\\left(#0\\right)'],
        ['logb', '\\log_{#?}\\left(#0\\right)'],
        ['ln', '\\ln\\left(#0\\right)'],
        ['exp', 'e^{#0}'],
        ['funcion', 'f\\left(#0\\right)'],
        ['max', '\\max\\left(#0\\right)'],
        ['min', '\\min\\left(#0\\right)'],
        ['factorial', '#@!'],
        ['combinatorio', '\\binom{#?}{#?}'],
    ]},
    {id: 'calculo', botones: [
        ['limite', '\\lim_{#?\\to#?}#0'],
        ['derivada', '\\frac{d#?}{d#?}'],
        ['parcial', '\\frac{\\partial #?}{\\partial #?}'],
        ['prima', "#@'"],
        ['integral', '\\int #0\\,d#?'],
        ['integraldef', '\\int_{#?}^{#?}#0\\,d#?'],
        ['sumatoria', '\\sum_{#?}^{#?}#0'],
        ['productoria', '\\prod_{#?}^{#?}#0'],
        ['incremento', '\\Delta #0'],
        ['tiende', '\\to'],
        ['implica', '\\Rightarrow'],
        ['sisolosi', '\\Leftrightarrow'],
    ]},
    {id: 'griegas', botones: [
        ['alfa', '\\alpha'],
        ['beta', '\\beta'],
        ['gamma', '\\gamma'],
        ['delta', '\\delta'],
        ['epsilon', '\\varepsilon'],
        ['theta', '\\theta'],
        ['lambda', '\\lambda'],
        ['mu', '\\mu'],
        ['rho', '\\rho'],
        ['sigma', '\\sigma'],
        ['tau', '\\tau'],
        ['fi', '\\varphi'],
        ['omega', '\\omega'],
        ['deltamay', '\\Delta'],
        ['sigmamay', '\\Sigma'],
        ['omegamay', '\\Omega'],
    ]},
    {id: 'conjuntos', botones: [
        ['pertenece', '\\in'],
        ['nopertenece', '\\notin'],
        ['incluido', '\\subseteq'],
        ['union', '\\cup'],
        ['interseccion', '\\cap'],
        ['vacio', '\\emptyset'],
        ['reales', '\\mathbb{R}'],
        ['naturales', '\\mathbb{N}'],
        ['enteros', '\\mathbb{Z}'],
        ['paratodo', '\\forall'],
        ['existe', '\\exists'],
        ['vector', '\\vec{#0}'],
        ['media', '\\bar{#0}'],
        ['estimado', '\\hat{#0}'],
        ['matriz2', '\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}'],
        ['matriz3', '\\begin{pmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}'],
        ['sistema', '\\begin{cases}#?\\\\#?\\end{cases}'],
    ]},
    {id: 'economia', ancho: true, botones: [
        ['interescompuesto', 'C_n=C_0\\left(1+i\\right)^n'],
        ['tasaefectiva', 'i_{ef}=\\left(1+\\frac{j}{m}\\right)^m-1'],
        ['valoractual', 'VA=C\\cdot\\frac{1-\\left(1+i\\right)^{-n}}{i}'],
        ['van', 'VAN=-I_0+\\sum_{t=1}^{n}\\frac{FC_t}{\\left(1+k\\right)^t}'],
        ['tir', '0=-I_0+\\sum_{t=1}^{n}\\frac{FC_t}{\\left(1+TIR\\right)^t}'],
        ['elasticidad', '\\varepsilon=\\frac{\\Delta Q/Q}{\\Delta P/P}'],
        ['costomarginal', 'CMg=\\frac{\\partial CT}{\\partial Q}'],
        ['promedio', '\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i'],
        ['desvio', 's=\\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}\\left(x_i-\\bar{x}\\right)^2}'],
        ['regresion', '\\hat{y}=\\beta_0+\\beta_1x'],
    ]},
];

/**
 * El LaTeX de un botón tal como se muestra en él: cada casillero, como un cuadradito (\\square,
 * porque el dibujo estático de MathLive no muestra \\placeholder).
 *
 * @param {string} tex
 * @returns {string}
 */
export const vistaDeBoton = (tex) => tex
    .replace(/#[@0?]/g, '\\square');
