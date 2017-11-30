import Inferno from 'inferno'

import {Route, Router} from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { Provider } from 'inferno-mobx'

// Import components
import SamplePage from './SamplePage.jsx'
import SampleIndex from './SampleIndex.jsx'
import SampleSection from './SampleSection.jsx'
import SampleStore from './SampleStore'

function routeFactory (initialPath) {
  const sampleStore = new SampleStore()
  let browserHistory
  if (typeof window !== 'undefined') {
    browserHistory = createBrowserHistory()
    sampleStore.doLoadData()
  } else {
    browserHistory = createMemoryHistory({initialEntries: [initialPath]})
  }

  return (
    <Provider sampleStore={sampleStore}>
      <Router history={browserHistory}>
        <Route component={SamplePage}>
          <Route path='/node' component={SampleIndex} />
          <Route path='/node/section/:id' component={SampleSection} />
        </Route>
      </Router>
    </Provider>
  )
}

if (typeof window !== 'undefined') {
  const appRoutes = routeFactory()
  try {
    require('inferno-devtools')
  } catch (e) {
    console.log("Couldn't load inferno devtools")
  }
  Inferno.render(appRoutes, document.getElementById('app'))
}

export default routeFactory
