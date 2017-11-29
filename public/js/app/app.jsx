import Inferno from 'inferno'

import {Route, Router} from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'

// Import components
import SamplePage from './SamplePage.jsx'
import SampleIndex from './SampleIndex.jsx'
import SampleSection from './SampleSection.jsx'

function routeFactory (initialPath) {
  let browserHistory
  if (typeof window !== 'undefined') {
    browserHistory = createBrowserHistory()
  } else {
    browserHistory = createMemoryHistory({initialEntries: [initialPath]})
  }

  return (
    <Router history={browserHistory}>
      <Route component={SamplePage}>
        <Route path='/node' component={SampleIndex} />
        <Route path='/node/section' component={SampleSection} />
      </Route>
    </Router>
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
