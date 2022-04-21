// Returns match or specified match or false
String.prototype.getMatch = function(regex, index = 1){
    let match = this.match(regex);

    if(match){
        if(match.length == 1){
            return match[0];
        } else {
            return match[index];
        }
    } else {
        return false;
    }
};

function secondsToTime(seconds){
    var hours = Math.trunc(seconds / 3600);
    var minutes = Math.trunc(seconds % 3600 / 60);
    var seconds = Math.trunc(seconds % 60);
    return prependZero(hours) + ":" + prependZero(minutes) + ":" + prependZero(seconds);
}

function scrollIntoView(ele){
    var scrollto = ele.offset().top + ele.height();
    var windowpos = window.innerHeight + window.scrollY;
    if(windowpos < scrollto){
        var move = (scrollto - windowpos + 20) / 40;
        scrollStep(Math.ceil(move), 40);
    }
}

function scrollStep(move, x){
    setTimeout(function(){
        window.scrollTo(0, window.scrollY + move);
        if(x-- != 0)
            scrollStep(move, x);
    },1);
}

String.prototype.insert = function(index, string){
    if(index > 0)
        return this.slice(0, index) + string + this.slice(index);
    else
        return string + this;
}

String.prototype.timeToSeconds = function(){
    var array = this.split(":");
    return parseInt(array[0]*3600) + parseInt(array[1]*60) + parseInt(array[2]);
}

String.prototype.date_filter = function(){
    var now = new Date();
    var day = String(now.getDate()).padStart(2, 0);
    var month = String(now.getMonth()+1).padStart(2, 0);
    var year = now.getFullYear();
    var yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    var yday = String(yesterday.getDate()).padStart(2, 0);
    var ymonth = String(yesterday.getMonth()+1).padStart(2, 0);
    var yyear = yesterday.getFullYear();

    if(this.slice(0,4) == year){            // same year
        if(this == year + "-" + month + "-" + day){
            return "Today";
        } else {
            if(this == yyear + "-" + ymonth + "-" + yday){
                return "Yesterday";
            } else{
                return this.substr(5);
            }
        }
    } else {
        return this;
    }
}
