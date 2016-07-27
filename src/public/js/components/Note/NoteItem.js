import React from "react"

import NoteHeading from "./NoteHeading"
import NoteBody from "./NoteBody"

export default class NoteItem extends React.Component {
  render(){
    return (
      <div class="panel panel-default note-panel" id={this.props.id}>
        <NoteHeading {...this.props} />
        <NoteBody {...this.props} />
      </div>
    );
  }
}
