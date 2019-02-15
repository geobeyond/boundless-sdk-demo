import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkZoomSlider from '@boundlessgeo/sdk/components/map/zoom-slider';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import '@boundlessgeo/sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {

  componentDidMount() {
    // start in the middle of america
    store.dispatch(SdkMapActions.setView([12, 40], 4));

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

    // add static geojson layer
    store.dispatch(SdkMapActions.addSource('varchi', {
      type: 'geojson',
      data: 'https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/peterampazzo/OpenData-Padova/master/geojson/varchi.geojson'
    }));

    store.dispatch(SdkMapActions.addLayer({
      id: 'varchi',
      source: 'varchi',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#756bb1',
        'circle-stroke-color': '#756bb1',
      },
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
            <SdkMap>
              <SdkZoomControl style={{position: 'absolute', top: 10, left: 14}} />
              <SdkZoomSlider />
            </SdkMap>
          </Provider>
		    </div>
      </div>
    );
  }
}

export default App;
