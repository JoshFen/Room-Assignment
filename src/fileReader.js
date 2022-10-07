var parser = require('simple-excel-to-json')

function readExcel(){
    try{
        var doc = parser.parseXls2Json('./data/CSProjectWithoutNames.xls'); 
        console.log(doc[0])
      }
      catch(err){
        console.log(err)
      }
}


//---------------------------------------------------------------------------
module.exports = {
  readExcel
};