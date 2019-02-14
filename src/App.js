import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

class App extends Component {

  componentDidMount() {
	  // add the OSM source
	  store.dispatch(SdkMapActions.addSource('osm', {
		type: 'raster',
		tileSize: 256,
		tiles: [
		  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
		  'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
		  'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
		],
	  }));

	  // add an OSM layer
	  store.dispatch(SdkMapActions.addLayer({
		id: 'osm',
		source: 'osm',
	  }));
	}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>
			    <Provider store={store}>
            <SdkMap />
          </Provider>
		    </div>
      </div>
    );
  }
}

export default App;
