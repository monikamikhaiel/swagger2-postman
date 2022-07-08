//const { Swagger2Postman } = require('swagger2-to-postman')
//const{ Swagger2Postman} = require('/usr/local/lib/node_modules/swagger2-to-postman/convert.js'),
//let swaggerConverter = new Swagger2Postman();
//Optionally, set a logger:
//var convertResult = Swagger2Postman().convert('/home/cloud/vpcep.json');
//console.log(Swagger2Postman().convert('/home/cloud/vpcep.json').status);
var Swagger2Postman = require('swagger2-to-postman-updated'),
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
          console.log(convertResult.collection);
	    // var output_to_file= JSON.stringify(convertResult.collection);
	// write to file     
	// fs.writeFileSync('/home/cloud/postman.collection',output_to_file);
    return convertResult.collection;
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
        console.log(converted);
	    converted=JSON.stringify(converted);
	    fs.writeFileSync(output_v2_path,converted);
    });



	 }

const optionDefinitions = [
  { name: 'output_collection_path', alias: 'o',type: String },
  { name: 'input_swagger', alias: 'i', type: String }
]
const options = commandLineArgs(optionDefinitions)
//fix_postman_version('/home/cloud/output_v2.json','/home/cloud/vpcep.json');
//console.log(options)
fix_postman_version(options.output_collection_path,options.input_swagger);


