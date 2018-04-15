Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :events, only: [:index, :show, :update] do
        resource :likes, only: [:create, :destroy]
      end
      resources :likes, only: :index
      resources :sessions, only: [:create]
    end
  end

  get '*path', to: 'pages#show'
  root 'pages#show'
end
