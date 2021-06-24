class Review < ApplicationRecord
  belongs_to :user
  belongs_to :trail

  validates :comment, presence: true

  # display the published time in day
  def review_published_time
    ammount_of_day = (Date.today - self.created_at.to_date).to_i
    if ammount_of_day < 1
      "Posted today"
    elsif ammount_of_day == 1
      "Posted #{ammount_of_day} day ago"
    else
      "Posted #{ammount_of_day} days ago"
    end
  end
end
