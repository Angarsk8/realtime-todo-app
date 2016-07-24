import React from "react"

import NoteHeading from "./NoteHeading"
import NoteBody from "./NoteBody"

export default class NoteItem extends React.Component {
  render(){
    return (
      <div className="panel panel-default note-panel animated" id={this.props.id}>
        <NoteHeading {...this.props} />
        <NoteBody {...this.props} />
      </div>
    );
  }
}
