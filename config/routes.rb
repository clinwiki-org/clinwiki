Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"
  scope(path: '/api') do
    root 'studies#index'
    resources :annotations
    resources :tags

    get '/.well-known/acme-challenge/:id' => 'pages#letsencrypt'
    get 'pages/about'
    get 'pages/contact'

    devise_for :users, :controllers => {sessions: 'sessions',
                                        registrations: 'registrations',
                                        passwords: 'cwpasswords'},
                       :defaults => { format: 'json'} do
      get '/users/sign_out' => 'sessions#destroy'
      patch "/users/password", to: "cwpasswords#reset", defaults: { format: 'html' }
    end

    get "/user/exists", to: "application#user_exists", defaults: { format: 'json' }

    post "/studies/search/json", to: "studies#search", as: :empty_search_json
    post "/studies/json", to: "studies#index"
    get "/studies/fields", to: "studies#fields"
    post "/studies/search/:q/json", to: "studies#search", as: :studies_search_with_q_json
    post "/studies/search/json", to: "studies#search", as: :studies_search_json
    post "/studies/agg_buckets", to: "studies#agg_buckets", defaults: { format: 'json' }
    post "/studies/crowd_agg_buckets", to: "studies#crowd_agg_buckets", defaults: { format: 'json' }
    get "/studies/:study_id/json", to: "studies#json"
    get "/studies/:study_id/administrative", to: "studies#administrative"
    get "/studies/:study_id/recruitment", to: "studies#recruitment"
    get "/studies/:study_id/descriptive", to: "studies#descriptive"
    get "/studies/:study_id/tracking", to: "studies#tracking"
    get "/studies/:study_id/sites", to: "studies#sites"
    get "/studies/:study_id/wiki", to: "wiki_page#get", defaults: { format: 'json' }
    post "/studies/:study_id/wiki", to: "wiki_page#post", defaults: { format: 'json' }
    get "/studies/:study_id/wiki/history", to: "wiki_page#history", defaults: { format: 'json' }

    get "/reviews/:nct_id", to: "reviews#index", defaults: { format: 'json' }
    get "/review/:id", to: "reviews#show", defaults: { format: 'json' }
    post "/reviews/:nct_id", to: "reviews#create", defaults: { format: 'json' }
    patch "/review/:id", to: "reviews#update", defaults: { format: 'json' }
    delete "/review/:id", to: "reviews#delete", defaults: { format: 'json' }

    resources :studies do
      resources :reviews, except: [:index]
    end
  end

  match '*all', to: static("index.html"), via: [:get]

end
