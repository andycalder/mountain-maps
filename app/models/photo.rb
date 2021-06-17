class Photo < ApplicationRecord
  belongs_to :user
  belongs_to :trail
  has_one_attached :image

  validates :user, presence: true
  validates :trail, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end
