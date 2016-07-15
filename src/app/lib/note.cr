class Note
  JSON.mapping(
    id:         {type: Int64, nilable: true},
    created_at: {type: String, nilable: true},
    updated_at: {type: String, nilable: true},
    title:      String,
    content:    String
  )

  def format_on_create()
    self.title = self.title.capitalize
    self.content = self.content.capitalize
    self.id = Time.now.epoch_ms
    self.created_at = Time.now.to_s("%m/%d/%Y, %T")
    self.updated_at = Time.now.to_s("%m/%d/%Y, %T")
    self
  end

  def format_on_update()
    self.updated_at = Time.now.to_s("%m/%d/%Y, %T")
    self
  end

  def put(k, v)
    note_as_json = self.to_json
    note_as_hash = JSON.parse(note_as_json).as_h
    note_as_hash[k] = v
    Note.from_json(note_as_hash.to_json)
  end
end
