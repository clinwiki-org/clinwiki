Rails.application.routes.draw do
  resources :reviews
  root 'studies#index'
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
