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
