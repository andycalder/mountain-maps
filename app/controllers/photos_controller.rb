class PhotosController < ApplicationController
  def index
    @photos = Photo.all
    render json: @photos
  end

  def show
    @photo = Photo.find(params[:id])
  end

  def new
    @photo = Photo.new
    @photo.latitude = params[:lat].to_f
    @photo.longitude = params[:lng].to_f

    @trail_id = Trail.find_by(name: params[:name]).id
  end

  def create
    @photo = Photo.new(photo_params)
    @photo.trail = Trail.find(photo_params[:trail_id])
    @photo.user = current_user

    if @photo.save
      redirect_to photo_path(@photo)
    else
      render :new
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:trail_id, :latitude, :longitude, :image)
  end
end
