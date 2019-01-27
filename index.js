"use strict"; 

// Dependencies
const xml2js = require('xml2js');
const chai = require('chai'); 

// Constants
const ALLOWED_FORMAT_LIST = ['json','xml','raw_structure_datatype_props'];

// Main package class
class StdOutParser {

    // Constructor
    constructor(logContentArg,optionsArg) {
        // input
        this.logContent = logContentArg || null; // raw log content
        this.options = optionsArg || {} //{inputFormat: 'unknown', resultFormat: 'object'}
        this.inputFormat = this.options.inputFormat || 'unknown'
        this.resultFormat = this.options.resultFormat || 'object'  

        // internal
        this.logContentFrmt = null  // converted log content ( list of strings )

        // result
        this.dataResult = null 
        this.objectResult = null 
    }

    // Main method to call from package users code
    parse() {
        this.convertLogContent()
        this.identifyInputFormat()
        this.extractData()
        this.buildResult()
        return this.result 
    }

    // Converts input logContent into list of strings
    convertLogContent() {
        if (Array.isArray(this.logContent))
            this.logContentFrmt = this.logContent ;
        else if (typeof this.logContent == 'string') {
            this.logContentFrmt = this.logContent.split('\n');
        }
        else if (this.logContent == null) {
            console.warn('generic-stdout-parser: WARNING : null input data')
            this.logContentFrmt =  [];
        }
        else  
            throw new Error('generic-stdout-parser: Unrecognized stdout data');
    }

    // Identify the format of the stdout log sent as input data
    identifyInputFormat() {

        // Format sent in options
        if (this.inputFormat && this.inputFormat != 'unknown') {
            chai.assert.ok(ALLOWED_FORMAT_LIST.includes(this.options.inputFormat),'generic-stdout-parser: ERROR : Allowed inputFormat values are '+ALLOWED_FORMAT_LIST.join(','));
        }

        // json
        else if (this.logContentFrmt.length ===1 && this.isJson(this.logContentFrmt[0]) )
            this.inputFormat = 'json';

        // xml
        else if (this.logContentFrmt.length ===1 && this.isXml(this.logContentFrmt[0]) )
            this.inputFormat = 'xml' ;

        // multiline: analyse to see if one of them is XML or JSON (only take the last line corresponding to XML or JSON)
        else {
            let caughtUniqueLine ; 
            this.logContentFrmt.forEach(line => {
                line = line.trim();
                if (line.startsWith('{') || line.startsWith('[')) {
                    this.inputFormat = 'json';
                    caughtUniqueLine = line;
                }
                else if (line.startsWith('<') || line.endsWith('>')) {
                    this.inputFormat = 'xml';
                    caughtUniqueLine = line;
                }
            });
            if (caughtUniqueLine)
                this.logContentFrmt = [caughtUniqueLine];
        }
    }

    // Extract stdout data into object
    extractData() {
        // JSON
        if (this.inputFormat === 'json') {
            this.dataResult = JSON.parse(this.logContentFrmt[0]);
        } 
        // XML
        else if (this.inputFormat === 'xml') {
            var parseString = xml2js.parseString;
            var self = this
            parseString(this.logContentFrmt[0], function (err, result) {
                if (err) 
                    throw new Error('generic-stdout-parser: Unable to parse XML');
                else
                    self.dataResult = result ;
            });
        }
        // raw_structure_datatype_props
        else if (this.inputFormat === 'raw_structure_datatype_props') {
            this.dataResult = []
            let currentCategory = null
            this.logContentFrmt.forEach(line => {
                line = line.trim()
                // empty line
                if (line === '')
                    return ;
                // data line 
                else if (line.includes(':')){
                    // get category name ( ex 'brightness' in 'brightness (int)    : min=0 max=100 step=1 default=50 value=50 flags=slider)'
                    const catPropName = line.substring(0, line.indexOf("(")).trim();
                    // get data type ( ex 'int' in 'brightness (int)    : min=0 max=100 step=1 default=50 value=50 flags=slider)'
                    const catPropDataType = line.slice(line.indexOf('(') +1,line.indexOf(')'));
                    // get sub properties & values
                    const catPropRes = {name: catPropName, dataType: catPropDataType, properties : []}
                    const valuesString = line.substring(line.indexOf(":")+1).trim()
                    const valuesStringSplit = valuesString.split(' ')
                    valuesStringSplit.forEach(item => {
                        const propValSplit = item.split('=')
                        const subProp = { name: propValSplit[0], value: propValSplit[1]}
                        catPropRes.properties.push(subProp)
                    })
                    // add to current browsed category

                    currentCategory.properties.push(catPropRes)

                }
                // category line
                else {
                    // Set previous category if existing
                    if (currentCategory)
                        this.dataResult.push(currentCategory)
                    currentCategory = {name: line,properties: []}
                }
            })
            // Set last category
            if (currentCategory)
                this.dataResult.push(currentCategory)
        }
    }

    // Build parsing result according to expected format
    buildResult() {
        this.objectResult = {inputFormat: this.inputFormat, result: this.dataResult};

        // Object
        if (this.resultFormat === 'object') {
            this.result = this.objectResult ;
        }
        // JSON
        else if (this.resultFormat === 'json') {
            this.result = JSON.stringify(this.objectResult) ;
        }
        // XML
        else if (this.resultFormat === 'xml') {
            var builder = new xml2js.Builder();
            //this.objectResult = {'GenericStdOutParserResult': this.objectResult}
            this.result = builder.buildObject(this.objectResult);
        }
    }

    // Tools
    isXml(str) {
        str = str.trim()
        return str.startsWith('<') && str.endsWith('>')
    }

    isJson(str) {
        str = str.trim()
        return (str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))
    }


}

module.exports = StdOutParser ;