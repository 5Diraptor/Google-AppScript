/*
  * Title: Convert Number Into Spreadsheet Column letter
  * Author: 5Diraptor
  * 
  * Description:
  * This is a Google AppScript function for converting a number / integer into a
  * column letter.  Useful when working with arrays and needing to place data in
  * certain columns depending on location in array.
  * 
  * Usage: 
  * pass a number into the function, get a column letter out.
  * return col(3) // column 3 = "C"
  * return col(27) // column 27 = "AA"
  * return col(59) // column 59 = "BG" 
  * 
  * Todo: I need to add a function loop as this only works for columsn up to 2 characters
*/


function col(i=1) {
  var cols = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var v
  if (i>26) {
    let ii = Math.floor(i/26)
    i = i-(ii*26)
    v = cols.slice(ii,ii+1) + cols.slice(i,i+1)
  } else {
    v = cols.slice(i,i+1)
  }
  return v
}
