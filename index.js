'use strict';

function initServer(execFile,usage)
{
    const UsageError = usage || `Usage : node ${execFile} [-c certPath]
    [options]
    
Automatically search cert(*.crt) and key(*.key) in certPath, Use http if without [-c certPath].`,

        ExitError = 'The file don`t exist!',
        NotDir = 'The file is not a directory!',
        NotAbsolute = 'Please enter Absolute path!',
        NoCertAndKey = 'Don`t find any cert or key in the directory!';


    const argv = process.argv,
        https = require('https'),
        http = require('http'),
        fs = require('fs'),
        path = require('path');
    if (argv.length === 4) {
        if(argv[2] === '-c'){
            if(fs.existsSync(argv[3])) {
                if(path.isAbsolute(argv[3])){
                    if (fs.statSync(argv[3]).isDirectory()) {
                        var fileArr = fs.readdirSync(argv[3]),
                            cert,
                            key;

                        for (var i = 0; i < fileArr.length; i++) {
                            var realPath = '';
                            if (argv[3].substring(argv[3].length - 1) == '/') {
                                realPath = argv[3] + fileArr[i];
                            } else {
                                realPath = argv[3] + '/' + fileArr[i];
                            }
                            var ext = path.extname(realPath);
                            if (!cert) {
                                if (ext == '.crt') {
                                    cert = realPath;
                                }
                            }

                            if (!key) {
                                if (ext == '.key') {
                                    key = realPath;
                                }
                            }
                        }

                        if (cert && key) {
                            //TODO : https
                            var ssl = {
                                key: fs.readFileSync(key),
                                cert: fs.readFileSync(cert)
                            };
                            return https.createServer(ssl);
                        } else {
                            Log(NoCertAndKey);
                        }

                    } else {
                        Log(NotDir);
                    }
                }else{
                    Log(NotAbsolute);
                }
            }else{
                Log(ExitError);
            }
        }else{
            Log(UsageError);
        }
    }else if(process.argv.length ===2){
        return http.createServer();
    }else{
        Log(UsageError);
    }
}

function Log(error) {
    console.log(error)
}

module.exports = initServer;