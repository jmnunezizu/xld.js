/*
xld [-c cuesheet] [--ddpms DDPMSfile] [-e] [-f format] [-o outpath] [-t track] [--raw] file
    -c: Cue sheet you want to split file with
    -e: Exclude pre-gap from decoded file
    -f: Specify format of decoded file
          wav        : Microsoft WAV (default)
          aif        : Apple AIFF
          raw_big    : Raw PCM (big endian)
          raw_little : Raw PCM (little endian)
          mp3        : LAME MP3
          aac        : MPEG-4 AAC
          flac       : FLAC
          alac       : Apple Lossless
          vorbis     : Ogg Vorbis
          wavpack    : WavPack
    -o: Specify path of decoded file
        (directory or filename; directory only for cue sheet mode)
    -t: List of tracks you want to decode; ex. -t 1,3,4
    --raw: Force read input file as Raw PCM
           following 4 options are required
      --samplerate: Samplerate of Raw PCM file; default=44100
      --bit       : Bit depth of Raw PCM file; default=16
      --channels  : Number of channels of Raw PCM file; default=2
      --endian    : Endian of Raw PCM file (little or big); default=little
    --correct-30samples: Correct "30 samples moved offset" problem
    --ddpms: DDPMS file (assumes that the associated file is Raw PCM)
    --stdout: write output to stdout (-o option is ignored)
    --profile <name>: Choose a profile saved as <name> in GUI
    --logchecker <path>: Check sanity of a logfile in <path>
*/

/*
var convert = function(file, cb) {
    console.log('Processing the file: %s', file);
    var xld = spawn('xld', ['-f', 'alac', file]);
    xld.stdout.on('data', function(data) {
        //console.log(data);
        //util.print(data + "\r");
    });
    xld.stderr.on('data', function(data) {
        util.print(data + "\r");
    });
    xld.on('exit', function(code) {
        cb(null, code);
    });
};
*/

var exec = require('child_process').exec;

/**
 * Expose the 'XLD' API.
 */
exports = module.exports = Xld;

/**
 * Library version.
 */
exports.version = '0.0.1';

/**
 *
 */
function Xld(filename, options) {
    this.supportedFormats = ['wav', 'aif', 'raw_big', 'raw_little', 'mp3', 'aac', 'flac', 'alac', 'vorbis', 'wavpack'];
    this.filename = filename;
    this.options = [];

    // format
    this.format = options.format || 'wav';

    if (this.supportedFormats.indexOf(options.format) === -1) {
        throw new Error('The format %s is not supported. Supported formats are: %s', options.format, this.supportedFormats);
    }

    this.options.push('-f ' + this.format);
};

/**
 *
 */
Xld.prototype.exec = function(cb) {
    var cmd = 'xld ' + this.options.join(' ') + ' "' + this.filename + '"';
    var proc = exec(cmd, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (err !== null) {
            cb(err);
        } else {
            cb(null, stdout);
        }
    });
};
