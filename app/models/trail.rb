class Trail < ApplicationRecord
  belongs_to :mountain
  has_many :reviews, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :difficulty, presence: true, inclusion: { in: %w(beginner intermediate advanced expert proline) }
  validates :category, presence: true, inclusion: { in: %w(freeride technical) }
  validates :zone, presence: true, inclusion: { in: ['Fitzsimmons Zone', 'Garbanzo Zone', 'Creekside Zone', 'Peak Zone'] }
  validates :start_lat, presence: true
  validates :start_lng, presence: true
end
