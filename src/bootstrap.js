import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import MaterialUIProvider from "./providers/MaterialUIProvider"
import AlertProvider from "./providers/AlertProvider"
import { ApolloProvider } from "@apollo/client"
import apolloClient from "./apollo/client"

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient} >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <MaterialUIProvider>
            <AlertProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </AlertProvider>
          </MaterialUIProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
