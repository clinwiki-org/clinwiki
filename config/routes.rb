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

  post "/studies/search/json", to: "studies#search", as: :empty_search_json
  get "/studies/search/:q", to: "studies#index"
  post "/studies/search/:q/json", to: "studies#search", as: :studies_search_json
  get "/studies/:study_id/json", to: "studies#json"
  get "/studies/:study_id/crowd", to: "studies#crowd"
  get "/studies/:study_id/administrative", to: "studies#administrative"
  get "/studies/:study_id/recruitment", to: "studies#recruitment"
  get "/studies/:study_id/descriptive", to: "studies#descriptive"
  get "/studies/:study_id/tracking", to: "studies#tracking"

  resources :studies do
    resources :reviews, except: [:index]
  end

end
