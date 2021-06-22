class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :reviews
  has_one_attached :photo

  validates :nickname, presence: true

  def avatar_path
    photo.attached? ? ActionController::Base.helpers.cl_image_path(photo.key, width: 400, height: 400, crop: 'fill') : ActionController::Base.helpers.image_path('empty_avatar')
  end
end
