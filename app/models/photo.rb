class Photo < ApplicationRecord
  belongs_to :user
  belongs_to :trail
  has_one_attached :image

  validates :user, presence: true
  validates :trail, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true

  # display the published time in day
  def photo_published_time
    ammount_of_day = (Date.today - self.created_at.to_date).to_i
    if ammount_of_day < 1
      "Uploaded today"
    elsif ammount_of_day == 1
      "Uploaded #{ammount_of_day} day ago"
    else
      "Uploaded #{ammount_of_day} days ago"
    end
  end
end
