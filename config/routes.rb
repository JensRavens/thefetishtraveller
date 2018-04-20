Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :events, only: [:index, :show, :update, :create] do
        resource :likes, only: [:create, :destroy]
      end
      resources :locations, only: [:index, :show, :update, :create]
      resources :likes, only: :index
      resources :sessions, only: [:create]
    end
  end

  get '*path', to: 'pages#show'
  root 'pages#show'
end
