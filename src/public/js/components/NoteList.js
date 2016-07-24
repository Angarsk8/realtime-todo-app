import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

import NoteItem from "./Note/NoteItem"

export default class NoteList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notes: [] }
  }

  componentDidMount () {
    const server = new WebSocket(`ws://${location.hostname}:${location.port}/notes`)
    server.onmessage = event => {
      const notes = JSON.parse(event.data)
      this.setState({notes: notes})
    }
    setInterval(() => { server.send(JSON.stringify({type: "PING"})) }, 30000)
    this.server = server
  }

  render(){
    const notes = this.state.notes.map(props =>
      <NoteItem key={props.id} server={this.server} {...props} />
    )
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="fadeToggle"
          transitionEnterTimeout={500} transitionLeaveTimeout={800}>
          {notes}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
