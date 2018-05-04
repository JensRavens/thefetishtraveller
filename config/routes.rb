Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :events, only: [:index, :show, :update, :create] do
        resource :likes, only: [:create, :destroy]
      end
      resources :locations, only: [:index, :show, :update, :create]
      resources :likes, only: :index
      resource :session, only: [:create, :update, :show]
    end
  end

  namespace :feed do
    resources :events, only: [:index]
  end

  get 'sitemaps/*path', to: 'pages#sitemap'
  get '*path', to: 'pages#show', constraints: lambda { |req|
    req.path.exclude? 'rails/'
  }
  root 'pages#show'
end
