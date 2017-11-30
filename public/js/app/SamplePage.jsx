import Inferno from 'inferno' // eslint-disable-line
import {Link} from 'inferno-router'

export default function SamplePage ({children}) {
  return (
    <div>
      <Link to='/node'>Start</Link>
      {children}
    </div>
  )
}
