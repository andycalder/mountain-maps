class CreateTrails < ActiveRecord::Migration[6.0]
  def change
    create_table :trails do |t|
      t.references :mountain, null: false, foreign_key: true
      t.string :name
      t.string :difficulty
      t.string :category

      t.timestamps
    end
  end
end
