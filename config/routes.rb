Rails.application.routes.draw do
  devise_for :users

  devise_scope :user do
     get '/users/sign_out' => 'devise/sessions#destroy'
  end

  root to: 'mountains#index'


  resources :mountains, only: [:index] do
    resources :trails, only: [:index]
  end

  resources :trails, only: [:show] do
    resources :reviews, only: [:create]
  end

  resources :photos, only: [:index, :show, :new, :create]
end
