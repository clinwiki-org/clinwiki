class StringForTheme < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :themes, :text, default: "#{{
  primaryClinwiki: '#55B88D',
  whiteHeaderFont: '#fff',
  grayHeaderFont: '#777777',
  navBar: '#1b2a38',
  button: '#55B88D',
  buttonHover: '#e6e6e6',
  buttonBorderHover: '#adadad',
  sideBarBackground: '#333',
  sideBarColor: '#bac5d0',
  sideBarColorHover: '#fff',
  sideBarTitleFont: '#fff',
  containerColor: '#f2f2f2',
  containerText: '#000000',
  crumbColor: '#55b88d',
  crumbFontColor: '#fff',
  }.to_json} "
  end
end
