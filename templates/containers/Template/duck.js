// Actions
const LOAD   = 'my-app/Template/LOAD';
const CREATE = 'my-app/Template/CREATE';
const UPDATE = 'my-app/Template/UPDATE';
const REMOVE = 'my-app/Template/REMOVE';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}

// Action Creators
export function loadWidgets() {
  return { type: LOAD };
}

export function createWidget(payload) {
  return { type: CREATE, payload };
}

export function updateWidget(payload) {
  return { type: UPDATE, payload };
}

export function removeWidget(widget) {
  return { type: REMOVE, widget };
}

// side effects, only as applicable
// e.g. thunks, epics, etc
export function getWidget () {
  return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
}