import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Button } from 'react-bootstrap'

import NoteItem from "./Note/NoteItem"

export default class NoteList extends React.Component {
  render(){
    const notes = this.props.notes.map(note =>
      <NoteItem key={note.id} server={this.props.server} {...note} />
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
