const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecard");

function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log("Error");
        }
        else {
            getAllLink(html);
        }
    });
}

function getAllLink(html){
    let $ = cheerio.load(html);
    let scorecardElem = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
    for(let i = 0; i < scorecardElem.length; i++){
        let link = $(scorecardElem[i]).attr('href');
        let fullLink = "https://www.espncricinfo.com" + link;
        // console.log(fullLink);
        scorecardObj.scorecard(fullLink);
    }
}

module.exports = {
    getAllMatch : getAllMatchesLink
}