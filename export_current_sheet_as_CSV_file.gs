/*
 * script to export data in all sheets in the current spreadsheet as individual csv files
 * files will be named according to the name of the sheet
 * Original author: Michael Derazon
 * 
 * I have tweaked to work in my own way:
    * This doesn't create multiple folders in google drive
    * this only exports current sheet
    * this puts all exported sheets in a single parent folder
*/

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var csvMenuEntries = [{name: "export as csv files", functionName: "saveAsCSV"}];
  ss.addMenu("csv", csvMenuEntries);
};

function saveAsCSV() { 
  let ss = SpreadsheetApp.getActiveSpreadsheet(); 
  let sheet = ss.getSheetByName('Export');

  // use a folder in the root of drive called "Appscript".  Create this folder if it doesn't exist
  var parent = "Appscript"
  try { var parentFolder = DriveApp.getFoldersByName(parent).next(); }
  catch(e) { var parentFolder = DriveApp.createFolder(parent); }

  // sub folder name will use the name of the spreadsheet
  var folderName = ss.getName().toLowerCase().replace(/ /g,'_') + '_csvexport'

  // if a folder exists in /AppScript/ already, use this folder, otherwise create a new folder.
  try { var folder = parentFolder.getFoldersByName(folderName).next(); }
  catch(e) { var folder = parentFolder.createFolder(folderName); }

  // create a formatted timestamp to name the csv file with
  var date = new Date();
  var timestamp = date.getFullYear()+"-"+leadZero(date.getMonth()+1)+"-"+leadZero(date.getDate())+"_"+leadZero(date.getHours())+":"+leadZero(date.getMinutes())+":"+leadZero(date.getSeconds());

  // append ".csv" extension to the sheet name
  fileName = sheet.getName() + '_' + timestamp + ".csv";
  // convert all available sheet data to csv format
  var csvFile = convertRangeToCsvFile_(fileName, sheet);
  // create a file in the Docs List with the given name and the csv data
  var file = folder.createFile(fileName, csvFile);
  //File downlaod
  var downloadURL = file.getDownloadUrl().slice(0, -8);
  Browser.msgBox('Files have been exported in your drive to /'+parent+'/'+folderName+'/'+fileName+'.  You can also download it here: '+downloadURL );
}

function leadZero(date) { // a function to convert single digit date / times to double digit, ie 5/3/2022 becomes 05/03/2022
  return ("0" + date).slice(-2)
}

function showurldd(downloadURL) {
  var app = UiApp.createApplication().setHeight('60').setWidth('150');
  //Change what the popup says here
  app.setTitle("Your timetable CSV is ready!");
  var panel = app.createPopupPanel()
  //Change what the download button says here
  var link = app.createAnchor('Click here to download', downloadURL);
  panel.add(link);
  app.add(panel);
  var doc = SpreadsheetApp.getActive();
  doc.show(app);
}

function convertRangeToCsvFile_(csvFileName, sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getValues();
    var csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}
