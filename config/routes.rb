Rails.application.routes.draw do
  get 'reviews/create'
  devise_for :users
  root to: 'pages#home'

  resources :mountains, only: [:index] do
    resources :trails, only: [:index]
  end

  resources :trails, only: [:show] do
    resources :reviews, only: [:create]
  end
end
