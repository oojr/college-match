import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import reducers from "../reducers";

function configureAppStore(preloadedState) {
  const logger = (store) => (next) => (action) => {
    console.group(action.type);
    console.info("dispatching", action);
    let result = next(action);
    console.log("next state", store.getState());
    console.groupEnd();
    return result;
  };

  const round = (number) => Math.round(number * 100) / 100;

  const monitorReducerEnhancer =
    (createStore) => (reducer, initialState, enhancer) => {
      const monitoredReducer = (state, action) => {
        const start = performance.now();
        const newState = reducer(state, action);
        const end = performance.now();
        const diff = round(end - start);

        console.log("reducer process time:", diff);

        return newState;
      };

      return createStore(monitoredReducer, initialState, enhancer);
    };

  const persistConfig = {
    key: "primary",
    storage,
    whitelist: ["user"],
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: [logger, ...getDefaultMiddleware()],
    preloadedState,
    enhancers: [monitorReducerEnhancer],
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}

export const store = configureAppStore();
export const persistor = persistStore(store);
