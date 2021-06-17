Rails.application.routes.draw do
  devise_for :users
  root to: 'mountains#index'

  resources :mountains, only: [:index] do
    resources :trails, only: [:index]
  end

  resources :trails, only: [:show] do
    resources :reviews, only: [:create]
  end

  resources :photos, only: [:show, :new, :create]
end
