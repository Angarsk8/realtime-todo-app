import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default class ModalButton extends Component {
  constructor(props) {
    super(props)
    this.handleClose  = this.handleClose.bind(this)
    this.handleOpen   = this.handleOpen.bind(this)
    this.handleEnter  = this.handleEnter.bind(this)
    this.handleAction = this.handleAction.bind(this)
    this.state  = {
      showModal   : false,
      titleError  : false,
      contentError: false
    }
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  handleOpen() {
    this.setState({ showModal: true })
  }

  handleAction() {
    const title   = this.refs.titleInput.value.trim()
    const content = this.refs.contentInput.value.trim()
    const type    = this.props.action.toUpperCase()
    const id      = this.props.noteId

    if (!title || !content) {
      this.setState({
        titleError  : !title   ? true : false,
        contentError: !content ? true : false
      })
      return false
    }

    const payload = JSON.stringify({ title, content, type, id })
    this.props.server.send(payload)

    this.setState({
      showModal   : false,
      titleError  : false,
      contentError: false
    })
  }

  handleEnter(e) {
    if(e.which === 13){
      this.handleAction()
    }
  }

  render() {
    return (
      <div>
        <Button
          onClick={ this.handleOpen }
          bsStyle={ this.props.buttonStyle }
          className={ this.props.displayBlock ? 'btn-block' : '' }
          bsSize={ this.props.size }
        >
          { this.props.buttonName }
        </Button>
        <Modal
          show={ this.state.showModal }
          onHide={ this.handleClose }
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">
              { this.props.modalTitle }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <h5 className="text-info">Title</h5>
              <input
                autoFocus
                type="text"
                className="form-control custom-typo"
                ref="titleInput"
                placeholder="Write a title for the note"
                defaultValue={ this.props.title }
              />
              <label
                className={ this.state.titleError ? 'error' : 'hidden' }
              >
                Please, enter a title for your note!
              </label>
            </div>
            <div className="form-group">
              <h5 className="text-info">Content</h5>
              <textarea
                className="form-control custom-typo"
                rows="4" ref="contentInput"
                placeholder="Your content..."
                defaultValue={ this.props.content }
                onKeyPress={ this.handleEnter }
              ></textarea>
              <label
                className={ this.state.contentError ? 'error' : 'hidden' }
              >
                Please, enter a description for your note!
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.handleClose }>Close</Button>
            <Button
              onClick={ this.handleAction }
              bsStyle="primary"
            >
              { this.props.action }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
