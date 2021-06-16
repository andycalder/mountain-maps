class TrailsController < ApplicationController
  def index
    @trails = Trail.all
  end

  def show
    @trail = Trail.find(params[:id])
    @review = Review.new
    @reviews = Review.where(trail: @trail)
  end
end
