// Extract properties and methods to be used
const {hostname, port} = location

// Create a websocket connection with the server
const ws = new WebSocket(`ws://${hostname}:${port}/notes`)

// Handle incoming messages and display them in the document
ws.onmessage = e => {
  const notes = JSON.parse(e.data)
  const prev = $(".note-panel").length
  const cur = notes.length
  const animation = (prev == cur || prev > cur) ? "" : "animated fadeIn"
  const $notesHTML = notes.map((note, i) => noteHTML(note, setAnimation(notes, i, animation)))

  $(".panels-wrapper").html($notesHTML)
}

// Handle disconnection and log it to the console
ws.onclose = e => {
  console.log(`Connection Closed: ${e.reason}`)
}

// Handle connection error and log it to the console
ws.onerror = e => {
  console.log(`Socket Error: ${e.data}`)
}

const setAnimation = (notes, i, animation) =>
  notes.length - 1 === i ?  animation : ""

// PING the server every minute to stay connected and avoid the browser to disconnect the socket
setInterval(() => { ws.send(JSON.stringify({type: "PING"})) }, 10000)

// Helper function to build a note HTML text
const noteHTML = (note, animation) =>
  `<div class="panel panel-default note-panel ${animation}" note-id="${note.id}">
    <div class="panel-heading">
      <h3 class="panel-title custom-typo-title note-title">
        <span contenteditable="true" class="text-info note-title-text"  >${note.title}</span>
        <span class="updated-text">
          ${note.created_at !== note.updated_at ? "(updated)" : ""}
        </span>
        <span class="pull-right closing-icon">x</span>
      </h3>
    </div>
    <div class="panel-body">
      <div contenteditable="true" class="custom-typo text-muted note-content">${note.content}</div>
      <div class="timestamps">
        <small class="text-success"><span class="hidden-xs">Created at</span> ${note.created_at}</small>
        | <small class="text-warning"><span class="hidden-xs">Update at</span> ${note.updated_at}</small>
      </div>
      <div class="buttons-block">
        <button type="button" class="delete-button btn btn-danger btn-sm app-button">
          Delete
        </button>
        <button type="button" class="edit-button btn btn-warning btn-sm app-button">
          Edit
        </button>
      </div>
    </div>
  </div`
