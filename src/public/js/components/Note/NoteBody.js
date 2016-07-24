import React from "react"

export default class NoteBody extends React.Component {

  constructor(props){
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleEditable = this.handleEditable.bind(this)
    this.server = this.props.server

    this.state = {editable: false}
  }

  handleUpdate(){
    const id = this.props.id
    const title = this.props.title
    const content = this.refs.content.textContent

    this.setState({editable: false})

    if(this.props.content !== content){
      const payload = JSON.stringify({id, title, content, type: "UPDATE"})
      this.server.send(payload)
    }
  }

  handleRemove(){
    const payload = JSON.stringify({ id: this.props.id, type: "DELETE" })
    this.server.send(payload)
  }

  handleEditable(){
    this.setState({editable: true})
    setTimeout(() => { this.refs.content.focus() }, 0)
  }

  render(){
    return (
      <div className="panel-body">
        <div onBlur={this.handleUpdate} onClick={this.handleEditable}
             contentEditable={this.state.editable} ref="content"
             className="custom-typo text-muted note-content">
          {this.props.content}
        </div>
        <div className="timestamps">
          <small className="text-success">
            <span className="hidden-xs">Created at </span>{this.props.created_at}
          </small> |
          <small className="text-warning">
            <span className="hidden-xs"> Update at </span>{this.props.updated_at}
          </small>
        </div>
        <div className="buttons-block">
          <button onClick={this.handleRemove} type="button"
                  className="delete-button btn btn-danger btn-sm app-button">Delete</button>
          <button type="button"
                  className="edit-button btn btn-warning btn-sm app-button">Edit</button>
        </div>
      </div>
    );
  }
}
