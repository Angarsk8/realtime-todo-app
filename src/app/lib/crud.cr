require "./note"

module CRUD
  def create_note(msg, notes)
    msg.delete("type")
    note = Note.from_json(msg.to_json).format_on_create
    notes.push note.to_json
  end

  def update_note(msg, notes)
    msg.delete("type")
    _note = Note.from_json(msg.to_json).format_on_update
    notes
    .map{ |note_as_json| Note.from_json(note_as_json) }
    .map{ |note| note.id == _note.id ? _note.put("created_at", note.created_at) : note }
    .map{ |note| note.to_json }
  end

  def delete_note(msg, notes)
    notes
    .map{ |note_as_json| Note.from_json(note_as_json) }
    .reject{ |note| note.id == msg["id"]}
    .map{ |note| note.to_json }
  end
end
