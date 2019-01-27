Generic StdOut parser
========================

[![Version](https://img.shields.io/npm/v/generic-stdout-parser.svg)](https://npmjs.org/package/generic-stdout-parser)
[![Downloads/week](https://img.shields.io/npm/dw/generic-stdout-parser.svg)](https://npmjs.org/package/generic-stdout-parser) 
[![License](https://img.shields.io/npm/l/generic-stdout-parser.svg)](https://github.com/nvuillam/generic-stdout-parser/blob/master/package.json) 

# Description

Unable to find a parser for results of command 'v4l2-ctl --list-ctrls', I had to create it myself.
Soooo fed up of manually creating parsers for cmd/sh/bash command line output logs , I created this NPM package to centralize all my homemade parsers at the same place, and possibly avoid to have to specify the input format

When there are useless lines added to a stdout json or xml shell output, the parser manages to detect and ignore them.

To avoid duplication with linux tables parsing of package [node-shell-parser](https://www.npmjs.com/package/node-shell-parser), it is possible to use 'node-shell-parser' as inputFormat

Available input formats are
- json
- xml
- raw_structure_datatype_props
- shell

Available output formats are 
- javascript object
- JSON
- XML

# Installation

`npm install generic-stdout-parser`

# Usage

```javascript
    const StdOutParser = require('generic-stdout-parser')
    const stdoutlog = [' some useless output line','   <lelama>NUL</lelama>    ',' another useless output line']
    const parseRes = new StdOutParser(stdoutlog).parse()
    console.log(parseRes.result.lelama === "NUL")
```

# Examples 

### Json to JS Object

```
        const StdOutParser = require('generic-stdout-parser')
        const stdoutlog = ['{ "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog).parse()
        assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
```

### JSON to JS Object with crappy extra lines:

```
        const StdOutParser = require('generic-stdout-parser')
        const stdoutlog = ['blablablabla','   { "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog).parse()
        assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
```

### XML to JS Object

```
        const StdOutParser = require('generic-stdout-parser')
        const stdoutlog = '<lelama>NUL</lelama>'
        const parseRes = new StdOutParser(stdoutlog).parse()
        assert(parseRes.result.lelama === "NUL",'lelama property not found in '+JSON.stringify(parseRes))
```

### JSON to XML:

```
        const StdOutParser = require('generic-stdout-parser')
        const stdoutlog = ['{ "lelama": "NUL" }']
        const parseRes = new StdOutParser(stdoutlog,{'resultFormat': 'xml'}).parse()
        console.log(parseRes)
```

### raw_structure_datatype_props (v4l2-ctl --list-ctrls) to JS Object:

```
        const StdOutParser = require('generic-stdout-parser')
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
        assert(parseRes.result.find(x => x.name === 'User Controls').properties
                                    .find(x => x.name === 'brightness').properties
                                    .find(x => x.name === 'value')
                                    .value === '50',
                                    'Unable to find Camera Controls auto_exposure.max with value 3 in '+JSON.stringify(parseRes))
```

### linux shell output to JS Object:

```
        const StdOutParser = require('generic-stdout-parser')
const stdoutlog = `  PID TTY          TIME CMD
        23856 pts/1    00:00:00 ps
        31475 pts/1    00:00:00 bash
        ` ;
        const parseRes = new StdOutParser(stdoutlog,{'inputFormat': 'shell'}).parse()
        assert(parseRes.result[0]['TTY'] === '23856 pts/1','Unable to find TTY = N23856 pts/1 in '+parseRes)
```

Don't hesitate to contribute with GitHub pull requests !

