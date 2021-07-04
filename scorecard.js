const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
//const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
function geturl(url){
    request(url,cb);
}

function cb(err,res,html){
    if(err){
        console.log(err);
    }
    else{
        extractmatchdetail(html);
    }
}

function extractmatchdetail(html){
    let $ = cheerio.load(html);
    //ipl-> team->player (venue,opponent,data)
    let descr = $(".event .description");
    let result = $(".event .status-text span").text();
    // console.log(descr.text());
    // console.log(result.text());
    let venue = descr.text().split(",")[1].trim();
    let date = descr.text().split(",")[2].trim();
    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    for(let i=0;i<innings.length;i++){
        let team = $(innings[i]).find("h5").text().split("INNINGS")[0].trim();
        let opponent = (i==0)?1:0;
        let oppname = $(innings[opponent]).find("h5").text().split("INNINGS")[0].trim();
        let allrows = $(innings[i]).find(".table.batsman tbody tr");
        for(let j=0;j<allrows.length-1;j++){
            let allcols = $(allrows[j]).find("td");
            let flag = $(allcols).hasClass("batsman-cell");
            if(flag==false)continue;
            let playername = $(allcols[0]).text().trim();
            let runs = $(allcols[2]).text().trim();
            let balls = $(allcols[3]).text().trim();
            let fours = $(allcols[5]).text().trim();
            let sixes =$(allcols[6]).text().trim();
            let sr = $(allcols[7]).text().trim();
            processPlayer(team,playername,runs,balls,fours,sixes,sr,oppname,venue,date,result);;
        }
    }
}


function processPlayer(team,playername,runs,balls,fours,sixes,sr,oppname,venue,date,result){
    let teampath = path.join(__dirname,"ipl",team);
    dircreater(teampath);
    let filepath = path.join(teampath,playername+".xlsx");
    let content = excelreader(filepath,playername);
    let playerobj ={
        team,
        playername,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppname,
        venue,
        date,
        result
    }
    content.push(playerobj);
    excelwritefile(filepath,playername,content);
}

function dircreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}

function excelwritefile(filepath,sheetname,json){
    let newwb = xlsx.utils.book_new();
    let newws = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newwb,newws,sheetname);
    xlsx.writeFile(newwb,filepath);
}

function excelreader(filepath,sheetname){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let exceldata = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(exceldata);
    return ans;
}


module.exports = {
    geturl:geturl
}