class Trail < ApplicationRecord
  belongs_to :mountain
  has_many :reviews
end
