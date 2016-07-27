import React from "react"

export default class NoteHeading extends React.Component {

  constructor(props){
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleEditable = this.handleEditable.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.server = this.props.server

    this.state = {editable: false}
  }

  handleUpdate(){
    const id = this.props.id
    const title = this.refs.title.textContent
    const content = this.props.content

    this.setState({editable: false})

    if(this.props.title !== title){
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
    setTimeout(() => { this.refs.title.focus() }, 0)
  }

  handleEnter(e){
    if(e.which === 13){
      this.handleUpdate()
    }
  }

  render(){
    return (
      <div class="panel-heading">
        <h3 class="panel-title custom-typo-title note-title">
          <span onBlur={this.handleUpdate} onClick={this.handleEditable}
            contentEditable={this.state.editable} ref="title"
            class="text-info note-title-text"
            onKeyPress={this.handleEnter}>
            {this.props.title}
          </span>
          <span class="updated-text">
          {this.props.created_at !== this.props.updated_at ? " (updated)" : ""}
          </span>
          <span onClick={this.handleRemove} 
            class="pull-right closing-icon">x</span>
        </h3>
      </div>
    );
  }
}
