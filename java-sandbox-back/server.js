const express = require('express')
const fs = require('node:fs');
const { exec } = require('node:child_process');
const app = express()
const port = 3000

app.use(express.json())

const executeJava = (code) => {
    let className = code.match(/class\s+[A-Za-z0-9]+/)
    if(className && className[0]){
        className = className[0].split(" ")[1]
    }
    else className = null
    let javaDir = './java'
    return new Promise((resolve, reject) => {
        if(!className){
            resolve("Syntax Error: No class defined!")
        }
        fs.rm(javaDir, {recursive: true}, err => {
            if(err){
                console.error(err)
            }
            fs.mkdir(javaDir, err => {
                if(err){
                    console.error(err)
                }                    
                fs.writeFile(`./${className}.java`, code, err => {
                    if(err){
                        console.error(err)
                    }
                    exec(`javac -d . ./${className}.java`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`error: ${error.message}`);
                            resolve(error.message)
                        }
                        if (stderr) {
                            console.error(`stderr: ${stderr}`);
                        }
                        // success javac, go to pack to jar
                        console.log(`stdout: ${stdout}`);
                        exec(`jar cvfe ./${className}.jar ${className} ./${className}.class`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`error: ${error.message}`);
                            }
                            if (stderr) {
                                console.error(`stderr: ${stderr}`);
                            }
                            // success jar, go to execute jar and get result, or error.
                            console.log(`stdout: ${stdout}`);
                            exec(`java -jar ./${className}.jar`, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`error: ${error.message}`);
                                }
                                if (stderr) {
                                    console.error(`stderr: ${stderr}`);
                                }
                                console.log(`stdout: ${stdout}`);
                                
                                // clear up java files
                                fs.rmSync(`./${className}.class`)
                                fs.rmSync(`./${className}.jar`)
                                fs.rmSync(`./${className}.java`)
                                // return stdout to outside
                                resolve(stdout)
                            });
                        });
                    });
                })
            })
        })
    })
}

app.post('/compileAndRun', async (req, res) => {
  // execute java, assume java env is already there
    let code = req.body.code;

    executeJava(code).then(result => {
        res.send(result)
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})