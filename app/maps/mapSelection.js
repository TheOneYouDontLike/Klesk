'use strict';

let mapSelection = function() {
    var randoms = {
        random() {
            return Math.random();
        }
    };

    return { 
        getMapFrom(maps, keywords) {
            if(!keywords) {
                return maps[Math.floor(randoms.random()*maps.length)];
            }
        }
    };
};

export default mapSelection;