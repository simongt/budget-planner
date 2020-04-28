import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk, logger];

const persistConfig = {
  // Root
  key: 'root',
  // Storage Method
  storage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['rootReducer'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: []
};

// combineReducers maps the reducers to the named key for state object in store
const reducers = combineReducers({
  root: rootReducer
});
console.log('Redux store --> reducers', reducers);

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);
console.log('Redux store --> persistedReducer', persistedReducer);

// Create the redux store
const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
console.log('Redux store --> store', store);

// Middleware: Redux Persist Persister
const persistor = persistStore(store);
console.log('Redux store --> persistor', persistor);

// Exports
export { store, persistor };
