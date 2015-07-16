'use strict';

function Ladder(name) {
    return {
        name: name,
        matches: []
    };
}

let newLadderHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback) {
            let ladderName = parsedCommand.arguments[1];

            persistence.add(Ladder(ladderName), (error) => {
                if (error) {
                    callback(error.message, null);
                }

                callback(null, 'Created new ladder: ' + ladderName);
            });
        }
    };
};

export default newLadderHandler;