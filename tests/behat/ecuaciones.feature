@editor @editor_tiny @tiny @tiny_ecuaciones
Feature: Armar fórmulas en forma gráfica con el editor de ecuaciones
  Para escribir matemática en Moodle sin saber LaTeX
  Como docente o alumno
  Necesito armar la fórmula con botones y que se guarde como LaTeX

  Background:
    Given I log in as "admin"
    And I open my profile in edit mode
    # Un campo al pie de la página, para que la ventana del editor quede a la vista.
    And I expand all fieldsets
    And I set the field "Picture description" to "Test"

  @javascript
  Scenario: Insertar una fórmula con los botones
    Given I set the field "Description" to ""
    And I expand all toolbars for the "Description" TinyMCE editor
    When I click on the "Formula" button for the "Description" TinyMCE editor
    And I click on "Pi" "button" in the "Write a formula" "dialogue"
    And I click on "Insert" "button" in the "Write a formula" "dialogue"
    Then the field "Description" matches value "<p>\(\pi\)</p>"
    And I click on "Update profile" "button"
    And I follow "Profile" in the user menu
    And "π" "text" should exist

  @javascript
  Scenario: No se inserta una fórmula con casilleros vacíos
    Given I set the field "Description" to ""
    And I expand all toolbars for the "Description" TinyMCE editor
    When I click on the "Formula" button for the "Description" TinyMCE editor
    And I click on "Fraction" "button" in the "Write a formula" "dialogue"
    And I click on "Insert" "button" in the "Write a formula" "dialogue"
    Then I should see "There are empty boxes left" in the "Write a formula" "dialogue"

  @javascript
  Scenario: Las fórmulas guardadas se dibujan en el editor y vuelven a ser LaTeX al guardar
    Given I set the field "Description" to "<p>Area \(x^2\) and $$y$$</p>"
    When I switch to the "Description" TinyMCE editor iframe
    Then ".tiny-ecuaciones-formula" "css_element" should exist
    And I switch to the main frame
    And the field "Description" matches value "<p>Area \(x^2\) and $$y$$</p>"

  @javascript
  Scenario: Reeditar una fórmula guardada
    Given I set the field "Description" to "<p>\(x^2\)</p>"
    And I expand all toolbars for the "Description" TinyMCE editor
    And I select the ".tiny-ecuaciones-formula" "css_element" in the "Description" TinyMCE editor
    When I click on the "Formula" button for the "Description" TinyMCE editor
    Then "Update" "button" should exist in the "Write a formula" "dialogue"
    And I click on "Update" "button" in the "Write a formula" "dialogue"
    And the field "Description" matches value "<p>\(x^2\)</p>"
