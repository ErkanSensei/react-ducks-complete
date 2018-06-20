#!/usr/bin/env node
let shell = require('shelljs');
let colors = require('colors');
let fs = require('fs');
let templates = require('./templates/templates.js')
let Template = require('./templates/containers/Template');

let appName = process.argv[2].trim().replace(' ', '');
let appDirectory = `${process.cwd()}/${appName}`;

isValid = str => {
    if (!str) {
        return false;
    }

    for (let i = 0; i < str.length; i += 1) {
        if (str[i] === str[i].toUpperCase()) {
            return false;
        }
    }

    const containsSymbols = !/^[a-zA-Z]+$^(?!.*(-|_))/.test(appName);
    if (containsSymbols) {
        return false;
    }

    return true;
}

const createReactApp = () => {
    return new Promise(resolve => {
        if(appName){
            shell.exec(`create-react-app ${appName}`, (res) => {
                if (res === 127) {
                    console.log('create-react-app not found!'.red);
                    console.log('Installing create-react-app globally...'.green);
                    shell.exec(`npm install -g create-react-app`, res => {
                        run();
                        resolve(false);
                    });
                }
                else {
                    resolve(true);
                }
        })
        } else{
            console.log("\nNo app name was provided.".red);
            console.log("\nProvide an app name in the following format: ");
            console.log("\nreact-reducks-complete ", "app-name\n".cyan);
            resolve(false);
        }
    })
}

const cdIntoNewApp = () => {
    return new Promise(resolve=>{
        shell.cd(appDirectory);
        resolve();
    })
}

const installPackages = () => {
    return new Promise(resolve=>{
      console.log("\nInstalling packages: redux, react-router, react-router-dom, react-redux, and redux-thunk\n".cyan);
      shell.exec(`npm install --save redux react-router react-redux redux-thunk react-router-dom`, () => {
        console.log("\nFinished installing packages\n".green);
        console.log("\nInstalling dev packages: generact");
        shell.exec(`npm install --dev --save generact`, () => {
            console.log("\nFinished installing dev packages\n".green);
            resolve();
        })
      })
    })
}

const createFolders = () => {
  return new Promise(async resolve => {
    await shell.exec(`mkdir ${appDirectory}/src/containers`);
    await shell.exec(`mkdir ${appDirectory}/src/containers/Template`);
    await shell.exec(`mkdir ${appDirectory}/src/components`);
    resolve();
  })
}
const updateTemplates = () => {
    return new Promise(async resolve=>{
      await createFolders();
      let promises = []
      Object.keys(templates).forEach((fileName, i)=>{
        promises[i] = new Promise(res=>{
          fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
              if(err) { return console.log(err) }
              res()
          })
        })
      })
      Object.keys(containers).forEach((fileName, i)=>{
        promises.push(new Promise(res=>{
          fs.writeFile(`${appDirectory}/src/containers/Home/${fileName}`, containers[fileName], function(err) {
              if(err) { return console.log(err) }
              res()
          })
        }));
      })

      const package = JSON.parse(JSON.stringify(require(`${appDirectory}/package.json`)));
      package.scripts['generact'] = 'node ./node_modules/generact';
      promises.push(new Promise(res => {
          fs.writeFile(`${appDirectory}/package.json`, JSON.stringify(package, null, 4), err => {
          if(err) { return console.log(err) }
          res();
        })}));
      Promise.all(promises).then(()=>{resolve()})
    })
}


const run = async () => {
    let success = await createReactApp();
    if(!success){
      return false;
    }
    await cdIntoNewApp();
    await installPackages();
    await updateTemplates();
    console.log("All done!".green);
  }
  run();
