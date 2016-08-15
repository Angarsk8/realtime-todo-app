import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Button } from 'react-bootstrap'

import NoteItem from './Note/NoteItem'

const notes = ({ notes, server }) => {
  return notes.map(noteProps => (
    <NoteItem
      { ...noteProps }
      key={ noteProps.id }
      server={ server }
    />
  ))
}

const NoteList = (props) => {
  return (
    <div>
      <ReactCSSTransitionGroup
        transitionName="fadeToggle"
        transitionEnterTimeout={ 500 }
        transitionLeaveTimeout={ 800 }
      >
        { notes(props) }
      </ReactCSSTransitionGroup>
    </div>
  )
}

export default NoteList
