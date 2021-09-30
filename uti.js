// Return first real regex match - works with () - or null
String.prototype.getMatch = function(regex){
    let match = this.match(regex);

    if(match){
        if(match.length == 1){
            return match[0];
        } else {
            return match[1];
        }
    } else {
        return null;
    }
};

