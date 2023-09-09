const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({input, output});

const num = Math.floor(Math.random() * 100);

console.log('Загадано число в диапазоне от 0 до 100');

rl.on('line', (answer) => {
    if (answer > num) {
       console.log('Меньше');
    }
    else if (answer < num) {
        console.log('Больше');
    }
    else {
        console.log(`Отгадано число ${answer}`)
        rl.close();
    }
})
