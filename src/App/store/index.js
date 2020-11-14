import { combineReducers } from "redux";

import { authReducer } from "./authReducer";
import { resolutionReducer } from "./resolutionReducer";

export default combineReducers({
  auth: authReducer.reducer,
  resolution: resolutionReducer.reducer,
});
