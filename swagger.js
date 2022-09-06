//const { Swagger2Postman } = require('swagger2-to-postman')
//const{ Swagger2Postman} = require('/usr/local/lib/node_modules/swagger2-to-postman/convert.js'),
//let swaggerConverter = new Swagger2Postman();
//Optionally, set a logger:
//var convertResult = Swagger2Postman().convert('/home/cloud/vpcep.json');
//console.log(Swagger2Postman().convert('/home/cloud/vpcep.json').status);
var Swagger2Postman = require('./convert.js'),
                 fs = require('fs'),
               path = require('path');
const commandLineArgs = require('command-line-args');


/* global describe, it */
function convert_postman_collection_v1 (swagger_file_path) {
//    var samples = fs.readdirSync(path.join('/home/cloud/vpcep.json', 'data');

  //  samples.map(function (sample) {
   //     var samplePath = path.join(__dirname, 'data', sample);
//	var samplePath='/home/cloud/vpcep.json';
	       var path = swagger_file_path;
            var swagger = require(path),
              converter = new Swagger2Postman(),
          convertResult = converter.convert(swagger);

            console.log("the status of conversion from swagger file to collection :",convertResult.status);
       //  console.log(convertResult.collection);
	    // var output_to_file= JSON.stringify(convertResult.collection);
	// write to file     
	// fs.writeFileSync('/home/cloud/postman.collection',output_to_file);
    return convertResult.collection;
}
//variables in collection variable 
function Add_collection_variables(collection,path_){
  var variables=[];
// grep all the variables
  for (i=0;i<collection.requests.length;i++){
    variables.push(collection.requests[i].url.match(RegExp("{{([a-zA-Z_]+)}}",'g')))
  }
// flatten the array so we can filter out the repeated variables 
  variables=variables.flat();
  let uniqueChars = variables.filter((c, index) => {
    return variables.indexOf(c) === index;
});
// format as postmna coll variables
// var initial_string=',"variable": ['
// for (i=0;i<uniqueChars.length;i++){
//   if (i==uniqueChars.length-1){
//     initial_string+='{"key":"'+uniqueChars[i]+'","value": ""}'

//   }
//   else{
//     initial_string+='{"key":"'+uniqueChars[i]+'","value": ""},'

//   }
// }
// initial_string+="]}"
// return initial_string;
// format as env variables 
var initial_string='{"id": "2d1e92af-9aec-4cab-8d8b-6212b5c8a61e","name": "environ.json","values": [';
for (i=0;i<uniqueChars.length;i++){
  if (i==uniqueChars.length-1){
    initial_string+='{"key":"'+uniqueChars[i].replace("{{","").replace("}}","")+'","value": "","enabled": true}'

  }
  else{
    initial_string+='{"key":"'+uniqueChars[i].replace("{{","").replace("}}","")+'","value": "","enabled": true},'

  }
}
initial_string+='],"_postman_variable_scope": "environment","_postman_exported_at": "2021-09-29T14:07:06.787Z","_postman_exported_using": "Postman/8.2.3"}'
var file=path.join(path_,"environment_variables.json");
//console.log(file);
fs.writeFileSync(file,initial_string);
	 }

// convert v1 to v2 

////
function fix_postman_version(output_v2_path,swagger_file_path){
    var transformer = require('postman-collection-transformer'),
    objectToConvert = convert_postman_collection_v1(swagger_file_path) ,
            options = {
                         inputVersion: '1.0.0',
                        outputVersion: '2.0.0',
                        retainIds: true,  // the transformer strips request-ids etc by default.,
           //     	    overwrite:true
        };

    transformer.convert(objectToConvert, options, function (err, converted) {
      converted=JSON.stringify(converted);
     // converted.replace(/\d$/, '');
     //converted+=
       // console.log(converted);
	    fs.writeFileSync(output_v2_path,converted);
    });
    // Add the environment for the apis
    var directory_collection=path.dirname(output_v2_path);
   // console.log(directory_collection,typeof(directory_collection));
    Add_collection_variables(objectToConvert,directory_collection);
	 }

const optionDefinitions = [
  { name: 'output_collection_path', alias: 'o',type: String },
  { name: 'input_swagger', alias: 'i', type: String }
]
const options = commandLineArgs(optionDefinitions)
//fix_postman_version('/home/cloud/output_v2.json','/home/cloud/vpcep.json');
//console.log(options)
fix_postman_version(options.output_collection_path,options.input_swagger);


