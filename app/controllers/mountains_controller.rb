class MountainsController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @mountains = Mountain.all
  end
end
