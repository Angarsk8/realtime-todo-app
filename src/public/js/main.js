// extract properties and methods to be used
const {hostname, port} = location
const {parse, stringify} = JSON

// creates websocket connection with the server
const ws = new WebSocket(`ws://${hostname}:${port}/notes`)

// defines an on_message event handler for incoming messages from the server
ws.onmessage = e => {
  const notes = parse(e.data).map(noteStr => parse(noteStr))
  const notesHTMLText = notes.map(note => noteHTML(note))
  $(".panels-wrapper").html(notesHTMLText)
}

const displayUpdated = (createdAt, updateAt) =>
  createdAt !== updateAt ? "(updated)" : ""

// helper function to build a note HTML text
const noteHTML = note =>
  `<div class="panel panel-default note-panel" note-id="${note.id}">
    <div class="panel-heading">
      <h3 class="panel-title custom-typo-title note-title">
        <span class="text-info note-title-text" >${note.title}</span>
        <span id="updated-text">
          ${displayUpdated(note.created_at, note.updated_at)}
        </span>
        <span class="pull-right closing-icon">x</span>
      </h3>
    </div>
    <div class="panel-body">
        <div class="custom-typo text-muted note-content">${note.content}</div>
        <div class="timestamps">
          <small class="text-success">Created at ${note.created_at}</small>
          | <small class="text-warning">Updated at ${note.updated_at}</small>
        </div>
        <div class="buttons-block">
          <button type="button" class="delete-button btn btn-danger btn-sm app-button">
            Delete
          </button>
          <button type="button" class="edit-button btn btn-warning btn-sm app-button">
            Edit
          </button>
        </div>
  </div>`
