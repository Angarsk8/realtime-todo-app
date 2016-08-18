import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'

import ModalButton from 'components/ModalButton'
import NoteSection from './NoteSection'

export default class NoteBody extends NoteSection {
  constructor(props) {
    super(props)
  }

  handleUpdate() {
    const { id, title } = this.props
    const $content = this.refs.content
    const content = $content.textContent.trim()
    const type = 'UPDATE'

    this.setState({ editable: false })

    if (!content) {
      $content.textContent = this.props.content
      return false
    }

    if (this.props.content !== content) {
      const payload = JSON.stringify({ title, content, type, id })
      this.props.server.send(payload)
    }
  }

  render() {
    return (
      <div
        class="panel-body"
        ref="panel"
      >
        <div
          class="custom-typo text-muted note-content"
          contentEditable={ this.state.editable }
          onBlur={ this.handleUpdate }
          onClick={ this.focusElement }
          onKeyPress={ this.handleEnter }
          ref="content"
        >
          { this.props.content }
        </div>
        <div class="timestamps">
          <small class="text-success">
            <span class="hidden-xs">Created at </span>
            { this.props.created_at }
          </small> |
          <small class="text-warning">
            <span class="hidden-xs"> Update at </span>
            { this.props.updated_at }
          </small>
        </div>
        <ButtonToolbar>
          <Button
            class="app-button"
            onClick={ this.handleRemove }
            bsStyle="danger"
            bsSize="small"
          >
            Delete
          </Button>
          <ModalButton
            server={ this.props.server }
            title={ this.props.title }
            content={ this.props.content }
            noteId={this.props.id}
            action="Update"
            buttonName="Edit"
            modalTitle="Update Note"
            buttonStyle="warning"
            size="small"
          />
        </ButtonToolbar>
      </div>
    )
  }
}
