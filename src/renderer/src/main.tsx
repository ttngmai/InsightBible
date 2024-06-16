import 'pretendard/dist/web/variable/pretendardvariable.css'
import './assets/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { createStore, Provider } from 'jotai'

const rootStore = createStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <HashRouter>
        <Routes>
          <Route path="/" Component={App} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>
)
