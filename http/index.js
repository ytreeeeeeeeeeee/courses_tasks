const http = require('http');

const apiKey = process.env.apiKey;
const city = process.argv.slice(2).join(' ');
const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=`;

if (city !== '') {
    http.get(url + city, (res) => {
        const {statusCode, statusMessage} = res;
        if (statusCode !== 200) {
            console.log(`Error: ${statusMessage}`);
            return;
        }
    
        res.setEncoding('utf8');
        let rowData = '';
        res.on('data', (chunk) => rowData += chunk);
        res.on('end', () => console.log(JSON.parse(rowData)));
    }).on('error', (err) => console.error(err));
}
else {
    console.log("Please enter a valid City Name");
}
