'use strict';

const CONSTANTS = {
  CAPTURE_DATA                  : true,
  CAPTURE_TRANSFORMS            : false,
  CAPTURE_TRANSFORM_INTERVAL_MS : 500,
};

const RESEARCH_STATE = {
  STOPPED   : "STOPPED",
  PREPARED  : "PREPARED",
  STARTED   : "STARTED",
};

const EXP_TYPE = {
  FITTS       : 'FITTS',
  FITTS_LOOK  : 'FITTS_LOOK'
};

const TARGET_TYPE = {
  LOOK        : 'LOOK',
  SELECT      : 'SELECT',
  INCORRECT   : 'INCORRECT',
  MISSED      : 'MISSED',
  NONE        : 'NONE'
};

const EVENT_FROM_SERVER = 'CIRCLES_RESEARCH_EVENT';
const EVENT_FROM_CLIENT = 'CIRCLES_RESEARCH_EVENT';

const EVENT_TYPE = {
  CONNECTED             : 'CONNECTED',
  EXPERIMENT_PREPARE    : 'EXPERIMENT_PREPARE',
  EXPERIMENT_START      : 'EXPERIMENT_START',
  EXPERIMENT_STOP       : 'EXPERIMENT_STOP',
  EXPERIMENT_PAUSE      : 'EXPERIMENT_PAUSE',
  EXPERIMENT_UNPAUSE    : 'EXPERIMENT_UNPAUSE',
  SELECTION_START       : 'SELECTION_START',
  SELECTION_STOP        : 'SELECTION_STOP',
  NEW_TRIAL             : 'NEW_TRIAL',
  SELECTION_ERROR       : 'SELECTION_ERROR',
  TRANSFORM_UPDATE      : 'TRANSFORM_UPDATE',
  DOWNLOAD_READY        : 'DOWNLOAD_READY',
  NONE                  : 'NONE'
};

const createExpData = (   event_type=CIRCLES.RESEARCH.EVENT_TYPE.NONE, exp_id='', user_id='', user_type=CIRCLES.USER_TYPE.NONE,
                          target_active=-1, targets=[0], targets_x_rot=0.0, targets_y_rot=0.0, targets_depth=10.0, targets_width=0.5, targets_radius=4.0, 
                          and={} 
                      ) => {
        return {  event_type:     event_type,
                  exp_id:         exp_id,
                  user_id:        user_id,
                  user_type:      user_type,
                  target_active:  target_active,
                  targets:        targets,
                  targets_x_rot:  targets_x_rot,
                  targets_y_rot:  targets_y_rot,
                  targets_depth:  targets_depth,
                  targets_width:  targets_width,
                  targets_radius: targets_radius,
                  and:            and
                };
};

module.exports = {
  CONSTANTS,
  RESEARCH_STATE,
  EXP_TYPE,
  TARGET_TYPE,
  EVENT_FROM_SERVER,
  EVENT_FROM_CLIENT,
  EVENT_TYPE,
  createExpData
};
