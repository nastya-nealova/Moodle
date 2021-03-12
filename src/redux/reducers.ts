import { fromJS, Map } from "immutable";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { CRUD } from "src/commons";
import { USER_LOGIN_SUCCESS, USER_LOGOUT_SUCCESS, SET_IDENTITY } from "src/identity/Identity";
// import {  SET_SSRDATA } from "src/entities/RecipesEntity";
import { DELETE_SSRDATA, SHOW_TOAST, DELETE_NOTIFICATION } from "src/entities/Entity";

const initialEntities = fromJS({});

const entities = (state = initialEntities, action: any) => {
  if (action.hasOwnProperty("glob")) {
    const {
      glob: { crud, entity },
    } = action;
    switch (crud) {
      case CRUD.DELETE:
        {
          let list = state.get(entity.entityName);
          if (list) {
            list = list.remove(action.data.item.get("id"));
            state = state.set(entity.entityName, list);
          }
        }
        break;
      default:
      case CRUD.UPDATE:
        {
          if (action.response && action.response.entities) {
            const {
              response: { entities },
            } = action;
            if (entities) {
              Object.keys(entities).map((entityName) => {
                let list = state.get(entityName);
                if (list && list.size > 0) {
                  Object.keys(entities[entityName]).map(
                    (id) => (list = list.remove(id))
                  );
                }
                state = state.set(entityName, list);
              });
              state = state.mergeDeep(fromJS(entities));
            }
          }
        }
        break;
    }
  }

  return state;
};

const identity = (state = initialEntities, action: any) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
    case USER_LOGOUT_SUCCESS:
    case SET_IDENTITY:
      state = state.set("user", fromJS(action.user));
      break;

  }
  return state;
};

const ssrData = (state = {}, action: any) => {
  switch (action.type) {
    // case SET_SSRDATA:
    //   // console.log("action", action)
    //   state = action.data;
    //   break;
    case DELETE_SSRDATA:
      // console.log("action", action)
      delete state[action.entityName]
      break;
  }
  return state;
};

const notifications = (state = {}, action: any) => {
  switch (action.type) {
    case SHOW_TOAST:
      state = action.toast;
      break;
    case DELETE_NOTIFICATION:
      state = null
      break;
  }
  return state;
};

export default combineReducers({
  entities,
  identity,
  ssrData,
  notifications,
  form: formReducer,
});

