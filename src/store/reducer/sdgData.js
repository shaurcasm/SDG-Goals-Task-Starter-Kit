import produce from 'immer';

const INITIAL_STATE = {
    data: [],
    error: ""
};

const sdgData = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch(action.type) {

    }
});

export default sdgData;