// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { SocketProvider } from "./context/SocketContext.jsx";
import Loader from "./components/Loader.jsx";


const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<Loader />}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
