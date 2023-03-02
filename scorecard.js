const url = "https://www.espncricinfo.com//series/indian-premier-league-2022-1298423/chennai-super-kings-vs-kolkata-knight-riders-1st-match-1304047/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
//Home Page
function processScorecard(url) {
    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log("Error");
    }
    else {
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    // Venue date opponent result runs balls fours sixes sr
    // ipl 
    //     team 
    //         player
    //             runs balls fours sixes sr opponent venue date
    // venue date result
    // venue date -> ds-text-tight-m ds-font-regular ds-text-typo-mid3
    // result -> ds-text-tight-m ds-font-regular ds-truncate ds-text-typo
    let $ = cheerio.load(html);
    let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo");
    let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();
    let innings = $(".ds-rounded-lg.ds-mt-2");
    //let htmlString = "";
    for(let i =0; i< innings.length; i++){
       //htmlString += $(innings[i]).html();
    //     team opponent
        let teamName = $(innings[i]).find(".ds-bg-ui-fill-translucent-hover").text().split("(")[0].trim();
        let opponentInd = i==0 ? 1 : 0;
        let opponentName = $(innings[opponentInd]).find(".ds-bg-ui-fill-translucent-hover").text().split("(")[0].trim();
        console.log(`Team Name is ${teamName} and Opponent Name is ${opponentName} at ${venue} Location and Date is ${date}`);
        let cInning = $(innings[i]);
        // console.log(cInning.text());
        let allRows = cInning.find(".ci-scorecard-table tbody tr");
        for(let j = 0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("ds-whitespace-nowrap");
            //console.log(isWorthy, innings.length);
            if (isWorthy == true){
         //   player -> runs balls fours sixes sr opponent
                // console.log(allCols.text());
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, venue, date, opponentName, result);
            }
        }
    }
    //console.log(htmlString);
}


function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, venue, date, opponentName, result){
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, playerName+ ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        playerName,
        teamName,
        opponentName,
        venue,
        date,
        runs,
        balls,
        fours,
        sixes,
        result,
        sr
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}
function dirCreator(filePath){
    if( fs.existsSync(filePath) == false){
    fs.mkdirSync(filePath);
    }
}
    //new workbook
function excelWriter(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    // json data -> excel format convert 
    let newWS = xlsx.utils.json_to_sheet(json);
    // ->newwb , ws , sheet name
    xlsx.utils.book_append_sheet(newWB, newWS,sheetName);
    // filepath
    xlsx.writeFile(newWB, filePath);
}
    
function excelReader(filePath, sheetName){
    if (fs.existsSync(filePath) == false){
        return [];
    }
    // workbook getd
    let wb = xlsx.readFile(filePath);
    //sheet data - get
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    scorecard : processScorecard
}