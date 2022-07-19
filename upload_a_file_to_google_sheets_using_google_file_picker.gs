function showPicker() {
  var html = HtmlService.createHtmlOutput(htmlFile)
    .setWidth(1052)
    .setHeight(590)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Folder');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
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
          // var docsView = new google.picker.DocsUploadView()
            // .addView(google.picker.ViewId.DOCUMENTS)
            // .addView(google.picker.ViewId.SPREADSHEETS)
            // .setIncludeFolders(true)
            // .setMimeTypes('application/vnd.google-apps.folder')
            // .setSelectFolderEnabled(true);
          
          var picker = new google.picker.PickerBuilder()
            .addView(uplView)
            .addView(docsView)
            // .enableFeature(google.picker.Feature.NAV_HIDDEN)
            // .hideTitleBar()
            .setSize(DIALOG_DIMENSIONS.width - 1, DIALOG_DIMENSIONS.height - 1)
            .setOAuthToken(token)
            .setCallback(pickerCallback)
            .setOrigin('https://docs.google.com')
            .build();

          picker.setVisible(true);
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
          // Show the ID of the Google Drive folder
          document.getElementById('result').innerHTML = id;
        } else if (action == google.picker.Action.CANCEL) {
          google.script.host.close();
        }
      }

      function showError(message) {
        document.getElementById('result').innerHTML = 'Error: ' + message;
      }
    </script>
    <style>
      .picker-dialog {
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
</html>`;
