import React from 'react'

import NoteSection from './NoteSection'

export default class NoteHeading extends NoteSection {
  constructor(props) {
    super(props)
  }

  handleUpdate() {
    const { id, content } = this.props
    const $title = this.refs.title
    const title = $title.textContent.trim()
    const type = 'UPDATE'

    this.setState({ editable: false })

    if (!title) {
      $title.textContent = this.props.title
      return false
    }

    if (this.props.title !== title) {
      const payload = JSON.stringify({ title, content, type, id })
      this.props.server.send(payload)
    }
  }

  render() {
    return (
      <div class="panel-heading">
        <h3 class="panel-title custom-typo-title note-title">
          <span
            class="text-info note-title-text"
            contentEditable={ this.state.editable }
            onBlur={ ::this.handleUpdate }
            onClick={ ::this.focusElement }
            onKeyPress={ ::this.handleEnter }
            ref="title"
          >
            { this.props.title }
          </span>
          <span class="updated-text">
            {
              this.props.created_at !== this.props.updated_at
                ? '  (updated)'
                : ''
            }
          </span>
          <span
            onClick={ ::this.handleRemove }
            class="pull-right closing-icon"
          >
            x
          </span>
        </h3>
      </div>
    )
  }
}
