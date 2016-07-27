import React from "react"
import { Button, Modal } from 'react-bootstrap'

export default class ModalButton extends React.Component {

  constructor(props) {
    super(props)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.handleAction = this.handleAction.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.state = { 
      showModal: false,
      titleError: false,
      contentError: false
    }
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  handleAction() {

    const title = this.refs.titleInput.value
    const content = this.refs.contentInput.value


    if(!title && !content){
      this.setState({ titleError: true, contentError: true })
      return
    }

    if(!title){
      this.setState({ titleError: true, contentError: false })
      return
    }

    if(!content){
      this.setState({ titleError: false, contentError: true })
      return
    }

    let payload = {}
    let id = ""

    switch (this.props.action.toUpperCase()) {
      case "CREATE":
        payload = {title , content, type: "CREATE"}
        break;
      case "UPDATE":
        id = this.props.noteId
        payload = {id, title , content, type: "UPDATE"}
        break;
    }

    this.props.server.send(JSON.stringify(payload))
    this.setState({
      showModal: false,
      titleError: false,
      contentError: false
    })
  }

  handleEnter(e){
    if(e.which === 13){
      this.handleAction()
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.open} bsStyle={this.props.buttonStyle}
          class={this.props.displayBlock == "true" ? "btn-block" : ""}
          bsSize={this.props.size}>
          {this.props.buttonName}
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title class="text-primary">{this.props.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <h5 class="text-info">Title</h5>
              <input autoFocus type="text" class="form-control custom-typo"
               ref="titleInput" placeholder="Write a title for the note"
               defaultValue={this.props.title} />
              <label class={this.state.titleError ? "error" : "hidden"}>
                Please, enter a title for your note!
              </label>
            </div>
            <div class="form-group">
              <h5 class="text-info">Content</h5>
              <textarea class="form-control custom-typo" rows="4" ref="contentInput"
                placeholder="Your content..." defaultValue={this.props.content}
                onKeyPress={this.handleEnter}></textarea>
              <label class={this.state.contentError ? "error" : "hidden"}>
                Please, enter a description for your note!
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button onClick={this.handleAction} bsStyle="primary">
            {this.props.action}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
