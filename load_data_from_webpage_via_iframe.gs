function showWebPage() {
  var html = HtmlService.createHtmlOutput(htmlFile)
    .setWidth(1000)
    .setHeight(600)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Open delivery note');
}



htmlFile =`
<html>
  <head>
    <script>
      function sendToAppScript() {
        google.script.run.nisaDN(data)
      }
      function getTable() {
        // Locate the table
        // load it as a 2D array
        // send back to appscript
      }
    </script>
  </head>
  <body>
    <iframe src="https://ntorder.com/default.aspx"
      id="inlineFrameExample"
      title="Inline Frame Example"
      width="700"
      height="450">
    </iframe>
    <div>
      <p id="result"></p>
    </div>
    <button>Add this delivery note</button>
    <button>Reset</button>
    <button>Finished adding delivery notes</button>
    <script type="text/javascript" src="https://apis.google.com/js/api.js?onload=onApiLoad"></script>
  </body>
</html>`;
