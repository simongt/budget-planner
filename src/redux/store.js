import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'; // <- needed if using firestore
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/firestore';
// import { firebaseConfig, firebase, auth, db, firestore } from '../services/firebase';
import { rootReducer, authReducer, dataReducer } from './reducers';

const initialState = {};

const middleware = [thunk, logger]; // ?

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
  root: rootReducer,
  auth: authReducer,
  data: dataReducer
});
console.log('Redux store --> reducers', reducers);

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);
console.log('Redux store --> persistedReducer', persistedReducer);

// Create the redux store
const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // ?
);
console.log('Redux store --> store', store);

// Middleware: Redux Persist Persister
const persistor = persistStore(store);
console.log('Redux store --> persistor', persistor);

// Exports
export { store, persistor };
