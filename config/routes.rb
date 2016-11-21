Rails.application.routes.draw do
  root 'studies#index'
  resources :reviews
  resources :tags

  get 'pages/about'
  get 'pages/contact'

  devise_for :users do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  resources :studies do
    collection do
      get 'search'
    end
    resources :reviews, except: [:index]
  end

end
