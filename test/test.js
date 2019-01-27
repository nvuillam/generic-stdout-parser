const StdOutParser = require('../index.js')

const chai = require('chai'); 
const xml2js = require('xml2js');
const parseXmlString = xml2js.parseString;


describe('StdOutParser', function() {
  // Parse method
  describe('#parse', function() {

    it('should return a parsed object from JSON log', function() {
        const stdoutlog = ['{ "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog).parse()
        chai.assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
    });

    it('should return a parsed object from JSON log with extra useless lines and spaces in input arguments', function() {
        const stdoutlog = ['blablablabla','   { "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog).parse()
        chai.assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
    });

    it('should return a parsed object from XML log', function() {
        const stdoutlog = '<lelama>NUL</lelama>'
        const parseRes = new StdOutParser(stdoutlog).parse()
        chai.assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
    });

    it('should return a parsed object from XML log with extra useless lines and spaces in input arguments', function() {
        const stdoutlog = [' blablabla youhou','   <lelama>NUL</lelama>    ']
        const parseRes = new StdOutParser(stdoutlog).parse()
        chai.assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
    });

    it('should return a parsed XML from JSON log', function() {
        const stdoutlog = ['{ "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog,{'resultFormat': 'xml'}).parse()
        parseXmlString(parseRes, function(err,parsedXmlRes) {
            chai.assert(parsedXmlRes.root.result[0].lelama[0] === 'NUL','lelama property not found in '+parseRes)
        })
    });

    it ('should parse a v4l2-ctl --list-ctrls command log', function() {
        const stdoutlog = `User Controls

        brightness (int)    : min=0 max=100 step=1 default=50 value=50 flags=slider
          contrast (int)    : min=-100 max=100 step=1 default=0 value=-10 flags=slider
        saturation (int)    : min=-100 max=100 step=1 default=0 value=0 flags=slider
       red_balance (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
      blue_balance (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
   horizontal_flip (bool)   : default=0 value=0

Codec Controls

video_bitrate_mode (menu)   : min=0 max=1 default=0 value=0 flags=update
     video_bitrate (int)    : min=25000 max=25000000 step=25000 default=10000000 value=10000000
repeat_sequence_header (bool)   : default=0 value=0
h264_i_frame_period (int)    : min=0 max=2147483647 step=1 default=60 value=60
        h264_level (menu)   : min=0 max=11 default=11 value=11
      h264_profile (menu)   : min=0 max=4 default=4 value=4` ;
        const parseRes = new StdOutParser(stdoutlog,{inputFormat: 'raw_structure_datatype_props'}).parse()
        chai.assert(parseRes.result.find(x => x.name === 'User Controls').properties
                                    .find(x => x.name === 'brightness').properties
                                    .find(x => x.name === 'value')
                                    .value === '50',
                                    'Unable to find Camera Controls auto_exposure.max with value 3 in '+JSON.stringify(parseRes))

    });

    it('should return a parsed XML from shell log', function() {
        const stdoutlog = `  PID TTY          TIME CMD
        23856 pts/1    00:00:00 ps
        31475 pts/1    00:00:00 bash
        ` ;
        const parseRes = new StdOutParser(stdoutlog,{'inputFormat': 'shell'}).parse()
        chai.assert(parseRes.result[0]['TTY'] === '23856 pts/1','Unable to find TTY = N23856 pts/1 in '+parseRes)
    });

  });
});