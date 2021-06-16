class PhotosController < ApplicationController
  def show
    @photo = Photo.find(params[:id])
  end

  def new
    @photo = Photo.new
  end

  def create
    @photo = Photo.new(photo_params)
    @photo.trail = Trail.first
    @photo.user = current_user
    @photo.latitude = 50.0
    @photo.longitude = 50.0

    if @photo.save
      redirect_to photo_path(@photo)
    else
      render :new
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:image)
  end
end
