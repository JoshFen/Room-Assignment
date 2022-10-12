let parser = require('simple-excel-to-json')

// Reads .xls files and converts them to JSON
function readExcel(file){
    try {
        // Variable 'doc' holds the converted JSON
        let doc = parser.parseXls2Json(file); 
        return doc[0]
      }
      catch(err){
        console.log(err)
        return err
      }
}


//---------------------------------------------------------------------------
module.exports = {
  readExcel
};