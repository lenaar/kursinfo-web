import Component from 'inferno-component'
import {connect} from 'inferno-mobx'

@connect(['sampleStore'])
class SampleSection extends Component {
  render ({sampleStore, params}) {
    const mountain = sampleStore.mountainWithId(parseInt(params.id))
    return mountain ? (
      <div>
        <h1>{mountain.name}</h1>
        <dl>
          <dt>Höjd</dt>
          <dd>{mountain.height}</dd>
        </dl>
      </div>
    ) : <div />
  }
}

export default SampleSection
