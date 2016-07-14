let todoState = []

const server = new WebSocket(`ws://${location.hostname}:${location.port}`)

// defines an on_message event handler for incoming messages from server
server.onmessage = e => {
  const todos = JSON.parse(e.data)
  if(todoState.length === 0){
    todoState = todos.slice(0)
    todoState.forEach(todo => appendTodo(JSON.parse(todo)))
  }else{
    const lastTodo = JSON.parse(todos.slice(-1)[0])
    todoState.push(lastTodo)
    appendTodo(lastTodo)
  }
}

// helper function to append a todo item
const appendTodo = todo => {
  const todoHTMLText = todoHTML(todo)
  $(".panels-wrapper").append(todoHTMLText)
}

// helper function to build a todo HTML text
const todoHTML = todo =>
  `<div class="panel panel-default" id="panel-${todo.id}">
    <div class="panel-heading">
      <h3 class="panel-title custom-typo-title" id="title-${todo.id}">
        <span class="text-info">${todo.note_title}</span>
        <span class="pull-right closing-icon">x</span>
      </h3>
    </div>
    <div class="panel-body">
        <div class="custom-typo text-muted" id="content-${todo.id}">${todo.note_content}</div>
        <div class="timestamps">
          <small class="text-success">Created at ${todo.created_at}</small>
        </div>
    </div>
  </div>`

// helper function to clean the modal form
const cleanInputForm = () => {
    $('#input-form').modal('hide')
    $('input[name="note_title"]')
        .val('')
        .removeClass('error')
    $('textarea[name="note_content"]')
        .val('')
        .removeClass('error')
    $('label.error').remove()
}

// binds click method to .add-task button
$('.add-task').on('click', e => {
    e.preventDefault()
    cleanInputForm()
    $('#input-form').modal('show')
})

// binds on_submit method for #task-form form
$('#task-form').on('submit', function (e) {
    e.preventDefault()
    const noteTitle = $("[name=note_title]").val()
    const noteContent = $("[name=note_content]").val()

    const payload =
      JSON.stringify({note_title: noteTitle, note_content: noteContent})

    server.send(payload)

    $('#input-form').modal('hide')
})

// defines basic form validation rules
$('#task-form').validate({
    rules: {
        note_title: {
            required: true,
        },
        note_content: {
            required: true,
        }
    },
    messages: {
        note_title: {
            required: "Please, enter a title for your note!"
        },
        note_content: {
            required: "Please, enter a description for your note!"
        }
    }
})
