Rails.application.routes.draw do

  root 'studies#index'
  resources :annotations
  resources :reviews
  resources :tags

  get '/.well-known/acme-challenge/:id' => 'pages#letsencrypt'
  get 'pages/about'
  get 'pages/contact'

  devise_for :users do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  get "/studies/search/:q", to: "studies#index"
  get "/studies/search/:q/json", to: "studies#search", as: :studies_search_json

  resources :studies do
    resources :reviews, except: [:index]
  end

end
