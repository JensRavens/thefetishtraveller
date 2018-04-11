Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :events, only: :index
    end
  end

  get '*path', to: 'pages#show'
end
