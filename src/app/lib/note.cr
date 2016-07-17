class Note
  JSON.mapping(
    id: {type: Int64, nilable: true},
    created_at: {type: String, nilable: true},
    updated_at: {type: String, nilable: true},
    title: {type: String, nilable: true},
    content: {type: String, nilable: true}
  )

  def self.create_from(payload)
    self.from_json(payload.to_json)
  end

  def self.all(conn)
    self.transform_notes(conn.exec(%{
      SELECT
      id, title, content,
      to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') as created_at,
      to_char(updated_at, 'DD-MM-YYYY HH24:MI:SS') as updated_at
      FROM notes
      ORDER BY id
    }))
  end

  def insert(conn)
    conn.exec(%{
      INSERT INTO notes (title, content, created_at, updated_at)
      VALUES (
        upper(substr('#{self.title}', 1, 1)) ||
        substr('#{self.title}', 2, length('#{self.title}')),
        upper(substr('#{self.content}', 1, 1)) ||
        substr('#{self.content}', 2, length('#{self.content}')),
        current_timestamp,
        current_timestamp
      )
    })
  end

  def update(conn)
    conn.exec(%{
      UPDATE notes
      SET title      = '#{self.title}',
          content    = '#{self.content}',
          updated_at = current_timestamp
      WHERE id=#{self.id};
    })
  end

  def delete(conn)
    conn.exec(%{
      DELETE FROM notes
      WHERE id = '#{self.id}';
    })
  end

  def self.transform_notes(notes_table)
    notes_table.to_hash.map do |note|
      {
        id:         note["id"].as(Int),
        title:      note["title"].as(String),
        content:    note["content"].as(String),
        created_at: note["created_at"].as(String),
        updated_at: note["updated_at"].as(String),
      }
    end
  end
end
