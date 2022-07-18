function popup(title, text, formatted=false) {
  let html = ''
  if (!formatted) {
    html = HtmlService.createHtmlOutput(text)
  } else {
    html = text
  }
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, title);
}
