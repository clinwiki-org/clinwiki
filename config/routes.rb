Rails.application.routes.draw do
  scope(path: '/api') do
    root 'studies#index'
    resources :annotations
    resources :reviews
    resources :tags

    get '/.well-known/acme-challenge/:id' => 'pages#letsencrypt'
    get 'pages/about'
    get 'pages/contact'

    devise_for :users, :controllers => {sessions: 'sessions', registrations: 'registrations'},
                       :defaults => { format: 'json'} do
      get '/users/sign_out' => 'sessions#destroy'
    end

    get "/user/exists", to: "application#user_exists", defaults: { format: 'json' }

    post "/studies/search/json", to: "studies#search", as: :empty_search_json
    get "/studies/search/export/:filename", to: "studies#export_search_results"
    post "/studies/json", to: "studies#index"
    post "/studies/search/:q/json", to: "studies#search", as: :studies_search_json
    post "/studies/agg_buckets", to: "studies#agg_buckets", defaults: { format: 'json' }
    get "/studies/:study_id/json", to: "studies#json"
    get "/studies/:study_id/crowd", to: "studies#crowd"
    get "/studies/:study_id/administrative", to: "studies#administrative"
    get "/studies/:study_id/recruitment", to: "studies#recruitment"
    get "/studies/:study_id/descriptive", to: "studies#descriptive"
    get "/studies/:study_id/tracking", to: "studies#tracking"
    get "/studies/:study_id/wiki", to: "wiki_page#get", defaults: { format: 'json' }
    post "/studies/:study_id/wiki", to: "wiki_page#post", defaults: { format: 'json' }
    get "/studies/:study_id/wiki/history", to: "wiki_page#history", defaults: { format: 'json' }

    resources :studies do
      resources :reviews, except: [:index]
    end
  end

  match '*all', to: static("index.html"), via: [:get]

end
