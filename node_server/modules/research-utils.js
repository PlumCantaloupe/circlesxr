const fs    = require('fs')

let experimentInProgress    = false;
let trials                  = [];
let currTrialIndex          = -1;
let startSelectTime         = 0;
let logger                  = null;
let num_errors              = 0;
let expDataFileName        = '';

const startExperiment = (data) => {

    //reset
    experimentInProgress    = false;
    trials                  = [];
    currTrialIndex          = -1;
    startSelectTime         = 0;
    logger                  = null;
    num_errors              = 0;

    const date = new Date();
    const prefixFilePath = __dirname + '/../public';
    expDataFileName =   '/downloads/' + 
                        'FittsSelectExp__' + 
                        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay() + '_' +
                        date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + 
                        '__Data.csv';

    //open stream to start writing data to file
    logger  = fs.createWriteStream(prefixFilePath + expDataFileName, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    logger.on('finish', () => {
        console.log('file created');
    });
    logger.on('error', (err) => {
        console.log(err.stack);
    });

    //set csv titles
    logger.write('exp_id, exp_type, date, time, target_active, targets_x_rot, targets_y_rot, targets_width, targets_depth, targets_radius, targets, num_errors, selection_time_ms');

    let id, type, targets, targets_x_rots, targets_y_rots, targets_widths, targets_depths, num_trials, num_targets, total_exp_permutations, total_exp_trials = null;
    trials = [];

    const expArr = data.and.tests.data;

    if (expArr.length === 0) {
        console.warn("No Experimental Trials loaded");
    }

    for (let i = 0; i < expArr.length; i++) {
        id              = expArr[i].id;
        type            = expArr[i].type;
        targets         = expArr[i].targets;
        targets_x_rots  = expArr[i].targets_x_rots;
        targets_y_rots  = expArr[i].targets_y_rots;
        targets_widths  = expArr[i].targets_widths;
        targets_depths  = expArr[i].targets_depths;
        num_trials      = expArr[i].num_trials;

        num_targets = targets.length;
        num_rounds = Math.floor(num_trials/num_targets);

        total_exp_permutations = targets_x_rots.length * targets_y_rots.length * targets_widths.length * targets_depths.length * num_rounds;
        total_exp_trials = total_exp_permutations * num_targets;
        let exp_trials = [];
        let randIndex = 0;
        let randTrial = null;

        //create empty array that we will set each null index randomly to a permutation object
        //this is so we can randomly order which "trial type we are doing"
        for (let exp_i = 0; exp_i < total_exp_trials; exp_i++) {
            exp_trials.push(null);
        }

        //loop through all possible conditions and add a new trial randomly within trail array
        //wonder if this will perform bad :| Hopefully we can avoid threading for now ...
        for (let xRot_i = 0; xRot_i < targets_x_rots.length; xRot_i++) {
            for (let yRot_i = 0; yRot_i < targets_y_rots.length; yRot_i++) {
                for (let width_i = 0; width_i < targets_widths.length; width_i++) {
                    for (let depth_i = 0; depth_i < targets_depths.length; depth_i++) {
                        for (let round_i = 0; round_i < num_rounds; round_i++) {
                            
                            //get random index that hasn't been used yet
                            randIndex = Math.floor(Math.random() * total_exp_permutations) * num_targets;
                            while (exp_trials[randIndex] !== null) {
                                randIndex = Math.floor(Math.random() * total_exp_permutations) * num_targets;
                            }

                            //add trials 
                            for (let trial_i = 0; trial_i < num_targets; trial_i++) {
                                //create trial
                                randTrial                   = null;
                                randTrial                   = CIRCLES.RESEARCH.createExpData();
                                randTrial.target_active     = targets[trial_i];                   //loop through targets. f we go over num of targets just loop around
                                randTrial.type              = expArr[i].type;                   //knowing what type of select task this is will be useful for the future
                                randTrial.targets           = [].concat(targets);               //all targets visible / cloning array so no weird trouble later
                                randTrial.targets_x_rot     = targets_x_rots[xRot_i];
                                randTrial.targets_y_rot     = targets_y_rots[yRot_i];
                                randTrial.targets_width     = targets_widths[width_i];
                                randTrial.targets_depth     = targets_depths[depth_i];

                                exp_trials[randIndex + trial_i] = randTrial;  //set null value at this index to the randTrial object
                            }
                        }
                    }
                }
            }
        }

        //concat with other experiment trials
        trials = trials.concat(exp_trials);
    }

    experimentInProgress = true;
};

// const restartExperiment = () => {
//     experimentInProgress = true;
// };

// const pauseExperiment = (data) => {
//     experimentInProgress = false;
// };

// const unpauseExperiment = (data) => {
//     experimentInProgress = true;
// };

const stopExperiment = (data) => {
    experimentInProgress    = false;
    trials                  = [];
    currTrialIndex          = -1

    logger.end();
    
    logger                  = null;
    num_errors              = 0;
};

const startSelection = (data) => {
    if (experimentInProgress) {
        num_errors = 0; //reset errors
        startSelectTime = Date.now();
    }
};

const stopSelection = (data) => {
    if (experimentInProgress) {
        const date = new Date();
        const timeToSelect = date - startSelectTime;
        const currTrialObj  = getCurrTrial();

        //formating date and time strings nicely :)
        const expDateStr    = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDay().toString().padStart(2, '0');
        const expTimeStr    = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0') + ':' + date.getMilliseconds().toString().padStart(3, '0');

        console.log('Logging trial --- selectionTime: ' + timeToSelect + ' numErrors: ' + num_errors);

        //create a string to add
        writeExpdata(   data.exp_id,                    currTrialObj.type,          expDateStr,                 expTimeStr,                 currTrialObj.target_active, 
                        currTrialObj.targets_x_rot,     currTrialObj.targets_y_rot, currTrialObj.targets_width, currTrialObj.targets_depth, 
                        currTrialObj.targets_radius,    currTrialObj.targets,       num_errors,                 timeToSelect );
    }
};

const writeExpdata = (  exp_id,         exp_type,       date,           time,           target_active,  
                        targets_x_rot,  targets_y_rot,  targets_width,  targets_depth,  
                        targets_radius, targets,        num_errors,     select_time_ms ) => {
    if (logger !== null) {
        const arrTargetsStr = '"[' + targets.join(',') + ']"';
        logger.write(   '\n' +  exp_id + ',' +          exp_type + ',' +        date + ',' +            time + ',' +            target_active + ',' + 
                                targets_x_rot + ',' +   targets_y_rot + ',' +   targets_width + ',' +   targets_depth + ',' + 
                                targets_radius + ',' +  arrTargetsStr + ',' +   num_errors + ',' +      select_time_ms );
    }
};

const noteSelectionError = (data) => {
    //end timer
    //write data to file
    num_errors++;
};

const getNextTrial = () => {
    //return null if we went through all trials
    return (++currTrialIndex > trials.length - 1) ? null : trials[currTrialIndex]; //send trial data
};

const getCurrTrial = () => {
    return (currTrialIndex > -1) ? trials[getCurrTrialIndex()] : null;
};

const getCurrTrialIndex = () => {
    return currTrialIndex;
};

const isExperimentInprogress = () => {
    return experimentInProgress;
}

const getDownloadLink = () => {
    return (experimentInProgress) ? null : expDataFileName;
}

module.exports = {
    startExperiment,
    // restartExperiment,
    // pauseExperiment,
    // unpauseExperiment,
    stopExperiment,
    startSelection,
    stopSelection,
    noteSelectionError,
    getNextTrial,
    getCurrTrial,
    getCurrTrialIndex,
    isExperimentInprogress,
    getDownloadLink
  };