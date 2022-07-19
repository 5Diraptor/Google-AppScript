/*
  * Original source: https://www.labnol.org/code/20039-google-picker-with-apps-script
  * Further reference: https://developers.google.com/apps-script/samples/automations/import-csv-sheets
*/

function showPicker() {
  var html = HtmlService.createHtmlOutput(htmlFile)
    .setWidth(1000)
    .setHeight(600)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select File');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}


function getGDriveFile(id) {
  if (id == "") {
    Browser.msgBox("No file selected")
    return
  }

  var file = DriveApp.getFileById(id);
  var ftype = file.getMimeType()
  var fname = file.getName()

  let testSht = SS.getSheetByName("Sheet9")
  // SS.getSheetByName("Sheet9").getRange("A1").setValue(ftype)
  // SS.getSheetByName("Sheet9").getRange("A2").setValue(fname)

  if (ftype == "text/csv" && fname.split('.').pop() == "csv") {
    var content = file.getBlob().getDataAsString();
    // let d1 = JSON.stringify(csvParser(content))
    let d = csvParser(content)

    // clear the sheet
    clearSheet("Sheet9")

    // paste the data into the spreadsheet
    for (var i=1; i<d.length; i++) {
      let dt = d[i-1]
      var rr=""
      if (dt.length >1) {
        rr = "A"+i+":"+col(dt.length)+i
      } else {
        rr = "A"+i
      }
      let rg = testSht.getRange(rr)
      // Logger.log(rr + " > " + dt)
      rg.setValues([dt])
    }
    Browser.msgBox("Successfully imported the file: "+ fname)
  } else {
    Browser.msgBox("The selected file is the wrong type.  Please choose a valid CSV file and try again.")
  }

  // rg.setValue(msg)
  // Browser.msgBox(msg)
}



function csvParser(csvString, delimiter = ",") {

  if (!csvString || !csvString.length)
    return [];

  const pattern = new RegExp(
   ( "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
     "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
     "([^\"\\" + delimiter + "\\r\\n]*))"
   ), "gi"
  );

  let rows = [[]]; 
  let matches = false;

  while (matches = pattern.exec(csvString)) {

    const matched_delimiter = matches[1];
    const matched_cellQuote = matches[2];
    const matched_cellNoQuote = matches[3];

    /*
     * Edge case: Data that starts with a delimiter
     */
    if (matches.index == 0 && matched_delimiter)
      rows[rows.length - 1].push("");

    /*
     * Fix empty lines
     */
    if(!matches[2] && !matches[3])
      continue;

    if (matched_delimiter.length && matched_delimiter !== delimiter)
      rows.push([]);

    const matched_value = (matched_cellQuote)
      ? matched_cellQuote.replace(
          new RegExp("\"\"", "g"), "\""
        )
      : matched_cellNoQuote;

    rows[rows.length - 1].push(matched_value);

   }

   return rows;
}



var htmlFile = `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
    <script type="text/javascript">
      var DIALOG_DIMENSIONS = {
        width: 600,
        height: 475,
      };
      var pickerApiLoaded = false;

      function onApiLoad() {
        gapi.load('picker', {
          callback: function () {
            pickerApiLoaded = true;
          },
        });
        google.script.run.withSuccessHandler(createPicker).withFailureHandler(showError).getOAuthToken();
      }

      function createPicker(token) {
        if (pickerApiLoaded && token) {

          var uplView = new google.picker.DocsUploadView()

          var docsView = new google.picker.DocsView()
            // .addView(google.picker.ViewId.DOCUMENTS)
            // .setIncludeFolders(true).setOwnedByMe(true)
            // .setIncludeFolders(true).setOwnedByMe(false)
            // .addView(google.picker.ViewId.SPREADSHEETS)
            .setIncludeFolders(true)
            // .setMimeTypes('application/vnd.google-apps.folder')
            // .setSelectFolderEnabled(true);
          
          var picker = new google.picker.PickerBuilder()
            // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            // .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
            .addView(uplView)
            .addView(google.picker.ViewId.SPREADSHEETS)
            .addView(docsView)
            // .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .hideTitleBar()
            .setSize(DIALOG_DIMENSIONS.width - 1, DIALOG_DIMENSIONS.height - 1)
            .setOAuthToken(token)
            .setCallback(pickerCallback)
            //.setCallback(google.script.run.fileIdCb)
            .setOrigin('https://docs.google.com')
            .build();

          console.log("testing opens")
          console.info(picker)
          console.log("testing closes")

          picker.setVisible(true);
          picker.W.style.top = 0;
          picker.W.style.left = 0;
          picker.W.style.border = 0;
          picker.W.style.height = "600px";
          picker.W.style.width = "1000px";
          picker.W.style.boxShadow = 0;
          
          picker.De.style.width = "100%";
          picker.De.style.height = "95%";
          
        } else {
          showError('Unable to load the file picker.');
        }
      }

      /**
       * A callback function that extracts the chosen document's metadata from the
       * response object. For details on the response object, see
       * https://developers.google.com/picker/docs/result
       *
       * @param {object} data The response object.
       */
      function pickerCallback(data) {
        var action = data[google.picker.Response.ACTION];
        if (action == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          var id = doc[google.picker.Document.ID];

          console.log("test in")
          // test get file by id
          //var fileData = google.script.run.getGDriveFile(id);
          google.script.run.getGDriveFile(id);
          console.log("test out")

          // Show the ID of the Google Drive folder
          document.getElementById('result').innerHTML = "Processing file...  please wait for this window to close automatically.";
        } else if (action == google.picker.Action.CANCEL) {
          google.script.host.close();
        }
      }

      function showError(message) {
        document.getElementById('result').innerHTML = 'Error: ' + message;
      }
    </script>
    <style>
      .picker-dialog-old {
        height:490px;
      }
    </style>
  </head>

  <body>
    <div>
      <p id="result"></p>
    </div>
    <script type="text/javascript" src="https://apis.google.com/js/api.js?onload=onApiLoad"></script>
  </body>
</html> `;
