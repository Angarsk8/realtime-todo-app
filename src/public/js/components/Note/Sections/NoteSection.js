import React, { Component } from 'react'

export default class NoteSection extends Component {
  constructor(props) {
    super(props)
    this.state  = { editable: false }
  }

  handleUpdate() { /*Implemented in the children*/ }

  handleRemove() {
    const { id }  = this.props
    const type = 'DELETE'
    const payload = JSON.stringify({ id , type })
    this.props.server.send(payload)
  }

  handleEnter(e) {
    if (e.which === 13) {
      this.handleUpdate()
    }
  }

  focusElement() {
    this.setState({ editable: true })
    setTimeout(() => { this.refs[this.props.sectionName].focus() }, 0)
  }
}
