import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkZoomSlider from '@boundlessgeo/sdk/components/map/zoom-slider';
import SdkScaleLine from '@boundlessgeo/sdk/components/map/scaleline';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import '@boundlessgeo/sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

/** A popup for marking features when they
 *  are selected.
 */
class FeaturesPopup extends SdkPopup {

  render() {
    const feature_names = this.props.features.map(f => f.properties.name);

    return this.renderPopup((
      <div className='sdk-popup-content'>
        You clicked here:<br />
        <code>
          { this.props.coordinate.hms }
        </code>
        <br />
        <p>
          Feature NAME(s):<br />
          <code>{ feature_names }</code>
          <br />
        </p>
      </div>
    ));
  }
}

class App extends Component {

  componentDidMount() {
    // start in the middle of italy
    store.dispatch(SdkMapActions.setView([12, 40], 4));

	  // add the OSM source
	  store.dispatch(SdkMapActions.addSource('osm', {
      type: 'raster',
      tileSize: 256,
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
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

    // add the wms source
    store.dispatch(SdkMapActions.addSource('states', {
      type: 'raster',
      tileSize: 256,
      tiles: ['https://demo.boundlessgeo.com/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&SRS=EPSG:900913&LAYERS=topp:states&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],
    }));

    // add the wms layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'states',
      source: 'states',
      type: 'raster',
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
            <SdkMap
              includeFeaturesOnClick
              onClick={(map, xy, featuresPromise) => {
                featuresPromise.then((featureGroups) => {
                  // setup an array for all the features returned in the promise.
                  let features = [];

                  // featureGroups is an array of objects. The key of each object
                  // is a layer from the map.
                  for (let g = 0, gg = featureGroups.length; g < gg; g++) {
                    // collect every feature from each layer.
                    const layers = Object.keys(featureGroups[g]);
                    for (let l = 0, ll = layers.length; l < ll; l++) {
                      const layer = layers[l];
                      features = features.concat(featureGroups[g][layer]);
                    }
                  }

                  if (features.length === 0) {
                    // no features, :( Let the user know nothing was there.
                    map.addPopup(<SdkPopup coordinate={xy} closeable><i>No features found.</i></SdkPopup>);
                  } else {
                    // Show the super advanced fun popup!
                    map.addPopup(<FeaturesPopup coordinate={xy} features={features} closeable />);
                  }
                }).catch((exception) => {
                  console.error('An error occurred.', exception);
                });
              }}
            >
              <SdkScaleLine />
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
