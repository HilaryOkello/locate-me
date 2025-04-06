class CreateLocations < ActiveRecord::Migration[8.0]
  def change
    create_table :locations do |t|
      t.string :name
      t.decimal :latitude
      t.decimal :longitude
      t.references :user
      t.timestamps
    end
  end
end
