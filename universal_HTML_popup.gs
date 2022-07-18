function popup(title, text) {
  let html = HtmlService
    .createHtmlOutput(text)
    .setWidth(250) //optional
    .setHeight(50)
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, title);
}
