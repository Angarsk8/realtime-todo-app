import React, { Component } from 'react'
import { render } from 'react-dom'

import ModalButton from 'components/ModalButton'
import NoteList from 'components/NoteList'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { notes: [] }
  }

  componentDidMount() {

    const { hostname, port } = location
    const server = new WebSocket(`ws://${hostname}:${port}/notes`)

    server.onmessage = event => {
      const notes = JSON.parse(event.data)
      this.setState({ notes: notes })
    }

    this.server = server
  }

  render() {
    return (
      <div className="container main-content">
        <h2 className="text-primary main-title">
          Add a task you'd like to remember!
        </h2>
        <ModalButton
          server={ this.server }
          size="large"
          action="Create"
          buttonStyle="primary"
          buttonName="Add Task!"
          modalTitle="Take a Note"
          displayBlock={ true }
        />
        <div className="panels-wrapper">
          <NoteList
            notes={ this.state.notes }
            server={ this.server }
          />
        </div>
      </div>
    )
  }
}

const app = document.getElementById("app")
render(<App/>, app)
