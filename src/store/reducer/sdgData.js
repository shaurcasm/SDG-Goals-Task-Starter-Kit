import produce from 'immer';
import { CHANGE_YEAR } from "../actions/actionTypes"
import data2018 from "../../data/2018.json";
import data2019 from "../../data/2019.json";
import data2020 from "../../data/2020.json";
import { YEARS } from "../../config"

// Consolidated Data in an object table indexed to respective years
const dataTable = {
  2018: data2018,
  2019: data2019,
  2020: data2020
}

const INITIAL_STATE = {
    data: dataTable[YEARS[0]],
    error: ""
};

const sdgData = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type) {
        case CHANGE_YEAR:
            draft.data = dataTable[action.year];
            draft.error = action.error;
            break;

        default:
            // Immer takes care of returning state
            break;
    }
});

export default sdgData;