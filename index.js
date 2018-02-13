const fs = require('fs');
const path = require('path');
const stream = require('stream');
const readline = require('readline');

function csvConvert( inFile){

var lineNum=0;
var nameArray;
var i=0;
var s="";

var writeJSON = fs.createWriteStream(inFile + '.json',
				{
				 flags: 'a' // apend
				});
   

var rdCSV = readline.createInterface({
    input: fs.createReadStream(inFile)
});


rdCSV.on('line', function(line) {
	
	var lineArray;
	if (lineNum===0){
			nameArray=line.split(','); // first line is the field names
			writeJSON.write('[');
	}
	else{
		lineArray = line.split(',');
		if (lineNum!==1)
				s = ',\r\n  {';
			else
				s = '\r\n  {';
			
		
		for (i=0; i< lineArray.length; i++) {
		    if (i!=0)
					s = s + ','
			s = s + '\r\n\    ';
			s = s+'"' + nameArray[i] + '": "' + lineArray[i] + '"';	
			
		}
				s = s+ '\r\n  }';
				writeJSON.write(s);	
	}
	lineNum++;
    
});

rdCSV.on('close',function(){
	writeJSON.write('\r\n]');
	lineNum--;
	console.log('converted ' + lineNum +' records from '+inFile);
})

}
csvConvert(process.argv[2]);