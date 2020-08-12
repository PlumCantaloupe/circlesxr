
let experimentInProgress    = false;
let trials                  = [];
let currTrialIndex          = -1;

const startExperiment = (data) => {
    let id, record, targets, targets_x_rots, targets_y_rots, target_widths, target_depths, num_trials = null;
    trials = [];

    const expArr = data.and.tests.data;
    for (let i = 0; i < expArr.length; i++) {
        id              = expArr[i].id;
        record          = expArr[i].record;
        targets         = expArr[i].targets;
        targets_x_rots  = expArr[i].targets_x_rots;
        targets_y_rots  = expArr[i].targets_y_rots;
        target_widths   = expArr[i].target_widths;
        target_depths   = expArr[i].target_depths;
        num_trials      = expArr[i].num_trials;

        // console.log('id:' + id);
        // console.log('record:' + record);
        // console.log('num_targets:' + num_targets);
        // console.log('targets_x_rots:' + targets_x_rots);
        // console.log('targets_y_rots:' + targets_y_rots);
        // console.log('target_widths:' + target_widths);
        // console.log('target_depths:' + target_depths);
        // console.log('num_trials:' + num_trials);

        total_exp_trials = targets_x_rots.length * targets_y_rots.length * target_widths.length * target_depths.length * num_trials;
        let exp_trials = [];
        let randIndex = 0;

        //create empty array that we will set each null index randomly to a trial object
        for (let exp_i = 0; exp_i < total_exp_trials; exp_i++) {
            exp_trials.push(null);
        }

        //loop through all possible conditions and add a new trial randomly within trail array
        //wonder if this will perform bad :| Hopefully we can avoid threading for now ...
        for (let xRot_i = 0; xRot_i < targets_x_rots.length; xRot_i++) {
            for (let yRot_i = 0; yRot_i < targets_y_rots.length; yRot_i++) {
                for (let width_i = 0; width_i < target_widths.length; width_i++) {
                    for (let depth_i = 0; depth_i < target_depths.length; depth_i++) {
                        for (let trial_i = 0; trial_i < num_trials; trial_i++) {
                            
                            //get random index
                            randIndex = Math.floor(Math.random() * total_exp_trials);
                            while (exp_trials[randIndex] !== null) {
                                randIndex = Math.floor(Math.random() * total_exp_trials);
                            }

                            //create trial
                            let randTrial = {
                                                id:             id,
                                                record:         record,
                                                targets:        targets,                            //all targets visible
                                                target_active:  targets[trial_i % targets.length],  //may as well loop through all available targets. +1 as '0' is reserved for centre look target
                                                targets_x_rot:  targets_x_rots[xRot_i],
                                                targets_y_rot:  targets_y_rots[yRot_i],
                                                target_width:   target_widths[width_i],
                                                target_depth:   target_depths[depth_i],
                                            };

                            exp_trials[randIndex] = randTrial;  //set null value at this index to the randTrial object
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

const restartExperiment = () => {
    experimentInProgress = true;
};

const pauseExperiment = (data) => {
    experimentInProgress = false;
};

const unpauseExperiment = (data) => {
    experimentInProgress = true;
};

const stopExperiment = (data) => {
    experimentInProgress = false;
};

const startSelection = (data) => {
    //start timer
};

const stopSelection = (data) => {
    //end timer
    //write data to file
};

const noteSelectionError = (data) => {
    //end timer
    //write data to file
};

const startNextTrial = () => {
    return trials[++currTrialIndex]; //send trial data
};

const getCurrTrial = () => {
    return (currTrialIndex > -1) ? trials[getCurrTrialIndex] : null;
};

const getCurrTrialIndex = () => {
    return currTrialIndex;
};

const isExperimentInprogress = () => {
    return experimentInProgress;
}

module.exports = {
    startExperiment,
    restartExperiment,
    pauseExperiment,
    unpauseExperiment,
    stopExperiment,
    startSelection,
    stopSelection,
    noteSelectionError,
    startNextTrial,
    getCurrTrial,
    getCurrTrialIndex,
    isExperimentInprogress
  };