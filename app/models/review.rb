class Review < ApplicationRecord
  belongs_to :user
  belongs_to :trail

  validates :comment, presence: true
end
