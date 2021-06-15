class TrailsController < ApplicationController
  def index
    @trails = Trail.all
  end
end
