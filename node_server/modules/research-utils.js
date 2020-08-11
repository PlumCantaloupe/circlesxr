
let experimentInProgress    = false;
let trialInProgress         = false;
let trials                  = [];
let currTrialIndex          = -1;

const loadExperimentScript = (data) => {
    console.log(data);
};

const getNumOfTrialsCompleted = () => {
    return currTrialIndex;
};

const getNextTrial = () => {
    return {};
};

const isExperimentInprogress = () => {
    return experimentInProgress;
}

const isTrialInprogress = () => {
    return trialInProgress;
}

module.exports = {
    loadExperimentScript,
    getNumOfTrialsCompleted,
    getNextTrial,
    isExperimentInprogress,
    isTrialInprogress
  };