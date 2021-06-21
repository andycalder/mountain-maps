class Review < ApplicationRecord
  belongs_to :user
  belongs_to :trail
  has_one_attached :photo

  validates :comment, presence: true
end
