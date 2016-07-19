'use strict';

$(document).ready(function () {

  $('.add-task').on('click', function (e) {
    e.preventDefault();
    cleanInputForm();
    $('#task-form').attr("note-action", "CREATE").find("#submit-button").text("Create");
    $('#input-form').modal('show');
  });

  $('#input-form').on('shown.bs.modal', function () {
    $('#note-title').focus();
  });

  // event handler for submiting a new task
  $('#task-form').on('submit', function (e) {
    e.preventDefault();

    var type = $("#task-form").attr("note-action");
    var title = $("[name=note_title]").val().trim();
    var content = $("[name=note_content]").val().trim();
    var id = parseInt($("#task-form").attr("note-id"));

    if (!title || !content) return false;

    var _payload = type == "CREATE" ? { title: title, content: content, type: type } : { id: id, title: title, content: content, type: type };
    var payload = JSON.stringify(_payload);

    ws.send(payload);

    $('#input-form').modal('hide');
  });

  // event handler for submiting the form when enter is hit on the textarea
  $("[name=note_content]").keypress(function (e) {
    if (e.which == 13) {
      $('#task-form').submit();
    }
  });

  // event handler for editing inline tasks when enter is hit
  $('.panels-wrapper').on('keypress', "[contenteditable]", function (e) {
    if (e.which == 13) {
      $(this).blur();
    }
  });

  // event handler for deleting a given task
  $('.panels-wrapper').on('click', ".closing-icon, .delete-button", function (e) {
    e.preventDefault();

    var id = parseInt($(this).parents(".note-panel").attr('note-id'));
    var payload = JSON.stringify({ id: id, type: "DELETE" });

    $(this).parents(".note-panel").addClass("animated fadeOut");

    setTimeout(function () {
      ws.send(payload);
    }, 1000);
  });

  // event handler for editing a task inline
  $('.panels-wrapper').on('blur', '[contenteditable]', function () {
    var $panel = $(this).parents(".note-panel");
    var id = parseInt($panel.attr('note-id'));
    var title = $panel.find(".note-title-text").text();
    var content = $panel.find(".note-content").text();
    var payload = JSON.stringify({ id: id, title: title, content: content, type: "UPDATE" });

    $("[contenteditable]").each(function () {
      return $(this).attr("contenteditable", "false");
    });

    ws.send(payload);
  });

  // event handler when clicking the edit button on a given task
  $('.panels-wrapper').on('click', ".edit-button", function (e) {
    e.preventDefault();
    cleanInputForm();
    var $panel = $(this).parents(".note-panel");
    var id = $panel.attr('note-id');
    var title = $panel.find(".note-title-text").text();
    var content = $panel.find(".note-content").text();

    $('[name=note_title]').val(title);
    $('[name=note_content]').val(content);
    $('#task-form').attr("note-action", "UPDATE").attr("note-id", id).find("#submit-button").text("Update");
    $('#input-form').modal('show');
  });

  // helper function to clean the modal form
  var cleanInputForm = function cleanInputForm() {
    $('#input-form').modal('hide');
    $('input[name="note_title"]').val('').removeClass('error');
    $('textarea[name="note_content"]').val('').removeClass('error');
    $('label.error').remove();
  };

  // defines basic form validation rules
  $('#task-form').validate({
    rules: {
      note_title: {
        required: true
      },
      note_content: {
        required: true
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
  });
});

// Extract properties and methods to be used
var _location = location;
var hostname = _location.hostname;
var port = _location.port;

// Create a websocket connection with the server

var ws = new WebSocket('ws://' + hostname + ':' + port + '/notes');

// Handle incoming messages and display them in the document
ws.onmessage = function (e) {
  var notes = JSON.parse(e.data);
  var prev = $(".note-panel").length;
  var cur = notes.length;
  var animation = prev == cur || prev > cur ? "" : "animated fadeIn";
  var $notesHTML = notes.map(function (note, i) {
    return noteHTML(note, setAnimation(notes, i, animation));
  });

  $(".panels-wrapper").html($notesHTML);
};

// Handle disconnection and log it to the console
ws.onclose = function (e) {
  console.log('Connection Closed: ' + e.reason);
};

// Handle connection error and log it to the console
ws.onerror = function (e) {
  console.log('Socket Error: ' + e.data);
};

var setAnimation = function setAnimation(notes, i, animation) {
  return notes.length - 1 === i ? animation : "";
};

// PING the server every minute to stay connected and avoid the browser to disconnect the socket
setInterval(function () {
  ws.send(JSON.stringify({ type: "PING" }));
}, 10000);

// Helper function to build a note HTML text
var noteHTML = function noteHTML(note, animation) {
  return '<div class="panel panel-default note-panel ' + animation + '" note-id="' + note.id + '">\n    <div class="panel-heading">\n      <h3 class="panel-title custom-typo-title note-title">\n        <span contenteditable="true" class="text-info note-title-text"  >' + note.title + '</span>\n        <span class="updated-text">\n          ' + (note.created_at !== note.updated_at ? "(updated)" : "") + '\n        </span>\n        <span class="pull-right closing-icon">x</span>\n      </h3>\n    </div>\n    <div class="panel-body">\n      <div contenteditable="true" class="custom-typo text-muted note-content">' + note.content + '</div>\n      <div class="timestamps">\n        <small class="text-success"><span class="hidden-xs">Created at</span> ' + note.created_at + '</small>\n        | <small class="text-warning"><span class="hidden-xs">Update at</span> ' + note.updated_at + '</small>\n      </div>\n      <div class="buttons-block">\n        <button type="button" class="delete-button btn btn-danger btn-sm app-button">\n          Delete\n        </button>\n        <button type="button" class="edit-button btn btn-warning btn-sm app-button">\n          Edit\n        </button>\n      </div>\n    </div>\n  </div';
};