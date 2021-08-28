class TrailsController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @trails = Trail.all
    respond_to do |format|
      format.html
      format.json { render json: { trails: serialize_trails(@trails) } }
    end
  end

  def show
    @trail = Trail.find(params[:id])
    @review = Review.new
    @reviews = Review.where(trail: @trail)
  end

  private

  def serialize_trails(trails)
    trails.map do |trail|
      {
        name: trail.name,
        difficulty: trail.difficulty,
        type: trail.category,
        zone: trail.zone,
        start: [trail.start_lng, trail.start_lat]
      }
    end
  end
end
