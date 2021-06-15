class Trail < ApplicationRecord
  belongs_to :mountain
  has_many :reviews, dependent: :destroy

  validates :name, presence: true
  validates :difficulty, presence: true, inclusion: { in: %w(beginner intermediate advanced expert proline) }
  validates :category, presence: true, inclusion: { in: %w(freeride technical) }
end
