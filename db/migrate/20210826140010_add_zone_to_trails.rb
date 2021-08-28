class AddZoneToTrails < ActiveRecord::Migration[6.0]
  def change
    add_column :trails, :zone, :string
    remove_column :trails, :end_lat, :float
    remove_column :trails, :end_lng, :float
  end
end
