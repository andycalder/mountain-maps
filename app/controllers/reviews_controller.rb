class ReviewsController < ApplicationController
  def create
    @trail = Trail.find(params[:trail_id])
    @review = Review.new(review_params)
    @review.trail = @trail
    @review.user = current_user
    if @review.save
      redirect_to trail_path, notice: 'Your review has been added'
    else
      render 'trails/show'
    end
  end

  private

  def review_params
    params.require(:review).permit(:comment)
  end
end
