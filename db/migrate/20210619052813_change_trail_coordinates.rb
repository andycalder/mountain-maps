class ChangeTrailCoordinates < ActiveRecord::Migration[6.0]
  def change
    rename_column :trails, :latitude, :start_lat
    rename_column :trails, :longitude, :start_lng
    add_column :trails, :end_lat, :float
    add_column :trails, :end_lng, :float
  end
end
