class AddCoordinatesToTrails < ActiveRecord::Migration[6.0]
  def change
    add_column :trails, :latitude, :float
    add_column :trails, :longitude, :float
  end
end
