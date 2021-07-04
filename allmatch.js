const request = require("request");
const cheerio = require("cheerio");
const score = require("./scorecard");

function requestlink(err,res,html){
    if(err){
        console.log(err);
    }
    else{
        extractallmatcheslink(html);
    }
}

function extractallmatcheslink(link){
    let $ = cheerio.load(link);
    let scorecardEle = $("a[data-hover='Scorecard']");
    for(let i=0;i<scorecardEle.length;i++){
       let l = $(scorecardEle[i]).attr("href");
       let fulllink = "https://www.espncricinfo.com"+l;
      // console.log(fulllink);
        score.geturl(fulllink);
    }
}

module.exports = {
    requestlink:requestlink
}