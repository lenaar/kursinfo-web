import {connect} from 'inferno-mobx'
import Component from 'inferno-component'
import {Link} from 'inferno-router'

@connect(['sampleStore'])
class SampleIndex extends Component{

  constructor(props) {
    super(props)
  }

  render({sampleStore}) {
    return (
      <div>
        <h1>Lista av berg</h1>
        <ul>
          {
            sampleStore.coolMountains.map(coolMountain => (
              <li key={coolMountain.id}>
                <Link to={`/node/section/${coolMountain.id}`}>{coolMountain.name}</Link>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default SampleIndex