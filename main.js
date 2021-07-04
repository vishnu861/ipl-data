const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const allmatch = require('./allmatch.js');
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const iplpath = path.join(__dirname,"ipl");
dircreater(iplpath);
request(url,cb);
function cb(err,res,html){
    if(err){
        console.log(err);
    }
    else{
        extracthtml(html);
    }
}

function extracthtml(html){
    let $ = cheerio.load(html);
    let anchorele = $(".widget-items.cta-link .label");
    let mainlink = $(anchorele).attr("href");
    mainlink = "https://www.espncricinfo.com"+mainlink;
    //console.log(mainlink);
    request(mainlink,allmatch.requestlink);
}


function dircreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}
