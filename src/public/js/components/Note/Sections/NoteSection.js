import React, { Component } from 'react'

export default class NoteSection extends Component {
  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleEnter  = this.handleEnter.bind(this)
    this.focusElement = this.focusElement.bind(this)
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
