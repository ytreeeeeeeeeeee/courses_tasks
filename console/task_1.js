#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function getCurrentTime() {
    return new Date(new Date().toLocaleString('en-US', {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}));
}

yargs(hideBin(process.argv))
    .command('current', 'Получение текущей даты и времени', yargs => {
        yargs
            .option('year', {
                alias: 'y',
                type : 'boolean',
                default: false,
            })
            .option('month', {
                alias: 'm',
                type : 'boolean',
                default: false,
            })
            .option('date', {
                alias: 'd',
                type : 'boolean',
                default: false,
            })
    }, (argv) => {
        const { year, month, date } = argv;
        const curDate = getCurrentTime();
        if (year)
            console.log(`Текущий год: ${curDate.getFullYear()}`);

        if (month)
            console.log(`Текущий месяц: ${curDate.getMonth() + 1}`);

        if (date) 
            console.log(`Дата в календарном месяце: ${curDate.getDate()}`);

        if (!year && !month && !date)
            console.log(`Текущая дата и время в формате ISO: ${curDate.toISOString()}`);
    })
    .command('add', 'Получение даты и времени из будущего', yargs => {
        yargs
            .option('year', {
                alias: 'y',
                type : 'number',
                nargs: 1,
            })
            .option('month', {
                alias: 'm',
                type : 'number',
                nargs: 1,
            })
            .option('date', {
                alias: 'd',
                type : 'number',
                nargs: 1,
            })
    }, (argv) => {
        const { year, month, date } = argv;
        const curDate = getCurrentTime();

        if (year)
            curDate.setFullYear(curDate.getFullYear() + year);

        if (month)
            curDate.setMonth(curDate.getMonth() + month);

        if (date) 
            curDate.setDate(curDate.getDate() + date);

        console.log(`Получившиеся дата и время в формате ISO: ${curDate.toISOString()}`);
    })
    .command('sub', 'Получение даты и времени из прошлого', yargs => {
        yargs
            .option('year', {
                alias: 'y',
                type : 'number',
                nargs: 1,
            })
            .option('month', {
                alias: 'm',
                type : 'number',
                nargs: 1,
            })
            .option('date', {
                alias: 'd',
                type : 'number',
                nargs: 1,
            })
    }, (argv) => {
        const { year, month, date } = argv;
        const curDate = getCurrentTime();

        if (year)
            curDate.setFullYear(curDate.getFullYear() - year);

        if (month)
            curDate.setMonth(curDate.getMonth() - month);

        if (date) 
            curDate.setDate(curDate.getDate() - date);

        console.log(`Получившиеся дата и время в формате ISO: ${curDate.toISOString()}`);
    })
    .argv;