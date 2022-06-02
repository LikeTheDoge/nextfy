const chokidar = require('chokidar');
const path = require('path')
const { exec } = require('child_process');
const terminate = require('terminate/promise');


const build = (input) => {
    return new Promise((res, rej) => {
        const task = exec('yarn build', { cwd: path.resolve(__dirname, '../') });

        // 捕获标准输出并将其打印到控制台 
        task.stdout.on('data', function (data) {
            console.log('------------build:output------------\n' + data);
        });

        // 捕获标准错误输出并将其打印到控制台 
        task.stderr.on('data', function (data) {
            console.error('------------build:error------------\n' + data);
        });

        // 注册子进程关闭事件 
        task.on('exit', function () {
            console.log('------------build:done------------');
            res()
        });


        input.off = () => {
            terminate(task.pid)
        }

    })
}

const serve = (input) => {

    return new Promise((res, rej) => {
        const task = exec('yarn serve', { cwd: path.resolve(__dirname, '../') });

        // 捕获标准输出并将其打印到控制台 
        task.stdout.on('data', function (data) {
            console.log('------------server:output------------\n' + data);
        });

        // 捕获标准错误输出并将其打印到控制台 
        task.stderr.on('data', function (data) {
            console.error('------------server:error------------\n' + data);
        });

        // 注册子进程关闭事件 
        task.on('exit', function () {
            console.log('------------server:done------------');
            res()
        });

        input.off = () => {
            terminate(task.pid)
        }
    })
}


const restart = async (input) => {
    if (input.off) {
        try{
            input.off()
        }catch(e){
            console.log('off')
        }
        
    }

    console.log('------------restart------------')
    let off = false
    const res = { off: () => { } }

    input.off = () => {
        off = true
        res.off()
    }

    console.log('build!!!!!')
    if (!off) await build(res)
    console.log('server!!!!!')
    if (!off) await serve(res)
}

let current = { off: () => { console.log(111) } }

// restart(current)

chokidar.watch(path.resolve(__dirname, '../src')).on('all', () => {
    restart(current)
});


process.on('exit', function () {
    current.off()
});

// setTimeout(() => {
//     current.off()
// }, 20000);
