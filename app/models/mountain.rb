class Mountain < ApplicationRecord
  has_many :trails, dependent: :destroy
end
