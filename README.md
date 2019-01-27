Generic StdOut parser
========================

[![Version](https://img.shields.io/npm/v/generic-stdout-parser.svg)](https://npmjs.org/package/generic-stdout-parser)
[![Downloads/week](https://img.shields.io/npm/dw/generic-stdout-parser.svg)](https://npmjs.org/package/generic-stdout-parser) 
[![License](https://img.shields.io/npm/l/generic-stdout-parser.svg)](https://github.com/nvuillam/generic-stdout-parser/blob/master/package.json) 

# Description

Unable to find a parser for results of command 'v4l2-ctl --list-ctrls', I had to create it myself.
Soooo fed up of manually creating parsers for cmd/sh/bash command line output logs , I created this NPM package to centralize all my homemade parsers at the same place, and possibly avoid to have to specify the input format

When there are useless lines added to a stdout json or xml shell output, the parser manages to detect and ignore them.

To avoid duplication with tables parsing of package [node-shell-parser](https://www.npmjs.com/package/node-shell-parser), it is possible to use 'node-shell-parser' as inputFormat

Available input formats are
- json
- xml
- raw_structure_datatype_props

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

### Input raw_structure_datatype_props:
```
User Controls

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
                   h264_profile (menu)   : min=0 max=4 default=4 value=4
```

Output:
```
{
  "inputFormat": "raw_structure_datatype_props",
  "result": [
    {
      "name": "User Controls",
      "properties": [
        {
          "name": "brightness",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "100"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "50"
            },
            {
              "name": "value",
              "value": "50"
            },
            {
              "name": "flags",
              "value": "slider"
            }
          ]
        },
        {
          "name": "contrast",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "-100"
            },
            {
              "name": "max",
              "value": "100"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "0"
            },
            {
              "name": "value",
              "value": "-10"
            },
            {
              "name": "flags",
              "value": "slider"
            }
          ]
        },
        {
          "name": "saturation",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "-100"
            },
            {
              "name": "max",
              "value": "100"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "0"
            },
            {
              "name": "value",
              "value": "0"
            },
            {
              "name": "flags",
              "value": "slider"
            }
          ]
        },
        {
          "name": "red_balance",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "1"
            },
            {
              "name": "max",
              "value": "7999"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "1000"
            },
            {
              "name": "value",
              "value": "1000"
            },
            {
              "name": "flags",
              "value": "slider"
            }
          ]
        },
        {
          "name": "blue_balance",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "1"
            },
            {
              "name": "max",
              "value": "7999"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "1000"
            },
            {
              "name": "value",
              "value": "1000"
            },
            {
              "name": "flags",
              "value": "slider"
            }
          ]
        },
        {
          "name": "horizontal_flip",
          "dataType": "bool",
          "properties": [
            {
              "name": "default",
              "value": "0"
            },
            {
              "name": "value",
              "value": "0"
            }
          ]
        }
      ]
    },
    {
      "name": "Codec Controls",
      "properties": [
        {
          "name": "video_bitrate_mode",
          "dataType": "menu",
          "properties": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "1"
            },
            {
              "name": "default",
              "value": "0"
            },
            {
              "name": "value",
              "value": "0"
            },
            {
              "name": "flags",
              "value": "update"
            }
          ]
        },
        {
          "name": "video_bitrate",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "25000"
            },
            {
              "name": "max",
              "value": "25000000"
            },
            {
              "name": "step",
              "value": "25000"
            },
            {
              "name": "default",
              "value": "10000000"
            },
            {
              "name": "value",
              "value": "10000000"
            }
          ]
        },
        {
          "name": "repeat_sequence_header",
          "dataType": "bool",
          "properties": [
            {
              "name": "default",
              "value": "0"
            },
            {
              "name": "value",
              "value": "0"
            }
          ]
        },
        {
          "name": "h264_i_frame_period",
          "dataType": "int",
          "properties": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "2147483647"
            },
            {
              "name": "step",
              "value": "1"
            },
            {
              "name": "default",
              "value": "60"
            },
            {
              "name": "value",
              "value": "60"
            }
          ]
        },
        {
          "name": "h264_level",
          "dataType": "menu",
          "properties": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "11"
            },
            {
              "name": "default",
              "value": "11"
            },
            {
              "name": "value",
              "value": "11"
            }
          ]
        },
        {
          "name": "h264_profile",
          "dataType": "menu",
          "properties": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "4"
            },
            {
              "name": "default",
              "value": "4"
            },
            {
              "name": "value",
              "value": "4"
            }
          ]
        }
      ]
    }
  ]
}
```

Don't hesitate to contribute with GitHub pull requests !

