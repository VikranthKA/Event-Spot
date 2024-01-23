import React from 'react';
import {Provider} from "react-redux"
import ReactDOM from 'react-dom/client';

import App from './App';
import configureStore from './Event-Spot/client/store/configureStore';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Provider store={store}>

        <App />
    </Provider> 
    </BrowserRouter>
);


