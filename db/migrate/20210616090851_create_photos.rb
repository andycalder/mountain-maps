class CreatePhotos < ActiveRecord::Migration[6.0]
  def change
    create_table :photos do |t|
      t.references :user, null: false, foreign_key: true
      t.references :trail, null: false, foreign_key: true
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
