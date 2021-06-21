class Trail < ApplicationRecord
  belongs_to :mountain
  has_many :reviews, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :difficulty, presence: true, inclusion: { in: %w(beginner intermediate advanced expert proline) }
  validates :category, presence: true, inclusion: { in: %w(freeride technical) }
  validates :start_lat, presence: true
  validates :start_lng, presence: true
  validates :end_lat, presence: true
  validates :end_lng, presence: true
end
