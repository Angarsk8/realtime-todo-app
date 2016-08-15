import React from 'react'

import NoteHeading from './Sections/NoteHeading'
import NoteBody from './Sections/NoteBody'

const NoteItem = (props) => {
  return (
    <div className="panel panel-default note-panel">
      <NoteHeading { ...props } sectionName="title" />
      <NoteBody    { ...props } sectionName="content" />
    </div>
  )
}

export default NoteItem
