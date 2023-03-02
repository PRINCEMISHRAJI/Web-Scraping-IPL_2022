        //         Made By - Ankit Mishra
        //   Available for Free Use for Everyone
        //         Available for work 

const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
const request = require("request");
const cheerio = require("cheerio");
const getAllMatchObj = require("./getAllMatch");
const fs = require("fs");
const path = require("path");

const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);
//Home Page
request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log("Error");
    }
    else {
        extractLink(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorElem = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2 a");
    let link = anchorElem.attr('href');
    let fullLink = ("https://www.espncricinfo.com" + link);
    // console.log(fullLink);                
    getAllMatchObj.getAllMatch(fullLink);
}

function dirCreator(filePath){
    if( fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }

}