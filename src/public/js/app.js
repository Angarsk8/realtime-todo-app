import React from "react"
import ReactDOM from "react-dom"

import ModalButton from "./components/ModalButton"
import NoteList from "./components/NoteList"

class App extends React.Component {

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
    
    setInterval(() => { 
      server.send(JSON.stringify({type: "PING"})) 
    }, 30000)

    this.server = server
  }

  render(){
    return (
      <div class="container main-content">
        <h2 class="text-primary main-title">Add a task youd like to remember!</h2>
        <ModalButton server={this.server} title="" content=""
          size="large" action="Create" buttonStyle="primary"
          buttonName="Add task!" modalTitle="Take a Note" 
          displayBlock="true" />
        <div class="panels-wrapper">
          <NoteList notes={this.state.notes} server={this.server} />
        </div>
      </div>
    );
  }
}

const app = document.getElementById("app")
ReactDOM.render(<App/>, app)
