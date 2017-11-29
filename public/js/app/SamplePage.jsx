import Inferno from 'inferno'
import {Link} from 'inferno-router'

export default function SamplePage ({children}) {
  return (
    <div>
      <ul>
        <li>
          <Link to='/node'>Index</Link>
        </li>
        <li>
          <Link to='/node/section'>Sektion</Link>
        </li>
      </ul>
      {children}
    </div>
  )
}
