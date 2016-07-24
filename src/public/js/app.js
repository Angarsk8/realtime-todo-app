import React from "react"
import ReactDOM from "react-dom"
import $ from "jquery"

import NoteList from "./components/NoteList"

// Bootstrap.$ = $
// Bootstrap.jQuery = $

const app = document.getElementById("panels-wrapper")
ReactDOM.render(<NoteList/>, app)

$('.add-task').on('click', e => {
  e.preventDefault()
  cleanInputForm()
  $('#task-form')
  .attr("note-action", "CREATE")
  .find("#submit-button")
  .text("Create")
  $('#input-form').modal('show')
})

$('#input-form').on('shown.bs.modal', () => { $('#note-title').focus() })

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
