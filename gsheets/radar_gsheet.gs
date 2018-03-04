/*
 * Adds the menu items to Import Radar question from the Google Form into the
 * "Extracted" tab, and another one to Export the modified questions in the
 * "Proposed" tab to the Google Form.
 *
 * Conditional Formatting
 *   Apply to range: A2:A60,C2:E60
 *   Format cell if... "Custom formula is"
 *   =A2<>INDIRECT("Extracted!R" & row() & "C" & COLUMN(), FALSE)
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('RADAR')
      .addItem('Import questions from Form', 'copyFromForm')
      .addItem('Export questions to Form', 'copyToForm')
      .addItem('Copy questions from Extracted to new Form (asked)', 'createForm')
      .addSeparator()
      .addToUi();
}

function copyFromForm() {
  var form = FormApp.openById('1bmYXOhMvJXL1iO-uWYKE0Hr0-Wt8jvzM-V5_4jzQAtU');
  var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.setActiveSheet(ss.getSheetByName('Extracted'));
  var row = 2;
  for (var i=0; i<items.length; i++) {
    var item = items[i];
    var titleCell = sheet.getRange(row, 1);
    titleCell.setValue(item.getTitle());
    sheet.getRange(row, 2).setValue(item.getId());
    var choices = item.asMultipleChoiceItem().getChoices();
    var column = 3;
    for (var j=0; j<choices.length; j++) {
      //Logger.log(row, column, j, choices[j]);
      var choice = choices[j];
      var choiceCell = sheet.getRange(row, column);
      choiceCell.setValue(choice.getValue());
      column++;
    }
    row++;
  }
}

function copyToForm() {
  var ss = SpreadsheetApp.getActive();
  var sheetExtracted = ss.setActiveSheet(ss.getSheetByName('Extracted'));
  var sheetProposed = ss.setActiveSheet(ss.getSheetByName('Proposed'));
  var extractedData = sheetExtracted.getDataRange().getValues();
  var proposedData = sheetProposed.getDataRange().getValues();

  var form = FormApp.openById('1bmYXOhMvJXL1iO-uWYKE0Hr0-Wt8jvzM-V5_4jzQAtU');

  for (var row=1; row < proposedData.length; row++) {
    var id = extractedData[row][1];
    var title = proposedData[row][0];
    var answer0 = proposedData[row][2];
    var answer1 = proposedData[row][3];
    var answer2 = proposedData[row][4];
    var item = form.getItemById(id).asMultipleChoiceItem();
    item.setTitle(title);
    if (answer2 != '') {
      item.setChoiceValues([answer0, answer1, answer2]);
    } else {
      item.setChoiceValues([answer0, answer1]);
    }
  }

  var items = form.getItems(FormApp.ItemType.SECTION_HEADER);
  for (var i=0; i < items.length; i++) {
    var text = items[i];
    if (text.asSectionHeaderItem().getTitle() == "Welcome to Radar!") {
      var helpText = text.asSectionHeaderItem().getHelpText();
      var today = new Date();
      helpText = helpText.replace(/(Modified on ).*$/m, "$1" + today.toLocaleDateString('en-uk') );
      text.asSectionHeaderItem().setHelpText(helpText);
    }
  }
}

function createForm() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Id of the newly created Google Form:');
  var formId = response.getResponseText();
  var form = FormApp.openById(formId);

  var ss = SpreadsheetApp.getActive();
  var sheetExtracted = ss.setActiveSheet(ss.getSheetByName('Extracted'));
  var extractedData = sheetExtracted.getDataRange().getValues();

  var prevTitle = 'FIRST';
  var sectionsMap = {
    'V': 'Visualise',
    'W': 'Limit WIP',
    'F': 'Manage Flow',
    'P': 'Make Policies Explicit',
    'L': 'Implement Feedback Loops',
    'I': 'Improve',
    'E': 'Effects'
  };
  for (var row=1; row <extractedData.length; row++) {
    var id      = extractedData[row][1];
    var title   = extractedData[row][0];
    var answer0 = extractedData[row][2];
    var answer1 = extractedData[row][3];
    var answer2 = extractedData[row][4];
    if (title.substr(1,1) != prevTitle.substr(1,1)) {
      var sectionTitle = sectionsMap[title.substr(1,1)];
      //var sectionItem = form.addSectionHeaderItem();
      //sectionItem.setTitle(sectionTitle);
      form.addPageBreakItem().setTitle(sectionTitle);
    }
    var item = form.addMultipleChoiceItem();
    var choiceCell = sheetExtracted.getRange(row+1, 2);
    choiceCell.setValue(item.getId());
    item.setTitle(title);
    if (answer2 != '') {
      item.setChoiceValues([answer0, answer1, answer2]);
    } else {
      item.setChoiceValues([answer0, answer1]);
    }
    prevTitle = title;
  }
}
